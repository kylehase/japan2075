import React from 'react';
import { SessionImpactSummary, Language } from '../types/game';
import { TRANSLATIONS } from '../i18n/translations';
import {
  Baby,
  Sparkles,
  Landmark,
  Cpu,
  Vote,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import { soundEngine } from '../canvas/audio';

interface SessionImpactModalProps {
  summary: SessionImpactSummary;
  language: Language;
  onClose: () => void;
}

// --- Industry Standard KPI Metric Card Component ---
interface IndustryMetricCardProps {
  title: string;
  categoryName: string;
  icon: React.ReactNode;
  iconBgClass: string;
  iconColorClass: string;
  prevVal: number;
  nextVal: number;
  delta: number;
  decimals?: number;
  unit?: string;
  maxScale?: number;
  benchmarkVal?: number;
  benchmarkLabel?: string;
  reverseColors?: boolean;
  language: Language;
  subDetail?: React.ReactNode;
}

const IndustryMetricCard: React.FC<IndustryMetricCardProps> = ({
  title,
  categoryName,
  icon,
  iconBgClass,
  iconColorClass,
  prevVal,
  nextVal,
  delta,
  decimals = 1,
  unit = '',
  maxScale = 100,
  benchmarkVal,
  benchmarkLabel,
  reverseColors = false,
  language,
  subDetail,
}) => {
  const isZero = Math.abs(delta) < 0.0001;
  const isGood = reverseColors ? delta < 0 : delta > 0;

  const deltaSign = delta > 0 ? '+' : '';
  const formattedDelta = isZero ? '±0' : `${deltaSign}${delta.toFixed(decimals)}${unit}`;

  // Scale calculations for progress track
  const minVal = 0;
  const prevPct = Math.min(100, Math.max(0, ((prevVal - minVal) / (maxScale - minVal)) * 100));
  const nextPct = Math.min(100, Math.max(0, ((nextVal - minVal) / (maxScale - minVal)) * 100));

  const benchmarkPct = benchmarkVal
    ? Math.min(100, Math.max(0, ((benchmarkVal - minVal) / (maxScale - minVal)) * 100))
    : null;

  return (
    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between gap-3.5 shadow-md hover:border-slate-700 transition-colors">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl border ${iconBgClass}`}>
            {icon}
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {categoryName}
            </div>
            <div className="text-xs font-bold text-white">
              {title}
            </div>
          </div>
        </div>

        {/* Industry Standard Delta Pill Badge */}
        <div
          className={`px-2.5 py-1 rounded-lg border font-digital font-bold text-xs flex items-center gap-1 shrink-0 ${
            isZero
              ? 'bg-slate-800 text-slate-300 border-slate-700'
              : isGood
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
              : 'bg-rose-950/90 text-rose-300 border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
          }`}
        >
          {delta > 0 ? (
            <ArrowUpRight size={13} />
          ) : delta < 0 ? (
            <ArrowDownRight size={13} />
          ) : (
            <Minus size={13} />
          )}
          <span>{formattedDelta}</span>
        </div>
      </div>

      {/* Primary Target Value & Baseline Comparison */}
      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/90 flex flex-col gap-2.5">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[10px] text-slate-400 font-mono-tech">
              {language === 'en' ? 'Projected Result' : '次期予測結果'}
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span
                className={`text-2xl font-digital font-bold leading-none ${
                  isGood ? 'text-emerald-300' : delta < 0 ? 'text-rose-300' : 'text-slate-100'
                }`}
              >
                {nextVal.toFixed(decimals)}
              </span>
              <span className="text-xs font-mono-tech text-slate-400 font-bold">{unit}</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-mono-tech">
              {language === 'en' ? 'Previous Baseline' : '前年実績値'}
            </div>
            <div className="text-sm font-digital text-blue-400 font-bold mt-0.5">
              {prevVal.toFixed(decimals)}
              <span className="text-[10px] font-mono-tech text-slate-400 ml-0.5">{unit}</span>
            </div>
          </div>
        </div>

        {/* Modern Progress Bar Scale */}
        <div className="relative w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 flex items-center mt-1">
          {/* Base Fill */}
          <div
            className="h-full bg-blue-600 rounded-l-full transition-all"
            style={{ width: `${Math.min(prevPct, nextPct)}%` }}
          />

          {/* Delta Extension Fill */}
          {delta > 0 && (
            <div
              className="h-full bg-emerald-500 transition-all shadow-sm"
              style={{ width: `${Math.abs(nextPct - prevPct)}%` }}
            />
          )}

          {/* Delta Reduction Fill */}
          {delta < 0 && (
            <div
              className="h-full bg-rose-500 transition-all shadow-sm"
              style={{ width: `${Math.abs(prevPct - nextPct)}%` }}
            />
          )}

          {/* Benchmark Target Marker Line (e.g. 2.07 TFR) */}
          {benchmarkPct !== null && (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10 shadow-[0_0_6px_rgba(245,158,11,0.8)]"
              style={{ left: `${benchmarkPct}%` }}
              title={benchmarkLabel}
            />
          )}
        </div>

        {/* Scale Legend / Benchmark Subtext */}
        <div className="flex items-center justify-between text-[9px] font-mono-tech text-slate-400 pt-0.5">
          <span>{minVal}{unit}</span>
          {benchmarkLabel && (
            <span className="text-amber-400 font-semibold">{benchmarkLabel}</span>
          )}
          <span>{maxScale}{unit}</span>
        </div>

        {subDetail}
      </div>
    </div>
  );
};

// --- Fiscal Expenditure Meter Component ---
interface FiscalMeterProps {
  prevBillion: number;
  nextBillion: number;
  deltaBillion: number;
  language: Language;
}

const FiscalMeter: React.FC<FiscalMeterProps> = ({
  prevBillion,
  nextBillion,
  deltaBillion,
  language,
}) => {
  const maxCap = Math.max(15000, Math.max(prevBillion, nextBillion) * 1.25);
  const prevPct = Math.min(100, Math.max(0, (prevBillion / maxCap) * 100));
  const nextPct = Math.min(100, Math.max(0, (nextBillion / maxCap) * 100));
  const deltaPct = Math.abs(nextPct - prevPct);

  const isCostIncrease = deltaBillion > 0;
  const isCostSavings = deltaBillion < 0;

  const formatTrillion = (billion: number) => {
    return (billion / 1000).toFixed(2);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Visual Outlay Bar */}
      <div className="w-full bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[10px] font-mono-tech">
          <span className="text-slate-400 font-bold uppercase">
            {language === 'en' ? 'Annual Policy Budget Outlay Scale (¥0 to ¥15T+)' : '年間施策予算スケール（0〜15兆円超）'}
          </span>
          <span className="text-slate-500 font-mono-tech">
            {language === 'en' ? `Capacity: ¥${(maxCap / 1000).toFixed(0)}T` : `上限スケール: ¥${(maxCap / 1000).toFixed(0)}兆`}
          </span>
        </div>

        {/* Progress Track */}
        <div className="relative w-full h-6 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 flex items-center">
          {isCostIncrease ? (
            <>
              <div
                className="h-full bg-blue-600 flex items-center justify-start pl-2 text-[10px] font-bold text-white transition-all"
                style={{ width: `${prevPct}%` }}
              >
                {prevPct > 15 && <span>¥{formatTrillion(prevBillion)}T</span>}
              </div>
              <div
                className="h-full bg-rose-500 border-l border-rose-300 flex items-center justify-center text-[10px] font-bold text-white transition-all shadow-inner"
                style={{ width: `${deltaPct}%` }}
              >
                {deltaPct > 8 && (
                  <span>
                    +¥{Math.abs(deltaBillion) >= 1000 ? `${(deltaBillion / 1000).toFixed(1)}T` : `${deltaBillion.toFixed(0)}B`}
                  </span>
                )}
              </div>
            </>
          ) : isCostSavings ? (
            <>
              <div
                className="h-full bg-blue-600 flex items-center justify-start pl-2 text-[10px] font-bold text-white transition-all"
                style={{ width: `${nextPct}%` }}
              >
                {nextPct > 15 && <span>¥{formatTrillion(nextBillion)}T</span>}
              </div>
              <div
                className="h-full bg-emerald-500 border-l border-emerald-300 flex items-center justify-center text-[10px] font-bold text-white transition-all shadow-inner"
                style={{ width: `${deltaPct}%` }}
              >
                {deltaPct > 8 && (
                  <span>
                    -¥{Math.abs(deltaBillion) >= 1000 ? `${(Math.abs(deltaBillion) / 1000).toFixed(1)}T` : `${Math.abs(deltaBillion).toFixed(0)}B`}
                  </span>
                )}
              </div>
            </>
          ) : (
            <div
              className="h-full bg-blue-600 flex items-center justify-start pl-2 text-[10px] font-bold text-white transition-all"
              style={{ width: `${nextPct}%` }}
            >
              <span>¥{formatTrillion(nextBillion)}T</span>
            </div>
          )}
        </div>

        {/* 3 Summary Cards */}
        <div className="grid grid-cols-3 gap-2 mt-1">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-[10px] text-blue-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>{language === 'en' ? 'Previous Outlay' : '改定前予算'}</span>
            </div>
            <span className="text-xs font-digital font-bold text-slate-200">
              ¥{formatTrillion(prevBillion)}T
              <span className="text-[9px] text-slate-400 font-mono-tech ml-1">/yr</span>
            </span>
          </div>

          <div
            className={`p-2 rounded-lg border flex flex-col gap-0.5 ${
              isCostSavings
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                : isCostIncrease
                ? 'bg-rose-950/60 border-rose-500/60 text-rose-300'
                : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-1.5 text-[10px] font-bold">
              <span
                className={`w-2 h-2 rounded-full ${
                  isCostSavings ? 'bg-emerald-400' : isCostIncrease ? 'bg-rose-400' : 'bg-slate-500'
                }`}
              />
              <span>
                {isCostSavings
                  ? language === 'en' ? 'Fiscal Savings' : '歳出削減'
                  : isCostIncrease
                  ? language === 'en' ? 'Budget Expansion' : '追加予算支出'
                  : language === 'en' ? 'Net Shift' : '変動なし'}
              </span>
            </div>
            <span className="text-xs font-digital font-bold">
              {deltaBillion > 0 ? '+' : ''}
              {Math.abs(deltaBillion) >= 1000
                ? `¥${(deltaBillion / 1000).toFixed(2)}T`
                : `¥${deltaBillion.toFixed(0)}B`}
              <span className="text-[9px] font-mono-tech ml-1">/yr</span>
            </span>
          </div>

          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>{language === 'en' ? 'Revised Total Budget' : '改定後総予算'}</span>
            </div>
            <span className="text-xs font-digital font-bold text-white">
              ¥{formatTrillion(nextBillion)}T
              <span className="text-[9px] text-slate-400 font-mono-tech ml-1">/yr</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SessionImpactModal: React.FC<SessionImpactModalProps> = ({
  summary,
  language,
  onClose,
}) => {
  const t = TRANSLATIONS[language];
  const { year, cabinetTerm, metrics, activePoliciesCount } = summary;

  const handleReturn = () => {
    soundEngine.playClick();
    onClose();
  };

  const formatDeltaText = (val: number, decimals: number = 1, prefix: string = '', suffix: string = '') => {
    if (Math.abs(val) < 0.0001) return '±0';
    const sign = val > 0 ? '+' : '';
    return `${sign}${prefix}${val.toFixed(decimals)}${suffix}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn select-none font-mono-tech">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-slate-700 bg-slate-900 text-slate-100">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600/30 rounded-lg border border-emerald-400/50 shadow-sm">
              <CheckCircle2 size={22} className="text-emerald-400" />
            </div>
            <div>
              <div className="text-[11px] text-emerald-400 uppercase tracking-widest flex items-center gap-2 font-bold">
                <span>{language === 'en' ? 'LEGISLATIVE SESSION CONCLUDED' : '国会閉会・政策採決完了'}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{language === 'en' ? 'POLICY PACKAGE IMPACT REPORT' : '政策パッケージ 期待影響レポート'}</span>
              </div>
              <h2 className="text-base font-bold font-digital text-white flex items-center gap-2 mt-0.5">
                <span>
                  {language === 'en'
                    ? `Year ${year} Enacted Policy Stimulus ➔ Projected Results for Year ${year + 1}`
                    : `西暦${year}年度 成立政策パッケージの波及効果と次年度(${year + 1}年)予測結果`}
                </span>
                <span className="text-indigo-400 font-mono-tech text-xs ml-1">
                  (Term {cabinetTerm})
                </span>
              </h2>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-400">
            <Layers size={14} className="text-indigo-400" />
            <span>
              {language === 'en'
                ? `${activePoliciesCount} Active Laws`
                : `現行法律：${activePoliciesCount}件`}
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-4 bg-slate-950 text-xs custom-scrollbar">
          
          <div className="flex items-center justify-between mb-0.5">
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp size={14} className="text-indigo-400" />
              <span>{language === 'en' ? 'KEY PERFORMANCE INDICATORS (KPIs)' : '主要政策成果指標（KPI）の変動'}</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono-tech">
              {language === 'en' ? `Year ${year} Baseline ➔ Year ${year + 1} Projected Result` : `${year}年実績 ➔ ${year + 1}年予測結果`}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            
            {/* 1. Total Fertility Rate (TFR) */}
            <IndustryMetricCard
              title={language === 'en' ? 'Births Per Woman' : '合計特殊出生率'}
              categoryName={t.tfr}
              icon={<Baby size={18} className="text-pink-400" />}
              iconBgClass="bg-pink-950/80 border-pink-800/60"
              iconColorClass="text-pink-400"
              prevVal={metrics.tfr.prev}
              nextVal={metrics.tfr.next}
              delta={metrics.tfr.delta}
              decimals={2}
              unit=""
              maxScale={2.50}
              benchmarkVal={2.07}
              benchmarkLabel={language === 'en' ? 'Replacement: 2.07' : '人口置換水準: 2.07'}
              language={language}
            />

            {/* 2. Youth Hope Index */}
            <IndustryMetricCard
              title={language === 'en' ? 'Youth Optimism Index' : '若者希望指標'}
              categoryName={t.hopeIndex}
              icon={<Sparkles size={18} className="text-amber-400" />}
              iconBgClass="bg-amber-950/80 border-amber-800/60"
              iconColorClass="text-amber-400"
              prevVal={metrics.hopeIndex.prev}
              nextVal={metrics.hopeIndex.next}
              delta={metrics.hopeIndex.delta}
              decimals={1}
              unit="/100"
              maxScale={100}
              language={language}
            />

            {/* 3. Labor Productivity */}
            <IndustryMetricCard
              title={language === 'en' ? 'Labor Efficiency & Automation' : '労働生産性・DX推進率'}
              categoryName={language === 'en' ? 'Productivity & AI' : '労働生産性・DX'}
              icon={<Cpu size={18} className="text-cyan-400" />}
              iconBgClass="bg-cyan-950/80 border-cyan-800/60"
              iconColorClass="text-cyan-400"
              prevVal={metrics.productivity.prev}
              nextVal={metrics.productivity.next}
              delta={metrics.productivity.delta}
              decimals={1}
              unit="%"
              maxScale={160}
              language={language}
            />

            {/* 4. Cabinet Approval Rating */}
            <IndustryMetricCard
              title={language === 'en' ? 'Cabinet Approval Rating' : '内閣支持率'}
              categoryName={t.approval}
              icon={<Vote size={18} className="text-emerald-400" />}
              iconBgClass="bg-emerald-950/80 border-emerald-800/60"
              iconColorClass="text-emerald-400"
              prevVal={metrics.cabinetApproval.prev}
              nextVal={metrics.cabinetApproval.next}
              delta={metrics.cabinetApproval.delta}
              decimals={1}
              unit="%"
              maxScale={100}
              language={language}
              subDetail={
                <div className="flex items-center gap-3 justify-end text-[9px] text-slate-400 font-mono-tech border-t border-slate-800/80 pt-1.5 mt-0.5">
                  <span className={metrics.youthApproval.delta > 0 ? 'text-emerald-400 font-bold' : metrics.youthApproval.delta < 0 ? 'text-rose-400 font-bold' : ''}>
                    Youth: {formatDeltaText(metrics.youthApproval.delta, 0, '', '%')}
                  </span>
                  <span className={metrics.seniorApproval.delta > 0 ? 'text-emerald-400 font-bold' : metrics.seniorApproval.delta < 0 ? 'text-rose-400 font-bold' : ''}>
                    Senior: {formatDeltaText(metrics.seniorApproval.delta, 0, '', '%')}
                  </span>
                </div>
              }
            />

          </div>

          {/* 5. Annual Policy Budget Outlay Card */}
          <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between gap-3 shadow-md mt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-950/80 text-blue-400 border border-blue-800/60">
                  <Landmark size={18} />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">
                    {language === 'en' ? 'Annual Policy Budget Outlay' : '施行政策の年間財政支出'}
                  </div>
                  <div className="text-xs font-bold text-white">
                    {language === 'en' ? 'Fiscal Commitments & Appropriations' : '国費予算支出額'}
                  </div>
                </div>
              </div>

              {/* Delta Badge for Fiscal Cost */}
              <div className={`px-2.5 py-1 rounded-lg border font-digital font-bold text-xs flex items-center gap-1 ${
                metrics.fiscalCost.delta === 0
                  ? 'bg-slate-800 text-slate-300 border-slate-700'
                  : metrics.fiscalCost.delta > 0
                  ? 'bg-rose-950/80 text-rose-300 border-rose-500/60'
                  : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60'
              }`}>
                {metrics.fiscalCost.delta > 0 ? <ArrowUpRight size={13} /> : metrics.fiscalCost.delta < 0 ? <ArrowDownRight size={13} /> : <Minus size={13} />}
                <span>
                  {Math.abs(metrics.fiscalCost.delta) >= 1000
                    ? `${formatDeltaText(metrics.fiscalCost.delta / 1000, 2, '¥')}T/yr`
                    : `${formatDeltaText(metrics.fiscalCost.delta, 0, '¥')}B/yr`}
                </span>
              </div>
            </div>

            <FiscalMeter
              prevBillion={metrics.fiscalCost.prev}
              nextBillion={metrics.fiscalCost.next}
              deltaBillion={metrics.fiscalCost.delta}
              language={language}
            />
          </div>

        </div>

        {/* Footer with Return to Map Button */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end shrink-0">
          <button
            onClick={handleReturn}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg border transition-all bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white border-indigo-400/50 cursor-pointer ring-2 ring-indigo-400/30"
          >
            <span>
              {language === 'en' ? 'Return to 2.5D Map' : '2.5D景観マップへ戻る'}
            </span>
            <ArrowRight size={14} className="text-indigo-200" />
          </button>
        </div>

      </div>
    </div>
  );
};
