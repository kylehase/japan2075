import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  GameState,
  ActiveTool,
  HeatmapOverlay,
  GameSpeed,
  Language,
  PrefecturalRegionId,
  RegionalMetricData,
  MacroEventChoice,
  GameOverReason,
  YearHistoryRecord,
  Ordinance,
  MacroEvent,
} from './types/game';
import {
  INITIAL_COHORTS,
  INITIAL_ECONOMY,
  INITIAL_ORDINANCES,
  generateAnnualAgenda,
} from './simulation/constants';
import { HISTORICAL_GOVERNMENT_DATA_2000_2024 } from './simulation/historicalData';
import { generateJapanRegionalMap } from './canvas/mapGenerator';
import { IsometricRenderer } from './canvas/renderer';
import { simulateDemographicStep } from './simulation/demographics';
import { simulateEconomyStep } from './simulation/economy';
import { checkAndTriggerMacroEvent, resetEventHistory } from './simulation/events';
import { computeRegionalMetrics } from './simulation/regionalData';
import { soundEngine } from './canvas/audio';
import { CalendarCheck, ArrowRight, Play, Bug } from 'lucide-react';
import { debugLogger, downloadDebugData } from './simulation/debugLogger';

// Components
import { TopBar } from './components/TopBar';
import { MarqueeTicker } from './components/MarqueeTicker';
import { ToolBar } from './components/ToolBar';
import { DemographicsWindow } from './components/DemographicsWindow';
import { BudgetWindow } from './components/BudgetWindow';
import { HistoryChartsModal } from './components/HistoryChartsModal';
import { TileInspectModal } from './components/TileInspectModal';
import { EventModal } from './components/EventModal';
import { GameOverModal } from './components/GameOverModal';
import { HelpModal } from './components/HelpModal';
import { TermSummaryModal } from './components/TermSummaryModal';
import { AnnualPolicyModal } from './components/AnnualPolicyModal';
import { SessionImpactModal } from './components/SessionImpactModal';
import { LandingPage } from './components/LandingPage';
import {
  SyncResult,
  DEFAULT_GOOGLE_SHEET_ID,
  syncFromGoogleSheetsUrl,
} from './simulation/sheetImporter';
import { SessionImpactSummary } from './types/game';

export const App: React.FC = () => {
  // --- Google Sheet Data State ---
  const [sheetData, setSheetData] = useState<SyncResult | null>(null);
  const sheetDataRef = useRef<SyncResult | null>(null);
  sheetDataRef.current = sheetData;

  // --- Initialize Initial Game State ---
  const initialMap = useRef(generateJapanRegionalMap(40, 40));

  const createInitialState = (): GameState => {
    const map = generateJapanRegionalMap(40, 40);
    initialMap.current = map;

    const initialDemographics = {
      totalPopulation: 124500000,
      birthsThisYear: 727000,
      deathsThisYear: 1568000,
      netMigration: 80000,
      naturalChange: -841000,
      tfr: 1.20,
      cohorts: JSON.parse(JSON.stringify(INITIAL_COHORTS)),
      elderlyRatio: 29.8,
      youthRatio: 11.5,
      workingRatio: 58.7,
      medianAge: 49.5,
      dependencyRatio: 0.70,
      youthHopeIndex: 42,
      lowFertilityTrapActive: false,
      synergyBonusActive: false,
    };

    const loadedOrdinances = (sheetDataRef.current && sheetDataRef.current.parsedOrdinances.length > 0)
      ? JSON.parse(JSON.stringify(sheetDataRef.current.parsedOrdinances))
      : JSON.parse(JSON.stringify(INITIAL_ORDINANCES));

    return {
      currentYear: 2025,
      currentMonth: 1,
      cabinetTerm: 1,
      primeMinisterName: 'T. Ishiba',
      cabinetApproval: 48.5,
      silverDemocracyIndex: 59,
      seniorTurnout: 82,
      youthTurnout: 36,
      demographics: initialDemographics,
      economy: { ...INITIAL_ECONOMY },
      ordinances: loadedOrdinances,
      availableOrdinanceIds: generateAnnualAgenda(loadedOrdinances, 2025, {
        debtToGDP: INITIAL_ECONOMY.debtToGDP,
        cabinetApproval: 48.5,
        youthHopeIndex: initialDemographics.youthHopeIndex,
        tfr: initialDemographics.tfr
      }),
      map,
      activeEvent: null,
      gameOverReason: null,
      gameSpeed: 1,
      soundEnabled: true,
      language: 'en',
      history: [
        ...HISTORICAL_GOVERNMENT_DATA_2000_2024,
        {
          year: 2025,
          population: initialDemographics.totalPopulation,
          tfr: initialDemographics.tfr,
          gdp: INITIAL_ECONOMY.gdp,
          debtToGDP: INITIAL_ECONOMY.debtToGDP,
          cabinetApproval: 48.5,
          youthHopeIndex: initialDemographics.youthHopeIndex,
          elderlyRatio: initialDemographics.elderlyRatio,
          births: initialDemographics.birthsThisYear,
          deaths: initialDemographics.deathsThisYear,
          jgbYield: INITIAL_ECONOMY.jgbYield,
          policyEvents: []
        }
      ],
    };
  };

  const [gameState, setGameState] = useState<GameState>(createInitialState);
  const gameStateRef = useRef<GameState>(gameState);
  gameStateRef.current = gameState;

  // --- Auto-Sync Default Google Sheet on App Startup ---
  useEffect(() => {
    let isMounted = true;
    async function loadGoogleSheetOnStartup() {
      try {
        const result = await syncFromGoogleSheetsUrl(DEFAULT_GOOGLE_SHEET_ID);
        if (isMounted) {
          setSheetData(result);
          sheetDataRef.current = result;
          // When sheet data loads (or fallback defaults are computed), populate 2025 game state
          setGameState((prev) => {
            if (prev.currentYear === 2025 && prev.cabinetTerm === 1) {
              const freshOrdinances = JSON.parse(JSON.stringify(result.parsedOrdinances));
              return {
                ...prev,
                ordinances: freshOrdinances,
                availableOrdinanceIds: generateAnnualAgenda(freshOrdinances, 2025, {
                  debtToGDP: prev.economy.debtToGDP,
                  cabinetApproval: prev.cabinetApproval,
                  youthHopeIndex: prev.demographics.youthHopeIndex,
                  tfr: prev.demographics.tfr,
                }),
              };
            }
            return prev;
          });
        }
      } catch (err) {
        console.warn('Startup Google Sheet sync skipped, using built-in defaults:', err);
      }
    }
    loadGoogleSheetOnStartup();
    return () => {
      isMounted = false;
    };
  }, []);

  // Tool & UI View States
  const [activeTool, setActiveTool] = useState<ActiveTool>('inspect');
  const [activeOverlay, setActiveOverlay] = useState<HeatmapOverlay>('normal');
  const [inspectedRegion, setInspectedRegion] = useState<RegionalMetricData | null>(null);

  // Modal Open States
  const [isLandingOpen, setIsLandingOpen] = useState(true);
  const [isDemographicsOpen, setIsDemographicsOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isTermSummaryOpen, setIsTermSummaryOpen] = useState(false);
  const [isAnnualPolicyOpen, setIsAnnualPolicyOpen] = useState(false);
  const [isSessionImpactOpen, setIsSessionImpactOpen] = useState(false);
  const [sessionImpactSummary, setSessionImpactSummary] = useState<SessionImpactSummary | null>(null);
  const [currentYearEventResolution, setCurrentYearEventResolution] = useState<{
    event: MacroEvent;
    choice: MacroEventChoice;
  } | null>(null);
  const [hasLegislatedThisYear, setHasLegislatedThisYear] = useState(false);
  const [debugDownloaded, setDebugDownloaded] = useState(false);

  // Trigger debug data download
  const handleDownloadDebug = () => {
    soundEngine.playClick();
    downloadDebugData(gameState);
    setDebugDownloaded(true);
    setTimeout(() => setDebugDownloaded(false), 2500);
  };

  // Canvas & Renderer Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<IsometricRenderer | null>(null);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const hoveredTileRef = useRef<{ x: number; y: number } | null>(null);

  // --- Initialize Isometric Renderer ---
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderer = new IsometricRenderer(ctx);
    rendererRef.current = renderer;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        renderer.resize(parent.clientWidth, parent.clientHeight);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Initial baseline logging for starting year 2025
  useEffect(() => {
    debugLogger.logYearMetrics(
      2025,
      gameState.demographics,
      gameState.economy,
      gameState.cabinetApproval,
      gameState.silverDemocracyIndex,
      gameState.ordinances.filter((o) => o.active).map((o) => o.id)
    );
  }, []);

  // --- Annual Simulation Tick Function (Triggered by user on demand) ---
  const advanceAnnualTick = useCallback(() => {
    setCurrentYearEventResolution(null);
    setGameState((prevState) => {
      if (
        prevState.gameOverReason ||
        prevState.activeEvent ||
        isTermSummaryOpen ||
        isAnnualPolicyOpen ||
        isSessionImpactOpen
      ) {
        return prevState;
      }

      const nextYear = prevState.currentYear + 1;
      const nextTerm = prevState.cabinetTerm + 1;
      debugLogger.setSimulatingYear(nextYear);

      // Filter only active ordinances for the simulation step
      const activeOrdinances = prevState.ordinances.filter((o) => o.active);

      // 1. Simulate Demographics (active ordinances only)
      const nextDemographics = simulateDemographicStep(
        prevState.demographics,
        activeOrdinances,
        prevState.map
      );

      // 2. Simulate Economy (active ordinances only, passing nextYear, regional map, and approval)
      const nextEconomy = simulateEconomyStep(
        prevState.economy,
        nextDemographics,
        activeOrdinances,
        prevState.map,
        nextYear,
        prevState.cabinetApproval
      );

      // 4. Update Cabinet Approval & Silver Democracy index
      const seniorApproval = prevState.ordinances.reduce(
        (acc, o) => (o.active ? acc + o.seniorApprovalDelta : acc),
        55
      );
      const youthApproval = prevState.ordinances.reduce(
        (acc, o) => (o.active ? acc + o.youthApprovalDelta : acc),
        45
      );

      const seniorShare = nextDemographics.elderlyRatio / 100;
      const seniorVoters = seniorShare * 0.82;
      const youthVoters = (1 - seniorShare) * 0.38;
      const totalVoters = seniorVoters + youthVoters;

      const silverIndex = Math.round((seniorVoters / totalVoters) * 100);
      const netApproval = Math.max(
        10,
        Math.min(95, ((seniorVoters * seniorApproval + youthVoters * youthApproval) / totalVoters) + (prevState.eventApprovalModifier || 0))
      );

      // 5. Check for Game Over Conditions
      let gameOverReason: GameOverReason | null = null;
      if (nextYear >= 2075) {
        gameOverReason = 'victory_2075';
        soundEngine.playVictory();
      } else if (nextEconomy.debtToGDP >= 350 && nextEconomy.annualDeficit > 25000) {
        gameOverReason = 'fiscal_collapse';
        soundEngine.playSiren();
      } else if (netApproval < 15) {
        gameOverReason = 'no_confidence_vote';
        soundEngine.playSiren();
      } else if (nextDemographics.tfr <= 0.70) {
        gameOverReason = 'demographic_freefall';
        soundEngine.playSiren();
      } else if (nextDemographics.workingRatio < 48.0) {
        gameOverReason = 'workforce_collapse';
        soundEngine.playSiren();
      }

      // 6. Check for Stochastic Macro Shock Event
      const stateForEvent: GameState = {
        ...prevState,
        currentYear: nextYear,
        cabinetTerm: nextTerm,
        demographics: nextDemographics,
        economy: nextEconomy,
        cabinetApproval: netApproval,
        silverDemocracyIndex: silverIndex,
        gameOverReason,
      };
      const possibleEvent = checkAndTriggerMacroEvent(stateForEvent, sheetData?.parsedEvents);
      if (possibleEvent && !gameOverReason) {
        soundEngine.playSiren();
      }

      // 7. Annual 1-Year Cabinet Term Summary & Election Mandate
      if (nextYear < 2075 && !gameOverReason) {
        setIsTermSummaryOpen(true);
      }

      // Track history
      const prevHistory = prevState.history || [];
      const historyRecord: YearHistoryRecord = {
        year: prevState.currentYear,
        population: prevState.demographics.totalPopulation,
        tfr: prevState.demographics.tfr,
        gdp: prevState.economy.gdp,
        debtToGDP: prevState.economy.debtToGDP,
        cabinetApproval: prevState.cabinetApproval,
        youthHopeIndex: prevState.demographics.youthHopeIndex,
        elderlyRatio: prevState.demographics.elderlyRatio,
        births: prevState.demographics.birthsThisYear,
        deaths: prevState.demographics.deathsThisYear < 10000 ? prevState.demographics.deathsThisYear * 1000 : prevState.demographics.deathsThisYear,
        jgbYield: prevState.economy.jgbYield,
        policyEvents: prevState.history?.[prevHistory.length - 1]?.policyEvents || [] // This year's policy events are saved to the PREVIOUS record during enact. We should just append here.
      };
      
      // Wait, policy events are logged when they are enacted in handleEnactTermPolicies. 
      // If we just create a new record for `nextYear`, we should initialize it.
      const newHistoryRecordForNextYear: YearHistoryRecord = {
         year: nextYear,
         population: nextDemographics.totalPopulation,
         tfr: nextDemographics.tfr,
         gdp: nextEconomy.gdp,
         debtToGDP: nextEconomy.debtToGDP,
         cabinetApproval: netApproval,
         youthHopeIndex: nextDemographics.youthHopeIndex,
         elderlyRatio: nextDemographics.elderlyRatio,
         births: nextDemographics.birthsThisYear,
         deaths: nextDemographics.deathsThisYear < 10000 ? nextDemographics.deathsThisYear * 1000 : nextDemographics.deathsThisYear,
         jgbYield: nextEconomy.jgbYield,
         policyEvents: []
      };

      // 8. Trigger Next Annual Policy Sequence
      const updatedState: GameState = {
        ...stateForEvent,
        activeEvent: possibleEvent,
        availableOrdinanceIds: generateAnnualAgenda(prevState.ordinances, nextYear, {
          debtToGDP: nextEconomy.debtToGDP,
          cabinetApproval: netApproval,
          youthHopeIndex: nextDemographics.youthHopeIndex,
          tfr: nextDemographics.tfr
        }),
        history: [...prevHistory, newHistoryRecordForNextYear],
      };

      // Log resulting metrics to debugLogger for troubleshooting
      const activeOrdIds = (stateForEvent.ordinances || prevState.ordinances)
        .filter((o) => o.active)
        .map((o) => o.id);
      debugLogger.logYearMetrics(
        nextYear,
        nextDemographics,
        nextEconomy,
        netApproval,
        silverIndex,
        activeOrdIds
      );

      soundEngine.playTick();
      
      setHasLegislatedThisYear(false);

      return updatedState;
    });
  }, [isTermSummaryOpen, isAnnualPolicyOpen, isSessionImpactOpen]);

  // --- Animation Loop (60 FPS decoupled) ---
  useEffect(() => {
    let animationFrameId: number;

    const gameLoop = () => {
      // Render 2.5D Canvas Data Landscape
      if (rendererRef.current && canvasRef.current) {
        rendererRef.current.render(
          gameStateRef.current,
          activeOverlay,
          hoveredTileRef.current,
          activeTool
        );
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [activeOverlay, activeTool]);

  // --- Mouse & Touch Interactions on Canvas ---
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!rendererRef.current) return;

    if (isDraggingRef.current) {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      rendererRef.current.pan(dx, dy);
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      e.currentTarget.style.cursor = 'grabbing';
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const regions = computeRegionalMetrics(gameStateRef.current);
      const hitRegion = rendererRef.current.getRegionAtScreenPos(mouseX, mouseY, regions);
      
      rendererRef.current.hoveredRegionId = hitRegion ? hitRegion.id : null;
      if (hitRegion) {
        hoveredTileRef.current = { x: hitRegion.gridX, y: hitRegion.gridY };
        e.currentTarget.style.cursor = 'pointer';
      } else {
        hoveredTileRef.current = null;
        e.currentTarget.style.cursor = 'grab';
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!rendererRef.current) return;
    const wasDragging =
      Math.abs(e.clientX - lastMousePosRef.current.x) > 4 ||
      Math.abs(e.clientY - lastMousePosRef.current.y) > 4;

    isDraggingRef.current = false;

    if (!wasDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const regions = computeRegionalMetrics(gameStateRef.current);
      const clickedRegion = rendererRef.current.getRegionAtScreenPos(mouseX, mouseY, regions);
      if (clickedRegion) {
        soundEngine.playClick();
        setInspectedRegion(clickedRegion);
        rendererRef.current.selectedRegionId = clickedRegion.id;
      }
    }
  };

  // Touch Support for Mobile / Tablet Devices
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!rendererRef.current || !isDraggingRef.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - lastMousePosRef.current.x;
    const dy = e.touches[0].clientY - lastMousePosRef.current.y;
    rendererRef.current.pan(dx, dy);
    lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!rendererRef.current) return;
    const wasDragging =
      Math.abs(lastMousePosRef.current.x - (e.changedTouches[0]?.clientX ?? lastMousePosRef.current.x)) > 6 ||
      Math.abs(lastMousePosRef.current.y - (e.changedTouches[0]?.clientY ?? lastMousePosRef.current.y)) > 6;

    isDraggingRef.current = false;

    if (!wasDragging && e.changedTouches[0]) {
      const rect = e.currentTarget.getBoundingClientRect();
      const touchX = e.changedTouches[0].clientX - rect.left;
      const touchY = e.changedTouches[0].clientY - rect.top;
      const regions = computeRegionalMetrics(gameStateRef.current);
      const clickedRegion = rendererRef.current.getRegionAtScreenPos(touchX, touchY, regions);
      if (clickedRegion) {
        soundEngine.playClick();
        setInspectedRegion(clickedRegion);
        rendererRef.current.selectedRegionId = clickedRegion.id;
      }
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!rendererRef.current) return;
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    rendererRef.current.zoomAt(zoomFactor, e.clientX, e.clientY);
  };

  // --- Handler to select region directly from Toolbar ---
  const handleSelectRegion = (regionId: PrefecturalRegionId) => {
    const regions = computeRegionalMetrics(gameStateRef.current);
    const found = regions.find((r) => r.id === regionId);
    if (found) {
      setInspectedRegion(found);
      if (rendererRef.current) {
        rendererRef.current.selectedRegionId = found.id;
      }
    }
  };

  // --- Policy Enactment from AnnualPolicyModal ---
  const handleEnactTermPolicies = (
    enactedIds: string[],
    repealedIds: string[],
    categoryChoices?: Record<string, string>
  ) => {
    soundEngine.playOrdinance();
    setGameState((prev) => {
      let approvalShock = 0;
      let hopeShock = 0;
      
      const enactedObjs = prev.ordinances.filter((o) => enactedIds.includes(o.id));
      const repealedObjs = prev.ordinances.filter((o) => repealedIds.includes(o.id));
      debugLogger.logLegislativeAction(
        prev.currentYear,
        enactedObjs,
        repealedObjs,
        categoryChoices || {}
      );
      
      const newPolicyEvents: { name: { en: string; ja: string }, type: 'enacted' | 'expired' | 'repealed' }[] = [];
      
      // Compute replacements first
      const allReplacedIds = new Set<string>();
      enactedIds.forEach(id => {
         const ord = prev.ordinances.find(o => o.id === id);
         if (ord?.replaces) {
             ord.replaces.forEach(r => allReplacedIds.add(r));
         }
      });

      const updatedOrds = prev.ordinances.map((o) => {
        const isEnacted = enactedIds.includes(o.id);
        const isExplicitlyRepealed = repealedIds.includes(o.id) || allReplacedIds.has(o.id);
        const wasActive = o.active;

        if (isEnacted) {
          if (!wasActive) {
            // newly enacted
            newPolicyEvents.push({ name: o.name, type: 'enacted' });
          }
          return { ...o, active: true, enactedYear: prev.currentYear };
        }

        if (wasActive && isExplicitlyRepealed) {
          // explicitly repealed or replaced
          newPolicyEvents.push({ name: o.name, type: 'repealed' });
          if (o.expirationShock) {
             approvalShock += o.expirationShock.approvalDelta || 0;
             hopeShock += o.expirationShock.hopeDelta || 0;
             if (approvalShock !== 0 || hopeShock !== 0) {
               soundEngine.playSiren();
             }
          }
          return { ...o, active: false, enactedYear: undefined };
        }

        // Check for natural expiration of active policies that weren't just enacted/renewed
        if (wasActive && o.duration && o.enactedYear && prev.currentYear >= o.enactedYear + o.duration) {
          newPolicyEvents.push({ name: o.name, type: 'expired' });
          if (o.expirationShock) {
             approvalShock += o.expirationShock.approvalDelta || 0;
             hopeShock += o.expirationShock.hopeDelta || 0;
             if (approvalShock !== 0 || hopeShock !== 0) {
               soundEngine.playSiren();
             }
          }
          return { ...o, active: false, enactedYear: undefined };
        }

        return o;
      });

      // Update current year's history with policy events
      const updatedHistory = [...(prev.history || [])];
      if (updatedHistory.length > 0 && newPolicyEvents.length > 0) {
        const lastIndex = updatedHistory.length - 1;
        updatedHistory[lastIndex] = {
          ...updatedHistory[lastIndex],
          policyEvents: [...(updatedHistory[lastIndex].policyEvents || []), ...newPolicyEvents]
        };
      }

      // Calculate exact projected demographics using simulation engine
      const regionalMap = prev.map ? prev.map.flat() : [];
      const projectedDemographics = simulateDemographicStep(
        prev.demographics,
        updatedOrds.filter((o) => o.active),
        regionalMap,
        prev.regionalData
      );

      const prevTFR = prev.demographics.tfr;
      const nextTFR = projectedDemographics.tfr;
      const tfrDelta = Math.round((nextTFR - prevTFR) * 100) / 100;

      const prevHope = prev.demographics.youthHopeIndex;
      const nextHope = projectedDemographics.youthHopeIndex;
      const hopeDelta = Math.round((nextHope - prevHope) * 10) / 10;

      const prevProd = Math.round(((prev.economy.laborProductivity || 1.0) * 100) * 10) / 10;
      const prodDelta =
        Math.round(
          (enactedObjs.reduce((acc, o) => acc + (o.productivityDelta || 0), 0) -
            repealedObjs.reduce((acc, o) => acc + (o.productivityDelta || 0), 0) +
            (currentYearEventResolution?.choice.productivityDelta || 0)) *
            100 *
            10
        ) / 10;
      const nextProd = Math.max(30, Math.min(250, Math.round((prevProd + prodDelta) * 10) / 10));

      const seniorApprovalDelta =
        enactedObjs.reduce((acc, o) => acc + o.seniorApprovalDelta, 0) -
        repealedObjs.reduce((acc, o) => acc + o.seniorApprovalDelta, 0) +
        (currentYearEventResolution?.choice.approvalDelta || 0);
      const youthApprovalDelta =
        enactedObjs.reduce((acc, o) => acc + o.youthApprovalDelta, 0) -
        repealedObjs.reduce((acc, o) => acc + o.youthApprovalDelta, 0) +
        (currentYearEventResolution?.choice.approvalDelta || 0);

      const elderWeight = (prev.demographics.elderlyRatio / 100) * 0.82;
      const youthWeight = (1 - prev.demographics.elderlyRatio / 100) * 0.38;
      const totalWeight = elderWeight + youthWeight || 1;
      const cabinetApprovalDelta =
        Math.round(
          (((elderWeight * seniorApprovalDelta + youthWeight * youthApprovalDelta) / totalWeight +
            approvalShock) *
            10)
        ) / 10;

      const prevCabinetApproval = prev.cabinetApproval;
      const nextCabinetApproval = Math.max(5, Math.min(95, Math.round((prevCabinetApproval + cabinetApprovalDelta) * 10) / 10));

      const prevSeniorApproval = prev.seniorTurnout ? 50 : 50; // baseline 50 if untracked
      const nextSeniorApproval = Math.max(5, Math.min(95, prevSeniorApproval + seniorApprovalDelta));

      const prevYouthApproval = 50;
      const nextYouthApproval = Math.max(5, Math.min(95, prevYouthApproval + youthApprovalDelta));

      const prevFiscalCost = prev.ordinances.filter((o) => o.active).reduce((acc, o) => acc + o.annualCostBillion, 0);
      const costDelta =
        enactedObjs.reduce((acc, o) => acc + o.annualCostBillion, 0) -
        repealedObjs.reduce((acc, o) => acc + o.annualCostBillion, 0) +
        (currentYearEventResolution?.choice.costBillion || currentYearEventResolution?.choice.debtDelta || 0);
      const nextFiscalCost = Math.max(0, prevFiscalCost + costDelta);

      const summary: SessionImpactSummary = {
        year: prev.currentYear,
        cabinetTerm: prev.cabinetTerm,
        metrics: {
          tfr: { prev: prevTFR, next: nextTFR, delta: tfrDelta },
          hopeIndex: { prev: prevHope, next: nextHope, delta: hopeDelta },
          productivity: { prev: prevProd, next: nextProd, delta: prodDelta },
          cabinetApproval: { prev: prevCabinetApproval, next: nextCabinetApproval, delta: cabinetApprovalDelta },
          seniorApproval: { prev: prevSeniorApproval, next: nextSeniorApproval, delta: seniorApprovalDelta },
          youthApproval: { prev: prevYouthApproval, next: nextYouthApproval, delta: youthApprovalDelta },
          fiscalCost: { prev: prevFiscalCost, next: nextFiscalCost, delta: costDelta },
        },
        activePoliciesCount: updatedOrds.filter((o) => o.active).length,
      };

      setSessionImpactSummary(summary);
      setIsSessionImpactOpen(true);

      return {
        ...prev,
        ordinances: updatedOrds,
        history: updatedHistory,
        eventApprovalModifier: Math.round(((prev.eventApprovalModifier || 0) + approvalShock) * 10) / 10,
        cabinetApproval: nextCabinetApproval,
        demographics: {
          ...prev.demographics,
          tfr: nextTFR,
          youthHopeIndex: nextHope,
          eventHopeModifier: Math.round(((prev.demographics.eventHopeModifier || 0) + hopeShock) * 10) / 10,
        }
      };
    });
    setIsAnnualPolicyOpen(false);
  };

  // --- Event Choice Handler ---
  const handleEventChoice = (choice: MacroEventChoice) => {
    soundEngine.playClick();
    setGameState((prev) => {
      if (prev.activeEvent) {
        debugLogger.logEventChoice(prev.currentYear, prev.activeEvent, choice);
        setCurrentYearEventResolution({
          event: prev.activeEvent,
          choice,
        });
      }

      let nextTFR = prev.demographics.tfr + (choice.tfrDelta || 0);
      let nextHope = prev.demographics.youthHopeIndex + (choice.hopeDelta || 0);
      let nextDebt = prev.economy.nationalDebt + (choice.costBillion ? choice.costBillion / 1000 : (choice.debtDelta ? choice.debtDelta / 1000 : 0));
      let nextApproval = prev.cabinetApproval + (choice.approvalDelta || 0);

      return {
        ...prev,
        activeEvent: null,
        eventApprovalModifier: Math.round(((prev.eventApprovalModifier || 0) + (choice.approvalDelta || 0)) * 10) / 10,
        demographics: {
          ...prev.demographics,
          tfr: Math.max(0.7, Math.min(2.5, Math.round(nextTFR * 100) / 100)),
          youthHopeIndex: Math.max(5, Math.min(100, Math.round(nextHope * 10) / 10)),
          eventTFRModifier: Math.round(((prev.demographics.eventTFRModifier || 0) + (choice.tfrDelta || 0)) * 100) / 100,
          eventHopeModifier: Math.round(((prev.demographics.eventHopeModifier || 0) + (choice.hopeDelta || 0)) * 10) / 10,
        },
        economy: {
          ...prev.economy,
          nationalDebt: Math.max(100, Math.round(nextDebt * 10) / 10),
          laborProductivity: Math.round((prev.economy.laborProductivity + (choice.productivityDelta || 0)) * 100) / 100,
          eventProductivityModifier: Math.round(((prev.economy.eventProductivityModifier || 0) + (choice.productivityDelta || 0)) * 100) / 100,
        },
        cabinetApproval: Math.max(5, Math.min(95, Math.round(nextApproval * 10) / 10)),
      };
    });
  };

  // --- Restart Game Handler ---
  const handleRestart = () => {
    soundEngine.playClick();
    debugLogger.reset();
    resetEventHistory();
    const fresh = createInitialState();
    debugLogger.logYearMetrics(
      2025,
      fresh.demographics,
      fresh.economy,
      fresh.cabinetApproval,
      fresh.silverDemocracyIndex,
      fresh.ordinances.filter((o) => o.active).map((o) => o.id)
    );
    setGameState(fresh);
    setInspectedRegion(null);
    setIsLandingOpen(false);
    setHasLegislatedThisYear(false);
    setCurrentYearEventResolution(null);
    setSessionImpactSummary(null);
    setIsSessionImpactOpen(false);
    if (rendererRef.current) {
      rendererRef.current.resetCamera();
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 flex flex-col font-mono-tech select-none">
      {/* 1. Top HUD Bar */}
      <TopBar
        gameState={gameState}
        sheetData={sheetData}
        onToggleSound={() => {
          const next = !gameState.soundEnabled;
          soundEngine.setEnabled(next);
          setGameState((p) => ({ ...p, soundEnabled: next }));
        }}
        onToggleLanguage={() => {
          soundEngine.playClick();
          setGameState((p) => ({ ...p, language: p.language === 'en' ? 'ja' : 'en' }));
        }}
        onOpenDemographics={() => setIsDemographicsOpen(true)}
        onOpenBudget={() => setIsBudgetOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* 2. Scrolling Marquee News Ticker */}
      <MarqueeTicker gameState={gameState} language={gameState.language} />

      {/* 3. Main 2.5D Isometric Canvas Workspace */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-[#060a12] cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          className="w-full h-full block touch-none"
        />

        {/* 4. Left Toolbar & Region Telemetry Palette */}
        <ToolBar
          activeTool={activeTool}
          onSelectTool={setActiveTool}
          activeOverlay={activeOverlay}
          onSelectOverlay={setActiveOverlay}
          onZoomIn={() => rendererRef.current?.zoomAt(1.2, window.innerWidth / 2, window.innerHeight / 2)}
          onZoomOut={() => rendererRef.current?.zoomAt(0.83, window.innerWidth / 2, window.innerHeight / 2)}
          onResetCamera={() => rendererRef.current?.resetCamera()}
          onSelectRegion={handleSelectRegion}
          selectedRegionId={inspectedRegion?.id}
          language={gameState.language}
        />

        {/* 5. Region / Demographic Node Inspector Window */}
        <TileInspectModal
          region={inspectedRegion}
          language={gameState.language}
          onClose={() => setInspectedRegion(null)}
        />

        {/* 6. Prominent Floating Button to Start Next Administrative Session */}
        {!isLandingOpen && !isAnnualPolicyOpen && !isTermSummaryOpen && !isSessionImpactOpen && !gameState.gameOverReason && !gameState.activeEvent && (
          <div className="absolute bottom-6 right-6 z-30 flex flex-col items-end gap-2 pointer-events-auto">
            {!hasLegislatedThisYear ? (
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setIsAnnualPolicyOpen(true);
                }}
                className="group px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-white font-bold shadow-2xl border-2 border-amber-300/80 hover:border-amber-200 flex items-center gap-3 cursor-pointer transition-all transform hover:scale-[1.03] active:scale-[0.98] ring-4 ring-amber-500/30 animate-pulse"
              >
                <div className="p-2 rounded-xl bg-amber-950/50 text-white border border-amber-300/50 shadow-inner">
                  <CalendarCheck size={20} />
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-amber-100 uppercase tracking-widest font-mono-tech flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                    <span>{gameState.language === 'en' ? 'PENDING LEGISLATION' : '法案審議待ち'}</span>
                  </div>
                  <div className="text-sm font-digital font-bold text-white flex items-center gap-2">
                    <span>
                      {gameState.language === 'en'
                        ? `Convene Diet (Year ${gameState.currentYear})`
                        : `国会開会（西暦${gameState.currentYear}年）`}
                    </span>
                    <ArrowRight size={16} className="text-amber-100 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={() => {
                  soundEngine.playClick();
                  advanceAnnualTick();
                }}
                className="group px-5 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-500 hover:to-blue-500 text-white font-bold shadow-2xl border-2 border-indigo-400/80 hover:border-indigo-300 flex items-center gap-3 cursor-pointer transition-all transform hover:scale-[1.03] active:scale-[0.98] ring-4 ring-indigo-500/30"
              >
                <div className="p-2 rounded-xl bg-indigo-950/80 text-amber-300 border border-indigo-400/50 shadow-inner group-hover:rotate-12 transition-transform">
                  <CalendarCheck size={20} />
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-amber-300 uppercase tracking-widest font-mono-tech flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>{gameState.language === 'en' ? 'READY FOR NEXT MANDATE' : '次期行政準備完了'}</span>
                  </div>
                  <div className="text-sm font-digital font-bold text-white flex items-center gap-2">
                    <span>
                      {gameState.language === 'en'
                        ? `Start Next Administrative Session (Year ${gameState.currentYear + 1})`
                        : `次年度の施政を開始（西暦${gameState.currentYear + 1}年）`}
                    </span>
                    <ArrowRight size={16} className="text-amber-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            )}
            <div className="text-[11px] text-slate-400 bg-slate-900/90 px-3 py-1 rounded-lg border border-slate-800 shadow-md">
              {!hasLegislatedThisYear
                ? (gameState.language === 'en' ? 'Select policies before advancing' : '年次進行の前に法案を選択してください')
                : (gameState.language === 'en' ? 'Advance 1 Year • Compute National Cohorts & Open Diet' : '1年間進行 • 人口動態・財政推計と閣議開会')}
            </div>
          </div>
        )}

        {/* 7. Tiny Debug Download Button with Gray Bug Icon (Bottom Left) */}
        <div className="absolute bottom-3 left-3 z-30 pointer-events-auto flex items-center">
          <button
            id="btn-download-debug-json"
            onClick={handleDownloadDebug}
            title={
              gameState.language === 'en'
                ? 'Download Simulation Debug Report (JSON)'
                : 'シミュレーションデバッグデータ出力（JSON）'
            }
            className="p-1.5 rounded-lg bg-slate-900/85 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-500 text-slate-400 hover:text-slate-200 transition-all shadow-md backdrop-blur-sm cursor-pointer flex items-center justify-center group active:scale-95"
            aria-label="Download Debug Report"
          >
            <Bug
              size={14}
              className={debugDownloaded ? 'text-emerald-400 animate-pulse' : 'text-slate-400 group-hover:text-slate-200'}
            />
          </button>
        </div>
      </div>

      {/* --- ALL MODALS & DIALOGS --- */}

      {/* Annual Cabinet Policy Selection Modal */}
      {isAnnualPolicyOpen && (
        <AnnualPolicyModal
          gameState={gameState}
          language={gameState.language}
          onEnactPolicies={handleEnactTermPolicies}
          onClose={() => setIsAnnualPolicyOpen(false)}
        />
      )}

      {/* Cumulative Policy & Event Impact Summary Modal */}
      {isSessionImpactOpen && sessionImpactSummary && (
        <SessionImpactModal
          summary={sessionImpactSummary}
          language={gameState.language}
          onClose={() => {
            soundEngine.playClick();
            setIsSessionImpactOpen(false);
            setHasLegislatedThisYear(true);
          }}
        />
      )}

      {/* Demographics & Population Pyramid Modal */}
      {isDemographicsOpen && (
        <DemographicsWindow
          demographics={gameState.demographics}
          currentYear={gameState.currentYear}
          language={gameState.language}
          onClose={() => setIsDemographicsOpen(false)}
        />
      )}

      {/* Budget & MOF White Paper Modal */}
      {isBudgetOpen && (
        <BudgetWindow
          economy={gameState.economy}
          currentYear={gameState.currentYear}
          language={gameState.language}
          onClose={() => setIsBudgetOpen(false)}
        />
      )}

      {/* History Line Charts Modal */}
      {isHistoryOpen && (
        <HistoryChartsModal
          gameState={gameState}
          language={gameState.language}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}

      {/* 1-Year Cabinet Term Report Modal */}
      {isTermSummaryOpen && (
        <TermSummaryModal
          gameState={gameState}
          language={gameState.language}
          onContinue={() => {
            setIsTermSummaryOpen(false);
            setIsAnnualPolicyOpen(true);
          }}
        />
      )}

      {/* Help / Prime Minister Briefing Modal */}
      {isHelpOpen && (
        <HelpModal
          language={gameState.language}
          onClose={() => setIsHelpOpen(false)}
        />
      )}

      {/* Macro Shock Event Modal */}
      {gameState.activeEvent && (
        <EventModal
          event={gameState.activeEvent}
          language={gameState.language}
          onSelectChoice={handleEventChoice}
        />
      )}

      {/* Game Over / Victory Modal */}
      {gameState.gameOverReason && (
        <GameOverModal
          reason={gameState.gameOverReason}
          gameState={gameState}
          language={gameState.language}
          onRestart={handleRestart}
        />
      )}

      {/* Initial Landing Page & Demographic Crisis Overview */}
      {isLandingOpen && (
        <LandingPage
          language={gameState.language}
          sheetData={sheetData}
          onToggleLanguage={() => {
            soundEngine.playClick();
            setGameState((p) => ({ ...p, language: p.language === 'en' ? 'ja' : 'en' }));
          }}
          onStartGame={() => {
            soundEngine.playClick();
            setIsLandingOpen(false);
          }}
        />
      )}
    </div>
  );
};
export default App;
