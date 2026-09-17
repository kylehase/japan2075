export type Language = 'en' | 'ja';

export interface AgendaContext {
  debtToGDP: number;
  cabinetApproval: number;
  youthHopeIndex: number;
  tfr: number;
}

export type RegionType = 'tokyo' | 'regional' | 'rural';

export type BiomeType = 'water' | 'flat' | 'hill' | 'mountain';

export type BaseTileType =
  | 'water'
  | 'paddy'
  | 'forest'
  | 'mountain_rock'
  | 'residential_high'
  | 'residential_mid'
  | 'residential_suburb'
  | 'rural_village'
  | 'commercial_high'
  | 'commercial_local'
  | 'road'
  | 'railway';

export type PlacedBuildingType =
  | 'kodomoen'            // 認定こども園 (Daycare & Nursery)
  | 'geriatric_care'      // 地域包括ケア拠点 (Geriatric Care Hub)
  | 'satellite_office'    // 地方サテライトオフィス (Remote Work Hub)
  | 'agri_robotics'       // スマート農業・物流自動化拠点 (Agri-Robotics Hub)
  | 'shinkansen_station'  // 新幹線・広域高速鉄道駅 (High-Speed Rail Station)
  | 'maternity_park';     // 子育て・緑地ふれあい広場 (Green Maternity Plaza)

export interface BuildingConfig {
  type: PlacedBuildingType;
  name: { en: string; ja: string };
  cost: number;          // Billion Yen (¥B)
  maintenance: number;   // Billion Yen/year (¥B/yr)
  radius: number;        // Radius in tiles
  description: { en: string; ja: string };
  impactDescription: { en: string; ja: string };
  allowedRegions: RegionType[];
  icon: string;
}

export interface TileData {
  x: number;
  y: number;
  region: RegionType;
  biome: BiomeType;
  baseType: BaseTileType;
  building: PlacedBuildingType | null;
  buildingYear?: number;
  
  // Dynamic visual / physical states
  isAkiya: boolean;             // Abandoned empty house
  isShuttered: boolean;         // Shuttered commercial shop (シャッター街)
  hasDroneService: boolean;     // Active autonomous logistics
  hasInternationalFlag: boolean;// International diversity
  
  // Local micro metrics
  population: number;
  elderlyRatio: number;
  waitlistChildren: number;
  localTFR: number;
  productivityOutput: number;
  landValue: number;
}

export interface AgeCohort {
  ageLabel: string;
  minAge: number;
  maxAge: number;
  male: number;       // In thousands
  female: number;     // In thousands
}

export interface RegionalDemographics {
  region: RegionType;
  name: { en: string; ja: string };
  totalPopulation: number;
  elderlyCount: number;
  youthCount: number;
  workingCount: number;
  tfr: number;
  akiyaCount: number;
  waitlistChildren: number;
  housingAffordability: number; // 0-100 (higher is more affordable)
  workOvertimeHours: number;    // hours/month
  averageWage: number;          // Million Yen / yr
  satisfaction: number;         // 0-100
}

export interface NationalDemographics {
  cohorts: AgeCohort[];
  totalPopulation: number;
  birthsThisYear: number;
  deathsThisYear: number;
  netMigration: number;
  naturalChange: number;
  
  // Key Ratios
  tfr: number;
  elderlyRatio: number;      // % aged 65+
  youthRatio: number;        // % aged 0-14
  workingRatio: number;      // % aged 15-64
  medianAge: number;
  dependencyRatio: number;   // (0-14 + 65+) / 15-64
  
  // Behavioral & Psychological
  youthHopeIndex: number;    // 0 - 100
  lowFertilityTrapActive: boolean; // True if Hope Index < 35
  synergyBonusActive: boolean;    // True if Hope Index > 75
  
  // Cumulative Event Shocks
  eventTFRModifier?: number;
  eventHopeModifier?: number;
}

export interface NationalEconomy {
  humanWorkforce: number;       // in millions
  foreignWorkers: number;       // in millions
  roboticsLaborEquivalents: number; // in millions
  effectiveWorkforce: number;   // in millions
  laborProductivity: number;    // index (1.0 = baseline 2025)
  eventProductivityModifier?: number; // cumulative event shocks
  gdp: number;                  // Trillion Yen (¥T)
  gdpPerCapita: number;         // Million Yen (¥M)
  gdpGrowthRate: number;        // % annual
  
  // Fiscal State
  nationalDebt: number;         // Trillion Yen (¥T)
  debtToGDP: number;            // %
  jgbYield: number;             // % (10-Year sovereign bond yield)
  creditRating: 'AAA' | 'AA+' | 'AA' | 'A' | 'BBB' | 'JUNK';
  treasuryBalance: number;      // Billion Yen (¥B)
  
  // Annual Flows (¥B/year)
  taxIncome: number;
  taxCorporate: number;
  taxConsumption: number;
  totalRevenue: number;
  
  expenditurePensions: number;
  expenditureHealthcare: number;
  expenditureChildcare: number;
  expenditureMaintenance: number;
  expenditureDebtServicing: number;
  totalExpenditure: number;
  annualDeficit: number;
}

export type OrdinanceCategory =
  | 'family'
  | 'labor'
  | 'immigration'
  | 'technology'
  | 'automation'
  | 'fiscal';

export interface Ordinance {
  id: string;
  category: OrdinanceCategory;
  name: { en: string; ja: string };
  description: { en: string; ja: string };
  impactSummary: { en: string; ja: string };
  annualCostBillion: number;      // + cost, - savings (in ¥B)
  tfrDelta: number;               // Direct TFR modifier
  hopeIndexDelta: number;         // Youth hope modifier
  productivityDelta: number;     // Productivity modifier
  seniorApprovalDelta: number;    // Senior voter approval impact
  youthApprovalDelta: number;     // Youth voter approval impact
  active: boolean;
  unlockedYear: number;
  enactedYear?: number;           // Year this was enacted (if active)
  duration?: number;              // How many years this ordinance lasts (undefined = permanent)
  replaces?: string[];            // IDs of ordinances this policy naturally conflicts with and repeals
  expirationShock?: {             // Negative impact when it expires or is repealed
    approvalDelta?: number;
    hopeDelta?: number;
    description?: { en: string; ja: string };
  };
}

export interface MacroEventChoice {
  id: string;
  label: { en: string; ja: string };
  description: { en: string; ja: string };
  costBillion?: number;
  tfrDelta?: number;
  approvalDelta?: number;
  hopeDelta?: number;
  debtDelta?: number;
  productivityDelta?: number;
}

export interface MacroEvent {
  id: string;
  title: { en: string; ja: string };
  headline?: { en: string; ja: string };
  description: { en: string; ja: string };
  year?: number;
  severity?: 'info' | 'warning' | 'disaster' | 'miracle';
  choices: MacroEventChoice[];
}

export interface YearHistoryRecord {
  year: number;
  population: number;
  tfr: number;
  gdp: number;
  debtToGDP: number;
  cabinetApproval: number;
  youthHopeIndex: number;
  elderlyRatio: number;
  births: number;
  deaths: number;
  jgbYield: number;
  policyEvents?: { name: { en: string; ja: string }, type: 'enacted' | 'expired' | 'repealed' | 'historic' }[];
  isHistorical?: boolean;
}

export type PrefecturalRegionId =
  | 'hokkaido'
  | 'tohoku'
  | 'kanto'
  | 'chubu'
  | 'kansai'
  | 'chugoku'
  | 'shikoku'
  | 'kyushu';

export interface RegionalMetricData {
  id: PrefecturalRegionId;
  name: { en: string; ja: string };
  gridX: number;
  gridY: number;
  lon: number;             // Real-world Longitude (East)
  lat: number;             // Real-world Latitude (North)
  populationMillions: number;
  youthRatio: number;      // % 0-14
  workingRatio: number;    // % 15-64
  elderlyRatio: number;    // % 65+
  tfr: number;
  hopeIndex: number;       // 0-100
  housingCostBurden: number; // 0-100 (high in Tokyo)
  akiyaRate: number;       // % vacant homes
  economicOutputTrillion: number;
  sentimentStatus: 'happy' | 'neutral' | 'worried';
  description: { en: string; ja: string };
}

export type HeatmapOverlay = 'normal' | 'youth' | 'akiya' | 'productivity' | 'fertility' | 'sentiment' | 'pyramid';

export type MetricNodeType =
  | 'region'
  | 'pyramid_cohort'
  | 'hope_monolith'
  | 'fiscal_monolith'
  | 'replacement_gauge';

export interface MetricInspectionTarget {
  type: MetricNodeType;
  regionId?: PrefecturalRegionId;
  cohortIndex?: number;
  title: { en: string; ja: string };
  category: { en: string; ja: string };
  stat1: { label: { en: string; ja: string }; value: string };
  stat2: { label: { en: string; ja: string }; value: string };
  stat3: { label: { en: string; ja: string }; value: string };
  stat4?: { label: { en: string; ja: string }; value: string };
  summary: { en: string; ja: string };
}

export type ActiveTool =
  | 'inspect'
  | 'target_childcare'
  | 'target_automation'
  | 'target_akiya'
  | 'target_geriatric'
  | 'target_education'
  | 'bulldoze'
  | 'kodomoen'
  | 'geriatric_care'
  | 'satellite_office'
  | 'agri_robotics'
  | 'shinkansen_station'
  | 'maternity_park';

export type GameSpeed = 0 | 1 | 2 | 5; // 0 = pause, 1 = 1x, 2 = 2x, 5 = 5x

export type GameOverReason =
  | 'victory_2075'
  | 'fiscal_collapse'
  | 'no_confidence_vote'
  | 'demographic_freefall'
  | 'workforce_collapse'
  | 'demographic_extinction';

export interface GameState {
  currentYear: number;           // 2025 to 2075
  currentMonth?: number;
  cabinetTerm: number;           // 1 to 10 (each term = 5 years)
  primeMinisterName?: string;
  gameSpeed: GameSpeed;
  isPaused?: boolean;
  isGameOver?: boolean;
  gameOverReason: GameOverReason | null;
  
  // Politics
  cabinetApproval: number;       // % (0 - 100)
  eventApprovalModifier?: number; // Cumulative event shock to approval
  seniorTurnout: number;         // % (approx 80%)
  youthTurnout: number;          // % (approx 35%)
  silverDemocracyIndex: number;  // % of total vote coming from 65+
  
  // Modules
  demographics: NationalDemographics;
  economy: NationalEconomy;
  regional?: Record<RegionType, RegionalDemographics>;
  ordinances: Ordinance[];
  availableOrdinanceIds?: string[];
  map?: TileData[][];
  
  // Active Modals & Events
  activeEvent: MacroEvent | null;
  history?: YearHistoryRecord[];
  
  // Settings & Audio
  language: Language;
  soundEnabled: boolean;
  musicEnabled?: boolean;
  activeOverlay?: HeatmapOverlay;
  activeTool?: ActiveTool;
  
  // Selected tile for inspect
  selectedTile?: TileData | null;
}

export interface MetricComparison {
  prev: number;
  next: number;
  delta: number;
}

export interface SessionImpactSummary {
  year: number;
  cabinetTerm: number;
  metrics: {
    tfr: MetricComparison;
    hopeIndex: MetricComparison;
    productivity: MetricComparison;
    cabinetApproval: MetricComparison;
    seniorApproval: MetricComparison;
    youthApproval: MetricComparison;
    fiscalCost: MetricComparison;
  };
  activePoliciesCount: number;
}
