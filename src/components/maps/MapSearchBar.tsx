import { useState, useEffect, useRef } from "react";
import {
  ArrowBackIcon,
  ChevronRightIcon,
  MapIcon,
} from "@govtechmy/myds-react/icon";
import { FilterDropdowns } from "./FilterDropdowns";
import type { SchoolMarker } from "../../types/maps";
import { getSchoolSuggestion, getSchoolId } from "../../services/school.svc";
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
import offset from "../../utils/coordinateOffSet";

const NEGERI_LIST = [
  "JOHOR",
  "KEDAH",
  "KELANTAN",
  "MELAKA",
  "NEGERI SEMBILAN",
  "PAHANG",
  "PERAK",
  "PERLIS",
  "PULAU PINANG",
  "SABAH",
  "SARAWAK",
  "SELANGOR",
  "TERENGGANU",
  "WILAYAH PERSEKUTUAN KUALA LUMPUR",
  "WILAYAH PERSEKUTUAN LABUAN",
  "WILAYAH PERSEKUTUAN PUTRAJAYA",
];

const JENIS_LIST = ["SK", "K9"];

type MapSearchBarProps = {
  query: string;
  setQuery: (val: string) => void;
  setFilteredMarkers: (markers: SchoolMarker[]) => void;
  markersToShow: SchoolMarker[];
  selected: SchoolMarker | null;
  setSelected: (marker: SchoolMarker | null) => void;
  panTo?: (lat: number, lng: number) => void;
  setZoom?: (zoom: number) => void;
};

export function MapSearchBar({
  query,
  setQuery,
  setFilteredMarkers,
  selected,
  setSelected,
  panTo,
  setZoom,
}: MapSearchBarProps) {
  const [suggestions, setSuggestions] = useState<SchoolMarker[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedNegeri, setSelectedNegeri] = useState("ALL");
  const [selectedJenis, setSelectedJenis] = useState("ALL");
  const [selectedSchoolDetail, setSelectedSchoolDetail] = useState<ItemSekolahModel | null>(null);
  const debounceTimerRef = useRef<number | null>(null);

  // Use predefined lists instead of extracting from markers
  const negeriList = NEGERI_LIST;
  const jenisList = JENIS_LIST;

  // Handler for MyDS SearchBar onValueChange
  const handleValueChange = (value: string) => {
    setQuery(value);
    setSelected(null);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmedValue = value.trim();
    if (trimmedValue.length >= 3) {
      // Add 500ms delay before calling API
      debounceTimerRef.current = window.setTimeout(() => {
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

  const filterMarkers = async (
    value: string,
    negeri: string,
    jenis: string
  ) => {
    try {
      const params: { namaSekolah?: string; negeri?: string; jenis?: string } =
        {};

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

      setZoom?.(13);
      if (transformed.length > 0) {
        panTo?.(transformed[0].lat, transformed[0].lng-offset);
      }
      setFilteredMarkers(transformed);
      setSuggestions(transformed);
    } catch (error) {
      console.error("Error fetching school suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleSelect = async (school: SchoolMarker) => {
    setZoom?.(18);
    panTo?.(school.lat, school.lng - offset);
    setSelected(school);
    
    try {
      if (!school.kodSekolah) {
        console.error("School code is null");
        return;
      }
      const detail = await getSchoolId(school.kodSekolah);
      if (detail) {
        setSelectedSchoolDetail(detail);
      }
    } catch (error) {
      console.error("Error fetching school details:", error);
    }
  };

  return (
    <div
      className={`absolute flex justify-start z-[1000] bottom-0 
          ${
            isExpanded
              ? "top-0 left-0 gap-4"
              : "top-[16px] left-3 flex-col gap-2 w-[350px]"
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

            <SearchBar size="large" className="w-full ">
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
            <div className="w-full h-full overflow-y-auto overflow-x-auto border-t border-otl-divider flex-1">
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
      {selected && 
      <div
        className={clx(
          "bg-transparent flex-1 w-[328px] rounded-xl overflow-y-auto",
          isExpanded ? "my-10" : ""
        )}
      >
        {selectedSchoolDetail && <SchoolInfoWindow school={selectedSchoolDetail} setSelected={setSelected} />}
      </div>
      }
    </div>
  );
}
