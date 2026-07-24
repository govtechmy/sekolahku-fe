/**
 * Generate a GeoJSON polygon approximating a circle.
 * @param center [lng, lat] in MapLibre convention
 * @param radiusInMeters radius in meters
 * @param numPoints number of points (higher = smoother circle)
 */
export function createCirclePolygon(
  center: [number, number],
  radiusInMeters: number,
  numPoints = 64,
): GeoJSON.Feature<GeoJSON.Polygon> {
  const [lng, lat] = center;
  const coords: [number, number][] = [];

  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI;
    // Approximate offset in degrees
    const dLat = (radiusInMeters / 111320) * Math.cos(angle);
    const dLng =
      (radiusInMeters / (111320 * Math.cos((lat * Math.PI) / 180))) *
      Math.sin(angle);
    coords.push([lng + dLng, lat + dLat]);
  }
  // Close the ring
  coords.push(coords[0]);

  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [coords],
    },
  };
}
