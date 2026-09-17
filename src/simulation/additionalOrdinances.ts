import { Ordinance } from '../types/game';

/**
 * 17 Additional High-Realism Legislative Ordinances
 * Expanding total policy repertoire to exactly 90 distinct bills.
 * Categories:
 * - Family: 3 bills (Total: 22)
 * - Labor: 4 bills (Total: 19)
 * - Immigration: 4 bills (Total: 17)
 * - Automation: 3 bills (Total: 15)
 * - Fiscal: 3 bills (Total: 17)
 * Overall Total: 90 Ordinances
 */
export const ADDITIONAL_ORDINANCES: Ordinance[] = [
  // --- FAMILY (3 new -> 22 total) ---
  {
    id: 'ord_fertility_treatment_expansion',
    category: 'family',
    name: {
      en: 'Full Public Coverage for Advanced Fertility & Embryo Screening',
      ja: '先進不妊治療・着床前遺伝学的検査（PGT-A）の全面保険適用',
    },
    description: {
      en: 'Expands national health insurance to cover 100% of advanced reproductive technologies including pre-implantation genetic testing (PGT-A) and blastocyst vitrification with zero cycle caps.',
      ja: '体外受精や着床前診断（PGT-A）、胚盤胞凍結などの高度先進生殖医療を回数制限なく全額保険適用化。不妊治療にかかる経済的・身体的障壁を徹底排除する。',
    },
    impactSummary: {
      en: '+0.03 TFR, +4 Youth Hope, +8 Youth App, Cost: ¥180B/yr.',
      ja: 'TFR +0.03、若者希望 +4、若者支持 +8、歳出 +1,800億円/年。',
    },
    annualCostBillion: 180,
    tfrDelta: 0.03,
    hopeIndexDelta: 4,
    productivityDelta: 0.01,
    seniorApprovalDelta: 0,
    youthApprovalDelta: 8,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_single_parent_allowance_boost',
    category: 'family',
    name: {
      en: 'Doubling of Single-Parent Child-Rearing Allowance',
      ja: 'ひとり親家庭への児童扶養手当の所得制限大幅緩和・倍増',
    },
    description: {
      en: 'Substantially relaxes the income eligibility ceiling and doubles the monthly stipend for single parents, eradicating generational poverty traps for single mothers and fathers.',
      ja: 'ひとり親世帯向けの児童扶養手当の所得制限限度額を大幅に引き上げ、満額給付額を月額約8.5万円へ倍増。子どもの貧困と教育格差の連鎖を断ち切る。',
    },
    impactSummary: {
      en: '+0.02 TFR, +6 Youth Hope, +9 Youth App, Cost: ¥350B/yr.',
      ja: 'TFR +0.02、若者希望 +6、若者支持 +9、歳出 +3,500億円/年。',
    },
    annualCostBillion: 350,
    tfrDelta: 0.02,
    hopeIndexDelta: 6,
    productivityDelta: 0.01,
    seniorApprovalDelta: -1,
    youthApprovalDelta: 9,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_corporate_daycare_mandate',
    category: 'family',
    name: {
      en: 'Mandatory Corporate Childcare Facilities for Large Enterprises',
      ja: '従業員300人以上企業への事業所内保育所・地域開放の義務化',
    },
    description: {
      en: 'Mandates all enterprises with 300+ employees to operate on-site childcare or co-sponsor neighborhood nursery centers open to local residents, backed by state matching funds.',
      ja: '常用雇用300人以上の大企業・中堅企業に対し、オフィス内または近隣での保育所設置（地域住民枠の開放含む）を法定义務化。国の助成金とセットで就業両立を担保。',
    },
    impactSummary: {
      en: '+0.04 TFR, +5 Youth Hope, +10 Youth App, Cost: ¥220B/yr.',
      ja: 'TFR +0.04、若者希望 +5、若者支持 +10、歳出 +2,200億円/年。',
    },
    annualCostBillion: 220,
    tfrDelta: 0.04,
    hopeIndexDelta: 5,
    productivityDelta: 0.02,
    seniorApprovalDelta: 2,
    youthApprovalDelta: 10,
    active: false,
    unlockedYear: 2025,
  },

  // --- LABOR (4 new -> 19 total) ---
  {
    id: 'ord_minimum_wage_1500_yen',
    category: 'labor',
    name: {
      en: 'Accelerated National Uniform Minimum Wage of ¥1,500/hr',
      ja: '全国一律最低賃金1,500円早期実現法（地域間格差是正）',
    },
    description: {
      en: 'Establishes a uniform national minimum wage floor of ¥1,500 across all 47 prefectures, narrowing regional wage disparities and significantly boosting youth disposable income.',
      ja: '都道府県ごとの最低賃金ランクを撤廃し、全国一律で時給1,500円以上を義務付け。中小企業への省力化投資助成をセットにし、若年層の地方流出と手取りの低迷を打破。',
    },
    impactSummary: {
      en: '+0.03 TFR, +8 Youth Hope, +0.03 Productivity, Cost: ¥150B/yr.',
      ja: 'TFR +0.03、若者希望 +8、生産性 +0.03、若者支持 +14、歳出 +1,500億円/年。',
    },
    annualCostBillion: 150,
    tfrDelta: 0.03,
    hopeIndexDelta: 8,
    productivityDelta: 0.03,
    seniorApprovalDelta: -3,
    youthApprovalDelta: 14,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_statutory_telework_right',
    category: 'labor',
    name: {
      en: 'Statutory Right to Remote Work & Home Office Tax Exemption',
      ja: 'テレワーク請求権の法制化と在宅勤務手当非課税枠拡充',
    },
    description: {
      en: 'Grants employees in eligible desk-based occupations the legal right to request full remote or hybrid work, accompanied by a ¥15,000/mo tax-exempt telework utility allowance.',
      ja: 'デスクワーク業務に従事する労働者に対し、合理的な業務支障がない限りテレワークを請求できる権利を制定。在宅勤務手当を月1.5万円まで非課税化し、地方移住と子育て両立を支援。',
    },
    impactSummary: {
      en: '+0.04 TFR, +7 Youth Hope, +0.04 Productivity, Cost: ¥120B/yr.',
      ja: 'TFR +0.04、若者希望 +7、生産性 +0.04、若者支持 +11、税収減 -1,200億円/年。',
    },
    annualCostBillion: 120,
    tfrDelta: 0.04,
    hopeIndexDelta: 7,
    productivityDelta: 0.04,
    seniorApprovalDelta: -2,
    youthApprovalDelta: 11,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_recurrent_education_sabbatical',
    category: 'labor',
    name: {
      en: 'National Paid Lifelong Reskilling & Educational Sabbatical Act',
      ja: 'リカレント教育有給休暇法（社会人学び直しリスキリング給付）',
    },
    description: {
      en: 'Subsidizes up to 12 months of 75% salary replacement for mid-career workers taking sabbaticals to earn degrees or credentials in AI, green tech, and advanced healthcare.',
      ja: '社会人が大学・大学院や高度専門訓練機関で学び直す場合、最長1年間にわたり賃金の75%を雇用保険と国費で支給。労働者の自律的キャリア形成と高付加価値分野への労働移動を促す。',
    },
    impactSummary: {
      en: '+0.06 Productivity, +6 Youth Hope, +8 Youth App, Cost: ¥280B/yr.',
      ja: '生産性 +0.06、若者希望 +6、若者支持 +8、歳出 +2,800億円/年。',
    },
    annualCostBillion: 280,
    tfrDelta: 0.01,
    hopeIndexDelta: 6,
    productivityDelta: 0.06,
    seniorApprovalDelta: 1,
    youthApprovalDelta: 8,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_overtime_premium_surge_60h',
    category: 'labor',
    name: {
      en: 'Overtime Surcharge Escalation (75% Premium on Over 60h)',
      ja: '月60時間超の時間外割増賃金率75%への引き上げ（長時間労働撲滅）',
    },
    description: {
      en: 'Ratchets the statutory overtime surcharge from 50% to 75% for hours worked beyond 60 hours per month, making chronic corporate overwork economically prohibitive for management.',
      ja: '月60時間を超える時間外労働に対する法定割増賃金率を現行の50%から75%へ引き上げ。過密労働を続ける企業に強烈な金銭的ペナルティを課し、徹底した定時退社と人員拡充を強制。',
    },
    impactSummary: {
      en: '+0.03 TFR, +6 Youth Hope, +0.02 Productivity, Cost: ¥0B/yr.',
      ja: 'TFR +0.03、若者希望 +6、生産性 +0.02、若者支持 +12、歳出 0円。',
    },
    annualCostBillion: 0,
    tfrDelta: 0.03,
    hopeIndexDelta: 6,
    productivityDelta: 0.02,
    seniorApprovalDelta: -2,
    youthApprovalDelta: 12,
    active: false,
    unlockedYear: 2025,
  },

  // --- IMMIGRATION (4 new -> 17 total) ---
  {
    id: 'ord_foreign_nurse_exam_multilingual',
    category: 'immigration',
    name: {
      en: 'Multilingual National Medical & Caregiver Licensing Reform',
      ja: '外国人看護師・介護福祉士国家試験の英語・多言語化特例法',
    },
    description: {
      en: 'Permits qualified foreign medical candidates to take national healthcare licensure exams with bilingual terminology glossaries and extended exam times, removing artificial language hurdles.',
      ja: 'EPAおよび外国人看護師・介護福祉士候補者に対し、国家試験での英日対訳用語集の持ち込みや試験時間延長を認可。漢字読解の難度による理不尽な不合格を撤廃し、医療従事者を即戦力化。',
    },
    impactSummary: {
      en: '+0.04 Productivity, +5 Senior App, +4 Youth App, Cost: ¥40B/yr.',
      ja: '生産性 +0.04、高齢者支持 +5、若者支持 +4、歳出 +400億円/年。',
    },
    annualCostBillion: 40,
    tfrDelta: 0.01,
    hopeIndexDelta: 2,
    productivityDelta: 0.04,
    seniorApprovalDelta: 5,
    youthApprovalDelta: 4,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_points_based_pr_1yr',
    category: 'immigration',
    name: {
      en: '1-Year Fast-Track Permanent Residency for Top STEM Graduates',
      ja: '高度外国人材ポイント制1年永住特例と世界トップ大卒業生優遇',
    },
    description: {
      en: 'Grants permanent residency after just 12 months of domestic residency for foreign researchers, engineers, and founders scoring 80+ points, including spousal full employment rights.',
      ja: '高度外国人材ポイント80点以上の研究者・技術者・起業家に対し、日本滞在わずか1年で永住許可を付与。配偶者の無制限就労や親の帯同を全面的に認可し、世界最高峰の頭脳を東京に集積。',
    },
    impactSummary: {
      en: '+0.06 Productivity, +3 Youth Hope, +7 Youth App, Cost: ¥30B/yr.',
      ja: '生産性 +0.06、若者希望 +3、若者支持 +7、歳出 +300億円/年。',
    },
    annualCostBillion: 30,
    tfrDelta: 0.01,
    hopeIndexDelta: 3,
    productivityDelta: 0.06,
    seniorApprovalDelta: -3,
    youthApprovalDelta: 7,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_depopulation_immigrant_homestead',
    category: 'immigration',
    name: {
      en: 'Regional Depopulation Immigrant Settlement & Farmland Access Act',
      ja: '過疎地再生外国人移住定住・農地取得特区法',
    },
    description: {
      en: 'Authorizes vetted foreign agricultural and eco-tourism entrepreneurs to acquire dormant farmland and renovated akiya houses in designated depopulated rural municipalities.',
      ja: '消滅危機自治体において、農業やインバウンド観光事業に取り組む身元確実な外国人定住者に対し、荒廃農地の取得規制を緩和し空き家住宅を無償供与。過疎集落の人口維持と農地再生を図る。',
    },
    impactSummary: {
      en: '+0.02 TFR, +0.03 Productivity, +6 Youth App, Cost: ¥70B/yr.',
      ja: 'TFR +0.02、生産性 +0.03、若者支持 +6、歳出 +700億円/年。',
    },
    annualCostBillion: 70,
    tfrDelta: 0.02,
    hopeIndexDelta: 4,
    productivityDelta: 0.03,
    seniorApprovalDelta: -4,
    youthApprovalDelta: 6,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_foreign_startup_sbir_access',
    category: 'immigration',
    name: {
      en: 'Equal Access for Immigrant Tech Founders to Public Procurement',
      ja: '外国人創業スタートアップの官公需入札参入・SBIR助成開放',
    },
    description: {
      en: 'Opens Japanese government procurement tenders and SBIR commercialization grants to foreign-founded startups registered in Japan, removing nationality barriers in public contracts.',
      ja: '国内登記された外国人起業スタートアップに対し、日本政府の公共調達入札への全面参入とSBIR技術開発補助金の同等受給権を保障。閉鎖的な官公庁入札をグローバルイノベーションに開放。',
    },
    impactSummary: {
      en: '+0.05 Productivity, +3 Youth Hope, +6 Youth App, Cost: ¥90B/yr.',
      ja: '生産性 +0.05、若者希望 +3、若者支持 +6、歳出 +900億円/年。',
    },
    annualCostBillion: 90,
    tfrDelta: 0.0,
    hopeIndexDelta: 3,
    productivityDelta: 0.05,
    seniorApprovalDelta: -2,
    youthApprovalDelta: 6,
    active: false,
    unlockedYear: 2025,
  },

  // --- AUTOMATION & TECH (3 new -> 15 total) ---
  {
    id: 'ord_autonomous_coastal_shipping',
    category: 'automation',
    name: {
      en: 'Fully Autonomous Coastal Cargo & Zero-Crew Maritime Grid',
      ja: '内航海運の完全自動運航船・無人海上輸送ネットワーク',
    },
    description: {
      en: 'Deploys AI-piloted electric container vessels across domestic coastal shipping lanes, bypassing critical trucker shortages and cutting logistics emissions by 40%.',
      ja: '国内内航貨物船の完全自律自動運航（レベル4無人航行）を支援・実用化。船員・トラック運転手の超高齢化による国内物資供給の麻痺を未然に防ぎ、物流コストを大幅に低減。',
    },
    impactSummary: {
      en: '+0.06 Productivity, +3 Youth Hope, +5 Youth App, Cost: ¥320B/yr.',
      ja: '生産性 +0.06、若者希望 +3、若者支持 +5、歳出 +3,200億円/年。',
    },
    annualCostBillion: 320,
    tfrDelta: 0.0,
    hopeIndexDelta: 3,
    productivityDelta: 0.06,
    seniorApprovalDelta: 2,
    youthApprovalDelta: 5,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_smart_eldercare_iot_beds',
    category: 'automation',
    name: {
      en: 'National Rollout of IoT Vital-Sensor Beds in Geriatric Wards',
      ja: '全国の特別養護老人ホームへの見守り生体センサーベッド完全配備',
    },
    description: {
      en: 'Equips 100% of nursing home beds with non-invasive cardiovascular and sleep respiration sensors, cutting nighttime nursing patrol burdens by 60%.',
      ja: '全国の特養・介護施設全床に心拍・呼吸・体動をリアルタイム検知する非接触生体センサーベッドを導入。夜間の巡回負担を60%削減し、少人数での安全な24時間ケアを実現。',
    },
    impactSummary: {
      en: '+0.04 Productivity, +9 Senior App, +3 Youth App, Cost: ¥240B/yr.',
      ja: '生産性 +0.04、高齢者支持 +9、若者支持 +3、歳出 +2,400億円/年。',
    },
    annualCostBillion: 240,
    tfrDelta: 0.0,
    hopeIndexDelta: 2,
    productivityDelta: 0.04,
    seniorApprovalDelta: 9,
    youthApprovalDelta: 3,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_ai_patent_instant_examination',
    category: 'automation',
    name: {
      en: 'Automated AI Patent Examination & Instant Regulatory Sandboxes',
      ja: '知的財産・特許審査の完全AI自動化と即日サンドボックス特区',
    },
    description: {
      en: 'Deploys specialized neural models to slash intellectual property examination from 14 months to 72 hours, accelerating domestic deep-tech commercialization.',
      ja: '特許庁の先行技術調査と特許出願審査に先端生成AIモデルを全面導入。通常1年以上かかる権利化プロセスを最速3日間に短縮し、日本の技術シーズの事業化速度を世界最速レベルへ引き上げる。',
    },
    impactSummary: {
      en: '+0.07 Productivity, +4 Youth Hope, +7 Youth App, Cost: ¥110B/yr.',
      ja: '生産性 +0.07、若者希望 +4、若者支持 +7、歳出 +1,100億円/年。',
    },
    annualCostBillion: 110,
    tfrDelta: 0.0,
    hopeIndexDelta: 4,
    productivityDelta: 0.07,
    seniorApprovalDelta: 1,
    youthApprovalDelta: 7,
    active: false,
    unlockedYear: 2025,
  },

  // --- FISCAL (3 new -> 17 total) ---
  {
    id: 'ord_crypto_web3_separate_taxation',
    category: 'fiscal',
    name: {
      en: '20% Flat Separate Tax on Crypto Assets & Web3 Capital Gains',
      ja: '暗号資産・Web3キャピタルゲインの20%申告分離課税化',
    },
    description: {
      en: 'Replaces the punitive maximum 55% progressive miscellaneous income tax on digital assets with a flat 20% separate capital gains tax, repatriating domestic crypto capital and tech talent.',
      ja: '暗号資産の利益に対する現行の最大55%総合課税（雑所得）を廃止し、上場株式と同様の一律20%申告分離課税へ是正。海外に流出していた起業家・投資資金の国内還流を促す。',
    },
    impactSummary: {
      en: '+¥180B Tax Revenue, +0.04 Productivity, +12 Youth App, Cost: -¥180B/yr.',
      ja: '税収増 +1,800億円/年、生産性 +0.04、若者希望 +6、若者支持 +12。',
    },
    annualCostBillion: -180,
    tfrDelta: 0.01,
    hopeIndexDelta: 6,
    productivityDelta: 0.04,
    seniorApprovalDelta: -3,
    youthApprovalDelta: 12,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_vacant_home_demolition_surtax',
    category: 'fiscal',
    name: {
      en: 'Akiya Demolition Incentive & Land Speculation Surcharge',
      ja: '放置空き家の固定資産税優遇全廃・解体促進ペナルティ賦課金',
    },
    description: {
      en: 'Strips the 83% residential land property tax discount from abandoned hazardous properties and levies an escalating municipal nuisance surcharge to liberate urban land for family housing.',
      ja: '倒壊や防犯上のリスクがある特定放置空き家に対し、住宅用地の固定資産税6分の1減免特例を即時剥奪し、除却を促す特別過料を賦課。遊休不動産の流通を加速させ子育て住宅用地を供給。',
    },
    impactSummary: {
      en: '+¥160B Tax Revenue, +0.02 TFR, +8 Youth App, Cost: -¥160B/yr.',
      ja: '税収増 +1,600億円/年、TFR +0.02、若者希望 +5、若者支持 +8。',
    },
    annualCostBillion: -160,
    tfrDelta: 0.02,
    hopeIndexDelta: 5,
    productivityDelta: 0.02,
    seniorApprovalDelta: -4,
    youthApprovalDelta: 8,
    active: false,
    unlockedYear: 2025,
  },
  {
    id: 'ord_defense_resilience_procurement_tax',
    category: 'fiscal',
    name: {
      en: 'Dual-Use Tech Resilience & Critical Supply Chain Surtax',
      ja: '経済安全保障サプライチェーン強靭化特別法人税（半導体・重要鉱物基金）',
    },
    description: {
      en: 'Enacts a targeted 1.8% corporate surtax on defense contractors and conglomerate windfalls, pooling all receipts to onshore domestic 2nm chip fabrication and rare-earth processing.',
      ja: '大規模法人に対し1.8%の付加税を課し、税収の全額を次世代半導体国産化ファウンドリ（2nm以下）やレアアース備蓄・精錬施設の国内整備基金へ直結。地政学的ショックへの耐性を構築。',
    },
    impactSummary: {
      en: '+¥520B Earmarked Revenue, +0.03 Productivity, Cost: -¥520B/yr.',
      ja: '特定税収 +5,200億円/年、生産性 +0.03、高齢者支持 +4、若者支持 +1。',
    },
    annualCostBillion: -520,
    tfrDelta: 0.0,
    hopeIndexDelta: 1,
    productivityDelta: 0.03,
    seniorApprovalDelta: 4,
    youthApprovalDelta: 1,
    active: false,
    unlockedYear: 2025,
  },
];
