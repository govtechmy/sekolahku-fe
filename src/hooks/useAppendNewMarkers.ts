import { useCallback } from "react";
import type { MarkerGroup } from "../models/response";
import { processMarkers, type MarkerMap } from "../utils/markerProcessors";
import type { Coordinates } from "../types/maps";
import { useMapViewStore } from "../store/mapView";
import CalculateRadiusZoomLevel from "../utils/calculateRadiusZoomLevel";

interface UseAppendNewMarkersParams {
  fetchNearbySchools: (
    koordinatXX: number,
    koordinatYY: number,
    radiusInMeter: number,
    initialLocationSet?: boolean,
    zoom?: number,
    query?: string,
  ) => Promise<MarkerGroup[]>;
  schoolMarkers?: MarkerMap;

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
}: UseAppendNewMarkersParams) {
  const { query: name } = useMapViewStore();
  const append = useCallback(
    async (center: Coordinates) => {
      // Read the latest state from the store at call time to avoid stale closures
      const state = useMapViewStore.getState();
      const currentZoom = state.zoom ?? zoom ?? 6;
      const currentRadius = state.radius || radius;
      // Recalculate radius based on current zoom and center latitude for accuracy
      const effectiveRadius = CalculateRadiusZoomLevel(currentZoom, center.koordinatXX) || currentRadius;

      try {
        const markersArray = await fetchNearbySchools(
          center.koordinatXX,
          center.koordinatYY,
          effectiveRadius,
          initialLocationSet,
          currentZoom,
          name,
        );

        if (!markersArray.length) {
          return;
        }

        setSchoolMarkers((prevMap) => processMarkers(markersArray, prevMap));
      } catch (error) {
        console.error("Failed to fetch nearby schools:", error);
      }
    },
    [
      fetchNearbySchools,
      setSchoolMarkers,
      radius,
      initialLocationSet,
      zoom,
      name,
    ],
  );

  return append;
}
