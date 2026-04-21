import { useEffect, useState, useRef } from "react";
import type { Coordinates } from "../types/maps";
import { fetchNearbySchools, getSchoolPeringkat, getSchoolTypes } from "../services/school.svc";
import { SearchBarMap } from "../components/maps/SearchBarMap";
import { MapContainerComponent } from "../components/maps/MapContainerComponents";
import { LocationPickerWindow } from "../components/maps";
import { useMapViewStore } from "../store/mapView";
import CalculateRadiusZoomLevel from "../utils/calculateRadiusZoomLevel";
import { useAppendNewMarkers } from "../hooks/useAppendNewMarkers";
import { fetchMultipleStatePolygons } from "../services/polygon.svc";
import { NEGERI_LIST } from "../contentData";
import { useLocationSessionStore } from "../store/locationSession";
import { getSessionInitialLocation } from "../utils/sessionInitialLocation";
import DisclaimerMap from "../components/maps/DisclaimerMap";

export default function SchoolMaps() {
  const [schoolTypes, setSchoolTypes] = useState<string[]>([]);
  const [schoolPeringkat, setSchoolPeringkat] = useState<string[]>([]);
  const [selectedPeringkat, setSelectedPeringkat] = useState<string>("ALL");
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const {
    center,
    setCenter,
    zoom,
    setZoom,
    radius,
    setRadius,
    initialLocationSet,
    setInitialLocationSet,

    setSchoolMarkers,
    schoolMarkers,
    query,
    setUserMarkers,
    setStatePolygons,
  } = useMapViewStore();

  const { setInitialLocationUser } = useLocationSessionStore();

  const [dragStartPos, setDragStartPos] = useState<Coordinates | null>(null);
  const geolocationRequestedRef = useRef(false);
  const polygonsFetchedRef = useRef(false);
  const appendNewMarkers = useAppendNewMarkers({
    fetchNearbySchools,
    schoolMarkers,
    setSchoolMarkers,
    radius,
    initialLocationSet,
    zoom,
  });

  useEffect(() => {
    if (!initialLocationSet) {
      const sessionInitialLocation = getSessionInitialLocation();
      if (sessionInitialLocation) {
        setInitialLocationSet(true);
        setCenter([sessionInitialLocation[0], sessionInitialLocation[1]]);
        setInitialLocationUser([
          sessionInitialLocation[0],
          sessionInitialLocation[1],
        ]);
        setZoom(15);
        setUserMarkers((prev) => {
          const next = new Map(prev);
          next.clear();
          next.set("user", {
            koordinatXX: sessionInitialLocation[0],
            koordinatYY: sessionInitialLocation[1],
            dataUrl: "",
            markerType: "USER",
          });
          return next;
        });
      } else {
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
          timeout: 600000,
          maximumAge: 86400000,
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
            if (error) {
              console.error(error);
            }
          },
          options,
        );
      }
    }

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

    const fetchSchoolPeringkat = async () => {
      try{
        const peringkat = await getSchoolPeringkat();
        setSchoolPeringkat(peringkat);
      } catch (error) {
        console.error("Error fetching school peringkat:", error);
        setSchoolPeringkat([]);
      }
    }
    fetchSchoolPeringkat();

    // Fetch all state polygons on mount
    const fetchAllStatePolygons = async () => {
      if (polygonsFetchedRef.current) return;

      try {
        polygonsFetchedRef.current = true;
        const polygonMap = await fetchMultipleStatePolygons(NEGERI_LIST);
        setStatePolygons(polygonMap);
      } catch (error) {
        console.error(
          "[SchoolMaps] Error fetching state polygons on mount:",
          error,
        );
        polygonsFetchedRef.current = false;
      }
    };
    fetchAllStatePolygons();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchSchoolTypesByPeringkat = async () => {
      try {
        const types = await getSchoolTypes(selectedPeringkat);
        setSchoolTypes(types);
      } catch (error) {
        console.error("Error fetching school types:", error);
        setSchoolTypes([]);
      }
    };
    fetchSchoolTypesByPeringkat();
  }, [selectedPeringkat]);

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

  // // Close the location picker when query is set
  // useEffect(() => {
  //   if (query && !initialLocationSet) {
  //     setInitialLocationSet(true);
  //     // set default Kuala Lumpur
  //     setInitialLocationUser([3.2080597149999996, 101.72543377142858]);
  //     setUserMarkers((prev) => {
  //       const next = new Map(prev);
  //       next.clear();
  //       next.set("user", {
  //         koordinatXX: 3.2080597149999996,
  //         koordinatYY: 101.72543377142858,
  //         dataUrl: "",
  //         markerType: "USER",
  //       });
  //       return next;
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [query]);

  return (
    <div className="h-full w-full flex relative">
      <SearchBarMap
        schoolTypes={schoolTypes}
        schoolPeringkat={schoolPeringkat}
        selectedPeringkat={selectedPeringkat}
        setSelectedPeringkat={setSelectedPeringkat}
      />
      <MapContainerComponent
        dragStartPos={dragStartPos}
        setDragStartPos={setDragStartPos}
        fetchNearbySchools={fetchNearbySchools}
      />
      {!initialLocationSet && !disclaimerAccepted && (
        <DisclaimerMap onAccept={() => setDisclaimerAccepted(true)} />
      )}
      {!initialLocationSet && disclaimerAccepted && <LocationPickerWindow />}
      {!initialLocationSet && (
        <div className="fixed inset-0 z-[800] bg-bg-black-900/40 backdrop-blur-sm pointer-events-auto" />
      )}
    </div>
  );
}
