import React from 'react';
import { GameState, Language } from '../types/game';
import { TRANSLATIONS } from '../i18n/translations';
import { Vote, TrendingUp, TrendingDown, Award, ArrowRight } from 'lucide-react';
import { soundEngine } from '../canvas/audio';

interface TermSummaryModalProps {
  gameState: GameState;
  language: Language;
  onContinue: () => void;
}

export const TermSummaryModal: React.FC<TermSummaryModalProps> = ({
  gameState,
  language,
  onContinue,
}) => {
  const t = TRANSLATIONS[language];
  const { cabinetTerm, currentYear, demographics, economy, cabinetApproval } = gameState;

  const isElected = cabinetApproval >= 25;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-fadeIn select-none font-mono-tech">
      <div className="w-full max-w-2xl flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-slate-700 bg-slate-900 text-slate-100">
        {/* Title Bar */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Vote size={22} className="text-amber-300" />
            <div>
              <div className="text-[11px] text-amber-300 uppercase tracking-widest">
                {language === 'en' ? 'GENERAL ELECTION & CABINET ASSESSMENT' : '衆議院総選挙・内閣施政評価レポート'}
              </div>
              <h2 className="text-base font-bold font-digital text-white">
                {language === 'en' ? `Cabinet Term ${cabinetTerm - 1} Completion • Year ${currentYear}` : `第${cabinetTerm - 1}期内閣 満期評価・西暦${currentYear}年`}
              </h2>
            </div>
          </div>
        </div>

        {/* Content Body - High Contrast */}
        <div className="p-5 bg-slate-950 flex flex-col gap-3.5 text-xs">
          {/* Election Result Banner */}
          <div className={`p-4 rounded-xl flex items-center justify-between border ${
            isElected ? 'bg-emerald-950/60 border-emerald-500/70 text-emerald-200' : 'bg-rose-950/60 border-rose-500/70 text-rose-200'
          }`}>
            <div className="flex items-center gap-3">
              <Award size={26} className={isElected ? 'text-emerald-400' : 'text-rose-400'} />
              <div>
                <h3 className="text-sm font-bold font-digital uppercase text-white">
                  {isElected
                    ? (language === 'en' ? 'Cabinet Mandate Renewed by Voters!' : '総選挙勝利！内閣続投の信任を獲得！')
                    : (language === 'en' ? 'Narrow Margin: Majority Maintained with Opposition Pressure' : '過半数ギリギリでの辛勝：野党勢力拡大')}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {language === 'en'
                    ? `Cabinet Approval stands at ${cabinetApproval.toFixed(1)}%. Senior turnout: ${gameState.seniorTurnout}%.`
                    : `内閣支持率：${cabinetApproval.toFixed(1)}%。高齢者投票率：${gameState.seniorTurnout}%。`}
                </p>
              </div>
            </div>
            <span className="text-xl font-bold font-digital text-white shrink-0">
              {cabinetApproval.toFixed(0)}%
            </span>
          </div>

          {/* Macro Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">{t.tfr}</span>
              <span className="text-base font-bold font-digital text-pink-400 mt-0.5">{demographics.tfr.toFixed(2)}</span>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">{t.totalPop}</span>
              <span className="text-base font-bold font-digital text-white mt-0.5">{(demographics.totalPopulation / 1000000).toFixed(1)}M</span>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">{t.gdp}</span>
              <span className="text-base font-bold font-digital text-emerald-400 mt-0.5">¥{economy.gdp.toFixed(1)}T</span>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">{t.debtToGdp}</span>
              <span className="text-base font-bold font-digital text-amber-300 mt-0.5">{economy.debtToGDP.toFixed(1)}%</span>
            </div>
          </div>

          {/* Prime Minister Term Address */}
          <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-slate-200 text-xs leading-relaxed">
            <p>
              {language === 'en'
                ? `Commencing Cabinet Term ${cabinetTerm} (Year ${currentYear}). Review your macroeconomic metrics on the 2.5D visual landscape, draft your legislative agenda, and steer Japan toward demographic vitality and fiscal sustainability.`
                : `第${cabinetTerm}期政権（西暦${currentYear}年度）が発足します。2.5Dマクロ景観で各地域の人口と希望指数を確認し、施策方針を策定して日本の活力回復を推進してください。`}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 border-t border-slate-800 p-4 flex justify-end">
          <button
            onClick={() => { soundEngine.playClick(); onContinue(); }}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition shadow-lg border border-indigo-400/50"
          >
            <span>{language === 'en' ? 'Proceed to Policy Agenda' : '施政方針策定へ進む'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
