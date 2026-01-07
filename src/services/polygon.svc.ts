

import type { GeoJSONData, GeoJSONFeature } from '../types/polygon';

const S3_BASE_URL = import.meta.env.VITE_S3_POLYGON_BASE_URL;

export interface PolygonStyle {
  borderColor?: string;
  fillColor?: string;
  fillOpacity?: number;
}

// In-memory cache for polygon data
const polygonCache = new Map<string, GeoJSONFeature>();


const normalizeStateName = (stateName: string): string => {
  return stateName.toUpperCase().replace(/\s+/g, "_");
};

export const getStatePolygon = async (stateName: string): Promise<GeoJSONFeature> => {
  const state = normalizeStateName(stateName);
  
  // Check cache first
  if (polygonCache.has(state)) {
    console.log(`[Polygon Cache] Using cached polygon for ${state}`);
    return polygonCache.get(state)!;
  }

  const url = `${S3_BASE_URL}/${state}/${state}.json`;

  try {
    console.log(`[Polygon Fetch] Fetching polygon for ${state} from ${url}`);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch state polygon: ${response.status} ${response.statusText}`);
    }
    
    const data: GeoJSONData = await response.json();
  
    let geoJsonData: GeoJSONFeature;
    
    // Type guard: Check if it's wrapped in pageProps
    if ('pageProps' in data && data.pageProps?.geojson) {
      geoJsonData = data.pageProps.geojson;
    } 
    // Type guard: Check if it's a NegeriBoundary (has negeri, geometry, updatedAt)
    else if ('negeri' in data && 'geometry' in data && 'updatedAt' in data) {
      geoJsonData = {
        type: "Feature",
        properties: {
          negeri: data.negeri,
          updatedAt: data.updatedAt,
        },
        geometry: data.geometry,
      };
    } 
    // Assume it's already a GeoJSONFeature
    else {
      geoJsonData = data as GeoJSONFeature;
    }
  
    polygonCache.set(state, geoJsonData);
    console.log(`[Polygon Cache] Cached polygon for ${state}`);
    
    return geoJsonData;
  } catch (error) {
    console.error(`Error fetching polygon for ${stateName}:`, error);
    console.error(`URL attempted: ${url}`);
    throw error;
  }
};

export const getStyledStatePolygon = async (
    stateName: string,
    style?: PolygonStyle
) => {
    const defaultStyle: PolygonStyle = {
        borderColor: '#FF0000',  
        fillColor: '#FF0000',
        fillOpacity: 0.2, 
    };

    const polygonData = await getStatePolygon(stateName);

    return {
        ...polygonData,
        style: { ...defaultStyle, ...style },
    };
};

export const getJohorPolygonRed = async () => {
    return getStyledStatePolygon('Johor', {
      borderColor: '#FF0000',
        fillColor: '#FF0000',
        fillOpacity: 0.3,
    });
};

export const fetchMultipleStatePolygons = async (
  stateNames: string[]
): Promise<Map<string, GeoJSONFeature>> => {
  const uniqueStates = [...new Set(stateNames.map(normalizeStateName))];
  const result = new Map<string, GeoJSONFeature>();

  // Separate cached and uncached states
  const uncachedStates = uniqueStates.filter(state => !polygonCache.has(state));
  const cachedStates = uniqueStates.filter(state => polygonCache.has(state));

  // Add cached states to result
  cachedStates.forEach(state => {
    const cached = polygonCache.get(state);
    if (cached) {
      result.set(state, cached);
    }
  });

  if (uncachedStates.length === 0) {
    console.log(`[Polygon Cache] All ${uniqueStates.length} polygons found in cache`);
    return result;
  }

  console.log(`[Polygon Fetch] Fetching ${uncachedStates.length} new polygons, ${cachedStates.length} from cache`);

  // Fetch uncached states in parallel
  const fetchPromises = uncachedStates.map(async (state) => {
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

/**
 * Clear the polygon cache
 * Useful when needing to force refresh or free memory
 */
export const clearPolygonCache = () => {
  const cacheSize = polygonCache.size;
  polygonCache.clear();
  console.log(`[Polygon Cache] Cleared ${cacheSize} cached polygons`);
};

/**
 * Get cache statistics
 */
export const getPolygonCacheStats = () => {
  return {
    cachedStates: Array.from(polygonCache.keys()),
    count: polygonCache.size,
  };
};
