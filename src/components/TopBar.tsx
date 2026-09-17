import React, { useState } from 'react';
import {
  GameState,
  Language,
} from '../types/game';
import { SyncResult } from '../simulation/sheetImporter';
import { TRANSLATIONS } from '../i18n/translations';
import {
  Volume2,
  VolumeX,
  Languages,
  HelpCircle,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Flame,
  BarChart3,
  Landmark,
  Sparkles,
  LineChart as LineChartIcon,
  Database,
  Info,
  X,
} from 'lucide-react';
import { soundEngine } from '../canvas/audio';

interface TopBarProps {
  gameState: GameState;
  sheetData?: SyncResult | null;
  onToggleSound: () => void;
  onToggleLanguage: () => void;
  onOpenDemographics: () => void;
  onOpenBudget: () => void;
  onOpenHistory: () => void;
  onOpenHelp: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  gameState,
  sheetData,
  onToggleSound,
  onToggleLanguage,
  onOpenDemographics,
  onOpenBudget,
  onOpenHistory,
  onOpenHelp,
}) => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const t = TRANSLATIONS[gameState.language];
  const { demographics, economy, currentYear, cabinetTerm, cabinetApproval, language } = gameState;

  const debtWarning = economy.debtToGDP >= 300;
  const approvalWarning = cabinetApproval <= 25;
  const assessment = sheetData?.assessment;

  return (
    <header className="w-full bg-slate-900/95 backdrop-blur-md text-slate-100 border-b border-slate-800 px-3 py-2 flex flex-wrap items-center justify-between gap-2 select-none shadow-xl z-30">
      {/* Left: Flag, Title, Year & Term */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 shadow-inner">
          <span className="text-xl drop-shadow">🇯🇵</span>
          <div>
            <h1 className="text-xs font-bold text-slate-100 tracking-wide uppercase leading-tight font-digital">
              {t.gameTitle}
            </h1>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono-tech">
              <span className="text-amber-400 font-bold">
                {gameState.language === 'en' ? `Term ${cabinetTerm}` : `第${cabinetTerm}期`} ({currentYear})
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-bold text-xs tracking-wider">
                {gameState.language === 'en' ? `50-Year Horizon` : `2075年への軌跡`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Real-time Digital Readouts */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Total Population */}
        <div className="led-display-green px-3 py-1 rounded-lg flex flex-col min-w-[130px]">
          <span className="text-[10px] text-emerald-400 uppercase tracking-wider">{t.totalPop}</span>
          <div className="flex items-baseline justify-between gap-1">
            <span className="text-sm font-bold font-digital">
              {(demographics.totalPopulation / 1000000).toFixed(2)}M
            </span>
            <span className={`text-[10px] flex items-center font-bold ${demographics.naturalChange >= 0 ? 'text-emerald-300' : 'text-rose-400'}`}>
              {demographics.naturalChange >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {Math.abs(Math.round(demographics.naturalChange / 1000))}k/y
            </span>
          </div>
        </div>

        {/* TFR & Hope Index */}
        <div className={`px-3 py-1 rounded-lg flex flex-col min-w-[125px] ${demographics.lowFertilityTrapActive ? 'led-display-red' : demographics.synergyBonusActive ? 'led-display-cyan' : 'led-display-amber'}`}>
          <div className="flex items-center justify-between text-[10px]">
            <span className="uppercase tracking-wider">{t.tfr}</span>
            {demographics.lowFertilityTrapActive && (
              <span className="text-[9px] bg-red-950 text-red-300 px-1 rounded border border-red-500/40 flex items-center gap-0.5">
                <Flame size={8} /> TRAP
              </span>
            )}
            {demographics.synergyBonusActive && (
              <span className="text-[9px] bg-cyan-950 text-cyan-300 px-1 rounded border border-cyan-500/40 flex items-center gap-0.5">
                <Sparkles size={8} /> BONUS
              </span>
            )}
          </div>
          <div className="flex items-baseline justify-between gap-1">
            <span className="text-base font-bold font-digital">{demographics.tfr.toFixed(2)}</span>
            <span className="text-[10px] text-slate-300 font-mono-tech">Hope: <b className="text-white">{demographics.youthHopeIndex.toFixed(1)}</b></span>
          </div>
        </div>

        {/* Debt-to-GDP */}
        <div className={`px-3 py-1 rounded-lg flex flex-col min-w-[120px] ${debtWarning ? 'led-display-red animate-pulse' : 'led-display-green'}`}>
          <div className="flex items-center justify-between text-[10px]">
            <span className="uppercase tracking-wider">{t.debtToGdp}</span>
            {debtWarning && <AlertTriangle size={10} className="text-red-400" />}
          </div>
          <div className="flex items-baseline justify-between gap-1">
            <span className="text-sm font-bold font-digital">{economy.debtToGDP.toFixed(1)}%</span>
            <span className="text-[10px] text-slate-300 font-mono-tech">Yld: <b className="text-white">{economy.jgbYield.toFixed(1)}%</b></span>
          </div>
        </div>

        {/* Cabinet Approval */}
        <div className={`px-3 py-1 rounded-lg flex flex-col min-w-[110px] ${approvalWarning ? 'led-display-red animate-pulse' : 'led-display-amber'}`}>
          <span className="text-[10px] uppercase tracking-wider">{t.cabinetApproval}</span>
          <div className="flex items-baseline justify-between gap-1">
            <span className="text-sm font-bold font-digital">{cabinetApproval.toFixed(1)}%</span>
            <span className="text-[9px] text-slate-400 font-mono-tech">👵 {gameState.silverDemocracyIndex}%</span>
          </div>
        </div>
      </div>

      {/* Right: Window Action Modals & Settings */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => { soundEngine.playClick(); onOpenDemographics(); }}
          className="retro-button px-3 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer"
          title={t.demographics}
        >
          <BarChart3 size={14} className="text-emerald-400" />
          <span className="hidden md:inline">{t.demographics}</span>
        </button>

        <button
          onClick={() => { soundEngine.playClick(); onOpenBudget(); }}
          className="retro-button px-3 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer"
          title={t.budget}
        >
          <Landmark size={14} className="text-cyan-400" />
          <span className="hidden md:inline">{t.budget}</span>
        </button>

        <button
          onClick={() => { soundEngine.playClick(); onOpenHistory(); }}
          className="retro-button px-3 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer"
          title={language === 'en' ? 'Historical Data' : '過去の履歴データ'}
        >
          <LineChartIcon size={14} className="text-purple-400" />
          <span className="hidden md:inline">{language === 'en' ? 'History' : '歴史'}</span>
        </button>

        <div className="h-5 w-[1px] bg-slate-800 mx-1" />

        {/* Scenario Data Health Indicator */}
        {assessment && (
          <button
            onClick={() => {
              soundEngine.playClick();
              setShowStatusModal(true);
            }}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono-tech flex items-center gap-1.5 cursor-pointer transition shadow-sm ${
              assessment.status === 'optimal'
                ? 'bg-slate-950/80 border-slate-700 text-slate-300 hover:border-emerald-500 hover:text-emerald-300'
                : assessment.status === 'low_content'
                ? 'bg-amber-950/50 border-amber-600/70 text-amber-300 hover:bg-amber-900/60 animate-pulse'
                : 'bg-rose-950/50 border-rose-600/70 text-rose-300 hover:bg-rose-900/60 animate-pulse'
            }`}
            title={
              language === 'en'
                ? 'Scenario Data Health & Lower-Bounds Monitor'
                : 'シナリオデータ整合性・件数モニター'
            }
          >
            {assessment.status === 'optimal' ? (
              <Database size={13} className="text-emerald-400" />
            ) : (
              <AlertTriangle size={13} className={assessment.status === 'low_content' ? 'text-amber-400' : 'text-rose-400'} />
            )}
            <span className="hidden xl:inline text-[11px] font-bold">
              {assessment.status === 'optimal'
                ? (language === 'en' ? 'Data: Optimal' : 'データ正常')
                : assessment.status === 'low_content'
                ? (language === 'en' ? 'Data: Augmented' : 'データ補完中')
                : (language === 'en' ? 'Data: Default Fallback' : '標準復旧')}
            </span>
          </button>
        )}

        {/* Audio Toggle */}
        <button
          onClick={onToggleSound}
          className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white cursor-pointer transition"
          title={t.sound}
        >
          {gameState.soundEnabled ? <Volume2 size={14} className="text-emerald-400" /> : <VolumeX size={14} className="text-slate-500" />}
        </button>

        {/* Language Switcher Pill */}
        <div className="inline-flex p-0.5 bg-slate-950 rounded-lg border border-slate-800 shadow-sm">
          <button
            onClick={() => {
              if (gameState.language !== 'en') {
                soundEngine.playClick();
                onToggleLanguage();
              }
            }}
            className={`px-2 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
              gameState.language === 'en'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => {
              if (gameState.language !== 'ja') {
                soundEngine.playClick();
                onToggleLanguage();
              }
            }}
            className={`px-2 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
              gameState.language === 'ja'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            日本語
          </button>
        </div>

        {/* Help / Game Info Briefing */}
        <button
          onClick={() => { soundEngine.playClick(); onOpenHelp(); }}
          className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-cyan-400 hover:text-cyan-200 cursor-pointer transition"
          title={t.instructions}
        >
          <HelpCircle size={15} />
        </button>
      </div>

      {/* Scenario Data Assessment Modal */}
      {showStatusModal && assessment && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn select-none font-mono-tech">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden flex flex-col text-slate-100">
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database size={17} className="text-amber-400" />
                <h3 className="text-xs font-bold tracking-wide uppercase font-digital text-white">
                  {language === 'en' ? 'Scenario Data Health & Lower-Bound Monitor' : 'シナリオデータ整合性・件数モニター'}
                </h3>
              </div>
              <button
                onClick={() => { soundEngine.playClick(); setShowStatusModal(false); }}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4 text-xs bg-slate-950">
              {/* Status Banner */}
              <div className={`p-3.5 rounded-xl border flex flex-col gap-1.5 ${
                assessment.status === 'optimal'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : assessment.status === 'low_content'
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
              }`}>
                <div className="font-bold flex items-center gap-2 font-digital text-sm">
                  {assessment.status === 'optimal' ? (
                    <>
                      <Sparkles size={16} className="text-emerald-400" />
                      <span>{language === 'en' ? 'Status: Optimal Content Pool' : 'ステータス：データ件数充足'}</span>
                    </>
                  ) : assessment.status === 'low_content' ? (
                    <>
                      <AlertTriangle size={16} className="text-amber-400" />
                      <span>{language === 'en' ? 'Status: Low Content (Augmented with Standard Scenario)' : 'ステータス：件数不足のため標準シナリオで補完中'}</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={16} className="text-rose-400" />
                      <span>{language === 'en' ? 'Status: Unreadable / Reverted to Standard 2025–2075 Defaults' : 'ステータス：読込失敗・標準シナリオへ自動復旧'}</span>
                    </>
                  )}
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  {language === 'en' ? assessment.warningMessageEn || 'All custom ordinances and externalities loaded successfully.' : assessment.warningMessageJa || 'すべての政策および事象データが正常に読み込まれました。'}
                </p>
              </div>

              {/* Lower Bounds Audit Table */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 flex flex-col gap-2.5">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  {language === 'en' ? 'Verification against Playability Lower Bounds' : 'プレイ可能最小基準（下限閾値）との比較'}
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-400">{language === 'en' ? 'Policies' : '政策数'}</div>
                    <div className="text-sm font-bold text-indigo-300 font-digital">
                      {sheetData?.policiesLoaded ?? 0} <span className="text-[10px] text-slate-500 font-normal">/ min 10</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-400">{language === 'en' ? 'Externalities' : '事象数'}</div>
                    <div className="text-sm font-bold text-cyan-300 font-digital">
                      {sheetData?.eventsLoaded ?? 0} <span className="text-[10px] text-slate-500 font-normal">/ min 5</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-400">{language === 'en' ? 'Total Active' : '総件数'}</div>
                    <div className="text-sm font-bold text-emerald-300 font-digital">
                      {sheetData?.parsedOrdinances.length ?? 0} pol / {sheetData?.parsedEvents.length ?? 0} evt
                    </div>
                  </div>
                </div>
              </div>

              {/* Explanation note */}
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {language === 'en'
                  ? 'To prevent the simulation from exhausting all policies or running silently across the 50-year horizon (2025–2075), sheets with fewer than 10 policies or 5 events are automatically augmented with standard baseline scenario elements.'
                  : '50年間（2025年〜2075年）のシミュレーションにおいて政策が途中で枯渇したり事象が停止するのを防ぐため、政策10件未満または事象5件未満のシートは標準シナリオのベースデータで自動補完されます。'}
              </p>
            </div>

            <div className="bg-slate-950 p-3 px-5 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => { soundEngine.playClick(); setShowStatusModal(false); }}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
              >
                {language === 'en' ? 'Close' : '閉じる'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
