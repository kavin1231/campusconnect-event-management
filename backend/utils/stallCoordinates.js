export const STALL_COORDINATE_MAP = [
  { stallNumber: 1, mapX: 20, mapY: 12 },
  { stallNumber: 2, mapX: 28, mapY: 12 },
  { stallNumber: 3, mapX: 36, mapY: 12 },
  { stallNumber: 4, mapX: 44, mapY: 12 },
  { stallNumber: 5, mapX: 52, mapY: 12 },
  { stallNumber: 6, mapX: 62, mapY: 18 },
  { stallNumber: 7, mapX: 74, mapY: 24 },
  { stallNumber: 8, mapX: 82, mapY: 34 },
  { stallNumber: 9, mapX: 84, mapY: 46 },
  { stallNumber: 10, mapX: 82, mapY: 58 },
  { stallNumber: 11, mapX: 76, mapY: 68 },
  { stallNumber: 12, mapX: 66, mapY: 76 },
  { stallNumber: 13, mapX: 54, mapY: 82 },
  { stallNumber: 14, mapX: 42, mapY: 84 },
  { stallNumber: 15, mapX: 30, mapY: 82 },
  { stallNumber: 16, mapX: 22, mapY: 76 },
  { stallNumber: 17, mapX: 16, mapY: 66 },
  { stallNumber: 18, mapX: 14, mapY: 54 },
  { stallNumber: 19, mapX: 14, mapY: 40 },
  { stallNumber: 20, mapX: 16, mapY: 26 },
];

const coordinateByStallNumber = new Map(
  STALL_COORDINATE_MAP.map((row) => [row.stallNumber, row]),
);

export function getStallCoordinate(stallNumber) {
  const normalized = Number(stallNumber);
  if (!normalized || Number.isNaN(normalized)) {
    return { mapX: 50, mapY: 50 };
  }

  const coordinate = coordinateByStallNumber.get(normalized);
  if (coordinate) {
    return { mapX: coordinate.mapX, mapY: coordinate.mapY };
  }

  // Safe fallback for values outside the predefined 20-stall map.
  const index = Math.max(0, normalized - 1);
  const row = Math.floor(index / 5);
  const col = index % 5;
  return {
    mapX: 12 + col * 18,
    mapY: 16 + row * 18,
  };
}
