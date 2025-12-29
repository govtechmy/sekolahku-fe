import type { MarkerGroup } from "../models/response";
import type { MarkerType } from "../types/maps";

export type MarkerMap = Map<string, { koordinatXX: number; koordinatYY: number; dataUrl: string; markerType: MarkerType; total?: number }>;
export type SchoolMarker = { koordinatXX: number; koordinatYY: number; dataUrl: string; markerType: MarkerType; total?: number };

/**
 * Helper function to add a marker if it doesn't exist
 * @returns true if marker was added, false if it already existed
 */
const addMarkerIfNew = (
  map: MarkerMap,
  key: string,
  marker: SchoolMarker,
): boolean => {
  if (!map.has(key)) {
    map.set(key, marker);
    return true;
  }
  return false;
};

/**
 * Process GROUP type markers (contains multiple schools)
 */
const processGroupMarkers = (marker: MarkerGroup, map: MarkerMap): number => {
  if (marker.markerType !== "GROUP" || !marker.items) return 0;
  
  let count = 0;
  marker.items.forEach((item) => {
    const added = addMarkerIfNew(map, item.kodSekolah, {
      koordinatXX: item.infoLokasi.koordinatYY,
      koordinatYY: item.infoLokasi.koordinatXX,
      dataUrl: item.dataUrl,
      markerType: item.markerType,
    });
    if (added) count++;
  });
  return count;
};

/**
 * Process INDIVIDUAL type markers (single school)
 */
const processIndividualMarker = (marker: MarkerGroup, map: MarkerMap): number => {
  if (marker.markerType !== "INDIVIDUAL") return 0;
  
  return addMarkerIfNew(map, marker.kodSekolah, {
    koordinatXX: marker.infoLokasi.koordinatYY,
    koordinatYY: marker.infoLokasi.koordinatXX,
    dataUrl: marker.dataUrl,
    markerType: marker.markerType,
  }) ? 1 : 0;
};

/**
 * Process PARLIMEN type markers (parliamentary district)
 */
const processParlimenMarker = (marker: MarkerGroup, map: MarkerMap): number => {
  if (marker.markerType !== "PARLIMEN") return 0;
  
  const key = `${marker.negeri}-${marker.parlimen}`;
  return addMarkerIfNew(map, key, {
    koordinatXX: marker.infoLokasi.koordinatYY,
    koordinatYY: marker.infoLokasi.koordinatXX,
    dataUrl: marker.total?.toString() ?? "",
    markerType: marker.markerType,
    total:marker.total
  }) ? 1 : 0;
};

/**
 * Process NEGERI type markers (state)
 */
const processNegeriMarker = (marker: MarkerGroup, map: MarkerMap): number => {
  if (marker.markerType !== "NEGERI" || !marker.negeri) return 0;
  return addMarkerIfNew(map, marker.negeri, {
      koordinatXX: marker.infoLokasi.koordinatYY,
      koordinatYY: marker.infoLokasi.koordinatXX,
    dataUrl: marker.total?.toString() ?? "",
    markerType: marker.markerType,
    total: marker.total
  }) ? 1 : 0;
};

/**
 * Process all marker types and merge them into a map
 * @param markers - Array of marker groups to process
 * @param existingMap - Optional existing map to merge into
 * @returns New map with all processed markers
 */
export const processMarkers = (
  markers: MarkerGroup[],
  existingMap?: MarkerMap
): MarkerMap => {
  const newMap = existingMap ? new Map(existingMap) : new Map();
  
  markers.forEach((marker) => {
    processGroupMarkers(marker, newMap);
    processIndividualMarker(marker, newMap);
    processParlimenMarker(marker, newMap);
    processNegeriMarker(marker, newMap);
  });
  
  return newMap;
};