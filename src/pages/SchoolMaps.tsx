import { useEffect, useState, useCallback } from "react";
import type { SearchBarMapProps } from "../types/maps";
import { getSchoolSuggestion, getSchoolNearby } from "../services/school.svc";
import { SearchBarMap } from "../components/maps/SearchBarMap";
import { MapContainerComponent } from "../components/maps/MapContainerComponents";
import { LocationPickerWindow } from "../components/maps";
import L from "leaflet";
import type { ItemSekolahModel, MarkerGroup } from "../models/response";

export default function SchoolMaps() {
  const [query, setQuery] = useState("");
  const [filteredSearchResult, setFilteredSearchResult] = useState<SearchBarMapProps[]>([]);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([3.760115447396889, 108.46252441406251]);
  const [initialZoom, setInitialZoom] = useState<number>(6);
  const [mapRef, setMapRef] = useState<L.Map | null>(null);
  const [schoolMarkers, setSchoolMarkers] = useState<Map<string, { lat: number; lng: number; dataUrl: string }>>(new Map());
  const [dragStartPos, setDragStartPos] = useState<{ lat: number; lng: number } | null>(null);
  const [viewSchool, setViewSchool] = useState<ItemSekolahModel | null>(null);
  
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      console.warn("Geolocation is not supported in this browser.");
      return;
    }
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Geolocation success:", { latitude, longitude });
        setInitialPosition([latitude, longitude]);
        setInitialZoom(17);
      },
      (error) => {
        if (error)
        setShowLocationPicker(true)
      },
      options
    );
  }, []);

  // fix  later if can find
  //commenting for now cause trigger zoom on every initialPosition change
    // useEffect(() => {
    //   if (mapRef) {
    //     mapRef.setView([initialPosition[0], initialPosition[1]], initialZoom);
    //     console.log("hehehe")
    //   }
    // }, [mapRef, initialPosition, initialZoom]);

  const handleSearch = async (params: { namaSekolah?: string; negeri?: string; jenis?: string }) => {
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

      if (transformed.length > 0 && mapRef) {
        const firstResult = transformed[0];
        mapRef.setView([firstResult.lat, firstResult.lng], 18);
        setInitialPosition([firstResult.lat, firstResult.lng]);
        setInitialZoom(18);
      }
    } catch (error) {
      console.error("Error fetching school suggestions:", error);
      setFilteredSearchResult([]);
    }
  };

  // Fetch nearby schools - lifted from child component
  const fetchNearbySchools = useCallback(async (latitude: number, longitude: number, radiusInMeter: number = 10000): Promise<MarkerGroup[]> => {
    try {
      console.log("Fetching schools near:", { latitude, longitude, radiusInMeter });
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
  }, []);

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
        initialPosition={initialPosition}
        initialZoom={initialZoom}
        setInitialPosition={setInitialPosition}
        mapRef={mapRef}
        setMapRef={setMapRef}
        schoolMarkers={schoolMarkers}
        setSchoolMarkers={setSchoolMarkers}
        dragStartPos={dragStartPos}
        setDragStartPos={setDragStartPos}
        fetchNearbySchools={fetchNearbySchools}
        setViewSchool={setViewSchool}
      />
      {showLocationPicker && (
        <LocationPickerWindow  setInitialPosition={setInitialPosition} onClose={() => setShowLocationPicker(false)}  setInitialZoom={setInitialZoom} />
      )}
    </div>
  );
}
