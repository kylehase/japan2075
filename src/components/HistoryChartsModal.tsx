import React, { useState, useMemo } from 'react';
import { GameState, Language } from '../types/game';
import { 
  X, 
  LineChart as LineChartIcon, 
  Landmark, 
  Layers, 
  Users, 
  TrendingUp, 
  Vote, 
  Baby, 
  DollarSign, 
  ShieldAlert,
  Info
} from 'lucide-react';
import { soundEngine } from '../canvas/audio';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface HistoryChartsModalProps {
  gameState: GameState;
  language: Language;
  onClose: () => void;
}

type ChartCategory = 'all' | 'demographics' | 'economy' | 'governance';

export const HistoryChartsModal: React.FC<HistoryChartsModalProps> = ({
  gameState,
  language,
  onClose,
}) => {
  const history = gameState.history || [];
  const [timeRange, setTimeRange] = useState<'all' | 'historical' | 'simulation'>('all');
  const [selectedCategory, setSelectedCategory] = useState<ChartCategory>('all');

  const filteredData = useMemo(() => {
    let dataset = history;
    if (timeRange === 'historical') {
      dataset = history.filter(r => r.year <= 2024);
    } else if (timeRange === 'simulation') {
      dataset = history.filter(r => r.year >= 2025);
    }
    return dataset.map(r => ({
      ...r,
      deaths: (r.deaths > 0 && r.deaths < 10000) ? r.deaths * 1000 : r.deaths,
    }));
  }, [history, timeRange]);

  // Formatting for Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const record = history.find(r => r.year === label);
      const isHistorical = label <= 2024 || record?.isHistorical;
      
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-lg shadow-2xl text-xs font-mono-tech max-w-sm backdrop-blur-md">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-2">
            <span className="text-amber-300 font-bold font-digital text-sm">
              {language === 'en' ? `Year ${label}` : `${label}年`}
            </span>
            {isHistorical ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800/50">
                <Landmark size={10} />
                {language === 'en' ? 'Official Gov Data' : '公式政府統計'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-950/80 text-purple-300 border border-purple-800/50">
                <Layers size={10} />
                {language === 'en' ? 'Realized Annual Census' : '年度確定統計'}
              </span>
            )}
          </div>

          <div className="space-y-1">
            {payload.map((entry: any, index: number) => {
              let formattedVal = entry.value;
              const key = entry.dataKey;

              if (typeof entry.value === 'number') {
                if (key === 'population') {
                  formattedVal = `${(entry.value / 1000000).toFixed(2)}M (${entry.value.toLocaleString()})`;
                } else if (key === 'births' || key === 'deaths') {
                  formattedVal = entry.value.toLocaleString();
                } else if (key === 'gdp') {
                  formattedVal = `¥${entry.value.toFixed(1)}T`;
                } else if (key === 'debtToGDP' || key === 'elderlyRatio' || key === 'cabinetApproval') {
                  formattedVal = `${entry.value.toFixed(1)}%`;
                } else if (key === 'jgbYield') {
                  formattedVal = `${entry.value.toFixed(2)}%`;
                } else if (key === 'tfr') {
                  formattedVal = entry.value.toFixed(2);
                } else if (key === 'youthHopeIndex') {
                  formattedVal = `${entry.value.toFixed(1)} / 100`;
                } else {
                  formattedVal = entry.value.toFixed(2);
                }
              }

              return (
                <div key={index} style={{ color: entry.color }} className="flex justify-between gap-4 py-0.5">
                  <span className="text-slate-300">{entry.name}:</span>
                  <span className="font-bold font-digital">{formattedVal}</span>
                </div>
              );
            })}
          </div>

          {record && record.policyEvents && record.policyEvents.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-slate-800">
              <span className="text-slate-400 block text-[10px] mb-1 font-semibold uppercase tracking-wider">
                {isHistorical
                  ? (language === 'en' ? 'Historical Policy Milestone:' : '歴史的政策・制度改革:')
                  : (language === 'en' ? 'Policy Events Enacted:' : '政権下での立法・施策:')}
              </span>
              <ul className="space-y-1 text-[10px]">
                {record.policyEvents.map((evt, idx) => {
                  let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';
                  let badgeLabel = evt.type.toUpperCase();

                  if (evt.type === 'historic') {
                    badgeColor = 'bg-amber-950/70 text-amber-300 border-amber-800/50';
                    badgeLabel = language === 'en' ? 'HISTORIC' : '歴史的政策';
                  } else if (evt.type === 'enacted') {
                    badgeColor = 'bg-emerald-950/70 text-emerald-300 border-emerald-800/50';
                    badgeLabel = language === 'en' ? 'ENACTED' : '成立';
                  } else if (evt.type === 'repealed') {
                    badgeColor = 'bg-rose-950/70 text-rose-300 border-rose-800/50';
                    badgeLabel = language === 'en' ? 'REPEALED' : '廃止';
                  } else if (evt.type === 'expired') {
                    badgeColor = 'bg-amber-950/70 text-amber-400 border-amber-800/50';
                    badgeLabel = language === 'en' ? 'EXPIRED' : '失効';
                  }

                  return (
                    <li key={idx} className="flex items-start gap-1.5 text-slate-200 leading-snug">
                      <span className={`px-1 py-0.5 rounded text-[8px] font-bold uppercase border shrink-0 ${badgeColor}`}>
                        {badgeLabel}
                      </span>
                      <span>{evt.name[language]}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {isHistorical && (
            <div className="mt-2 pt-1 border-t border-slate-800 text-[9px] text-slate-500 italic">
              {language === 'en'
                ? 'Source: Official Government Statistics (MIC / MHLW / Cabinet Office / BOJ)'
                : '出典: 日本政府公式統計（総務省・厚労省・内閣府・日銀）'}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const showSimulationLine = timeRange === 'all';

  const showDemographics = selectedCategory === 'all' || selectedCategory === 'demographics';
  const showEconomy = selectedCategory === 'all' || selectedCategory === 'economy';
  const showGovernance = selectedCategory === 'all' || selectedCategory === 'governance';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 select-none font-mono-tech">
      <div className="w-full max-w-6xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col h-[92vh]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-slate-800 bg-slate-950 rounded-t-xl gap-3">
          <div className="flex items-center gap-2 text-purple-400">
            <LineChartIcon size={22} />
            <div>
              <h2 className="font-bold font-digital text-lg leading-none">
                {language === 'en' ? 'Historical & Demographic Archives (2000–Present)' : '歴史的推移と政府統計アーカイブ (2000年〜現在)'}
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {language === 'en'
                  ? 'Official government statistics (2000–2024) bridged seamlessly into your administration (2025+)'
                  : '総務省・厚労省・内閣府・日銀公式データ（2000〜2024年）と政権シミュレーション（2025年〜）'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Category Filter */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => { soundEngine.playClick(); setSelectedCategory('all'); }}
                className={`px-2.5 py-1 rounded-md transition font-medium ${
                  selectedCategory === 'all'
                    ? 'bg-slate-700 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {language === 'en' ? 'All' : '全領域'}
              </button>
              <button
                onClick={() => { soundEngine.playClick(); setSelectedCategory('demographics'); }}
                className={`px-2.5 py-1 rounded-md transition font-medium flex items-center gap-1 ${
                  selectedCategory === 'demographics'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users size={12} />
                {language === 'en' ? 'Demographics' : '人口'}
              </button>
              <button
                onClick={() => { soundEngine.playClick(); setSelectedCategory('economy'); }}
                className={`px-2.5 py-1 rounded-md transition font-medium flex items-center gap-1 ${
                  selectedCategory === 'economy'
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <DollarSign size={12} />
                {language === 'en' ? 'Economy & Debt' : '経済・国債'}
              </button>
              <button
                onClick={() => { soundEngine.playClick(); setSelectedCategory('governance'); }}
                className={`px-2.5 py-1 rounded-md transition font-medium flex items-center gap-1 ${
                  selectedCategory === 'governance'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Vote size={12} />
                {language === 'en' ? 'Governance' : '政治・世論'}
              </button>
            </div>

            {/* Range Toggle */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => { soundEngine.playClick(); setTimeRange('all'); }}
                className={`px-2 py-1 rounded-md transition font-medium ${
                  timeRange === 'all'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {language === 'en' ? '2000–Now' : '全期間'}
              </button>
              <button
                onClick={() => { soundEngine.playClick(); setTimeRange('historical'); }}
                className={`px-2 py-1 rounded-md transition font-medium ${
                  timeRange === 'historical'
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {language === 'en' ? '00–24 (Gov)' : '実績'}
              </button>
              <button
                onClick={() => { soundEngine.playClick(); setTimeRange('simulation'); }}
                className={`px-2 py-1 rounded-md transition font-medium ${
                  timeRange === 'simulation'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {language === 'en' ? '25+ (Sim)' : '政権期'}
              </button>
            </div>

            <button
              onClick={() => { soundEngine.playClick(); onClose(); }}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              aria-label="Close"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Source Badge Bar */}
        <div className="bg-slate-950/70 px-4 py-2 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <Landmark size={13} />
              {language === 'en' ? 'Official Government Sources (2000–2024):' : '公的データ出典 (2000〜2024年):'}
            </span>
            <span className="text-slate-300">
              {language === 'en'
                ? 'Statistics Bureau (MIC) • MHLW Vital Stats • Cabinet Office SNA • MOF • Bank of Japan'
                : '総務省統計局（人口推計）• 厚生労働省（人口動態統計）• 内閣府（SNA）• 財務省 • 日本銀行'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1 text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
              {language === 'en' ? '2000–2024: Official Historical Data' : '2000〜2024: 実績公式統計'}
            </span>
            <span className="flex items-center gap-1 text-purple-300">
              <span className="w-2 h-2 rounded-full bg-purple-400 inline-block"></span>
              {language === 'en' ? '2025+: Player Policy Simulation' : '2025年〜: プレイヤー施策結果'}
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">

          {/* ========================================================================= */}
          {/* SECTION 1: DEMOGRAPHICS & POPULATION DYNAMICS                             */}
          {/* ========================================================================= */}
          {showDemographics && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <Users size={18} className="text-blue-400" />
                <h3 className="text-sm font-bold font-digital uppercase tracking-wider text-blue-300">
                  {language === 'en' ? 'Demographic Structure & Population Dynamics' : '人口構造と人口動態'}
                </h3>
                <span className="text-[10px] text-slate-500 ml-auto">
                  {language === 'en' ? 'Source: Statistics Bureau of Japan (MIC) & MHLW' : '出典: 総務省統計局・厚生労働省'}
                </span>
              </div>

              {/* Chart 1: Population & Elderly Ratio (Dual Axis) */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      {language === 'en' ? 'Total Population & Elderly Ratio (65+)' : '総人口と高齢化率 (65歳以上)'}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {language === 'en' 
                        ? 'Tracks Japan\'s aggregate population scale alongside the aging ratio.'
                        : '日本の総人口規模と65歳以上高齢者割合の推移。'}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {language === 'en' ? 'Unit: Millions (Left) / % (Right)' : '単位: 百万人 (左) / % (右)'}
                  </span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="year" stroke="#475569" tick={{fill: '#94a3b8', fontSize: 10}} />
                      <YAxis yAxisId="left" stroke="#475569" tick={{fill: '#94a3b8', fontSize: 10}} 
                            tickFormatter={(val) => (val / 1000000).toFixed(0) + 'M'} />
                      <YAxis yAxisId="right" orientation="right" stroke="#475569" tick={{fill: '#94a3b8', fontSize: 10}} 
                            tickFormatter={(val) => val.toFixed(0) + '%'} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      {showSimulationLine && (
                        <ReferenceLine x={2025} stroke="#a855f7" strokeDasharray="3 3" yAxisId="left" />
                      )}
                      <Line yAxisId="left" type="monotone" dataKey="population" name={language === 'en' ? 'Total Population' : '総人口'} stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
                      <Line yAxisId="right" type="monotone" dataKey="elderlyRatio" name={language === 'en' ? 'Elderly (65+) %' : '高齢化率 (%)'} stroke="#f59e0b" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Annual Births & Deaths (Natural Demographics) */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      {language === 'en' ? 'Annual Live Births vs Annual Deaths (Natural Balance)' : '年間出生数と死亡数の推移（人口自然増減）'}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {language === 'en'
                        ? 'Visualizes the "scissors curve" — deaths crossed births in 2005, driving sustained natural decline.'
                        : '2005年の死亡数超過以降、出生減と死亡増による自然減が拡大する「人口のハサミ」構造。'}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {language === 'en' ? 'Source: MHLW Vital Statistics' : '出典: 厚生労働省 人口動態統計'}
                  </span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="year" stroke="#475569" tick={{fill: '#94a3b8', fontSize: 10}} />
                      <YAxis stroke="#475569" tick={{fill: '#94a3b8', fontSize: 10}} 
                            tickFormatter={(val) => (val >= 1000000 ? (val / 1000000).toFixed(2) + 'M' : (val / 1000).toFixed(0) + 'k')} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      {showSimulationLine && (
                        <ReferenceLine x={2025} stroke="#a855f7" strokeDasharray="3 3" />
                      )}
                      <Line type="monotone" dataKey="births" name={language === 'en' ? 'Annual Live Births' : '年間出生数'} stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 2 }} activeDot={{ r: 5 }} />
                      <Line type="monotone" dataKey="deaths" name={language === 'en' ? 'Annual Deaths' : '年間死亡数'} stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 2 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 3: Dedicated Total Fertility Rate (TFR) with Replacement Level Line */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <Baby size={16} className="text-pink-400" />
                      {language === 'en' ? 'Total Fertility Rate (TFR) vs 2.07 Replacement Benchmark' : '合計特殊出生率 (TFR) と人口置換水準 (2.07)'}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {language === 'en'
                        ? 'Average children per woman. The dashed line marks the 2.07 replacement level needed to maintain a stable population.'
                        : '1人の女性が生涯に産む子どもの推定数。点線は人口維持に必要な人口置換水準（2.07）。'}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {language === 'en' ? 'Replacement Level = 2.07' : '人口置換水準 = 2.07'}
                  </span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="year" stroke="#475569" tick={{fill: '#94a3b8', fontSize: 10}} />
                      <YAxis stroke="#475569" tick={{fill: '#94a3b8', fontSize: 10}} domain={[0.9, 2.2]} tickFormatter={(v) => v.toFixed(2)} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      
                      {/* Demographic Replacement Threshold Line */}
                      <ReferenceLine 
                        y={2.07} 
                        stroke="#10b981" 
                        strokeDasharray="4 4" 
                        strokeWidth={1.5}
                        label={{ 
                          value: language === 'en' ? 'Replacement Level (2.07)' : '人口置換水準 (2.07)', 
                          fill: '#10b981', 
                          fontSize: 10, 
                          position: 'insideTopRight' 
                        }} 
                      />

                      {showSimulationLine && (
                        <ReferenceLine x={2025} stroke="#a855f7" strokeDasharray="3 3" />
                      )}
                      
                      <Line type="monotone" dataKey="tfr" name={language === 'en' ? 'Total Fertility Rate (TFR)' : '合計特殊出生率 (TFR)'} stroke="#ec4899" strokeWidth={2.5} dot={{ r: 2 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 2: MACROECONOMY & SOVEREIGN FISCAL SOLVENCY                       */}
          {/* ========================================================================= */}
          {showEconomy && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <DollarSign size={18} className="text-amber-400" />
                <h3 className="text-sm font-bold font-digital uppercase tracking-wider text-amber-300">
                  {language === 'en' ? 'Macroeconomy & Sovereign Fiscal Solvency' : 'マクロ経済と財政信認・国債市場'}
                </h3>
                <span className="text-[10px] text-slate-500 ml-auto">
                  {language === 'en' ? 'Source: Cabinet Office (SNA), MOF, Bank of Japan' : '出典: 内閣府・財務省・日本銀行'}
                </span>
              </div>

              {/* Chart 4: Real GDP */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp size={16} className="text-purple-400" />
                      {language === 'en' ? 'Real GDP (National Economic Output)' : '実質GDP（国内総生産・経済規模）'}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {language === 'en'
                        ? 'Real GDP in Trillion Yen. Captures economic expansion, Lehman/COVID shocks, and structural growth.'
                        : '実質国内総生産（兆円）。デフレ期、リーマン危機、アベノミクス、コロナ禍、政権下の成長を反映。'}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {language === 'en' ? 'Unit: ¥ Trillion (Chained SNA)' : '単位: 兆円'}
                  </span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="year" stroke="#475569" tick={{fill: '#94a3b8', fontSize: 10}} />
                      <YAxis stroke="#475569" tick={{fill: '#94a3b8', fontSize: 10}} 
                            domain={['auto', 'auto']}
                            tickFormatter={(val) => '¥' + val.toFixed(0) + 'T'} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      {showSimulationLine && (
                        <ReferenceLine x={2025} stroke="#a855f7" strokeDasharray="3 3" />
                      )}
                      <Line type="monotone" dataKey="gdp" name={language === 'en' ? 'Real GDP (¥ Trillion)' : '実質GDP（兆円）'} stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 2 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 5: Sovereign Risk Nexus: Debt-to-GDP vs 10-Year JGB Yield */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <ShieldAlert size={16} className="text-rose-400" />
                      {language === 'en' ? 'Fiscal Solvency & Sovereign Bond Risk (Debt/GDP vs 10Y JGB Yield)' : '国家財政と国債市場リスク（債務対GDP比率 vs 10年国債利回り）'}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {language === 'en'
                        ? 'Direct economic relationship: As sovereign debt expands, bond yields determine debt servicing costs and fiscal solvency risk.'
                        : '直接的な経済連関：債務比率の膨張と、財政破綻・利払い費急増を左右する10年国債利回り（調達金利）の相関。'}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {language === 'en' ? 'Debt Ratio % (Left) / JGB Yield % (Right)' : '債務比率 % (左) / 国債利回り % (右)'}
                  </span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="year" stroke="#475569" tick={{fill: '#94a3b8', fontSize: 10}} />
                      <YAxis yAxisId="left" stroke="#475569" tick={{fill: '#94a3b8', fontSize: 10}} 
                            domain={[100, 'auto']}
                            tickFormatter={(val) => val.toFixed(0) + '%'} />
                      <YAxis yAxisId="right" orientation="right" stroke="#475569" tick={{fill: '#94a3b8', fontSize: 10}} 
                            domain={[-0.5, 4.0]} 
                            tickFormatter={(val) => val.toFixed(1) + '%'} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      {showSimulationLine && (
                        <ReferenceLine x={2025} stroke="#a855f7" strokeDasharray="3 3" yAxisId="left" />
                      )}
                      <Line yAxisId="left" type="monotone" dataKey="debtToGDP" name={language === 'en' ? 'National Debt to GDP %' : '債務対GDP比率 (%)'} stroke="#ef4444" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 5 }} />
                      <Line yAxisId="right" type="monotone" dataKey="jgbYield" name={language === 'en' ? '10-Year JGB Benchmark Yield %' : '10年国債利回り (%)'} stroke="#eab308" strokeWidth={2.5} dot={{ r: 2 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 3: GOVERNANCE & SOCIETAL SENTIMENT                                */}
          {/* ========================================================================= */}
          {showGovernance && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <Vote size={18} className="text-emerald-400" />
                <h3 className="text-sm font-bold font-digital uppercase tracking-wider text-emerald-300">
                  {language === 'en' ? 'Governance, Public Mandate & Societal Sentiment' : '政治信認・内閣支持率と若者希望指数'}
                </h3>
                <span className="text-[10px] text-slate-500 ml-auto">
                  {language === 'en' ? 'Source: National Media Polling Archives & Cabinet Office Surveys' : '出典: 報道各社世論調査・内閣府意識調査'}
                </span>
              </div>

              {/* Chart 6: Cabinet Approval Rating vs Youth Hope Index */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                      {language === 'en' ? 'Cabinet Approval Rating & Youth Hope Index (Shared 0–100 Scale)' : '内閣支持率と若者希望指数（0〜100基準）'}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {language === 'en'
                        ? 'Political stability vs generational optimism. Both operate on a standardized 0–100 scale, illustrating public confidence and youth future sentiment.'
                        : '政権の政治的信認（支持率）と、賃金・住宅・制度信頼に基づく若者の未来への希望指数（0〜100）の連関。'}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {language === 'en' ? 'Scale: 0 to 100 (% / Index)' : '基準: 0〜100 (% / 指数)'}
                  </span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="year" stroke="#475569" tick={{fill: '#94a3b8', fontSize: 10}} />
                      <YAxis stroke="#475569" tick={{fill: '#94a3b8', fontSize: 10}} domain={[0, 100]} 
                            tickFormatter={(val) => val.toFixed(0)} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      
                      {/* Mandate Thresholds */}
                      <ReferenceLine 
                        y={50} 
                        stroke="#64748b" 
                        strokeDasharray="2 2" 
                        label={{ 
                          value: language === 'en' ? 'Majority (50%)' : '過半数 (50%)', 
                          fill: '#64748b', 
                          fontSize: 9, 
                          position: 'insideBottomRight' 
                        }} 
                      />
                      <ReferenceLine 
                        y={25} 
                        stroke="#ef4444" 
                        strokeDasharray="3 3" 
                        label={{ 
                          value: language === 'en' ? 'Danger Zone (25%)' : '危険水域 (25%)', 
                          fill: '#ef4444', 
                          fontSize: 9, 
                          position: 'insideBottomRight' 
                        }} 
                      />

                      {showSimulationLine && (
                        <ReferenceLine x={2025} stroke="#a855f7" strokeDasharray="3 3" />
                      )}
                      
                      <Line type="monotone" dataKey="cabinetApproval" name={language === 'en' ? 'Cabinet Approval Rating (%)' : '内閣支持率 (%)'} stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 2 }} activeDot={{ r: 5 }} />
                      <Line type="monotone" dataKey="youthHopeIndex" name={language === 'en' ? 'Youth Hope Index (0–100)' : '若者希望指数 (0〜100)'} stroke="#10b981" strokeWidth={2.5} dot={{ r: 2 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Citation */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 rounded-b-xl flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <div className="flex items-center gap-1.5">
            <Info size={13} className="text-slate-400 shrink-0" />
            <span>
              {language === 'en'
                ? 'Historical baseline (2000–2024) calibrated from Statistics Bureau of Japan, MHLW, Cabinet Office SNA, MOF, and Bank of Japan.'
                : '2000年〜2024年の実績値は総務省統計局、厚労省人口動態統計、内閣府国民経済計算、財務省、日本銀行統計に基づく公式値です。'}
            </span>
          </div>
          <button
            onClick={() => { soundEngine.playClick(); onClose(); }}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md font-medium transition text-xs shrink-0"
          >
            {language === 'en' ? 'Close Archives' : '閉じる'}
          </button>
        </div>
      </div>
    </div>
  );
};
