import { useEffect, useState, useRef } from "react";
import type { Coordinates } from "../types/maps";
import { fetchNearbySchools, getSchoolTypes } from "../services/school.svc";
import { SearchBarMap } from "../components/maps/SearchBarMap";
import { MapContainerComponent } from "../components/maps/MapContainerComponents";
import { LocationPickerWindow } from "../components/maps";
import { useMapViewStore } from "../store/mapView";
import CalculateRadiusZoomLevel from "../utils/calculateRadiusZoomLevel";
import { useAppendNewMarkers } from "../hooks/useAppendNewMarkers";
import { fetchMultipleStatePolygons } from "../services/polygon.svc";

export default function SchoolMaps() {
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [schoolTypes, setSchoolTypes] = useState<string[]>([]);
  const {
    center,
    setCenter,
    zoom,
    setZoom,
    radius,
    setRadius,
    initialLocationSet,
    setInitialLocationSet,
    setInitialLocationUser,
    setSchoolMarkers,
    schoolMarkers,
    query,
    setUserMarkers,
    setStatePolygons,
    clearStatePolygons,
  } = useMapViewStore();
  const [dragStartPos, setDragStartPos] = useState<Coordinates | null>(null);
  const geolocationRequestedRef = useRef(false);
  const prevMarkerTypeRef = useRef<string | null>(null);
  const appendNewMarkers = useAppendNewMarkers({
    fetchNearbySchools,
    schoolMarkers,
    setSchoolMarkers,
    radius,
    initialLocationSet,
    zoom,
  });

  useEffect(() => {
    const fetchSchoolTypes = async () => {
      try {
        const types = await getSchoolTypes();
        setSchoolTypes(types);
      } catch (error) {
        console.error("Error fetching school types:", error);
        setSchoolTypes([]);
      }
    };
    fetchSchoolTypes();
    if (!("geolocation" in navigator)) {
      console.warn("Geolocation is not supported in this browser.");
      return;
    }
    if (geolocationRequestedRef.current) {
      return;
    }
    geolocationRequestedRef.current = true;
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCenter([latitude, longitude]);
        setInitialLocationUser([latitude, longitude]);
        setZoom(17);
        setUserMarkers((prev) => {
          const next = new Map(prev);
          next.clear();
          next.set("user", {
            koordinatXX: latitude,
            koordinatYY: longitude,
            dataUrl: "",
            markerType: "USER",
          });
          return next;
        });
        setInitialLocationSet(true);
      },
      (error) => {
        if (error) setShowLocationPicker(true);
      },
      options,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialLocationSet) {
      if (zoom) {
        setRadius(CalculateRadiusZoomLevel(zoom, center[0]));
        appendNewMarkers({ koordinatXX: center[0], koordinatYY: center[1] });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, initialLocationSet]);

  useEffect(() => {
    if (initialLocationSet) {
      if (query) {
        setRadius(CalculateRadiusZoomLevel(zoom, center[0]));
        appendNewMarkers({ koordinatXX: center[0], koordinatYY: center[1] });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, initialLocationSet]);

  // Polygon management effect - moved from useStatePolygons hook
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

  return (
    <div className="h-full w-full flex relative">
      <SearchBarMap schoolTypes={schoolTypes} />
      <MapContainerComponent
        dragStartPos={dragStartPos}
        setDragStartPos={setDragStartPos}
        fetchNearbySchools={fetchNearbySchools}
      />
      {showLocationPicker && (
        <LocationPickerWindow onClose={() => setShowLocationPicker(false)} />
      )}
      {!initialLocationSet && (
        <div className="fixed inset-0 z-[800] bg-bg-black-900/40 backdrop-blur-sm pointer-events-auto" />
      )}
    </div>
  );
}
