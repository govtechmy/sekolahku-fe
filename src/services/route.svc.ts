// OSRM Routing Service
// Currently using the public demo server for development.
// For production, replace OSRM_BASE_URL with your self-hosted OSRM backend.

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
 * @returns Route coordinates (as [lat, lng][]), distance, and duration
 */
export const getRoute = async (
  pointA: [number, number],
  pointB: [number, number],
): Promise<RouteResponse | null> => {
  try {
    // OSRM expects coordinates in [lng, lat] format
    const url = `${OSRM_BASE_URL}/route/v1/driving/${pointA[1]},${pointA[0]};${pointB[1]},${pointB[0]}?overview=full&geometries=geojson`;

    const response = await fetch(url);

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
    const coordinates: [number, number][] =
      route.geometry.coordinates.map((coord: [number, number]) => [
        coord[1],
        coord[0],
      ]);

    return {
      coordinates,
      distance: route.distance,
      duration: route.duration,
    };
  } catch (error) {
    console.error("Error fetching route from OSRM:", error);
    return null;
  }
};
