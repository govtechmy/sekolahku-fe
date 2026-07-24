import type { MarkerGroup } from "../models/response";
import type { MarkerType } from "../types/maps";

export type MarkerMap = Map<
  string,
  {
    koordinatXX: number;
    koordinatYY: number;
    dataUrl: string;
    markerType: MarkerType;
    total?: number;
    negeri?: string;
    parlimen?: string;
    region?: string;
  }
>;
export type SchoolMarker = {
  koordinatXX: number;
  koordinatYY: number;
  dataUrl: string;
  markerType: MarkerType;
  total?: number;
  negeri?: string;
  parlimen?: string;
  region?: string;
};

const markersEqual = (left: SchoolMarker, right: SchoolMarker): boolean =>
  left.koordinatXX === right.koordinatXX &&
  left.koordinatYY === right.koordinatYY &&
  left.dataUrl === right.dataUrl &&
  left.markerType === right.markerType &&
  left.total === right.total &&
  left.negeri === right.negeri &&
  left.parlimen === right.parlimen &&
  left.region === right.region;

const upsertMarker = (
  map: MarkerMap,
  key: string,
  marker: SchoolMarker,
): boolean => {
  const existing = map.get(key);
  if (!existing) {
    map.set(key, marker);
    return true;
  }

  const enriched: SchoolMarker = {
    ...existing,
    ...marker,
    dataUrl: marker.dataUrl || existing.dataUrl,
    total: marker.total ?? existing.total,
    negeri: marker.negeri || existing.negeri,
    parlimen: marker.parlimen || existing.parlimen,
    region: marker.region || existing.region,
  };

  if (markersEqual(existing, enriched)) return false;
  map.set(key, enriched);
  return true;
};

const processGroupMarkers = (marker: MarkerGroup, map: MarkerMap): number => {
  if (marker.markerType !== "GROUP" || !marker.items) return 0;

  let count = 0;
  marker.items.forEach((item) => {
    const changed = upsertMarker(map, item.kodSekolah, {
      koordinatXX: item.infoLokasi.koordinatYY,
      koordinatYY: item.infoLokasi.koordinatXX,
      dataUrl: item.dataUrl,
      markerType: item.markerType,
      negeri: marker.negeri,
      parlimen: marker.parlimen,
    });
    if (changed) count++;
  });
  return count;
};

const processIndividualMarker = (
  marker: MarkerGroup,
  map: MarkerMap,
): number => {
  if (marker.markerType !== "INDIVIDUAL") return 0;

  return upsertMarker(map, marker.kodSekolah, {
    koordinatXX: marker.infoLokasi.koordinatYY,
    koordinatYY: marker.infoLokasi.koordinatXX,
    dataUrl: marker.dataUrl,
    markerType: marker.markerType,
    negeri: marker.negeri,
    parlimen: marker.parlimen,
  })
    ? 1
    : 0;
};

const processParlimenMarker = (marker: MarkerGroup, map: MarkerMap): number => {
  if (marker.markerType !== "PARLIMEN") return 0;

  const key = `${marker.negeri}-${marker.parlimen}`;
  return upsertMarker(map, key, {
    koordinatXX: marker.infoLokasi.koordinatYY,
    koordinatYY: marker.infoLokasi.koordinatXX,
    dataUrl: "",
    markerType: marker.markerType,
    total: marker.total,
    parlimen: marker.parlimen,
    negeri: marker.negeri,
  })
    ? 1
    : 0;
};

const processNegeriMarker = (marker: MarkerGroup, map: MarkerMap): number => {
  if (marker.markerType !== "NEGERI" || !marker.negeri) return 0;
  return upsertMarker(map, marker.negeri, {
    koordinatXX: marker.infoLokasi.koordinatYY,
    koordinatYY: marker.infoLokasi.koordinatXX,
    dataUrl: "",
    markerType: marker.markerType,
    total: marker.total,
    negeri: marker.negeri,
  })
    ? 1
    : 0;
};

const processWestEastMalaysiaMarker = (
  marker: MarkerGroup,
  map: MarkerMap,
): number => {
  if (marker.markerType !== "WEST_EAST_MALAYSIA" || !marker.region) return 0;
  return upsertMarker(map, marker.region, {
    koordinatXX: marker.infoLokasi.koordinatYY,
    koordinatYY: marker.infoLokasi.koordinatXX,
    dataUrl: "",
    markerType: marker.markerType,
    total: marker.total,
    region: marker.region,
  })
    ? 1
    : 0;
};

export const processMarkers = (
  markers: MarkerGroup[],
  existingMap?: MarkerMap,
): MarkerMap => {
  const baseMap = existingMap ?? new Map<string, SchoolMarker>();
  const newMap = new Map(baseMap);
  let changed = false;

  markers.forEach((marker) => {
    changed = processGroupMarkers(marker, newMap) > 0 || changed;
    changed = processIndividualMarker(marker, newMap) > 0 || changed;
    changed = processParlimenMarker(marker, newMap) > 0 || changed;
    changed = processNegeriMarker(marker, newMap) > 0 || changed;
    changed = processWestEastMalaysiaMarker(marker, newMap) > 0 || changed;
  });

  return changed ? newMap : baseMap;
};
