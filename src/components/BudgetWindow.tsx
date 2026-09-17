import React from 'react';
import { NationalEconomy, Language } from '../types/game';
import { TRANSLATIONS } from '../i18n/translations';
import { X, Landmark, TrendingUp, AlertTriangle, ShieldCheck, DollarSign, PieChart } from 'lucide-react';
import { soundEngine } from '../canvas/audio';

interface BudgetWindowProps {
  economy: NationalEconomy;
  currentYear: number;
  language: Language;
  onClose: () => void;
}

export const BudgetWindow: React.FC<BudgetWindowProps> = ({
  economy,
  currentYear,
  language,
  onClose,
}) => {
  const t = TRANSLATIONS[language];

  const ratingColors = {
    AAA: 'text-emerald-300 border-emerald-500/60 bg-emerald-950/80',
    'AA+': 'text-emerald-400 border-emerald-500/60 bg-emerald-950/80',
    AA: 'text-sky-300 border-sky-500/60 bg-sky-950/80',
    A: 'text-amber-300 border-amber-500/60 bg-amber-950/80',
    BBB: 'text-orange-300 border-orange-500/60 bg-orange-950/80',
    JUNK: 'text-rose-400 border-rose-500 bg-rose-950 animate-pulse',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 animate-fadeIn select-none">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-slate-700 bg-slate-900 text-slate-100">
        {/* Title Bar */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">💴</span>
            <h2 className="text-sm font-bold tracking-wide uppercase font-digital text-white">
              {t.budget} — {language === 'en' ? 'Ministry of Finance (MOF) White Paper' : '財務省 国家財政・国債管理白書'}
            </h2>
          </div>
          <button
            onClick={() => { soundEngine.playClick(); onClose(); }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body - High Contrast */}
        <div className="p-4 overflow-y-auto flex flex-col gap-3.5 bg-slate-950 flex-1 font-mono-tech">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Nominal GDP */}
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">{t.gdp}</span>
              <span className="text-lg font-bold font-digital text-white mt-0.5">¥{economy.gdp.toFixed(1)}T</span>
              <span className="text-xs text-emerald-400 font-semibold mt-0.5">
                {economy.gdpGrowthRate >= 0 ? `+${economy.gdpGrowthRate}%` : `${economy.gdpGrowthRate}%`} YoY
              </span>
            </div>

            {/* National Debt */}
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">{language === 'en' ? 'National Debt' : '国債残高'}</span>
              <span className="text-lg font-bold font-digital text-rose-400 mt-0.5">¥{economy.nationalDebt.toFixed(1)}T</span>
              <span className="text-xs text-slate-300 mt-0.5">
                Debt/GDP: <b className={economy.debtToGDP > 300 ? 'text-rose-400' : 'text-amber-300'}>{economy.debtToGDP.toFixed(1)}%</b>
              </span>
            </div>

            {/* 10-Year Bond Yield */}
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">{t.jgbYield}</span>
              <span className={`text-lg font-bold font-digital mt-0.5 ${economy.jgbYield > 3.0 ? 'text-rose-400 animate-pulse' : 'text-amber-300'}`}>
                {economy.jgbYield.toFixed(2)}%
              </span>
              <span className="text-xs text-slate-300 mt-0.5">
                Servicing: ¥{(economy.expenditureDebtServicing / 1000).toFixed(1)}T
              </span>
            </div>

            {/* Credit Rating */}
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">{language === 'en' ? 'Sovereign Rating' : '国債信用格付'}</span>
              <span className={`text-base font-bold font-digital px-2.5 py-0.5 rounded-lg border mt-1 ${ratingColors[economy.creditRating]}`}>
                {economy.creditRating}
              </span>
            </div>
          </div>

          {/* Revenue & Expenditure Breakdown Tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Tax Revenues */}
            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                  <DollarSign size={14} />
                  {language === 'en' ? 'Tax Revenues (Annual)' : '歳入・税収内訳'}
                </span>
                <span className="text-sm font-bold font-digital text-emerald-300">
                  ¥{(economy.totalRevenue / 1000).toFixed(1)}T
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>{language === 'en' ? 'Income Tax:' : '所得税:'}</span>
                  <span className="font-bold text-white">¥{(economy.taxIncome / 1000).toFixed(1)}T</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>{language === 'en' ? 'Corporate Tax:' : '法人税:'}</span>
                  <span className="font-bold text-white">¥{(economy.taxCorporate / 1000).toFixed(1)}T</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>{language === 'en' ? 'Consumption Tax:' : '消費税:'}</span>
                  <span className="font-bold text-white">¥{(economy.taxConsumption / 1000).toFixed(1)}T</span>
                </div>
              </div>
            </div>

            {/* Social Security & Expenditures */}
            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-rose-400 uppercase flex items-center gap-1.5">
                  <PieChart size={14} />
                  {language === 'en' ? 'Annual Expenditures' : '歳出・社会保障内訳'}
                </span>
                <span className="text-sm font-bold font-digital text-rose-300">
                  ¥{(economy.totalExpenditure / 1000).toFixed(1)}T
                </span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>{language === 'en' ? 'Pensions (65+):' : '年金給付費:'}</span>
                  <span className="font-bold text-white">¥{(economy.expenditurePensions / 1000).toFixed(1)}T</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>{language === 'en' ? 'Healthcare & Long-term Care:' : '医療・介護給付費:'}</span>
                  <span className="font-bold text-white">¥{(economy.expenditureHealthcare / 1000).toFixed(1)}T</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>{language === 'en' ? 'Childcare & Family Directives:' : '少子化対策・子ども予算:'}</span>
                  <span className="font-bold text-white">¥{(economy.expenditureChildcare / 1000).toFixed(1)}T</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>{language === 'en' ? 'Debt Interest Servicing:' : '国債利払い費:'}</span>
                  <span className="font-bold text-amber-300">¥{(economy.expenditureDebtServicing / 1000).toFixed(1)}T</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Fiscal Deficit / Surplus Status */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
            economy.annualDeficit > 0
              ? 'bg-rose-950/60 border-rose-600/50 text-rose-200'
              : 'bg-emerald-950/60 border-emerald-600/50 text-emerald-200'
          }`}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className={economy.annualDeficit > 0 ? 'text-rose-400' : 'text-emerald-400'} />
              <div>
                <span className="font-bold block text-sm">
                  {economy.annualDeficit > 0
                    ? (language === 'en' ? 'Annual Fiscal Deficit (New JGB Issuance Required)' : '年間財政赤字（新規国債発行依存）')
                    : (language === 'en' ? 'Primary Balance Surplus Achieved!' : '基礎的財政収支（PB）黒字達成！')}
                </span>
                <span className="text-slate-300 text-xs">
                  {language === 'en'
                    ? 'Social security outlays automatically expand as the population over 75 years old expands.'
                    : '後期高齢者（75歳以上）の増加に伴い、社会保障給付と国債利払いは自動的に増大します。'}
                </span>
              </div>
            </div>
            <span className="text-base font-bold font-digital text-white shrink-0">
              {economy.annualDeficit > 0 ? `-¥${(economy.annualDeficit / 1000).toFixed(1)}T` : `+¥${Math.abs(economy.annualDeficit / 1000).toFixed(1)}T`}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 border-t border-slate-800 p-3.5 flex justify-end">
          <button
            onClick={() => { soundEngine.playClick(); onClose(); }}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer transition shadow-md"
          >
            {language === 'en' ? 'Close Briefing' : '閉じる'}
          </button>
        </div>
      </div>
    </div>
  );
};
