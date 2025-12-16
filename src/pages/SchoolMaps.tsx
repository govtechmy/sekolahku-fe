import { useEffect, useState, useRef, useMemo } from "react";
import type { SearchBarMapProps } from "../types/maps";
import { getSchoolSuggestion, getSchoolNearby } from "../services/school.svc";
import { SearchBarMap } from "../components/maps/SearchBarMap";
import { MapContainerComponent } from "../components/maps/MapContainerComponents";
import { LocationPickerWindow } from "../components/maps";
import type { ItemSekolahModel, MarkerGroup } from "../models/response";
import { useMapViewStore } from "../store/mapView";
import CalculateRadiusZoomLevel from "../utils/calculateRadiusZoomLevel";

export default function SchoolMaps() {
  const [query, setQuery] = useState("");
  const [filteredSearchResult, setFilteredSearchResult] = useState<SearchBarMapProps[]>([]);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const {
    setCenter: setMapCenter,
    center,
    setZoom: setMapZoom,
    zoom,
    radius,
    setRadius,
    initialLocationSet,
    setInitialLocationSet,
  } = useMapViewStore();
  const [schoolMarkers, setSchoolMarkers] = useState<Map<string, { lat: number; lng: number; dataUrl: string }>>(new Map());
  const [dragStartPos, setDragStartPos] = useState<{ lat: number; lng: number; } | null>(null);
  const [viewSchool, setViewSchool] = useState<ItemSekolahModel | null>(null);
  const geolocationRequestedRef = useRef(false);

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
        setMapCenter([latitude, longitude]);
        setMapZoom(17);
        setInitialLocationSet(true);
      },
      (error) => {
        if (error) setShowLocationPicker(true);
      },
      options
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNearbySchools = async (
    latitude: number,
    longitude: number,
    radiusInMeter: number
  ): Promise<MarkerGroup[]> => {
    if (!initialLocationSet) {
      console.log("not set yet");
      return [];
    }
    try {
      console.log("Fetching schools near:", {
        latitude,
        longitude,
        radiusInMeter,
      });

      const nearbySchools = await getSchoolNearby({
        latitude,
        longitude,
        radiusInMeter,
      });
      return nearbySchools?.markerGroups || [];
    } catch (error) {
      console.error("Failed to fetch nearby schools:", error);
      return [];
    }
  };
  /////////////////////////////////////// CACHED SCHOOL DATA ///////////////////////////
  const initialLoadRequestedRef = useRef(false);

  const cachedSchoolData = useMemo(() => {
    const storedData = localStorage.getItem("schoolMarkerData");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        return new Map<string, { lat: number; lng: number; dataUrl: string }>(parsed);
      } catch (error) {
        console.error("Failed to parse localStorage data:", error);
        return null;
      }
    }
    return null;
  }, []);

  const extractSchoolData = (markers: MarkerGroup[]) => {
    const schoolMap = new Map<string, { lat: number; lng: number; dataUrl: string }>();
    markers.forEach((marker) => {
      if (marker.items) {
        marker.items.forEach((item) => {
          const key = `${item.kodSekolah}`;
          schoolMap.set(key, {
            lat: item.infoLokasi.koordinatYY,
            lng: item.infoLokasi.koordinatXX,
            dataUrl: item.dataUrl,
          });
        });
      }
    });
    return schoolMap;
  };

  const saveToLocalStorage = (markersMap: Map<string, { lat: number; lng: number; dataUrl: string }>) => {
    try {
      const dataToStore = JSON.stringify([...markersMap]);
      localStorage.setItem("schoolMarkerData", dataToStore);
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  };


      async function loadInitialSchools() {
        try {
          const markersArray = await fetchNearbySchools(
            center[0],
            center[1],
            radius
          );

          const schoolData = extractSchoolData(markersArray);

          // Save to localStorage using memoized function
          saveToLocalStorage(schoolData);
          setSchoolMarkers(schoolData);
        } catch (error) {
          console.error("Failed to load initial schools:", error);
        }
      }

  useEffect(() => {
    // if (initialLocationSet) {
      if (cachedSchoolData && cachedSchoolData.size > 0) {
        setSchoolMarkers(cachedSchoolData);

      } else {
        if (initialLoadRequestedRef.current) return;
        initialLoadRequestedRef.current = true;
        console.log("No cache found, loading initial schools");
        loadInitialSchools();
      }

    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLocationSet,cachedSchoolData, fetchNearbySchools, extractSchoolData, saveToLocalStorage])//cachedSchoolData, fetchNearbySchools, extractSchoolData, saveToLocalStorage

  /////////////////////////////////////// CACHED SCHOOL DATA ///////////////////////////
  useEffect(() => {
    if (zoom) {
      setRadius(CalculateRadiusZoomLevel(zoom, center[0]))
      console.log("THIS IS THE CALCULATED RADIUS", radius)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, center, radius])

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
        lat: school.data.infoLokasi.koordinatYY,
        lng: school.data.infoLokasi.koordinatXX,
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
        setMapCenter([firstResult.lat, firstResult.lng]);
        setMapZoom(18);
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
        schoolMarkers={schoolMarkers}
        setSchoolMarkers={setSchoolMarkers}
        dragStartPos={dragStartPos}
        setDragStartPos={setDragStartPos}
        fetchNearbySchools={fetchNearbySchools}
        setViewSchool={setViewSchool}
        saveToLocalStorage={saveToLocalStorage}
      />
      {showLocationPicker && (
        <LocationPickerWindow
          onClose={() => setShowLocationPicker(false)}
        />
      )}
      {!initialLocationSet && (
        <div className="fixed inset-0 z-[800] bg-bg-black-900/40 backdrop-blur-sm pointer-events-auto" />
      )}
    </div>
  );
}
