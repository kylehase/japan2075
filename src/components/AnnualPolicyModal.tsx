import React, { useState } from 'react';
import {
  GameState,
  OrdinanceCategory,
  Language,
  Ordinance,
} from '../types/game';
import {
  FileText,
  Baby,
  Briefcase,
  Globe2,
  Cpu,
  Landmark,
  CheckCircle2,
  Circle,
  ArrowRight,
  Gavel,
  Trash2,
  AlertTriangle,
  Sparkles,
  MinusCircle,
  ScrollText,
  Layers,
  RefreshCw,
  Search,
  X,
  Check,
  TrendingUp,
} from 'lucide-react';
import { soundEngine } from '../canvas/audio';

interface AnnualPolicyModalProps {
  gameState: GameState;
  language: Language;
  onEnactPolicies: (enactedIds: string[], repealedIds: string[], categoryDecisions?: Record<string, string>) => void;
  onClose?: () => void;
}

const CATEGORIES: OrdinanceCategory[] = [
  'family',
  'labor',
  'immigration',
  'technology',
  'fiscal',
];

const CATEGORY_ICONS: Record<OrdinanceCategory, React.ComponentType<{ size?: number; className?: string }>> = {
  family: Baby,
  labor: Briefcase,
  immigration: Globe2,
  technology: Cpu,
  automation: Cpu,
  fiscal: Landmark,
};

const getCategoryLabel = (cat: OrdinanceCategory, lang: Language): string => {
  const fallbackEn: Record<OrdinanceCategory, string> = {
    family: 'Childcare & Family',
    labor: 'Labor & Gender Reform',
    immigration: 'Immigration & Visas',
    technology: 'AI & Technology DX',
    automation: 'AI & Technology DX',
    fiscal: 'Fiscal & Taxation',
  };
  const fallbackJa: Record<OrdinanceCategory, string> = {
    family: '少子化・家族支援',
    labor: '労働・働き方改革',
    immigration: '移民・外国人労働者',
    technology: 'AI・技術革新・DX',
    automation: 'AI・技術革新・DX',
    fiscal: '財政・税制・年金',
  };
  return lang === 'en' ? fallbackEn[cat] || cat : fallbackJa[cat] || cat;
};

type ActiveView = OrdinanceCategory | 'active_laws';

export const AnnualPolicyModal: React.FC<AnnualPolicyModalProps> = ({
  gameState,
  language,
  onEnactPolicies,
}) => {
  const { cabinetTerm, currentYear, ordinances } = gameState;
  
  const [activeTab, setActiveTab] = useState<ActiveView>('family');

  // Maintain the active proposed ordinances per category (starting with agenda, with cycling and alternative additions)
  const [categoryProposals, setCategoryProposals] = useState<Record<OrdinanceCategory, string[]>>(() => {
    const initial: Record<OrdinanceCategory, string[]> = {
      family: [],
      labor: [],
      immigration: [],
      technology: [],
      automation: [],
      fiscal: [],
    };
    CATEGORIES.forEach((cat) => {
      const fromAgenda = gameState.availableOrdinanceIds.filter(id => {
        const o = ordinances.find(ord => ord.id === id);
        return o && o.category === cat && !o.active;
      });
      if (fromAgenda.length > 0) {
        initial[cat] = fromAgenda;
      } else {
        initial[cat] = ordinances
          .filter(o => o.category === cat && !o.active)
          .slice(0, 3)
          .map(o => o.id);
      }
    });
    return initial;
  });

  const [selectedOrds, setSelectedOrds] = useState<Record<OrdinanceCategory, string>>({
    family: '',
    labor: '',
    immigration: '',
    technology: '',
    automation: '',
    fiscal: '',
  });

  const [selectedToRepeal, setSelectedToRepeal] = useState<Set<string>>(new Set());

  // State for the "Alternative Bills" modal
  const [alternativeModalCategory, setAlternativeModalCategory] = useState<OrdinanceCategory | null>(null);
  const [alternativeSearch, setAlternativeSearch] = useState<string>('');
  const [alternativeFilter, setAlternativeFilter] = useState<'all' | 'tfr' | 'fiscal' | 'hope' | 'prod'>('all');

  const handleSelectOption = (cat: OrdinanceCategory, id: string) => {
    soundEngine.playClick();
    setSelectedOrds((prev) => {
      const next = { ...prev };
      next[cat] = id;
      return next;
    });
    
    // Auto-advance
    const currentIndex = CATEGORIES.indexOf(cat);
    if (currentIndex < CATEGORIES.length - 1) {
      setActiveTab(CATEGORIES[currentIndex + 1]);
    }
  };

  // Cycle to next batch of ordinances for a category
  const handleCycleCategoryProposals = (cat: OrdinanceCategory) => {
    soundEngine.playClick();
    const allInactive = ordinances.filter(o => o.category === cat && !o.active);
    if (allInactive.length <= 3) return;

    setCategoryProposals(prev => {
      const currentList = prev[cat] || [];
      const firstIdx = allInactive.findIndex(o => currentList.includes(o.id));
      const nextStart = firstIdx === -1 ? 0 : (firstIdx + 3) % allInactive.length;
      
      const newItems: string[] = [];
      for (let i = 0; i < Math.min(3, allInactive.length); i++) {
        const item = allInactive[(nextStart + i) % allInactive.length];
        if (item) newItems.push(item.id);
      }
      
      // Preserve current selection if not already in list
      const currentSelected = selectedOrds[cat];
      if (currentSelected && !currentSelected.startsWith('status_quo_') && !newItems.includes(currentSelected)) {
        newItems.unshift(currentSelected);
      }

      return {
        ...prev,
        [cat]: Array.from(new Set(newItems)),
      };
    });
  };

  // Choose a bill from the alternative bills repository
  const handleSelectAlternativeBill = (cat: OrdinanceCategory, ordId: string) => {
    soundEngine.playClick();
    setSelectedOrds(prev => ({
      ...prev,
      [cat]: ordId,
    }));
    // Make sure it is pinned in categoryProposals so it stays clearly visible
    setCategoryProposals(prev => {
      const existing = prev[cat] || [];
      if (existing.includes(ordId)) return prev;
      return {
        ...prev,
        [cat]: [ordId, ...existing],
      };
    });
    setAlternativeModalCategory(null);
  };

  const handleToggleRepeal = (id: string) => {
    soundEngine.playClick();
    const next = new Set(selectedToRepeal);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedToRepeal(next);
  };

  const proposedOrdinances = ordinances.filter(o => gameState.availableOrdinanceIds.includes(o.id));

  const pendingCategories = CATEGORIES.filter((cat) => {
    const hasProposals = (categoryProposals[cat] && categoryProposals[cat].length > 0) ||
      ordinances.some(o => o.category === cat && !o.active);
    if (!hasProposals) return false;
    return selectedOrds[cat] === '';
  });

  const allCategoriesSelected = pendingCategories.length === 0;

  const handleConfirmAgenda = () => {
    if (!allCategoriesSelected) return;
    soundEngine.playOrdinance();
    
    // Convert selected map to list of enacted IDs (ignoring null choices)
    const enactedIds: string[] = [];
    (Object.values(selectedOrds) as string[]).forEach((id: string) => {
      if (id && !id.startsWith('status_quo_')) {
        enactedIds.push(id);
      }
    });

    onEnactPolicies(enactedIds, Array.from(selectedToRepeal), selectedOrds);
  };

  const activeOrdinances = ordinances.filter(o => o.active);

  // Compute impacts
  const enactedObjs = ordinances.filter(o => Object.values(selectedOrds).includes(o.id));
  const repealedObjs = ordinances.filter(o => selectedToRepeal.has(o.id));

  const totalCostBillion = 
    enactedObjs.reduce((acc, o) => acc + o.annualCostBillion, 0) - 
    repealedObjs.reduce((acc, o) => acc + o.annualCostBillion, 0);

  const totalTFRGain = 
    enactedObjs.reduce((acc, o) => acc + o.tfrDelta, 0) - 
    repealedObjs.reduce((acc, o) => acc + o.tfrDelta, 0);

  const totalHopeGain = 
    enactedObjs.reduce((acc, o) => acc + o.hopeIndexDelta, 0) - 
    repealedObjs.reduce((acc, o) => acc + o.hopeIndexDelta, 0) + 
    repealedObjs.reduce((acc, o) => acc + (o.expirationShock?.hopeDelta || 0), 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn select-none font-mono-tech">
      <div className="w-full max-w-4xl h-[92vh] max-h-[860px] min-h-[660px] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-slate-700 bg-slate-900 text-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/30 rounded-lg border border-indigo-400/50 shadow-sm">
              <Gavel size={22} className="text-amber-300" />
            </div>
            <div>
              <div className="text-[11px] text-amber-300 uppercase tracking-widest font-mono-tech flex items-center gap-2">
                <span>{language === 'en' ? 'NATIONAL DIET SESSION' : '国会・立法セッション'}</span>
              </div>
              <h2 className="text-base font-bold font-digital text-white flex items-center gap-2">
                <span>{language === 'en' ? `Legislative Agenda ${currentYear}` : `令和${currentYear - 2018}年度 立法協議`}</span>
                <span className="text-slate-500 font-mono-tech text-xs ml-2">
                  (Term {cabinetTerm})
                </span>
              </h2>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden flex-col sm:flex-row">
          
          {/* Left Sidebar - Tabs */}
          <div className="w-full sm:w-56 bg-slate-950/50 border-b sm:border-b-0 sm:border-r border-slate-800 flex sm:flex-col overflow-x-auto sm:overflow-y-auto shrink-0 custom-scrollbar">
            
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest px-4 pt-4 pb-2 hidden sm:block">
              {language === 'en' ? 'Propose New Bills' : '新規法案提出'}
            </div>

            {CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat];
              const isSelected = activeTab === cat;
              const hasChoice = selectedOrds[cat] !== '';
              
              return (
                <button
                  key={cat}
                  onClick={() => { soundEngine.playClick(); setActiveTab(cat); }}
                  className={`flex-1 sm:flex-none p-3 sm:p-4 text-left transition-colors border-b-2 sm:border-b border-slate-800/50 flex items-center gap-3 min-w-[120px] sm:min-w-0 ${
                    isSelected 
                      ? 'bg-indigo-900/40 border-b-indigo-400 sm:border-b-slate-800/50 sm:border-l-2 sm:border-l-indigo-400' 
                      : 'hover:bg-slate-800/50 border-b-transparent sm:border-l-2 sm:border-l-transparent'
                  }`}
                >
                  <Icon size={18} className={isSelected ? 'text-indigo-400' : 'text-slate-500'} />
                  <div className="flex-1 hidden sm:block">
                    <span className={`font-bold text-sm block leading-tight ${isSelected ? 'text-indigo-300' : 'text-slate-400'}`}>
                      {getCategoryLabel(cat, language)}
                    </span>
                  </div>
                  {hasChoice && (
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                  )}
                </button>
              );
            })}

            <div className="w-px h-8 bg-slate-800 mx-2 sm:hidden self-center shrink-0"></div>

            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest px-4 pt-4 pb-2 hidden sm:block mt-2 border-t border-slate-800/50">
              {language === 'en' ? 'Manage Laws' : '法律管理'}
            </div>
            <button
              onClick={() => { soundEngine.playClick(); setActiveTab('active_laws'); }}
              className={`flex-1 sm:flex-none p-3 sm:p-4 text-left transition-colors border-b-2 sm:border-b border-slate-800/50 flex items-center gap-3 min-w-[140px] sm:min-w-0 ${
                activeTab === 'active_laws' 
                  ? 'bg-amber-900/20 border-b-amber-500 sm:border-b-slate-800/50 sm:border-l-2 sm:border-l-amber-500' 
                  : 'hover:bg-slate-800/50 border-b-transparent sm:border-l-2 sm:border-l-transparent'
              }`}
            >
              <ScrollText size={18} className={activeTab === 'active_laws' ? 'text-amber-400' : 'text-slate-500'} />
              <div className="flex-1 hidden sm:block">
                <span className={`font-bold text-sm block leading-tight ${activeTab === 'active_laws' ? 'text-amber-400' : 'text-slate-400'}`}>
                  {language === 'en' ? 'Active Laws' : '施行中の法律'}
                </span>
                <span className="text-xs text-slate-500 hidden sm:block font-normal mt-0.5">
                  {language === 'en' ? 'Manage or repeal' : '管理・廃止'}
                </span>
              </div>
            </button>
          </div>

          {/* Right Scrollable Area */}
          <div className="flex-1 bg-slate-900 overflow-y-auto p-4 sm:p-6 custom-scrollbar relative flex flex-col">
            
            {CATEGORIES.includes(activeTab as OrdinanceCategory) && (
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {React.createElement(CATEGORY_ICONS[activeTab as OrdinanceCategory], { size: 20, className: "text-indigo-400" })}
                    {getCategoryLabel(activeTab as OrdinanceCategory, language)}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {language === 'en' 
                      ? 'Select one new policy to propose for this sector, or choose not to introduce new legislation.'
                      : 'この分野で新たに提出する法案を1つ選ぶか、新規立法を見送ります。'}
                  </p>
                </div>
                
                <div className="space-y-4 flex-1">
                  {(() => {
                    const currentCat = activeTab as OrdinanceCategory;
                    const proposalIds = categoryProposals[currentCat] || [];
                    const renderedOrds = proposalIds
                      .map(id => ordinances.find(o => o.id === id))
                      .filter((o): o is Ordinance => !!o && !o.active);

                    if (renderedOrds.length === 0) {
                      return (
                        <div className="text-center p-8 text-slate-500 border border-slate-800 border-dashed rounded-xl">
                          <p>{language === 'en' ? 'No pending proposals currently displayed in this category.' : '現在この分野に提示されている法案はありません。'}</p>
                          <button
                            onClick={() => setAlternativeModalCategory(currentCat)}
                            className="mt-3 px-4 py-2 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 text-xs rounded-xl border border-indigo-700 font-bold inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Layers size={14} />
                            {language === 'en' ? 'Browse All Alternative Bills' : 'すべての代替法案を見る'}
                          </button>
                        </div>
                      );
                    }

                    return renderedOrds.map((ord) => {
                      const isSelected = selectedOrds[currentCat] === ord.id;
                      const isOriginalAgenda = gameState.availableOrdinanceIds.includes(ord.id);

                      return (
                        <div 
                          key={ord.id}
                          onClick={() => handleSelectOption(currentCat, ord.id)}
                          className={`relative group p-4 sm:p-5 rounded-xl border cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-indigo-900/30 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)] ring-1 ring-indigo-400/50' 
                              : 'bg-slate-800/50 border-slate-700/80 hover:bg-slate-800 hover:border-slate-500'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h4 className={`font-bold text-base ${isSelected ? 'text-indigo-300' : 'text-slate-200 group-hover:text-white'}`}>
                                  {language === 'en' ? ord.name.en : ord.name.ja}
                                </h4>
                                {!isOriginalAgenda && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 flex items-center gap-1">
                                    <Layers size={10} />
                                    {language === 'en' ? 'Alternative Bill' : '代替法案'}
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                                {language === 'en' ? ord.description.en : ord.description.ja}
                              </p>

                              <div className="flex flex-wrap gap-2 text-[10px] font-mono-tech font-bold uppercase">
                                <span className={`px-2 py-1 rounded border ${
                                  ord.annualCostBillion > 0 
                                    ? 'bg-red-950/30 text-red-300 border-red-900/50' 
                                    : 'bg-emerald-950/30 text-emerald-300 border-emerald-900/50'
                                }`}>
                                  EST. {ord.annualCostBillion > 0 ? '-' : '+'}{Math.abs(ord.annualCostBillion)}B ¥/YR
                                </span>
                                
                                {ord.tfrDelta !== 0 && (
                                  <span className={`px-2 py-1 rounded border ${
                                    ord.tfrDelta > 0 
                                      ? 'bg-emerald-950/30 text-emerald-300 border-emerald-900/50' 
                                      : 'bg-red-950/30 text-red-300 border-red-900/50'
                                  }`}>
                                    EST. TFR {ord.tfrDelta > 0 ? '+' : ''}{ord.tfrDelta}
                                  </span>
                                )}
                                
                                {ord.hopeIndexDelta !== 0 && (
                                  <span className={`px-2 py-1 rounded border flex items-center gap-1 ${
                                    ord.hopeIndexDelta > 0 
                                      ? 'bg-amber-950/30 text-amber-300 border-amber-900/50' 
                                      : 'bg-indigo-950/30 text-indigo-300 border-indigo-900/50'
                                  }`}>
                                    <Sparkles size={10} /> EST. HOPE {ord.hopeIndexDelta > 0 ? '+' : ''}{ord.hopeIndexDelta}
                                  </span>
                                )}

                                {ord.productivityDelta !== 0 && (
                                  <span className={`px-2 py-1 rounded border flex items-center gap-1 ${
                                    ord.productivityDelta > 0 
                                      ? 'bg-blue-950/30 text-blue-300 border-blue-900/50' 
                                      : 'bg-slate-800 text-slate-400 border-slate-700'
                                  }`}>
                                    <TrendingUp size={10} /> EST. PROD {ord.productivityDelta > 0 ? '+' : ''}{Math.round(ord.productivityDelta * 100)}%
                                  </span>
                                )}
                              </div>
                              
                              {ord.replaces && ord.replaces.length > 0 && (
                                <div className="mt-3 text-[10px] text-amber-500/80 flex items-center gap-1">
                                  <AlertTriangle size={12} />
                                  {language === 'en' ? 'Conflicting law warning: Enacting this supersedes related policies.' : '競合警告：これを可決すると関連する既存法律は廃止されます。'}
                                </div>
                              )}
                            </div>
                            
                            <div className="shrink-0 mt-1">
                              {isSelected ? (
                                <CheckCircle2 size={24} className="text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                              ) : (
                                <Circle size={24} className="text-slate-600 group-hover:text-slate-400" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* Actions Bar: Cycle Proposals + Status Quo */}
                {(() => {
                  const currentCat = activeTab as OrdinanceCategory;
                  const statusQuoId = `status_quo_${currentCat}`;
                  const isStatusQuoSelected = selectedOrds[currentCat] === statusQuoId;
                  const inactiveInCat = ordinances.filter(o => o.category === currentCat && !o.active);

                  return (
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-6 pb-2 mt-auto">
                      {/* Cycle Proposals Button (placed immediately to the left of Do Not Introduce...) */}
                      {inactiveInCat.length > 3 && (
                        <button
                          id={`btn-cycle-proposals-${currentCat}`}
                          onClick={() => handleCycleCategoryProposals(currentCat)}
                          title={language === 'en' ? 'Cycle next 3 proposals' : '次の3つの法案に入れ替える'}
                          className="px-3.5 py-2.5 rounded-xl text-xs font-mono-tech font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white active:scale-95"
                        >
                          <RefreshCw size={14} className="text-slate-400" />
                          <span>
                            {language === 'en' ? 'Cycle' : '法案入替'}
                          </span>
                        </button>
                      )}

                      {/* Status Quo / Do Not Introduce New Policy Button */}
                      <button
                        id={`btn-status-quo-${currentCat}`}
                        onClick={() => handleSelectOption(currentCat, statusQuoId)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-mono-tech font-bold transition-all flex items-center gap-2 cursor-pointer border shadow-sm ${
                          isStatusQuoSelected
                            ? 'bg-slate-700 text-white border-slate-400 shadow-md ring-1 ring-slate-400'
                            : 'bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700/80'
                        }`}
                      >
                        {isStatusQuoSelected ? (
                          <CheckCircle2 size={15} className="text-white shrink-0" />
                        ) : (
                          <MinusCircle size={15} className="text-slate-400 shrink-0" />
                        )}
                        <span>
                          {language === 'en'
                            ? isStatusQuoSelected
                              ? 'No Policy Selected'
                              : 'Do Not Introduce New Policy in this Category'
                            : isStatusQuoSelected
                            ? '新規施策なし 選択中'
                            : 'この分野での新規施策を見送る'}
                        </span>
                      </button>
                    </div>
                  );
                })()}

              </div>
            )}

            {activeTab === 'active_laws' && (
              <div className="space-y-4">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <ScrollText size={20} className="text-amber-400" />
                    {language === 'en' ? 'Currently Active Laws' : '施行中の法律'}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {language === 'en' 
                      ? 'Review all stacked active laws. You may explicitly repeal any law here.'
                      : '施行中のすべての法律を確認します。ここで任意の法律を廃止することができます。'}
                  </p>
                </div>
                
                {activeOrdinances.length === 0 && (
                  <div className="text-center p-8 text-slate-500 border border-slate-800 border-dashed rounded-xl">
                    {language === 'en' ? 'No laws are currently active.' : '現在施行中の法律はありません。'}
                  </div>
                )}
                
                {activeOrdinances.map((ord) => {
                  const isRepealed = selectedToRepeal.has(ord.id);
                  return (
                    <div 
                      key={ord.id}
                      className={`relative p-4 sm:p-5 rounded-xl border transition-all ${
                        isRepealed 
                          ? 'bg-red-950/20 border-red-900/50 opacity-60' 
                          : 'bg-slate-800 border-slate-700 shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-bold text-base ${isRepealed ? 'text-slate-500 line-through' : 'text-white'}`}>
                              {language === 'en' ? ord.name.en : ord.name.ja}
                            </h4>
                            {!isRepealed && (
                              <span className="bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 px-2 py-0.5 rounded text-[10px] font-bold">
                                {language === 'en' ? 'ACTIVE' : '施行中'}
                              </span>
                            )}
                          </div>
                          <p className={`text-xs leading-relaxed mb-3 ${isRepealed ? 'text-slate-600' : 'text-slate-400'}`}>
                            {language === 'en' ? ord.description.en : ord.description.ja}
                          </p>
                          
                          {isRepealed && ord.expirationShock && (
                            <div className="mt-2 text-[11px] text-red-400 bg-red-950/30 px-3 py-1.5 rounded border border-red-900/30 flex items-center gap-2">
                              <AlertTriangle size={14} />
                              {language === 'en' ? 'Repeal Shock: ' : '廃止ショック：'}
                              {ord.expirationShock.approvalDelta ? `${ord.expirationShock.approvalDelta}% Approval ` : ''}
                            </div>
                          )}
                        </div>
                        
                        <div className="shrink-0 mt-1">
                          <button
                            onClick={() => handleToggleRepeal(ord.id)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 border transition-all ${
                              isRepealed 
                                ? 'bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700' 
                                : 'bg-red-950/40 text-red-400 border-red-900/50 hover:bg-red-900/40 hover:text-red-300'
                            }`}
                          >
                            {isRepealed ? (
                              <>
                                {language === 'en' ? 'Cancel Repeal' : '廃止を撤回'}
                              </>
                            ) : (
                              <>
                                <Trash2 size={12} />
                                {language === 'en' ? 'Repeal Law' : '法案を廃止'}
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Summary & Enactment Bar */}
        <div className="bg-slate-950 border-t border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-tech shrink-0">
          
          <div className="flex flex-wrap items-center gap-6 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase mb-1">
                {language === 'en' ? 'Est. Net Fiscal Impact' : '予想純財政影響'}
              </span>
              <span className={`text-sm font-bold font-digital ${totalCostBillion > 0 ? 'text-amber-300' : 'text-emerald-300'}`}>
                {totalCostBillion > 0 ? '+' : ''}{totalCostBillion}B
              </span>
            </div>
            
            <div className="h-8 w-px bg-slate-800 hidden sm:block"></div>
            
            <div>
              <span className="text-[10px] text-slate-400 block uppercase mb-1">
                {language === 'en' ? 'Est. TFR Impact' : '予想出生率影響'}
              </span>
              <span className={`text-sm font-bold font-digital ${totalTFRGain > 0 ? 'text-emerald-300' : totalTFRGain < 0 ? 'text-amber-300' : 'text-slate-300'}`}>
                {totalTFRGain > 0 ? '+' : ''}{totalTFRGain.toFixed(2)}
              </span>
            </div>

            <div className="h-8 w-px bg-slate-800 hidden sm:block"></div>
            
            <div>
              <span className="text-[10px] text-slate-400 block uppercase mb-1">
                {language === 'en' ? 'Est. Hope Impact' : '予想希望指数影響'}
              </span>
              <span className={`text-sm font-bold font-digital ${totalHopeGain > 0 ? 'text-emerald-300' : totalHopeGain < 0 ? 'text-amber-300' : 'text-slate-300'}`}>
                {totalHopeGain > 0 ? '+' : ''}{totalHopeGain}
              </span>
            </div>
          </div>

          <div className="relative group flex items-center justify-end w-full sm:w-auto">
            {/* Tooltip on hover when session conclusion is disabled */}
            {!allCategoriesSelected && (
              <div 
                role="tooltip"
                className="absolute bottom-full mb-3 right-0 sm:right-0 w-72 sm:w-84 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30 shadow-2xl"
              >
                <div className="bg-slate-950/95 backdrop-blur-md border border-amber-500/40 text-slate-200 rounded-xl p-3.5 text-xs shadow-2xl relative">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1.5 flex-1">
                      <p className="font-semibold text-amber-300">
                        {language === 'en'
                          ? 'Action Required to Conclude'
                          : '各分野の審議決定が必要です'}
                      </p>
                      <p className="text-slate-300 leading-relaxed">
                        {language === 'en'
                          ? 'Please select a reform bill or choose "Do Not Introduce New Policy" in every category before concluding the legislative session.'
                          : '国会を閉会するには、各分野で法案を1つ選択するか「この分野での新規施策を見送る」を指定してください。'}
                      </p>
                      {pendingCategories.length > 0 && (
                        <div className="pt-2 mt-1 border-t border-slate-800/90">
                          <span className="text-[10px] text-slate-400 block mb-1.5 uppercase tracking-wider font-semibold">
                            {language === 'en' ? 'Pending Categories:' : '未決定の分野:'}
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {pendingCategories.map((cat) => (
                              <span
                                key={cat}
                                className="px-2 py-0.5 rounded text-[10px] bg-amber-950/70 border border-amber-500/40 text-amber-200 font-sans"
                              >
                                {getCategoryLabel(cat, language)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Tooltip caret arrow pointing down to button */}
                  <div className="absolute top-full right-8 -mt-[1px] w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-950" />
                </div>
              </div>
            )}

            <button
              onClick={handleConfirmAgenda}
              disabled={!allCategoriesSelected}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2.5 shadow-lg border transition-all ${
                allCategoriesSelected
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white border-indigo-400/50 cursor-pointer ring-2 ring-indigo-400/30'
                  : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed disabled:pointer-events-none'
              }`}
            >
              <span>
                {language === 'en'
                  ? `Conclude Legislative Session`
                  : `国会閉会・法案一括採決`}
              </span>
              <ArrowRight size={14} className={allCategoriesSelected ? 'text-indigo-200' : 'text-slate-600'} />
            </button>
          </div>
        </div>
      </div>

      {/* Alternative Bills Repository Modal Overlay */}
      {alternativeModalCategory && (
        <div 
          id="alternative-bills-modal"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setAlternativeModalCategory(null)}
        >
          <div 
            className="bg-slate-900 border border-indigo-500/30 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-400">
                  {React.createElement(CATEGORY_ICONS[alternativeModalCategory], { size: 22 })}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono-tech uppercase font-bold text-indigo-400 tracking-wider">
                      {language === 'en' ? 'Alternative Legislative Repository' : '代替法案アーカイブ'}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800">
                      {getCategoryLabel(alternativeModalCategory, language)}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                    {language === 'en'
                      ? `Select an Alternative Bill to Propose`
                      : `提案する代替法案を選択`}
                  </h3>
                </div>
              </div>

              <button
                id="btn-close-alternative-modal"
                onClick={() => setAlternativeModalCategory(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Filters and Search Bar */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="alternative-bill-search"
                  type="text"
                  value={alternativeSearch}
                  onChange={(e) => setAlternativeSearch(e.target.value)}
                  placeholder={language === 'en' ? 'Search bills by name or description...' : '法案名やキーワードで検索...'}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Tag Filters */}
              <div className="flex flex-wrap gap-1.5 shrink-0">
                {[
                  { key: 'all', en: 'All', ja: 'すべて' },
                  { key: 'tfr', en: 'TFR Boost', ja: '出生率' },
                  { key: 'fiscal', en: 'Fiscally Sound', ja: '財政健全' },
                  { key: 'hope', en: 'Hope', ja: '希望度' },
                  { key: 'prod', en: 'Productivity', ja: '生産性' },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setAlternativeFilter(tab.key as typeof alternativeFilter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech transition-colors cursor-pointer border ${
                      alternativeFilter === tab.key
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border-slate-700'
                    }`}
                  >
                    {language === 'en' ? tab.en : tab.ja}
                  </button>
                ))}
              </div>
            </div>

            {/* Ordinance List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-3 bg-slate-950/40">
              {(() => {
                const catOrds = ordinances.filter(o => o.category === alternativeModalCategory && !o.active);
                const query = alternativeSearch.trim().toLowerCase();

                const filtered = catOrds.filter(ord => {
                  if (query) {
                    const matchEn = ord.name.en.toLowerCase().includes(query) || ord.description.en.toLowerCase().includes(query);
                    const matchJa = ord.name.ja.toLowerCase().includes(query) || ord.description.ja.toLowerCase().includes(query);
                    if (!matchEn && !matchJa) return false;
                  }

                  if (alternativeFilter === 'tfr' && ord.tfrDelta <= 0) return false;
                  if (alternativeFilter === 'fiscal' && ord.annualCostBillion > 500) return false;
                  if (alternativeFilter === 'hope' && ord.hopeIndexDelta <= 0) return false;
                  if (alternativeFilter === 'prod' && (ord.productivityDelta || 0) <= 0) return false;

                  return true;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-12 text-slate-500">
                      <Layers size={32} className="mx-auto mb-2 opacity-40 text-slate-400" />
                      <p className="text-sm font-semibold">
                        {language === 'en' ? 'No matching alternative bills found.' : '条件に合致する代替法案が見つかりませんでした。'}
                      </p>
                      <button
                        onClick={() => { setAlternativeSearch(''); setAlternativeFilter('all'); }}
                        className="mt-3 text-xs text-indigo-400 hover:underline cursor-pointer"
                      >
                        {language === 'en' ? 'Reset search filters' : 'フィルタを解除'}
                      </button>
                    </div>
                  );
                }

                return filtered.map(ord => {
                  const isCurrentlySelected = selectedOrds[alternativeModalCategory] === ord.id;
                  const isAlreadyInAgenda = categoryProposals[alternativeModalCategory]?.includes(ord.id);

                  return (
                    <div
                      key={ord.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isCurrentlySelected
                          ? 'bg-indigo-950/50 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)] ring-1 ring-indigo-400'
                          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <h4 className="font-bold text-sm sm:text-base text-white">
                              {language === 'en' ? ord.name.en : ord.name.ja}
                            </h4>
                            {isAlreadyInAgenda && (
                              <span className="px-2 py-0.5 text-[10px] rounded bg-slate-800 text-slate-300 border border-slate-700">
                                {language === 'en' ? 'In Active Docket' : '審議リストに掲載中'}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-400 leading-relaxed mb-3">
                            {language === 'en' ? ord.description.en : ord.description.ja}
                          </p>

                          <div className="flex flex-wrap gap-2 text-[10px] font-mono-tech font-bold uppercase">
                            <span className={`px-2 py-1 rounded border ${
                              ord.annualCostBillion > 0 
                                ? 'bg-red-950/30 text-red-300 border-red-900/50' 
                                : 'bg-emerald-950/30 text-emerald-300 border-emerald-900/50'
                            }`}>
                              EST. {ord.annualCostBillion > 0 ? '-' : '+'}{Math.abs(ord.annualCostBillion)}B ¥/YR
                            </span>
                            
                            {ord.tfrDelta !== 0 && (
                              <span className={`px-2 py-1 rounded border ${
                                ord.tfrDelta > 0 
                                  ? 'bg-emerald-950/30 text-emerald-300 border-emerald-900/50' 
                                  : 'bg-red-950/30 text-red-300 border-red-900/50'
                              }`}>
                                EST. TFR {ord.tfrDelta > 0 ? '+' : ''}{ord.tfrDelta}
                              </span>
                            )}
                            
                            {ord.hopeIndexDelta !== 0 && (
                              <span className={`px-2 py-1 rounded border flex items-center gap-1 ${
                                ord.hopeIndexDelta > 0 
                                  ? 'bg-amber-950/30 text-amber-300 border-amber-900/50' 
                                  : 'bg-indigo-950/30 text-indigo-300 border-indigo-900/50'
                              }`}>
                                <Sparkles size={10} /> EST. HOPE {ord.hopeIndexDelta > 0 ? '+' : ''}{ord.hopeIndexDelta}
                              </span>
                            )}

                            {ord.productivityDelta !== 0 && (
                              <span className={`px-2 py-1 rounded border flex items-center gap-1 ${
                                ord.productivityDelta > 0 
                                  ? 'bg-blue-950/30 text-blue-300 border-blue-900/50' 
                                  : 'bg-slate-800 text-slate-400 border-slate-700'
                              }`}>
                                <TrendingUp size={10} /> EST. PROD {ord.productivityDelta > 0 ? '+' : ''}{Math.round(ord.productivityDelta * 100)}%
                              </span>
                            )}
                          </div>

                          {ord.replaces && ord.replaces.length > 0 && (
                            <div className="mt-2 text-[10px] text-amber-500/80 flex items-center gap-1">
                              <AlertTriangle size={12} />
                              {language === 'en' ? 'Supersedes existing related legislation' : '既存の関連法案を廃止・更新します'}
                            </div>
                          )}
                        </div>

                        <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                          <button
                            id={`btn-select-alt-bill-${ord.id}`}
                            onClick={() => handleSelectAlternativeBill(alternativeModalCategory, ord.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono-tech flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                              isCurrentlySelected
                                ? 'bg-indigo-600 text-white border border-indigo-400 ring-2 ring-indigo-400/40'
                                : 'bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-700 hover:border-indigo-500'
                            }`}
                          >
                            {isCurrentlySelected ? (
                              <>
                                <Check size={14} className="text-white" />
                                <span>{language === 'en' ? 'Selected for Proposal' : '提案選択中'}</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 size={14} />
                                <span>{language === 'en' ? 'Adopt as Bill' : 'この法案を採択'}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex justify-end">
              <button
                onClick={() => setAlternativeModalCategory(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 cursor-pointer transition-colors"
              >
                {language === 'en' ? 'Close Repository' : '閉じる'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
