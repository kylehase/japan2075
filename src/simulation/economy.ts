import {
  NationalDemographics,
  NationalEconomy,
  Ordinance,
  TileData,
} from '../types/game';
import { BUILDING_CONFIGS } from './constants';
import { debugLogger } from './debugLogger';

function applyVar(value: number, variance: number = 0.15, subsystem: string = 'economy', name: string = 'generic'): number {
  const year = debugLogger.getSimulatingYear();
  return debugLogger.applyAndLogVariance(year, subsystem, name, value, variance);
}

export function calculateEconomyAndFiscalSolvency(
  currentYear: number,
  demographics: NationalDemographics,
  prevEconomy: NationalEconomy,
  activeOrdinances: Ordinance[],
  placedTiles: TileData[],
  prevApproval: number
): {
  newEconomy: NationalEconomy;
  newApproval: number;
  silverDemocracyShare: number;
  isFiscalCollapse: boolean;
  isNoConfidenceVote: boolean;
} {
  // Ensure only active ordinances are evaluated
  const filteredActive = activeOrdinances.filter(o => o.active !== false);

  // 1. Workforce calculation
  // Human workforce = working age population (15-64) * labor participation rate (~78%)
  let humanWorkforceMillions = (demographics.totalPopulation * (demographics.workingRatio / 100) * 0.78) / 1000000;
  if (filteredActive.some(o => o.id === 'ord_senior_labor_mandate')) {
    humanWorkforceMillions += 3.0; // Extend retirement age
  }
  if (filteredActive.some(o => o.id === 'ord_income_wall_reform_178m')) {
    humanWorkforceMillions += 0.8; // Abolish 1.03M wall to unlock full part-time labor
  }
  
  // Foreign workers based on ordinances
  let foreignWorkersMillions = 2.0; // base 2.0 million in 2025
  if (filteredActive.some(o => o.id === 'ord_high_skill_visa')) foreignWorkersMillions += 0.4;
  if (filteredActive.some(o => o.id === 'ord_permanent_residency_family')) foreignWorkersMillions += 1.8;
  if (filteredActive.some(o => o.id === 'ord_blue_collar_unrestricted')) foreignWorkersMillions += 1.5;
  if (filteredActive.some(o => o.id === 'ord_transition_titp_to_esd')) foreignWorkersMillions += 0.6;
  if (filteredActive.some(o => o.id === 'ord_foreign_caregiver_fasttrack')) foreignWorkersMillions += 0.4;
  if (filteredActive.some(o => o.id === 'ord_multicultural_education_mandate')) foreignWorkersMillions += 0.3;
  if (filteredActive.some(o => o.id === 'ord_dual_citizenship_reconciliation')) foreignWorkersMillions += 0.2;
  if (filteredActive.some(o => o.id === 'ord_foreign_entrepreneur_startup_visa')) foreignWorkersMillions += 0.1;

  // Robotics / AI capacity from placed facilities & ordinances
  let placedAgriBots = 0;
  let placedHighTech = 0;
  let totalBuildingMaintenance = 0;

  for (const tile of placedTiles) {
    if (tile.building) {
      const cfg = BUILDING_CONFIGS[tile.building];
      if (cfg) {
        totalBuildingMaintenance += cfg.maintenance;
      }
      if (tile.building === 'agri_robotics') placedAgriBots++;
      if (tile.building === 'satellite_office' || tile.building === 'shinkansen_station') placedHighTech++;
    }
  }

  let roboticsLaborEquivalents = placedAgriBots * 0.25; // in millions
  if (filteredActive.some(o => o.id === 'ord_eldercare_robotics_mandate')) roboticsLaborEquivalents += 0.8;
  if (filteredActive.some(o => o.id === 'ord_national_ai_transformation')) roboticsLaborEquivalents += 2.5;
  if (filteredActive.some(o => o.id === 'ord_sovereign_generative_ai_datacenter')) roboticsLaborEquivalents += 0.8;
  if (filteredActive.some(o => o.id === 'ord_autonomous_construction_robotics')) roboticsLaborEquivalents += 0.5;
  if (filteredActive.some(o => o.id === 'ord_digital_agency_paperless_mandate')) roboticsLaborEquivalents += 0.4;
  if (filteredActive.some(o => o.id === 'ord_automated_drone_logistics_airspace')) roboticsLaborEquivalents += 0.3;

  const effectiveWorkforce = humanWorkforceMillions + foreignWorkersMillions + roboticsLaborEquivalents;

  // 2. Labor Productivity Multiplier & Capital Flight Dynamics
  let productivityMultiplier = 1.0 + (prevEconomy.eventProductivityModifier || 0);
  for (const ord of filteredActive) {
    productivityMultiplier += applyVar(ord.productivityDelta, 0.20, 'economy_productivity', `${ord.id} (${ord.name.en})`); // 20% variance on productivity impact
  }
  productivityMultiplier += (placedHighTech * 0.015);

  // Real-world Friction: Capital Tax Burden & Keidanren Offshore Flight Index
  // Severe punitive tax stacking (80% inheritance, wealth/dividend surtax, robot tax, financial tax)
  // triggers corporate CapEx retrenchment and asset migration to Singapore/US.
  let capitalTaxBurdenIndex = 0;
  if (filteredActive.some(o => o.id === 'ord_inheritance_tax_hike')) capitalTaxBurdenIndex += 2.5;
  if (filteredActive.some(o => o.id === 'ord_wealth_corporate_surtax')) capitalTaxBurdenIndex += 2.0;
  if (filteredActive.some(o => o.id === 'ord_robot_tax')) capitalTaxBurdenIndex += 1.8;
  if (filteredActive.some(o => o.id === 'ord_financial_income_flat_tax_hike')) capitalTaxBurdenIndex += 1.0;

  let capitalFlightErosion = 1.0;
  let capitalFlightProductivityDrag = 0;
  if (capitalTaxBurdenIndex > 3.0) {
    const excess = capitalTaxBurdenIndex - 3.0;
    // Dampens corporate tax base collections via offshore avoidance (up to 28%)
    capitalFlightErosion = Math.max(0.72, 1.0 - excess * 0.07);
    // Loss of high-tech domestic CapEx investments
    capitalFlightProductivityDrag = excess * 0.04;
    productivityMultiplier = Math.max(0.70, productivityMultiplier - capitalFlightProductivityDrag);
  }

  // 3. Effective GDP (Trillion Yen)
  // Baseline 2025: ~600 Trillion Yen
  const basePerWorkerOutput = 600 / (67.0); // ~8.95M Yen per effective worker
  const gdp = Math.round(effectiveWorkforce * basePerWorkerOutput * productivityMultiplier * 10) / 10;
  const gdpPerCapita = Math.round((gdp * 1000000) / demographics.totalPopulation * 100) / 100;
  const gdpGrowthRate = Math.round(((gdp - prevEconomy.gdp) / Math.max(1, prevEconomy.gdp)) * 1000) / 10;

  // 4. Tax Revenues (¥B/year)
  // Base rates: Income Tax ~¥22T, Corporate ~¥15T, Consumption ~¥23T (at 10%)
  const gdpScale = gdp / 600;
  let consumptionTaxRate = 0.10;
  if (filteredActive.some(o => o.id === 'ord_consumption_tax_hike')) {
    consumptionTaxRate = 0.15;
  } else if (filteredActive.some(o => o.id === 'ord_consumption_tax_cut')) {
    consumptionTaxRate = 0.05;
  }

  let taxIncome = Math.round(22000 * gdpScale * (effectiveWorkforce / 67.0));
  if (filteredActive.some(o => o.id === 'ord_digital_nomad_visa')) {
    taxIncome *= 0.98; // slight drop from tax exemption
  }
  if (filteredActive.some(o => o.id === 'ord_income_wall_reform_178m')) {
    taxIncome -= 850; // Initial exemption cost
  }
  
  const taxCorporate = Math.round(16000 * gdpScale * productivityMultiplier * capitalFlightErosion);
  const taxConsumption = Math.round((23000 * (consumptionTaxRate / 0.10)) * gdpScale);
  
  // Specific policy revenues (negative annual cost = revenue/dividend)
  let policyExtraRevenue = 0;
  for (const ord of filteredActive) {
    if (ord.annualCostBillion < 0) {
      let revenue = Math.abs(ord.annualCostBillion);
      if ((ord.id === 'ord_wealth_corporate_surtax' || ord.id === 'ord_inheritance_tax_hike') && capitalFlightErosion < 1.0) {
        revenue *= capitalFlightErosion;
      }
      policyExtraRevenue += revenue;
    }
  }
  const totalRevenue = taxIncome + taxCorporate + taxConsumption + policyExtraRevenue;

  // 5. Expenditures (¥B/year)
  // Elderly pensions & medical scale with 65+ population
  const elderlyCountMillions = (demographics.totalPopulation * (demographics.elderlyRatio / 100)) / 1000000;
  const baseSeniorFactor = elderlyCountMillions / 36.0; // 36M seniors in 2025

  let seniorCopayFactor = 1.0;
  if (filteredActive.some(o => o.id === 'ord_senior_copay_increase')) {
    seniorCopayFactor = 0.82; // 18% savings on senior medical outlays
  }
  if (filteredActive.some(o => o.id === 'ord_eldercare_robotics_mandate')) {
    seniorCopayFactor *= 0.94; // additional 6% efficiency
  }
  if (filteredActive.some(o => o.id === 'ord_ai_assisted_medical_diagnosis')) {
    seniorCopayFactor *= 0.95; // 5% efficiency through early screening
  }
  if (filteredActive.some(o => o.id === 'ord_foreign_caregiver_fasttrack')) {
    seniorCopayFactor *= 0.96; // 4% reduction in overtime medical strain
  }
  if (filteredActive.some(o => o.id === 'ord_tobacco_sugar_health_levy')) {
    seniorCopayFactor *= 0.98; // 2% long term preventive savings
  }

  let pensionFactor = 1.0;
  if (filteredActive.some(o => o.id === 'ord_pension_macroeconomic_slide_acceleration')) {
    pensionFactor *= 0.93; // 7% expenditure savings from full slide enforcement
  }

  const expenditurePensions = Math.round(58000 * baseSeniorFactor * pensionFactor);
  const expenditureHealthcare = Math.round(42000 * baseSeniorFactor * seniorCopayFactor);
  
  // Childcare subventions
  let expenditureChildcare = Math.round(11000 * (demographics.youthRatio / 12.0));
  for (const ord of filteredActive) {
    if (ord.annualCostBillion > 0) {
      expenditureChildcare += applyVar(ord.annualCostBillion, 0.15, 'economy_childcare_cost', `${ord.id} (${ord.name.en})`); // 15% variance on cost prediction
    }
  }

  // Infrastructure maintenance savings from automated construction
  let maintenanceCost = totalBuildingMaintenance;
  if (filteredActive.some(o => o.id === 'ord_autonomous_construction_robotics')) {
    maintenanceCost = Math.max(0, maintenanceCost - 180);
  }

  // Debt servicing: Total Debt * JGB Yield
  const prevDebtTrillion = prevEconomy.nationalDebt;
  const jgbYield = prevEconomy.jgbYield;
  const expenditureDebtServicing = Math.round((prevDebtTrillion * (jgbYield / 100)) * 1000);

  const totalExpenditure = expenditurePensions +
                           expenditureHealthcare +
                           expenditureChildcare +
                           maintenanceCost +
                           expenditureDebtServicing;

  const annualDeficit = totalExpenditure - totalRevenue;
  const newNationalDebt = Math.max(0, Math.round((prevDebtTrillion + (annualDeficit / 1000)) * 10) / 10);
  const debtToGDP = Math.round((newNationalDebt / gdp) * 1000) / 10;

  // 6. Sovereign Risk & JGB Yield Curve
  // Base neutral nominal yield in modern BOJ normalized regime (~1.05%)
  const baseYield = 1.05;

  // Growth & inflation expectation component (higher real/nominal GDP growth slightly lifts neutral rate)
  const growthComponent = Math.max(-0.25, Math.min(0.40, (gdpGrowthRate - 1.0) * 0.02));

  // Sovereign debt premium based on Debt-to-GDP
  // Baseline ~260% contributes ~0.25% premium (yielding ~1.25%-1.35%)
  // Under 190% compresses premium to -0.10% (yielding ~0.90%-1.05%)
  // Above 270% accelerates steeply as bond market pricing demands higher risk spreads
  let debtPremium = 0;
  if (debtToGDP > 330) {
    debtPremium = 2.8 + (debtToGDP - 330) * 0.15;
  } else if (debtToGDP > 300) {
    debtPremium = 1.5 + (debtToGDP - 300) * 0.043;
  } else if (debtToGDP > 270) {
    debtPremium = 0.5 + (debtToGDP - 270) * 0.033;
  } else {
    debtPremium = (debtToGDP - 210) * 0.0042;
  }

  // Deficit supply pressure: primary deficit as % of GDP adds term/issuance premium
  const deficitPctGDP = (annualDeficit / Math.max(1, gdp * 1000)) * 100;
  const deficitPremium = Math.max(-0.20, Math.min(1.20, (deficitPctGDP - 2.0) * 0.04));

  // Demand-Pull Macro Imbalance:
  // Injecting massive unconditional cash handouts without matching real productivity
  // creates demand-pull inflation expectations and sovereign term premium pressure.
  let totalCashTransfersBillion = 0;
  if (filteredActive.some(o => o.id === 'ord_ubi')) totalCashTransfersBillion += 25000;
  if (filteredActive.some(o => o.id === 'ord_universal_child_allowance_100k')) totalCashTransfersBillion += 8400;
  if (filteredActive.some(o => o.id === 'ord_universal_child_allowance')) totalCashTransfersBillion += 2400;
  if (filteredActive.some(o => o.id === 'ord_means_tested_housing')) totalCashTransfersBillion += 850;

  const cashTransferRatioToGDP = (totalCashTransfersBillion / Math.max(1, gdp * 1000));
  let demandPullBondStress = 0;
  if (cashTransferRatioToGDP > 0.025 && productivityMultiplier < 1.45) {
    demandPullBondStress = Math.min(1.8, (cashTransferRatioToGDP - 0.025) * 12 * (1.45 - productivityMultiplier));
  }

  const rawTargetYield = Math.max(0.20, baseYield + growthComponent + debtPremium + deficitPremium + demandPullBondStress);
  const targetYield = applyVar(rawTargetYield, 0.06, 'economy_jgb_yield', '10Y JGB Benchmark Yield');

  // Dynamic continuous adjustment with market momentum
  const newJGBYield = Math.max(0.15, Math.round((prevEconomy.jgbYield * 0.35 + targetYield * 0.65) * 100) / 100);

  // Credit Rating based on Debt/GDP and sovereign yield stress
  let creditRating: 'AAA' | 'AA+' | 'AA' | 'A' | 'BBB' | 'JUNK' = 'A';
  if (debtToGDP > 330 || newJGBYield > 5.5) {
    creditRating = 'JUNK';
  } else if (debtToGDP > 290 || newJGBYield > 3.5) {
    creditRating = 'BBB';
  } else if (debtToGDP > 250) {
    creditRating = 'A';
  } else if (debtToGDP > 210) {
    creditRating = 'AA';
  } else if (debtToGDP > 170) {
    creditRating = 'AA+';
  } else {
    creditRating = 'AAA';
  }

  // 7. Silver Democracy & LDP Political Economy Friction Model
  // Senior turnout = 82%, Working/Youth turnout = ~36%
  const seniorWeight = (demographics.elderlyRatio * 0.82);
  const youthWeight = (demographics.workingRatio * 0.36 + demographics.youthRatio * 0.18);
  const totalWeight = seniorWeight + youthWeight;
  const silverDemocracyShare = Math.round((seniorWeight / totalWeight) * 1000) / 10;

  let seniorApprovalDelta = 0;
  let youthApprovalDelta = 0;

  for (const ord of filteredActive) {
    seniorApprovalDelta += applyVar(ord.seniorApprovalDelta, 0.20, 'economy_senior_approval', `${ord.id} (${ord.name.en})`); // 20% variance
    youthApprovalDelta += applyVar(ord.youthApprovalDelta, 0.20, 'economy_youth_approval', `${ord.id} (${ord.name.en})`); // 20% variance
  }

  // Hope index boosts youth approval
  youthApprovalDelta += (demographics.youthHopeIndex - 50) * 0.25;

  // Real-world Friction A: Silver Democracy Retaliatory Mobilization
  // When senior medical subsidies, pensions, or inheritance assets are aggressively curtailed,
  // senior voter turnout surges and conservative federations (Japan Medical Association, Pensioners) mobilize.
  let silverBacklashPenalty = 0;
  if (seniorApprovalDelta < -10) {
    const excessSeniorDiscontent = Math.abs(seniorApprovalDelta) - 10;
    silverBacklashPenalty = Math.pow(excessSeniorDiscontent, 1.15) * 0.50;
  }

  // Real-world Friction B: LDP Factional Rebellion & Policy Overload Strain
  // An LDP Cabinet cannot maintain dozens of radical, contradictory structural overhauls
  // without triggering intra-party revolts, Diet backbench revolts, and coalition friction.
  let factionalFrictionPenalty = 0;
  if (filteredActive.length > 10) {
    const policyOverload = filteredActive.length - 10;
    factionalFrictionPenalty = policyOverload * 0.90;
  }

  // Real-world Friction C: Cost-of-Living & Tax Friction
  let taxFrictionPenalty = 0;
  if (consumptionTaxRate >= 0.15) {
    taxFrictionPenalty += 6.5; // 15% consumption tax historical electoral backlash
  }
  if (demandPullBondStress > 0.3) {
    taxFrictionPenalty += demandPullBondStress * 4.0; // Inflation & living-cost discontent
  }

  // Deficit / debt penalty on general approval if rating is downgraded
  let macroPenalty = 0;
  if (debtToGDP > 300) macroPenalty -= 8;
  if (debtToGDP > 330) macroPenalty -= 15;

  const blendedApproval = 50 + (seniorApprovalDelta * (seniorWeight / totalWeight)) +
                               (youthApprovalDelta * (youthWeight / totalWeight)) +
                               macroPenalty -
                               silverBacklashPenalty -
                               factionalFrictionPenalty -
                               taxFrictionPenalty;

  // Smooth approval movement
  const newApproval = Math.max(5, Math.min(95, Math.round((prevApproval * 0.35 + blendedApproval * 0.65) * 10) / 10));

  const newEconomy: NationalEconomy = {
    humanWorkforce: Math.round(humanWorkforceMillions * 10) / 10,
    foreignWorkers: Math.round(foreignWorkersMillions * 10) / 10,
    roboticsLaborEquivalents: Math.round(roboticsLaborEquivalents * 10) / 10,
    effectiveWorkforce: Math.round(effectiveWorkforce * 10) / 10,
    laborProductivity: Math.round(productivityMultiplier * 100) / 100,
    eventProductivityModifier: prevEconomy.eventProductivityModifier,
    gdp,
    gdpPerCapita,
    gdpGrowthRate,
    nationalDebt: newNationalDebt,
    debtToGDP,
    jgbYield: newJGBYield,
    creditRating,
    treasuryBalance: Math.max(0, prevEconomy.treasuryBalance - annualDeficit),
    taxIncome,
    taxCorporate,
    taxConsumption,
    totalRevenue,
    expenditurePensions,
    expenditureHealthcare,
    expenditureChildcare,
    expenditureMaintenance: totalBuildingMaintenance,
    expenditureDebtServicing,
    totalExpenditure,
    annualDeficit,
  };

  // Aggressive difficulty curve: If debt/GDP spirals, deficits surge, or bond yields spike, trigger Game Over
  const isFiscalCollapse = (debtToGDP >= 330 && annualDeficit > 25000) || newJGBYield >= 7.0;
  const isNoConfidenceVote = newApproval < 25;

  return {
    newEconomy,
    newApproval,
    silverDemocracyShare,
    isFiscalCollapse,
    isNoConfidenceVote,
  };
}

export function simulateEconomyStep(
  prevEconomy: NationalEconomy,
  demographics: NationalDemographics,
  activeOrdinances: Ordinance[],
  placedTilesOrCounts: any,
  currentYear: number = 2025,
  prevApproval: number = 50
): NationalEconomy {
  let tilesArray: TileData[] = [];
  if (Array.isArray(placedTilesOrCounts)) {
    tilesArray = placedTilesOrCounts;
  }
  const res = calculateEconomyAndFiscalSolvency(
    currentYear,
    demographics,
    prevEconomy,
    activeOrdinances,
    tilesArray,
    prevApproval
  );
  return res.newEconomy;
}


