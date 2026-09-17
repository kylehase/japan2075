import React, { useState } from 'react';
import { Language } from '../types/game';
import { SyncResult } from '../simulation/sheetImporter';
import { TRANSLATIONS } from '../i18n/translations';
import {
  TrendingDown,
  Building2,
  Users,
  Coins,
  Baby,
  Cpu,
  ShieldAlert,
  ArrowRight,
  Languages,
  Sparkles,
  Award,
  BookOpen,
  Scale,
  MapPin,
  PlayCircle,
  HelpCircle,
  Database,
  AlertTriangle,
} from 'lucide-react';
import { soundEngine } from '../canvas/audio';

interface LandingPageProps {
  language: Language;
  sheetData?: SyncResult | null;
  onToggleLanguage: () => void;
  onStartGame: () => void;
  onOpenHelp?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  language,
  sheetData,
  onToggleLanguage,
  onStartGame,
  onOpenHelp,
}) => {
  const [activeTab, setActiveTab] = useState<'crisis' | 'role' | 'systems'>('crisis');
  const t = TRANSLATIONS[language];
  const assessment = sheetData?.assessment;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-4 sm:p-8 animate-fadeIn">
      {/* Background Decorative Ambient Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Top Header Bar with Language Switcher */}
      <header className="relative w-full max-w-5xl flex items-center justify-between pb-4 border-b border-slate-800 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-xl shadow-inner">
            🇯🇵
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider uppercase text-slate-200 font-digital">
              JAPAN 2075
            </h1>
            <p className="text-xs text-slate-400 font-mono-tech">
              {language === 'en' ? 'The Demographic Crisis Simulator' : '日本の人口危機・国家経営シミュレータ'}
            </p>
          </div>
        </div>

        {/* Language Switcher Pill */}
        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 bg-slate-900/90 rounded-full border border-slate-700 shadow-sm">
            <button
              onClick={() => {
                if (language !== 'en') {
                  soundEngine.playClick();
                  onToggleLanguage();
                }
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                language === 'en'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => {
                if (language !== 'ja') {
                  soundEngine.playClick();
                  onToggleLanguage();
                }
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                language === 'ja'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              日本語
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative w-full max-w-5xl my-6 flex flex-col gap-6 z-10">
        {/* Title & Badge */}
        <div className="text-center flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono-tech tracking-wide">
            <ShieldAlert size={14} className="text-rose-400" />
            <span>
              {language === 'en'
                ? 'CRITICAL DEMOGRAPHIC THRESHOLD: 2025 — 2075'
                : '国家存亡の危機：2025年〜2075年 人口動態シミュレーション'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight font-digital">
            {language === 'en' ? (
              <>
                Japan 2075: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-rose-400">The Demographic Crisis</span>
              </>
            ) : (
              <>
                日本2075：<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-rose-400">人口崩壊を阻止せよ</span>
              </>
            )}
          </h2>

          <p className="max-w-3xl text-sm sm:text-base text-slate-300 leading-relaxed font-mono-tech">
            {language === 'en'
              ? 'Japan is experiencing the fastest population decline in modern history. As Prime Minister over the next 50 annual terms (2025–2075), you must steer economic policy, urban infrastructure, family welfare, and AI automation to secure Japan’s survival.'
              : '世界史上最速の少子高齢化・人口減少に直面する日本。2025年から2075年までの50年間（全50期）の内閣総理大臣として、都市再開発・少子化対策・AIロボティクス・財政再建を指揮し、国家の存続を導いてください。'}
          </p>
        </div>

        {/* Navigation Tabs for Explanations */}
        <div className="flex border-b border-slate-800 justify-center gap-2">
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('crisis');
            }}
            className={`px-4 py-2 text-xs font-bold font-mono-tech border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'crisis'
                ? 'border-rose-500 text-rose-400 bg-rose-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingDown size={15} />
            {language === 'en' ? "Japan's Real Crisis" : '日本の現実の人口危機'}
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('role');
            }}
            className={`px-4 py-2 text-xs font-bold font-mono-tech border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'role'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award size={15} />
            {language === 'en' ? 'Your Prime Ministerial Mandate' : '首相としての使命と勝利条件'}
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('systems');
            }}
            className={`px-4 py-2 text-xs font-bold font-mono-tech border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'systems'
                ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu size={15} />
            {language === 'en' ? 'Simulation Mechanics' : 'シミュレーション構造'}
          </button>
        </div>

        {/* Tab 1: Real Population Crisis Metrics */}
        {activeTab === 'crisis' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
            {/* Stat Card 1: Historic Low TFR */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2 hover:border-slate-700 transition">
              <div className="flex items-center justify-between text-rose-400">
                <span className="text-xs font-bold font-mono-tech uppercase">
                  {language === 'en' ? 'Total Fertility Rate' : '合計特殊出生率 (TFR)'}
                </span>
                <Baby size={18} />
              </div>
              <div className="text-3xl font-extrabold text-white font-digital">1.20</div>
              <p className="text-xs text-slate-400 leading-relaxed font-mono-tech">
                {language === 'en'
                  ? 'Fell to historic low in 2024 (0.99 in Tokyo). Far below the 2.07 replacement rate needed to sustain population.'
                  : '2024年に過去最低の1.20（東京都は0.99）を記録。人口置換水準の2.07を50年間下回り続けています。'}
              </p>
            </div>

            {/* Stat Card 2: Population Contraction */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2 hover:border-slate-700 transition">
              <div className="flex items-center justify-between text-amber-400">
                <span className="text-xs font-bold font-mono-tech uppercase">
                  {language === 'en' ? 'Annual Contraction' : '年間自然減少数'}
                </span>
                <TrendingDown size={18} />
              </div>
              <div className="text-3xl font-extrabold text-white font-digital">-800k+</div>
              <p className="text-xs text-slate-400 leading-relaxed font-mono-tech">
                {language === 'en'
                  ? 'Japan shrinks by ~800,000 people every single year, dropping from 124M today to projected <65M by 2075.'
                  : '鳥取県や島根県の人口に匹敵する80万人以上が毎年純減。2075年には6,000万人台へ半減予測。'}
              </p>
            </div>

            {/* Stat Card 3: Abandoned Homes & Vanishing Towns */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2 hover:border-slate-700 transition">
              <div className="flex items-center justify-between text-blue-400">
                <span className="text-xs font-bold font-mono-tech uppercase">
                  {language === 'en' ? 'Akiya & Vanishing Towns' : '空き家数・消滅可能性都市'}
                </span>
                <Building2 size={18} />
              </div>
              <div className="text-3xl font-extrabold text-white font-digital">9.0M / 896</div>
              <p className="text-xs text-slate-400 leading-relaxed font-mono-tech">
                {language === 'en'
                  ? '9 million abandoned homes (Akiya). The Masuda Report identified 896 municipalities at risk of total extinction.'
                  : '全国で900万戸の空き家が放置。増田レポートにより全国自治体の半数（896市町村）が消滅可能性と警告。'}
              </p>
            </div>

            {/* Stat Card 4: Debt & Silver Democracy */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-2 hover:border-slate-700 transition">
              <div className="flex items-center justify-between text-emerald-400">
                <span className="text-xs font-bold font-mono-tech uppercase">
                  {language === 'en' ? 'Debt / Silver Voters' : '国債対GDP比・高齢投票率'}
                </span>
                <Coins size={18} />
              </div>
              <div className="text-3xl font-extrabold text-white font-digital">260% / 80%</div>
              <p className="text-xs text-slate-400 leading-relaxed font-mono-tech">
                {language === 'en'
                  ? 'Debt-to-GDP exceeds 260%. Seniors vote at 80% turnout, creating intense political pushback against reform.'
                  : '国債残高はGDP比260%超。65歳以上の投票率は80%に達し、世代間再配分への強い政治抵抗を生みます。'}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Your Role */}
        {activeTab === 'role' && (
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-4 animate-fadeIn font-mono-tech text-xs sm:text-sm text-slate-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col gap-2">
                <div className="text-indigo-400 font-bold font-digital text-base flex items-center gap-2">
                  <MapPin size={18} />
                  {language === 'en' ? '1. Micro Urban Planning' : '1. 地域の拠点整備'}
                </div>
                <p className="text-slate-400 leading-relaxed text-xs">
                  {language === 'en'
                    ? 'Place Kodomo-en daycares (eliminating waitlists), Satellite Offices (cooling Tokyo overcrowding), Shinkansen stations, and Robotic Farm Hubs on the isometric regional map.'
                    : '2.5D等角投影マップ上で、認定こども園、サテライトオフィス（東京一極集中の是正）、スマート農業ロボット拠点、新幹線駅を建設・配置。'}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col gap-2">
                <div className="text-amber-400 font-bold font-digital text-base flex items-center gap-2">
                  <Scale size={18} />
                  {language === 'en' ? '2. Macro 5-Pillar Directives' : '2. 5大重点政策の閣議決定'}
                </div>
                <p className="text-slate-400 leading-relaxed text-xs">
                  {language === 'en'
                    ? 'Each 1-year term, select 1 of 3 legislative options across Family, Labor, Immigration, AI Automation, and Fiscal reform to enact your annual cabinet agenda.'
                    : '毎年の新内閣発足時に、「子育て」「労働」「移民」「AI自動化」「財政」の各分野から3者択一で政策を選択し、施政方針を決定。'}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col gap-2">
                <div className="text-emerald-400 font-bold font-digital text-base flex items-center gap-2">
                  <Award size={18} />
                  {language === 'en' ? '3. Solvency & 2075 Victory' : '3. 財政健全化と2075年到達'}
                </div>
                <p className="text-slate-400 leading-relaxed text-xs">
                  {language === 'en'
                    ? 'Maintain Cabinet approval (>20%) and prevent Debt-to-GDP from exploding (>350%). Reach 2075 with a revitalized TFR (>1.60) to achieve national victory.'
                    : '内閣支持率20%以上を維持し、国債利回り高騰やデフォルト（350%超過）を防ぎつつ、2075年時点でTFR 1.60以上の持続可能社会を確立。'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Simulation Mechanics */}
        {activeTab === 'systems' && (
          <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col gap-3 animate-fadeIn font-mono-tech text-xs sm:text-sm text-slate-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded border border-slate-800 flex items-start gap-2.5">
                <Baby size={16} className="text-pink-400 shrink-0 mt-0.5" />
                <div>
                  <b className="text-slate-200 block mb-0.5">{language === 'en' ? 'Lutz Low-Fertility Trap' : '低出生力トラップ（Lutzモデル）'}</b>
                  <span className="text-slate-400 leading-relaxed">
                    {language === 'en'
                      ? 'When Youth Hope Index drops below 35, family policy incentives lose 50% effectiveness as youth resign from marriage and childbearing.'
                      : '若者希望指数が35を下回ると、若年層の未婚化・諦めが固定化し、現金給付の効果が半減します。'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800 flex items-start gap-2.5">
                <Users size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <b className="text-slate-200 block mb-0.5">{language === 'en' ? 'Silver Democracy Weighting' : 'シルバー民主主義の力学'}</b>
                  <span className="text-slate-400 leading-relaxed">
                    {language === 'en'
                      ? 'Senior citizens vote at 80% vs 35% for youth. Reallocating budgets away from elderly care drastically impacts overall cabinet approval.'
                      : '高齢者（投票率80%）と若者（35%）の格差により、社会保障改革には激しい支持率摩擦が発生します。'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800 flex items-start gap-2.5">
                <Cpu size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <b className="text-slate-200 block mb-0.5">{language === 'en' ? 'AI & Robotic Labor Substitution' : 'AIロボティクスによる労働力代替'}</b>
                  <span className="text-slate-400 leading-relaxed">
                    {language === 'en'
                      ? 'Invest in autonomous eldercare and robotic agriculture to decouple economic output from shrinking working-age headcounts.'
                      : '介護・物流・農業へ自動化DXを導入し、生産年齢人口の減少を労働生産性の向上でカバー。'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800 flex items-start gap-2.5">
                <Coins size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <b className="text-slate-200 block mb-0.5">{language === 'en' ? 'Macro Sovereign Solvency' : '国債利回りと財政持続性'}</b>
                  <span className="text-slate-400 leading-relaxed">
                    {language === 'en'
                      ? 'Excessive bond issuance triggers bond selloffs and interest rate spikes. Pair targeted investments with progressive revenue streams.'
                      : '野放図な財政拡大はJGB国債利回りの急騰を招きます。税収改革と重点投資を組み合わせましょう。'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Quality & Scenario Verification Notice */}
        {assessment && assessment.status !== 'optimal' && (
          <div className="w-full max-w-2xl mx-auto p-3.5 rounded-xl border bg-amber-950/40 border-amber-600/60 text-amber-200 text-xs font-mono-tech flex items-start gap-3 shadow-lg">
            <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1 flex flex-col gap-1">
              <div className="font-bold font-digital uppercase tracking-wider text-amber-300">
                {language === 'en' ? 'Data Quality Notice: Supplemented Scenario' : 'データ整合性警告：シナリオ自動補完中'}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {language === 'en' ? assessment.warningMessageEn : assessment.warningMessageJa}
              </p>
              <div className="text-[10px] text-slate-400 flex items-center gap-3 pt-1">
                <span>{language === 'en' ? `Policies: ${sheetData?.policiesLoaded ?? 0} (Min: 10)` : `読込政策: ${sheetData?.policiesLoaded ?? 0}件（下限: 10）`}</span>
                <span>•</span>
                <span>{language === 'en' ? `Externalities: ${sheetData?.eventsLoaded ?? 0} (Min: 5)` : `読込事象: ${sheetData?.eventsLoaded ?? 0}件（下限: 5）`}</span>
              </div>
            </div>
          </div>
        )}

        {/* Start Game Action CTA & Custom Scenario Options */}
        <div className="flex flex-col items-center justify-center gap-3 pt-2">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                soundEngine.playElectionWin();
                onStartGame();
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-500 hover:via-indigo-500 hover:to-indigo-600 text-white font-extrabold text-base tracking-wide flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(79,70,229,0.45)] border border-indigo-400/40 cursor-pointer transition-all transform hover:-translate-y-0.5 active:translate-y-0 font-digital"
            >
              <PlayCircle size={22} className="text-amber-300 animate-pulse" />
              <span>
                {language === 'en' ? 'Assume Prime Ministership (2025)' : '内閣総理大臣に就任・施政を開始する (2025年)'}
              </span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="relative w-full max-w-5xl pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-500 font-mono-tech gap-2 z-10">
        <div>
          {language === 'en'
            ? 'Based on demographic projections from IPSS (National Institute of Population and Social Security Research) & Ministry of Internal Affairs.'
            : '国立社会保障・人口問題研究所（IPSS）将来推計人口および総務省人口動態統計に基づき構築'}
        </div>
        <div className="flex items-center gap-3">
          <span>v2.0 Modern Interface</span>
          <span>•</span>
          <span>1 Term = 1 Year (2025–2075)</span>
        </div>
      </footer>
    </div>
  );
};
