import { useCallback } from "react";
import type { MarkerGroup } from "../models/response";
import { processMarkers, type MarkerMap } from "../utils/markerProcessors";

interface UseAppendNewMarkersParams {
  fetchNearbySchools: (
    latitude: number,
    longitude: number,
    radiusInMeter: number
  ) => Promise<MarkerGroup[]>;
  setSchoolMarkers: React.Dispatch<React.SetStateAction<MarkerMap>>;
  radius: number;
}

export function useAppendNewMarkers({
  fetchNearbySchools,
  setSchoolMarkers,
  radius,
}: UseAppendNewMarkersParams) {
  const append = useCallback(
    async (center: { lat: number; lng: number }) => {
      try {
        const markersArray = await fetchNearbySchools(
          center.lat,
          center.lng,
          radius
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
    [fetchNearbySchools, setSchoolMarkers, radius]
  );

  return append;
}
