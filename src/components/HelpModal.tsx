import React from 'react';
import { Language } from '../types/game';
import { TRANSLATIONS } from '../i18n/translations';
import { X, BookOpen, Baby, DollarSign, Bot, Users, Layers, Activity } from 'lucide-react';
import { soundEngine } from '../canvas/audio';

interface HelpModalProps {
  language: Language;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  language,
  onClose,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-fadeIn select-none font-mono-tech">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-slate-700 bg-slate-900 text-slate-100">
        {/* Title Bar */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <BookOpen size={18} className="text-amber-300" />
            <h2 className="text-sm font-bold tracking-wide uppercase font-digital text-white">
              {t.instructions} — {language === 'en' ? 'Macro Simulation Directives & Guide' : '総理就任ブリーフィング・攻略指針'}
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
        <div className="p-5 overflow-y-auto flex flex-col gap-4 bg-slate-950 text-xs flex-1">
          {/* Section 1: Objective */}
          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex flex-col gap-1.5">
            <h3 className="text-xs font-bold text-amber-300 font-digital uppercase flex items-center gap-1.5">
              🇯🇵 {language === 'en' ? 'Core Objective (2025 to 2075)' : '国家統治の究極目標（2025年〜2075年）'}
            </h3>
            <p className="text-slate-200 leading-relaxed">
              {language === 'en'
                ? 'Lead Japan across 50 annual terms (2025–2075). Reverse demographic collapse (TFR from 1.20 to >1.60), preserve regional vitality across all 8 prefectural blocks, and maintain fiscal solvency (Debt/GDP < 350%).'
                : '内閣総理大臣として50年間の政権運営を担当します。合計特殊出生率（TFR）を1.20から持続可能な水準へ回復させ、全国8ブロックの活力と財政健全性（債務比率350%超過の回避）を両立してください。'}
            </p>
          </div>

          {/* Section 2: 2.5D Isometric Data Landscape */}
          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex flex-col gap-1.5">
            <h3 className="text-xs font-bold text-cyan-300 font-digital uppercase flex items-center gap-1.5">
              <Activity size={15} className="text-cyan-400" />
              {language === 'en' ? '2.5D Isometric Macro Demographic Landscape' : '2.5D マクロ人口景観の見方'}
            </h3>
            <p className="text-slate-200 leading-relaxed">
              {language === 'en'
                ? 'The 2D isometric canvas visually renders the 8 regional blocks of Japan, where height represents population size. Each column is stratified into 3 tiers: Youth (0-14, Cyan), Working Age (15-64, Blue), and Elderly (65+, Purple). Floating orbs reveal regional sentiment and hope levels.'
                : 'アイソメトリック空間上に日本列島8ブロックを立体配置。柱の高さが人口規模を表し、水色（年少 0-14歳）、青色（生産年齢 15-64歳）、紫色（高齢 65歳以上）の3層構造で人口動態を直感的に把握できます。'}
            </p>
          </div>

          {/* Section 3: Youth Hope Index & Low Fertility Trap */}
          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex flex-col gap-1.5">
            <h3 className="text-xs font-bold text-rose-300 font-digital uppercase flex items-center gap-1.5">
              <Baby size={15} className="text-rose-400" />
              {language === 'en' ? 'Youth Hope Index & Low Fertility Trap' : '若者希望指数と低出生力トラップ'}
            </h3>
            <p className="text-slate-200 leading-relaxed">
              {language === 'en'
                ? 'When the Youth Hope Index falls below 35, the Low Fertility Trap activates, halving the impact of child allowances. When Hope exceeds 75, policy synergy yields a 1.25x booster.'
                : '若者希望指数が35未満になると「低出生力トラップ」が発動し、少子化対策の効率が半減します。75を超えると1.25倍の相乗効果ボーナスを獲得できます。'}
            </p>
          </div>

          {/* Section 4: Silver Democracy Voting */}
          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex flex-col gap-1.5">
            <h3 className="text-xs font-bold text-indigo-300 font-digital uppercase flex items-center gap-1.5">
              <Users size={15} className="text-indigo-400" />
              {language === 'en' ? 'The "Silver Democracy" Constraint' : 'シルバー民主主義の政治力学'}
            </h3>
            <p className="text-slate-200 leading-relaxed">
              {language === 'en'
                ? 'Seniors aged 65+ turn out to vote at 80%, while youth vote at 35%. Balancing senior healthcare reform with cabinet approval is essential to prevent a vote of no confidence.'
                : '高齢層の投票率は80%に達し議席を左右します。高齢者医療費自己負担の適正化と内閣支持率（20%割れで退陣）のバランスを慎重に保ってください。'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-4 flex justify-end border-t border-slate-800">
          <button
            onClick={() => { soundEngine.playClick(); onClose(); }}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer transition shadow-md"
          >
            {language === 'en' ? 'Understood, Prime Minister' : '了解、施政を開始する'}
          </button>
        </div>
      </div>
    </div>
  );
};
