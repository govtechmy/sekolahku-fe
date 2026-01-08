import type { GeoJSONData, GeoJSONFeature } from "../types/polygon";

const S3_BASE_URL = import.meta.env.VITE_S3_POLYGON_BASE_URL;

export interface PolygonStyle {
  borderColor?: string;
  fillColor?: string;
  fillOpacity?: number;
}

const normalizeStateName = (stateName: string): string => {
  return stateName.toUpperCase().replace(/\s+/g, "_");
};

export const getStatePolygon = async (
  stateName: string,
): Promise<GeoJSONFeature> => {
  const state = normalizeStateName(stateName);
  const url = `${S3_BASE_URL}/${state}/${state}.json`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch state polygon: ${response.status} ${response.statusText}`,
      );
    }

    const data: GeoJSONData = await response.json();

    let geoJsonData: GeoJSONFeature;

    if ("pageProps" in data && data.pageProps?.geojson) {
      geoJsonData = data.pageProps.geojson;
    } else if ("negeri" in data && "geometry" in data && "updatedAt" in data) {
      geoJsonData = {
        type: "Feature",
        properties: {
          negeri: data.negeri,
          updatedAt: data.updatedAt,
        },
        geometry: data.geometry,
      };
    } else {
      geoJsonData = data as GeoJSONFeature;
    }

    return geoJsonData;
  } catch (error) {
    console.error(`Error fetching polygon for ${stateName}:`, error);
    console.error(`URL attempted: ${url}`);
    throw error;
  }
};

export const fetchMultipleStatePolygons = async (
  stateNames: string[],
): Promise<Map<string, GeoJSONFeature>> => {
  const uniqueStates = [...new Set(stateNames.map(normalizeStateName))];
  const result = new Map<string, GeoJSONFeature>();

  const fetchPromises = uniqueStates.map(async (state) => {
    try {
      const data = await getStatePolygon(state);
      result.set(state, data);
      return { state, success: true };
    } catch (error) {
      console.error(`Failed to fetch polygon for ${state}:`, error);
      return { state, success: false };
    }
  });

  await Promise.allSettled(fetchPromises);

  return result;
};
