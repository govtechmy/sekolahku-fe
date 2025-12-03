import { useState, useEffect, useRef } from "react";
import {
  SearchIcon,
  CrossIcon,
  ArrowBackIcon,
  ChevronRightIcon,
  MapIcon,
} from "@govtechmy/myds-react/icon";
import { FilterDropdowns } from "./FilterDropdowns";
import type { SchoolMarker } from "../../types/maps";
import { getSchoolSuggestion } from "../../services/school.svc";

const NEGERI_LIST = [
  'JOHOR',
  'KEDAH',
  'KELANTAN',
  'MELAKA',
  'NEGERI SEMBILAN',
  'PAHANG',
  'PERAK',
  'PERLIS',
  'PULAU PINANG',
  'SABAH',
  'SARAWAK',
  'SELANGOR',
  'TERENGGANU',
  'WILAYAH PERSEKUTUAN KUALA LUMPUR',
  'WILAYAH PERSEKUTUAN LABUAN',
  'WILAYAH PERSEKUTUAN PUTRAJAYA',
];

const JENIS_LIST = [
  "SK",
  "K9"
];

type MapSearchBarProps = {
  query: string;
  setQuery: (val: string) => void;
  setFilteredMarkers: (markers: SchoolMarker[]) => void;
  markersToShow: SchoolMarker[];
  setSelected: (marker: SchoolMarker | null) => void;
  panTo?: (lat: number, lng: number) => void;
  setZoom?: (zoom: number) => void;
};

export function MapSearchBar({
  query,
  setQuery,
  setFilteredMarkers,
  markersToShow,
  setSelected,
  panTo,
  setZoom,
}: MapSearchBarProps) {
  const [suggestions, setSuggestions] = useState<SchoolMarker[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedNegeri, setSelectedNegeri] = useState("ALL");
  const [selectedJenis, setSelectedJenis] = useState("ALL");
  const debounceTimerRef = useRef<number | null>(null);

  // Use predefined lists instead of extracting from markers
  const negeriList = NEGERI_LIST;
  const jenisList = JENIS_LIST;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelected(null);
    
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Only call API if user has typed at least 3 characters
    const trimmedValue = value.trim();
    
    if (trimmedValue.length >= 3) {
      // Add 500ms delay before calling API
      debounceTimerRef.current = setTimeout(() => {
        filterMarkers(value, selectedNegeri, selectedJenis);
      }, 500);
    } else {
      setSuggestions([]);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const filterMarkers = async (value: string, negeri: string, jenis: string) => {
    try {
      const params: { namaSekolah?: string; negeri?: string; jenis?: string } = {};
      
      if (value) {
        params.namaSekolah = value;
      }
      
      if (negeri && negeri !== "ALL") {
        params.negeri = negeri;
      }
      
      if (jenis && jenis !== "ALL") {
        params.jenis = jenis;
      }

      const results = await getSchoolSuggestion(params);
      
      const transformed: SchoolMarker[] = results.map((school) => ({
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

      setFilteredMarkers(transformed);
      setSuggestions(transformed);
    } catch (error) {
      console.error("Error fetching school suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleSelect = (school: SchoolMarker) => {
    setQuery(school.namaSekolah);
    setFilteredMarkers([school]);
    setSelected(school);
    panTo?.(school.lat, school.lng);
    setZoom?.(14);
    setSuggestions([school]);
  };

  const handleClear = () => {
    setQuery("");
    setFilteredMarkers(markersToShow);
    setSuggestions([]);
    setSelected(null);
    setSelectedNegeri("ALL");
    setSelectedJenis("ALL");
  };

  return (
    <>
      {isExpanded && (
        <div
        />
      )}

      <div
        className={`absolute flex justify-start w-[350px] transition-all z-[9999] 
          ${isExpanded ? "top-0 left-0 bottom-0" : "top-3 left-3"}
        `}
      >
        <div
          className={`w-full pointer-events-auto shadow-md border border-gray-200 bg-white 
            ${isExpanded ? "" : "rounded-full cursor-pointer"}
          `}
          onClick={() => {
            if (!isExpanded) setIsExpanded(true);
          }}
        >
        <div className="relative h-full flex flex-col">
          <div className="flex items-center px-3 py-2 gap-2">
            {isExpanded && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowBackIcon className="w-5 h-5" />
              </button>
            )}

            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Carian Sekolah"
              className="flex-1 px-2 text-sm text-gray-700 focus:outline-none z-100"
              readOnly={!isExpanded}
            />

            {isExpanded && (
              <button
                onClick={handleClear}
                className="text-gray-500 hover:text-gray-700"
              >
                <CrossIcon className="w-4 h-4" />
              </button>
            )}
            <div className="flex bg-bg-primary-600 items-center justify-center rounded-full p-1.5">
              <SearchIcon className="w-4 h-4 text-txt-white" />
            </div>
          </div>
          {isExpanded && (
            <FilterDropdowns
              selectedNegeri={selectedNegeri}
              selectedJenis={selectedJenis}
              negeriList={negeriList}
              jenisList={jenisList}
              onNegeriChange={(val: string) => {
                setSelectedNegeri(val);
                filterMarkers(query, val, selectedJenis);
              }}
              onJenisChange={(val: string) => {
                setSelectedJenis(val);
                filterMarkers(query, selectedNegeri, val);
              }}
            />
          )}

          {isExpanded && (
            <div className="w-full h-full rounded-b-md shadow-lg overflow-y-auto overflow-x-auto border-t border-gray-200 flex-1">
              {suggestions.length > 0 ? (
                suggestions.map((school, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleSelect(school)}
                    className="px-4 py-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-txt-primary bg-bg-primary-100 px-2 py-0.5 rounded-full w-fit mb-1 border border-bg-primary-700">
                          {school.jenisLabel || "Sekolah"}
                        </span>

                        <span className="text-base font-medium text-gray-900">
                          {school.namaSekolah}
                        </span>

                        <span className="text-sm text-gray-500">
                          {school.bandarSurat}, {school.negeri}
                        </span>

                        <span className="mt-1 flex items-center text-sm text-blue-600 gap-1">
                          <MapIcon className="w-4 h-4" />
                          {school.distance
                            ? `${school.distance.toFixed(2)} km dari lokasi anda`
                            : "Jarak tidak tersedia"}
                        </span>
                      </div>

                      <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-4 text-sm text-gray-500">Tiada hasil carian</li>
              )}
            </div>
          )}
        </div>
        </div>
      </div>
    </>
  );
}
