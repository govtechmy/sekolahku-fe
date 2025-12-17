
import { useState, useEffect, useRef } from "react";
import {
  ArrowBackIcon,
  ChevronRightIcon,
  MapIcon,
} from "@govtechmy/myds-react/icon";
import { FilterDropdowns } from "./FilterDropdowns";
import type { SearchBarMapProps } from "../../types/maps";
import { getSchoolS3Json } from "../../services/school.svc";
import {
  SearchBar,
  SearchBarHint,
  SearchBarInput,
  SearchBarInputContainer,
  SearchBarSearchButton,
} from "@govtechmy/myds-react/search-bar";
import { clx } from "@govtechmy/myds-react/utils";
import { Button } from "@govtechmy/myds-react/button";
import { Pill } from "@govtechmy/myds-react/pill";
import { SchoolInfoWindow } from "./SchoolInfoWindow";
import type { ItemSekolahModel } from "../../models/response";
import { useMapViewStore } from "../../store/mapView";
import { JENIS_LIST, NEGERI_LIST } from "../../contentData";

interface MapSearchBarProps{
  query: string;
  setQuery: (val: string) => void;
  suggestions: SearchBarMapProps[];
  onSearch: (params: { namaSekolah?: string; negeri?: string; jenis?: string }) => void;
  viewSchool: ItemSekolahModel | null;
  setViewSchool: React.Dispatch<React.SetStateAction<ItemSekolahModel | null>>;
}

export function SearchBarMap({
  query,
  setQuery,
  suggestions,
  onSearch,
  viewSchool,
  setViewSchool,
}: MapSearchBarProps) {
  const { initialLocationSet } = useMapViewStore();
  const [localSuggestions, setLocalSuggestions] = useState<SearchBarMapProps[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedNegeri, setSelectedNegeri] = useState("ALL");
  const [selectedJenis, setSelectedJenis] = useState("ALL");
  const debounceTimerRef = useRef<number | null>(null);
    const {
    setCenter: setMapCenter,
    setZoom: setMapZoom,
  } = useMapViewStore();

  // Use predefined lists instead of extracting from markers
  const negeriList = NEGERI_LIST;
  const jenisList = JENIS_LIST;

  // Handler for MyDS SearchBar onValueChange
  const handleValueChange = (value: string) => {
    setQuery(value);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmedValue = value.trim();
    if (trimmedValue.length >= 3 && initialLocationSet) {
      debounceTimerRef.current = window.setTimeout(() => {
        onSearch({
          namaSekolah: value,
          negeri: selectedNegeri !== "ALL" ? selectedNegeri : undefined,
          jenis: selectedJenis !== "ALL" ? selectedJenis : undefined,
        });
      }, 500);
    } else {
      setLocalSuggestions([]);
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

  useEffect(() => {
    if (!initialLocationSet) return;
    onSearch({
      namaSekolah: query.trim().length >= 3 ? query : "",
      negeri: selectedNegeri !== "ALL" ? selectedNegeri : "ALL",
      jenis: selectedJenis !== "ALL" ? selectedJenis : "ALL",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedJenis, selectedNegeri]);

  useEffect(() => {
    setLocalSuggestions(suggestions);
  }, [suggestions]);

  const handleSelect = async (school: SearchBarMapProps) => {
    try {
      if (!school.kodSekolah) {
        console.error("School code is null");
        return;
      }
      const detail = await getSchoolS3Json(undefined, school.negeri, school.parlimen, school.kodSekolah);
      if (detail) {
        setViewSchool(detail);
        setMapCenter([school.koordinatXX, school.koordinatYY]);
        setMapZoom(17);

      }
    } catch (error) {
      console.error("Error fetching school details:", error);
    }
  };

  return (
    <div
      className={`absolute flex justify-start z-[500] bottom-0 
          ${
            isExpanded
              ? "top-0 left-0 gap-4"
              : "top-[16px] left-3 flex-col gap-2 w-[350px] h-[45px]"
          }
        `}
    >
      <div
        className={`shadow-md border border-otl-divider bg-white 
            ${
              isExpanded ? "w-[350px]" : "rounded-full cursor-pointer w-[328px]"
            }
          `}
        onClick={() => {
          if (!isExpanded) setIsExpanded(true);
        }}
      >
        <div className={clx("h-full w-full flex flex-col")}>
          <div
            className={clx(
              "flex items-center gap-2 ",
              isExpanded ? "py-[16px] px-4" : ""
            )}
          >
            {isExpanded && (
              <Button
                variant="unset"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className="p-1.5 pl-0"
              >
                <ArrowBackIcon className="size-4" />
              </Button>
            )}

            <SearchBar size="large" className="w-full">
              <SearchBarInputContainer
                className={clx(
                  isExpanded ? "border-none shadow-[none] !px-0" : "w-[326px]"
                )}
              >
                <SearchBarInput
                  placeholder="Carian Sekolah"
                  value={query}
                  onValueChange={handleValueChange}
                  readOnly={!isExpanded}
                  className={clx(isExpanded ? "pl-0" : "")}
                />
                <SearchBarHint className="">
                  Tekan <Pill size="small">/</Pill> untuk cari
                </SearchBarHint>
                <SearchBarSearchButton />
              </SearchBarInputContainer>
            </SearchBar>
          </div>
          {isExpanded && (
            <FilterDropdowns
              selectedNegeri={selectedNegeri}
              selectedJenis={selectedJenis}
              negeriList={negeriList}
              jenisList={jenisList}
              setSelectedNegeri={setSelectedNegeri}
              setSelectedJenis={setSelectedJenis}
            />
          )}

          {isExpanded && (
            <div className="w-full h-full overflow-y-auto overflow-x-auto border-t border-otl-divider flex-1">
              {localSuggestions.length > 0 ? (
                localSuggestions.map((school, idx) => (
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
                            ? `${school.distance.toFixed(
                              2
                            )} km dari lokasi anda`
                            : "Jarak tidak tersedia"}
                        </span>
                      </div>

                      <ChevronRightIcon className="w-5 h-5 text-txt-primary" />
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-4 text-sm text-gray-500">
                  Tiada hasil carian
                </li>
              )}
            </div>
          )}
        </div>
      </div>
      {viewSchool && (
        <div
          className={clx(
            "bg-transparent flex-1 w-[328px] rounded-xl overflow-y-auto",
            isExpanded ? "my-10" : "absolute top-[50px]"
          )}
        >
          <SchoolInfoWindow school={viewSchool} setSelected={() => setViewSchool(null)} />
        </div>
      )}
    </div>
  );
}
