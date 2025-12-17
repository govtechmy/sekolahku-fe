import { useCallback } from "react";
import type { MarkerGroup } from "../models/response";
import { processMarkers, type MarkerMap } from "../utils/markerProcessors";

interface UseInitialSchoolsParams {
  fetchNearbySchools: (
    latitude: number,
    longitude: number,
    radiusInMeter: number
  ) => Promise<MarkerGroup[]>;
  center: [number, number];
  radius: number;
  setSchoolMarkers: (markersMap: MarkerMap) => void;
}

export function useInitialSchools({
  fetchNearbySchools,
  center,
  radius,
  setSchoolMarkers,
}: UseInitialSchoolsParams) {
  const loadInitialSchools = useCallback(async () => {
    try {
      const markersArray = await fetchNearbySchools(center[0], center[1], radius);
      const schoolData = processMarkers(markersArray);
      setSchoolMarkers(schoolData);
    } catch (error) {
      console.error("Failed to load initial schools:", error);
    }
  }, [fetchNearbySchools, center, radius, setSchoolMarkers]);

  return { loadInitialSchools };
}
