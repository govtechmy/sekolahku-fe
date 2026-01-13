import type { PolygonStyle } from "../services/polygon.svc";

export interface PolygonStyleWithLayer extends PolygonStyle {
  zIndex?: number;
}

export const STATE_COLORS: Record<string, PolygonStyleWithLayer> = {
  PAHANG: {
    borderColor: "#16A34A",
    fillColor: "#F0FDF4",
    fillOpacity: 0.4,
    zIndex: 300,
  },
  MELAKA: {
    borderColor: "#16A34A",
    fillColor: "#F0FDF4",
    fillOpacity: 0.4,
    zIndex: 300,
  },

  PERAK: {
    borderColor: "#52525B",
    fillColor: "#FAFAFA",
    fillOpacity: 0.4,
    zIndex: 500,
  },
  TERENGGANU: {
    borderColor: "#52525B",
    fillColor: "#FAFAFA",
    fillOpacity: 0.4,
    zIndex: 500,
  },

  KELANTAN: {
    borderColor: "#DC2626",
    fillColor: "#FEF2F2",
    fillOpacity: 0.4,
    zIndex: 400,
  },
  KEDAH: {
    borderColor: "#DC2626",
    fillColor: "#FEF2F2",
    fillOpacity: 0.4,
    zIndex: 400,
  },
  SELANGOR: {
    borderColor: "#DC2626",
    fillColor: "#FEF2F2",
    fillOpacity: 0.4,
    zIndex: 400,
  },

  JOHOR: {
    borderColor: "#2563EB",
    fillColor: "#EFF6FF",
    fillOpacity: 0.4,
    zIndex: 200,
  },
  PULAU_PINANG: {
    borderColor: "#2563EB",
    fillColor: "#EFF6FF",
    fillOpacity: 0.4,
    zIndex: 200,
  },
  SABAH: {
    borderColor: "#2563EB",
    fillColor: "#EFF6FF",
    fillOpacity: 0.4,
    zIndex: 200,
  },

  SARAWAK: {
    borderColor: "#CA8A04",
    fillColor: "#FEFCE8",
    fillOpacity: 0.4,
    zIndex: 100,
  },
  NEGERI_SEMBILAN: {
    borderColor: "#CA8A04",
    fillColor: "#FEFCE8",
    fillOpacity: 0.4,
    zIndex: 100,
  },
  PERLIS: {
    borderColor: "#CA8A04",
    fillColor: "#FEFCE8",
    fillOpacity: 0.4,
    zIndex: 100,
  },

  WILAYAH_PERSEKUTUAN_KUALA_LUMPUR: {
    borderColor: "#52525B",
    fillColor: "#FAFAFA",
    fillOpacity: 0.4,
    zIndex: 500,
  },
  WILAYAH_PERSEKUTUAN_LABUAN: {
    borderColor: "#2563EB",
    fillColor: "#EFF6FF",
    fillOpacity: 0.4,
    zIndex: 200,
  },
  WILAYAH_PERSEKUTUAN_PUTRAJAYA: {
    borderColor: "#52525B",
    fillColor: "#FAFAFA",
    fillOpacity: 0.4,
    zIndex: 500,
  },
};

export const getStateColor = (stateName: string): PolygonStyleWithLayer => {
  const normalizedName = stateName.toUpperCase().replace(/\s+/g, "_");
  const color = STATE_COLORS[normalizedName];

  if (!color) {
    console.warn(
      `[StateColors] No color found for state: "${stateName}" (normalized: "${normalizedName}")`,
    );
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
