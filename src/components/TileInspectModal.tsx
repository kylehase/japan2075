import React from 'react';
import { Language, RegionalMetricData } from '../types/game';
import { TRANSLATIONS } from '../i18n/translations';
import { X, MapPin, Users, HeartHandshake, Home, TrendingUp, Sparkles, Building2, AlertCircle } from 'lucide-react';
import { soundEngine } from '../canvas/audio';

interface MetricInspectModalProps {
  region: RegionalMetricData | null;
  language: Language;
  onClose: () => void;
}

export const TileInspectModal: React.FC<MetricInspectModalProps> = ({
  region,
  language,
  onClose,
}) => {
  if (!region) return null;
  const t = TRANSLATIONS[language];

  return (
    <div className="absolute right-3 top-16 z-30 w-84 animate-fadeIn select-none font-mono-tech">
      <div className="rounded-2xl shadow-2xl overflow-hidden border border-slate-700 bg-slate-900/95 text-slate-100 backdrop-blur-md flex flex-col">
        {/* Title Bar */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white px-3.5 py-2.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-cyan-400" />
            <h3 className="text-xs font-bold uppercase font-digital text-white truncate">
              {language === 'en' ? 'Prefectural Region Telemetry' : '広域ブロック総合カルテ'}
            </h3>
          </div>
          <button
            onClick={() => { soundEngine.playClick(); onClose(); }}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer transition"
          >
            <X size={14} />
          </button>
        </div>

        {/* Content Body - High Contrast */}
        <div className="p-3.5 bg-slate-950 flex flex-col gap-3 text-xs">
          {/* Region Header Banner */}
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex flex-col">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
              {language === 'en' ? 'MACRO GEOGRAPHIC REGION' : '広域行政ブロック'}
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-base font-bold font-digital text-white">
                {region.name[language]}
              </span>
              <span className="text-sm font-bold font-digital text-emerald-400">
                {region.populationMillions.toFixed(2)}M {language === 'en' ? 'people' : '人'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
              {region.description[language]}
            </p>
          </div>

          {/* Demographic Strata Breakdown */}
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col gap-2">
            <span className="text-[11px] font-bold text-slate-200 uppercase flex items-center gap-1.5">
              <Users size={13} className="text-cyan-400" />
              {language === 'en' ? 'Demographic Strata Breakdown' : '人口3区分構成比'}
            </span>

            {/* Stacked Mini Bar */}
            <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-950 border border-slate-800">
              <div
                className="bg-sky-400 h-full"
                style={{ width: `${region.youthRatio}%` }}
                title={`Youth 0-14: ${region.youthRatio}%`}
              />
              <div
                className="bg-blue-600 h-full"
                style={{ width: `${region.workingRatio}%` }}
                title={`Working 15-64: ${region.workingRatio}%`}
              />
              <div
                className="bg-indigo-500 h-full"
                style={{ width: `${region.elderlyRatio}%` }}
                title={`Elderly 65+: ${region.elderlyRatio}%`}
              />
            </div>

            <div className="grid grid-cols-3 gap-1 text-[10px] text-center pt-1">
              <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                <span className="text-sky-400 block font-bold">{region.youthRatio}%</span>
                <span className="text-slate-400">{language === 'en' ? 'Youth 0-14' : '年少'}</span>
              </div>
              <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                <span className="text-blue-400 block font-bold">{region.workingRatio}%</span>
                <span className="text-slate-400">{language === 'en' ? 'Work 15-64' : '生産'}</span>
              </div>
              <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                <span className="text-indigo-400 block font-bold">{region.elderlyRatio}%</span>
                <span className="text-slate-400">{language === 'en' ? 'Aged 65+' : '高齢'}</span>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* TFR */}
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">{t.tfr}</span>
              <span className={`text-sm font-bold font-digital ${region.tfr >= 1.3 ? 'text-emerald-400' : 'text-amber-300'}`}>
                {region.tfr.toFixed(2)}
              </span>
            </div>

            {/* Youth Hope */}
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">{t.hopeIndex}</span>
              <span className="text-sm font-bold font-digital text-indigo-300">
                {region.hopeIndex.toFixed(1)} / 100
              </span>
            </div>

            {/* Housing Burden */}
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">{language === 'en' ? 'Housing Cost Stress' : '住居費負担度'}</span>
              <span className={`text-sm font-bold font-digital ${region.housingCostBurden > 70 ? 'text-rose-400' : 'text-slate-200'}`}>
                {region.housingCostBurden.toFixed(0)}%
              </span>
            </div>

            {/* Akiya Vacancy */}
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">{language === 'en' ? 'Akiya Vacancy Rate' : '空き家率'}</span>
              <span className={`text-sm font-bold font-digital ${region.akiyaRate > 18 ? 'text-rose-400' : 'text-slate-200'}`}>
                {region.akiyaRate.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Regional Output */}
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">{language === 'en' ? 'Regional GDP Output:' : '地域内総生産 (GDP):'}</span>
            <span className="font-bold font-digital text-white">¥{region.economicOutputTrillion.toFixed(1)}T</span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 border-t border-slate-800 p-2.5 flex justify-end">
          <button
            onClick={() => { soundEngine.playClick(); onClose(); }}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg cursor-pointer transition border border-slate-700"
          >
            {language === 'en' ? 'Dismiss' : '閉じる'}
          </button>
        </div>
      </div>
    </div>
  );
};
