import {
  BuildingConfig,
  Ordinance,
  OrdinanceCategory,
  AgeCohort,
  PlacedBuildingType,
  AgendaContext,
} from '../types/game';
import { ADDITIONAL_ORDINANCES } from './additionalOrdinances';

// 2025 Base Age Cohort distribution in thousands (approx 124.5 million total)
// Based on Statistics Bureau of Japan (総務省統計局) & IPSS (社人研) 2024/2025
export const INITIAL_COHORTS_2025: AgeCohort[] = [
  { ageLabel: '0–4',   minAge: 0,  maxAge: 4,  male: 1980, female: 1880 },
  { ageLabel: '5–9',   minAge: 5,  maxAge: 9,  male: 2350, female: 2240 },
  { ageLabel: '10–14', minAge: 10, maxAge: 14, male: 2600, female: 2470 },
  { ageLabel: '15–19', minAge: 15, maxAge: 19, male: 2820, female: 2680 },
  { ageLabel: '20–24', minAge: 20, maxAge: 24, male: 3100, female: 2950 },
  { ageLabel: '25–29', minAge: 25, maxAge: 29, male: 3250, female: 3100 },
  { ageLabel: '30–34', minAge: 30, maxAge: 34, male: 3450, female: 3300 },
  { ageLabel: '35–39', minAge: 35, maxAge: 39, male: 3750, female: 3600 },
  { ageLabel: '40–44', minAge: 40, maxAge: 44, male: 4100, female: 3950 },
  { ageLabel: '45–49', minAge: 45, maxAge: 49, male: 4600, female: 4450 },
  { ageLabel: '50–54', minAge: 50, maxAge: 54, male: 4950, female: 4800 },
  { ageLabel: '55–59', minAge: 55, maxAge: 59, male: 4400, female: 4300 },
  { ageLabel: '60–64', minAge: 60, maxAge: 64, male: 3850, female: 3800 },
  { ageLabel: '65–69', minAge: 65, maxAge: 69, male: 3900, female: 4000 },
  { ageLabel: '70–74', minAge: 70, maxAge: 74, male: 4400, female: 4800 },
  { ageLabel: '75–79', minAge: 75, maxAge: 79, male: 3600, female: 4200 },
  { ageLabel: '80–84', minAge: 80, maxAge: 84, male: 2500, female: 3300 },
  { ageLabel: '85–89', minAge: 85, maxAge: 89, male: 1400, female: 2300 },
  { ageLabel: '90+',   minAge: 90, maxAge: 120, male: 750,  female: 1800 },
];

export const INITIAL_COHORTS = INITIAL_COHORTS_2025;

export const INITIAL_ECONOMY = {
  humanWorkforce: 57.0, // million
  foreignWorkers: 2.1,  // million
  roboticsLaborEquivalents: 0.5,
  effectiveWorkforce: 59.6,
  laborProductivity: 1.0,
  gdp: 590.0, // ¥590 Trillion
  gdpPerCapita: 4.74,
  gdpGrowthRate: 0.8,
  nationalDebt: 1545.0, // ¥1,545 Trillion
  debtToGDP: 261.8,
  jgbYield: 1.15,
  creditRating: 'A' as const,
  taxIncome: 22000,
  taxCorporate: 15000,
  taxConsumption: 24000,
  totalRevenue: 61000,
  expenditurePensions: 28000,
  expenditureHealthcare: 22000,
  expenditureChildcare: 6000,
  expenditureMaintenance: 1200,
  expenditureDebtServicing: 17700,
  totalExpenditure: 74900,
  annualDeficit: 13900,
  treasuryBalance: 42000, // ¥42 Trillion liquid reserves
  treasury: 42000,
};

export const INITIAL_REGIONAL_DEMOGRAPHICS = {
  tokyo: {
    region: 'tokyo' as const,
    name: { en: 'Tokyo Megalopolis Core', ja: '東京大都市圏コア' },
    totalPopulation: 39840000,
    elderlyCount: 9560000,
    youthCount: 4380000,
    workingCount: 25900000,
    tfr: 1.04,
    akiyaCount: 420,
    waitlistChildren: 8400,
    housingAffordability: 35,
    workOvertimeHours: 42,
    averageWage: 6.2,
    satisfaction: 65,
  },
  regional: {
    region: 'regional' as const,
    name: { en: 'Regional Prefectural Hubs', ja: '地方中核都市・郊外ハブ' },
    totalPopulation: 59760000,
    elderlyCount: 18520000,
    youthCount: 6870000,
    workingCount: 34370000,
    tfr: 1.28,
    akiyaCount: 3200,
    waitlistChildren: 3100,
    housingAffordability: 60,
    workOvertimeHours: 26,
    averageWage: 4.5,
    satisfaction: 68,
  },
  rural: {
    region: 'rural' as const,
    name: { en: 'Depopulating Rural Chiho', ja: '過疎地方・農山漁村' },
    totalPopulation: 24900000,
    elderlyCount: 9020000,
    youthCount: 2060000,
    workingCount: 13820000,
    tfr: 1.45,
    akiyaCount: 8400,
    waitlistChildren: 0,
    housingAffordability: 85,
    workOvertimeHours: 12,
    averageWage: 3.2,
    satisfaction: 52,
  },
};

// Age-specific fertility distribution weight among reproductive age females (20–44)
export const AGE_FERTILITY_WEIGHTS: Record<string, number> = {
  '20–24': 0.10,
  '25–29': 0.32,
  '30–34': 0.38,
  '35–39': 0.17,
  '40–44': 0.03,
};

// 5-Year Survival Rates based on Japan MHLW Standard Life Table
export const BASE_5YR_SURVIVAL_RATES: Record<string, { male: number; female: number }> = {
  '0–4':   { male: 0.9985, female: 0.9988 },
  '5–9':   { male: 0.9992, female: 0.9994 },
  '10–14': { male: 0.9990, female: 0.9993 },
  '15–19': { male: 0.9980, female: 0.9986 },
  '20–24': { male: 0.9972, female: 0.9980 },
  '25–29': { male: 0.9965, female: 0.9975 },
  '30–34': { male: 0.9950, female: 0.9968 },
  '35–39': { male: 0.9928, female: 0.9952 },
  '40–44': { male: 0.9890, female: 0.9925 },
  '45–49': { male: 0.9820, female: 0.9880 },
  '50–54': { male: 0.9700, female: 0.9810 },
  '55–59': { male: 0.9520, female: 0.9710 },
  '60–64': { male: 0.9250, female: 0.9560 },
  '65–69': { male: 0.8850, female: 0.9320 },
  '70–74': { male: 0.8200, female: 0.8950 },
  '75–79': { male: 0.7250, female: 0.8350 },
  '80–84': { male: 0.5850, female: 0.7300 },
  '85–89': { male: 0.4100, female: 0.5650 },
  '90+':   { male: 0.2200, female: 0.3200 },
};

export const BUILDING_CONFIGS: Record<PlacedBuildingType, BuildingConfig> = {
  kodomoen: {
    type: 'kodomoen',
    name: {
      en: 'Public Kodomo-en & Daycare',
      ja: '認定こども園・公立保育園',
    },
    cost: 120, // ¥120 Billion
    maintenance: 18, // ¥18B/yr
    radius: 5,
    description: {
      en: 'Integrated early childhood education and care facility. Eliminates local waitlists and boosts family childbearing intentions.',
      ja: '幼保一元化施設。地域の待機児童を解消し、二人目・三人目の出産意欲を促進します。',
    },
    impactDescription: {
      en: '+0.04 Local TFR, removes 1,200 waitlisted children in radius.',
      ja: '影響圏内のTFR+0.04、待機児童を1,200人解消。',
    },
    allowedRegions: ['tokyo', 'regional', 'rural'],
    icon: 'Baby',
  },
  geriatric_care: {
    type: 'geriatric_care',
    name: {
      en: 'Geriatric Integrated Care Hub',
      ja: '地域包括ケア・医療拠点',
    },
    cost: 180,
    maintenance: 25,
    radius: 6,
    description: {
      en: 'Community-based medical and nursing care hub. Lowers emergency hospitalization costs and frees family caregivers to rejoin the workforce.',
      ja: '在宅医療と介護を一体提供。高齢者の医療費を抑制し、家族の介護離職を防ぎます。',
    },
    impactDescription: {
      en: '-15% Local Senior Medical Outlays, +800 re-entering workers.',
      ja: '高齢者医療費-15%、介護離職防止で労働力+800人。',
    },
    allowedRegions: ['tokyo', 'regional', 'rural'],
    icon: 'HeartPulse',
  },
  satellite_office: {
    type: 'satellite_office',
    name: {
      en: 'Suburban Remote Satellite Office',
      ja: 'サテライトオフィス・テレワーク拠点',
    },
    cost: 90,
    maintenance: 12,
    radius: 4,
    description: {
      en: 'Decentralizes high-paying corporate roles out of Tokyo. Relieves hyper-dense urban rent pressure and revitalizes regional family housing.',
      ja: '都心の業務機能を郊外・地方へ分散。住宅費負担を下げ、地方の若年定住を促進。',
    },
    impactDescription: {
      en: '+12% Housing Affordability in radius, slows rural youth outflow.',
      ja: '周辺の住宅負担感を改善、地方からの若者流出を抑制。',
    },
    allowedRegions: ['regional', 'rural'],
    icon: 'Building2',
  },
  agri_robotics: {
    type: 'agri_robotics',
    name: {
      en: 'Automated Agri-Robotics Facility',
      ja: 'スマート農業・物流ロボティクス拠点',
    },
    cost: 220,
    maintenance: 30,
    radius: 7,
    description: {
      en: 'Autonomous tractors, harvest drones, and AI logistics center. Replaces human labor shortages in depopulated farming & regional zones.',
      ja: '自動収穫ドローンや自律トラクターを展開。過疎地の農地荒廃を防ぎ、生産性を維持。',
    },
    impactDescription: {
      en: '+5,000 Robotic Labor Equivalents, prevents farmland abandonment.',
      ja: '自動化労働換算+5,000人、耕作放棄地化を阻止。',
    },
    allowedRegions: ['regional', 'rural'],
    icon: 'Bot',
  },
  shinkansen_station: {
    type: 'shinkansen_station',
    name: {
      en: 'Regional High-Speed Rail Station',
      ja: '新幹線・高速鉄道アクセス駅',
    },
    cost: 450,
    maintenance: 45,
    radius: 8,
    description: {
      en: 'High-speed transit interchange connecting regional prefecture to Tokyo in under 60 minutes. Elevates local land value and attracts young families.',
      ja: '都心への通勤・通学を劇的に高速化。地価を向上させ、子育て世代の移住を呼び込みます。',
    },
    impactDescription: {
      en: '+25% Land Value, +15% Local Satisfaction, links rural economy.',
      ja: '地価+25%、住民満足度+15%、地方創生を加速。',
    },
    allowedRegions: ['regional', 'rural'],
    icon: 'TrainTrack',
  },
  maternity_park: {
    type: 'maternity_park',
    name: {
      en: 'Family Green Maternity Plaza',
      ja: '子育て世代・緑地ふれあい広場',
    },
    cost: 60,
    maintenance: 8,
    radius: 4,
    description: {
      en: 'Spacious child-friendly park with play plazas, splash fountains, and community parent support centers.',
      ja: '親子の交流広場や遊具を備えた公園。子育て世帯の心理的ストレスを軽減します。',
    },
    impactDescription: {
      en: '+4 Youth Hope Index, +8% Local Well-being.',
      ja: '若者希望指数+4、地域の幸福度+8%。',
    },
    allowedRegions: ['tokyo', 'regional', 'rural'],
    icon: 'Trees',
  },
};

export const INITIAL_ORDINANCES: Ordinance[] = [
  // --- FAMILY ---
  {
    id: 'ord_universal_child_allowance',
    category: 'family',
    name: {
      en: 'Universal Monthly Child Allowance (¥50,000/mo)',
      ja: '児童手当の大幅拡充（月5万円給付）',
    },
    description: {
      en: 'Direct unconditional cash transfer to all families for each child until age 18. Strongly supported by young parents.',
      ja: '高校卒業までの全ての子どもに月5万円を無所得制限で給付。若年層の強い支持を獲得。',
    },
    impactSummary: {
      en: '+0.08 National TFR, +6 Youth Hope, Cost: ¥2,400B/yr.',
      ja: '全国TFR +0.08、若者希望指数 +6、歳出 +2.4兆円/年。',
    },
    annualCostBillion: 2400,
    tfrDelta: 0.08,
    hopeIndexDelta: 6,
    productivityDelta: 0,
    seniorApprovalDelta: -4,
    youthApprovalDelta: 16,
    active: false,
    unlockedYear: 2025,
    replaces: ['ord_universal_child_allowance_100k'],
  },
  {
    id: 'ord_universal_child_allowance_100k',
    category: 'family',
    name: {
      en: 'Universal Monthly Child Allowance (¥100,000/mo)',
      ja: '児童手当の超大型拡充（月10万円給付）',
    },
    description: {
      en: 'Extreme cash transfer to all families for each child until age 18. Highly controversial due to devastating fiscal cost.',
      ja: '高校卒業までの全ての子どもに月10万円を無所得制限で給付。出生率は上がるが、財政破綻の危機を招く。',
    },
    impactSummary: {
      en: '+0.15 National TFR, +25 Youth Hope, ruinous cost (-¥8,400B/yr).',
      ja: '全国TFR +0.15、若者希望指数 +25、超巨額歳出 +8兆4000億円/年。',
    },
    annualCostBillion: 8400,
    tfrDelta: 0.15,
    hopeIndexDelta: 25,
    productivityDelta: -0.01,
    seniorApprovalDelta: -10,
    youthApprovalDelta: 25,
    active: false,
    unlockedYear: 2025,
    replaces: ['ord_universal_child_allowance'],
  },
  {
    id: 'ord_tax_free_children',
    category: 'family',
    name: {
      en: 'Zero Income Tax for Mothers of 3+ Children',
      ja: '第3子出産で所得税一生涯免除（ハンガリー方式）',
    },
    description: {
      en: 'Completely exempts mothers of three or more children from national income tax for life. Highly effective but criticized for gender bias.',
      ja: '第3子を出産した女性の所得税を一生涯免除する。多子世帯は激増するが、性差別との批判も強い。',
    },
    impactSummary: {
      en: '+0.12 National TFR, -¥1,500B Tax Base, polarizes voters.',
      ja: '全国TFR +0.12、税収減 -1兆5000億円/年、世論が二極化。',
    },
    annualCostBillion: 1500,
    tfrDelta: 0.12,
    hopeIndexDelta: 5,
    productivityDelta: -0.02,
    seniorApprovalDelta: -5,
    youthApprovalDelta: 10,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_means_tested_housing',
    category: 'family',
    name: {
      en: 'Targeted Marriage & Housing Subsidies for Under-35s',
      ja: '若年・新婚世帯向け住宅家賃補助＆優先入居',
    },
    description: {
      en: 'Subsidizes down payments and rent for couples under 35 with children, slashing Tokyo & suburban barrier to entry.',
      ja: '35歳以下の新婚・子育て世帯に家賃補助と公営住宅の優先割当を実施し、結婚の障壁を緩和。',
    },
    impactSummary: {
      en: '+0.05 National TFR, +8 Youth Hope, Cost: ¥850B/yr.',
      ja: '全国TFR +0.05、若者希望指数 +8、歳出 +8,500億円/年。',
    },
    annualCostBillion: 850,
    tfrDelta: 0.05,
    hopeIndexDelta: 8,
    productivityDelta: 0.01,
    seniorApprovalDelta: -1,
    youthApprovalDelta: 12,
    active: false,
    unlockedYear: 2025,
    replaces: ['ord_marriage_starter_housing_grant'],
  },
  {
    id: 'ord_free_early_childcare_ivg',
    category: 'family',
    name: {
      en: 'State-Funded Daycares & Pediatric Care',
      ja: '認定こども園の完全無償化＆医療費免除',
    },
    description: {
      en: 'Fully covers public and private daycare fees from age 0 to 5 and provides 100% free pediatric healthcare.',
      ja: '0歳からの保育料を完全無償化し、24時間対応の病児保育・小児医療費を国費で全額負担。',
    },
    impactSummary: {
      en: '+0.09 National TFR, +10 Youth Hope, Cost: ¥1,600B/yr.',
      ja: '全国TFR +0.09、若者希望指数 +10、歳出 +1.6兆円/年。',
    },
    annualCostBillion: 1600,
    tfrDelta: 0.09,
    hopeIndexDelta: 10,
    productivityDelta: 0.01,
    seniorApprovalDelta: -2,
    youthApprovalDelta: 15,
    active: false,
    unlockedYear: 2025,
    replaces: ['ord_universal_childcare_access'],
  },
  {
    id: 'ord_state_matchmaking_app',
    category: 'family',
    name: {
      en: 'State-Run AI Matchmaking App',
      ja: '国営AIマッチングアプリの無償提供',
    },
    description: {
      en: 'A free, nationalized dating application using AI and MyNumber civic registries to verify identities and securely match citizens.',
      ja: 'マイナンバーを活用して身元を完全保証する国営のマッチングアプリ。安心安全な出会いを提供。',
    },
    impactSummary: {
      en: '+0.01 National TFR, +2 Youth Hope, Cost: ¥20B/yr.',
      ja: '全国TFR +0.01、若者希望指数 +2、歳出 +200億円/年。',
    },
    annualCostBillion: 20,
    tfrDelta: 0.01,
    hopeIndexDelta: 2,
    productivityDelta: 0,
    seniorApprovalDelta: -1,
    youthApprovalDelta: 5,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_third_child_bonus_10m',
    category: 'family',
    name: {
      en: '¥10 Million Third-Child Bonus',
      ja: '第3子出産1000万円ボーナス',
    },
    description: {
      en: "A massive lump-sum payout of 10 million yen specifically awarded upon the birth of a family's third child.",
      ja: '第3子誕生時に現金1000万円を一括支給。多子世帯の劇的な増加を狙う荒療治。',
    },
    impactSummary: {
      en: '+0.06 National TFR, +3 Youth Hope, Cost: ¥1,000B/yr.',
      ja: '全国TFR +0.06、若者希望指数 +3、歳出 +1兆円/年。',
    },
    annualCostBillion: 1000,
    tfrDelta: 0.06,
    hopeIndexDelta: 3,
    productivityDelta: 0,
    seniorApprovalDelta: -4,
    youthApprovalDelta: 8,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_video_game_curfew',
    category: 'family',
    name: {
      en: 'National Video Game Curfew',
      ja: '未成年ネット・ゲーム利用時間規制',
    },
    description: {
      en: 'Mandates ISPs and gaming companies to enforce a 90-minute daily limit for minors to focus on studying and physical health.',
      ja: '青少年のスマホ・ゲーム利用を1日90分に制限する。高齢層は支持するが、若者の激しい怒りを買う。',
    },
    impactSummary: {
      en: '-0.01 TFR, -15 Youth Hope, +10 Senior Approval.',
      ja: '全国TFR -0.01、若者希望指数 -15、高齢者支持 +10。',
    },
    annualCostBillion: 10,
    tfrDelta: -0.01,
    hopeIndexDelta: -15,
    productivityDelta: 0.01,
    seniorApprovalDelta: 10,
    youthApprovalDelta: -25,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_egg_freezing',
    category: 'family',
    name: {
      en: 'Mandatory Egg Freezing Subsidies',
      ja: '20代女性の卵子凍結全額補助',
    },
    description: {
      en: 'Provides 100% subsidies for elective egg freezing for women in their 20s, allowing for delayed family planning without losing fertility.',
      ja: '20代女性の卵子凍結費用を国が全額負担。キャリアと出産の両立を支援する。',
    },
    impactSummary: {
      en: '+0.04 National TFR, +5 Youth Hope, Cost: ¥300B/yr.',
      ja: '全国TFR +0.04、若者希望指数 +5、歳出 +3,000億円/年。',
    },
    annualCostBillion: 300,
    tfrDelta: 0.04,
    hopeIndexDelta: 5,
    productivityDelta: 0.02,
    seniorApprovalDelta: -2,
    youthApprovalDelta: 12,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_subsidized_domestic_helpers',
    category: 'family',
    name: {
      en: 'Subsidized Domestic Helpers',
      ja: '共働き世帯向け家事代行・ベビーシッター補助',
    },
    description: {
      en: 'Provides heavily subsidized domestic helpers and babysitters to dual-income families, reducing the burden of the "second shift".',
      ja: '共働き世帯の家事・育児負担を減らすため、家事代行やシッター費用を大幅に補助。',
    },
    impactSummary: {
      en: '+0.03 National TFR, +4 Youth Hope, Cost: ¥450B/yr.',
      ja: '全国TFR +0.03、若者希望指数 +4、歳出 +4,500億円/年。',
    },
    annualCostBillion: 450,
    tfrDelta: 0.03,
    hopeIndexDelta: 4,
    productivityDelta: 0.05,
    seniorApprovalDelta: -1,
    youthApprovalDelta: 9,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_joint_custody',
    category: 'family',
    name: {
      en: 'Abolishment of Joint-Custody Ban',
      ja: '共同親権の完全合法化・義務化',
    },
    description: {
      en: 'Replaces sole custody default with mandatory joint custody post-divorce, aiming to keep both parents involved in child-rearing.',
      ja: '離婚後の単独親権制度を廃止し、原則として共同親権を義務化。両親が育児に関わる環境を整備。',
    },
    impactSummary: {
      en: '+0.01 National TFR, +1 Youth Hope, Divides public opinion.',
      ja: '全国TFR +0.01、若者希望指数 +1、賛否が大きく分かれる。',
    },
    annualCostBillion: 5,
    tfrDelta: 0.01,
    hopeIndexDelta: 1,
    productivityDelta: 0,
    seniorApprovalDelta: 0,
    youthApprovalDelta: 2,
    active: false,
    unlockedYear: 2025,
  },

  // --- LABOR ---
  {
    id: 'ord_mandatory_paternity_leave',
    category: 'labor',
    name: {
      en: 'Mandatory 6-Month Paternity Leave',
      ja: '男性育休（半年）の完全義務化',
    },
    description: {
      en: 'Forces all companies to grant and enforce 6 months of fully paid paternity leave for fathers. Heavy corporate fines for non-compliance.',
      ja: 'すべての企業に男性の半年間の育児休業取得を義務付け、違反企業には巨額の罰金を科す。',
    },
    impactSummary: {
      en: '+0.07 National TFR, +15 Youth Hope, -5% Corp Productivity.',
      ja: '全国TFR +0.07、若者希望指数 +15、企業生産性 -5%。',
    },
    annualCostBillion: 600,
    tfrDelta: 0.07,
    hopeIndexDelta: 15,
    productivityDelta: -0.05,
    seniorApprovalDelta: -3,
    youthApprovalDelta: 18,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_equal_pay_regularization',
    category: 'labor',
    name: {
      en: 'Equal Pay & End to Non-Regular Employment',
      ja: '同一労働同一賃金＆非正規雇用の原則禁止',
    },
    description: {
      en: 'Abolishes the two-tier employment system. Mandates equal pay, benefits, and job security for all workers regardless of contract type.',
      ja: '正規・非正規の格差を完全に撤廃し、全労働者に同等の給与と福利厚生を保障。若者の経済的安定をもたらす。',
    },
    impactSummary: {
      en: '+0.05 National TFR, +20 Youth Hope, -8% Corp Productivity.',
      ja: '全国TFR +0.05、若者希望指数 +20、企業生産性 -8%。',
    },
    annualCostBillion: 400,
    tfrDelta: 0.05,
    hopeIndexDelta: 20,
    productivityDelta: -0.08,
    seniorApprovalDelta: -2,
    youthApprovalDelta: 25,
    active: false,
    unlockedYear: 2025,
    replaces: ['ord_job_based_pay_system'],
  },
  {
    id: 'ord_four_day_workweek_remote',
    category: 'labor',
    name: {
      en: 'Mandatory 4-Day Workweek & Remote Right',
      ja: '週休3日制＆テレワークの権利化',
    },
    description: {
      en: 'Cuts standard weekly hours to 32 with no pay reduction. Grants legal right to remote work, boosting leisure and family time.',
      ja: '給与水準を維持したまま週休3日制を導入。テレワークを法的権利とし、家族と過ごす時間を大幅に増やす。',
    },
    impactSummary: {
      en: '+0.04 National TFR, +18 Youth Hope, -10% Corp Productivity.',
      ja: '全国TFR +0.04、若者希望指数 +18、企業生産性 -10%。',
    },
    annualCostBillion: 300,
    tfrDelta: 0.04,
    hopeIndexDelta: 18,
    productivityDelta: -0.10,
    seniorApprovalDelta: -5,
    youthApprovalDelta: 22,
    active: false,
    unlockedYear: 2025,
    replaces: ['ord_strict_35h_cap', 'ord_senior_labor_mandate'],
  },
  {
    id: 'ord_unlimited_paid_leave',
    category: 'labor',
    name: {
      en: 'Unlimited Paid Leave Mandate',
      ja: '無制限有給休暇の義務化',
    },
    description: {
      en: 'Forces all businesses to offer theoretically unlimited paid time off to prevent burnout and karoshi.',
      ja: '過労死を防ぐため、企業に「無制限の有給休暇」の提供を義務付ける。生産性への打撃は大きい。',
    },
    impactSummary: {
      en: '+0.02 National TFR, +12 Youth Hope, -15% Corp Productivity.',
      ja: '全国TFR +0.02、若者希望指数 +12、企業生産性 -15%。',
    },
    annualCostBillion: 100,
    tfrDelta: 0.02,
    hopeIndexDelta: 12,
    productivityDelta: -0.15,
    seniorApprovalDelta: -8,
    youthApprovalDelta: 15,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_senior_labor_mandate',
    category: 'labor',
    name: {
      en: 'Mandatory Senior Labor Integration (Retirement at 75)',
      ja: '定年75歳への引き上げ＆シニア就労義務化',
    },
    description: {
      en: 'Pushes the national retirement age to 75. Forces companies to retain aging workers to prop up the labor force, angering youth waiting for promotions.',
      ja: '定年を75歳に引き上げ、労働力不足を補う。生産性は維持されるが、ポストが空かず若者が激怒する。',
    },
    impactSummary: {
      en: '-0.02 National TFR, -15 Youth Hope, +12% Productivity.',
      ja: '全国TFR -0.02、若者希望指数 -15、生産性 +12%。',
    },
    annualCostBillion: -500, // Saves pension costs
    tfrDelta: -0.02,
    hopeIndexDelta: -15,
    productivityDelta: 0.12,
    seniorApprovalDelta: 8,
    youthApprovalDelta: -20,
    active: false,
    unlockedYear: 2025,
    replaces: ['ord_four_day_workweek_remote', 'ord_strict_35h_cap'],
  },
  {
    id: 'ord_right_to_disconnect',
    category: 'labor',
    name: {
      en: 'Right to Disconnect Law',
      ja: 'つながらない権利（勤務時間外の連絡禁止）',
    },
    description: {
      en: 'Makes it illegal for employers to contact employees outside of working hours, enforcing strict boundaries between work and personal life.',
      ja: '勤務時間外の業務メールや電話を法律で禁止し、ワークライフバランスを強制的に守る。',
    },
    impactSummary: {
      en: '+0.01 National TFR, +8 Youth Hope, -2% Productivity.',
      ja: '全国TFR +0.01、若者希望指数 +8、生産性 -2%。',
    },
    annualCostBillion: 50,
    tfrDelta: 0.01,
    hopeIndexDelta: 8,
    productivityDelta: -0.02,
    seniorApprovalDelta: -1,
    youthApprovalDelta: 12,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_female_board_quota',
    category: 'labor',
    name: {
      en: '40% Female Board Member Quota',
      ja: '女性役員比率40%の義務化',
    },
    description: {
      en: 'Mandates that publicly traded companies must have at least 40% female representation on their boards, breaking the glass ceiling.',
      ja: '上場企業の役員の40%以上を女性にすることを義務付け、ガラスの天井を破壊する。',
    },
    impactSummary: {
      en: '+0.02 National TFR, +5 Youth Hope, Drives social modernization.',
      ja: '全国TFR +0.02、若者希望指数 +5、社会の近代化を促進。',
    },
    annualCostBillion: 20,
    tfrDelta: 0.02,
    hopeIndexDelta: 5,
    productivityDelta: 0.01,
    seniorApprovalDelta: -3,
    youthApprovalDelta: 8,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_menstrual_leave',
    category: 'labor',
    name: {
      en: 'Fully Paid Menstrual & Menopause Leave',
      ja: '生理休暇・更年期休暇の完全有給化',
    },
    description: {
      en: 'Guarantees fully paid and unquestioned time off for menstrual pain and menopause symptoms, deeply supporting female health in the workforce.',
      ja: '生理や更年期障害による休暇を完全有給化し、女性が健康的に働き続けられる環境を整備。',
    },
    impactSummary: {
      en: '+0.03 National TFR, +10 Youth Hope, -3% Productivity.',
      ja: '全国TFR +0.03、若者希望指数 +10、生産性 -3%。',
    },
    annualCostBillion: 120,
    tfrDelta: 0.03,
    hopeIndexDelta: 10,
    productivityDelta: -0.03,
    seniorApprovalDelta: -2,
    youthApprovalDelta: 15,
    active: false,
    unlockedYear: 2025,
  },

  // --- IMMIGRATION ---
  {
    id: 'ord_high_skill_visa',
    category: 'immigration',
    name: {
      en: 'High-Skill Tech & Medical Visa Fast-Track',
      ja: '高度専門職（IT・医療）ビザの迅速発給',
    },
    description: {
      en: 'Streamlines immigration for foreign engineers, doctors, and scientists. Brings in essential talent without sparking nationalist backlash.',
      ja: 'ITエンジニアや医療従事者などの高度人材のビザ発給を簡素化。反発を抑えつつ労働力を確保。',
    },
    impactSummary: {
      en: '+3% Productivity, +100k Population, +2% Tax Revenue.',
      ja: '生産性 +3%、人口 +10万人、税収 +2%。',
    },
    annualCostBillion: -100, // Generates tax revenue
    tfrDelta: 0.01,
    hopeIndexDelta: 2,
    productivityDelta: 0.03,
    seniorApprovalDelta: -2,
    youthApprovalDelta: 5,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_permanent_residency_family',
    category: 'immigration',
    name: {
      en: 'Permanent Residency for Foreign Workers',
      ja: '外国人労働者の家族帯同・永住権付与',
    },
    description: {
      en: 'Allows blue-collar foreign workers to bring their families and apply for permanent residency, rapidly growing population but upsetting conservatives.',
      ja: '外国人労働者の家族帯同と永住を許可。人口減少に歯止めをかけるが、保守層からの反発が非常に強い。',
    },
    impactSummary: {
      en: '+500k Population, +5% Productivity, -12 Senior Approval.',
      ja: '人口 +50万人、生産性 +5%、高齢者支持 -12。',
    },
    annualCostBillion: 500, // Infrastructure cost
    tfrDelta: 0.04,
    hopeIndexDelta: 5,
    productivityDelta: 0.05,
    seniorApprovalDelta: -12,
    youthApprovalDelta: 6,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_global_student_citizenship',
    category: 'immigration',
    name: {
      en: 'Global Student Citizenship Pathway',
      ja: '外国人留学生の国籍取得ファストトラック',
    },
    description: {
      en: 'Offers instant citizenship to foreign students who graduate from Japanese universities, capturing young, educated demographic capital.',
      ja: '日本の大学を卒業した外国人留学生に即座に日本国籍を付与。若く優秀な人材を国内に定着させる。',
    },
    impactSummary: {
      en: '+150k Youth Population, +2 Youth Hope, +4% Productivity.',
      ja: '若者人口 +15万人、若者希望指数 +2、生産性 +4%。',
    },
    annualCostBillion: 150,
    tfrDelta: 0.02,
    hopeIndexDelta: 2,
    productivityDelta: 0.04,
    seniorApprovalDelta: -8,
    youthApprovalDelta: 8,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_digital_nomad_visa',
    category: 'immigration',
    name: {
      en: 'Digital Nomad Luxury Visa',
      ja: 'デジタルノマド向け富裕層ビザ',
    },
    description: {
      en: 'Invites wealthy remote workers globally to live in Japan tax-free for 2 years, bringing foreign capital but causing local gentrification.',
      ja: '世界の富裕層リモートワーカーを免税で受け入れ。外貨を獲得するが、一部地域でジェントリフィケーションが発生。',
    },
    impactSummary: {
      en: '+1% Productivity, +¥200B Revenue, -3 Youth Hope.',
      ja: '生産性 +1%、税収 +2000億円、若者希望指数 -3。',
    },
    annualCostBillion: -200,
    tfrDelta: 0.0,
    hopeIndexDelta: -3,
    productivityDelta: 0.01,
    seniorApprovalDelta: -2,
    youthApprovalDelta: -3,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_blue_collar_unrestricted',
    category: 'immigration',
    name: {
      en: 'Unrestricted Blue-Collar Labor Visas',
      ja: '単純労働者のビザ制限撤廃',
    },
    description: {
      en: 'Opens the floodgates for unrestricted foreign labor in construction, caregiving, and retail. Solves labor shortages but deeply alienates conservatives.',
      ja: '建設、介護、小売における外国人労働者の受け入れ制限を完全に撤廃。人手不足は解消するが保守層は激怒。',
    },
    impactSummary: {
      en: '+1M Population, +10% Productivity, -20 Senior Approval.',
      ja: '人口 +100万人、生産性 +10%、高齢者支持 -20。',
    },
    annualCostBillion: 800,
    tfrDelta: 0.05,
    hopeIndexDelta: 4,
    productivityDelta: 0.10,
    seniorApprovalDelta: -20,
    youthApprovalDelta: 2,
    active: false,
    unlockedYear: 2025,
    replaces: ['ord_temporary_guest_workers', 'ord_transition_titp_to_esd'],
  },
  {
    id: 'ord_golden_visa',
    category: 'immigration',
    name: {
      en: 'Foreign Investor Golden Visa',
      ja: '海外投資家向けゴールデンビザ',
    },
    description: {
      en: 'Grants instant permanent residency to foreigners who invest more than ¥100 million in Japanese real estate or businesses.',
      ja: '日本の不動産や企業に1億円以上投資した外国人に無条件で永住権を付与。巨額の資金が流入する。',
    },
    impactSummary: {
      en: '+¥1,000B Revenue, Widens inequality, -5 Hope.',
      ja: '税収 +1兆円、格差拡大、若者希望指数 -5。',
    },
    annualCostBillion: -1000,
    tfrDelta: 0,
    hopeIndexDelta: -5,
    productivityDelta: 0.02,
    seniorApprovalDelta: -4,
    youthApprovalDelta: -5,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_jus_soli',
    category: 'immigration',
    name: {
      en: 'Birthright Citizenship (Jus Soli)',
      ja: '出生地主義（ジュス・ソリ）の導入',
    },
    description: {
      en: 'Radical constitutional shift granting automatic Japanese citizenship to any child born on Japanese soil, completely changing national identity.',
      ja: '日本国内で生まれた全ての子どもに自動的に日本国籍を付与する。国のアイデンティティを根底から変える歴史的転換。',
    },
    impactSummary: {
      en: '+0.10 TFR (Immigrant demographics), -30 Senior Approval.',
      ja: '出生率 +0.10（移民効果）、高齢者支持 -30。',
    },
    annualCostBillion: 1200,
    tfrDelta: 0.10,
    hopeIndexDelta: 10,
    productivityDelta: 0.06,
    seniorApprovalDelta: -30,
    youthApprovalDelta: 5,
    active: false,
    unlockedYear: 2025,
  },

  // --- AUTOMATION ---
  {
    id: 'ord_eldercare_robotics_mandate',
    category: 'automation',
    name: {
      en: 'Subsidized Eldercare Robotics Mandate',
      ja: '介護ロボット・パワードスーツ導入義務化',
    },
    description: {
      en: 'Heavily subsidizes the integration of robotic exoskeletons and automated care beds in nursing homes to mitigate severe caregiver shortages.',
      ja: '深刻な介護士不足を補うため、介護施設へのロボット・パワードスーツの導入を国費で強力に支援・義務化。',
    },
    impactSummary: {
      en: '+4% Productivity, +10 Senior Approval, Cost: ¥1,200B/yr.',
      ja: '生産性 +4%、高齢者支持 +10、歳出 +1.2兆円/年。',
    },
    annualCostBillion: 1200,
    tfrDelta: 0.0,
    hopeIndexDelta: 2,
    productivityDelta: 0.04,
    seniorApprovalDelta: 10,
    youthApprovalDelta: 2,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_national_ai_transformation',
    category: 'automation',
    name: {
      en: 'National AI Bureaucracy Transformation',
      ja: '国家公務員AI代替・行政DX',
    },
    description: {
      en: 'Replaces 40% of standard civil servants with LLMs and automated workflows, drastically cutting government operating costs.',
      ja: '国家公務員・地方公務員の40%をAIと自動化システムで代替。行政コストを劇的に削減する。',
    },
    impactSummary: {
      en: '+8% Productivity, -¥2,500B Gov Expenses, Anger from unions.',
      ja: '生産性 +8%、歳出削減 -2.5兆円、労働組合の怒り。',
    },
    annualCostBillion: -2500,
    tfrDelta: 0.0,
    hopeIndexDelta: 5,
    productivityDelta: 0.08,
    seniorApprovalDelta: -5,
    youthApprovalDelta: 10,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_smart_agri_logistics_grid',
    category: 'automation',
    name: {
      en: 'Smart Agriculture & Automated Logistics Grid',
      ja: 'スマート農業＆自動物流グリッド構想',
    },
    description: {
      en: 'Builds autonomous drone highways and automated farming centers to secure the food supply as the rural population vanishes.',
      ja: '過疎化する地方の食料生産と物流を維持するため、自動運転トラックとドローン網を国策で整備する。',
    },
    impactSummary: {
      en: '+6% Productivity, Revitalizes regional hubs, Cost: ¥1,800B/yr.',
      ja: '生産性 +6%、地方の維持、歳出 +1.8兆円/年。',
    },
    annualCostBillion: 1800,
    tfrDelta: 0.01,
    hopeIndexDelta: 3,
    productivityDelta: 0.06,
    seniorApprovalDelta: 5,
    youthApprovalDelta: 4,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_ai_ceo_subsidy',
    category: 'automation',
    name: {
      en: 'AI Middle-Management Substitution Subsidy',
      ja: 'AI管理職・ミドルマネジメント代替特区',
    },
    description: {
      en: 'Subsidizes corporations that replace middle-management layers with AI dispatchers, flattening corporate hierarchy and boosting efficiency.',
      ja: '中間管理職をAIに置き換える企業を優遇。日本の硬直化した企業階層を破壊し、意思決定を高速化する。',
    },
    impactSummary: {
      en: '+12% Productivity, -10 Senior Approval, +8 Youth Hope.',
      ja: '生産性 +12%、高齢者支持 -10、若者希望指数 +8。',
    },
    annualCostBillion: 400,
    tfrDelta: 0.0,
    hopeIndexDelta: 8,
    productivityDelta: 0.12,
    seniorApprovalDelta: -10,
    youthApprovalDelta: 10,
    active: false,
    unlockedYear: 2025,
    replaces: ['ord_robot_tax'],
  },
  {
    id: 'ord_autonomous_transit',
    category: 'automation',
    name: {
      en: 'Autonomous Fleet Public Transit Mandate',
      ja: '完全自動運転バス・タクシーの全国解禁',
    },
    description: {
      en: 'Overrides taxi unions to deploy level-5 autonomous fleets nationwide, ensuring mobility for the elderly and cheap transit for youth.',
      ja: 'タクシー業界の反発を押し切り、完全自動運転車両を全国に配備。交通弱者を救済し、移動コストを下げる。',
    },
    impactSummary: {
      en: '+5% Productivity, +5 Senior Approval, +5 Youth Hope.',
      ja: '生産性 +5%、高齢者支持 +5、若者希望指数 +5。',
    },
    annualCostBillion: 600,
    tfrDelta: 0.01,
    hopeIndexDelta: 5,
    productivityDelta: 0.05,
    seniorApprovalDelta: 5,
    youthApprovalDelta: 5,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_ai_education_tutors',
    category: 'automation',
    name: {
      en: 'Universal AI Education Tutors',
      ja: '公教育のAI個別最適化（教員半減）',
    },
    description: {
      en: 'Replaces human teachers with highly personalized AI tutors for every student, drastically improving outcomes but firing educators.',
      ja: '児童一人ひとりに最適化されたAIチューターを支給し、人間の教員を半減。教育格差は消えるが組合は反発。',
    },
    impactSummary: {
      en: '+0.02 TFR (Cheaper education), +8 Youth Hope, -¥1,000B Budget.',
      ja: '出生率 +0.02（教育費減）、若者希望指数 +8、歳出削減 -1兆円。',
    },
    annualCostBillion: -1000,
    tfrDelta: 0.02,
    hopeIndexDelta: 8,
    productivityDelta: 0.07,
    seniorApprovalDelta: -5,
    youthApprovalDelta: 10,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_robot_tax',
    category: 'automation',
    name: {
      en: 'Robot & Automation Tax',
      ja: 'ロボット・AI導入税',
    },
    description: {
      en: 'Levies a high tax on companies that replace human workers with AI, using the funds to support displaced workers. Stifles innovation.',
      ja: '人間の労働者をAIやロボットで代替した企業に重税を課し、失業者を救済する。イノベーションは停滞する。',
    },
    impactSummary: {
      en: '-15% Productivity, +¥2,000B Revenue, +5 Senior Approval.',
      ja: '生産性 -15%、税収 +2兆円、高齢者支持 +5。',
    },
    annualCostBillion: -2000,
    tfrDelta: -0.01,
    hopeIndexDelta: -2,
    productivityDelta: -0.15,
    seniorApprovalDelta: 5,
    youthApprovalDelta: 2,
    active: false,
    unlockedYear: 2025,
    replaces: ['ord_ai_ceo_subsidy'],
  },

  // --- FISCAL ---
  {
    id: 'ord_senior_copay_increase',
    category: 'fiscal',
    name: {
      en: 'Senior Healthcare Co-Pay Increase (to 30%)',
      ja: '後期高齢者医療費の窓口負担3割化',
    },
    description: {
      en: 'Forces the elderly to pay 30% out-of-pocket for medical expenses, matching the working generation. Saves trillions but costs seniors their lives & votes.',
      ja: '75歳以上の医療費窓口負担を現役世代と同じ3割に引き上げ。社会保障費を劇的に削減するが、高齢者の猛反発を招く。',
    },
    impactSummary: {
      en: 'Saves ¥4,500B/yr, +15 Youth Hope, -35 Senior Approval (Devastating).',
      ja: '歳出削減 -4.5兆円/年、若者希望指数 +15、高齢者支持 -35(致命的)。',
    },
    annualCostBillion: -4500, // Negative cost = savings
    tfrDelta: 0.02,
    hopeIndexDelta: 15,
    productivityDelta: 0,
    seniorApprovalDelta: -35,
    youthApprovalDelta: 20,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_consumption_tax_hike',
    category: 'fiscal',
    name: {
      en: 'Consumption Tax Hike to 15%',
      ja: '消費税15%への大増税',
    },
    description: {
      en: 'Raises the national consumption tax to 15% to secure social security funding. Stabilizes the debt but suppresses consumer spending.',
      ja: '消費税を15%に引き上げ、膨張する社会保障費の財源を確保。国の借金は減るが、景気と出生率は冷え込む。',
    },
    impactSummary: {
      en: 'Generates ¥11,000B/yr, -0.05 TFR, -15 Youth Hope.',
      ja: '税収増 +11兆円/年、TFR -0.05、若者希望指数 -15。',
    },
    annualCostBillion: -11000,
    tfrDelta: -0.05,
    hopeIndexDelta: -15,
    productivityDelta: -0.02,
    seniorApprovalDelta: -8,
    youthApprovalDelta: -18,
    active: false,
    unlockedYear: 2025,
    replaces: ['ord_consumption_tax_cut'],
  },
  {
    id: 'ord_consumption_tax_cut',
    category: 'fiscal',
    name: {
      en: 'Populist Consumption Tax Cut to 5%',
      ja: '消費税5%への大減税',
    },
    description: {
      en: 'Slashes consumption tax back to 5%. Highly popular and boosts short-term spending, but blows a massive hole in the national budget.',
      ja: '消費税を5%に減税。景気は一気に回復し支持率も爆発的に上がるが、国家財政は破綻に一直線に向かう。',
    },
    impactSummary: {
      en: 'Costs ¥11,000B/yr, +0.06 TFR, +20 Youth Hope, +15 Senior App.',
      ja: '歳出(税収減) +11兆円/年、TFR +0.06、若者希望指数 +20、全世代支持。',
    },
    annualCostBillion: 11000,
    tfrDelta: 0.06,
    hopeIndexDelta: 20,
    productivityDelta: 0.03,
    seniorApprovalDelta: 15,
    youthApprovalDelta: 25,
    active: false,
    unlockedYear: 2025,
    replaces: ['ord_consumption_tax_hike'],
  },
  {
    id: 'ord_wealth_corporate_surtax',
    category: 'fiscal',
    name: {
      en: 'Wealth & Corporate Dividend Surtax',
      ja: '富裕層・内部留保へのメガ課税',
    },
    description: {
      en: 'Imposes heavy taxation on corporate retained earnings and individual stock dividends to redistribute wealth to the working class.',
      ja: '大企業の内部留保と富裕層の金融所得に重税を課し、若年層への分配財源とする。企業は海外へ逃避する恐れ。',
    },
    impactSummary: {
      en: 'Generates ¥6,000B/yr, +10 Youth Hope, -12% Productivity.',
      ja: '税収増 +6兆円/年、若者希望指数 +10、企業生産性 -12%。',
    },
    annualCostBillion: -6000,
    tfrDelta: 0.02,
    hopeIndexDelta: 10,
    productivityDelta: -0.12,
    seniorApprovalDelta: 2,
    youthApprovalDelta: 15,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_inheritance_tax_hike',
    category: 'fiscal',
    name: {
      en: 'Inheritance Tax Hike to 80%',
      ja: '相続税80%・資産の強制再分配',
    },
    description: {
      en: 'Effectively seizes generational wealth from passing to heirs, using the assets to pay off national debt. Seniors panic.',
      ja: '相続税の最高税率を80%に引き上げ、世代間の富の偏在を強制的にリセットする。高齢資産家はパニックに陥る。',
    },
    impactSummary: {
      en: 'Generates ¥8,000B/yr, +15 Youth Hope, -25 Senior Approval.',
      ja: '税収増 +8兆円/年、若者希望指数 +15、高齢者支持 -25。',
    },
    annualCostBillion: -8000,
    tfrDelta: 0.03,
    hopeIndexDelta: 15,
    productivityDelta: -0.05,
    seniorApprovalDelta: -25,
    youthApprovalDelta: 18,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_ubi',
    category: 'fiscal',
    name: {
      en: 'Universal Basic Income (¥80,000/mo)',
      ja: 'ベーシックインカム（月8万円）',
    },
    description: {
      en: 'Replaces all welfare and pensions with a flat monthly payment of ¥80,000 to every citizen. Extremely expensive but eradicates poverty.',
      ja: '年金・生活保護を全廃し、全国民に月8万円を一律支給する。極度の財政負担を伴うが、絶対的貧困は消滅する。',
    },
    impactSummary: {
      en: 'Costs ¥25,000B/yr, +0.10 TFR, +30 Youth Hope, +5 Productivity.',
      ja: '歳出 +25兆円/年、出生率 +0.10、若者希望指数 +30。',
    },
    annualCostBillion: 25000,
    tfrDelta: 0.10,
    hopeIndexDelta: 30,
    productivityDelta: 0.05,
    seniorApprovalDelta: -10, // Seniors lose bigger pensions
    youthApprovalDelta: 35,
    active: false,
    unlockedYear: 2025,
    replaces: ['ord_privatize_pension', 'ord_universal_child_allowance'],
  },
  {
    id: 'ord_privatize_pension',
    category: 'fiscal',
    name: {
      en: 'Privatization of National Pension',
      ja: '国民年金制度の完全民営化・廃止',
    },
    description: {
      en: 'Abolishes the mandatory state pension system. Citizens must save for their own retirement. Solves the fiscal crisis but terrifies the public.',
      ja: '賦課方式の公的年金を廃止し、完全自己責任の民間積立に移行する。国家の借金問題は解決するが、国民は老後に恐怖する。',
    },
    impactSummary: {
      en: 'Saves ¥18,000B/yr, -20 Youth Hope, -40 Senior Approval.',
      ja: '歳出削減 -18兆円/年、若者希望指数 -20、高齢者支持 -40(破滅的)。',
    },
    annualCostBillion: -18000,
    tfrDelta: -0.05,
    hopeIndexDelta: -20,
    productivityDelta: 0.08,
    seniorApprovalDelta: -40,
    youthApprovalDelta: 5, // Some youth happy not to pay in
    active: false,
    unlockedYear: 2025,
    replaces: ['ord_pension_macroeconomic_slide_acceleration'],
  },
  {
    id: 'ord_legalize_casinos',
    category: 'fiscal',
    name: {
      en: 'Legalize Casinos & Recreational Drugs',
      ja: 'カジノ・大麻の完全合法化と課税',
    },
    description: {
      en: 'Legalizes and heavily taxes integrated resorts and recreational substances. Generates massive revenue but degrades public morals and safety.',
      ja: 'IRカジノと一部の薬物を合法化して巨額の税収を得る。治安悪化の懸念から保守層の猛烈な反対に遭う。',
    },
    impactSummary: {
      en: 'Generates ¥4,000B/yr, -5 TFR, -15 Senior Approval.',
      ja: '税収増 +4兆円/年、出生率 -0.02、高齢者支持 -15。',
    },
    annualCostBillion: -4000,
    tfrDelta: -0.02,
    hopeIndexDelta: 2,
    productivityDelta: -0.04,
    seniorApprovalDelta: -15,
    youthApprovalDelta: 10,
    active: false,
    unlockedYear: 2025,
  },

  // --- HISTORICAL BACKFIRE & EXTREME MEASURES ---
  {
    id: 'ord_childless_tax',
    category: 'family',
    name: {
      en: 'Childless Adult Surtax (Bachelor Tax)',
      ja: '単身者・子なし世帯への特別割増税（独身税）',
    },
    description: {
      en: 'Historically attempted in the USSR & Romania. Heavily taxes unmarried or childless adults to fund families. Backfires: Triggers massive youth emigration and societal resentment.',
      ja: '旧ソ連等で導入された歴史的失敗策。子どものいない世帯に重税を課す。結果、若者の国外流出と猛烈な社会的分断を招く。',
    },
    impactSummary: {
      en: '+0.03 TFR, -30 Youth Hope, -5% Productivity (Brain Drain).',
      ja: 'TFR +0.03、若者希望指数 -30、生産性 -5% (頭脳流出)。',
    },
    annualCostBillion: -1200,
    tfrDelta: 0.03,
    hopeIndexDelta: -30,
    productivityDelta: -0.05,
    seniorApprovalDelta: 5,
    youthApprovalDelta: -40,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_abortion_ban',
    category: 'family',
    name: {
      en: 'Decree 770: Total Abortion & Contraceptive Ban',
      ja: '法令770号：人工妊娠中絶と避妊の完全禁止',
    },
    description: {
      en: 'Mirrors Romania\'s disastrous 1966 policy. Forces births through criminalization. Causes a brief TFR spike followed by systemic societal collapse and trauma.',
      ja: '1966年ルーマニアの悲劇的政策の再現。強権的に出生を強制し、一時的なTFR急増と引き換えに社会システムを破壊し深いトラウマを残す。',
    },
    impactSummary: {
      en: '+0.25 TFR, -50 Youth Hope, -15% Productivity, Mass Unrest.',
      ja: 'TFR +0.25、若者希望指数 -50、生産性 -15%、社会的混乱。',
    },
    annualCostBillion: 500,
    tfrDelta: 0.25,
    hopeIndexDelta: -50,
    productivityDelta: -0.15,
    seniorApprovalDelta: -10,
    youthApprovalDelta: -60,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_strict_35h_cap',
    category: 'labor',
    name: {
      en: 'Strict 35-Hour Workweek (Zero Exceptions)',
      ja: '例外なしの週35時間労働上限規制',
    },
    description: {
      en: 'Like France\'s historic policy, aims to force companies to hire more staff. Backfires: Companies freeze hiring, wages stagnate, and bureaucracy balloons.',
      ja: 'フランスの歴史的政策に類似。雇用創出を狙ったが、逆に企業が採用を凍結し、賃金停滞と非効率な官僚主義を招く結果となる。',
    },
    impactSummary: {
      en: '-0.01 TFR, -5 Youth Hope, -12% Productivity.',
      ja: 'TFR -0.01、若者希望指数 -5、生産性 -12%。',
    },
    annualCostBillion: 200,
    tfrDelta: -0.01,
    hopeIndexDelta: -5,
    productivityDelta: -0.12,
    seniorApprovalDelta: -2,
    youthApprovalDelta: -8,
    active: false,
    unlockedYear: 2025,
    replaces: ['ord_senior_labor_mandate'],
  },
  {
    id: 'ord_temporary_guest_workers',
    category: 'immigration',
    name: {
      en: 'Strict Guest Worker Program (Gastarbeiter)',
      ja: '厳格な一時的外国人労働者制度（ガストアルバイター）',
    },
    description: {
      en: 'Mirrors 1960s Europe. Brings in millions for cheap labor assuming they will leave. They stay, and zero integration funding leads to massive social friction.',
      ja: '1960年代欧州の失敗。一時的と見込んで安価な労働力を大量導入するが、彼らは定住し、統合政策の欠如から深刻な社会摩擦を引き起こす。',
    },
    impactSummary: {
      en: '+5% Productivity, -15 Senior App, -10 Youth Hope.',
      ja: '生産性 +5%、高齢者支持 -15、若者希望 -10。',
    },
    annualCostBillion: 300,
    tfrDelta: 0.02,
    hopeIndexDelta: -10,
    productivityDelta: 0.05,
    seniorApprovalDelta: -15,
    youthApprovalDelta: -10,
    active: false,
    unlockedYear: 2025,
    replaces: ['ord_blue_collar_unrestricted', 'ord_transition_titp_to_esd'],
  },
  // --- NEW LEGISLATION: FAMILY & CHILDCARE ---
  {
    id: 'ord_free_childbirth_insurance',
    category: 'family',
    name: {
      en: '100% Free Childbirth via Public Health Insurance',
      ja: '出産費用の完全無償化・公的医療保険適用',
    },
    description: {
      en: 'Brings normal obstetric delivery under universal health insurance and subsidizes hospital stays, eliminating the ¥500,000–¥800,000 out-of-pocket childbirth hurdle.',
      ja: '通常分娩を公的医療保険の完全適用対象とし、窓口負担をゼロ化。出産にかかる50万〜80万円の実質自己負担を完全に撤廃する。',
    },
    impactSummary: {
      en: '+0.04 TFR, +7 Youth Hope, ¥450B/yr.',
      ja: 'TFR +0.04、若者希望 +7、年間費用 4,500億円。',
    },
    annualCostBillion: 450,
    tfrDelta: 0.04,
    hopeIndexDelta: 7,
    productivityDelta: 0.0,
    seniorApprovalDelta: 2,
    youthApprovalDelta: 12,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_free_higher_education_multi_child',
    category: 'family',
    name: {
      en: 'Tuition-Free Higher Education for Multi-Child Families',
      ja: '多子世帯の大学・高等教育完全無償化',
    },
    description: {
      en: 'Fully waives tuition and enrollment fees at universities, colleges, and vocational schools for families with two or more children, removing the heaviest financial barrier to growing families.',
      ja: '2人以上の子どもを扶養する世帯を対象に、大学・短大・高専・専門学校の授業料と入学金を完全無償化。最大の教育費負担の壁を取り除く。',
    },
    impactSummary: {
      en: '+0.05 TFR, +8 Youth Hope, +2% Prod, ¥820B/yr.',
      ja: 'TFR +0.05、若者希望 +8、生産性 +2%、年間費用 8,200億円。',
    },
    annualCostBillion: 820,
    tfrDelta: 0.05,
    hopeIndexDelta: 8,
    productivityDelta: 0.02,
    seniorApprovalDelta: -4,
    youthApprovalDelta: 14,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_universal_childcare_access',
    category: 'family',
    name: {
      en: 'Universal "Childcare for All Children" System',
      ja: '「こども誰でも通園制度」の全国完全展開',
    },
    description: {
      en: 'Guarantees hourly flexible daycare and nursery access to all infants and toddlers regardless of parental employment status, eradicating maternal isolation and solo-parenting stress.',
      ja: '親の就労要件を問わず、すべての未就学児が時間単位で保育所等を利用できる制度を全国で完全実施。育児不安や孤立育児（ワンオペ）を防ぐ。',
    },
    impactSummary: {
      en: '+0.03 TFR, +6 Youth Hope, ¥360B/yr.',
      ja: 'TFR +0.03、若者希望 +6、年間費用 3,600億円。',
    },
    annualCostBillion: 360,
    tfrDelta: 0.03,
    hopeIndexDelta: 6,
    productivityDelta: 0.01,
    seniorApprovalDelta: 1,
    youthApprovalDelta: 9,
    active: false,
    unlockedYear: 2025,
    replaces: ['ord_free_early_childcare_ivg'],
  },
  {
    id: 'ord_marriage_starter_housing_grant',
    category: 'family',
    name: {
      en: 'Newlywed Housing & Settlement Grant',
      ja: '新婚世帯向け住宅取得・家賃支援バウチャー',
    },
    description: {
      en: 'Provides up to ¥1,000,000 in direct relocation subsidies and rent vouchers for newly married couples under 35 moving into family-sized residences.',
      ja: '35歳以下の新婚夫婦を対象に、引越し費用や家賃補助として最大100万円の直接支援を給付し、広い住宅への住み替えと早期成婚を後押しする。',
    },
    impactSummary: {
      en: '+0.03 TFR, +6 Youth Hope, ¥280B/yr.',
      ja: 'TFR +0.03、若者希望 +6、年間費用 2,800億円。',
    },
    annualCostBillion: 280,
    tfrDelta: 0.03,
    hopeIndexDelta: 6,
    productivityDelta: 0.0,
    seniorApprovalDelta: -2,
    youthApprovalDelta: 11,
    active: false,
    unlockedYear: 2025,
    replaces: ['ord_means_tested_housing'],
  },
  {
    id: 'ord_child_support_state_guarantee',
    category: 'family',
    name: {
      en: 'State Child Support Advance & Enforcement System',
      ja: '養育費立替払制度・公的強制回収の法制化',
    },
    description: {
      en: 'The government guarantees and advances unpaid child support to single-parent households, deploying tax authority garnishment powers to collect directly from delinquent non-custodial parents.',
      ja: 'ひとり親世帯の養育費不払いを撲滅するため、行政が養育費を立て替えて支給し、国税徴収のノウハウを用いて未払い親から強制回収する。',
    },
    impactSummary: {
      en: '+0.02 TFR, +5 Youth Hope, +8 Youth App, ¥90B/yr.',
      ja: 'TFR +0.02、若者希望 +5、若者支持 +8、年間費用 900億円。',
    },
    annualCostBillion: 90,
    tfrDelta: 0.02,
    hopeIndexDelta: 5,
    productivityDelta: 0.01,
    seniorApprovalDelta: 2,
    youthApprovalDelta: 8,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_maternal_mental_health_postpartum',
    category: 'family',
    name: {
      en: 'Comprehensive Postpartum Care & Visiting Doula Act',
      ja: '産後ケア事業・訪問支援員の全国完全義務化',
    },
    description: {
      en: 'Subsidizes comprehensive postpartum hotel stays, in-home midwives, and certified doula visits nationwide, preventing postpartum depression and severe parental burnout.',
      ja: '宿泊型・通所型の産後ケア施設や助産師・訪問支援員による家庭訪問を全額公費助成。産後うつや孤立育児を早期に予防・解消する。',
    },
    impactSummary: {
      en: '+0.02 TFR, +4 Youth Hope, ¥130B/yr.',
      ja: 'TFR +0.02、若者希望 +4、年間費用 1,300億円。',
    },
    annualCostBillion: 130,
    tfrDelta: 0.02,
    hopeIndexDelta: 4,
    productivityDelta: 0.0,
    seniorApprovalDelta: 3,
    youthApprovalDelta: 7,
    active: false,
    unlockedYear: 2025,
  },

  // --- NEW LEGISLATION: LABOR & GENDER REFORM ---
  {
    id: 'ord_income_wall_reform_178m',
    category: 'labor',
    name: {
      en: 'Abolish the "Income Wall" (Raise Tax Exemption to ¥1.78M)',
      ja: '「年収の壁」打破（基礎控除178万円への引き上げ）',
    },
    description: {
      en: 'Raises the basic income tax exemption from ¥1.03M to ¥1.78M and aligns social security limits, enabling millions of part-time spouses and student workers to work full desired hours.',
      ja: '所得税の非課税枠を103万円から178万円へ大幅に引き上げ、社会保険の壁も是正。パート・主婦層や学生が就労調整することなく働ける環境を整える。',
    },
    impactSummary: {
      en: '+0.8M Workforce, +2% Productivity, +6 Youth Hope, ¥850B Rev Loss.',
      ja: '労働力 +80万人、生産性 +2%、若者希望 +6、税収減 8,500億円。',
    },
    annualCostBillion: 850,
    tfrDelta: 0.02,
    hopeIndexDelta: 6,
    productivityDelta: 0.02,
    seniorApprovalDelta: -3,
    youthApprovalDelta: 12,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_selective_separate_surnames',
    category: 'labor',
    name: {
      en: 'Selective Separate Surnames for Married Couples',
      ja: '選択的夫婦別姓制度の導入',
    },
    description: {
      en: 'Grants marrying couples the freedom to either retain their separate birth surnames or choose a common family name, eliminating career disruption and identity loss for professional women.',
      ja: '結婚時に夫婦が同姓にするか各自の生来の姓を保持するかを選べる選択的夫婦別姓を導入。女性のキャリア継続や改姓手続きの多大な負担を解消する。',
    },
    impactSummary: {
      en: '+7 Youth Hope, +10 Youth App, -8 Senior App, +2% Prod.',
      ja: '若者希望 +7、若者支持 +10、高齢者支持 -8、生産性 +2%。',
    },
    annualCostBillion: 15,
    tfrDelta: 0.01,
    hopeIndexDelta: 7,
    productivityDelta: 0.02,
    seniorApprovalDelta: -8,
    youthApprovalDelta: 10,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_ban_unpaid_overtime_service',
    category: 'labor',
    name: {
      en: 'Criminalization of Unpaid "Service Overtime"',
      ja: 'サービス残業の刑事罰化・勤怠デジタル監査',
    },
    description: {
      en: 'Mandates cloud-based digital timecard auditing and establishes criminal prosecution for corporate executives demanding unrecorded off-the-clock overtime.',
      ja: 'クラウド型デジタル勤怠ログの保存・定期監査を義務化し、持ち帰り残業や記録外の「サービス残業」を命じた企業幹部に刑事罰を科す。',
    },
    impactSummary: {
      en: '+0.02 TFR, +6 Youth Hope, +1% Productivity, -5 Senior App.',
      ja: 'TFR +0.02、若者希望 +6、生産性 +1%、高齢層・経営層支持 -5。',
    },
    annualCostBillion: 60,
    tfrDelta: 0.02,
    hopeIndexDelta: 6,
    productivityDelta: 0.01,
    seniorApprovalDelta: -5,
    youthApprovalDelta: 10,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_mandatory_male_childcare_quota',
    category: 'labor',
    name: {
      en: 'Mandatory 85% Corporate Male Paternity Leave Quota',
      ja: '男性育休取得率85%義務化・入札参加制限',
    },
    description: {
      en: 'Requires medium-to-large corporations to achieve an 85%+ take-up rate for male parental leave, barring non-compliant firms from all central and municipal procurement contracts.',
      ja: '中堅・大企業に対し男性育児休業取得率85%以上を義務付け。未達企業は国・自治体の公共事業入札から除外するとともに、給付金で手取り100%を補償。',
    },
    impactSummary: {
      en: '+0.04 TFR, +5 Youth Hope, +9 Youth App, ¥160B/yr.',
      ja: 'TFR +0.04、若者希望 +5、若者支持 +9、年間費用 1,600億円。',
    },
    annualCostBillion: 160,
    tfrDelta: 0.04,
    hopeIndexDelta: 5,
    productivityDelta: 0.0,
    seniorApprovalDelta: -3,
    youthApprovalDelta: 9,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_freelance_gig_worker_protections',
    category: 'labor',
    name: {
      en: 'Universal Labor Protection for Freelancers & Gig Workers',
      ja: 'フリーランス・ギグワーカー新法・労災完全適用',
    },
    description: {
      en: 'Extends industrial accident insurance, minimum contract remuneration standards, and collective bargaining rights to gig-economy workers, independent software engineers, and creators.',
      ja: '配送員やIT技術者、クリエイターなどの個人事業主・ギグワーカーに労災保険の特別加入を義務化し、報酬不払い防止と適正な最低報酬基準を定める。',
    },
    impactSummary: {
      en: '+5 Youth Hope, +1% Productivity, +7 Youth App, ¥85B/yr.',
      ja: '若者希望 +5、生産性 +1%、若者支持 +7、年間費用 850億円。',
    },
    annualCostBillion: 85,
    tfrDelta: 0.01,
    hopeIndexDelta: 5,
    productivityDelta: 0.01,
    seniorApprovalDelta: 1,
    youthApprovalDelta: 7,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_job_based_pay_system',
    category: 'labor',
    name: {
      en: 'National Transition to Job-Based Pay & Meritocracy',
      ja: 'ジョブ型雇用移行促進・年功序列賃金改革',
    },
    description: {
      en: 'Tax-incentivizes businesses to abandon traditional seniority lifetime wage ladders for market-rate job descriptions, enabling top young talent to earn high executive salaries early in their careers.',
      ja: '従来の年功序列型賃金から職務内容に応じた「ジョブ型」への移行を税制優遇。若手優秀層の早期昇給・高年収化を実現し、海外流出を阻止する。',
    },
    impactSummary: {
      en: '+4% Productivity, +8 Youth Hope, -10 Senior App, +11 Youth App.',
      ja: '生産性 +4%、若者希望 +8、高齢者支持 -10、若者支持 +11。',
    },
    annualCostBillion: 70,
    tfrDelta: 0.01,
    hopeIndexDelta: 8,
    productivityDelta: 0.04,
    seniorApprovalDelta: -10,
    youthApprovalDelta: 11,
    active: false,
    unlockedYear: 2025,
    replaces: ['ord_equal_pay_regularization'],
  },

  // --- NEW LEGISLATION: IMMIGRATION & VISAS ---
  {
    id: 'ord_transition_titp_to_esd',
    category: 'immigration',
    name: {
      en: 'Abolition of TITP & Shift to "Employment with Skill Development"',
      ja: '技能実習制度廃止・「育成就労制度」全面移行',
    },
    description: {
      en: 'Abolishes the criticized Technical Intern Training Program and implements the Employment with Skill Development framework, allowing job transfers and progression to permanent SSW-2 status.',
      ja: '人権上の批判が多かった外国人技能実習制度を完全に廃止し、本人の希望による転籍（転職）の自由を認める「育成就労制度」へ全面移行する。',
    },
    impactSummary: {
      en: '+0.6M Foreign Workers, +2% Productivity, +4 Youth Hope.',
      ja: '外国人労働者 +60万人、生産性 +2%、若者希望 +4。',
    },
    annualCostBillion: 90,
    tfrDelta: 0.01,
    hopeIndexDelta: 4,
    productivityDelta: 0.02,
    seniorApprovalDelta: 2,
    youthApprovalDelta: 6,
    active: false,
    unlockedYear: 2025,
    replaces: ['ord_temporary_guest_workers'],
  },
  {
    id: 'ord_foreign_caregiver_fasttrack',
    category: 'immigration',
    name: {
      en: 'Expedited Permanent Residency for Foreign Caregivers',
      ja: '介護・医療分野外国人材の永住特例法',
    },
    description: {
      en: 'Subsidizes national nursing qualifications and language courses for overseas healthcare specialists, granting a streamlined 3-year permanent residency pathway with full family accompaniment.',
      ja: '深刻な介護・看護現場を救うため、日本語教育と国家試験受験を全面公費補助し、3年間の実務経験で家族帯同可能な永住許可を特別付与する。',
    },
    impactSummary: {
      en: '+0.4M Caregivers, -¥280B Healthcare Outlays, +8 Senior App.',
      ja: '外国人介護人材 +40万人、医療介護費抑制 2,800億円、高齢者支持 +8。',
    },
    annualCostBillion: 160,
    tfrDelta: 0.01,
    hopeIndexDelta: 3,
    productivityDelta: 0.01,
    seniorApprovalDelta: 8,
    youthApprovalDelta: 5,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_dual_citizenship_reconciliation',
    category: 'immigration',
    name: {
      en: 'Dual Nationality Recognition Act',
      ja: '重国籍容認・国籍選択義務の撤廃',
    },
    description: {
      en: 'Amends the Nationality Act to allow Japanese citizens acquiring foreign citizenship and binational children to retain Japanese nationality permanently, stopping high-tech brain drain.',
      ja: '日本国籍を持つ人が外国籍を取得した際や二重国籍の若者に対する国籍選択義務を廃止し、永久的な重国籍を容認。世界で活躍する高度人材の頭脳流出を防ぐ。',
    },
    impactSummary: {
      en: '+0.2M Skilled Workers, +4 Youth Hope, +3% Tech GDP.',
      ja: '高度人材 +20万人、若者希望 +4、ハイテクGDP寄与 +3%。',
    },
    annualCostBillion: 25,
    tfrDelta: 0.0,
    hopeIndexDelta: 4,
    productivityDelta: 0.03,
    seniorApprovalDelta: -6,
    youthApprovalDelta: 8,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_multicultural_education_mandate',
    category: 'immigration',
    name: {
      en: 'Universal Bilingual & Multicultural Public School Integration',
      ja: '多文化共生教育・日本語指導教員配置義務化',
    },
    description: {
      en: 'Mandates certified Japanese-as-a-second-language instructors and multicultural counselors across all municipal public schools to ensure second-generation children seamlessly integrate.',
      ja: '外国にルーツを持つ子どもが通う公立小中学校に日本語指導教員とバイリンガル相談員を必置化。教育格差をなくし、将来の熟練社会人を育成する。',
    },
    impactSummary: {
      en: '+0.3M Integrated Workers, +3 Youth Hope, ¥140B/yr.',
      ja: '定住労働力 +30万人、若者希望 +3、年間費用 1,400億円。',
    },
    annualCostBillion: 140,
    tfrDelta: 0.01,
    hopeIndexDelta: 3,
    productivityDelta: 0.01,
    seniorApprovalDelta: 1,
    youthApprovalDelta: 5,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_foreign_entrepreneur_startup_visa',
    category: 'immigration',
    name: {
      en: 'Zero-Capital Foreign Tech Founder Visa',
      ja: '外国人起業促進特区・資本金要件の完全撤廃',
    },
    description: {
      en: 'Waives the ¥5,000,000 initial capital and physical office lease prerequisites for vetted global startup founders, providing 2-year founder residency and seed coinvestment rights.',
      ja: '外国人起業家に課されていた500万円以上の資本金や事務所確保要件を撤廃し、2年間のスタートアップ特区ビザと政府系ファンドのシード出資枠を提供する。',
    },
    impactSummary: {
      en: '+3% Productivity, +¥2.5T Tech Output, +4 Youth Hope.',
      ja: '生産性 +3%、ハイテク付加価値 +2.5兆円、若者希望 +4。',
    },
    annualCostBillion: 65,
    tfrDelta: 0.0,
    hopeIndexDelta: 4,
    productivityDelta: 0.03,
    seniorApprovalDelta: -1,
    youthApprovalDelta: 7,
    active: false,
    unlockedYear: 2025,
  },

  // --- NEW LEGISLATION: AI & AUTOMATION DX ---
  {
    id: 'ord_digital_agency_paperless_mandate',
    category: 'automation',
    name: {
      en: 'Zero-Paper & Hanko Prohibition Act (100% Cloud Gov)',
      ja: '行政手続き100%デジタル化・公的押印完全廃止法',
    },
    description: {
      en: 'Prohibits national ministries and municipal offices from demanding physical paper, fax transmissions, or ink seal stamps, transitioning 100% of civic procedures to real-time online APIs.',
      ja: 'すべての国・地方自治体の窓口手続きにおいて、紙の書類提出、ファックス送信、ハンコ押印を法律で禁止。マイナポータルAPIによる完全オンライン処理を義務付ける。',
    },
    impactSummary: {
      en: '+0.4M Labor Equiv, +3% Productivity, +5 Cabinet App.',
      ja: '自動化代替 +40万人、生産性 +3%、内閣支持 +5。',
    },
    annualCostBillion: 240,
    tfrDelta: 0.0,
    hopeIndexDelta: 4,
    productivityDelta: 0.03,
    seniorApprovalDelta: -2,
    youthApprovalDelta: 8,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_sovereign_generative_ai_datacenter',
    category: 'automation',
    name: {
      en: 'National Sovereign AI & Sub-2nm Foundry Initiative',
      ja: '国策生成AI基盤モデル・次世代半導体ファウンドリ支援',
    },
    description: {
      en: 'State funding for domestic GPU supercomputing clusters and advanced semiconductor manufacturing (Rapidus/TSMC domestic fabs) to power industrial robotics and LLMs.',
      ja: '国産生成AI基盤モデル開発と北海道・熊本などの最先端半導体製造拠点に巨額投資。電力網直結のグリーンデータセンター網を国策で整備する。',
    },
    impactSummary: {
      en: '+0.8M Labor Equiv, +5% Productivity, +¥4T GDP, ¥650B/yr.',
      ja: '自動化代替 +80万人、生産性 +5%、GDP +4兆円、年間費用 6,500億円。',
    },
    annualCostBillion: 650,
    tfrDelta: 0.0,
    hopeIndexDelta: 5,
    productivityDelta: 0.05,
    seniorApprovalDelta: 2,
    youthApprovalDelta: 9,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_autonomous_construction_robotics',
    category: 'automation',
    name: {
      en: 'Autonomous Construction & Remote Heavy Machinery Mandate',
      ja: '無人・遠隔建設重機施工の公共事業義務化',
    },
    description: {
      en: 'Mandates autonomous AI and tele-operated excavators, cranes, and pavers on all public civil infrastructure projects, counteracting the severe shortage of aging builders.',
      ja: '建設現場の超高齢化に対抗するため、国土交通省発注の公共事業においてAI自律運転・5G遠隔操作重機の使用を原則義務化し、施工生産性を倍増させる。',
    },
    impactSummary: {
      en: '+0.5M Labor Equiv, +3% Productivity, -¥180B Maintenance.',
      ja: '自動化代替 +50万人、生産性 +3%、インフラ維持費削減 1,800億円。',
    },
    annualCostBillion: 210,
    tfrDelta: 0.0,
    hopeIndexDelta: 2,
    productivityDelta: 0.03,
    seniorApprovalDelta: 4,
    youthApprovalDelta: 4,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_automated_drone_logistics_airspace',
    category: 'automation',
    name: {
      en: 'Level-4 Autonomous Cargo Drone & Sidewalk Rover Corridors',
      ja: 'ドローン・自動配送ロボット物流特区の全面解禁',
    },
    description: {
      en: 'Designates suburban airspace lanes and sidewalks for unattended Level-4 delivery drones and wheeled rovers, solving the nationwide logistics driver deficit.',
      ja: '郊外や過疎地の上空をドローン専用航空回廊とし、歩道における自動配送ロボットの無人走行（レベル4）を全面解禁。「物流の危機」を克服する。',
    },
    impactSummary: {
      en: '+0.3M Labor Equiv, +2% Productivity, +3 Youth Hope.',
      ja: '自動化代替 +30万人、生産性 +2%、若者希望 +3。',
    },
    annualCostBillion: 150,
    tfrDelta: 0.0,
    hopeIndexDelta: 3,
    productivityDelta: 0.02,
    seniorApprovalDelta: 2,
    youthApprovalDelta: 6,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_ai_assisted_medical_diagnosis',
    category: 'automation',
    name: {
      en: 'AI Diagnostic Screening & Universal Telemedicine Coverage',
      ja: 'AI画像診断支援・オンライン診療の全面保険適用',
    },
    description: {
      en: 'Approves clinical AI diagnostics for radiology, endoscopy, and remote oncology under health insurance, providing world-class diagnostic accuracy to underserved rural clinics.',
      ja: '画像診断AIやがんスクリーニングAI、遠隔オンライン診療を公的保険の標準点数として完全適用。過疎地域の医師不足を解消し、早期発見により高額医療費を抑制する。',
    },
    impactSummary: {
      en: '-¥320B Healthcare Costs, +6 Senior App, +2% Productivity.',
      ja: '医療費抑制 3,200億円、高齢者支持 +6、生産性 +2%。',
    },
    annualCostBillion: 170,
    tfrDelta: 0.0,
    hopeIndexDelta: 3,
    productivityDelta: 0.02,
    seniorApprovalDelta: 6,
    youthApprovalDelta: 5,
    active: false,
    unlockedYear: 2025,
  },

  // --- NEW LEGISLATION: FISCAL, TAX & SOCIAL SECURITY ---
  {
    id: 'ord_carbon_pricing_green_tax',
    category: 'fiscal',
    name: {
      en: 'National Carbon Pricing & Green Transformation (GX) Levy',
      ja: 'GX炭素賦課金・排出量取引市場の本格導入',
    },
    description: {
      en: 'Imposes a statutory carbon levy on fossil fuel imports and power generators, establishing a reliable revenue stream to amortize Green Transition (GX) climate bonds.',
      ja: '化石燃料輸入企業や排出大企業に対して炭素賦課金を課し、GX経済移行債の償還とクリーンエネルギー投資の安定財源を確保する。',
    },
    impactSummary: {
      en: '+¥1,300B Fiscal Revenue, JGB Stability, +4 Youth Hope.',
      ja: '税収増 +1.3兆円、国債利回り安定、若者希望 +4。',
    },
    annualCostBillion: -1300,
    tfrDelta: 0.0,
    hopeIndexDelta: 4,
    productivityDelta: 0.01,
    seniorApprovalDelta: -3,
    youthApprovalDelta: 6,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_sovereign_wealth_fund_jpf',
    category: 'fiscal',
    name: {
      en: 'Japan Sovereign Wealth Investment Fund (JPF)',
      ja: '日本版政府系ファンド（SWF）創設・外為特会運用改革',
    },
    description: {
      en: 'Transforms passive foreign exchange reserves ($1.3T) into an actively managed sovereign fund, channeling multi-trillion annual global investment returns directly into the state budget.',
      ja: '巨額の外国為替資金特別会計や政府保有資産を一体運用する政府系ファンド（SWF）を創設。国際分散投資による巨額の年間配当を国家財政に直接繰り入れる。',
    },
    impactSummary: {
      en: '+¥1,600B Annual Dividend, Debt-to-GDP Improves, +5 Hope.',
      ja: '年間配当 +1.6兆円、債務比率改善、若者希望 +5。',
    },
    annualCostBillion: -1600,
    tfrDelta: 0.01,
    hopeIndexDelta: 5,
    productivityDelta: 0.02,
    seniorApprovalDelta: 3,
    youthApprovalDelta: 7,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_pension_macroeconomic_slide_acceleration',
    category: 'fiscal',
    name: {
      en: 'Full Enforcement of Pension "Macroeconomic Slide"',
      ja: '公的年金マクロ経済スライドの完全発動・基礎年金底上げ',
    },
    description: {
      en: 'Removes discretionary freezes on the macroeconomic slide adjustment during inflation, reducing unsustainable elderly benefit escalation while raising baseline safety-net payouts.',
      ja: '名目賃金・物価上昇時における年金改定抑制ルール（マクロ経済スライド）の特例猶予を廃止。将来世代の負担を抑制しつつ、低年金者向け基礎年金を底上げする。',
    },
    impactSummary: {
      en: '-¥1,900B Pension Costs, -12 Senior App, +8 Youth Hope.',
      ja: '年金給付費抑制 1.9兆円、高齢者支持 -12、若者希望 +8。',
    },
    annualCostBillion: -1900,
    tfrDelta: 0.01,
    hopeIndexDelta: 8,
    productivityDelta: 0.0,
    seniorApprovalDelta: -12,
    youthApprovalDelta: 10,
    active: false,
    unlockedYear: 2025,
    replaces: ['ord_privatize_pension'],
  },
  {
    id: 'ord_financial_income_flat_tax_hike',
    category: 'fiscal',
    name: {
      en: 'Financial Income Tax Reform (Rectifying the ¥100M Wall)',
      ja: '金融所得課税25%への引き上げ（「1億円の壁」是正）',
    },
    description: {
      en: 'Increases the separate flat tax on capital gains and equity dividends from 20% to 25% for high-net-worth investors, fixing the regressive effective tax rates paid by the super-rich.',
      ja: '株式譲渡益や配当に対する分離課税率を20.315%から25%に引き上げ、高額所得者ほど実質税負担率が下がる「1億円の壁」を是正する。',
    },
    impactSummary: {
      en: '+¥950B Fiscal Revenue, +5 Youth Hope, -6 Corporate App.',
      ja: '税収増 +9,500億円、若者希望 +5、企業・富裕層支持 -6。',
    },
    annualCostBillion: -950,
    tfrDelta: 0.0,
    hopeIndexDelta: 5,
    productivityDelta: -0.01,
    seniorApprovalDelta: -4,
    youthApprovalDelta: 8,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_tourism_lodging_departure_surtax',
    category: 'fiscal',
    name: {
      en: 'Inbound Tourism Overtourism & Transit Levy',
      ja: '宿泊税・国際観光旅客税引き上げ（オーバーツーリズム対策）',
    },
    description: {
      en: 'Expands international visitor departure levies and municipal lodging taxes, dedicating all proceeds to ease local transit congestion and restore historic cultural sites.',
      ja: '出国税および外国人旅行者の宿泊税を拡充。増収分を過密地域の公共交通の複線化や美観保全、オーバーツーリズム対策に全額充当する。',
    },
    impactSummary: {
      en: '+¥380B Earmarked Revenue, +4 Senior App, +2 Youth Hope.',
      ja: '特定財源 +3,800億円、地域住民・高齢者支持 +4、若者希望 +2。',
    },
    annualCostBillion: -380,
    tfrDelta: 0.0,
    hopeIndexDelta: 2,
    productivityDelta: 0.01,
    seniorApprovalDelta: 4,
    youthApprovalDelta: 4,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_tobacco_sugar_health_levy',
    category: 'fiscal',
    name: {
      en: 'Earmarked Pediatric Health Levy on Tobacco & Sugar',
      ja: 'たばこ増税・加糖飲料健康賦課金（小児医療特定財源）',
    },
    description: {
      en: 'Increases excise duties on tobacco products and introduces a moderate levy on sugar-sweetened beverages, earmarking all proceeds directly to neonatal intensive care and pediatric rare diseases.',
      ja: 'たばこ特別税の引き上げおよび高糖質清涼飲料水への健康賦課金を創設。税収の全額を新生児集中治療室（NICU）や小児医療の無償化に充当する。',
    },
    impactSummary: {
      en: '+¥420B Earmarked Revenue, -¥120B Medical Costs, +3 Hope.',
      ja: '税収増 +4,200億円、医療費抑制 1,200億円、若者希望 +3。',
    },
    annualCostBillion: -420,
    tfrDelta: 0.01,
    hopeIndexDelta: 3,
    productivityDelta: 0.0,
    seniorApprovalDelta: -1,
    youthApprovalDelta: 5,
    active: false,
    unlockedYear: 2025,
  },
  ...ADDITIONAL_ORDINANCES,
];

export const generateAnnualAgenda = (currentOrdinances: Ordinance[], currentYear: number, context?: AgendaContext): string[] => {
  const categories: OrdinanceCategory[] = ['family', 'labor', 'immigration', 'automation', 'fiscal'];
  const agendaIds: string[] = [];
  
  // Define critical thresholds based on context
  const needsFiscalRelief = context ? context.debtToGDP > 280 : false;
  const needsApproval = context ? context.cabinetApproval < 35 : false;
  const needsHope = context ? context.youthHopeIndex < 35 : false;
  const needsTFR = context ? context.tfr < 1.1 : false;
  
  categories.forEach((cat) => {
    // Get inactive policies for this category
    const inactive = currentOrdinances.filter((o) => o.category === cat && !o.active);
    
    if (context) {
      // Weight the options based on current national crises
      inactive.sort((a, b) => {
        let scoreA = Math.random() * 2;
        let scoreB = Math.random() * 2;
        
        if (needsFiscalRelief) {
          if (a.annualCostBillion < 0) scoreA += 10;
          if (b.annualCostBillion < 0) scoreB += 10;
        }
        if (needsApproval) {
          const aApproval = (a.seniorApprovalDelta + a.youthApprovalDelta) / 2;
          const bApproval = (b.seniorApprovalDelta + b.youthApprovalDelta) / 2;
          if (aApproval > 5) scoreA += 10;
          if (bApproval > 5) scoreB += 10;
        }
        if (needsHope) {
          if (a.hopeIndexDelta > 5) scoreA += 10;
          if (b.hopeIndexDelta > 5) scoreB += 10;
        }
        if (needsTFR) {
          if (a.tfrDelta > 0.05) scoreA += 10;
          if (b.tfrDelta > 0.05) scoreB += 10;
        }
        
        return scoreB - scoreA;
      });
    } else {
      // Fisher-Yates shuffle if no context provided
      for (let i = inactive.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [inactive[i], inactive[j]] = [inactive[j], inactive[i]];
      }
    }

    // Pick top 3 for this category
    let count = 0;
    for (const o of inactive) {
      if (count >= 3) break;
      agendaIds.push(o.id);
      count++;
    }
  });
  
  return agendaIds;
};

