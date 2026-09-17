import { MacroEvent } from '../types/game';

/**
 * 40 High-Fidelity Emergency, Crisis & Opportunity Notification Events
 * Spanning Fiscal, Demographic, Labor/Healthcare, Infrastructure/Disaster, and Tech domains.
 */
export const EXPANDED_EXTERNALITIES: MacroEvent[] = [
  // --- I. FISCAL & SOVEREIGN DEBT EMERGENCIES ---
  {
    id: 'ext_jgb_flash_spike',
    title: {
      en: 'Emergency Flash Spike in 10-Year JGB Yields',
      ja: '長期国債利回りの急騰ショック（債券市場の警戒）',
    },
    headline: {
      en: 'Aggressive Overseas Selling Pushes Benchmark Yield Above 3.0%',
      ja: '海外ヘッジファンドの売り攻勢で10年債利回りが3%を突破',
    },
    description: {
      en: 'A sudden wave of foreign institutional sell-offs has triggered liquidity friction in the JGB market. Without decisive Cabinet guidance or Bank of Japan intervention, debt service costs will rapidly crowd out all domestic policy programs.',
      ja: '海外投機勢による国債売りが加速し、長期金利が急伸。このまま放置すれば年間数兆円の国債費増大を招き、社会保障や子育て関連予算を圧迫する緊急事態となっています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Order Emergency BOJ Bond Purchases & Announce Deficit Ceilings',
          ja: '日銀の緊急国債買い入れ要請と財政規律コミットメントを発表',
        },
        description: {
          en: 'Calms bond markets (-0.35% yield pressure) with ¥500B emergency market-stabilization fund.',
          ja: '市場の動揺を鎮静化するが、緊急資金拠出として国費5,000億円を計上。内閣支持率+2%。',
        },
        costBillion: 500,
        approvalDelta: 2,
        hopeDelta: 2,
      },
      {
        id: 'c2',
        label: {
          en: 'Let Yields Adjust Naturally & Pass Emergency Expenditure Freezes',
          ja: '市場機能に委ね、各省庁の新規執行予算を一律3%凍結',
        },
        description: {
          en: 'Saves immediate cash (-¥800B deficit) but dents youth hope (-6) and consumer sentiment.',
          ja: '歳出を8,000億円圧縮するが、予算凍結により若者希望指数-6、支持率-8%。',
        },
        costBillion: -800,
        hopeDelta: -6,
        approvalDelta: -8,
      },
    ],
  },
  {
    id: 'ext_municipal_insolvency_wave',
    title: {
      en: 'Regional Municipal Default Crisis (The Yubari Domino)',
      ja: '地方自治体財政破綻ドミノ（第2の夕張危機）',
    },
    headline: {
      en: 'Three Regional Capitals Issue Immediate Insolvency Petitions',
      ja: '過疎化とインフラ維持費の二重苦で3自治体が財政再建団体への転落を申請',
    },
    description: {
      en: 'Decades of population decline and shrinking local tax bases have left regional prefectural hubs unable to service their municipal bonds and maintain basic utilities. They appeal directly to Kasumigaseki for emergency restructuring relief.',
      ja: '人口急減に伴う住民税収の落ち込みと水道・道路の老朽化が限界に達し、地方中核都市を含む複数自治体が債務不履行の危機に瀕しています。中央政府の緊急救済が要請されています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Enact National Local Allocation Bailout & Modernize Infrastructure (¥1.2T)',
          ja: '地方交付税の緊急拡充と広域インフラ再編ファンドの創設（1.2兆円）',
        },
        description: {
          en: 'Completely stabilizes regional municipalities (+12 Senior Approval, +4 Youth Hope).',
          ja: '地方破綻を回避し高齢者支持率+12%、地方の若者希望+4。歳出1.2兆円。',
        },
        costBillion: 1200,
        approvalDelta: 6,
        hopeDelta: 4,
      },
      {
        id: 'c2',
        label: {
          en: 'Mandate Compulsory Municipal Amalgamations & Service Reductions',
          ja: '強制市町村合併と公的サービス半減による徹底合理化',
        },
        description: {
          en: 'Zero central fiscal cost, but rural public discontent surges (-15 Approval).',
          ja: '財政支出ゼロで乗り切るが、住民サービス削減に地方世論が猛反発し支持率-15%。',
        },
        costBillion: 0,
        approvalDelta: -15,
        hopeDelta: -5,
      },
    ],
  },
  {
    id: 'ext_credit_rating_downgrade',
    title: {
      en: 'Global Sovereign Credit Rating Downgrade',
      ja: '国際格付機関による日本国債格下げショック',
    },
    headline: {
      en: 'S&P and Fitch Downgrade Japan Sovereign Debt Over Demographic Liabilities',
      ja: '社会保障費の膨張と少子高齢化リスクを理由に国債格付けを1段階引き下げ',
    },
    description: {
      en: 'Major international rating agencies cite unsustainable entitlement spending and sluggish workforce renewal as structural risks, downgrading Japan’s sovereign debt. Institutional capital demands immediate consolidation proof.',
      ja: '持続不可能な社会保障債務と労働人口の縮小を主因に、国際格付機関が日本国債の格付けを引き下げました。海外投資家から財政健全化への具体的工程表が強く求められています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Deliver Multi-Year Productivity & Deficit Target Framework',
          ja: '5カ年財政健全化・DX生産性向上ロードマップの閣議決定',
        },
        description: {
          en: 'Assuages foreign investors (+0.03 Productivity, +3 Approval) at ¥300B structural cost.',
          ja: '市場の信頼を取り戻し生産性+0.03、内閣支持率+3%。改革推進費3,000億円。',
        },
        costBillion: 300,
        productivityDelta: 0.03,
        approvalDelta: 3,
      },
      {
        id: 'c2',
        label: {
          en: 'Condemn External Rating Methodologies & Rely on Domestic Liquidity',
          ja: '「国内消化率の高さを無視した不当な格付け」と反論し静観',
        },
        description: {
          en: 'Zero fiscal outlay, but raises uncertainty and dampens youth investment confidence (-5 Hope).',
          ja: '予算支出を伴わないが、円安・株安が進行し若年層の景気不安が増大（希望指数-5）。',
        },
        costBillion: 0,
        hopeDelta: -5,
        approvalDelta: -4,
      },
    ],
  },
  {
    id: 'ext_yen_flash_plunge_180',
    title: {
      en: 'Historic Currency Plunge: Yen Breaches ¥180/USD',
      ja: '歴史的円安ショック：1ドル＝180円突破',
    },
    headline: {
      en: 'Imported Food and Energy Inflation Hits Household Budgets Hard',
      ja: '輸入エネルギー・食料価格が高騰し、国民生活と中小企業を直撃',
    },
    description: {
      en: 'Widening interest rate differentials and high energy imports have triggered an uncontrollable depreciation of the yen to ¥180 per dollar. Working families face soaring supermarket prices and utility bills.',
      ja: '内外金利差とエネルギー輸入の増大により円売りが加速し、為替相場が180円台へ急落。電気代や食料品価格が急騰し、若年子育て世帯の実質可処分所得が急激に目減りしています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Issue Emergency Household Cost-of-Living Vouchers (¥800B)',
          ja: '子育て・低所得世帯向け緊急物価高克服給付金（8,000億円）',
        },
        description: {
          en: 'Cushions family budgets (+5 Youth Hope, +8 Approval, +0.02 TFR).',
          ja: '家計を支援し若者希望指数+5、内閣支持率+8%、TFR+0.02。',
        },
        costBillion: 800,
        hopeDelta: 5,
        approvalDelta: 8,
        tfrDelta: 0.02,
      },
      {
        id: 'c2',
        label: {
          en: 'Promote Export Substitution & Inbound Tourism Exploitation',
          ja: '円安を逆手に取った輸出製造業支援とインバウンド誘致特化',
        },
        description: {
          en: 'Accelerates corporate GDP growth (+0.04 Productivity) while leaving consumer prices high.',
          ja: '輸出企業を刺激し生産性+0.04を達成するが、物価高放置への批判で支持率-6%。',
        },
        costBillion: 150,
        productivityDelta: 0.04,
        approvalDelta: -6,
      },
    ],
  },
  {
    id: 'ext_gpif_liquidity_squeeze',
    title: {
      en: 'GPIF Pension Liquidity Squeeze Warning',
      ja: 'GPIF（年金積立金管理運用独立行政法人）流動性逼迫',
    },
    headline: {
      en: 'Senior Benefit Outlays Outpace Contributions by ¥8 Trillion Annually',
      ja: '団塊ジュニア世代の完全受給期入りで積立金の現物取り崩しが急加速',
    },
    description: {
      en: 'With retirees peaking and working contributors declining, the Government Pension Investment Fund is forced to liquidate domestic blue-chip assets to pay monthly benefits, triggering stock market volatility.',
      ja: '年金受給者数がピークを迎え、GPIFは毎月の年金給付原資を捻出するために国内株式・債券の大規模売却を迫られています。株式市場の急落と将来不安が広がっています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Inject Treasury Support & Diversify Sovereign Tech Portfolio (¥600B)',
          ja: '一般会計からの緊急国費補填と運用資産の次世代テックシフト（6,000億円）',
        },
        description: {
          en: 'Shields pension payouts (+6 Senior Approval, +2 Youth Hope).',
          ja: '年金給付の持続性を死守し高齢者支持率+6%、若者希望+2。',
        },
        costBillion: 600,
        approvalDelta: 4,
        hopeDelta: 2,
      },
      {
        id: 'c2',
        label: {
          en: 'Trigger Automatic Benefit Adjustment Indexation Immediately',
          ja: 'マクロ経済スライドの特別発動による年金給付額の一律抑制',
        },
        description: {
          en: 'Restores solvency balance (-¥900B budget outlay), but enrages retirees (-18 Approval).',
          ja: '歳出を9,000億円抑制し財政健全化を進めるが、年金受給者の怒りで支持率-18%。',
        },
        costBillion: -900,
        approvalDelta: -18,
        hopeDelta: 3,
      },
    ],
  },
  {
    id: 'ext_tokyo_office_bubble_burst',
    title: {
      en: 'Tokyo Commercial Real Estate Valuation Shock',
      ja: '都心オフィスビル過剰供給・不動産バブル調整',
    },
    headline: {
      en: 'Remote Work and Decentralization Leave 18% of High-Rise Space Vacant',
      ja: 'テレワーク定着と地方分散で都心超高層ビルの空室率が歴史的急上昇',
    },
    description: {
      en: 'Years of ambitious redevelopment have created massive oversupply in central Tokyo. Property funds face valuation write-downs, while young families demand empty buildings be converted to affordable civic housing.',
      ja: '都心再開発ラッシュで供給されたオフィスビルの需要が低迷し、不動産投資信託に下落圧力が波及。一方で子育て世代からは「空きビルを格安ファミリー住宅や保育施設に用途転換せよ」との声が上がっています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Subsidize Fast-Track Office-to-Residential Family Conversions (¥400B)',
          ja: '都心オフィスから子育てレジデンスへの用途転換補助金（4,000億円）',
        },
        description: {
          en: 'Creates 25,000 urban family apartments (+0.04 TFR, +6 Youth Hope).',
          ja: '都心に良質な子育て住宅を大量供給し、TFR+0.04、若者希望指数+6。',
        },
        costBillion: 400,
        tfrDelta: 0.04,
        hopeDelta: 6,
        approvalDelta: 5,
      },
      {
        id: 'c2',
        label: {
          en: 'Leave Sector to Market Rebalancing Without Public Intervention',
          ja: '市場の自己調整に委ね、公的資金の投入を見送る',
        },
        description: {
          en: 'Zero fiscal cost, but regional financial institutions absorb asset write-downs.',
          ja: '税金投入ゼロで財政を守るが、金融機関の貸出余力が縮小し景気が一時停滞。',
        },
        costBillion: 0,
        approvalDelta: -3,
      },
    ],
  },
  {
    id: 'ext_tax_evasion_grey_market',
    title: {
      en: 'Underground Cash & Crypto Tax Evasion Spike',
      ja: '消費税・所得税の地下経済・闇取引拡大アラート',
    },
    headline: {
      en: 'National Tax Agency Audits Expose ¥2 Trillion in Unreported Trade',
      ja: '増税反発から個人間決済や暗号資産を利用した無申告取引が急増',
    },
    description: {
      en: 'Following recent fiscal austerity measures, an increasing share of consumer and freelance trade has moved off-grid into cash-only or decentralized tokens, undermining government revenue projections.',
      ja: '増税後の税負担感から、飲食店やフリーランスを中心に現金決済への回帰や非捕捉ウォレット取引が広がり、計画された税収に約2兆円の未達懸念が生じています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Deploy AI Audit Network & Mandate 100% Interoperable Digital Receipt System',
          ja: '国税庁AI調査システムの全面配備とデジタルインボイス厳罰化（2,500億円）',
        },
        description: {
          en: 'Recovers ¥600B/yr in revenue (+0.02 Productivity) while curbing evasion.',
          ja: '税収捕捉率を劇的に高め実質税収を改善するが、監視社会化への懸念で支持率-3%。',
        },
        costBillion: -350,
        productivityDelta: 0.02,
        approvalDelta: -3,
      },
      {
        id: 'c2',
        label: {
          en: 'Offer Voluntary Disclosure Amnesty with Reduced Penalty Rates',
          ja: '自主申告を促す特例アムネスティ制度（追徴減免）の期間限定導入',
        },
        description: {
          en: 'Low compliance cost, yields modest voluntary repatriations (+2 Approval).',
          ja: '行政コストをかけずに一定の納税を回復。寛容な姿勢が評価され支持率+2%。',
        },
        costBillion: 50,
        approvalDelta: 2,
      },
    ],
  },
  {
    id: 'ext_diet_budget_gridlock',
    title: {
      en: 'Diet Fiscal Impasse & Government Shutdown Threat',
      ja: '国会予算審議の紛糾と行政停止（シャットダウン）の危機',
    },
    headline: {
      en: 'House of Councillors Blocks Annual Budget Over Entitlement Reforms',
      ja: '参議院で野党連合が予算案の採決を拒否、新年度暫定予算編成のタイムリミット',
    },
    description: {
      en: 'Deep political polarization over entitlement cuts and family subsidies has halted legislative progress. Public contractors and municipal services face temporary funding freeze without a compromise.',
      ja: '社会保障改革を巡る与野党の対立が激化し、新年度本予算の年度内成立が絶望的な状況に。妥協なき膠着状態が続けば、公共事業や交付金の執行が停止し国民生活に深刻な打撃を与えます。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Form Grand Cross-Party Coalition Pact with Concessions (¥450B)',
          ja: '野党の少子化要求を一部呑み、大連立合意で本予算をスピード成立（4,500億円）',
        },
        description: {
          en: 'Restores legislative stability (+7 Approval, +4 Youth Hope).',
          ja: '政策の継続性を確保し内閣支持率+7%、若者希望指数+4。修正予算4,500億円。',
        },
        costBillion: 450,
        approvalDelta: 7,
        hopeDelta: 4,
      },
      {
        id: 'c2',
        label: {
          en: 'Dissolve the House of Representatives & Call Snap General Election',
          ja: '衆議院を解散し、財政再建と少子化対策の是非を問う総選挙を断行',
        },
        description: {
          en: 'High political gamble: random approval swing, costs ¥80B in election expenses.',
          ja: '解散総選挙費用800億円。国民の審判を仰ぎ、政局の主導権を取り戻す賭けに出る。',
        },
        costBillion: 80,
        approvalDelta: -4,
        hopeDelta: -2,
      },
    ],
  },

  // --- II. FERTILITY, FAMILY & DEMOGRAPHIC CRISES ---
  {
    id: 'ext_single_society_record_low_marriage',
    title: {
      en: 'The "Single Society" Societal Tipping Point',
      ja: '「超単身社会」の到来：生涯未婚率が過去最高を更新',
    },
    headline: {
      en: 'Over 42% of 30-Year-Olds Report No Intention of Marriage Due to Economic Anxiety',
      ja: '30代の42%が「経済的不安から結婚を諦めた」と回答、非婚化が構造的に加速',
    },
    description: {
      en: 'A landmark white paper confirms that marriage rates have dropped below critical replacement levels. Young adults cite unstable employment, hyper-inflated rents, and crushing educational costs as absolute barriers.',
      ja: '最新の人口白書で、婚姻件数が年間40万件を割り込む見通しが判明。「低賃金と住宅難で家族を持つことが贅沢品になった」という絶望感が20代・30代に蔓延しています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Launch "First Home & Family Formation" State Grant (¥750B)',
          ja: '「初婚・新生活スタート応援」国営住宅引換券の大規模給付（7,500億円）',
        },
        description: {
          en: 'Directly lowers cost of marriage (+0.05 TFR, +9 Youth Hope, +10 Approval).',
          ja: '結婚の経済的ハードルを一掃し、TFR+0.05、若者希望指数+9、支持率+10%。',
        },
        costBillion: 750,
        tfrDelta: 0.05,
        hopeDelta: 9,
        approvalDelta: 10,
      },
      {
        id: 'c2',
        label: {
          en: 'Expand Municipal Dating Seminars & Single-Person Lifestyle Safety Nets',
          ja: '地方自治体の婚活セミナー支援と単身者向け生活保障の拡充',
        },
        description: {
          en: 'Low expenditure (¥80B), but fails to reverse fertility drop (-2 Hope).',
          ja: '予算800億円にとどめるが、構造的解決にならず未婚化トレンドは反転せず。',
        },
        costBillion: 80,
        hopeDelta: -2,
        approvalDelta: -2,
      },
    ],
  },
  {
    id: 'ext_daycare_waitlist_desert',
    title: {
      en: 'Daycare Desert Resurgence: "Taiki Jido" Spike',
      ja: '待機児童問題の再燃：保育士大量離職による「保育砂漠」化',
    },
    headline: {
      en: 'Low Wages Trigger Mass Exodus of Licensed Early Childhood Educators',
      ja: '過酷な処遇に抗議する保育士の離職が相次ぎ、全国で10万人の預け先が消滅',
    },
    description: {
      en: 'Despite high parental demand, licensed daycares across metropolitan centers are shuttering classrooms due to severe staffing shortages. Tens of thousands of working mothers are forced to take indefinite unpaid leave.',
      ja: '待機児童ゼロを掲げた自治体で、保育士の賃金停滞を原因とする退職ラッシュが発生。受け入れ定員が急減し、職場復帰を予定していた母親たちが一斉に休職・離職を余儀なくされています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Legislate 25% National Pay Raise for All Childcare Workers (¥500B)',
          ja: '全保育士の国家公務員待遇化・基本給25%一律引き上げ（5,000億円）',
        },
        description: {
          en: 'Eliminates daycare waitlists completely (+0.04 TFR, +7 Youth Hope, +12 Approval).',
          ja: '保育士の現場復帰を促し保育枠を完全回復。TFR+0.04、希望指数+7、支持率+12%。',
        },
        costBillion: 500,
        tfrDelta: 0.04,
        hopeDelta: 7,
        approvalDelta: 12,
      },
      {
        id: 'c2',
        label: {
          en: 'Relax Caregiver-to-Child Ratios via Sensor & AI Monitoring',
          ja: 'AI・生体センサー監視を導入し、保育士1人あたりの配置基準を緩和',
        },
        description: {
          en: 'Minimal cost (¥90B), but sparks fierce parent safety concerns (-6 Approval).',
          ja: 'コスト900億円で定員枠を維持するが、安全性を不安視する保護者層の反発を招く。',
        },
        costBillion: 90,
        approvalDelta: -6,
        hopeDelta: -1,
      },
    ],
  },
  {
    id: 'ext_maternity_ward_closures',
    title: {
      en: 'Regional Maternity Ward & Obstetrician Collapse',
      ja: '産科・周産期医療機関の閉鎖ドミノ（分べん難民の発生）',
    },
    headline: {
      en: 'Entire Prefectures Reduced to Fewer Than Three Delivery Hospitals',
      ja: '過疎地のみならず地方中核都市でも産婦人科医不足によりお産取扱所が激減',
    },
    description: {
      en: 'Malpractice insurance liability and declining local birth volume have forced private obstetric clinics to stop delivering babies. Expectant mothers must travel over two hours for labor admissions.',
      ja: '少子化による分娩件数減少と激務・訴訟リスクから、地方病院の産婦人科閉鎖が加速。安心してお産ができる病院まで車で2時間以上かかる地域が続出し、地方の子育て意欲を直撃しています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Fully Subsidize Regional Maternity Centers & Obstetrician Salaries (¥350B)',
          ja: '地域中核周産期センターの国営化と産科医への特別危険手当給付（3,500億円）',
        },
        description: {
          en: 'Guarantees safe childbirth nationwide (+0.03 TFR, +6 Youth Hope, +8 Approval).',
          ja: '全国の安全な分娩体制を維持し、地方の不安を解消。TFR+0.03、希望指数+6。',
        },
        costBillion: 350,
        tfrDelta: 0.03,
        hopeDelta: 6,
        approvalDelta: 8,
      },
      {
        id: 'c2',
        label: {
          en: 'Subsidize Long-Distance Maternity Shuttles & Urban Hotel Delivery Packages',
          ja: '遠方出産者向けの交通費・都市部ホテル滞在費バウチャーの支給',
        },
        description: {
          en: 'Cheaper alternative (¥80B), but leaves regional healthcare eroded.',
          ja: '支出800億円で急場をしのぐが、地方医療の空洞化に対する批判が残る。',
        },
        costBillion: 80,
        approvalDelta: -2,
      },
    ],
  },
  {
    id: 'ext_school_closures_1000',
    title: {
      en: '1,000 School Closures: Elementary Consolidation Shock',
      ja: '年間1,000校閉校：公立小中学校の統廃合ショック',
    },
    headline: {
      en: 'Municipalities Struggle with Massive Backlog of Derelict School Buildings',
      ja: '子ども急減により校舎の維持が不能に。地域のコミュニティ機能崩壊が加速',
    },
    description: {
      en: 'Depopulation has led to a historic high of elementary and middle schools shuttering their doors this year. Abandoned campuses create security liabilities, while kids face hour-long daily bus commutes.',
      ja: '少子化の加速により、全国の公立小中学校が年間1,000校のペースで閉校。スクールバス通学による児童の負担増大と、廃校舎の管理コストが基礎自治体の重荷となっています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Transform Empty Campuses into Multi-Generational Community Hubs (¥300B)',
          ja: '廃校舎を幼老複合施設・地域共生ハブへリノベーション（3,000億円）',
        },
        description: {
          en: 'Revitalizes neighborhoods (+4 Senior Approval, +4 Youth Hope).',
          ja: '高齢者デイケアと若者起業拠点を合体させ、地域コミュニティを再生。支持率+5%。',
        },
        costBillion: 300,
        approvalDelta: 5,
        hopeDelta: 4,
      },
      {
        id: 'c2',
        label: {
          en: 'Auction Off Sites to Private Warehouse & Solar Operators',
          ja: '民間メガソーラー・物流倉庫事業者への一括売却による財源化',
        },
        description: {
          en: 'Net revenue generation (-¥200B fiscal gain), but local cultural resentment lingers.',
          ja: '資産売却で2,000億円の特別歳入を得るが、「地域の象徴が失われた」と住民感情は悪化。',
        },
        costBillion: -200,
        approvalDelta: -5,
      },
    ],
  },
  {
    id: 'ext_aging_hikikomori_wave',
    title: {
      en: 'The "90-60" Adult Social Withdrawal Emergency',
      ja: '「90-60問題」の深刻化：高齢ひきこもり支援の限界点',
    },
    headline: {
      en: 'Over 1.5 Million Middle-Aged Dependents Face Isolation as Parents Pass',
      ja: '親の他界に伴い生活保護へ転落する中高年ひきこもりが急増、福祉窓口がパンク',
    },
    description: {
      en: 'The prolonged societal challenge of prolonged social isolation has reached a critical elderly threshold. As 90-year-old parents die, 60-year-old reclusive adults are left without income or living skills, inundating municipal welfare divisions.',
      ja: '80-50問題を超え、90代の親と60代の未就労当事者が孤立する「90-60問題」が表面化。親の年金受給停止とともに餓死や孤立死の危機が多発し、社会的な包括自立支援が急務です。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Fund Comprehensive Adult Autonomy & Remote Re-Skilling Academies (¥420B)',
          ja: '中高年ひきこもり自立支援・在宅就労リスキリング機構の全国展開（4,200億円）',
        },
        description: {
          en: 'Recovers 120,000 into productivity (+0.03 Productivity, +5 Youth Hope).',
          ja: '福祉依存を防ぎ、在宅テレワーク労働力として12万人を再生。生産性+0.03。',
        },
        costBillion: 420,
        productivityDelta: 0.03,
        hopeDelta: 5,
        approvalDelta: 4,
      },
      {
        id: 'c2',
        label: {
          en: 'Absorb Cases Under Standard Means-Tested Public Assistance',
          ja: '既存の生活保護制度の枠組みで順次対応（申請窓口の拡充）',
        },
        description: {
          en: 'Spikes ongoing municipal welfare liabilities (+¥250B recurring).',
          ja: '根本的就労支援を行わず生活保護費が自然増。財政負担が継続的に増加。',
        },
        costBillion: 250,
        approvalDelta: -3,
      },
    ],
  },
  {
    id: 'ext_postpartum_mental_health_crisis',
    title: {
      en: 'Postpartum Burnout & Maternal Mental Health Alarm',
      ja: '産後うつ・孤立育児（ワンオペ）の全国的アラート',
    },
    headline: {
      en: 'Survey Finds 1 in 4 New Mothers Experience Clinical Postpartum Distress',
      ja: '核家族化と地域崩壊で「ワンオペ育児」が限界化、第2子出産の最大の障壁に',
    },
    description: {
      en: 'A medical association study sounds the alarm on extreme maternal isolation. Without accessible community doulas or visiting postpartum care, first-time parents are refusing to consider having a second child.',
      ja: '孤立無援の育児による産後うつ発症率が25%を超え、少子化の最大の心理的要因として浮上。「もう一人産むなんて絶対に無理」という母親たちの悲鳴がSNSを通じて可視化されています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Mandate Free Visiting Doulas & 14-Day Postpartum Hotel Stays (¥280B)',
          ja: '産後ケアホテル14日間無料利用権と訪問助産師制度の全額国費化（2,800億円）',
        },
        description: {
          en: 'Spurs confidence for second births (+0.04 TFR, +8 Youth Hope, +12 Approval).',
          ja: '母親の孤立を解消し、第2子以降の出産意欲を強力に後押し。TFR+0.04、希望指数+8。',
        },
        costBillion: 280,
        tfrDelta: 0.04,
        hopeDelta: 8,
        approvalDelta: 12,
      },
      {
        id: 'c2',
        label: {
          en: 'Launch 24/7 AI Postpartum Support Chatbot & Telephone Hotlines',
          ja: '24時間対応AI育児相談チャットボットと電話相談窓口の開設',
        },
        description: {
          en: 'Low-cost deployment (¥30B), minimal structural relief for physical exhaustion.',
          ja: '予算300億円の低コスト施策だが、実際の育児負担軽減には至らず支持率は横ばい。',
        },
        costBillion: 30,
        approvalDelta: 1,
      },
    ],
  },
  {
    id: 'ext_kodokushi_solitary_death_surge',
    title: {
      en: 'Urban Solitary Death ("Kodokushi") Epidemic',
      ja: '都市部における「孤独死」の年間8万人突破ショック',
    },
    headline: {
      en: 'Unnoticed Passing in Apartment Complexes Sparks International Coverage',
      ja: '公営団地や単身アパートでの孤独死が急増、社会保障のセーフティネットが問われる',
    },
    description: {
      en: 'Annual solitary deaths in single-person households have exceeded 80,000 cases. Landlords increasingly refuse housing to single seniors and middle-aged adults, sparking a nationwide housing discrimination dispute.',
      ja: '単身世帯の激増に伴い、死後長期間発見されない「孤独死」が年間8万人を超過。賃貸住宅オーナーが高齢単身者の入居を拒否する事態が全国で多発し、居住福祉の崩壊が叫ばれています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Legislate National Solitary Renters Insurance & Smart Watch Monitoring (¥220B)',
          ja: '国営孤独死補償保険と見守りスマートメーター配備義務化法（2,200億円）',
        },
        description: {
          en: 'Guarantees senior housing access (+8 Senior Approval, +4 Youth Hope).',
          ja: '高齢者・単身者の賃貸入居拒否を根絶。高齢者支持率+8%、孤独死発生率を激減。',
        },
        costBillion: 220,
        approvalDelta: 6,
        hopeDelta: 4,
      },
      {
        id: 'c2',
        label: {
          en: 'Rely on Neighborhood Volunteer Associations and Postal Worker Patrols',
          ja: '民生委員・郵便局員による巡回パトロールのボランティア依頼',
        },
        description: {
          en: 'Negligible cost (¥20B), but burdens aging volunteer networks.',
          ja: '予算200億円。しかし民生委員自身の高齢化が進んでおり、実効性に限界。',
        },
        costBillion: 20,
        approvalDelta: -2,
      },
    ],
  },
  {
    id: 'ext_child_guidance_center_overload',
    title: {
      en: 'Child Guidance Center National Capacity Overload',
      ja: '児童相談所（児相）の体制崩壊アラート',
    },
    headline: {
      en: 'Caseloads Surpass 250 Cases per Social Worker, Sparking Emergency Reform Demands',
      ja: '児童虐待通告件数が年30万件を超え、担当ケースワーカーの過労死寸前の現場',
    },
    description: {
      en: 'Intense economic and mental pressures on struggling families have driven child abuse reports to all-time highs. Caseworkers are severely overwhelmed, threatening the safety of vulnerable foster children.',
      ja: '孤立育児や困窮世帯の増加により児童相談所への虐待相談が激増。職員1人あたりの担当件数が適正基準の3倍を超え、迅速な一時保護や支援が行き届かない悲劇が懸念されています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Double Child Welfare Staffing & Build High-Standard Foster Villages (¥320B)',
          ja: '児童福祉司の倍増配置と高機能フォスタービレッジ（里親拠点）の建設（3,200億円）',
        },
        description: {
          en: 'Protects children and elevates civic hope (+7 Youth Hope, +6 Approval).',
          ja: '子ども最優先の社会基盤を確立し、若者希望指数+7、内閣支持率+6%。',
        },
        costBillion: 320,
        hopeDelta: 7,
        approvalDelta: 6,
      },
      {
        id: 'c2',
        label: {
          en: 'Deploy AI Case Triaging Algorithms to Prioritize Urgent Physical Harm',
          ja: 'AI危険度判定アルゴリズムを導入し、緊急性の高い事案に資源を集中',
        },
        description: {
          en: 'Low cost (¥40B), but draws ethical criticism regarding machine welfare decisions.',
          ja: '開発費400億円で現場負担を軽減するが、「機械に命の優先順位を委ねるのか」と批判も。',
        },
        costBillion: 40,
        approvalDelta: -2,
        hopeDelta: 1,
      },
    ],
  },

  // --- III. LABOR MARKET & HEALTHCARE STRESS ---
  {
    id: 'ext_caregiver_cliff_shortage',
    title: {
      en: 'The 2030 Caregiver Cliff: 650,000 Staff Deficit',
      ja: '介護崩壊の危機：介護人材65万人不足ショック',
    },
    headline: {
      en: 'Elderly Nursing Homes Freeze Admissions as Certified Caregivers Resign',
      ja: '過酷な賃金格差から介護士の他業種流出が止まらず、特別養護老人ホームで空床が続出',
    },
    description: {
      en: 'The peak of the baby-boomer elderly population has clashed with an unprecedented shortage of caregivers. Facilities are forced to turn away bedridden seniors, triggering a surge in families quitting work to provide care.',
      ja: '要介護認定者が過去最多となる中、低賃金と腰痛負担から介護職の離職が急増。空床があるにもかかわらずスタッフ不足で入所できない「介護難民」があふれ、家族の介護離職が激増しています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Mandate National Caregiver Minimum Base Wage of ¥380,000/mo (¥700B)',
          ja: '介護職員基本給月額38万円の法定制定と国費補填（7,000億円）',
        },
        description: {
          en: 'Stems turnover, prevents 150,000 family career resignations (+0.04 Productivity, +10 Senior Approval).',
          ja: '介護離職を阻止して就業率を維持。生産性+0.04、高齢者支持率+10%。',
        },
        costBillion: 700,
        productivityDelta: 0.04,
        approvalDelta: 8,
      },
      {
        id: 'c2',
        label: {
          en: 'Lower Family Care Leave Restraints & Expand Informal At-Home Subsidies',
          ja: '家族介護手当の新設（月3万円）による在宅介護の家庭内負担推進',
        },
        description: {
          en: 'Saves institutional budget (¥180B), but removes working adults from labor pool (-0.03 Productivity).',
          ja: '歳出1,800億円に抑えるが、現役世代の介護離職が加速し生産性-0.03。',
        },
        costBillion: 180,
        productivityDelta: -0.03,
        approvalDelta: -4,
      },
    ],
  },
  {
    id: 'ext_freight_logistics_freeze_drivers',
    title: {
      en: 'National Logistics Freeze: Commercial Driver Shortfall',
      ja: '物流クライシス：トラック・バス運転手蒸発ショック',
    },
    headline: {
      en: 'Supermarket Shelves in Regional Zones Experience Intermittent Empty Stalls',
      ja: 'ドライバーの平均年齢が58歳を超え、翌日配送の停止と地方幹線輸送の途絶が深刻化',
    },
    description: {
      en: 'Aging logistics crews and strict overtime rules have combined to paralyze highway transport corridors. Fresh produce, medicines, and e-commerce deliveries are delayed across regional prefectures.',
      ja: 'トラック運転手の高齢化と過労死防止規制により、日本の動脈である高速物流が麻痺。地方のスーパーで生鮮食品の欠品が発生し、産業界全体に輸送コスト急騰の波が押し寄せています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Subsidize Level-4 Autonomous Expressway Truck Platooning Corridors (¥550B)',
          ja: '新東名・東北道でのレベル4完全無人トラック隊列走行の実装補助（5,500億円）',
        },
        description: {
          en: 'Solves long-haul freight bottleneck permanently (+0.07 Productivity, +5 Approval).',
          ja: '長距離輸送の自動化を完了し、物流生産性+0.07。産業競争力を劇的に回復。',
        },
        costBillion: 550,
        productivityDelta: 0.07,
        approvalDelta: 5,
      },
      {
        id: 'c2',
        label: {
          en: 'Grant Special Overtime Exemptions & Extend Driver Retirement to 75',
          ja: '物流業界の時間外労働規制を一時緩和し、75歳までの就労延長を特認',
        },
        description: {
          en: 'Zero fiscal cost, but heightens accident risks and union backlash (-8 Approval).',
          ja: '国費支出ゼロで急場をしのぐが、過労死遺族や労組の反発で内閣支持率-8%。',
        },
        costBillion: 0,
        approvalDelta: -8,
        hopeDelta: -3,
      },
    ],
  },
  {
    id: 'ext_physician_overtime_cap_crisis',
    title: {
      en: 'Regional Emergency Medical System Gridlock',
      ja: '地方救急医療体制の崩壊（当直医不足ショック）',
    },
    headline: {
      en: 'Doctors Refuse Unpaid Overtime as Emergency ER Turnaways Rise 40%',
      ja: '医師の働き方改革により当直医が払底、地方病院の夜間・休日救急停止が相次ぐ',
    },
    description: {
      en: 'Enforcement of medical work-hour caps has exposed severe physician misallocation. Regional hospitals can no longer staff emergency trauma or pediatric wards at night, forcing patients to be transported over 80 kilometers.',
      ja: '医師の時間外労働規制適用により、大学医局からの地方派遣が引き揚げられ、地方中核病院でも夜間救急の受け入れ不能が日常化。「たらい回し」が深刻な社会問題化しています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Universal Tele-Emergency Diagnosis Grid & Flying Doctor Air-Ambulance Fleet (¥400B)',
          ja: 'AI遠隔トリアージ網の構築と全国ドクターヘリ・遠隔手術支援隊の配備（4,000億円）',
        },
        description: {
          en: 'Eliminates ER turnaways (+8 Senior Approval, +4 Youth Hope).',
          ja: '都市部専門医による地方救急の遠隔当直を実現。救命率改善で支持率+7%。',
        },
        costBillion: 400,
        approvalDelta: 7,
        hopeDelta: 4,
      },
      {
        id: 'c2',
        label: {
          en: 'Concentrate Hospital Resources & Abolish Weekend Regional ER Centers',
          ja: '地方の救急拠点を県庁所在地へ集約し、夜間外来を統廃合',
        },
        description: {
          en: 'Saves fiscal expenditure (-¥150B), but provokes intense rural voter fury (-14 Approval).',
          ja: '医療財政を1,500億円圧縮するが、地方住民の見捨てられ感から内閣支持率-14%。',
        },
        costBillion: -150,
        approvalDelta: -14,
        hopeDelta: -5,
      },
    ],
  },
  {
    id: 'ext_youth_brain_drain',
    title: {
      en: 'Youth & Tech Brain Drain to Global Hubs',
      ja: '若手高度IT人材・バイリンガルの海外流出ラッシュ',
    },
    headline: {
      en: 'Top Engineering Graduates Choose Singapore, US, and EU Over Tokyo Salaries',
      ja: '年功序列と円安賃金に絶望した東大・京大IT系新卒の28%が海外企業へ直接就職',
    },
    description: {
      en: 'Depressed domestic starting salaries and rigid seniority ladders have triggered an exodus of Japan’s brightest young computer scientists, data engineers, and researchers seeking triple their compensation overseas.',
      ja: '日本の硬直的な賃金体系と円安により、若手トップ層がシリコンバレーやシンガポールへ流出。「優秀な若者ほど日本を見限る」構造的頭脳流出が日本の先端産業の土台を揺るがしています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Zero Income Tax for Tech Specialists Under 35 & Innovation Seed Grants (¥300B)',
          ja: '35歳以下の先端IT・バイオ研究者に対する所得税完全免除と研究創業助成（3,000億円）',
        },
        description: {
          en: 'Halts brain drain, boosts innovation (+0.08 Productivity, +8 Youth Hope).',
          ja: '若手イノベーターを引き留め、生産性+0.08、若者希望指数+8。',
        },
        costBillion: 300,
        productivityDelta: 0.08,
        hopeDelta: 8,
        approvalDelta: 4,
      },
      {
        id: 'c2',
        label: {
          en: 'Appeal to Corporate Social Responsibility & Traditional Loyalty',
          ja: '経済団体に若手給与の自主的引き上げと愛国心を要請する声明発表',
        },
        description: {
          en: 'Zero government spending, but fails to stop international poaching (-4 Hope).',
          ja: '国費投入ゼロ。しかし口頭要請にとどまり、実利を求める若者の流出は継続。',
        },
        costBillion: 0,
        hopeDelta: -4,
        approvalDelta: -3,
      },
    ],
  },
  {
    id: 'ext_senior_industrial_accident_spike',
    title: {
      en: 'Senior Workplace Accident Epidemic',
      ja: '高齢労働者の労災急増ショック（70代就労の壁）',
    },
    headline: {
      en: 'Fatal Construction and Logistics Accidents Involving Over-70s Surge 65%',
      ja: '人手不足で高齢者を現場従事させた結果、転落・重機巻き込み労災が激増',
    },
    description: {
      en: 'Pensions reforms have kept millions of septuagenarians on dangerous job sites. Diminished reflexes and bone density have led to a sharp rise in serious occupational injuries and worker compensation claims.',
      ja: '年金受給開始年齢の引き上げや人手不足により、警備・建設・清掃などの肉体労働に従事する70代が急増。身体機能低下による重大労災が相次ぎ、労災保険財政を圧迫しています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Subsidize Wearable Exoskeleton Powered Suits & Safe-Duty Mandates (¥260B)',
          ja: '高齢者向けアシストパワースーツ導入補助と軽作業シフト義務化（2,600億円）',
        },
        description: {
          en: 'Reduces injuries 75% while keeping seniors working safely (+0.02 Productivity, +6 Senior Approval).',
          ja: 'ロボティクスで身体負担を軽減し労災を半減。シニア就労を安全に継続可能に。',
        },
        costBillion: 260,
        productivityDelta: 0.02,
        approvalDelta: 5,
      },
      {
        id: 'c2',
        label: {
          en: 'Shift Workplace Accident Liability Solely to Employing Enterprises',
          ja: '労災発生企業へのペナルティ課徴金引き上げと自己責任の徹底',
        },
        description: {
          en: 'Zero central cost, but firms suddenly lay off vulnerable elderly staff (-10 Approval).',
          ja: '企業が高齢者の雇用を一斉に手控え始め、シニア層の生活不安が急増。支持率-10%。',
        },
        costBillion: 0,
        approvalDelta: -10,
      },
    ],
  },
  {
    id: 'ext_titp_foreign_intern_scrutiny',
    title: {
      en: 'Global Human Rights Sanction Warning on Foreign Labor',
      ja: '外国人労働者の人権是正勧告とサプライチェーン制裁警告',
    },
    headline: {
      en: 'UN and Western Trade Blocs Threaten Export Tariffs Over Trainee Abuses',
      ja: '技能実習・特定技能の転籍制限や低賃金を巡り、欧米諸国が日本製品の輸入規制を警告',
    },
    description: {
      en: 'An investigative international consortium report details coercive debt-traps and employer abuses in Japan’s agricultural and textile sectors. Major Japanese manufacturing exports face immediate ethical exclusion unless systemic protections are passed.',
      ja: '国際人権機関が日本の外国人労働制度を「現代の強制労働」と批判し、是正されない場合は日本企業のサプライチェーン製品に特別関税を課すと警告。経済と外交の重大危機となっています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Full Freedom of Job Transition & Equal Legal Workplace Protections (¥180B)',
          ja: '完全な転籍自由化と国営外国人労働者支援・相談オフィスの新設（1,800億円）',
        },
        description: {
          en: 'Defuses trade sanctions, attracts higher-caliber foreign talent (+0.04 Productivity, +5 Approval).',
          ja: '国際的信用を回復し経済制裁を回避。優良な外国人材が集まり生産性+0.04。',
        },
        costBillion: 180,
        productivityDelta: 0.04,
        approvalDelta: 5,
        hopeDelta: 3,
      },
      {
        id: 'c2',
        label: {
          en: 'Deny Systemic Violations & Offer Minimal Superficial Workplace Audits',
          ja: '「制度の適正運用中」と反論し、形式的な抜き打ち査察でお茶を濁す',
        },
        description: {
          en: 'Zero fiscal outlay, but risks export embargoes and foreign worker avoidance.',
          ja: '財政負担を避けるが、外国人労働者の敬遠が進み製造・農業現場の人手不足が致命化。',
        },
        costBillion: 20,
        approvalDelta: -8,
        productivityDelta: -0.03,
      },
    ],
  },
  {
    id: 'ext_universal_health_deficit_surcharge',
    title: {
      en: 'National Health Insurance Multi-Trillion Deficit Emergency',
      ja: '国民健康保険・後期高齢者医療制度の巨額赤字ショック',
    },
    headline: {
      en: 'Breakthrough Regenerative Therapies and Longevity Treatments Outstrip Reserves',
      ja: 'がん高額新薬と超長寿化により医療費が過去最大の年間52兆円へ急伸',
    },
    description: {
      en: 'Exponential adoption of high-cost personalized gene therapies and an aging citizenry have driven national healthcare outlays ¥4 Trillion beyond actuarial models. The Treasury faces a massive unplanned shortfall.',
      ja: '画期的な遺伝子治療薬や高額抗がん剤の保険適用が進んだ結果、年間の国民医療費が予測を4兆円突破。このままでは現役世代の健康保険料率が手取りの20%を超えかねない事態です。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Cap High-Cost Drug Reimbursement Prices & Mandate Cost-Effectiveness Criteria',
          ja: '高額新薬の薬価上限設定と費用対効果評価（HTA）の義務化による抑制',
        },
        description: {
          en: 'Saves ¥1.5T in recurring annual medical expenditures (+5 Youth Hope).',
          ja: '医療費の急膨張に歯止めをかけ、将来不安を緩和。歳出-1.5兆円、若者希望+5。',
        },
        costBillion: -1500,
        hopeDelta: 5,
        approvalDelta: 2,
      },
      {
        id: 'c2',
        label: {
          en: 'Increase Working-Class Monthly Health Premiums by 1.8%',
          ja: '現役世代の社会保険料率（健康保険料）を一律1.8%引き上げ',
        },
        description: {
          en: 'Covers the shortfall completely, but crunches working household disposable income (-12 Approval, -0.04 TFR).',
          ja: '赤字を穴埋めするが、若年・子育て層の手取りが減少しTFR-0.04、内閣支持率-12%。',
        },
        costBillion: -2500,
        tfrDelta: -0.04,
        hopeDelta: -8,
        approvalDelta: -12,
      },
    ],
  },
  {
    id: 'ext_dementia_frozen_assets_peak',
    title: {
      en: 'Dementia Banking Crisis: ¥250 Trillion in Frozen Assets',
      ja: '認知症資産凍結ショック：250兆円の預金睡眠危機',
    },
    headline: {
      en: 'Over 8 Million Elderly Lack Legal Capacity to Manage Personal Savings',
      ja: '認知症患者の急増で国内金融資産の1割が凍結、消費・投資が目詰まりを起こす',
    },
    description: {
      en: 'With dementia diagnosis rates peaking, hundreds of thousands of senior bank accounts are locked by strict anti-fraud banking rules. Families cannot access their parents’ money to pay for nursing homes, while capital is withdrawn from the real economy.',
      ja: '高齢者の認知症進行に伴い、預金の引き出しや不動産の売却が法的にできなくなる「資産凍結」が激増。親の介護費用が払えない世帯が続出し、莫大な資本が市場で動かなくなっています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Establish Universal Digital Adult Guardianship & Fast-Track Family Proxy Law (¥200B)',
          ja: '公的デジタル成年後見制度の簡素化と家族代理権特例法のスピード施行（2,000億円）',
        },
        description: {
          en: 'Unlocks frozen capital back into health and care economy (+0.03 Productivity, +8 Senior Approval).',
          ja: '凍結資産の介護利用を円滑化し、医療・介護市場の資金循環を回復。生産性+0.03。',
        },
        costBillion: 200,
        productivityDelta: 0.03,
        approvalDelta: 6,
        hopeDelta: 3,
      },
      {
        id: 'c2',
        label: {
          en: 'Rely on Existing Court-Appointed Professional Guardians',
          ja: '現行の弁護士・司法書士による法定後見制度を維持',
        },
        description: {
          en: 'Zero fiscal cost, but court backlog leaves families stranded for months (-6 Approval).',
          ja: '法改正を見送るが、家庭裁判所の処理が年単位で停滞し、家族の介護困窮が深刻化。',
        },
        costBillion: 0,
        approvalDelta: -6,
      },
    ],
  },

  // --- IV. DISASTERS, INFRASTRUCTURE & REGIONAL DECAY ---
  {
    id: 'ext_tokyo_bay_mega_typhoon_inundation',
    title: {
      en: 'Tokyo Bay Mega-Typhoon & Storm Surge Catastrophe',
      ja: '東京湾超大型台風・高潮浸水災害',
    },
    headline: {
      en: 'Record Storm Surge Floods Underground Subways and Koto Lowlands',
      ja: '最大級台風が東京湾を直撃。地下鉄路線が水没し、江東5区で大規模浸水被害',
    },
    description: {
      en: 'An unprecedented Category 5 typhoon combined with astronomical high tide has breached seawalls along Tokyo Bay. Subway networks are submerged, data centers lose cooling, and 800,000 residents require emergency shelter.',
      ja: '地球温暖化による巨大台風と満潮が重なり、東京湾岸の水門が決壊。地下鉄駅構内への浸水と停電により首都中枢機能が一時麻痺し、数百万人規模の避難活動が展開されています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Deploy Immediate Emergency Relief Fund & Super-Levee Mega-Engineering (¥1.8T)',
          ja: '被災者緊急救援金給付と東京湾高規格堤防・自動排水ゲートの緊急整備（1.8兆円）',
        },
        description: {
          en: 'Restores metropolitan commerce swiftly (+12 Approval, saves capital grid).',
          ja: '首都機能を最短で復旧させ内閣支持率+12%。巨額歳出を要するが将来リスクを遮断。',
        },
        costBillion: 1800,
        approvalDelta: 12,
        hopeDelta: 5,
      },
      {
        id: 'c2',
        label: {
          en: 'Limit Central Outlays to Standard Disaster Recovery Framework (¥600B)',
          ja: '既存の激甚災害指定基準に基づく限定的復旧に留める（6,000億円）',
        },
        description: {
          en: 'Controls debt issuance, but business recovery drags on for over a year (-0.05 Productivity).',
          ja: '国債増発を抑えるが、首都圏インフラの復旧遅れで生産性-0.05、若者希望指数-8。',
        },
        costBillion: 600,
        productivityDelta: -0.05,
        hopeDelta: -8,
        approvalDelta: -10,
      },
    ],
  },
  {
    id: 'ext_aging_expressway_bridge_collapse',
    title: {
      en: 'Expressway Overpass Collapse: Aging Infrastructure Emergency',
      ja: '高速道路高架橋崩落：高度経済成長期インフラの寿命限界',
    },
    headline: {
      en: 'Critical Transport Artery Cut Off Following Structural Fatigue Failure',
      ja: '建設後60年を経過した大動脈の橋桁が崩落、全国12,000橋の緊急点検が開始',
    },
    description: {
      en: 'A 65-year-old expressway bridge on the Tomei Corridor has suffered sudden structural failure. With over 60% of Japan’s bridges exceeding their intended 50-year engineering lifespan, national logistics routes face emergency weight restrictions.',
      ja: '1960年代の高度成長期に突貫工事で作られた道路・橋梁が一斉に寿命を迎えています。東名高速での崩落事故を契機に、全国の老朽橋で通行規制が敷かれ、幹線物流に大渋滞が発生しています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Launch National AI Sensor Infrastructure Renewal Program (¥1.1T)',
          ja: 'AIインフラ診断ロボットと次世代超軽量コンクリート更新プログラム（1.1兆円）',
        },
        description: {
          en: 'Renews transport backbone permanently (+0.05 Productivity, +8 Approval).',
          ja: '老朽インフラを一新し安全を確保。建設DX推進で生産性+0.05、支持率+8%。',
        },
        costBillion: 1100,
        productivityDelta: 0.05,
        approvalDelta: 8,
      },
      {
        id: 'c2',
        label: {
          en: 'Decommission Non-Essential Bridges & Narrow Rural Arterial Lanes',
          ja: '利用頻度の低い地方橋梁の廃止・撤去と地方道の車線削減（スマート縮小）',
        },
        description: {
          en: 'Low expenditure (¥250B), but cuts off remote villages from medical hubs (-8 Approval).',
          ja: '撤去費用2,500億円。しかし過疎地住民の孤立を招き、地方での批判が激化。',
        },
        costBillion: 250,
        approvalDelta: -8,
        hopeDelta: -4,
      },
    ],
  },
  {
    id: 'ext_akiya_fire_hazard_squatters',
    title: {
      en: 'Vacant Home ("Akiya") Urban Fire & Blight Crisis',
      ja: '放置空き家（アキヤ）1,200万戸突破と火災・治安崩壊の危機',
    },
    headline: {
      en: 'Derelict Wooden Homes Form Unmanageable Hazards in Dense Neighborhoods',
      ja: '相続放棄された空き家の倒壊・放火が多発し、住宅街の資産価値が暴落',
    },
    description: {
      en: 'Vacant homes have surpassed 12 million units nationwide. Heirs refuse inheritance due to demolition costs, leaving decaying structures that attract vermin, arson, and collapse hazards adjacent to young families’ homes.',
      ja: '解体費用の高さを理由に相続登記されない放置空き家が住宅街を侵食。倒壊の危険や放火被害が続出し、近隣住民の安全と街の景観を脅かす全国的な行政課題となっています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Authorize State Eminent Domain Demolition & Green Parks Conversion (¥450B)',
          ja: '略式代執行による行政強制解体と防災ポケットパーク・緑地化推進（4,500億円）',
        },
        description: {
          en: 'Eliminates urban fire hazards, boosts neighborhood quality (+0.02 TFR, +6 Approval).',
          ja: '危険空き家を一掃して街の安全を回復。子育て環境が向上しTFR+0.02、支持率+6%。',
        },
        costBillion: 450,
        tfrDelta: 0.02,
        approvalDelta: 6,
        hopeDelta: 3,
      },
      {
        id: 'c2',
        label: {
          en: 'Triple Municipal Property Taxes on All Neglected Vacant Structures',
          ja: '特定空家への固定資産税特例解除と滞納財産の即時差し押さえ断行',
        },
        description: {
          en: 'Zero government subsidy; forces owners to demolish privately but stirs legal disputes.',
          ja: '税負担を重くして自主解体を迫る。財政支出は不要だが、権利者との法廷闘争が多発。',
        },
        costBillion: -100,
        approvalDelta: -3,
      },
    ],
  },
  {
    id: 'ext_jr_rural_rail_abandonment',
    title: {
      en: 'JR Rural Line Mass-Termination Crisis',
      ja: 'JRローカル線大量廃止ショック（地方鉄道網の最終選択）',
    },
    headline: {
      en: 'Rail Operators Petition to Discontinue 45 Unprofitable Chiho Routes',
      ja: '沿線人口減少で採算不能に。通学高校生や運転免許返納シニアの足が消滅の危機',
    },
    description: {
      en: 'Citing passenger decline of over 85%, rail operators formally notify the Ministry of Transport of their intent to abandon 45 regional rail lines. Rural elderly and high schoolers face complete isolation.',
      ja: '乗客減少と車両老朽化により、全国のローカル鉄道45路線の廃止が提案されました。車の運転ができない高齢者や高校生の日常の移動手段が奪われ、地方自治体が猛抗議を行っています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Nationalize Critical Tracks as Public-Private BRT & Light Rail Corridors (¥380B)',
          ja: '上下分離方式での軌道公有化と次世代LRT・自動運転BRT専用道への転換（3,800億円）',
        },
        description: {
          en: 'Guarantees rural mobility permanently (+8 Senior Approval, +4 Youth Hope).',
          ja: '最新の自動運転バス高速輸送網へ生まれ変わらせ、地方の足を確保。支持率+7%。',
        },
        costBillion: 380,
        approvalDelta: 7,
        hopeDelta: 4,
      },
      {
        id: 'c2',
        label: {
          en: 'Permit Line Closures with One-Time Autonomous On-Demand Ride Subsidies',
          ja: '鉄道廃止を承認し、民間オンデマンド配車バウチャーを時限支給',
        },
        description: {
          en: 'Low fiscal commitment (¥120B), but accelerates rural population exodus (-5 Hope).',
          ja: '支出1,200億円。しかし「鉄道が消えた街」からの若者流出が一段と加速。',
        },
        costBillion: 120,
        hopeDelta: -5,
        approvalDelta: -9,
      },
    ],
  },
  {
    id: 'ext_food_security_farmer_retirement',
    title: {
      en: 'Agricultural Collapse: Rice Farmers Pass Average Age 74',
      ja: '食料安全保障危機：農家の平均年齢74歳突破と耕作放棄地爆発',
    },
    headline: {
      en: 'National Caloric Food Self-Sufficiency Drops to an All-Time Low of 31%',
      ja: '後継者不在による離農が激増。米・大豆の国内供給基盤が急減退',
    },
    description: {
      en: 'A mass retirement of elderly farmers without successors has left hundreds of thousands of paddies fallow. Japan’s reliance on foreign grain imports leaves the nation acutely vulnerable to global climate supply shocks.',
      ja: '日本の食を支えてきた高齢農業者が一斉に引退し、農地の耕作放棄が全国で拡大。カロリーベース食料自給率が30%台前半に落ち込み、国際的な穀物争奪戦の中で食料安全保障が危機的状況にあります。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Establish State-Backed Mega-Agri Tech Corporations & Smart Lease Land Banks (¥500B)',
          ja: '国営スマート農業法人の設立と若手就農者への農地集積・月30万円所得補償（5,000億円）',
        },
        description: {
          en: 'Restores food security baseline (+0.04 Productivity, +0.02 TFR, +7 Approval).',
          ja: '農業の大規模ハイテク産業化を推進。食料自給率を押し上げ、若手就農を促進。',
        },
        costBillion: 500,
        productivityDelta: 0.04,
        tfrDelta: 0.02,
        approvalDelta: 7,
      },
      {
        id: 'c2',
        label: {
          en: 'Deregulate Rice Import Tariffs & Rely on International Food Contracts',
          ja: '主要農産物の輸入関税撤廃と海外穀物メジャーとの長期供給契約',
        },
        description: {
          en: 'Keeps consumer food prices low in the short term, but rural farming unions revolt (-16 Approval).',
          ja: '輸入自由化で食料価格を抑えるが、国内農業が壊滅し農民連盟が政権退陣要求。',
        },
        costBillion: 50,
        approvalDelta: -16,
        hopeDelta: -4,
      },
    ],
  },
  {
    id: 'ext_water_sewage_grid_collapse',
    title: {
      en: 'Municipal Water & Sewage Infrastructure Failure',
      ja: '老朽水道・下水道インフラ崩壊（断水危機の頻発）',
    },
    headline: {
      en: 'Cast-Iron Water Mains Break Across 14 Prefectures; Replacement Bill Hits ¥6 Trillion',
      ja: '昭和に敷設された水道管の破裂が多発。水道料金を3倍に値上げしても更新不能な小自治体',
    },
    description: {
      en: 'Small towns facing depopulation cannot afford the billions needed to replace corroding underground water networks. Frequent boil-water orders and main breaks disrupt daily life and deter young families.',
      ja: '人口減少に伴う水道事業会計の悪化で、法定耐用年数を超えた水道管が交換できず放置されています。各地で大規模な断水や道路陥没が多発し、基礎的インフラの維持が限界を迎えています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Enact National Water Grid Unification & Prefectural Mega-Filtration (¥650B)',
          ja: '水道事業の広域一元管理と最新IoT漏水検知・耐震管更新国費ファンド（6,500億円）',
        },
        description: {
          en: 'Guarantees clean water access nationwide (+6 Senior Approval, +4 Youth Hope).',
          ja: '水道インフラの寿命を半世紀延伸し、住民の生活安全を死守。支持率+6%。',
        },
        costBillion: 650,
        approvalDelta: 6,
        hopeDelta: 4,
      },
      {
        id: 'c2',
        label: {
          en: 'Permit Full Privatization of Municipal Water Concessions',
          ja: '外資・民間コンセッション方式の全面解禁と水道料金の市場化',
        },
        description: {
          en: 'Shifts maintenance to private capital, but public rates skyrocket in rural towns (-12 Approval).',
          ja: '民間資金を活用し政府支出を抑えるが、過疎地で水道代が数倍に跳ね上がり大炎上。',
        },
        costBillion: -100,
        approvalDelta: -12,
      },
    ],
  },
  {
    id: 'ext_wild_animal_satoyama_encroachment',
    title: {
      en: 'Wildlife Satoyama Encroachment Crisis',
      ja: '獣害・里山崩壊クライシス（野生動物の市街地侵入）',
    },
    headline: {
      en: 'Bears and Wild Boars Enter Suburban Train Stations as Forest Buffer Zones Recede',
      ja: '過疎化で里山の緩衝地帯が消滅。クマやシカが住宅街に出没し人的被害が過去最多に',
    },
    description: {
      en: 'Depopulation has eliminated the traditional human-wildlife barrier (*satoyama*). Bears, wild boars, and deer now venture deep into suburban schools and shopping plazas, terrorizing young families.',
      ja: '農山村の無人化により山林と住宅地の境目が消滅。秋田や長野にとどまらず、関東・関西のニュータウンにまでヒグマやツキノワグマが出没し、通学路の安全が保てない事態となっています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Deploy Autonomous Thermal Drones & Professional Wildlife Ranger Units (¥160B)',
          ja: '自律追尾サーマルドローン網と国営プロ鳥獣対策レンジャー隊の常設配備（1,600億円）',
        },
        description: {
          en: 'Restores suburban safety completely (+6 Senior Approval, +4 Youth Hope).',
          ja: '最新テクノロジーで人的被害をゼロ化し、住宅街の平穏を回復。支持率+5%。',
        },
        costBillion: 160,
        approvalDelta: 5,
        hopeDelta: 4,
      },
      {
        id: 'c2',
        label: {
          en: 'Offer Citizen Bounty Incentives to Local Hunting Associations',
          ja: '猟友会への報奨金倍増と住民への防護ベル・催涙スプレー自己防衛支援',
        },
        description: {
          en: 'Inexpensive measure (¥40B), but hunters are elderly and numbers are dwindling.',
          ja: '予算400億円。しかしハンター自身の平均年齢が70代に達しており、根本解決に至らず。',
        },
        costBillion: 40,
        approvalDelta: 1,
      },
    ],
  },
  {
    id: 'ext_mt_fuji_tephra_alert',
    title: {
      en: 'Mount Fuji Volcanic Tephra Ash Emergency',
      ja: '富士山火山活動活発化・首都圏降灰ハザード',
    },
    headline: {
      en: 'Seismologists Detect Magma Chamber Activity; 10cm Ashfall Scenario Projected',
      ja: '気象庁が警戒レベルを引き上げ。東京・神奈川で数千万トンの火山灰降下を想定',
    },
    description: {
      en: 'Elevated low-frequency earthquake swarms beneath Mount Fuji indicate magma movement. A major explosive eruption could paralyze Kanto’s power transformers, ground Tokyo airports, and halt water treatment within two hours.',
      ja: '富士山直下でマグマの上昇を示す低周波地震が観測され、警戒レベルが引き上げられました。偏西風に乗って首都圏に火山灰が降り注げば、送電網ショート、浄水場機能停止、首都全域の停電が懸念されます。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Preemptively Enact Metropolitan Ash-Shielding & Grid Hardening (¥850B)',
          ja: '首都圏変電所・浄水場の防灰密閉シールド化と緊急資機材の事前配備（8,500億円）',
        },
        description: {
          en: 'Shields capital from systemic paralysis (+10 Approval, protects GDP productivity).',
          ja: '最悪のインフラ破滅シナリオを完全予防。首都の強靭化が国内外で絶賛され支持率+10%。',
        },
        costBillion: 850,
        approvalDelta: 10,
        hopeDelta: 5,
      },
      {
        id: 'c2',
        label: {
          en: 'Distribute Goggles and Dust Masks to Citizens & Monitor Readings',
          ja: '全世帯向け防塵ゴーグル・N95マスクの配布と観測体制の強化にとどめる',
        },
        description: {
          en: 'Low expenditure (¥90B), but panic buying and transport disruptions ripple.',
          ja: '支出900億円。しかしインフラ防御が不十分なため、買い占めやパニックが発生。',
        },
        costBillion: 90,
        approvalDelta: -4,
        hopeDelta: -3,
      },
    ],
  },

  // --- V. TECHNOLOGICAL SHOCKS & GLOBAL EXTERNALITIES ---
  {
    id: 'ext_pension_cyberattack_blackout',
    title: {
      en: 'Major Cyberattack on National Social Security Grid',
      ja: '日本年金機構・社会保障クラウドへの大規模ランサムウェア攻撃',
    },
    headline: {
      en: 'State-Sponsored Hackers Freeze Monthly Pension Payments for 40 Million Citizens',
      ja: 'マイナンバー連携データベースが暗号化され、年金給付と児童手当の振込が一時停止',
    },
    description: {
      en: 'A sophisticated cyberattack has encrypted the central social welfare database. Millions of seniors and single mothers arrive at ATMs to find zero benefit disbursements, sparking panic and anger outside city halls.',
      ja: '年金・児童手当・生活保護の支給日直前に、国家支援型ハッカー集団によるランサムウェア攻撃が発生。即日給付がストップし、生活資金を断たれた高齢者や困窮世帯が市区町村窓口に殺到しています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Deploy Cyber Defense Force & Direct Hand-Cash Emergency Relief Outlays (¥500B)',
          ja: '自衛隊サイバー防衛隊による復旧と、全自治体での緊急手渡し給付拠出（5,000億円）',
        },
        description: {
          en: 'Restores public confidence swiftly (+6 Senior Approval, +4 Youth Hope).',
          ja: '迅速な現場対応で生活破綻を防止し、サイバー耐性を強化。支持率+7%。',
        },
        costBillion: 500,
        approvalDelta: 7,
        hopeDelta: 4,
      },
      {
        id: 'c2',
        label: {
          en: 'Wait for Decryption Negotiation and Postpone Payments by Two Weeks',
          ja: '暗号解除プログラムの解析を待ち、支給日を一律2週間延期',
        },
        description: {
          en: 'Zero fiscal outlay, but voter trust collapses under sheer incompetence (-18 Approval).',
          ja: '政府支出ゼロだが、「国のシステム崩壊」と批判され支持率-18%、若者希望-6。',
        },
        costBillion: 0,
        approvalDelta: -18,
        hopeDelta: -6,
      },
    ],
  },
  {
    id: 'ext_humanoid_battery_fire_recall',
    title: {
      en: 'Domestic Eldercare Humanoid Battery Recall Crisis',
      ja: '国産介護ロボット・ヒューマノイドの大規模火災リコール',
    },
    headline: {
      en: 'Thermal Runaways in Lithium Solid-State Packs Force Fleet Grounding',
      ja: '介護現場に普及した人型ロボットで発火事故が多発、10万台の即時運用停止令',
    },
    description: {
      en: 'A defective battery chemistry in leading Japanese robotic care assistants has caused dangerous thermal runaways in nursing facilities. The government is forced to issue an immediate stop-work order, leaving elderly wards severely understaffed.',
      ja: '人手不足の切り札として普及していた介護ヒューマノイドに重大な発火欠陥が発覚。全国の特養・老健で稼働が全面ストップし、現場は再び過酷な肉体労働と人手不足に突き落とされています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Underwrite Emergency Battery Pack Retrofitting & Temporary Care Staff (¥320B)',
          ja: '国産新型不燃バッテリー換装費用の一部公費負担と代替介護士派遣（3,200億円）',
        },
        description: {
          en: 'Rehabilitates domestic robotics industry (+0.04 Productivity, +5 Approval).',
          ja: 'ロボット産業の信頼を救い、介護現場の安全を早期回復。生産性+0.04。',
        },
        costBillion: 320,
        productivityDelta: 0.04,
        approvalDelta: 5,
      },
      {
        id: 'c2',
        label: {
          en: 'Force Complete Manufacturer Self-Liability with Strict Criminal Penalties',
          ja: '製造メーカーに全額自己負担でのリコールと厳格な罰則を命令',
        },
        description: {
          en: 'Zero government expense, but robot makers face insolvency, chilling AI automation (-0.05 Productivity).',
          ja: '税金投入を避けるが、国内ロボット企業が倒産危機に陥り自動化投資が数年後退。',
        },
        costBillion: 0,
        productivityDelta: -0.05,
        approvalDelta: -4,
      },
    ],
  },
  {
    id: 'ext_genetic_longevity_therapy_breakthrough',
    title: {
      en: 'Breakthrough in Cellular Rejuvenation Therapy',
      ja: '抗老化・細胞若返り医療のブレイクスルー',
    },
    headline: {
      en: 'Japanese Biotech Unveils Safe Epigenetic Treatment Extending Active Life by 15 Years',
      ja: '健康寿命を15年延伸する国産エピジェネティック治療が臨床試験で大成功',
    },
    description: {
      en: 'A breakthrough therapy reverses biological aging in cellular tissue, dramatically reducing cancer and cardiovascular incidence. While miraculous for health, it threatens to collapse existing pension solvency unless retirement age models are modernized.',
      ja: '日本人ノーベル賞研究者のベンチャーが、筋肉と内臓組織を若返らせる画期的治療薬を開発。70代が50代の肉体を取り戻す奇跡が現実味を帯びる一方、現行の年金財政モデルは完全に破綻の危機に瀕します。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'License as National Health Breakthrough & Incentivize Ageless Work (¥500B)',
          ja: '国民皆保険への段階的適用と「エイジレス就労・生涯現役社会」への制度大改革（5,000億円）',
        },
        description: {
          en: 'Massive economic productivity leap (+0.12 Productivity, +10 Youth Hope, +8 Approval).',
          ja: '健康寿命の爆発的延伸で労働力が劇的復活。生産性+0.12、若者希望指数+10。',
        },
        costBillion: 500,
        productivityDelta: 0.12,
        hopeDelta: 10,
        approvalDelta: 8,
      },
      {
        id: 'c2',
        label: {
          en: 'Restrict to Ultra-Wealthy Private Self-Pay Medical Clinics',
          ja: '保険適用外の自由診療に留め、公的医療保険財政への波及を阻止',
        },
        description: {
          en: 'Zero fiscal threat, but sparks deep societal anger over biological inequality (-12 Approval).',
          ja: '年金財政を守るが、「富裕層だけが若返る」という命の格差に国民の怒りが爆発。',
        },
        costBillion: 0,
        approvalDelta: -12,
        hopeDelta: -5,
      },
    ],
  },
  {
    id: 'ext_white_collar_ai_redundancy',
    title: {
      en: 'White-Collar AI Dislocation Wave',
      ja: '事務職・ホワイトカラーのAI大量代替ショック',
    },
    headline: {
      en: 'Autonomous Corporate Agents Make 400,000 Clerical Positions Redundant',
      ja: 'メガバンク・大手保険会社が業務の8割を自律型AIに移行、一般職採用を90%削減',
    },
    description: {
      en: 'Major banks, insurance conglomerates, and administrative corporations have deployed autonomous agent workflows, cutting hundreds of thousands of traditional back-office jobs. Middle-aged workers and humanities graduates face rapid unemployment.',
      ja: '事務処理・データ入力・書類審査のAI完全自動化により、伝統的大企業が大規模な希望退職と新卒採用抑制を発表。文系学生の就職難と中高年事務職の行き場が失われています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Launch National AI Transition Stipend & High-Tech Re-Skilling Guarantee (¥480B)',
          ja: '国家リスキリング保障手当の給付と最先端産業へのキャリア転換助成（4,800億円）',
        },
        description: {
          en: 'Channels displaced talent into green & advanced manufacturing (+0.05 Productivity, +6 Hope).',
          ja: '失業不安を抑え、成長産業へ人材を円滑シフト。生産性+0.05、若者希望指数+6。',
        },
        costBillion: 480,
        productivityDelta: 0.05,
        hopeDelta: 6,
        approvalDelta: 6,
      },
      {
        id: 'c2',
        label: {
          en: 'Tax Corporate AI Displacements to Prop Up Obsolete Employment Structures',
          ja: 'AI解雇企業への特別課徴金導入による雇用維持の義務化',
        },
        description: {
          en: 'Shields existing jobs temporarily, but hobbles technological competitiveness (-0.04 Productivity).',
          ja: '雇用を守るが、日本企業のイノベーション速度を低下させ国際競争力-0.04。',
        },
        costBillion: -150,
        productivityDelta: -0.04,
        approvalDelta: -4,
      },
    ],
  },
  {
    id: 'ext_commercial_fusion_grid_breakthrough',
    title: {
      en: 'Commercial Fusion Reactor Operational Milestone',
      ja: '核融合発電の商用実証炉稼働：無尽蔵クリーンエネルギーの夜明け',
    },
    headline: {
      en: 'National High-Temperature Superconducting Tokamak Delivers Continuous Net Power',
      ja: 'エネルギー自給率100%への道が開かれ、国内産業電力コストの半減が見通される',
    },
    description: {
      en: 'Japan’s premier energy research consortium has achieved sustained energy break-even in its commercial demonstration reactor. The prospect of limitless, carbon-free energy promises to revolutionize domestic advanced manufacturing.',
      ja: '量子科学技術研究開発機構が主導する商用核融合炉が、世界に先駆けて連続正味出力の抽出に成功。資源小国日本がエネルギー輸出国へと転換する歴史的転換点となり、海外からの投資が殺到しています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Build 10 National Fusion Industrial Parks & Export Intellectual Property (¥900B)',
          ja: '全国10カ所の核融合産業クラスター建設と国際標準化特許網の構築（9,000億円）',
        },
        description: {
          en: 'Massive long-term industrial booster (+0.14 Productivity, +12 Youth Hope, +10 Approval).',
          ja: '次世代産業の覇権を握り、生産性+0.14、若者希望指数+12、内閣支持率+10%。',
        },
        costBillion: 900,
        productivityDelta: 0.14,
        hopeDelta: 12,
        approvalDelta: 10,
      },
      {
        id: 'c2',
        label: {
          en: 'Retain Technology as State Secret & Apply Proceeds to Debt Paydown',
          ja: '国家最高機密として囲い込み、将来の電力売却益を国債償還に優先充当',
        },
        description: {
          en: 'Conservative fiscal discipline (-¥400B deficit pressure), slower commercial scaling.',
          ja: '財政健全化を優先し、技術の普及速度は抑制。堅実な財政運営として評価。',
        },
        costBillion: -400,
        approvalDelta: 4,
      },
    ],
  },
  {
    id: 'ext_refugee_intake_geopolitical_crisis',
    title: {
      en: 'Regional Geopolitical Conflict: Maritime Refugee Influx',
      ja: '東アジア地政学動乱：難民・避難民の大量受け入れ決断',
    },
    headline: {
      en: 'Conflict in Neighboring Waters Displaces 120,000 Seeking Asylum at Japanese Ports',
      ja: '近隣諸国の軍事衝突により避難民船が西日本沿岸に到着、歴史的な人道危機に直面',
    },
    description: {
      en: 'Escalating conflict in the Taiwan Strait or Korean Peninsula has driven over 100,000 refugees to Japanese territorial waters. International partners expect humanitarian sheltering, while domestic conservatives express severe security concerns.',
      ja: '近隣地域での政情激変と戦闘により、十数万人規模の避難民が海上から日本へ脱出。国際社会からの積極的受け入れ要請と、治安や社会コストを懸念する国内世論との間で国論が二分されています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Establish Organized Humanitarian Resettlement & Work Authorization (¥350B)',
          ja: '人道的一時保護と就業許可の迅速発給・多文化統合プログラム（3,500億円）',
        },
        description: {
          en: 'Boosts international prestige (+0.02 Productivity, +0.02 TFR, -4 Senior, +8 Youth Approval).',
          ja: '若年労働力として受け入れ、国際評価を向上。生産性+0.02、若者支持率+8%。',
        },
        costBillion: 350,
        productivityDelta: 0.02,
        tfrDelta: 0.02,
        approvalDelta: 2,
        hopeDelta: 3,
      },
      {
        id: 'c2',
        label: {
          en: 'Strict Maritime Interdiction & Offshore Holding Facilities on Remote Islands',
          ja: '海上保安庁による領海退去警告と離島隔離施設での厳格審査',
        },
        description: {
          en: 'Satisfies domestic security concerns (+8 Senior Approval), but draws intense UN condemnation.',
          ja: '高齢保守層の安心感を得て支持率+8%。しかし国際的非難を浴び、外交的孤立が深まる。',
        },
        costBillion: 120,
        approvalDelta: 4,
        hopeDelta: -4,
      },
    ],
  },
  {
    id: 'ext_kyoto_overtourism_backlash',
    title: {
      en: 'Historic Overtourism Revolt in Ancient Capitals',
      ja: '古都・観光都市のオーバーツーリズム暴動寸前アラート',
    },
    headline: {
      en: 'Kyoto and Kamakura Residents Block Transit Over Unbearable Congestion & Rent Hikes',
      ja: 'インバウンド急増で市バスに乗れない住民が抗議デモ、観光公害が限界突破',
    },
    description: {
      en: 'With international tourism surpassing 45 million visitors annually, residents in Kyoto, Kamakura, and Hakone find their city infrastructure utterly paralyzed. Surging Airbnb rents are displacing local young couples from their hometowns.',
      ja: '円安を背景とする外国人観光客の爆発的増加により、主要観光地でゴミ放置・交通麻痺・ホテル建設による地価高騰が発生。地元の子育て世帯が住む場所を失い、観光客排斥運動へと発展しかねない緊張状態です。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Mandate Double-Tier Congestion Pricing & Tourist Transit Surtaxes (¥250B Net Revenue)',
          ja: '観光客向け二重運賃制（住民主権運賃）と特定混雑税の大胆導入（2,500億円の歳入増）',
        },
        description: {
          en: 'Restores citizen quality of life (+8 Approval, +3 Youth Hope, -¥250B deficit).',
          ja: '住民の生活環境を回復し内閣支持率+8%、観光税収2,500億円を子育て・地方創生財源へ。',
        },
        costBillion: -250,
        approvalDelta: 8,
        hopeDelta: 3,
      },
      {
        id: 'c2',
        label: {
          en: 'Subsidize Mass Infrastructure Expansion to Accommodate Higher Visitor Volumes',
          ja: '観光客受け入れ拡大のための新交通システム・駐車場大増設（4,000億円）',
        },
        description: {
          en: 'Maintains commercial tourism profits (+0.02 Productivity) but angers local citizens.',
          ja: '観光マネーの最大化を図るが、住民生活の犠牲に批判が集中し支持率-8%。',
        },
        costBillion: 400,
        productivityDelta: 0.02,
        approvalDelta: -8,
      },
    ],
  },
  {
    id: 'ext_semiconductor_silicon_island_boom',
    title: {
      en: 'Kyushu & Hokkaido "Silicon Island" Reshoring Boom',
      ja: '「シリコンアイランド」復活：九州・北海道半導体メガブーム',
    },
    headline: {
      en: 'State-of-the-Art 2nm Fabrication Ecosystems Spark Nationwide Wage Competition',
      ja: '最先端ファウンドリの量産稼働で地域経済が沸騰、高卒初任給35万円の争奪戦',
    },
    description: {
      en: 'Billion-dollar domestic foundries have brought global high-tech chip supply chains back to Japan. Towns in Kumamoto and Chitose report skyrocketing local tax windfalls, revitalizing regional employment for young families.',
      ja: 'TSMCや次世代半導体コンソーシアムの大型工場群が本格稼働。関連企業数百社が集結し、地方で若年層の給与水準が急騰。東京一極集中の流れを逆転させる巨大な起爆剤となっています。',
    },
    choices: [
      {
        id: 'c1',
        label: {
          en: 'Build High-Tech University Corridors & Free STEM Family Housing (¥500B)',
          ja: '半導体国家戦略特区への工学系大学院新設と若手技術者ファミリー住宅整備（5,000億円）',
        },
        description: {
          en: 'Solidifies Japan as global chip powerhouse (+0.09 Productivity, +0.03 TFR, +9 Youth Hope).',
          ja: '世界最先端の半導体拠点としての地位を確立。生産性+0.09、若者希望指数+9、TFR+0.03。',
        },
        costBillion: 500,
        productivityDelta: 0.09,
        tfrDelta: 0.03,
        hopeDelta: 9,
        approvalDelta: 7,
      },
      {
        id: 'c2',
        label: {
          en: 'Tax Semiconductor Super-Profits to Subsidize Lagging Non-Tech Regions',
          ja: '半導体特区への超過利潤課税と、非ハイテク過疎地への財源再配分',
        },
        description: {
          en: 'Generates immediate revenue (-¥300B deficit), but slows capital re-investment.',
          ja: '3,000億円の税収を得て全国へばらまくが、半導体メーカーの設備投資意欲に冷や水。',
        },
        costBillion: -300,
        productivityDelta: 0.02,
        approvalDelta: 2,
      },
    ],
  },
];
