import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  SearchIcon,
  CrossIcon,
  ArrowBackIcon,
  ChevronRightIcon,
  MapIcon,
} from "@govtechmy/myds-react/icon";
import { FilterDropdowns } from "./FilterDropdowns";
import type { SchoolMarker } from "../../types/maps";

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
  const [selectedNegeri, setSelectedNegeri] = useState("");
  const [selectedJenis, setSelectedJenis] = useState("");

  const negeriList = useMemo(() => {
    const unique = Array.from(
      new Set(markersToShow.map((m: SchoolMarker) => m.negeri).filter(Boolean))
    );
    return unique;
  }, [markersToShow]);

  const jenisList = Array.from(
    new Set(markersToShow.map((m: SchoolMarker) => m.jenisLabel))
  ).sort();

  const debounceRef = useRef<number | null>(null);

  const filterMarkers = useCallback((value: string, negeri: string, jenis: string) => {
    let filtered = markersToShow;

    if (value) {
      filtered = filtered.filter((marker: SchoolMarker) =>
        marker.namaSekolah.toLowerCase().includes(value.toLowerCase())
      );
    }

    if (negeri && negeri !== "all") {
      filtered = filtered.filter((marker: SchoolMarker) => marker.negeri === negeri);
    }

    if (jenis && jenis !== "all") {
      filtered = filtered.filter((marker: SchoolMarker) => marker.jenisLabel === jenis);
    }

    setFilteredMarkers(filtered);
    setSuggestions(filtered);
  }, [markersToShow, setFilteredMarkers, setSuggestions]);

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelected(null);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce the filtering to avoid excessive operations
    debounceRef.current = setTimeout(() => {
      filterMarkers(value, selectedNegeri, selectedJenis);
    }, 300);
  }, [setQuery, setSelected, filterMarkers, selectedNegeri, selectedJenis]);

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
    setSelectedNegeri("all");
    setSelectedJenis("all");
  };

  return (
    <div
      className={`absolute flex justify-start pointer-events-none w-[350px] transition-all z-[500] 
        ${isExpanded ? "top-0 left-0" : "top-5 left-16"}
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
        <div className="relative">
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
            <ul className="w-full bg-white rounded-b-md shadow-lg h-[660px] overflow-y-auto border-t border-gray-200">
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
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
