const fs = require('fs');

const policies = `
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
      en: 'Mirrors Romania\\'s disastrous 1966 policy. Forces births through criminalization. Causes a brief TFR spike followed by systemic societal collapse and trauma.',
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
      en: 'Like France\\'s historic policy, aims to force companies to hire more staff. Backfires: Companies freeze hiring, wages stagnate, and bureaucracy balloons.',
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
  }
`;

const content = fs.readFileSync('src/simulation/constants.ts', 'utf8');

const marker = 'export const generateAnnualAgenda = (currentOrdinances: Ordinance[], currentYear: number, context?: AgendaContext): string[] => {';
const markerIndex = content.indexOf(marker);

// Find the last closing bracket before the marker which ends the array
const arrayEndBracketIndex = content.lastIndexOf('];', markerIndex);

if (arrayEndBracketIndex === -1) {
    console.error("Could not find the end of INITIAL_ORDINANCES array");
    process.exit(1);
}

const before = content.substring(0, arrayEndBracketIndex);
const after = content.substring(arrayEndBracketIndex);

// Add comma if the last item doesn't have it (optional, but JS handles trailing commas or missing ones usually if we just insert the block which has trailing commas)
const newContent = before + policies + after;

fs.writeFileSync('src/simulation/constants.ts', newContent, 'utf8');
console.log("Injected historical backfire policies.");
