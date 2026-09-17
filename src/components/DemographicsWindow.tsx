import React from 'react';
import { NationalDemographics, Language } from '../types/game';
import { TRANSLATIONS } from '../i18n/translations';
import { X, Users, HeartHandshake, Baby, Activity, Info, Sparkles, Flame } from 'lucide-react';
import { soundEngine } from '../canvas/audio';

interface DemographicsWindowProps {
  demographics: NationalDemographics;
  currentYear: number;
  language: Language;
  onClose: () => void;
}

export const DemographicsWindow: React.FC<DemographicsWindowProps> = ({
  demographics,
  currentYear,
  language,
  onClose,
}) => {
  const t = TRANSLATIONS[language];
  const cohorts = demographics.cohorts;

  // Find max cohort size for proportional scaling
  let maxCohortSize = 1000;
  for (const c of cohorts) {
    if (c.male > maxCohortSize) maxCohortSize = c.male;
    if (c.female > maxCohortSize) maxCohortSize = c.female;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 animate-fadeIn">
      <div className="retro-panel w-full max-w-4xl max-h-[90vh] flex flex-col rounded-xl shadow-2xl overflow-hidden border border-slate-800 bg-slate-900/95 text-slate-100">
        {/* Title Bar */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 select-none">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📊</span>
            <div>
              <h2 className="text-sm font-bold tracking-wide uppercase font-digital text-emerald-300">
                {t.demographics} — {language === 'en' ? 'IPSS Demographic Model' : '国立社会保障・人口問題研究所 推計モデル'}
              </h2>
              <span className="text-[11px] text-slate-400 font-mono-tech">
                {language === 'en' ? `Simulation Year: ${currentYear}` : `シミュレーション基準年：${currentYear}年`}
              </span>
            </div>
          </div>
          <button
            onClick={() => { soundEngine.playClick(); onClose(); }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex flex-col lg:flex-row gap-4 bg-slate-950/70 flex-1">
          {/* Left Column: Population Pyramid */}
          <div className="flex-1 p-4 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col shadow-inner">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5 font-digital">
                <Users size={15} className="text-emerald-400" />
                {language === 'en' ? 'Discrete 5-Year Age Pyramid (Thousands)' : '年齢各歳別人口ピラミッド（千人）'}
              </h3>
              <div className="flex items-center gap-3 text-[11px] font-mono-tech">
                <span className="text-sky-400 font-bold">♂ {language === 'en' ? 'Male' : '男性'}</span>
                <span className="text-pink-400 font-bold">♀ {language === 'en' ? 'Female' : '女性'}</span>
              </div>
            </div>

            {/* Pyramid Chart Rows */}
            <div className="flex flex-col gap-1.5 my-auto">
              {[...cohorts].reverse().map((c) => {
                const isElderly = c.minAge >= 65;
                const isYouth = c.maxAge <= 14;
                const malePct = (c.male / maxCohortSize) * 100;
                const femalePct = (c.female / maxCohortSize) * 100;

                const maleColor = isElderly ? 'bg-indigo-500' : isYouth ? 'bg-sky-400' : 'bg-blue-600';
                const femaleColor = isElderly ? 'bg-purple-500' : isYouth ? 'bg-rose-400' : 'bg-pink-600';

                return (
                  <div key={c.ageLabel} className="flex items-center text-[10px] font-mono-tech gap-1.5">
                    {/* Male Bar (aligned right) */}
                    <div className="w-14 text-right text-slate-400 font-semibold truncate">
                      {Math.round(c.male).toLocaleString()}k
                    </div>
                    <div className="flex-1 flex justify-end h-3 bg-slate-950 rounded-l overflow-hidden border-y border-l border-slate-800">
                      <div
                        className={`${maleColor} h-full transition-all duration-300 shadow-sm`}
                        style={{ width: `${malePct}%` }}
                      />
                    </div>

                    {/* Age Cohort Label */}
                    <div className="w-12 text-center text-slate-200 font-bold bg-slate-800 py-0.5 rounded text-[9px] shrink-0 border border-slate-700">
                      {c.ageLabel}
                    </div>

                    {/* Female Bar (aligned left) */}
                    <div className="flex-1 flex justify-start h-3 bg-slate-950 rounded-r overflow-hidden border-y border-r border-slate-800">
                      <div
                        className={`${femaleColor} h-full transition-all duration-300 shadow-sm`}
                        style={{ width: `${femalePct}%` }}
                      />
                    </div>
                    <div className="w-14 text-left text-slate-400 font-semibold truncate">
                      {Math.round(c.female).toLocaleString()}k
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pyramid Legend */}
            <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-around text-[10px] text-slate-400 font-mono-tech">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-sky-400 rounded-sm inline-block" /> {language === 'en' ? 'Youth (0–14)' : '年少人口'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-blue-600 rounded-sm inline-block" /> {language === 'en' ? 'Working (15–64)' : '生産年齢'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-sm inline-block" /> {language === 'en' ? 'Elderly (65+)' : '高齢人口'}
              </span>
            </div>
          </div>

          {/* Right Column: Youth Hope Index & Key Demographic Indicators */}
          <div className="w-full lg:w-80 flex flex-col gap-3">
            {/* Youth Hope Index Card */}
            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-200 uppercase font-digital flex items-center gap-1.5">
                  <HeartHandshake size={15} className="text-rose-400" />
                  {t.hopeIndex}
                </h3>
                <span className={`text-xs font-bold font-digital px-2 py-0.5 rounded ${
                  demographics.youthHopeIndex >= 70 ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                  demographics.youthHopeIndex >= 40 ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                  'bg-rose-950 text-rose-300 border border-rose-500/40'
                }`}>
                  {demographics.youthHopeIndex.toFixed(1)} / 100
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800 mb-2">
                <div
                  className={`h-full transition-all duration-500 ${
                    demographics.youthHopeIndex >= 70 ? 'bg-emerald-500' :
                    demographics.youthHopeIndex >= 40 ? 'bg-amber-500' :
                    'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, demographics.youthHopeIndex))}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 font-mono-tech leading-relaxed">
                {language === 'en'
                  ? 'Determines young couples’ willingness to marry and have children. Impacted by childcare availability, Tokyo housing costs, and paternity leave.'
                  : '若年層の結婚・出産への前向き度合。保育環境、住宅費負担、労働環境改善により上昇。'}
              </p>
            </div>

            {/* Demographic Status Pills */}
            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col gap-2 font-mono-tech text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{t.tfr}</span>
                <span className="font-bold text-white font-digital text-sm">{demographics.tfr.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{language === 'en' ? 'Old-Age Dependency Ratio' : '高齢化率 (65歳以上)'}</span>
                <span className="font-bold text-indigo-300 font-digital text-sm">{demographics.elderlyRatio.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{language === 'en' ? 'Youth Ratio (0–14)' : '年少人口比率'}</span>
                <span className="font-bold text-sky-300 font-digital text-sm">{demographics.youthRatio.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{language === 'en' ? 'Net Annual Change' : '年間自然増減'}</span>
                <span className={`font-bold font-digital text-sm ${demographics.naturalChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {demographics.naturalChange > 0 ? `+${Math.round(demographics.naturalChange/1000)}k` : `${Math.round(demographics.naturalChange/1000)}k`} /yr
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                <span className="text-slate-400">{language === 'en' ? 'Births / Deaths (CDR)' : '出生数 / 死亡数 (死亡率)'}</span>
                <span className="font-bold text-slate-200 font-digital text-xs flex items-center gap-1">
                  <span className="text-cyan-400">{(demographics.birthsThisYear / 1000).toFixed(0)}k</span>
                  <span className="text-slate-500">/</span>
                  <span className="text-rose-400">{((demographics.deathsThisYear < 10000 ? demographics.deathsThisYear * 1000 : demographics.deathsThisYear) / 1000).toFixed(0)}k</span>
                  <span className="text-[10px] text-slate-400 ml-1 font-mono-tech">
                    ({(((demographics.deathsThisYear < 10000 ? demographics.deathsThisYear * 1000 : demographics.deathsThisYear) / Math.max(1, demographics.totalPopulation)) * 1000).toFixed(1)}‰)
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-900/90 p-3 flex justify-between items-center border-t border-slate-800">
          <div className="text-[11px] text-slate-400 font-mono-tech flex items-center gap-1.5">
            <Info size={14} className="text-emerald-400" />
            <span>{language === 'en' ? 'Discrete 5-year cohort-component demographic engine.' : '0歳〜90歳以上の5歳刻みコホート要因法シミュレータ。'}</span>
          </div>
          <button
            onClick={() => { soundEngine.playClick(); onClose(); }}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer transition shadow-md"
          >
            {language === 'en' ? 'Close' : '閉じる'}
          </button>
        </div>
      </div>
    </div>
  );
};
