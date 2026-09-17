import React from 'react';
import {
  ActiveTool,
  HeatmapOverlay,
  Language,
  PrefecturalRegionId,
} from '../types/game';
import { TRANSLATIONS } from '../i18n/translations';
import {
  Search,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MapPin,
  Flame,
  Users,
  TrendingUp,
  HeartHandshake,
  Home,
} from 'lucide-react';
import { soundEngine } from '../canvas/audio';

interface ToolBarProps {
  activeTool: ActiveTool;
  onSelectTool: (tool: ActiveTool) => void;
  activeOverlay: HeatmapOverlay;
  onSelectOverlay: (overlay: HeatmapOverlay) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetCamera: () => void;
  onSelectRegion?: (regionId: PrefecturalRegionId) => void;
  selectedRegionId?: PrefecturalRegionId | null;
  language: Language;
}

const REGIONS: { id: PrefecturalRegionId; name: { en: string; ja: string } }[] = [
  { id: 'hokkaido', name: { en: 'Hokkaido', ja: '北海道' } },
  { id: 'tohoku', name: { en: 'Tohoku', ja: '東北' } },
  { id: 'kanto', name: { en: 'Kanto (Tokyo)', ja: '関東（東京）' } },
  { id: 'chubu', name: { en: 'Chubu (Nagoya)', ja: '中部（東海）' } },
  { id: 'kansai', name: { en: 'Kansai (Osaka)', ja: '関西（大阪）' } },
  { id: 'chugoku', name: { en: 'Chugoku', ja: '中国' } },
  { id: 'shikoku', name: { en: 'Shikoku', ja: '四国' } },
  { id: 'kyushu', name: { en: 'Kyushu/Okinawa', ja: '九州・沖縄' } },
];

export const ToolBar: React.FC<ToolBarProps> = ({
  activeTool,
  onSelectTool,
  activeOverlay,
  onSelectOverlay,
  onZoomIn,
  onZoomOut,
  onResetCamera,
  onSelectRegion,
  selectedRegionId,
  language,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="absolute left-3 top-20 z-20 flex flex-col gap-2.5 max-w-[210px] select-none font-mono-tech">
      {/* 2.5D Data Landscape Regional Explorer */}
      <div className="rounded-xl p-2.5 flex flex-col gap-1.5 w-full bg-slate-900/95 border border-slate-700 shadow-xl backdrop-blur-md">
        <div className="bg-slate-950 text-slate-200 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center justify-between uppercase tracking-wider font-digital border border-slate-800">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <MapPin size={12} />
            {language === 'en' ? 'REGIONAL TELEMETRY' : '広域ブロック調査'}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          {REGIONS.map((reg) => {
            const isSelected = selectedRegionId === reg.id;
            return (
              <button
                key={reg.id}
                onClick={() => {
                  soundEngine.playClick();
                  if (onSelectRegion) onSelectRegion(reg.id);
                }}
                className={`px-2 py-1 rounded-lg flex items-center justify-between text-left cursor-pointer transition border text-xs ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-400 font-bold shadow-md'
                    : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:text-white'
                }`}
              >
                <span className="truncate">{reg.name[language]}</span>
                {isSelected && <span className="text-[10px] text-amber-300 font-digital">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Heatmap & Visual Strata Modes */}
      <div className="rounded-xl p-2.5 flex flex-col gap-1.5 w-full bg-slate-900/95 border border-slate-700 shadow-xl backdrop-blur-md">
        <div className="bg-slate-950 text-slate-200 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1.5 uppercase tracking-wider font-digital border border-slate-800">
          <Layers size={12} className="text-emerald-400" />
          <span>{t.overlay}</span>
        </div>

        <select
          value={activeOverlay}
          onChange={(e) => {
            soundEngine.playClick();
            onSelectOverlay(e.target.value as HeatmapOverlay);
          }}
          className="bg-slate-950 text-emerald-400 font-mono-tech text-xs p-2 rounded-lg border border-slate-700 w-full focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
        >
          <option value="normal">{t.overlayNormal}</option>
          <option value="youth">🍼 {t.overlayYouth}</option>
          <option value="akiya">🏚️ {t.overlayAkiya}</option>
          <option value="productivity">⚡ {t.overlayProductivity}</option>
          <option value="fertility">📈 {t.overlayFertility}</option>
        </select>
      </div>

      {/* Zoom / Viewport Controls */}
      <div className="rounded-xl p-1.5 flex items-center justify-between gap-1 bg-slate-900/95 border border-slate-700 shadow-xl backdrop-blur-md">
        <button
          onClick={() => { soundEngine.playClick(); onZoomIn(); }}
          className="p-1.5 flex-1 flex items-center justify-center cursor-pointer text-slate-300 hover:text-white bg-slate-950 hover:bg-slate-800 rounded-lg border border-slate-800 transition"
          title="Zoom In"
        >
          <ZoomIn size={14} />
        </button>
        <button
          onClick={() => { soundEngine.playClick(); onZoomOut(); }}
          className="p-1.5 flex-1 flex items-center justify-center cursor-pointer text-slate-300 hover:text-white bg-slate-950 hover:bg-slate-800 rounded-lg border border-slate-800 transition"
          title="Zoom Out"
        >
          <ZoomOut size={14} />
        </button>
        <button
          onClick={() => { soundEngine.playClick(); onResetCamera(); }}
          className="p-1.5 flex-1 flex items-center justify-center cursor-pointer text-slate-300 hover:text-white bg-slate-950 hover:bg-slate-800 rounded-lg border border-slate-800 transition"
          title="Center Data Map"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
};
