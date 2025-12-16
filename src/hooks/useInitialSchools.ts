import { useCallback } from "react";
import type { MarkerGroup } from "../models/response";

type SchoolMarker = { lat: number; lng: number; dataUrl: string };

type UseInitialSchoolsParams = {
  fetchNearbySchools: (latitude: number, longitude: number, radiusInMeter: number) => Promise<MarkerGroup[]>;
  center: [number, number];
  radius: number;
  extractSchoolData: (markers: MarkerGroup[]) => Map<string, SchoolMarker>;
  saveToLocalStorage: (markersMap: Map<string, SchoolMarker>) => void;
  setSchoolMarkers: (markersMap: Map<string, SchoolMarker>) => void;
};

export function useInitialSchools({
  fetchNearbySchools,
  center,
  radius,
  extractSchoolData,
  saveToLocalStorage,
  setSchoolMarkers,
}: UseInitialSchoolsParams) {
  const loadInitialSchools = useCallback(async () => {
    try {
      const markersArray = await fetchNearbySchools(center[0], center[1], radius);
      const schoolData = extractSchoolData(markersArray);
      saveToLocalStorage(schoolData);
      setSchoolMarkers(schoolData);
    } catch (error) {
      console.error("Failed to load initial schools:", error);
    }
  }, [fetchNearbySchools, center, radius, extractSchoolData, saveToLocalStorage, setSchoolMarkers]);

  return { loadInitialSchools };
}
