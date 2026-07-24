/**
 * Coordinate conversion utilities.
 *
 * The Zustand store uses [lat, lng] (Leaflet convention).
 * MapLibre GL uses [lng, lat] (GeoJSON / GPS convention).
 *
 * These helpers ensure consistent conversion at the map boundary.
 */

/** Convert store [lat, lng] to MapLibre [lng, lat] */
export function toMapLibre(latLng: [number, number]): [number, number] {
  return [latLng[1], latLng[0]];
}

/** Convert MapLibre [lng, lat] to store [lat, lng] */
export function fromMapLibre(lngLat: [number, number]): [number, number] {
  return [lngLat[1], lngLat[0]];
}
