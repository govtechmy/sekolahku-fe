import type { MarkerGroup } from "../models/response";

export type MarkerMap = Map<string, { lat: number; lng: number; dataUrl: string }>;
export type SchoolMarker = { lat: number; lng: number; dataUrl: string };

/**
 * Helper function to add a marker if it doesn't exist
 * @returns true if marker was added, false if it already existed
 */
const addMarkerIfNew = (
  map: MarkerMap,
  key: string,
  marker: SchoolMarker
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
      lat: item.infoLokasi.koordinatYY,
      lng: item.infoLokasi.koordinatXX,
      dataUrl: item.dataUrl,
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
    lat: marker.infoLokasi.koordinatYY,
    lng: marker.infoLokasi.koordinatXX,
    dataUrl: marker.dataUrl,
  }) ? 1 : 0;
};

/**
 * Process PARLIMEN type markers (parliamentary district)
 */
const processParlimenMarker = (marker: MarkerGroup, map: MarkerMap): number => {
  if (marker.markerType !== "PARLIMEN") return 0;
  
  const key = `${marker.negeri}-${marker.parlimen}`;
  return addMarkerIfNew(map, key, {
    lat: marker.infoLokasi.koordinatYY,
    lng: marker.infoLokasi.koordinatXX,
    dataUrl: marker.total?.toString() ?? "",
  }) ? 1 : 0;
};

/**
 * Process NEGERI type markers (state)
 */
const processNegeriMarker = (marker: MarkerGroup, map: MarkerMap): number => {
  if (marker.markerType !== "NEGERI" || !marker.negeri) return 0;
  
  return addMarkerIfNew(map, marker.negeri, {
    lat: marker.infoLokasi.koordinatYY,
    lng: marker.infoLokasi.koordinatXX,
    dataUrl: marker.total?.toString() ?? "",
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

/**
 * Extract school data from marker groups (backward compatibility)
 * Only processes GROUP type markers
 */
export const extractSchoolData = (markers: MarkerGroup[]): MarkerMap => {
  const schoolMap = new Map<string, SchoolMarker>();
  
  markers.forEach((marker) => {
    if (marker.markerType === "GROUP" && marker.items) {
      marker.items.forEach((item) => {
        schoolMap.set(item.kodSekolah, {
          lat: item.infoLokasi.koordinatYY,
          lng: item.infoLokasi.koordinatXX,
          dataUrl: item.dataUrl,
        });
      });
    }
  });
  
  return schoolMap;
};
