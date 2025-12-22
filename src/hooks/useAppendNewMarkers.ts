import { useCallback } from "react";
import type { MarkerGroup } from "../models/response";
import { processMarkers, type MarkerMap } from "../utils/markerProcessors";
import type { Coordinates } from "../types/maps";
import { useMapViewStore } from "../store/mapView";

interface UseAppendNewMarkersParams {
  fetchNearbySchools: (
    koordinatXX: number,
    koordinatYY: number,
    radiusInMeter: number,
    initialLocationSet?: boolean,
    zoom?: number,
    query?: string
  ) => Promise<MarkerGroup[]>;
  schoolMarkers: MarkerMap;
  setSchoolMarkers: React.Dispatch<React.SetStateAction<MarkerMap>>;
  radius: number;
  initialLocationSet?: boolean;
  zoom?: number;
  query?: string;
}

export function useAppendNewMarkers({
  fetchNearbySchools,
  setSchoolMarkers,
  radius,
  initialLocationSet,
  zoom,
  schoolMarkers
}: UseAppendNewMarkersParams) {
    const {
      query: name
    } = useMapViewStore();
  const append = useCallback(
    async (center: Coordinates) => {
      try {
        console.log("Fetching nearby schools with query:", name);
        const markersArray = await fetchNearbySchools(
          center.koordinatXX,
          center.koordinatYY,
          radius,
          initialLocationSet,
          zoom,
          name
        );
        const prevSchool = schoolMarkers.values().next().value?.markerType;
        const newMarkerType = markersArray[0]?.markerType;
        
        if (!newMarkerType) {
          return;
        }
        
        setSchoolMarkers((prevMap) => {
          if (!markersArray.length || !prevSchool || newMarkerType !== prevSchool) {
            return processMarkers(markersArray, new Map());
          }
          
          const newMap = processMarkers(markersArray, prevMap);
          return newMap.size > prevMap.size ? newMap : prevMap;
        });
      } catch (error) {
        console.error("Failed to fetch nearby schools:", error);
      }
    },
    [fetchNearbySchools, setSchoolMarkers, radius, initialLocationSet, zoom, schoolMarkers, name]
  );

  return append;
}
