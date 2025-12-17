import { useCallback } from "react";
import type { MarkerGroup } from "../models/response";
import { processMarkers, type MarkerMap } from "../utils/markerProcessors";
import type { Coordinates } from "../types/maps";

interface UseAppendNewMarkersParams {
  fetchNearbySchools: (
    koordinatXX: number,
    koordinatYY: number,
    radiusInMeter: number,
    zoom?: number
  ) => Promise<MarkerGroup[]>;
  setSchoolMarkers: React.Dispatch<React.SetStateAction<MarkerMap>>;
  radius: number;
  zoom?: number;
}

export function useAppendNewMarkers({
  fetchNearbySchools,
  setSchoolMarkers,
  radius,
  zoom
}: UseAppendNewMarkersParams) {
  const append = useCallback(
    async (center: Coordinates) => {
      try {
        const markersArray = await fetchNearbySchools(
          center.koordinatXX,
          center.koordinatYY,
          radius,
          zoom
        );

        setSchoolMarkers((prevMap) => {
          const newMap = processMarkers(markersArray, prevMap);
          // Only update if new markers were added
          return newMap.size > prevMap.size ? newMap : prevMap;
        });
      } catch (error) {
        console.error("Failed to fetch nearby schools:", error);
      }
    },
    [fetchNearbySchools, setSchoolMarkers, radius, zoom]
  );

  return append;
}
