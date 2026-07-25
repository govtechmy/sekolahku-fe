import { useEffect, useState, useRef, useMemo } from "react";
import { getSchoolTypes } from "../services/school.svc";
import { SearchBarMap } from "../components/maps/SearchBarMap";
import { MapContainerMapCN } from "../components/maps/MapContainerMapCN";
import { LocationPickerWindow } from "../components/maps";
import { useMapViewStore } from "../store/mapView";
import { fetchMultipleStatePolygons } from "../services/polygon.svc";
import { NEGERI_LIST } from "../contentData";
import { FIRST_LOAD_ZOOM } from "../constants/mapDefaults";
import { useLocationSessionStore } from "../store/locationSession";
import { getSessionInitialLocation } from "../utils/sessionInitialLocation";
import HelmetMeta from "../seo/HelmetMeta";
import { useParams, useSearchParams } from "react-router-dom";
// import DisclaimerMap from "../components/maps/DisclaimerMap";

export default function SchoolMaps() {
  const [schoolTypesMenengah, setSchoolTypesMenengah] = useState<string[]>([]);
  const [schoolTypesRendah, setSchoolTypesRendah] = useState<string[]>([]);
  const [selectedPeringkat, setSelectedPeringkat] = useState<string>("ALL");
  // const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const {
    setCenter,
    setZoom,
    setQuery,
    initialLocationSet,
    setInitialLocationSet,
    setUserMarkers,
    setStatePolygons,
  } = useMapViewStore();

  const { setInitialLocationUser } = useLocationSessionStore();

  const geolocationRequestedRef = useRef(false);
  const polygonsFetchedRef = useRef(false);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("q")?.trim() ?? "";

  useEffect(() => {
    setQuery(urlQuery);
  }, [setQuery, urlQuery]);

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
        setZoom(FIRST_LOAD_ZOOM);
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
        setIsGeolocating(true);
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
            setZoom(FIRST_LOAD_ZOOM);
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
            setIsGeolocating(false);
          },
          (error) => {
            if (error) {
              console.error(error);
            }
            setIsGeolocating(false);
          },
          options,
        );
      }
    }

    // Fetch both MENENGAH and RENDAH school types in parallel on mount
    const fetchAllSchoolTypes = async () => {
      try {
        const [menengah, rendah] = await Promise.all([
          getSchoolTypes("MENENGAH"),
          getSchoolTypes("RENDAH"),
        ]);
        setSchoolTypesMenengah(menengah);
        setSchoolTypesRendah(rendah);
      } catch (error) {
        console.error("Error fetching school types:", error);
      }
    };
    fetchAllSchoolTypes();

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

  // Compute filtered school types based on selectedPeringkat
  const schoolTypes = useMemo(() => {
    if (selectedPeringkat === "MENENGAH") {
      return schoolTypesMenengah;
    }
    if (selectedPeringkat === "RENDAH") {
      return schoolTypesRendah;
    }
    // ALL - combine both and remove duplicates
    return [...new Set([...schoolTypesMenengah, ...schoolTypesRendah])];
  }, [selectedPeringkat, schoolTypesMenengah, schoolTypesRendah]);

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

  const { lang } = useParams<{ lang: string }>();
  const domain = import.meta.env.VITE_DOMAIN_NAME;

  return (
    <div className="h-full w-full flex relative">
      <HelmetMeta
        title="Carian Sekolah - SekolahKu"
        description="Cari sekolah berhampiran anda. Gunakan peta interaktif untuk mencari maklumat sekolah di seluruh Malaysia."
        canonical={`${domain}/${lang}/carian-sekolah`}
      />
      <SearchBarMap
        schoolTypes={schoolTypes}
        selectedPeringkat={selectedPeringkat}
        setSelectedPeringkat={setSelectedPeringkat}
      />
      <MapContainerMapCN />

      {/* Radius legend */}
      {initialLocationSet && (
        <div className="absolute top-6 right-6 z-[500] rounded-lg bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm">
          <p className="mb-1 text-xs font-semibold text-gray-700">
            Jarak Radius
          </p>
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-full border-2"
              style={{ borderColor: "#3366FF", backgroundColor: "#3366FF14" }}
            />
            <span className="text-xs text-gray-600">3 km</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-full border-2 border-dashed"
              style={{ borderColor: "#FF3B30", backgroundColor: "#FF3B3014" }}
            />
            <span className="text-xs text-gray-600">20 km</span>
          </div>
        </div>
      )}

      {/* {!initialLocationSet && !disclaimerAccepted && (
        <DisclaimerMap onAccept={() => setDisclaimerAccepted(true)} />
      )} */}
      {/* {!initialLocationSet && disclaimerAccepted && <LocationPickerWindow />} */}
      {!initialLocationSet && !isGeolocating && <LocationPickerWindow />}
      {(!initialLocationSet || isGeolocating) && (
        <div className="fixed inset-0 z-[800] bg-bg-black-900/40 backdrop-blur-sm pointer-events-auto" />
      )}
    </div>
  );
}
