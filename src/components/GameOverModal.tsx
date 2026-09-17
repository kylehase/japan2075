import React from 'react';
import { GameOverReason, GameState, Language } from '../types/game';
import { TRANSLATIONS } from '../i18n/translations';
import { Trophy, Skull, AlertOctagon, RotateCcw, Award } from 'lucide-react';
import { soundEngine } from '../canvas/audio';

interface GameOverModalProps {
  reason: GameOverReason;
  gameState: GameState;
  language: Language;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  reason,
  gameState,
  language,
  onRestart,
}) => {
  const t = TRANSLATIONS[language];
  const isVictory = reason === 'victory_2075';
  const isFiscal = reason === 'fiscal_collapse';
  const isNoConfidence = reason === 'no_confidence_vote';
  const isDemographicFreefall = reason === 'demographic_freefall';
  const isWorkforceCollapse = reason === 'workforce_collapse';

  // Calculate final performance grade
  let score = 50;
  score += (gameState.demographics.tfr - 1.20) * 100;
  score += (300 - gameState.economy.debtToGDP) * 0.5;
  score += (gameState.cabinetApproval - 40);
  score += (gameState.demographics.youthHopeIndex - 50);

  let rank = 'B';
  if (score >= 90) rank = 'S';
  else if (score >= 75) rank = 'A';
  else if (score >= 55) rank = 'B';
  else if (score >= 35) rank = 'C';
  else rank = 'D';

  if (!isVictory) rank = 'F';

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 animate-fadeIn select-none font-mono-tech">
      <div className="w-full max-w-2xl flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-slate-700 bg-slate-900 text-slate-100">
        {/* Header */}
        <div
          className={`px-5 py-4 flex items-center gap-3 border-b border-slate-800 text-white ${
            isVictory
              ? 'bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950'
              : 'bg-gradient-to-r from-rose-950 via-red-950 to-slate-950'
          }`}
        >
          {isVictory ? (
            <Trophy size={30} className="text-yellow-300 animate-bounce" />
          ) : (
            <AlertOctagon size={30} className="text-rose-400 animate-pulse" />
          )}
          <div>
            <div className="text-[10px] text-amber-300 uppercase tracking-widest">
              {isVictory ? 'HISTORICAL ACHIEVEMENT • 2025–2075' : 'NATIONAL CRISIS TERMINATION'}
            </div>
            <h2 className="text-base font-bold font-digital text-white">
              {isVictory
                ? t.victoryTitle
                : isFiscal
                ? t.fiscalCollapseTitle
                : isDemographicFreefall
                ? t.demographicFreefallTitle
                : isWorkforceCollapse
                ? t.workforceCollapseTitle
                : t.noConfidenceTitle}
            </h2>
          </div>
        </div>

        {/* Narrative & Score Card */}
        <div className="p-5 bg-slate-950 flex flex-col gap-4 text-xs">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-slate-100 text-xs leading-relaxed shadow-inner">
            {isVictory ? (
              <p>
                {language === 'en'
                  ? `Over five turbulent decades from 2025 to 2075, your administration successfully steered Japan through its most existential demographic bottleneck. Through calculated family subsidies, automation infrastructure, and fiscal resilience, Japan stabilized at a sustainable TFR of ${gameState.demographics.tfr.toFixed(2)} and defended national solvency.`
                  : `2025年から2075年までの半世紀にわたり、貴殿の内閣は人口減少という未曾有の国難を見事に舵取りしました。適切な子育て支援、AIロボティクス導入、そして財政規律により、出生率は${gameState.demographics.tfr.toFixed(2)}へと回復し、日本社会の持続可能性を確立しました。`}
              </p>
            ) : isFiscal ? (
              <p>
                {language === 'en'
                  ? `In year ${gameState.currentYear}, sovereign debt crossed 320% of GDP amidst soaring deficits. International credit rating agencies downgraded Japanese Government Bonds (JGBs) to Junk, sparking a hyper-stagflation spiral and sovereign debt default.`
                  : `西暦${gameState.currentYear}年、債務対GDP比が320%を突破。国際格付け機関のジャンク債格下げに伴い国債利回りが暴騰、利払い不能に陥りハイパースタグフレーションと財政破綻が発生しました。`}
              </p>
            ) : isDemographicFreefall ? (
              <p>
                {language === 'en'
                  ? `In year ${gameState.currentYear}, the Total Fertility Rate (TFR) collapsed below 0.70. With virtually no children being born, sociological modeling declared the Japanese population mathematically unrecoverable. The nation entered an irreversible terminal decline spiral.`
                  : `西暦${gameState.currentYear}年、合計特殊出生率（TFR）が0.70を割り込みました。将来世代の再生産が事実上停止し、日本社会は数学的に回復不可能な「人口消滅スパイラル」へと突入しました。`}
              </p>
            ) : isWorkforceCollapse ? (
              <p>
                {language === 'en'
                  ? `In year ${gameState.currentYear}, the working-age population ratio fell below 48%. The active workforce could no longer maintain basic national infrastructure, logistics grids, or healthcare systems for the elderly majority, leading to systemic state failure.`
                  : `西暦${gameState.currentYear}年、生産年齢人口の比率が48%を割り込みました。圧倒的多数の高齢者を支えるための労働力が完全に枯渇し、電力・物流・医療などの国家インフラが維持不能となり、社会システムが崩壊しました。`}
              </p>
            ) : (
              <p>
                {language === 'en'
                  ? `In year ${gameState.currentYear}, Cabinet approval fell below 15%. A coalition of opposition parties and furious voters passed a historic Vote of No Confidence in the National Diet, terminating your administration.`
                  : `西暦${gameState.currentYear}年、内閣支持率が15%を割り込みました。衆議院本会議において内閣不信任決議案が可決され、内閣総辞職に追い込まれました。`}
              </p>
            )}
          </div>

          {/* Performance Assessment Summary */}
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-white flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                {language === 'en' ? 'Administration Legacy Assessment' : '内閣統治実績・歴史的評価'}
              </span>
              <span className="text-xs text-slate-300">
                {language === 'en' ? 'Final TFR' : '最終出生率'}: <b className="text-pink-400 font-digital">{gameState.demographics.tfr.toFixed(2)}</b> •{' '}
                {language === 'en' ? 'Debt/GDP' : '最終債務比率'}: <b className="text-amber-300 font-digital">{gameState.economy.debtToGDP.toFixed(1)}%</b> •{' '}
                {language === 'en' ? 'Pop' : '最終人口'}: <b className="text-emerald-400 font-digital">{(gameState.demographics.totalPopulation / 1000000).toFixed(1)}M</b>
              </span>
            </div>

            <div className="text-center bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">{language === 'en' ? 'Rank' : '評価ランク'}</span>
              <span className={`text-2xl font-bold font-digital ${
                rank === 'S' || rank === 'A' ? 'text-yellow-400' : rank === 'B' ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {rank}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => { soundEngine.playClick(); onRestart(); }}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer transition shadow-lg border border-indigo-400/50"
          >
            <RotateCcw size={16} />
            <span>{language === 'en' ? 'Start New Administration (Restart)' : '新たな政権を発足する（再挑戦）'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
