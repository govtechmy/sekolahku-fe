import { useEffect, useState } from "react";
import type { SearchBarMapProps } from "../types/maps";
import { getSchoolSuggestion } from "../services/school.svc";
import { SearchBarMap } from "../components/maps/SearchBarMap";
import { MapContainerComponent } from "../components/maps/MapContainerComponents";
import { LocationPickerWindow } from "../components/maps";
import L from "leaflet";

export default function SchoolMaps() {
  const [query, setQuery] = useState("");
  const [filteredSearchResult, setFilteredSearchResult] = useState<SearchBarMapProps[]>([]);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([3.760115447396889, 108.46252441406251]);
  const [initialZoom, setInitialZoom] = useState<number>(6);
  const [mapRef, setMapRef] = useState<L.Map | null>(null);
  const [schoolMarkers, setSchoolMarkers] = useState<Map<string, { lat: number; lng: number }>>(new Map());
  const [dragStartPos, setDragStartPos] = useState<{ lat: number; lng: number } | null>(null);
  
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
    useEffect(() => {
      if (mapRef) {
        mapRef.setView([initialPosition[0], initialPosition[1]], initialZoom);
        console.log("hehehe")
      }
    }, [mapRef, initialPosition, initialZoom]);

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
      />
      {showLocationPicker && (
        <LocationPickerWindow  setInitialPosition={setInitialPosition} onClose={() => setShowLocationPicker(false)}  setInitialZoom={setInitialZoom} />
      )}
    </div>
  );
}
