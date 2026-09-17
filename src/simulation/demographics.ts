import {
  AgeCohort,
  NationalDemographics,
  Ordinance,
  RegionalDemographics,
  TileData,
  RegionType,
} from '../types/game';
import {
  AGE_FERTILITY_WEIGHTS,
  BASE_5YR_SURVIVAL_RATES,
  INITIAL_REGIONAL_DEMOGRAPHICS,
} from './constants';
import { debugLogger } from './debugLogger';

function applyVariance(value: number, variance: number = 0.15, subsystem: string = 'demographics', name: string = 'generic'): number {
  const year = debugLogger.getSimulatingYear();
  return debugLogger.applyAndLogVariance(year, subsystem, name, value, variance);
}

export function simulateDemographicStep(
  prevDemographics: NationalDemographics,
  activeOrdinances: Ordinance[],
  regionalMap: TileData[],
  regionalData: Record<RegionType, RegionalDemographics> = INITIAL_REGIONAL_DEMOGRAPHICS
): NationalDemographics {
  // Ensure only active ordinances are evaluated
  const filteredActive = activeOrdinances.filter(o => o.active !== false);
  const result = stepDemographicsOneYear(prevDemographics, regionalMap, filteredActive, regionalData);
  return result.newDemographics;
}

export function calculateYouthHopeIndex(
  disposableWageGrowth: number,     // e.g. 0.02 (2%)
  housingAffordability: number,    // 0-100 (national weighted)
  pensionSolvencyExpectation: number, // 0-100 (based on debt & dependency)
  genderEqualityScore: number,     // 0-100 (based on paternity leave & childcare)
  policyModifiers: number          // extra points from ordinances
): number {
  // Hope Index: 0 to 100
  const wageFactor = Math.min(30, Math.max(0, 15 + disposableWageGrowth * 300));
  const houseFactor = housingAffordability * 0.30;
  const pensionFactor = pensionSolvencyExpectation * 0.20;
  const genderFactor = genderEqualityScore * 0.20;
  
  const rawIndex = wageFactor + houseFactor + pensionFactor + genderFactor + policyModifiers;
  return Math.max(5, Math.min(98, Math.round(rawIndex * 10) / 10));
}

export function calculateEndogenousTFR(
  baseTFR: number,
  youthHopeIndex: number,
  daycareCoverageRatio: number, // 0 to 1 (waitlist elimination)
  activeOrdinances: Ordinance[],
  housingAffordability: number
): { tfr: number; lowFertilityTrap: boolean; synergyBonus: boolean } {
  const filteredActive = activeOrdinances.filter(o => o.active !== false);
  let policyTFRDelta = 0;
  for (const ord of filteredActive) {
    policyTFRDelta += applyVariance(ord.tfrDelta, 0.20, 'demographics_tfr', `${ord.id} (${ord.name.en})`); // 20% variance on TFR impact
  }

  // Lutz et al. Low Fertility Trap threshold (< 35) vs Synergy (> 75)
  const lowFertilityTrap = youthHopeIndex < 35;
  const synergyBonus = youthHopeIndex > 75;

  let effectivePolicyDelta = policyTFRDelta;
  if (lowFertilityTrap) {
    // Dampen positive policy effects by 50% due to entrenched pessimism
    effectivePolicyDelta = policyTFRDelta > 0 ? policyTFRDelta * 0.5 : policyTFRDelta;
  } else if (synergyBonus) {
    // 1.25x synergy multiplier
    effectivePolicyDelta = policyTFRDelta > 0 ? policyTFRDelta * 1.25 : policyTFRDelta;
  }

  // Daycare waitlist impact (+0.08 max for 100% coverage)
  const daycareDelta = daycareCoverageRatio * 0.08;

  // Housing affordability impact (+0.05 to -0.08)
  const housingDelta = ((housingAffordability - 50) / 50) * 0.06;

  // Youth hope elastic modifier
  const hopeDelta = ((youthHopeIndex - 50) / 50) * 0.14;

  // Sociological Diminishing Returns for Post-Industrial Fertility:
  // - Below 1.70: High elasticity, linear response to standard interventions
  // - 1.70 to 2.10: Gradual compression as maternal age limits and lifestyle trade-offs increase
  // - Above 2.10: Asymptotic soft-curve approaching ~2.40 max under massive societal transformation
  const rawTarget = baseTFR + effectivePolicyDelta + daycareDelta + housingDelta + hopeDelta;
  let finalTFR: number;
  if (rawTarget <= 1.70) {
    finalTFR = rawTarget;
  } else if (rawTarget <= 2.10) {
    const excess = rawTarget - 1.70;
    finalTFR = 1.70 + excess * 0.85;
  } else {
    const excess = rawTarget - 2.10;
    // Smooth asymptotic curve approaching ~2.40
    finalTFR = 1.70 + (0.40 * 0.85) + 0.36 * (1 - Math.exp(-excess * 0.75));
  }

  finalTFR = Math.max(0.75, Math.min(2.45, finalTFR));
  return {
    tfr: Math.round(finalTFR * 100) / 100,
    lowFertilityTrap,
    synergyBonus,
  };
}

export function stepDemographicsOneYear(
  prevDemographics: NationalDemographics,
  regionalMap: TileData[],
  activeOrdinances: Ordinance[],
  regionalData: Record<RegionType, RegionalDemographics>
): {
  newDemographics: NationalDemographics;
  updatedRegional: Record<RegionType, RegionalDemographics>;
} {
  // Defensive filter: only active ordinances
  const filteredActive = activeOrdinances.filter(o => o.active !== false);

  // Count placed facilities
  let totalKodomoen = 0;
  let totalSatellite = 0;
  let totalAgriBots = 0;
  let totalGeriatric = 0;

  for (const tile of regionalMap) {
    if (tile.building === 'kodomoen') totalKodomoen++;
    if (tile.building === 'satellite_office') totalSatellite++;
    if (tile.building === 'agri_robotics') totalAgriBots++;
    if (tile.building === 'geriatric_care') totalGeriatric++;
  }

  // Calculate national daycare coverage (baseline needs approx 10-15 facilities)
  const daycareCoverage = Math.min(1.0, totalKodomoen / 12);

  // Calculate national weighted housing affordability
  const avgHousing = (
    regionalData.tokyo.housingAffordability * 0.45 +
    regionalData.regional.housingAffordability * 0.40 +
    regionalData.rural.housingAffordability * 0.15
  );

  // Policy hope delta
  let ordHopeDelta = 0;
  for (const ord of filteredActive) {
    ordHopeDelta += applyVariance(ord.hopeIndexDelta, 0.25, 'demographics_hope', `${ord.id} (${ord.name.en})`); // 25% variance on Hope impact
  }

  // Calculate new Hope Index
  const genderScore = (filteredActive.some(o => o.id === 'ord_mandatory_paternity_leave') ? 35 : 15) +
                      (filteredActive.some(o => o.id === 'ord_equal_pay_regularization') ? 35 : 15) +
                      daycareCoverage * 30;

  const hopeIndex = calculateYouthHopeIndex(
    0.018,
    avgHousing,
    Math.max(20, 80 - prevDemographics.elderlyRatio * 1.2),
    genderScore,
    ordHopeDelta + (prevDemographics.eventHopeModifier || 0)
  );

  // Calculate dynamic TFR
  const { tfr, lowFertilityTrap, synergyBonus } = calculateEndogenousTFR(
    1.20 + (prevDemographics.eventTFRModifier || 0),
    hopeIndex,
    daycareCoverage,
    filteredActive,
    avgHousing
  );

  // Age the discrete cohort model by 1/5th each year (annual step of 5-year discrete bins)
  const cohorts: AgeCohort[] = JSON.parse(JSON.stringify(prevDemographics.cohorts));
  
  // Calculate annual deaths using actuarially calibrated cohort hazard rate (calibrated to ~1.58M deaths baseline)
  let annualDeathsThousands = 0;
  for (const c of cohorts) {
    const survival5yr = BASE_5YR_SURVIVAL_RATES[c.ageLabel] || { male: 0.8, female: 0.8 };
    // Exact 1-year hazard: 1 - (5yrSurvival)^0.2, calibrated with empirical life-table multiplier
    const maleMortRate = (1 - Math.pow(Math.max(0.01, survival5yr.male), 0.2)) * 0.614;
    const femaleMortRate = (1 - Math.pow(Math.max(0.01, survival5yr.female), 0.2)) * 0.614;

    // Geriatric care discount on senior mortality/illness (capped at 20% reduction)
    const geriatricDiscount = (c.minAge >= 65) ? Math.min(0.20, totalGeriatric * 0.02) : 0;
    
    const maleDeaths = c.male * (maleMortRate * (1 - geriatricDiscount));
    const femaleDeaths = c.female * (femaleMortRate * (1 - geriatricDiscount));

    annualDeathsThousands += (maleDeaths + femaleDeaths);

    c.male = Math.max(0, c.male - maleDeaths);
    c.female = Math.max(0, c.female - femaleDeaths);
  }

  // Convert from cohort units (thousands) to absolute individuals
  const annualDeaths = Math.round(annualDeathsThousands * 1000);

  // Calculate annual births based on reproductive female population (ages 20-44)
  let totalReproductiveWeightedFemales = 0;
  for (const c of cohorts) {
    if (AGE_FERTILITY_WEIGHTS[c.ageLabel]) {
      const weight = AGE_FERTILITY_WEIGHTS[c.ageLabel];
      totalReproductiveWeightedFemales += (c.female * weight);
    }
  }

  // Annual births in thousands calibrated to Japan empirical baseline (~727,000 births at TFR 1.20)
  // Penalize baseline birth trajectory if youth hope is below 50
  const hopePenalty = hopeIndex < 50 ? (50 - hopeIndex) * 0.005 : 0;
  const effectiveBaseTFR = Math.max(0.8, (tfr - hopePenalty));

  const annualBirthsThousands = (totalReproductiveWeightedFemales * (effectiveBaseTFR / 1.20) * 0.2222);
  const annualBirths = Math.round(annualBirthsThousands * 1000);

  // Shift 1/5th between cohorts each year to simulate continuous aging
  for (let i = cohorts.length - 1; i > 0; i--) {
    const shiftMale = cohorts[i - 1].male / 5;
    const shiftFemale = cohorts[i - 1].female / 5;
    
    cohorts[i - 1].male -= shiftMale;
    cohorts[i - 1].female -= shiftFemale;
    
    cohorts[i].male += shiftMale;
    cohorts[i].female += shiftFemale;
  }

  // Add newborn cohort 0-4 (50.8% male, 49.2% female sex ratio at birth)
  cohorts[0].male += (annualBirthsThousands * 0.508);
  cohorts[0].female += (annualBirthsThousands * 0.492);

  // Calculate new totals
  let totalPopThousands = 0;
  let youthThousands = 0;    // 0-14
  let workingThousands = 0;  // 15-64
  let elderlyThousands = 0;  // 65+

  for (const c of cohorts) {
    const cohortTotal = c.male + c.female;
    totalPopThousands += cohortTotal;
    if (c.maxAge <= 14) {
      youthThousands += cohortTotal;
    } else if (c.minAge >= 15 && c.maxAge <= 64) {
      workingThousands += cohortTotal;
    } else if (c.minAge >= 65) {
      elderlyThousands += cohortTotal;
    }
  }

  const totalPopulation = Math.round(totalPopThousands * 1000);
  const youthRatio = Math.round((youthThousands / totalPopThousands) * 1000) / 10;
  const workingRatio = Math.round((workingThousands / totalPopThousands) * 1000) / 10;
  const elderlyRatio = Math.round((elderlyThousands / totalPopThousands) * 1000) / 10;
  const dependencyRatio = Math.round(((youthThousands + elderlyThousands) / workingThousands) * 100) / 100;
  const naturalChange = annualBirths - annualDeaths;

  // Immigration net migration
  let netMigration = 80000; // baseline 80k/yr
  if (filteredActive.some(o => o.id === 'ord_high_skill_visa')) netMigration += 60000;
  if (filteredActive.some(o => o.id === 'ord_permanent_residency_family')) netMigration += 250000;
  if (filteredActive.some(o => o.id === 'ord_digital_nomad_visa')) netMigration += 40000;
  if (filteredActive.some(o => o.id === 'ord_video_game_curfew')) netMigration -= 50000; // youth fleeing
  if (filteredActive.some(o => o.id === 'ord_senior_labor_mandate')) netMigration -= 30000; // youth career flight

  // Update regional metrics
  const updatedRegional: Record<RegionType, RegionalDemographics> = {
    tokyo: {
      ...regionalData.tokyo,
      totalPopulation: Math.round(totalPopulation * 0.32),
      tfr: Math.max(0.80, tfr - 0.16 + (totalKodomoen >= 4 ? 0.05 : 0)),
      waitlistChildren: Math.max(0, 12000 - totalKodomoen * 2200),
      housingAffordability: Math.min(85, 30 + totalSatellite * 4),
      satisfaction: Math.min(95, 60 + totalKodomoen * 3),
    },
    regional: {
      ...regionalData.regional,
      totalPopulation: Math.round(totalPopulation * 0.48),
      tfr: Math.max(1.0, tfr + 0.05 + (totalKodomoen >= 3 ? 0.06 : 0)),
      waitlistChildren: Math.max(0, 5000 - totalKodomoen * 1800),
      housingAffordability: Math.min(90, 55 + totalSatellite * 5),
      satisfaction: Math.min(95, 65 + totalSatellite * 3 + totalAgriBots * 2),
    },
    rural: {
      ...regionalData.rural,
      totalPopulation: Math.round(totalPopulation * 0.20),
      tfr: Math.max(1.1, tfr + 0.18),
      waitlistChildren: 0,
      housingAffordability: 85,
      elderlyCount: Math.round(elderlyThousands * 1000 * 0.35),
      satisfaction: Math.min(95, 50 + totalAgriBots * 5 + totalGeriatric * 4),
    },
  };

  const newDemographics: NationalDemographics = {
    cohorts,
    totalPopulation,
    birthsThisYear: annualBirths,
    deathsThisYear: annualDeaths,
    netMigration,
    naturalChange,
    tfr,
    elderlyRatio,
    youthRatio,
    workingRatio,
    medianAge: Math.round(48.5 + (2075 - 2025) * (elderlyRatio / 100) * 0.2),
    dependencyRatio,
    youthHopeIndex: hopeIndex,
    lowFertilityTrapActive: lowFertilityTrap,
    synergyBonusActive: synergyBonus,
    eventTFRModifier: prevDemographics.eventTFRModifier,
    eventHopeModifier: prevDemographics.eventHopeModifier,
  };

  return {
    newDemographics,
    updatedRegional,
  };
}
