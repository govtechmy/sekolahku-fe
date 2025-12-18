import { useCallback } from "react";
import type { MarkerGroup } from "../models/response";
import { processMarkers, type MarkerMap } from "../utils/markerProcessors";
import type { Coordinates } from "../types/maps";

interface UseAppendNewMarkersParams {
  fetchNearbySchools: (
    koordinatXX: number,
    koordinatYY: number,
    radiusInMeter: number,
    initialLocationSet?: boolean,
    zoom?: number
  ) => Promise<MarkerGroup[]>;
  schoolMarkers: MarkerMap;
  setSchoolMarkers: React.Dispatch<React.SetStateAction<MarkerMap>>;
  radius: number;
  initialLocationSet?: boolean;
  zoom?: number;
}

export function useAppendNewMarkers({
  fetchNearbySchools,
  setSchoolMarkers,
  radius,
  initialLocationSet,
  zoom,
  schoolMarkers
}: UseAppendNewMarkersParams) {
  const append = useCallback(
    async (center: Coordinates) => {
      try {
        const markersArray = await fetchNearbySchools(
          center.koordinatXX,
          center.koordinatYY,
          radius,
          initialLocationSet,
          zoom
        );
        
        const prevSchool = schoolMarkers.values().next().value?.markerType;
        const newMarkerType = markersArray[0]?.markerType;
        setSchoolMarkers((prevMap) => {
          if (!prevSchool || newMarkerType !== prevSchool) {
            return processMarkers(markersArray, new Map());
          }
          
          const newMap = processMarkers(markersArray, prevMap);
          return newMap.size > prevMap.size ? newMap : prevMap;
        });
      } catch (error) {
        console.error("Failed to fetch nearby schools:", error);
      }
    },
    [fetchNearbySchools, setSchoolMarkers, radius, initialLocationSet, zoom, schoolMarkers]
  );

  return append;
}
