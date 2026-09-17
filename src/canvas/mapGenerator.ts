import { TileData, RegionType, BiomeType, BaseTileType } from '../types/game';

export const MAP_SIZE = 36;

export function generateJapanRegionalMap(width = 36, height = 36): TileData[][] {
  const flatTiles = generateInitialMap();
  const map2D: TileData[][] = [];
  for (let y = 0; y < MAP_SIZE; y++) {
    const row: TileData[] = [];
    for (let x = 0; x < MAP_SIZE; x++) {
      const tile = flatTiles.find((t) => t.x === x && t.y === y) || flatTiles[y * MAP_SIZE + x];
      row.push(tile);
    }
    map2D.push(row);
  }
  return map2D;
}

export function generateInitialMap(): TileData[] {
  const tiles: TileData[] = [];

  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      // Determine Region
      let region: RegionType = 'regional';
      if (x >= 20 && y >= 18) {
        region = 'tokyo';
      } else if (x <= 14 && y <= 16) {
        region = 'rural';
      } else {
        region = 'regional';
      }

      // Determine Biome & Base Tile Type
      let biome: BiomeType = 'flat';
      let baseType: BaseTileType = 'residential_suburb';
      let population = 4000;
      let elderlyRatio = 32;
      let waitlistChildren = 40;
      let localTFR = 1.25;
      let productivityOutput = 100;
      let landValue = 50;

      // Tokyo Bay / Coastal Water
      if ((x >= 32 && y >= 28) || (x >= 28 && y >= 33)) {
        biome = 'water';
        baseType = 'water';
        population = 0;
        elderlyRatio = 0;
        waitlistChildren = 0;
        localTFR = 0;
        productivityOutput = 0;
        landValue = 0;
      }
      // Mountain ridge in far north-west
      else if (x + y <= 8) {
        biome = 'mountain';
        baseType = 'mountain_rock';
        population = 100;
        elderlyRatio = 60;
        waitlistChildren = 0;
        localTFR = 1.35;
        productivityOutput = 10;
        landValue = 15;
      }
      // Rural Chiho region
      else if (region === 'rural') {
        const hash = (x * 7 + y * 13) % 10;
        if (hash < 4) {
          baseType = 'paddy';
          population = 300;
        } else if (hash < 7) {
          baseType = 'rural_village';
          population = 1200;
        } else if (hash < 9) {
          baseType = 'forest';
          population = 50;
        } else {
          baseType = 'commercial_local';
          population = 2000;
        }
        elderlyRatio = 48; // High baseline aging in rural prefectures
        waitlistChildren = 0;
        localTFR = 1.38;
        productivityOutput = 40;
        landValue = 25;
      }
      // Tokyo Megalopolis
      else if (region === 'tokyo') {
        const hash = (x * 11 + y * 17) % 10;
        if ((x === 24 || y === 24) && !(x >= 32 && y >= 28)) {
          baseType = 'road';
          population = 500;
        } else if (hash < 5) {
          baseType = 'residential_high';
          population = 16000;
        } else if (hash < 8) {
          baseType = 'commercial_high';
          population = 12000;
        } else {
          baseType = 'residential_mid';
          population = 9000;
        }
        elderlyRatio = 24;
        waitlistChildren = 150; // Severe Tokyo daycare shortage
        localTFR = 1.04;        // Extreme urban delay penalty
        productivityOutput = 220;
        landValue = 180;
      }
      // Regional Prefectures & Suburbs
      else {
        if (x === 18 || y === 16) {
          baseType = (x === 18) ? 'railway' : 'road';
          population = 600;
        } else {
          const hash = (x * 3 + y * 5) % 10;
          if (hash < 5) {
            baseType = 'residential_suburb';
            population = 5500;
          } else if (hash < 8) {
            baseType = 'residential_mid';
            population = 7500;
          } else {
            baseType = 'commercial_local';
            population = 4500;
          }
        }
        elderlyRatio = 33;
        waitlistChildren = 65;
        localTFR = 1.28;
        productivityOutput = 95;
        landValue = 70;
      }

      // Initial visual feedback states (Akiya in depopulated rural areas, etc.)
      const isAkiya = region === 'rural' && (x + y) % 5 === 0 && baseType === 'rural_village';
      const isShuttered = region === 'rural' && baseType === 'commercial_local' && (x * y) % 3 === 0;

      tiles.push({
        x,
        y,
        region,
        biome,
        baseType,
        building: null,
        isAkiya,
        isShuttered,
        hasDroneService: false,
        hasInternationalFlag: false,
        population,
        elderlyRatio,
        waitlistChildren,
        localTFR,
        productivityOutput,
        landValue,
      });
    }
  }

  // Pre-place a couple of landmark high-speed rails and starter facilities
  const tokyoCentral = tiles.find(t => t.x === 25 && t.y === 22);
  if (tokyoCentral) {
    tokyoCentral.building = 'kodomoen';
    tokyoCentral.buildingYear = 2025;
    tokyoCentral.waitlistChildren = 0;
  }

  const regionalStation = tiles.find(t => t.x === 18 && t.y === 14);
  if (regionalStation) {
    regionalStation.building = 'shinkansen_station';
    regionalStation.buildingYear = 2025;
  }

  return tiles;
}
