export const TILE_WIDTH = 64;
export const TILE_HEIGHT = 32;

export interface ScreenCoord {
  x: number;
  y: number;
}

export interface GridCoord {
  x: number;
  y: number;
}

// Geographic Projection Calibration for Japan Archipelago (+10° Clockwise Rotation to reduce bar overlap)
export const JAPAN_MAP_CENTER_LON = 137.2;
export const JAPAN_MAP_CENTER_LAT = 36.6;
export const GEO_SCALE_Y = 54; // Pixels per degree of latitude
export const GEO_SCALE_X = GEO_SCALE_Y * Math.cos(JAPAN_MAP_CENTER_LAT * (Math.PI / 180)); // ~43.3 px/deg
export const MAP_ROTATION_RAD = (10 * Math.PI) / 180; // 10 degrees clockwise

// Convert Real-World (Lon, Lat) to World Space (x, y) with +10° CW rotation
export function geoToScreen(lon: number, lat: number): ScreenCoord {
  const unrotX = (lon - JAPAN_MAP_CENTER_LON) * GEO_SCALE_X;
  const unrotY = -(lat - JAPAN_MAP_CENTER_LAT) * GEO_SCALE_Y;

  const cosA = Math.cos(MAP_ROTATION_RAD);
  const sinA = Math.sin(MAP_ROTATION_RAD);

  const x = unrotX * cosA - unrotY * sinA;
  const y = unrotX * sinA + unrotY * cosA + 30;
  return { x, y };
}

// Convert World Space (x, y) back to Real-World (Lon, Lat) with inverse rotation
export function screenToGeo(x: number, y: number): { lon: number; lat: number } {
  const adjY = y - 30;
  const cosA = Math.cos(MAP_ROTATION_RAD);
  const sinA = Math.sin(MAP_ROTATION_RAD);

  // Inverse rotation (-10°)
  const unrotX = x * cosA + adjY * sinA;
  const unrotY = -x * sinA + adjY * cosA;

  const lon = unrotX / GEO_SCALE_X + JAPAN_MAP_CENTER_LON;
  const lat = -unrotY / GEO_SCALE_Y + JAPAN_MAP_CENTER_LAT;
  return { lon, lat };
}

// Convert Grid (x, y) to 2.5D Isometric Screen (x, y)
export function gridToScreen(
  gridX: number,
  gridY: number,
  cameraX: number,
  cameraY: number,
  zoom: number = 1
): ScreenCoord {
  const halfW = (TILE_WIDTH / 2) * zoom;
  const halfH = (TILE_HEIGHT / 2) * zoom;
  
  const screenX = (gridX - gridY) * halfW + cameraX;
  const screenY = (gridX + gridY) * halfH + cameraY;
  return { x: screenX, y: screenY };
}

// Convert Screen (x, y) back to Grid (x, y)
export function screenToGrid(
  screenX: number,
  screenY: number,
  cameraX: number,
  cameraY: number,
  zoom: number = 1
): GridCoord {
  const halfW = (TILE_WIDTH / 2) * zoom;
  const halfH = (TILE_HEIGHT / 2) * zoom;
  
  const relX = screenX - cameraX;
  const relY = screenY - cameraY;

  const gridX = (relX / halfW + relY / halfH) / 2;
  const gridY = (relY / halfH - relX / halfW) / 2;

  return {
    x: Math.floor(gridX),
    y: Math.floor(gridY),
  };
}

export function isTileInBounds(x: number, y: number, mapSize: number): boolean {
  return x >= 0 && x < mapSize && y >= 0 && y < mapSize;
}

export function distanceBetweenTiles(t1: GridCoord, t2: GridCoord): number {
  return Math.sqrt(Math.pow(t1.x - t2.x, 2) + Math.pow(t1.y - t2.y, 2));
}
