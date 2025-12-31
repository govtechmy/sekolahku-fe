import { useCallback } from "react";
import type { MarkerGroup } from "../models/response";
import { processMarkers, type MarkerMap } from "../utils/markerProcessors";

interface UseInitialSchoolsParams {
  fetchNearbySchools: (
    koordinatXX: number,
    koordinatYY: number,
    radiusInMeter: number,
    initialLocationSet?: boolean,
    zoom?: number,
  ) => Promise<MarkerGroup[]>;
  center: [number, number];
  radius: number;
  setSchoolMarkers: (markersMap: MarkerMap) => void;
  initialLocationSet?: boolean;
  zoom?: number;
}

export function useInitialSchools({
  fetchNearbySchools,
  center,
  radius,
  setSchoolMarkers,
  initialLocationSet,
  zoom,
}: UseInitialSchoolsParams) {
  const loadInitialSchools = useCallback(async () => {
    try {
      const markersArray = await fetchNearbySchools(
        center[0],
        center[1],
        radius,
        initialLocationSet,
        zoom,
      );
      const schoolData = processMarkers(markersArray);
      setSchoolMarkers(schoolData);
    } catch (error) {
      console.error("Failed to load initial schools:", error);
    }
  }, [
    fetchNearbySchools,
    center,
    radius,
    setSchoolMarkers,
    initialLocationSet,
    zoom,
  ]);

  return { loadInitialSchools };
}
