import { GameState, MacroEvent } from '../types/game';
import { debugLogger } from './debugLogger';
import { EXPANDED_EXTERNALITIES } from './expandedEvents';

// Fixed Milestone Macro Events
export const MILESTONE_EVENTS: MacroEvent[] = [
  {
    id: 'event_energy_yen_shock_2028',
    year: 2028,
    severity: 'warning',
    title: {
      en: 'Global Energy Surge & Severe Yen Depreciation',
      ja: '世界エネルギー高騰と歴史的円安ショック',
    },
    description: {
      en: 'A geopolitical disruption in global energy markets has pushed imported fuel and food prices up by 25%. Young household disposable incomes are squeezed, threatening to trigger a marriage postponement wave.',
      ja: '海外情勢の緊迫により輸入燃料・食料価格が25%急騰。若年世帯の実質可処分所得が圧迫され、婚姻の先送りと出産控えが懸念されています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Issue Emergency Energy & Food Vouchers for Young Families',
          ja: '若年・子育て世帯へ緊急給付金・光熱費支援（¥800B）',
        },
        description: {
          en: 'Defends youth living standards. Costs Treasury ¥800B, protects Youth Hope Index (+4).',
          ja: '若者の生活防衛を最優先。国費8,000億円支出、希望指数+4。',
        },
        costBillion: 800,
        hopeDelta: 4,
        approvalDelta: 5,
        tfrDelta: 0.02,
      },
      {
        id: 'c2',
        label: {
          en: 'Enact Fiscal Austerity & Tighten Macroeconomic Policy',
          ja: '財政規律を重視し市場の自然調整に委ねる',
        },
        description: {
          en: 'Saves treasury reserves, but real youth wages drop, dampening TFR (-0.03) and Hope Index (-6).',
          ja: '財政悪化を回避するが、若年層の不満が増大し希望指数-6、TFR-0.03。',
        },
        costBillion: 0,
        hopeDelta: -6,
        approvalDelta: -7,
        tfrDelta: -0.03,
      },
    ],
  },
  {
    id: 'event_ivg_fertility_breakthrough_2034',
    year: 2034,
    severity: 'miracle',
    title: {
      en: 'Scientific Breakthrough: Advanced IVG & Reproductive Biotechnology',
      ja: '生殖バイオ技術の革命：体外配偶子形成（IVG）の実用化',
    },
    description: {
      en: 'Japanese university researchers have pioneered a groundbreaking clinical reproductive treatment that allows couples with severe biological infertility to conceive safely regardless of age constraints.',
      ja: '国内大学発ベンチャーが、加齢に伴う不妊を劇的に克服する安全な次世代生殖医療の実用化に世界で初めて成功しました。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Nationalize & Fully Subsidize IVG under Universal Insurance',
          ja: '国民皆保険に完全組み入れ・全額国費助成（¥600B/yr）',
        },
        description: {
          en: 'Massive fertility boost (+0.09 TFR) and immense optimism for aspiring parents.',
          ja: '全国TFR +0.09、若者希望指数 +8、年間助成費6,000億円。',
        },
        costBillion: 600,
        tfrDelta: 0.09,
        hopeDelta: 8,
        approvalDelta: 10,
      },
      {
        id: 'c2',
        label: {
          en: 'Allow Private Market Distribution with Modest Tax Credits',
          ja: '民間自由診療とし、一部税制優遇にとどめる',
        },
        description: {
          en: 'Zero fiscal burden, modest fertility gain (+0.02 TFR).',
          ja: '財政負担ゼロ、富裕層中心の恩恵でTFR +0.02。',
        },
        costBillion: 0,
        tfrDelta: 0.02,
        hopeDelta: 2,
        approvalDelta: 2,
      },
    ],
  },
  {
    id: 'event_nankai_earthquake_2040',
    year: 2040,
    severity: 'disaster',
    title: {
      en: 'Severe Regional Earthquake & Coastal Reconstruction Emergency',
      ja: '太平洋側大規模地震と国土強靭化・復興緊急事態',
    },
    description: {
      en: 'A high-magnitude tremor has struck the coastal industrial belt. Municipal transit and residential housing suffered major infrastructure damage, requiring immediate emergency reconstruction bonds.',
      ja: '沿岸部を震源とする大規模地震が発生。港湾インフラや地方住宅街に深刻な損壊が生じ、緊急復興債の発行と即座のインフラ復旧が求められています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Launch "Smart Resilient Reconstruction" Mega-Plan (¥3,000B)',
          ja: 'スマート防災・地方分散型復興メガプラン発動（¥3兆円）',
        },
        description: {
          en: 'Rebuilds modern automated logistics and decentralized housing hubs (+0.05 Productivity, +12 Approval).',
          ja: '最先端の自動化インフラと耐震住宅を再建。生産性+5%、内閣支持率+12%、国債増発¥3兆円。',
        },
        costBillion: 3000,
        productivityDelta: 0.05,
        approvalDelta: 12,
        hopeDelta: 4,
      },
      {
        id: 'c2',
        label: {
          en: 'Strict Bare-Minimum Restoration without Debt Expansion',
          ja: '国債増発を避け、既存予算の枠内での最小限修繕',
        },
        description: {
          en: 'Avoids debt surge, but regional depopulation accelerates and satisfaction plummets.',
          ja: '財政は守るが被災地の過疎化が加速。地方支持率-15%、若者希望指数-5。',
        },
        costBillion: 600,
        productivityDelta: -0.02,
        approvalDelta: -15,
        hopeDelta: -5,
      },
    ],
  },
  {
    id: 'event_silver_strike_2046',
    year: 2046,
    severity: 'warning',
    title: {
      en: 'Silver Democracy Surge: National Pension Defense Rallies',
      ja: 'シルバー民主主義の奔流：年金削減反対・全国高齢者総決起',
    },
    description: {
      en: 'With over 40% of the electorate now aged 65+, senior advocacy associations are staging massive demonstrations demanding guarantees on cost-of-living pension increases.',
      ja: '有権者の40%以上を65歳以上が占める中、マクロ経済スライドによる年金給付調整に抗議する大規模なデモ運動が全国で勃発しています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Stand Firm on Intergenerational Equity & Macro Slide Indexing',
          ja: '将来世代のためにマクロ経済スライドを断固維持',
        },
        description: {
          en: 'Protects youth trust and fiscal balance (+8 Hope Index), but senior voter approval crashes (-14%).',
          ja: '若年層の信頼と財政規律を守る（希望指数+8）が、高齢者支持率が激減（-14%）。',
        },
        costBillion: 0,
        hopeDelta: 8,
        approvalDelta: -14,
      },
      {
        id: 'c2',
        label: {
          en: 'Grant Special Cost-of-Living Supplement to Seniors (¥1,500B)',
          ja: '高齢者向け物価高騰特別加算金を給付（¥1.5兆円）',
        },
        description: {
          en: 'Calms silver voter outrage (+10 Approval), but burdens young tax base (-6 Hope Index).',
          ja: '高齢者の怒りを鎮静化（支持率+10%）するが、現役世代の負担感が増大（希望指数-6）。',
        },
        costBillion: 1500,
        hopeDelta: -6,
        approvalDelta: 10,
      },
    ],
  },
  {
    id: 'event_climate_refugees_2052',
    year: 2052,
    severity: 'info',
    title: {
      en: 'UN Climate Refugee Resettlement & Global Talent Pact',
      ja: '国連気候変動避難民受入れ協定と国際人材誘致',
    },
    description: {
      en: 'Rising sea levels across Southeast Asia have prompted the UN to propose a managed resettlement program. Japan is offered international green technology funds in exchange for welcoming 500,000 screened climate migrants.',
      ja: '海面上昇に伴い、国連から管理型気候避難民の受入れプログラムが打診されました。環境先進国として受入れを行えば、国際気候ファンドから巨額の技術投資が提供されます。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Accept Resettlement Compact & Settle in Depopulated Regions',
          ja: '協定を受入れ、地方過疎地へ新設コミュニティを整備',
        },
        description: {
          en: '+500,000 Active Workforce, +0.03 National TFR, +¥1,000B UN Green Fund.',
          ja: '生産年齢人口+50万人、TFR+0.03、国連ファンド受領で財政+¥1兆円。',
        },
        costBillion: -1000,
        tfrDelta: 0.03,
        productivityDelta: 0.03,
        approvalDelta: -4,
      },
      {
        id: 'c2',
        label: {
          en: 'Decline Human Resettlement; Provide Only Financial Aid',
          ja: '人的受入れは見送り、海外資金支援のみに限定（¥300B）',
        },
        description: {
          en: 'Preserves traditional domestic status quo, no workforce expansion.',
          ja: '国内の社会的摩擦を回避するが、人手不足緩和の好機を逸失。',
        },
        costBillion: 300,
        approvalDelta: 2,
      },
    ],
  },
  {
    id: 'event_superconductive_maglev_2060',
    year: 2060,
    severity: 'miracle',
    title: {
      en: 'Nationwide Superconducting Maglev Network Completion',
      ja: '全国超電導リニア中央新幹線ネットワーク全線開通',
    },
    description: {
      en: 'The superconducting maglev now connects Tokyo, Nagoya, Osaka, and regional prefectures in 30 minutes, turning Japan into a single unified megacity-commuter zone.',
      ja: '東京・名古屋・大阪および主要地方都市が30分圏で結ばれ、日本列島が「一つの巨大生活圏」へと統合されました。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Subsidize Zero-Fare Commuter Passes for Young Families',
          ja: '子育て・若年世帯向け「リニア通勤定期」全額助成（¥500B）',
        },
        description: {
          en: 'Massive decentralization away from Tokyo, sky-rocketing Regional Hope Index (+10 Hope, +0.06 TFR).',
          ja: '東京一極集中が完全解消。地方定住が爆発的に増加、希望指数+10、TFR+0.06。',
        },
        costBillion: 500,
        tfrDelta: 0.06,
        hopeDelta: 10,
        productivityDelta: 0.06,
        approvalDelta: 12,
      },
      {
        id: 'c2',
        label: {
          en: 'Operate on Standard Commercial Ticket Pricing',
          ja: '独立採算の商業運賃で運行',
        },
        description: {
          en: 'Boosts corporate productivity (+0.04) with zero fiscal expenditure.',
          ja: '財政負担なしで企業のビジネス生産性を向上（+4%）。',
        },
        costBillion: 0,
        productivityDelta: 0.04,
        approvalDelta: 4,
      },
    ],
  },
];

// Dynamic & Stochastic Macro Externalities Pool
export const STOCHASTIC_EXTERNALITIES: MacroEvent[] = [
  {
    id: 'ext_jgb_credit_watch',
    severity: 'warning',
    title: {
      en: 'International Sovereign Debt Rating Watch Warning',
      ja: '国際格付機関による日本国債「格下げ警告」',
    },
    description: {
      en: 'Global rating agencies cite escalating national debt-to-GDP ratios and ballooning social security outlays, placing sovereign bonds on negative watch. Yield spreads are widening.',
      ja: '政府債務対GDP比率の高止まりと社会保障費の膨張を受け、海外格付会社が国債格下げ警告を発令。長期金利上昇の圧力が高まっています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Announce Strict 5-Year Fiscal Consolidation Pledge',
          ja: '5カ年財政健全化コミットメントを緊急発表',
        },
        description: {
          en: 'Calms international bond markets (+¥400B Treasury balance), but dampens Youth Hope (-4).',
          ja: '市場の信認を回復し金利を安定化させるが、若者の生活支援予算が削減され希望指数-4。',
        },
        costBillion: -400,
        hopeDelta: -4,
        approvalDelta: -3,
      },
      {
        id: 'c2',
        label: {
          en: 'Defend Pro-Growth Investment & Reject Rating Agency Interference',
          ja: '未来投資を最優先し、外圧的な格下げ勧告を一蹴',
        },
        description: {
          en: 'Maintains youth subsidies and pro-fertility momentum (+5 Hope), risks bond volatility.',
          ja: '子育て・未来投資予算を完全死守。若者希望指数+5、内閣支持率+4。',
        },
        costBillion: 0,
        hopeDelta: 5,
        approvalDelta: 4,
      },
    ],
  },
  {
    id: 'ext_agi_humanoid_boom',
    severity: 'miracle',
    title: {
      en: 'Domestic Breakthrough: Autonomous Humanoid Factory Workers',
      ja: '国産自律型ヒューマノイド・介護ロボットの量産成功',
    },
    description: {
      en: 'A joint public-private consortium has commercialized high-dexterity robotic assistants capable of filling manufacturing, logistics, and eldercare shifts around the clock.',
      ja: '官民共同コンソーシアムが、製造・物流・介護の現場に即座に投入可能な高性能自律ロボットの量産化に成功しました。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Fast-Track National Deployment Subsidies (¥500B)',
          ja: '中小企業・介護施設への導入費用の半額助成（¥500B）',
        },
        description: {
          en: 'Surges national productivity (+8%), creates fiscal dividend, and relieves elderly burden.',
          ja: '労働生産性+8%、若年労働者の負担軽減、内閣支持率+8%。',
        },
        costBillion: 500,
        productivityDelta: 0.08,
        hopeDelta: 6,
        approvalDelta: 8,
      },
      {
        id: 'c2',
        label: {
          en: 'Prioritize Global Export Sales & Robotics Intellectual Property',
          ja: '海外輸出と技術特許ライセンスを優先し外貨獲得',
        },
        description: {
          en: 'Generates ¥800B foreign trade revenue directly into Treasury balance.',
          ja: '国庫へ8,000億円の外貨歳入をもたらすが、国内の即時恩恵は限定的。',
        },
        costBillion: -800,
        productivityDelta: 0.03,
        approvalDelta: 3,
      },
    ],
  },
  {
    id: 'ext_fertility_cultural_renaissance',
    severity: 'miracle',
    title: {
      en: 'Societal Paradigm Shift: Child-Friendly Cultural Renaissance',
      ja: '社会意識の大転換：「こども真ん中文化」の定着と婚姻ブーム',
    },
    description: {
      en: 'Major workplace culture changes and aggressive anti-overtime enforcement have sparked a nationwide surge in young couples choosing marriage and multi-child families.',
      ja: '長時間労働の是正とテレワークの定着により、若者の生活満足度が向上。20代・30代の婚姻件数が前年比18%増加しました。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Launch "Family First" Housing Grant Mega-Fund (¥600B)',
          ja: '若年ファミリー向け新婚住宅取得助成（¥600B）',
        },
        description: {
          en: 'Supercharges national birth rates (+0.07 TFR, +8 Youth Hope Index).',
          ja: '全国TFR +0.07、若者希望指数 +8、内閣支持率 +10%。',
        },
        costBillion: 600,
        tfrDelta: 0.07,
        hopeDelta: 8,
        approvalDelta: 10,
      },
      {
        id: 'c2',
        label: {
          en: 'Celebrate Grassroots Momentum without Extra Spending',
          ja: '民間主導の好循環を称賛し現行施策を維持',
        },
        description: {
          en: 'Modest fertility boost (+0.03 TFR) at zero additional fiscal cost.',
          ja: '追加支出なしでTFR +0.03、若者希望指数 +3。',
        },
        costBillion: 0,
        tfrDelta: 0.03,
        hopeDelta: 3,
        approvalDelta: 3,
      },
    ],
  },
  {
    id: 'ext_rural_akiya_renovation_wave',
    severity: 'info',
    title: {
      en: 'Decentralized Migration Wave: Rural Co-Living Innovations',
      ja: '地方移住ブーム：古民家・空き家再生スマート集落の勃興',
    },
    description: {
      en: 'Remote workers, digital nomads, and young entrepreneurs are flocking to rural prefectures, converting vacant Akiya properties into vibrant creative communities.',
      ja: '大都市圏から地方への若者流出とテレワーク定住が加速。各地で放置空き家が次世代コミュニティ拠点として再生されています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Establish Nationwide Regional Digital Village Subsidies (¥350B)',
          ja: '地方デジタルスマート集落推進交付金（¥350B）',
        },
        description: {
          en: 'Cuts regional Akiya abandonment, boosts regional birth rates (+0.04 TFR, +5 Hope).',
          ja: '地方過疎化を阻止、全国TFR+0.04、希望指数+5。',
        },
        costBillion: 350,
        tfrDelta: 0.04,
        hopeDelta: 5,
        approvalDelta: 6,
      },
      {
        id: 'c2',
        label: {
          en: 'Maintain Standard Municipal Tax Credits',
          ja: '自治体独自の減税措置に委ねる',
        },
        description: {
          en: 'Zero national cost, minor local revival (+1 Hope).',
          ja: '国費負担ゼロ、緩やかな自然定着（希望指数+1）。',
        },
        costBillion: 0,
        hopeDelta: 1,
        approvalDelta: 1,
      },
    ],
  },
  {
    id: 'ext_global_talent_tech_boom',
    severity: 'info',
    title: {
      en: 'Kyushu & Kansai Semiconductor Hub Foreign Direct Investment',
      ja: '半導体・先端医療ハブへの巨額海外直接投資（FDI）流入',
    },
    description: {
      en: 'International tech conglomerates have selected Japan for massive fabrication plants, seeking high engineering standards, clean energy, and political stability.',
      ja: '地政学リスクの高まりを背景に、世界的な半導体・バイオ企業が日本への巨額工場建設と先端R&D拠点の新設を決定しました。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Match with National Infrastructure & Skilled Visa Grants (¥400B)',
          ja: '高度外国人材特区と産業インフラを緊急整備（¥400B）',
        },
        description: {
          en: '+¥1,200B GDP boost, +0.05 Productivity, creates well-paid regional youth careers.',
          ja: '生産性+5%、GDP拡大、若者の高年収雇用を創出（希望指数+5）。',
        },
        costBillion: 400,
        productivityDelta: 0.05,
        hopeDelta: 5,
        approvalDelta: 7,
      },
      {
        id: 'c2',
        label: {
          en: 'Levy Standard Corporate Taxes with Zero Special Incentives',
          ja: '特別支援を行わず、標準税制で着実な税収増を確保',
        },
        description: {
          en: 'Provides steady tax revenue (+¥300B) without national expenditure.',
          ja: '財政赤字を増やさずに税収増+¥3,000億円。',
        },
        costBillion: -300,
        productivityDelta: 0.02,
        approvalDelta: 2,
      },
    ],
  },
  {
    id: 'ext_low_fertility_alarm',
    severity: 'warning',
    title: {
      en: 'National Demographic Crisis Warning: Below Replacement Low',
      ja: '出生数急減ショック：国家存亡危機・非常事態宣言の提言',
    },
    description: {
      en: 'A sudden dip in marriages has driven annual births down to unprecedented lows. Civic groups and business federations plead for sweeping national interventions.',
      ja: '婚姻数の減少と物価高の長期化により、年間の出生数が過去最低水準を更新。経済界と学術界が連名で緊急対策を迫っています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Pass Emergency Child Endowment & Baby Bonus Package (¥1,000B)',
          ja: '出産一時金倍増・教育無償化緊急パッケージ（¥1兆円）',
        },
        description: {
          en: 'Restores youth confidence instantly (+0.06 TFR, +7 Hope), funded by special bonds.',
          ja: '若年層の不安を払拭しTFR+0.06、希望指数+7、内閣支持率+8%。',
        },
        costBillion: 1000,
        tfrDelta: 0.06,
        hopeDelta: 7,
        approvalDelta: 8,
      },
      {
        id: 'c2',
        label: {
          en: 'Launch Awareness Campaign & Regional Matching Initiatives',
          ja: '地方自治体婚活サポートと広報キャンペーンに限定',
        },
        description: {
          en: 'Low fiscal cost (¥50B), minimal structural impact (-4 Hope Index).',
          ja: '国費500億円のみ支出するが、抜本的解決に至らず希望指数-4。',
        },
        costBillion: 50,
        hopeDelta: -4,
        approvalDelta: -5,
        tfrDelta: -0.02,
      },
    ],
  },
];

// Combine all stochastic externalities (base + expanded 40-event suite)
export const ALL_STOCHASTIC_EVENTS: MacroEvent[] = [
  ...STOCHASTIC_EXTERNALITIES,
  ...EXPANDED_EXTERNALITIES,
];

// Combine all possible events
export const MACRO_EVENTS: MacroEvent[] = [
  ...MILESTONE_EVENTS,
  ...ALL_STOCHASTIC_EVENTS,
];

// Trigger history tracking in-session
const triggeredEventsSet = new Set<string>();

export function resetEventHistory() {
  triggeredEventsSet.clear();
}

/**
 * Evaluates whether a macro event or stochastic externality should trigger during the annual tick.
 */
export function checkAndTriggerMacroEvent(
  gameState: GameState,
  customEventsPool?: MacroEvent[]
): MacroEvent | null {
  const currentYear = gameState.currentYear;
  const eventsPool = customEventsPool && customEventsPool.length > 0
    ? customEventsPool
    : [...MILESTONE_EVENTS, ...STOCHASTIC_EXTERNALITIES, ...EXPANDED_EXTERNALITIES];

  // 1. Check Fixed Milestone Events
  const milestone = eventsPool.find(
    (e) => e.year === currentYear && !triggeredEventsSet.has(e.id)
  );
  if (milestone) {
    triggeredEventsSet.add(milestone.id);
    debugLogger.logMacroEventRoll(currentYear, {
      year: currentYear,
      roll: 1.0,
      threshold: 1.0,
      triggered: true,
      type: 'milestone',
      eventId: milestone.id,
      eventTitle: milestone.title.en,
    });
    return milestone;
  }

  // 2. Condition-Based Crisis / Opportunity Triggers
  if (gameState.economy.debtToGDP >= 265 && !triggeredEventsSet.has('ext_jgb_credit_watch')) {
    triggeredEventsSet.add('ext_jgb_credit_watch');
    const evt = eventsPool.find((e) => e.id === 'ext_jgb_credit_watch') || null;
    if (evt) {
      debugLogger.logMacroEventRoll(currentYear, {
        year: currentYear,
        roll: 1.0,
        threshold: 1.0,
        triggered: true,
        type: 'conditional',
        eventId: evt.id,
        eventTitle: evt.title.en,
      });
      return evt;
    }
  }

  if (gameState.demographics.tfr < 1.18 && gameState.demographics.youthHopeIndex < 42 && !triggeredEventsSet.has('ext_low_fertility_alarm')) {
    triggeredEventsSet.add('ext_low_fertility_alarm');
    const evt = eventsPool.find((e) => e.id === 'ext_low_fertility_alarm') || null;
    if (evt) {
      debugLogger.logMacroEventRoll(currentYear, {
        year: currentYear,
        roll: 1.0,
        threshold: 1.0,
        triggered: true,
        type: 'conditional',
        eventId: evt.id,
        eventTitle: evt.title.en,
      });
      return evt;
    }
  }

  if (gameState.demographics.youthHopeIndex >= 70 && !triggeredEventsSet.has('ext_fertility_cultural_renaissance')) {
    triggeredEventsSet.add('ext_fertility_cultural_renaissance');
    const evt = eventsPool.find((e) => e.id === 'ext_fertility_cultural_renaissance') || null;
    if (evt) {
      debugLogger.logMacroEventRoll(currentYear, {
        year: currentYear,
        roll: 1.0,
        threshold: 1.0,
        triggered: true,
        type: 'conditional',
        eventId: evt.id,
        eventTitle: evt.title.en,
      });
      return evt;
    }
  }

  // 3. Stochastic Random Externalities (approx 28% chance per year)
  const roll = Math.random();
  if (roll < 0.28) {
    // Filter available untriggered stochastic events (events with no fixed future year)
    const available = eventsPool.filter((e) => !e.year && !triggeredEventsSet.has(e.id));
    if (available.length > 0) {
      const selectedIndex = Math.floor(Math.random() * available.length);
      const selectedEvent = available[selectedIndex];
      triggeredEventsSet.add(selectedEvent.id);
      debugLogger.logMacroEventRoll(currentYear, {
        year: currentYear,
        roll: Number(roll.toFixed(4)),
        threshold: 0.28,
        triggered: true,
        type: 'stochastic',
        eventId: selectedEvent.id,
        eventTitle: selectedEvent.title.en,
      });
      return selectedEvent;
    }
  }

  debugLogger.logMacroEventRoll(currentYear, {
    year: currentYear,
    roll: Number(roll.toFixed(4)),
    threshold: 0.28,
    triggered: false,
    type: 'none',
  });

  return null;
}
