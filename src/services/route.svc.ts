// OSRM Routing Service
// Currently using the public demo server for development.
// For production, replace OSRM_BASE_URL with your self-hosted OSRM backend
// (the public server is rate-limited and not for production traffic).

const OSRM_BASE_URL = "https://router.project-osrm.org";

export interface RouteResponse {
  coordinates: [number, number][]; // [lat, lng][]
  distance: number; // meters
  duration: number; // seconds
}

/**
 * Fetch driving route between two points using OSRM.
 * @param pointA - Origin [lat, lng]
 * @param pointB - Destination [lat, lng]
 * @param signal - Optional AbortSignal to cancel an in-flight request
 * @returns Route coordinates (as [lat, lng][]), distance, and duration
 */
export const getRoute = async (
  pointA: [number, number],
  pointB: [number, number],
  signal?: AbortSignal,
): Promise<RouteResponse | null> => {
  try {
    // OSRM expects coordinates in [lng, lat] format
    const url = `${OSRM_BASE_URL}/route/v1/driving/${pointA[1]},${pointA[0]};${pointB[1]},${pointB[0]}?overview=full&geometries=geojson`;

    const response = await fetch(url, { signal });

    if (!response.ok) {
      console.error("OSRM request failed:", response.status);
      return null;
    }

    const data = await response.json();

    if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
      console.error("OSRM returned no routes:", data.code);
      return null;
    }

    const route = data.routes[0];

    // Convert GeoJSON coordinates from [lng, lat] to [lat, lng] for Leaflet
    const coordinates: [number, number][] = route.geometry.coordinates.map(
      (coord: [number, number]) => [coord[1], coord[0]],
    );

    return {
      coordinates,
      distance: route.distance,
      duration: route.duration,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError")
      return null;
    console.error("Error fetching route from OSRM:", error);
    return null;
  }
};

export interface RoadDistance {
  distance: number | null; // meters (null if OSRM couldn't route)
  duration: number | null; // seconds
}

/**
 * Distance matrix from a SINGLE origin to MANY destinations in one OSRM /table
 * call (much cheaper than N /route calls). Use it to show road distance for a
 * short list of candidates (e.g. the nearest 10 by straight-line distance).
 *
 * @param origin       Origin [lat, lng]
 * @param destinations Destination [lat, lng][]
 * @param signal       Optional AbortSignal
 * @returns Per-destination road distance + duration, index-aligned to
 *          `destinations` (empty array on error/abort).
 */
export const getRouteDistances = async (
  origin: [number, number],
  destinations: [number, number][],
  signal?: AbortSignal,
): Promise<RoadDistance[]> => {
  if (destinations.length === 0) return [];
  try {
    // OSRM expects lng,lat. The first coordinate is the source (sources=0);
    // destinations follow, so their matrix column index is offset by 1.
    const coords = [origin, ...destinations]
      .map(([lat, lng]) => `${lng},${lat}`)
      .join(";");
    const url = `${OSRM_BASE_URL}/table/v1/driving/${coords}?sources=0&annotations=distance,duration`;

    const response = await fetch(url, { signal });
    if (!response.ok) {
      console.error("OSRM table request failed:", response.status);
      return [];
    }

    const data = await response.json();
    if (data.code !== "Ok") {
      console.error("OSRM table returned:", data.code);
      return [];
    }

    const distances: (number | null)[] = data.distances?.[0] ?? [];
    const durations: (number | null)[] = data.durations?.[0] ?? [];

    return destinations.map((_, i) => ({
      distance: distances[i + 1] ?? null,
      duration: durations[i + 1] ?? null,
    }));
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return [];
    console.error("Error fetching OSRM table:", error);
    return [];
  }
};
