import { useEffect, useState, useCallback, useRef } from "react";
import type { SearchBarMapProps } from "../types/maps";
import { getSchoolSuggestion, getSchoolNearby, getSchoolS3Json } from "../services/school.svc";
import { SearchBarMap } from "../components/maps/SearchBarMap";
import { MapContainerComponent } from "../components/maps/MapContainerComponents";
import { LocationPickerWindow } from "../components/maps";
import type { ItemSekolahModel, MarkerGroup } from "../models/response";
import { useMap } from "react-leaflet";
import { useMapViewStore } from "../store/mapView";

export function MapViewController() {
  const map = useMap();
  const { center, zoom } = useMapViewStore();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
}


export default function SchoolMaps() {
  const [query, setQuery] = useState("");
  const [filteredSearchResult, setFilteredSearchResult] = useState< SearchBarMapProps[]>([]);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const {
    setCenter: setMapCenter,
    setZoom: setMapZoom,
    initialLocationSet,
    setInitialLocationSet,
  } = useMapViewStore();
  const [schoolMarkers, setSchoolMarkers] = useState< Map<string, { lat: number; lng: number; dataUrl: string }> >(new Map());
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
        bandarSurat: school.data?.infoKomunikasi?.bandarSurat || "",
        jenisLabel: school.data?.infoSekolah?.jenisLabel || "",
        jumlahPelajar: school.data?.infoSekolah?.jumlahPelajar || 0,
        jumlahGuru: school.data?.infoSekolah?.jumlahGuru || 0,
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

  const fetchS3SchoolData = async (dataUrl: string) => {
    try {
      const schoolData = await getSchoolS3Json(dataUrl);
      return schoolData;
    } catch (error) {
      console.error("Error fetching S3 school data:", error);
      return null;
    }
  }

  const fetchNearbySchools = useCallback(
    async (
      latitude: number,
      longitude: number,
      radiusInMeter: number = 10000
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
    },
    [initialLocationSet]
  );

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
        fetchS3SchoolData={fetchS3SchoolData}
        setViewSchool={setViewSchool}
      />
      {showLocationPicker && (
        <LocationPickerWindow
          onClose={() => setShowLocationPicker(false)}
          setInitialLocationSet={setInitialLocationSet}
        />
      )}
    </div>
  );
}
