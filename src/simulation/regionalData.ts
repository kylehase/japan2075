import { GameState, RegionalMetricData, PrefecturalRegionId, MetricInspectionTarget, AgeCohort } from '../types/game';

// Base regional distribution models based on National Census and IPSS Regional Projections
export function computeRegionalMetrics(gameState: GameState): RegionalMetricData[] {
  const { demographics, economy, ordinances } = gameState;
  const totalPopMillions = demographics.totalPopulation / 1000000;
  const nationalTFR = demographics.tfr;
  const nationalHope = demographics.youthHopeIndex;
  const nationalElderly = demographics.elderlyRatio;

  // Active policy boosters
  const hasChildcareBoost = ordinances.some(o => o.active && o.category === 'family');
  const hasAkiyaReform = ordinances.some(o => o.active && o.id === 'fiscal_akiya_tax');
  const hasRoboticsBoost = ordinances.some(o => o.active && (o.category === 'technology' || o.category === 'automation'));

  const regions: RegionalMetricData[] = [
    {
      id: 'hokkaido',
      name: { en: 'Hokkaido', ja: '北海道' },
      gridX: 14,
      gridY: 2,
      lon: 142.6,
      lat: 43.4,
      populationMillions: Math.max(1.5, Number((totalPopMillions * 0.042).toFixed(2))),
      youthRatio: Math.max(7, Number((demographics.youthRatio * 0.95).toFixed(1))),
      workingRatio: Math.max(45, Number((demographics.workingRatio * 0.96).toFixed(1))),
      elderlyRatio: Math.min(48, Number((nationalElderly * 1.06).toFixed(1))),
      tfr: Number((nationalTFR * 0.98).toFixed(2)),
      hopeIndex: Number(Math.min(100, Math.max(10, nationalHope + 3)).toFixed(1)),
      housingCostBurden: 28,
      akiyaRate: Math.max(8, Number((18.5 - (hasAkiyaReform ? 4 : 0)).toFixed(1))),
      economicOutputTrillion: Number((economy.gdp * 0.038).toFixed(1)),
      sentimentStatus: nationalHope > 65 ? 'happy' : nationalHope > 40 ? 'neutral' : 'worried',
      description: {
        en: 'Northern agricultural and renewable energy frontier. Facing severe municipal consolidation pressures.',
        ja: '食料安全保障と再生可能エネルギーの拠点。広域自治体の再編とインフラ維持が課題。',
      },
    },
    {
      id: 'tohoku',
      name: { en: 'Tohoku', ja: '東北' },
      gridX: 12,
      gridY: 6,
      lon: 140.8,
      lat: 39.2,
      populationMillions: Math.max(2.5, Number((totalPopMillions * 0.068).toFixed(2))),
      youthRatio: Math.max(6.5, Number((demographics.youthRatio * 0.88).toFixed(1))),
      workingRatio: Math.max(44, Number((demographics.workingRatio * 0.94).toFixed(1))),
      elderlyRatio: Math.min(52, Number((nationalElderly * 1.15).toFixed(1))),
      tfr: Number((nationalTFR * 0.94).toFixed(2)),
      hopeIndex: Number(Math.min(100, Math.max(10, nationalHope - 4)).toFixed(1)),
      housingCostBurden: 24,
      akiyaRate: Math.max(10, Number((21.2 - (hasAkiyaReform ? 5 : 0)).toFixed(1))),
      economicOutputTrillion: Number((economy.gdp * 0.055).toFixed(1)),
      sentimentStatus: nationalHope > 60 ? 'happy' : nationalHope > 38 ? 'neutral' : 'worried',
      description: {
        en: 'Depopulation frontline with advanced aging. Pioneering community transport and telemedicine networks.',
        ja: '過疎化と超高齢化の最前線。地域包括ケアと自動運転交通の実証先進地域。',
      },
    },
    {
      id: 'kanto',
      name: { en: 'Kanto (Greater Tokyo)', ja: '関東（首都圏・東京）' },
      gridX: 10,
      gridY: 9,
      lon: 139.8,
      lat: 35.8,
      populationMillions: Math.max(18.0, Number((totalPopMillions * 0.355).toFixed(2))),
      youthRatio: Math.max(8.0, Number((demographics.youthRatio * 0.98).toFixed(1))),
      workingRatio: Math.max(52, Number((demographics.workingRatio * 1.08).toFixed(1))),
      elderlyRatio: Math.min(42, Number((nationalElderly * 0.88).toFixed(1))),
      tfr: Number((nationalTFR * 0.86).toFixed(2)), // Tokyo has notoriously lowest TFR ~1.0
      hopeIndex: Number(Math.min(100, Math.max(10, nationalHope - 6)).toFixed(1)), // High housing cost stress
      housingCostBurden: 86,
      akiyaRate: Math.max(4, Number((11.4 - (hasAkiyaReform ? 2 : 0)).toFixed(1))),
      economicOutputTrillion: Number((economy.gdp * 0.41).toFixed(1)),
      sentimentStatus: nationalHope > 70 ? 'happy' : nationalHope > 45 ? 'neutral' : 'worried',
      description: {
        en: 'Economic powerhouse and demographic black hole. Extreme housing costs and long commutes suppress fertility.',
        ja: '経済の中枢であり人口の極大集積地。高い住居費と教育費が若年層の出生行動を制約。',
      },
    },
    {
      id: 'chubu',
      name: { en: 'Chubu (Nagoya / Tokai)', ja: '中部（東海・名古屋）' },
      gridX: 7,
      gridY: 11,
      lon: 137.2,
      lat: 36.0,
      populationMillions: Math.max(8.0, Number((totalPopMillions * 0.172).toFixed(2))),
      youthRatio: Math.max(8.5, Number((demographics.youthRatio * 1.04).toFixed(1))),
      workingRatio: Math.max(50, Number((demographics.workingRatio * 1.02).toFixed(1))),
      elderlyRatio: Math.min(45, Number((nationalElderly * 0.96).toFixed(1))),
      tfr: Number((nationalTFR * 1.10).toFixed(2)),
      hopeIndex: Number(Math.min(100, Math.max(10, nationalHope + 4)).toFixed(1)),
      housingCostBurden: 48,
      akiyaRate: Math.max(6, Number((13.8 - (hasAkiyaReform ? 3 : 0)).toFixed(1))),
      economicOutputTrillion: Number((economy.gdp * 0.205).toFixed(1)),
      sentimentStatus: nationalHope > 62 ? 'happy' : nationalHope > 40 ? 'neutral' : 'worried',
      description: {
        en: 'Industrial and advanced automotive robotics heartland. Strong manufacturing wage base and balanced demographics.',
        ja: '自動車・ロボティクス・高度製造業の心臓部。堅調な製造業雇用と比較的高い出生傾向。',
      },
    },
    {
      id: 'kansai',
      name: { en: 'Kansai (Keihanshin / Osaka)', ja: '関西（近畿・京阪神）' },
      gridX: 5,
      gridY: 13,
      lon: 135.5,
      lat: 34.8,
      populationMillions: Math.max(9.0, Number((totalPopMillions * 0.162).toFixed(2))),
      youthRatio: Math.max(8.0, Number((demographics.youthRatio * 1.00).toFixed(1))),
      workingRatio: Math.max(48, Number((demographics.workingRatio * 0.99).toFixed(1))),
      elderlyRatio: Math.min(46, Number((nationalElderly * 1.01).toFixed(1))),
      tfr: Number((nationalTFR * 0.98).toFixed(2)),
      hopeIndex: Number(Math.min(100, Math.max(10, nationalHope + 1)).toFixed(1)),
      housingCostBurden: 56,
      akiyaRate: Math.max(7, Number((15.2 - (hasAkiyaReform ? 3 : 0)).toFixed(1))),
      economicOutputTrillion: Number((economy.gdp * 0.168).toFixed(1)),
      sentimentStatus: nationalHope > 65 ? 'happy' : nationalHope > 42 ? 'neutral' : 'worried',
      description: {
        en: 'Historic cultural capital and biotech hub. Active universal preschool tuition support experiments.',
        ja: '歴史文化とライフサイエンスの集積地。高校・大学授業料無償化など先進施策を展開。',
      },
    },
    {
      id: 'chugoku',
      name: { en: 'Chugoku (San\'yo / San\'in)', ja: '中国（山陽・山陰）' },
      gridX: 3,
      gridY: 15,
      lon: 132.8,
      lat: 34.8,
      populationMillions: Math.max(2.5, Number((totalPopMillions * 0.058).toFixed(2))),
      youthRatio: Math.max(8.0, Number((demographics.youthRatio * 1.02).toFixed(1))),
      workingRatio: Math.max(46, Number((demographics.workingRatio * 0.96).toFixed(1))),
      elderlyRatio: Math.min(49, Number((nationalElderly * 1.08).toFixed(1))),
      tfr: Number((nationalTFR * 1.15).toFixed(2)),
      hopeIndex: Number(Math.min(100, Math.max(10, nationalHope + 3)).toFixed(1)),
      housingCostBurden: 34,
      akiyaRate: Math.max(9, Number((17.9 - (hasAkiyaReform ? 4 : 0)).toFixed(1))),
      economicOutputTrillion: Number((economy.gdp * 0.056).toFixed(1)),
      sentimentStatus: nationalHope > 60 ? 'happy' : nationalHope > 38 ? 'neutral' : 'worried',
      description: {
        en: 'Seto Inland Sea chemical and maritime industry belt with high resilience and strong family ties.',
        ja: '瀬戸内重化学・造船コンビナートと山陰農業地帯。家族ネットワークが厚く出生率が底堅い。',
      },
    },
    {
      id: 'shikoku',
      name: { en: 'Shikoku', ja: '四国' },
      gridX: 4,
      gridY: 18,
      lon: 133.5,
      lat: 33.7,
      populationMillions: Math.max(1.2, Number((totalPopMillions * 0.030).toFixed(2))),
      youthRatio: Math.max(7.5, Number((demographics.youthRatio * 0.98).toFixed(1))),
      workingRatio: Math.max(44, Number((demographics.workingRatio * 0.94).toFixed(1))),
      elderlyRatio: Math.min(52, Number((nationalElderly * 1.14).toFixed(1))),
      tfr: Number((nationalTFR * 1.18).toFixed(2)),
      hopeIndex: Number(Math.min(100, Math.max(10, nationalHope + 5)).toFixed(1)),
      housingCostBurden: 26,
      akiyaRate: Math.max(10, Number((22.4 - (hasAkiyaReform ? 6 : 0)).toFixed(1))),
      economicOutputTrillion: Number((economy.gdp * 0.028).toFixed(1)),
      sentimentStatus: nationalHope > 60 ? 'happy' : nationalHope > 38 ? 'neutral' : 'worried',
      description: {
        en: 'Rural revitalization and satellite office pioneers (Kamiyama Model). High akiya vacancy transition potential.',
        ja: '神山町モデルなどサテライトオフィス誘致の先駆け。空き家再生とワーケーションの聖地。',
      },
    },
    {
      id: 'kyushu',
      name: { en: 'Kyushu & Okinawa', ja: '九州・沖縄' },
      gridX: 1,
      gridY: 20,
      lon: 130.8,
      lat: 32.8,
      populationMillions: Math.max(6.0, Number((totalPopMillions * 0.113).toFixed(2))),
      youthRatio: Math.max(10.0, Number((demographics.youthRatio * 1.20).toFixed(1))),
      workingRatio: Math.max(48, Number((demographics.workingRatio * 0.98).toFixed(1))),
      elderlyRatio: Math.min(46, Number((nationalElderly * 0.98).toFixed(1))),
      tfr: Number((nationalTFR * 1.28).toFixed(2)), // Kyushu/Okinawa has highest baseline fertility
      hopeIndex: Number(Math.min(100, Math.max(10, nationalHope + 9)).toFixed(1)),
      housingCostBurden: 36,
      akiyaRate: Math.max(8, Number((16.8 - (hasAkiyaReform ? 4 : 0)).toFixed(1))),
      economicOutputTrillion: Number((economy.gdp * 0.098).toFixed(1)),
      sentimentStatus: nationalHope > 55 ? 'happy' : 'neutral',
      description: {
        en: 'Silicon Island semiconductor boom and Japan’s highest fertility region with close community support.',
        ja: 'シリコンアイランド半導体投資ラッシュと全国最高水準の出生率を誇る希望の地。',
      },
    },
  ];

  return regions;
}

export function buildMetricInspection(
  targetType: 'region' | 'hope_monolith' | 'pyramid_cohort' | 'fiscal_monolith',
  regionId?: PrefecturalRegionId,
  cohort?: AgeCohort,
  gameState?: GameState
): MetricInspectionTarget | null {
  if (!gameState) return null;

  if (targetType === 'region' && regionId) {
    const regions = computeRegionalMetrics(gameState);
    const region = regions.find(r => r.id === regionId);
    if (!region) return null;

    return {
      type: 'region',
      regionId,
      title: region.name,
      category: { en: 'Prefectural Macro Block', ja: '広域ブロック総合統計' },
      stat1: {
        label: { en: 'Population Size', ja: '人口規模' },
        value: `${region.populationMillions}M`,
      },
      stat2: {
        label: { en: 'Regional TFR', ja: '地域合計特殊出生率' },
        value: `${region.tfr.toFixed(2)}`,
      },
      stat3: {
        label: { en: 'Youth Hope Index', ja: '若者希望指数' },
        value: `${region.hopeIndex.toFixed(1)} / 100`,
      },
      stat4: {
        label: { en: 'Elderly Share (65+)', ja: '高齢化率' },
        value: `${region.elderlyRatio}%`,
      },
      summary: region.description,
    };
  }

  if (targetType === 'hope_monolith') {
    const { youthHopeIndex, lowFertilityTrapActive, synergyBonusActive } = gameState.demographics;
    return {
      type: 'hope_monolith',
      title: { en: 'Youth Hope', ja: '若者希望' },
      category: { en: 'Psychological & Social Indicator', ja: '社会心理・意識指標' },
      stat1: {
        label: { en: 'Youth Hope Score', ja: '若者希望指数' },
        value: `${youthHopeIndex.toFixed(1)} / 100`,
      },
      stat2: {
        label: { en: 'Cabinet Approval', ja: '内閣支持率' },
        value: `${gameState.cabinetApproval.toFixed(1)}%`,
      },
      stat3: {
        label: { en: 'Silver Democracy Index', ja: 'シルバー民主主義度' },
        value: `${gameState.silverDemocracyIndex}% 65+`,
      },
      stat4: {
        label: { en: 'Macro Synergy State', ja: '政策相乗効果' },
        value: lowFertilityTrapActive ? '🚨 Trap Active' : synergyBonusActive ? '✨ Synergy Boost (1.25x)' : 'Normal Baseline',
      },
      summary: {
        en: 'Aggregates disposable real wage growth, housing affordability, daycare accessibility, and future pension security.',
        ja: '実質可処分所得、住居費負担、保育園アクセス、将来の年金信頼度から若年層の婚姻・出生意欲を算出。',
      },
    };
  }

  if (targetType === 'fiscal_monolith') {
    const { economy } = gameState;
    return {
      type: 'fiscal_monolith',
      title: { en: 'Fiscal Solvency', ja: '国家財政' },
      category: { en: 'Macroeconomic Health', ja: 'マクロ経済・財政信認' },
      stat1: {
        label: { en: 'Debt-to-GDP Ratio', ja: '債務残高対GDP比' },
        value: `${economy.debtToGDP.toFixed(1)}%`,
      },
      stat2: {
        label: { en: '10Y JGB Bond Yield', ja: '長期国債利回り' },
        value: `${economy.jgbYield.toFixed(2)}%`,
      },
      stat3: {
        label: { en: 'Annual Balance', ja: '基礎的財政収支' },
        value: economy.annualDeficit > 0 ? `-¥${(economy.annualDeficit/1000).toFixed(1)}T` : `+¥${Math.abs(economy.annualDeficit/1000).toFixed(1)}T`,
      },
      stat4: {
        label: { en: 'Sovereign Credit Rating', ja: '国債信用格付' },
        value: economy.creditRating,
      },
      summary: {
        en: 'Tracks fiscal sustainability, JGB market yield pressure, and social security burden under demographic decline.',
        ja: '高齢化に伴う社会保障給付増と国債利払い費の増大を監視。格下げや金利急騰を防ぐ規律が必要。',
      },
    };
  }

  if (cohort) {
    return {
      type: 'pyramid_cohort',
      title: { en: `Age Cohort: ${cohort.ageLabel}`, ja: `年齢階級：${cohort.ageLabel}歳` },
      category: { en: 'IPSS Discrete Demographic Cohort', ja: '社人研 5歳階級別人口' },
      stat1: {
        label: { en: 'Male Population', ja: '男性人口' },
        value: `${Math.round(cohort.male).toLocaleString()}k`,
      },
      stat2: {
        label: { en: 'Female Population', ja: '女性人口' },
        value: `${Math.round(cohort.female).toLocaleString()}k`,
      },
      stat3: {
        label: { en: 'Total in Cohort', ja: '階級合計人口' },
        value: `${(Math.round(cohort.male + cohort.female) / 1000).toFixed(2)}M`,
      },
      summary: {
        en: `Represents Japanese citizens aged ${cohort.minAge} to ${cohort.maxAge}. Advances through discrete aging cycles each year.`,
        ja: `${cohort.minAge}歳〜${cohort.maxAge}歳の国民層。毎年の加齢推移、出生、死亡率により推移。`,
      },
    };
  }

  return null;
}
