import type { PolygonStyle } from "../services/polygon.svc";

/**
 * Extended PolygonStyle with z-index for layering control
 */
export interface PolygonStyleWithLayer extends PolygonStyle {
  zIndex?: number;
}

/**
 * Color configuration for Malaysian states with z-index layering
 * Higher z-index = appears on top when borders overlap
 * 
 * Layer Priority (front to back):
 * 1. Green (z-index: 400) - Pahang, Melaka - HIGHEST PRIORITY
 * 2. Gray (z-index: 300) - Perak, Terengganu
 * 3. Red (z-index: 200) - Kelantan, Kedah, Selangor
 * 4. Blue (z-index: 100) - Johor, Penang, Sabah
 */
export const STATE_COLORS: Record<string, PolygonStyleWithLayer> = {
  // Layer 1: Green (Highest priority - always on top)
  PAHANG: {
    borderColor: "#16A34A",
    fillColor: "#F0FDF4",
    fillOpacity: 0.4,
    zIndex: 400,
  },
  MELAKA: {
    borderColor: "#16A34A",
    fillColor: "#F0FDF4",
    fillOpacity: 0.4,
    zIndex: 400,
  },

  // Layer 2: Gray
  PERAK: {
    borderColor: "#52525B",
    fillColor: "#FAFAFA",
    fillOpacity: 0.4,
    zIndex: 300,
  },
  TERENGGANU: {
    borderColor: "#52525B",
    fillColor: "#FAFAFA",
    fillOpacity: 0.4,
    zIndex: 300,
  },

  // Layer 3: Red
  KELANTAN: {
    borderColor: "#DC2626",
    fillColor: "#FEF2F2",
    fillOpacity: 0.4,
    zIndex: 200,
  },
  KEDAH: {
    borderColor: "#DC2626",
    fillColor: "#FEF2F2",
    fillOpacity: 0.4,
    zIndex: 200,
  },
  SELANGOR: {
    borderColor: "#DC2626",
    fillColor: "#FEF2F2",
    fillOpacity: 0.4,
    zIndex: 200,
  },

  // Layer 4: Blue
  JOHOR: {
    borderColor: "#2563EB",
    fillColor: "#EFF6FF",
    fillOpacity: 0.4,
    zIndex: 100,
  },
  PULAU_PINANG: {
    borderColor: "#2563EB",
    fillColor: "#EFF6FF",
    fillOpacity: 0.4,
    zIndex: 100,
  },
  SABAH: {
    borderColor: "#2563EB",
    fillColor: "#EFF6FF",
    fillOpacity: 0.4,
    zIndex: 100,
  },

  // Other states - use gray as default
  SARAWAK: {
    borderColor: "#52525B",
    fillColor: "#FAFAFA",
    fillOpacity: 0.4,
    zIndex: 300,
  },
  NEGERI_SEMBILAN: {
    borderColor: "#52525B",
    fillColor: "#FAFAFA",
    fillOpacity: 0.4,
    zIndex: 300,
  },
  PERLIS: {
    borderColor: "#52525B",
    fillColor: "#FAFAFA",
    fillOpacity: 0.4,
    zIndex: 300,
  },

  // Wilayah Persekutuan
  WILAYAH_PERSEKUTUAN_KUALA_LUMPUR: {
    borderColor: "#52525B",
    fillColor: "#FAFAFA",
    fillOpacity: 0.4,
    zIndex: 300,
  },
  WILAYAH_PERSEKUTUAN_LABUAN: {
    borderColor: "#2563EB",
    fillColor: "#EFF6FF",
    fillOpacity: 0.4,
    zIndex: 100,
  },
  WILAYAH_PERSEKUTUAN_PUTRAJAYA: {
    borderColor: "#52525B",
    fillColor: "#FAFAFA",
    fillOpacity: 0.4,
    zIndex: 300,
  },
};

/**
 * Get color for a specific state
 * Falls back to default red color if state not found
 */
export const getStateColor = (stateName: string): PolygonStyleWithLayer => {
  const normalizedName = stateName.toUpperCase().replace(/\s+/g, "_");
  const color = STATE_COLORS[normalizedName];
  
  if (!color) {
    console.warn(`[StateColors] No color found for state: "${stateName}" (normalized: "${normalizedName}")`);
    console.warn(`[StateColors] Available states:`, Object.keys(STATE_COLORS));
  }
  
  return (
    color || {
      borderColor: "#FF0000",
      fillColor: "#FEF2F2",
      fillOpacity: 0.25,
      zIndex: 0,
    }
  );
};
