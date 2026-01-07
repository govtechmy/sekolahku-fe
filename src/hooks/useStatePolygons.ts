import { useEffect, useRef } from "react";
import { useMapViewStore } from "../store/mapView";
import { fetchMultipleStatePolygons } from "../services/polygon.svc";
import type { MarkerMap } from "../utils/markerProcessors";


export function useStatePolygons(schoolMarkers: MarkerMap) {
  const { setStatePolygons, clearStatePolygons } = useMapViewStore();
  const prevMarkerTypeRef = useRef<string | null>(null);

  useEffect(() => {
    if (schoolMarkers.size === 0) {
      clearStatePolygons();
      prevMarkerTypeRef.current = null;
      return;
    }

    const firstMarker = Array.from(schoolMarkers.values())[0];
    const currentMarkerType = firstMarker?.markerType;

    if (
      prevMarkerTypeRef.current === "NEGERI" &&
      currentMarkerType !== "NEGERI"
    ) {
      clearStatePolygons();
      prevMarkerTypeRef.current = currentMarkerType;
      return;
    }

    prevMarkerTypeRef.current = currentMarkerType;


    if (currentMarkerType !== "NEGERI") {
      return;
    }

    const stateNames = Array.from(schoolMarkers.values())
      .filter((marker) => marker.markerType === "NEGERI")
      .map((marker) => marker.negeri)
      .filter((negeri): negeri is string => Boolean(negeri));

    const uniqueStateNames = [...new Set(stateNames)];

    if (uniqueStateNames.length === 0) {
      console.warn("[Polygon Hook] Found NEGERI markers but no state names");
      return;
    }

    const fetchPolygons = async () => {
      try {
        const polygonMap = await fetchMultipleStatePolygons(uniqueStateNames);
        setStatePolygons(polygonMap);
      } catch (error) {
        console.error("[Polygon Hook] Error fetching state polygons:", error);
      }
    };

    fetchPolygons();
  }, [schoolMarkers, setStatePolygons, clearStatePolygons]);
}
