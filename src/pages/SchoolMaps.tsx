import { useEffect, useState, useRef } from "react";
import type { Coordinates, SearchBarMapProps } from "../types/maps";
import {
  fetchNearbySchools,
  getSchoolSuggestion,
} from "../services/school.svc";
import { SearchBarMap } from "../components/maps/SearchBarMap";
import { MapContainerComponent } from "../components/maps/MapContainerComponents";
import { LocationPickerWindow } from "../components/maps";
import type { ItemSekolahModel } from "../models/response";
import { useMapViewStore } from "../store/mapView";
import CalculateRadiusZoomLevel from "../utils/calculateRadiusZoomLevel";
import { useInitialSchools } from "../hooks/useInitialSchools";
import { useAppendNewMarkers } from "../hooks/useAppendNewMarkers";


export default function SchoolMaps() {
  const [query, setQuery] = useState("");
  const [filteredSearchResult, setFilteredSearchResult] = useState<
    SearchBarMapProps[]
  >([]);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
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
    schoolMarkers
  } = useMapViewStore();
  const [dragStartPos, setDragStartPos] = useState<Coordinates | null>(null);
  const [viewSchool, setViewSchool] = useState<ItemSekolahModel | null>(null);
  const geolocationRequestedRef = useRef(false);
  const initialLoadRequestedRef = useRef(false);
    const appendNewMarkers = useAppendNewMarkers({
      fetchNearbySchools,
      schoolMarkers,
      setSchoolMarkers,
      radius,
      initialLocationSet,
      zoom,
    });

  // Load initial Schools Hook
  const { loadInitialSchools } = useInitialSchools({
    fetchNearbySchools,
    center,
    radius,
    setSchoolMarkers,
    initialLocationSet,
    zoom,
  });

  //SET TO FETCH GEOLOCATION FROM USER
  useEffect(() => {
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
        console.log("Geolocation success:", { latitude, longitude });
        setCenter([latitude, longitude]);
        setZoom(17);
        setInitialLocationSet(true);
      },
      (error) => {
        if (error) setShowLocationPicker(true);
      },
      options
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialLoadRequestedRef.current) return;
    if (!initialLocationSet) return;

    initialLoadRequestedRef.current = true;
    console.log("Loading initial schools");
    loadInitialSchools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLocationSet]);

  // SET RADIUS FOR MAP TO DISPLAY SCHOOL
  useEffect(() => {
    if (zoom) {
      console.log("=============================)", zoom);
      setRadius(CalculateRadiusZoomLevel(zoom, center[0]));
      console.log("THIS IS THE CALCULATED RADIUS", radius);
      appendNewMarkers({ koordinatXX: center[0], koordinatYY: center[1] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom]);

  const handleSearch = async (params: {
    namaSekolah?: string;
    negeri?: string;
    jenis?: string;
  }) => {
    try {
      const results = await getSchoolSuggestion(params);
      const transformed: SearchBarMapProps[] = results.map((school) => ({
        namaSekolah: school.namaSekolah || "Sekolah Tidak Diketahui",
        kodSekolah: school.kodSekolah || "",
        koordinatYY: school.data.infoLokasi.koordinatYY,
        koordinatXX: school.data.infoLokasi.koordinatXX,
        negeri: school.data?.infoPentadbiran?.negeri || "",
        bandarSurat: school.data?.infoKomunikasi?.bandarSurat,
        jenisLabel: school.data?.infoSekolah?.jenisLabel || "",
        jumlahPelajar: school.data?.infoSekolah?.jumlahPelajar || 0,
        jumlahGuru: school.data?.infoSekolah?.jumlahGuru || 0,
        parlimen: school.data?.infoPentadbiran?.parlimen || "",
      }));
      setFilteredSearchResult(transformed);

      if (transformed.length > 0) {
        const firstResult = transformed[0];
        setCenter([firstResult.koordinatYY, firstResult.koordinatXX]);
        setZoom(18);
      }
    } catch (error) {
      console.error("Error fetching school suggestions:", error);
      setFilteredSearchResult([]);
    }
  };

  return (
    <div className="h-full w-full flex relative">
      <SearchBarMap
        query={query}
        setQuery={setQuery}
        suggestions={filteredSearchResult}
        onSearch={handleSearch}
        viewSchool={viewSchool}
        setViewSchool={setViewSchool}
      />
      <MapContainerComponent
        dragStartPos={dragStartPos}
        setDragStartPos={setDragStartPos}
        fetchNearbySchools={fetchNearbySchools}
        setViewSchool={setViewSchool}
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
