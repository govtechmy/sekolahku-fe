import { useEffect, useState, useRef } from "react";
import type { Coordinates } from "../types/maps";
import { fetchNearbySchools, getSchoolTypes } from "../services/school.svc";
import { SearchBarMap } from "../components/maps/SearchBarMap";
import { MapContainerComponent } from "../components/maps/MapContainerComponents";
import { LocationPickerWindow } from "../components/maps";
import { useMapViewStore } from "../store/mapView";
import CalculateRadiusZoomLevel from "../utils/calculateRadiusZoomLevel";
import { useAppendNewMarkers } from "../hooks/useAppendNewMarkers";

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
    setUserMarkers
  } = useMapViewStore();
  const [dragStartPos, setDragStartPos] = useState<Coordinates | null>(null);
  const geolocationRequestedRef = useRef(false);
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
