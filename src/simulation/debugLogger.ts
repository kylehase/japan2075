import {
  GameState,
  NationalDemographics,
  NationalEconomy,
  Ordinance,
  MacroEvent,
  MacroEventChoice,
} from '../types/game';

export interface StochasticVarianceLog {
  subsystem: string;
  name: string;
  baseValue: number;
  variance: number;
  randomRoll: number;
  multiplier: number;
  realizedValue: number;
}

export interface MacroEventRollLog {
  year: number;
  roll: number;
  threshold: number;
  triggered: boolean;
  type: 'milestone' | 'conditional' | 'stochastic' | 'none';
  eventId?: string;
  eventTitle?: string;
}

export interface UserLegislativeActionLog {
  year: number;
  enactedPolicies: {
    id: string;
    nameEn: string;
    nameJa: string;
    category: string;
    annualCostBillion: number;
    tfrDelta: number;
    hopeIndexDelta: number;
    productivityDelta: number;
  }[];
  repealedPolicies: {
    id: string;
    nameEn: string;
    nameJa: string;
    category: string;
  }[];
  categoryChoices: Record<string, string>;
}

export interface UserEventChoiceLog {
  year: number;
  eventId: string;
  eventTitleEn: string;
  choiceId: string;
  choiceTextEn: string;
  deltas: {
    tfrDelta?: number;
    hopeDelta?: number;
    costBillion?: number;
    debtDelta?: number;
    approvalDelta?: number;
    productivityDelta?: number;
  };
}

export interface YearSimulationLog {
  year: number;
  userLegislativeAction?: UserLegislativeActionLog;
  userEventChoices: UserEventChoiceLog[];
  macroEventRoll?: MacroEventRollLog;
  stochasticVariances: StochasticVarianceLog[];
  metricsAfterStep?: {
    demographics: {
      totalPopulation: number;
      births: number;
      deaths: number;
      naturalChange: number;
      tfr: number;
      youthHopeIndex: number;
      elderlyRatio: number;
      workingRatio: number;
      youthRatio: number;
      cohorts: Array<{ ageLabel: string; male: number; female: number; total: number }>;
    };
    economy: {
      gdp: number;
      nationalDebt: number;
      debtToGDP: number;
      totalRevenue: number;
      totalExpenditure: number;
      annualDeficit: number;
      jgbYield: number;
      laborProductivity: number;
    };
    politics: {
      cabinetApproval: number;
      silverDemocracyIndex: number;
      seniorTurnout: number;
      youthTurnout: number;
    };
    activeOrdinanceIds: string[];
  };
}

class DebugLogger {
  private yearlyLogs: Map<number, YearSimulationLog> = new Map();
  private activeSimulatingYear: number = 2025;

  public setSimulatingYear(year: number) {
    this.activeSimulatingYear = year;
    this.getOrCreateYearLog(year);
  }

  public getSimulatingYear(): number {
    return this.activeSimulatingYear;
  }

  private getOrCreateYearLog(year: number): YearSimulationLog {
    let log = this.yearlyLogs.get(year);
    if (!log) {
      log = {
        year,
        userEventChoices: [],
        stochasticVariances: [],
      };
      this.yearlyLogs.set(year, log);
    }
    return log;
  }

  /**
   * Records user policy choices for the legislative session
   */
  public logLegislativeAction(
    year: number,
    enacted: Ordinance[],
    repealed: Ordinance[],
    categoryChoices: Record<string, string>
  ) {
    const log = this.getOrCreateYearLog(year);
    log.userLegislativeAction = {
      year,
      enactedPolicies: enacted.map(o => ({
        id: o.id,
        nameEn: o.name.en,
        nameJa: o.name.ja,
        category: o.category,
        annualCostBillion: o.annualCostBillion,
        tfrDelta: o.tfrDelta,
        hopeIndexDelta: o.hopeIndexDelta,
        productivityDelta: o.productivityDelta,
      })),
      repealedPolicies: repealed.map(o => ({
        id: o.id,
        nameEn: o.name.en,
        nameJa: o.name.ja,
        category: o.category,
      })),
      categoryChoices,
    };
  }

  /**
   * Records user event choice
   */
  public logEventChoice(year: number, event: MacroEvent, choice: MacroEventChoice) {
    const log = this.getOrCreateYearLog(year);
    log.userEventChoices.push({
      year,
      eventId: event.id,
      eventTitleEn: event.title.en,
      choiceId: choice.id,
      choiceTextEn: choice.label.en,
      deltas: {
        tfrDelta: choice.tfrDelta,
        hopeDelta: choice.hopeDelta,
        costBillion: choice.costBillion,
        debtDelta: choice.debtDelta,
        approvalDelta: choice.approvalDelta,
        productivityDelta: choice.productivityDelta,
      },
    });
  }

  /**
   * Records macro event evaluation and rolls
   */
  public logMacroEventRoll(year: number, rollLog: MacroEventRollLog) {
    const log = this.getOrCreateYearLog(year);
    log.macroEventRoll = rollLog;
  }

  /**
   * Applies variance and logs the roll and result
   */
  public applyAndLogVariance(
    year: number,
    subsystem: string,
    name: string,
    baseValue: number,
    variance: number = 0.15
  ): number {
    const rand = Math.random();
    // Standard variance: value * (1 - variance + rand * variance * 2)
    const multiplier = 1 - variance + rand * variance * 2;
    const realized = baseValue * multiplier;

    const log = this.getOrCreateYearLog(year);
    log.stochasticVariances.push({
      subsystem,
      name,
      baseValue,
      variance,
      randomRoll: Number(rand.toFixed(5)),
      multiplier: Number(multiplier.toFixed(5)),
      realizedValue: Number(realized.toFixed(5)),
    });

    return realized;
  }

  /**
   * Records resulting metrics after an annual step
   */
  public logYearMetrics(
    year: number,
    demographics: NationalDemographics,
    economy: NationalEconomy,
    cabinetApproval: number,
    silverDemocracyIndex: number,
    activeOrdinanceIds: string[]
  ) {
    const log = this.getOrCreateYearLog(year);
    const deathsActual = demographics.deathsThisYear < 10000 ? demographics.deathsThisYear * 1000 : demographics.deathsThisYear;
    log.metricsAfterStep = {
      demographics: {
        totalPopulation: demographics.totalPopulation,
        births: demographics.birthsThisYear,
        deaths: deathsActual,
        naturalChange: demographics.birthsThisYear - deathsActual,
        tfr: demographics.tfr,
        youthHopeIndex: demographics.youthHopeIndex,
        elderlyRatio: demographics.elderlyRatio,
        workingRatio: demographics.workingRatio,
        youthRatio: demographics.youthRatio,
        cohorts: demographics.cohorts.map(c => ({
          ageLabel: c.ageLabel,
          male: c.male,
          female: c.female,
          total: c.male + c.female,
        })),
      },
      economy: {
        gdp: economy.gdp,
        nationalDebt: economy.nationalDebt,
        debtToGDP: economy.debtToGDP,
        totalRevenue: economy.totalRevenue,
        totalExpenditure: economy.totalExpenditure,
        annualDeficit: economy.annualDeficit,
        jgbYield: economy.jgbYield,
        laborProductivity: economy.laborProductivity,
      },
      politics: {
        cabinetApproval,
        silverDemocracyIndex,
        seniorTurnout: 82,
        youthTurnout: 38,
      },
      activeOrdinanceIds,
    };
  }

  /**
   * Generates comprehensive debug payload for export
   */
  public generateFullReport(gameState: GameState) {
    // Sort yearly logs
    const sortedLogs = Array.from(this.yearlyLogs.values()).sort((a, b) => a.year - b.year);

    const activeOrdinances = gameState.ordinances.filter(o => o.active);
    const deathsActual = gameState.demographics.deathsThisYear < 10000 ? gameState.demographics.deathsThisYear * 1000 : gameState.demographics.deathsThisYear;

    return {
      exportMetadata: {
        timestamp: new Date().toISOString(),
        gameTitle: "Japan 2075: Demographic & Fiscal Solvency Simulation",
        appVersion: "1.0.4",
        currentYear: gameState.currentYear,
        cabinetTerm: gameState.cabinetTerm,
        isGameOver: gameState.isGameOver || false,
        gameOverReason: gameState.gameOverReason,
        yearsSimulated: Math.max(0, gameState.currentYear - 2025),
      },
      currentGameStateSnapshot: {
        year: gameState.currentYear,
        demographics: {
          totalPopulation: gameState.demographics.totalPopulation,
          birthsThisYear: gameState.demographics.birthsThisYear,
          deathsThisYear: deathsActual,
          naturalChange: gameState.demographics.birthsThisYear - deathsActual,
          crudeBirthRatePerMille: Number(((gameState.demographics.birthsThisYear / gameState.demographics.totalPopulation) * 1000).toFixed(2)),
          crudeDeathRatePerMille: Number(((deathsActual / gameState.demographics.totalPopulation) * 1000).toFixed(2)),
          tfr: gameState.demographics.tfr,
          youthHopeIndex: gameState.demographics.youthHopeIndex,
          elderlyRatio: gameState.demographics.elderlyRatio,
          workingRatio: gameState.demographics.workingRatio,
          youthRatio: gameState.demographics.youthRatio,
          cohortsSummary: gameState.demographics.cohorts.map(c => ({
            ageLabel: c.ageLabel,
            maleThousands: c.male,
            femaleThousands: c.female,
            totalThousands: Math.round(c.male + c.female),
          })),
        },
        economy: {
          gdp: gameState.economy.gdp,
          gdpPerCapita: gameState.economy.gdpPerCapita,
          gdpGrowthRate: gameState.economy.gdpGrowthRate,
          nationalDebt: gameState.economy.nationalDebt,
          debtToGDP: gameState.economy.debtToGDP,
          totalRevenue: gameState.economy.totalRevenue,
          totalExpenditure: gameState.economy.totalExpenditure,
          annualDeficit: gameState.economy.annualDeficit,
          jgbYield: gameState.economy.jgbYield,
          creditRating: gameState.economy.creditRating,
          treasuryBalance: gameState.economy.treasuryBalance,
          laborProductivity: gameState.economy.laborProductivity,
          breakdownExpenditure: {
            pensions: gameState.economy.expenditurePensions,
            healthcare: gameState.economy.expenditureHealthcare,
            childcare: gameState.economy.expenditureChildcare,
            infrastructureMaintenance: gameState.economy.expenditureMaintenance,
            debtServicing: gameState.economy.expenditureDebtServicing,
          },
          breakdownRevenue: {
            consumptionTax: gameState.economy.taxConsumption,
            incomeTax: gameState.economy.taxIncome,
            corporateTax: gameState.economy.taxCorporate,
          }
        },
        politics: {
          cabinetApproval: gameState.cabinetApproval,
          silverDemocracyIndex: gameState.silverDemocracyIndex,
          seniorTurnout: gameState.seniorTurnout,
          youthTurnout: gameState.youthTurnout,
          eventApprovalModifier: gameState.eventApprovalModifier || 0,
        },
        activeOrdinances: activeOrdinances.map(o => ({
          id: o.id,
          name: o.name.en,
          category: o.category,
          enactedYear: o.enactedYear,
          durationYears: o.duration,
          annualCostBillion: o.annualCostBillion,
          tfrDelta: o.tfrDelta,
          hopeIndexDelta: o.hopeIndexDelta,
          productivityDelta: o.productivityDelta,
          seniorApprovalDelta: o.seniorApprovalDelta,
          youthApprovalDelta: o.youthApprovalDelta,
        })),
      },
      yearlySimulationLogs: sortedLogs,
      historicalComparisonRecords: (gameState.history || [])
        .filter(h => h.year >= 2024)
        .map(h => ({
        year: h.year,
        population: h.population,
        tfr: h.tfr,
        gdp: h.gdp,
        debtToGDP: h.debtToGDP,
        cabinetApproval: h.cabinetApproval,
        youthHopeIndex: h.youthHopeIndex,
        elderlyRatio: h.elderlyRatio,
        births: h.births,
        deaths: (h.deaths > 0 && h.deaths < 10000) ? h.deaths * 1000 : h.deaths,
        jgbYield: h.jgbYield,
        policyEvents: h.policyEvents,
        isHistorical: h.isHistorical,
      })),
      allOrdinancesManifest: gameState.ordinances.map(o => ({
        id: o.id,
        name: o.name.en,
        category: o.category,
        annualCostBillion: o.annualCostBillion,
        tfrDelta: o.tfrDelta,
        hopeIndexDelta: o.hopeIndexDelta,
        productivityDelta: o.productivityDelta,
        active: o.active,
        enactedYear: o.enactedYear,
      })),
    };
  }

  public reset() {
    this.yearlyLogs.clear();
    this.activeSimulatingYear = 2025;
  }
}

export const debugLogger = new DebugLogger();

/**
 * Downloads debug report as formatted JSON file
 */
export function downloadDebugData(gameState: GameState) {
  const report = debugLogger.generateFullReport(gameState);
  const jsonContent = JSON.stringify(report, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  a.download = `japan_crisis_debug_year${gameState.currentYear}_${timestamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
