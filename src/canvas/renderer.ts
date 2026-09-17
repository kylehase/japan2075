import { GameState, HeatmapOverlay, ActiveTool, PrefecturalRegionId, RegionalMetricData } from '../types/game';
import { TILE_WIDTH, TILE_HEIGHT, gridToScreen, screenToGrid, GridCoord, geoToScreen, JAPAN_MAP_CENTER_LON, JAPAN_MAP_CENTER_LAT } from './isoMath';
import { computeRegionalMetrics } from '../simulation/regionalData';

export interface RaycastHit {
  type: 'region' | 'hope_monolith' | 'fiscal_monolith' | 'cohort';
  regionId?: PrefecturalRegionId;
  cohortIndex?: number;
  label: string;
}

interface NetworkEdge {
  from: PrefecturalRegionId;
  to: PrefecturalRegionId;
}

interface TransitDot {
  id: number;
  fromId: PrefecturalRegionId;
  toId: PrefecturalRegionId;
  progress: number;
  speed: number;
  color: string;
  glowColor: string;
  size: number;
  trail: { x: number; y: number }[];
}

interface StationArrivalPulse {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  color: string;
}

const REGIONAL_ADJACENCY: Record<PrefecturalRegionId, PrefecturalRegionId[]> = {
  kyushu: ['chugoku', 'shikoku'],
  chugoku: ['kyushu', 'kansai', 'shikoku'],
  shikoku: ['chugoku', 'kansai', 'kyushu'],
  kansai: ['chugoku', 'shikoku', 'chubu', 'kanto'],
  chubu: ['kansai', 'kanto', 'tohoku'],
  kanto: ['chubu', 'tohoku', 'kansai'],
  tohoku: ['kanto', 'hokkaido', 'chubu'],
  hokkaido: ['tohoku'],
};

const NETWORK_EDGES: NetworkEdge[] = [
  { from: 'kyushu', to: 'chugoku' },
  { from: 'kyushu', to: 'shikoku' },
  { from: 'chugoku', to: 'kansai' },
  { from: 'chugoku', to: 'shikoku' },
  { from: 'shikoku', to: 'kansai' },
  { from: 'kansai', to: 'chubu' },
  { from: 'kansai', to: 'kanto' },
  { from: 'chubu', to: 'kanto' },
  { from: 'chubu', to: 'tohoku' },
  { from: 'kanto', to: 'tohoku' },
  { from: 'tohoku', to: 'hokkaido' },
];

export class IsometricRenderer {
  private ctx: CanvasRenderingContext2D;
  private animTick: number = 0;
  public cameraX: number = 0;
  public cameraY: number = 0;
  public zoom: number = 0.95;
  public width: number = 800;
  public height: number = 600;

  // Hovered item cache
  public hoveredTarget: RaycastHit | null = null;
  public hoveredRegionId: PrefecturalRegionId | null = null;
  public selectedRegionId: PrefecturalRegionId | null = null;

  // City-to-city transit simulation dots and station pulse effects
  private transitDots: TransitDot[] = [];
  private stationPulses: StationArrivalPulse[] = [];

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public resize(w: number, h: number) {
    this.width = w;
    this.height = h;
    this.ctx.canvas.width = w;
    this.ctx.canvas.height = h;
    if (this.cameraX === 0 && this.cameraY === 0) {
      this.resetCamera();
    }
  }

  public pan(dx: number, dy: number) {
    this.cameraX += dx;
    this.cameraY += dy;
  }

  public zoomAt(factor: number, cx: number, cy: number) {
    const newZoom = Math.max(0.4, Math.min(2.2, this.zoom * factor));
    const ratio = newZoom / this.zoom;
    this.cameraX = cx - (cx - this.cameraX) * ratio;
    this.cameraY = cy - (cy - this.cameraY) * ratio;
    this.zoom = newZoom;
  }

  public resetCamera() {
    this.cameraX = this.width / 2;
    this.cameraY = this.height / 2;
    this.zoom = Math.max(0.65, Math.min(1.15, this.width / 1000));
  }

  public screenToGrid(screenX: number, screenY: number): GridCoord {
    return screenToGrid(screenX, screenY, this.cameraX, this.cameraY, this.zoom);
  }

  public getRegionAtScreenPos(
    screenX: number,
    screenY: number,
    regions: RegionalMetricData[]
  ): RegionalMetricData | null {
    const worldX = (screenX - this.cameraX) / this.zoom;
    const worldY = (screenY - this.cameraY) / this.zoom;

    // Check regions in South-to-North order (foreground to background) so foreground bars take precedence
    const sorted = [...regions].sort((a, b) => a.lat - b.lat);

    const maxPop = 45;
    const baseHeight = 20;

    for (const r of sorted) {
      const pos = geoToScreen(r.lon, r.lat);
      const popHeight = (r.populationMillions / maxPop) * 150 + baseHeight;
      const totalColHeight = 10 + popHeight;

      // Click hit testing covering the pedestal, the vertical 3D pillar strata, and the floating tag pill
      const dx = Math.abs(worldX - pos.x);
      const withinColumnX = dx <= 75; // Forgiving hit test for dynamic pill width
      const withinColumnY = worldY >= (pos.y - totalColHeight - 52) && worldY <= (pos.y + 24);

      const baseDistance = Math.hypot(pos.x - worldX, pos.y - worldY);

      if ((withinColumnX && withinColumnY) || baseDistance <= 42) {
        return r;
      }
    }
    return null;
  }

  // --- Main Render Pipeline ---
  public render(
    gameState: GameState,
    activeOverlay: HeatmapOverlay = 'normal',
    hoveredCoord: GridCoord | null = null,
    activeTool: ActiveTool = 'inspect'
  ) {
    this.animTick += 0.03;
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // 1. Deep Space Dark Blueprint Grid Background
    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, w, h);

    // Subtle isometric tech grid pattern
    this.drawBackgroundGrid(ctx, w, h);

    ctx.save();
    // Apply Camera Transform
    ctx.translate(this.cameraX, this.cameraY);
    ctx.scale(this.zoom, this.zoom);

    const regions = computeRegionalMetrics(gameState);

    // 2. Render Accurate Low-Contrast Tactical Flat Map of Japan (North UP)
    this.renderFlatJapanMap(ctx, gameState);

    // 3. Render Macro Island Archipelago of Japan (8 Prefectural Bars at exact Geo Coordinates)
    this.renderArchipelago(ctx, gameState, regions, activeOverlay, hoveredCoord);

    ctx.restore();
  }

  // --- Background Blueprint Grid ---
  private drawBackgroundGrid(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.save();
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
    ctx.lineWidth = 1;

    const gridSize = 40;
    const offsetX = ((this.cameraX % gridSize) + gridSize) % gridSize;
    const offsetY = ((this.cameraY % gridSize) + gridSize) % gridSize;

    ctx.beginPath();
    for (let x = offsetX; x < w; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = offsetY; y < h; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();

    // Radial vignette shadow
    const radial = ctx.createRadialGradient(w / 2, h / 2, w * 0.2, w / 2, h / 2, w * 0.8);
    radial.addColorStop(0, 'rgba(6, 10, 18, 0)');
    radial.addColorStop(1, 'rgba(2, 4, 8, 0.7)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, w, h);

    ctx.restore();
  }

  // --- Render High-Precision Low-Contrast Tactical Flat Map of Japan (NORTH UP) ---
  private renderFlatJapanMap(ctx: CanvasRenderingContext2D, gameState: GameState) {
    const lang = gameState.language;
    ctx.save();

    // --- Latitude & Longitude Graticule (North UP) ---
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.07)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);

    const latitudes = [30, 32, 34, 36, 38, 40, 42, 44, 46];
    const longitudes = [128, 130, 132, 134, 136, 138, 140, 142, 144, 146];

    for (const lat of latitudes) {
      const p1 = geoToScreen(126, lat);
      const p2 = geoToScreen(148, lat);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      ctx.font = '7.5px "Share Tech Mono", monospace';
      ctx.fillStyle = 'rgba(71, 85, 105, 0.35)';
      ctx.textAlign = 'left';
      ctx.fillText(`${lat}°N`, p2.x + 8, p2.y + 3);
    }

    for (const lon of longitudes) {
      const p1 = geoToScreen(lon, 28);
      const p2 = geoToScreen(lon, 47);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      ctx.font = '7.5px "Share Tech Mono", monospace';
      ctx.fillStyle = 'rgba(71, 85, 105, 0.35)';
      ctx.textAlign = 'center';
      ctx.fillText(`${lon}°E`, p2.x, p2.y - 6);
    }
    ctx.setLineDash([]);

    // Base fill colors for low-contrast dark slate gray archipelago landmass
    const landFill = '#0f172a';
    const landStroke = 'rgba(71, 85, 105, 0.75)';
    const landGlow = 'rgba(56, 189, 248, 0.18)';

    const drawGeoPolygon = (pts: [number, number][], fill: string = landFill) => {
      if (pts.length < 3) return;
      ctx.beginPath();
      const first = geoToScreen(pts[0][0], pts[0][1]);
      ctx.moveTo(first.x, first.y);
      for (let i = 1; i < pts.length; i++) {
        const pt = geoToScreen(pts[i][0], pts[i][1]);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.shadowColor = landGlow;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = landStroke;
      ctx.lineWidth = 1.3;
      ctx.stroke();
    };

    // --- 1. HOKKAIDO (北海道) - High Precision Coastline ---
    const hokkaidoPts: [number, number][] = [
      [141.93, 45.52], // Cape Soya (North)
      [142.58, 44.93], // Esashi
      [143.35, 44.35], // Monbetsu
      [144.27, 44.02], // Abashiri
      [145.34, 44.34], // Cape Shiretoko
      [145.19, 44.02], // Rausu
      [145.38, 43.60], // Notsuke Peninsula
      [145.82, 43.38], // Cape Nosappu (Nemuro)
      [144.85, 43.04], // Akkeshi
      [144.38, 42.98], // Kushiro
      [143.50, 42.55], // Tokachi
      [143.25, 41.92], // Cape Erimo
      [142.77, 42.17], // Urakawa
      [141.90, 42.58], // Shizunai
      [141.60, 42.63], // Tomakomai
      [140.98, 42.31], // Muroran
      [140.78, 42.55], // Toyako / Date
      [140.58, 42.11], // Mori (Uchiura Bay)
      [140.75, 41.76], // Hakodate
      [140.20, 41.39], // Cape Shirakami (Southernmost Hokkaido)
      [140.07, 41.43], // Matsumae
      [140.13, 41.87], // Esashi
      [139.85, 42.45], // Setana
      [140.30, 42.98], // Suttsu
      [140.35, 43.33], // Shakotan Peninsula
      [141.00, 43.19], // Otaru
      [141.35, 43.25], // Ishikari Bay
      [141.64, 43.94], // Rumoi
      [141.75, 44.89], // Teshio
      [141.67, 45.41], // Wakkanai
    ];
    drawGeoPolygon(hokkaidoPts);

    // Hokkaido Mountain Ridge Accent
    const hokkaidoCenter = geoToScreen(142.6, 43.4);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(hokkaidoCenter.x, hokkaidoCenter.y, 22, 0, Math.PI * 2);
    ctx.stroke();

    // --- 2. HONSHU (本州 - Mainland Arc) ---
    const honshuPts: [number, number][] = [
      // Northern Tohoku (Tsugaru & Shimokita)
      [140.34, 41.26], // Cape Tappi (Tsugaru)
      [140.75, 40.83], // Aomori Bay
      [140.87, 41.00], // Natsudomari Peninsula
      [141.13, 40.86], // Noheji
      [141.21, 41.28], // Mutsu
      [140.91, 41.55], // Cape Oma (Northernmost Honshu)
      [141.46, 41.43], // Cape Shiriyazaki
      [141.42, 40.68], // Misawa
      [141.56, 40.51], // Hachinohe
      [141.78, 40.19], // Kuji
      [142.07, 39.55], // Cape Todogasaki (Easternmost Honshu)
      [141.72, 39.08], // Kamaishi
      [141.58, 38.65], // Kesennuma
      [141.51, 38.29], // Oshika Peninsula
      [141.06, 38.36], // Matsushima / Ishinomaki
      [140.95, 38.17], // Sendai
      [140.97, 37.64], // Soma
      [140.98, 36.99], // Iwaki
      [140.58, 36.31], // Oarai / Ibaraki
      [140.67, 35.85], // Kashima-nada
      [140.87, 35.70], // Cape Inubosaki (Choshi)
      [140.45, 35.35], // Kujukuri
      [140.15, 35.10], // Katsuura
      [139.89, 34.90], // Cape Nojimazaki (Boso Tip)
      [139.75, 34.97], // Tateyama
      [139.81, 35.31], // Futtsu Point
      [140.04, 35.65], // Chiba
      [139.77, 35.63], // Tokyo Waterfront
      [139.65, 35.45], // Yokohama
      [139.70, 35.28], // Yokosuka
      [139.61, 35.13], // Miura Peninsula / Jogashima
      [139.48, 35.30], // Shonan / Enoshima
      [139.16, 35.25], // Odawara
      [139.07, 34.97], // Atami / Ito
      [138.95, 34.68], // Shimoda
      [138.85, 34.60], // Cape Irozaki (Izu Tip)
      [138.78, 34.90], // West Izu
      [138.65, 35.14], // Numazu / Fuji
      [138.52, 35.00], // Shizuoka / Shimizu
      [138.23, 34.60], // Cape Omaezaki
      [137.58, 34.68], // Hamamatsu
      [137.02, 34.58], // Cape Irago (Atsumi)
      [137.22, 34.82], // Mikawa Bay
      [136.96, 34.70], // Chita Peninsula (Morozaki)
      [136.88, 35.08], // Nagoya Port
      [136.52, 34.72], // Yokkaichi / Tsu
      [136.84, 34.48], // Ise / Toba
      [136.89, 34.28], // Cape Daio (Ago Bay)
      [136.10, 33.89], // Owase / Kumano
      [135.95, 33.63], // Shingu
      [135.76, 33.43], // Cape Shionomisaki (Southernmost Honshu)
      [135.34, 33.68], // Shirahama
      [135.15, 33.86], // Tanabe / Gobo
      [135.06, 33.88], // Cape Hinomisaki
      [135.14, 34.26], // Wakayama City
      [135.42, 34.65], // Osaka Port
      [135.20, 34.68], // Kobe Port
      [134.98, 34.64], // Akashi
      [134.46, 34.79], // Himeji / Aioi
      [133.95, 34.49], // Okayama
      [133.75, 34.52], // Kurashiki
      [133.20, 34.40], // Fukuyama / Onomichi
      [132.55, 34.23], // Kure
      [132.32, 34.30], // Hiroshima Bay / Miyajima
      [132.12, 33.96], // Iwakuni / Yanai
      [131.80, 34.03], // Tokuyama
      [131.28, 33.94], // Ube
      [130.93, 33.95], // Shimonoseki (Kanmon Strait)
      // Sea of Japan Coast
      [130.86, 34.35], // Nagato / Tsunoshima
      [131.41, 34.45], // Hagi
      [132.08, 34.89], // Hamada
      [132.48, 35.19], // Oda
      [132.63, 35.43], // Cape Hinomisaki (Izumo)
      [133.05, 35.47], // Matsue
      [133.32, 35.57], // Cape Jizozaki (Shimane Peninsula)
      [133.34, 35.45], // Sakaiminato / Yonago
      [133.62, 35.51], // Daisen Coast
      [134.23, 35.54], // Tottori Sand Dunes
      [134.62, 35.64], // Uradome / Kasumi
      [134.82, 35.65], // Toyooka / Kinosaki
      [135.22, 35.77], // Cape Kyogamisaki (Tango Peninsula)
      [135.38, 35.48], // Maizuru
      [135.75, 35.50], // Wakasa Bay (Obama)
      [136.03, 35.76], // Tsuruga
      [135.96, 35.98], // Echizen Coast
      [136.13, 36.24], // Tojinbo / Fukui
      [136.40, 36.35], // Kaga
      [136.65, 36.70], // Kanazawa / Hakui
      [136.68, 37.05], // Shika (West Noto)
      [136.73, 37.33], // Wajima
      [137.36, 37.52], // Cape Rokkozaki (Noto Tip)
      [137.05, 37.08], // Nanao Bay / Suzu
      [137.00, 36.85], // Himi
      [137.22, 36.76], // Toyama City
      [137.85, 37.04], // Itoigawa / Kurobe
      [138.25, 37.18], // Joetsu
      [138.75, 37.64], // Kashiwazaki
      [139.06, 37.95], // Niigata Port
      [139.45, 38.38], // Murakami
      [139.82, 38.92], // Sakata / Shonai
      [139.90, 39.21], // Kisakata
      [140.05, 39.75], // Akita City
      [139.70, 39.99], // Oga Peninsula (Cape Nyudozaki)
      [140.02, 40.21], // Noshiro
      [139.92, 40.65], // Fukaura (Shirakami Coast)
      [140.32, 40.95], // Ajigasawa / Tsugaru West
    ];
    drawGeoPolygon(honshuPts);

    // Lake Biwa (琵琶湖 - Interior water cutout)
    const biwaPos = geoToScreen(136.08, 35.25);
    ctx.beginPath();
    ctx.ellipse(biwaPos.x, biwaPos.y, 8, 15, -0.3, 0, Math.PI * 2);
    ctx.fillStyle = '#060a12';
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Sado Island (佐渡島)
    const sadoPts: [number, number][] = [
      [138.20, 38.28], // Hajikizaki (North)
      [138.52, 38.10], // Ryotsu Bay
      [138.60, 37.85], // Ogi (South)
      [138.30, 37.80], // Sawazaki
      [138.22, 38.05], // Aikawa
    ];
    drawGeoPolygon(sadoPts);

    // Awaji Island (淡路島)
    const awajiPts: [number, number][] = [
      [135.02, 34.60], // Iwaya (Akashi Strait)
      [134.95, 34.35], // Sumoto
      [134.78, 34.22], // Fukura (Naruto Strait)
      [134.68, 34.40], // Goshiki
    ];
    drawGeoPolygon(awajiPts);

    // --- 3. SHIKOKU (四国) ---
    const shikokuPts: [number, number][] = [
      [134.61, 34.23], // Naruto Strait
      [134.58, 34.00], // Tokushima
      [134.75, 33.83], // Cape Gamoda
      [134.42, 33.64], // Hiwasa
      [134.18, 33.25], // Cape Muroto
      [133.78, 33.51], // Aki
      [133.56, 33.50], // Kochi / Urado
      [133.28, 33.32], // Susaki
      [132.95, 32.78], // Tosashimizu
      [133.02, 32.72], // Cape Ashizuri (Southernmost Shikoku)
      [132.70, 32.92], // Sukumo Bay
      [132.55, 32.96], // Ainan
      [132.56, 33.22], // Uwajima
      [132.42, 33.46], // Yawatahama
      [132.01, 33.34], // Sadamisaki Peninsula Tip
      [132.48, 33.61], // Nagahama
      [132.71, 33.85], // Matsuyama
      [132.78, 34.03], // Hojo
      [133.00, 34.07], // Imabari
      [133.28, 33.98], // Niihama / Saijo
      [133.55, 34.01], // Shikokuchuo
      [133.65, 34.13], // Kanonji
      [133.85, 34.32], // Sakaide / Marugame
      [134.05, 34.35], // Takamatsu / Yashima
      [134.25, 34.25], // Sanuki / Higashikagawa
    ];
    drawGeoPolygon(shikokuPts);

    // --- 4. KYUSHU & ISLANDS (九州・沖縄) ---
    const kyushuPts: [number, number][] = [
      [130.96, 33.95], // Mojiko / Kitakyushu
      [130.85, 33.90], // Kokura
      [130.54, 33.82], // Munakata
      [130.36, 33.60], // Fukuoka / Hakata Bay
      [130.10, 33.60], // Itoshima Peninsula
      [129.89, 33.54], // Karatsu / Yobuko
      [129.70, 33.34], // Imari / Matsuura
      [129.58, 33.34], // Hirado Strait
      [129.67, 33.15], // Sasebo
      [129.62, 32.96], // Saikai / Omura Bay
      [129.86, 32.74], // Nagasaki Port
      [129.75, 32.58], // Cape Nomo (Nagasaki Tip)
      [129.91, 32.71], // Mogi
      [130.25, 32.80], // Shimabara Peninsula
      [130.19, 32.61], // Minamishimabara
      [130.37, 32.78], // Shimabara City
      [130.55, 32.92], // Omuta
      [130.61, 32.76], // Kumamoto Port
      [130.47, 32.62], // Uto Peninsula / Misumi
      [130.56, 32.48], // Yatsushiro
      [130.39, 32.22], // Minamata
      [130.19, 32.02], // Akune / Izumi
      [130.18, 31.81], // Satsumasendai
      [130.27, 31.60], // Fukiagehama
      [130.29, 31.27], // Makurazaki
      [130.52, 31.15], // Cape Nagasakibana
      [130.64, 31.24], // Ibusuki
      [130.56, 31.59], // Kagoshima Port / Sakurajima
      [130.63, 31.72], // Kirishima
      [130.70, 31.42], // Kanoya / Tarumizu
      [130.66, 30.99], // Cape Sata (Southernmost Kyushu)
      [131.08, 31.28], // Uchinoura
      [131.34, 31.36], // Cape Toi
      [131.40, 31.58], // Nichinan / Aburatsu
      [131.46, 31.91], // Miyazaki Port
      [131.64, 32.42], // Hyuga
      [131.68, 32.58], // Nobeoka
      [131.90, 32.98], // Saiki
      [131.81, 33.12], // Usuki
      [131.70, 33.25], // Saganoseki
      [131.50, 33.30], // Beppu / Oita
      [131.68, 33.65], // Kunisaki Peninsula
      [131.20, 33.60], // Nakatsu / Usa
      [131.00, 33.72], // Yukuhashi
    ];
    drawGeoPolygon(kyushuPts);

    // Tanegashima & Yakushima (種子島・屋久島)
    const tanePos = geoToScreen(130.95, 30.55);
    ctx.beginPath();
    ctx.ellipse(tanePos.x, tanePos.y, 4, 12, 0.2, 0, Math.PI * 2);
    ctx.fillStyle = landFill;
    ctx.fill();
    ctx.strokeStyle = landStroke;
    ctx.stroke();

    const yakuPos = geoToScreen(130.52, 30.34);
    ctx.beginPath();
    ctx.arc(yakuPos.x, yakuPos.y, 7, 0, Math.PI * 2);
    ctx.fillStyle = landFill;
    ctx.fill();
    ctx.strokeStyle = landStroke;
    ctx.stroke();

    // Tsushima Island (対馬)
    const tsuPos = geoToScreen(129.32, 34.38);
    ctx.beginPath();
    ctx.ellipse(tsuPos.x, tsuPos.y, 5, 14, -0.4, 0, Math.PI * 2);
    ctx.fillStyle = landFill;
    ctx.fill();
    ctx.strokeStyle = landStroke;
    ctx.stroke();

    ctx.restore();
  }

  // --- Render 8 Regional Demographic Bars of Japan at Exact Geo Coordinates ---
  private renderArchipelago(
    ctx: CanvasRenderingContext2D,
    gameState: GameState,
    regions: RegionalMetricData[],
    overlay: HeatmapOverlay,
    hoveredCoord: GridCoord | null
  ) {
    const lang = gameState.language;

    // Draw connecting sub-sea high-speed rail / data fiber lines along actual Shinkansen spine
    this.drawInfrastructureLinks(ctx, regions);

    // Sort regions by Latitude descending (North to South) so North renders in background, South in foreground
    const sortedRegions = [...regions].sort((a, b) => b.lat - a.lat);

    for (const region of sortedRegions) {
      const pos = geoToScreen(region.lon, region.lat);
      const isHovered = this.hoveredRegionId === region.id;
      const isSelected = this.selectedRegionId === region.id;

      // Base footprint: 2.5D Hexagonal / Diamond Platform
      const blockWidth = 64;
      const blockHeight = 32;

      // Total column height maps to population size
      const maxPop = 45; // Kanto is ~43M
      const baseHeight = 20;
      const popHeight = (region.populationMillions / maxPop) * 150 + baseHeight;

      // Tier heights for Youth, Working, Elderly
      const youthH = (region.youthRatio / 100) * popHeight;
      const workingH = (region.workingRatio / 100) * popHeight;
      const elderlyH = (region.elderlyRatio / 100) * popHeight;

      ctx.save();
      ctx.translate(pos.x, pos.y);

      // Draw Base Island Pedestal
      this.drawIsoBlock(
        ctx,
        0,
        0,
        blockWidth,
        blockHeight,
        10,
        '#0f172a',
        '#1e293b',
        '#090d16',
        isHovered || isSelected ? '#38bdf8' : '#334155'
      );

      // Draw Stacked Demographic Strata (North UP: Heights rise along -Y)
      // Tier 1 (Base): Youth (0–14)
      const youthFill = overlay === 'youth' ? '#06b6d4' : overlay === 'fertility' ? (region.tfr >= 1.3 ? '#10b981' : region.tfr >= 1.1 ? '#f59e0b' : '#ef4444') : '#0284c7';
      const youthSide = overlay === 'youth' ? '#0891b2' : '#0369a1';
      const youthDark = overlay === 'youth' ? '#164e63' : '#082f49';
      const youthGlow = overlay === 'youth' ? '#22d3ee' : '#38bdf8';

      this.drawIsoBlock(
        ctx,
        0,
        -10,
        blockWidth * 0.85,
        blockHeight * 0.85,
        youthH,
        youthFill,
        youthSide,
        youthDark,
        youthGlow
      );

      // Tier 2 (Middle): Working Age (15–64)
      const workFill = overlay === 'productivity' ? '#10b981' : '#2563eb';
      const workSide = overlay === 'productivity' ? '#059669' : '#1d4ed8';
      const workDark = overlay === 'productivity' ? '#064e3b' : '#172554';
      const workGlow = overlay === 'productivity' ? '#34d399' : '#60a5fa';

      this.drawIsoBlock(
        ctx,
        0,
        -10 - youthH,
        blockWidth * 0.85,
        blockHeight * 0.85,
        workingH,
        workFill,
        workSide,
        workDark,
        workGlow
      );

      // Tier 3 (Top): Elderly (65+)
      const elderlyFill = overlay === 'akiya' ? '#f43f5e' : '#8b5cf6';
      const elderlySide = overlay === 'akiya' ? '#e11d48' : '#7c3aed';
      const elderlyDark = overlay === 'akiya' ? '#881337' : '#2e1065';
      const elderlyGlow = overlay === 'akiya' ? '#fb7185' : '#c084fc';

      this.drawIsoBlock(
        ctx,
        0,
        -10 - youthH - workingH,
        blockWidth * 0.85,
        blockHeight * 0.85,
        elderlyH,
        elderlyFill,
        elderlySide,
        elderlyDark,
        elderlyGlow
      );

      // Top Cap Glow Outline
      const totalColHeight = 10 + youthH + workingH + elderlyH;

      if (isHovered || isSelected || overlay !== 'normal') {
        const glowColor =
          overlay === 'youth'
            ? '#06b6d4'
            : overlay === 'akiya'
            ? '#f43f5e'
            : overlay === 'productivity'
            ? '#10b981'
            : overlay === 'fertility'
            ? (region.tfr >= 1.3 ? '#10b981' : region.tfr >= 1.1 ? '#f59e0b' : '#ef4444')
            : '#38bdf8';

        ctx.strokeStyle = glowColor;
        ctx.lineWidth = isHovered || isSelected ? 2.5 : 1.5;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = isHovered || isSelected ? 15 : 8;
        this.drawIsoTopPolygon(ctx, 0, -totalColHeight, blockWidth * 0.85, blockHeight * 0.85);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Floating 3D Holographic Label & Metric HUD (with integrated sentiment badge)
      this.drawRegionLabelTag(
        ctx,
        region,
        totalColHeight,
        lang,
        overlay,
        isHovered || isSelected
      );

      ctx.restore();
    }
  }

  // --- Initialize Randomized Transit Dots Across the Archipelago ---
  private initTransitDots() {
    const palette = [
      { color: '#38bdf8', glow: '#0284c7' }, // Cyan
      { color: '#60a5fa', glow: '#2563eb' }, // Sky Blue
      { color: '#34d399', glow: '#059669' }, // Emerald
      { color: '#a78bfa', glow: '#7c3aed' }, // Purple
      { color: '#fde047', glow: '#d97706' }, // Amber
      { color: '#22d3ee', glow: '#0891b2' }, // Electric Cyan
      { color: '#f472b6', glow: '#db2777' }, // Pink
      { color: '#e0f2fe', glow: '#38bdf8' }, // Starlight White
    ];

    // Initial distribution ensuring bidirectional transit across all regions, prominently featuring Shikoku and cross-country links
    const initialPairs: [PrefecturalRegionId, PrefecturalRegionId][] = [
      ['shikoku', 'kyushu'],   // Shikoku to Kyushu (Bungo Channel corridor)
      ['kyushu', 'shikoku'],   // Kyushu to Shikoku
      ['kansai', 'kanto'],     // Direct Kansai to Kanto transit
      ['kanto', 'kansai'],     // Direct Kanto to Kansai transit
      ['chubu', 'tohoku'],     // Direct Chubu to Tohoku transit
      ['tohoku', 'chubu'],     // Direct Tohoku to Chubu transit
      ['shikoku', 'kansai'],   // Leaving Shikoku towards Kansai
      ['chugoku', 'shikoku'],  // Crossing into Shikoku via Seto Inland bridge
      ['hokkaido', 'tohoku'],  // North to South
      ['kanto', 'chubu'],      // East to West
      ['kyushu', 'chugoku'],   // South to North
      ['kansai', 'shikoku'],   // Crossing into Shikoku via Akashi-Naruto bridge
    ];

    this.transitDots = initialPairs.map((pair, idx) => {
      const p = palette[idx % palette.length];
      return {
        id: idx,
        fromId: pair[0],
        toId: pair[1],
        progress: (idx * 0.12) % 1.0,
        speed: 0.005 + (idx % 4) * 0.002,
        color: p.color,
        glowColor: p.glow,
        size: 3.5 + (idx % 3) * 0.5,
        trail: [],
      };
    });
  }

  // --- Pick Next Connected City Destination ---
  private pickNextDestination(currentId: PrefecturalRegionId, previousId?: PrefecturalRegionId): PrefecturalRegionId {
    const neighbors = REGIONAL_ADJACENCY[currentId] || [];
    if (neighbors.length === 0) return currentId;
    if (neighbors.length === 1) return neighbors[0];

    // If previous origin exists, 80% chance to continue forward to another neighbor rather than immediately reversing
    if (previousId && neighbors.includes(previousId) && Math.random() < 0.8) {
      const forward = neighbors.filter(n => n !== previousId);
      if (forward.length > 0) {
        return forward[Math.floor(Math.random() * forward.length)];
      }
    }

    return neighbors[Math.floor(Math.random() * neighbors.length)];
  }

  // --- Draw High-Speed Transport & Optical Infrastructure Links (Multi-City Network) ---
  private drawInfrastructureLinks(ctx: CanvasRenderingContext2D, regions: RegionalMetricData[]) {
    ctx.save();
    ctx.lineWidth = 2;

    const rMap = new Map<PrefecturalRegionId, RegionalMetricData>();
    for (const r of regions) rMap.set(r.id, r);

    // 1. Draw dashed infrastructure connection lines across all regional links (including Shikoku)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.setLineDash([4, 4]);

    for (const edge of NETWORK_EDGES) {
      const rA = rMap.get(edge.from);
      const rB = rMap.get(edge.to);
      if (rA && rB) {
        const pA = geoToScreen(rA.lon, rA.lat);
        const pB = geoToScreen(rB.lon, rB.lat);
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pB.y);
        ctx.stroke();
      }
    }
    ctx.setLineDash([]);

    // 2. Render & update station arrival ripples
    for (let i = this.stationPulses.length - 1; i >= 0; i--) {
      const pulse = this.stationPulses[i];
      pulse.radius += 0.45;
      pulse.opacity -= 0.025;
      if (pulse.opacity <= 0 || pulse.radius >= pulse.maxRadius) {
        this.stationPulses.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.strokeStyle = pulse.color;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = Math.max(0, pulse.opacity);
      ctx.beginPath();
      ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 3. Initialize transit dots if needed
    if (this.transitDots.length === 0) {
      this.initTransitDots();
    }

    const allRegions: PrefecturalRegionId[] = [
      'kyushu', 'chugoku', 'shikoku', 'kansai', 'chubu', 'kanto', 'tohoku', 'hokkaido'
    ];

    // 4. Update and render animated transit dots moving city-to-city in any direction
    for (const dot of this.transitDots) {
      dot.progress += dot.speed;

      if (dot.progress >= 1.0) {
        // Arrived at destination city!
        const arrivalRegion = rMap.get(dot.toId);
        if (arrivalRegion) {
          const p = geoToScreen(arrivalRegion.lon, arrivalRegion.lat);
          this.stationPulses.push({
            x: p.x,
            y: p.y,
            radius: 4,
            maxRadius: 16,
            opacity: 0.6,
            color: dot.color,
          });
        }

        const prevFrom = dot.fromId;
        const arrivedCity = dot.toId;

        // 15% chance to reposition at a new random city to keep regional distribution active and unpredictable
        if (Math.random() < 0.15) {
          const randOrigin = allRegions[Math.floor(Math.random() * allRegions.length)];
          dot.fromId = randOrigin;
          dot.toId = this.pickNextDestination(randOrigin);
        } else {
          dot.fromId = arrivedCity;
          dot.toId = this.pickNextDestination(arrivedCity, prevFrom);
        }

        dot.progress = 0;
        dot.speed = 0.005 + Math.random() * 0.006;
        dot.trail = [];
      }

      const rFrom = rMap.get(dot.fromId);
      const rTo = rMap.get(dot.toId);
      if (rFrom && rTo) {
        const pA = geoToScreen(rFrom.lon, rFrom.lat);
        const pB = geoToScreen(rTo.lon, rTo.lat);
        const curX = pA.x + (pB.x - pA.x) * dot.progress;
        const curY = pA.y + (pB.y - pA.y) * dot.progress;

        // Keep position history for trailing effect
        dot.trail.push({ x: curX, y: curY });
        if (dot.trail.length > 5) {
          dot.trail.shift();
        }

        // Draw motion trail behind the moving dot
        for (let t = 0; t < dot.trail.length - 1; t++) {
          const pt = dot.trail[t];
          const trailAlpha = ((t + 1) / dot.trail.length) * 0.4;
          ctx.save();
          ctx.fillStyle = dot.color;
          ctx.globalAlpha = trailAlpha;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, dot.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Glowing transit dot
        ctx.save();
        ctx.fillStyle = dot.color;
        ctx.shadowColor = dot.glowColor;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(curX, curY, dot.size, 0, Math.PI * 2);
        ctx.fill();

        // High-contrast luminous white inner core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(curX, curY, dot.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    ctx.restore();
  }

  // --- Draw 3D Isometric / Diamond Block ---
  private drawIsoBlock(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    width: number,
    height: number,
    depth: number,
    topColor: string,
    leftColor: string,
    rightColor: string,
    strokeColor: string
  ) {
    const hw = width / 2;
    const hh = height / 2;

    // 1. Left Vertical Face
    ctx.fillStyle = leftColor;
    ctx.beginPath();
    ctx.moveTo(cx - hw, cy);
    ctx.lineTo(cx, cy + hh);
    ctx.lineTo(cx, cy + hh - depth);
    ctx.lineTo(cx - hw, cy - depth);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // 2. Right Vertical Face
    ctx.fillStyle = rightColor;
    ctx.beginPath();
    ctx.moveTo(cx, cy + hh);
    ctx.lineTo(cx + hw, cy);
    ctx.lineTo(cx + hw, cy - depth);
    ctx.lineTo(cx, cy + hh - depth);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 3. Top Diamond Face
    ctx.fillStyle = topColor;
    this.drawIsoTopPolygon(ctx, cx, cy - depth, width, height);
    ctx.fill();
    ctx.stroke();
  }

  private drawIsoTopPolygon(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    width: number,
    height: number
  ) {
    const hw = width / 2;
    const hh = height / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - hh);
    ctx.lineTo(cx + hw, cy);
    ctx.lineTo(cx, cy + hh);
    ctx.lineTo(cx - hw, cy);
    ctx.closePath();
  }

  // --- Floating Demographic Tag & Metrics HUD (Unified Holographic Tag with Integrated Emotion Status) ---
  private drawRegionLabelTag(
    ctx: CanvasRenderingContext2D,
    region: RegionalMetricData,
    height: number,
    lang: 'en' | 'ja',
    overlay: HeatmapOverlay,
    isHighlighted: boolean
  ) {
    ctx.save();

    const tagY = -height - 24;
    const title = region.name[lang];

    let sub = `${region.populationMillions.toFixed(2)}M • TFR ${region.tfr.toFixed(2)}`;
    let subColor = region.tfr >= 1.3 ? '#34d399' : region.tfr >= 1.1 ? '#fbbf24' : '#f87171';

    if (overlay === 'youth') {
      sub = lang === 'en' ? `Youth ${region.youthRatio.toFixed(1)}% • Daycare Focus` : `年少比率 ${region.youthRatio.toFixed(1)}% • 育児重点`;
      subColor = '#06b6d4';
    } else if (overlay === 'akiya') {
      sub = lang === 'en' ? `Akiya ${region.akiyaRate.toFixed(1)}% • ${region.elderlyRatio.toFixed(1)}% 65+` : `空き家 ${region.akiyaRate.toFixed(1)}% • 高齢化 ${region.elderlyRatio.toFixed(1)}%`;
      subColor = region.akiyaRate > 15 ? '#f43f5e' : '#fbbf24';
    } else if (overlay === 'productivity') {
      sub = lang === 'en' ? `¥${region.economicOutputTrillion.toFixed(1)}T GDP • Hope ${region.hopeIndex.toFixed(1)}` : `域内GDP ¥${region.economicOutputTrillion.toFixed(1)}兆 • 希望 ${region.hopeIndex.toFixed(1)}`;
      subColor = '#10b981';
    } else if (overlay === 'fertility') {
      sub = lang === 'en' ? `TFR ${region.tfr.toFixed(2)} • ${region.populationMillions.toFixed(2)}M Pop` : `出生率 ${region.tfr.toFixed(2)} • 人口 ${region.populationMillions.toFixed(2)}百万人`;
      subColor = region.tfr >= 1.3 ? '#34d399' : region.tfr >= 1.1 ? '#fbbf24' : '#f87171';
    }

    const emoji = region.sentimentStatus === 'happy' ? '😊' : region.sentimentStatus === 'neutral' ? '😐' : '😟';
    const statusColor = region.sentimentStatus === 'happy' ? '#10b981' : region.sentimentStatus === 'neutral' ? '#f59e0b' : '#ef4444';

    // Measure text to dynamically size the pill and prevent any text overflow
    ctx.font = 'bold 10px "Chakra Petch", "Share Tech Mono", sans-serif';
    const titleWidth = ctx.measureText(title).width;
    ctx.font = '8.5px "Share Tech Mono", monospace';
    const subWidth = ctx.measureText(sub).width;
    const maxTextWidth = Math.max(titleWidth, subWidth);

    // Pill width: 28px for emoji badge + text width + 18px right padding
    const pillWidth = Math.max(120, Math.ceil(maxTextWidth + 46));
    const pillHeight = 28;
    const halfW = pillWidth / 2;
    const halfH = pillHeight / 2;

    // 1. Tag Background Pill
    ctx.fillStyle = isHighlighted ? 'rgba(15, 23, 42, 0.96)' : 'rgba(15, 23, 42, 0.88)';
    ctx.strokeStyle = isHighlighted ? '#38bdf8' : 'rgba(71, 85, 105, 0.75)';
    ctx.lineWidth = isHighlighted ? 1.5 : 1;

    if (isHighlighted) {
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
    }

    ctx.beginPath();
    ctx.roundRect(-halfW, tagY - halfH, pillWidth, pillHeight, 6);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Small connector pointer downwards towards pillar top
    ctx.beginPath();
    ctx.moveTo(-4, tagY + halfH);
    ctx.lineTo(0, tagY + halfH + 4);
    ctx.lineTo(4, tagY + halfH);
    ctx.closePath();
    ctx.fillStyle = isHighlighted ? 'rgba(15, 23, 42, 0.96)' : 'rgba(15, 23, 42, 0.88)';
    ctx.fill();
    ctx.strokeStyle = isHighlighted ? '#38bdf8' : 'rgba(71, 85, 105, 0.75)';
    ctx.stroke();

    // 2. Left Sentiment Badge (Circular glowing indicator + emoji)
    const orbX = -halfW + 15;
    const orbY = tagY;
    ctx.fillStyle = statusColor;
    ctx.shadowColor = statusColor;
    ctx.shadowBlur = isHighlighted ? 8 : 4;
    ctx.beginPath();
    ctx.arc(orbX, orbY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.font = '9.5px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, orbX, orbY);

    // 3. Right Text Lines (Region Title & Metrics)
    const textLeft = -halfW + 28;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    // Region Name
    ctx.font = 'bold 10px "Chakra Petch", "Share Tech Mono", sans-serif';
    ctx.fillStyle = isHighlighted ? '#38bdf8' : '#f8fafc';
    ctx.fillText(title, textLeft, tagY - 2);

    // Subtitle (Pop + TFR or overlay metric)
    ctx.font = '8.5px "Share Tech Mono", monospace';
    ctx.fillStyle = subColor;
    ctx.fillText(sub, textLeft, tagY + 8);

    ctx.restore();
  }

  // --- Render Connecting Base Plinth for Executive Twin Monoliths (Off-Map Northwest: Eurasian Deck) ---
  private renderExecutivePillarsBase(ctx: CanvasRenderingContext2D, gameState: GameState) {
    ctx.save();

    // Off-map command deck placed at North-West (-230, -180)
    const baseCenter = { x: -230, y: -180 };
    ctx.translate(baseCenter.x, baseCenter.y);

    const fiscalPos = { x: -65, y: 0 };
    const hopePos = { x: 65, y: 0 };

    // Telemetry data link beam between the two pillars
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(fiscalPos.x, fiscalPos.y);
    ctx.lineTo(hopePos.x, hopePos.y);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.restore();
  }

  // --- Render 3D Youth Hope Monolith (Off-Map Twin Pair - Right) ---
  private renderSentimentMonolith(ctx: CanvasRenderingContext2D, gameState: GameState) {
    const { youthHopeIndex, lowFertilityTrapActive, synergyBonusActive } = gameState.demographics;
    const lang = gameState.language;
    // Off-map Northwest twin pair right position: (-230 + 65, -180) = (-165, -180)
    const pos = { x: -165, y: -180 };

    ctx.save();
    ctx.translate(pos.x, pos.y);

    const hopeHeight = 30 + (youthHopeIndex / 100) * 95;
    const color = youthHopeIndex >= 70 ? '#10b981' : youthHopeIndex >= 40 ? '#f59e0b' : '#ef4444';
    const topGlow = youthHopeIndex >= 70 ? '#34d399' : youthHopeIndex >= 40 ? '#fbbf24' : '#f87171';

    // Pedestal
    this.drawIsoBlock(ctx, 0, 0, 50, 25, 8, '#0f172a', '#1e293b', '#090d16', '#334155');

    // Hope Pillar
    this.drawIsoBlock(ctx, 0, -8, 38, 19, hopeHeight, topGlow, color, '#7f1d1d', topGlow);

    // Glowing Hologram Beacon (Placed above pillar top)
    const bobY = Math.sin(this.animTick * 3) * 3;
    const beaconY = -8 - hopeHeight - 16 + bobY;
    ctx.fillStyle = topGlow;
    ctx.shadowColor = topGlow;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(0, beaconY, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Beacon Emoji Icon
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(youthHopeIndex >= 70 ? '✨' : youthHopeIndex >= 40 ? '💖' : '💔', 0, beaconY);

    // Hologram Tag Pill (Positioned cleanly ABOVE the beacon with zero overlap)
    const tagCenterY = -8 - hopeHeight - 48;
    const titleText = lang === 'en' ? 'Youth Hope' : '若者希望';
    const scoreText = `${youthHopeIndex.toFixed(1)} / 100 pts`;

    ctx.font = 'bold 9.5px "Chakra Petch", sans-serif';
    const tW = ctx.measureText(titleText).width;
    ctx.font = '8.5px "Share Tech Mono", monospace';
    const sW = ctx.measureText(scoreText).width;
    const pillW = Math.max(96, Math.max(tW, sW) + 24);
    const halfW = pillW / 2;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-halfW, tagCenterY - 14, pillW, 28, 6);
    ctx.fill();
    ctx.stroke();

    // Title
    ctx.font = 'bold 9.5px "Chakra Petch", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(titleText, 0, tagCenterY - 2);

    // Score
    ctx.font = '8.5px "Share Tech Mono", monospace';
    ctx.fillStyle = topGlow;
    ctx.fillText(scoreText, 0, tagCenterY + 9);

    // Dynamic Status Badges positioned cleanly above the tag pill
    if (lowFertilityTrapActive) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(-64, tagCenterY - 34, 128, 16, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fca5a5';
      ctx.font = 'bold 8px "Share Tech Mono", monospace';
      ctx.fillText('🚨 LOW-FERTILITY TRAP', 0, tagCenterY - 23);
    } else if (synergyBonusActive) {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(-64, tagCenterY - 34, 128, 16, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#6ee7b7';
      ctx.font = 'bold 8px "Share Tech Mono", monospace';
      ctx.fillText('✨ 1.25x SYNERGY ACTIVE', 0, tagCenterY - 23);
    }

    ctx.restore();
  }

  // --- Render 3D Fiscal Health Obelisk (Off-Map Twin Pair - Left) ---
  private renderFiscalObelisk(ctx: CanvasRenderingContext2D, gameState: GameState) {
    const { economy } = gameState;
    const lang = gameState.language;
    // Off-map Northwest twin pair left position: (-230 - 65, -180) = (-295, -180)
    const pos = { x: -295, y: -180 };

    ctx.save();
    ctx.translate(pos.x, pos.y);

    const debtScale = Math.min(125, (economy.debtToGDP / 350) * 95 + 25);
    const isCritical = economy.debtToGDP >= 300;

    // Pedestal
    this.drawIsoBlock(ctx, 0, 0, 50, 25, 8, '#0f172a', '#1e293b', '#090d16', '#334155');

    // Debt Pillar
    this.drawIsoBlock(
      ctx,
      0,
      -8,
      38,
      19,
      debtScale,
      isCritical ? '#ef4444' : '#f59e0b',
      isCritical ? '#dc2626' : '#d97706',
      isCritical ? '#7f1d1d' : '#78350f',
      isCritical ? '#f87171' : '#fbbf24'
    );

    // Hologram Tag Pill (Positioned cleanly ABOVE the debt pillar)
    const tagCenterY = -8 - debtScale - 26;
    const titleText = lang === 'en' ? 'Fiscal Solvency' : '国家財政';
    const debtText = `Debt/GDP: ${economy.debtToGDP.toFixed(1)}%`;
    const jgbText = `10Y JGB: ${economy.jgbYield.toFixed(2)}%`;

    ctx.font = 'bold 9.5px "Chakra Petch", sans-serif';
    const tW = ctx.measureText(titleText).width;
    ctx.font = '8px "Share Tech Mono", monospace';
    const dW = ctx.measureText(debtText).width;
    const jW = ctx.measureText(jgbText).width;
    const pillW = Math.max(104, Math.max(tW, dW, jW) + 24);
    const halfW = pillW / 2;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
    ctx.strokeStyle = isCritical ? '#ef4444' : 'rgba(56, 189, 248, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-halfW, tagCenterY - 16, pillW, 32, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 9.5px "Chakra Petch", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(titleText, 0, tagCenterY - 5);

    ctx.font = '8px "Share Tech Mono", monospace';
    ctx.fillStyle = isCritical ? '#f87171' : '#fbbf24';
    ctx.fillText(debtText, 0, tagCenterY + 4);
    ctx.fillText(jgbText, 0, tagCenterY + 12);

    ctx.restore();
  }

  // --- Floating Ambient Particles ---
  private renderAmbientParticles(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
    for (let i = 0; i < 24; i++) {
      const px = Math.sin(this.animTick * 0.7 + i) * 600;
      const py = Math.cos(this.animTick * 0.5 + i * 2) * 400;
      const size = 1 + (i % 3);
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}
