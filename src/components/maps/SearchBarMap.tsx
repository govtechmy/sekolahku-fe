import { useState, useEffect, useRef, type UIEvent } from "react";
import {
  ArrowBackIcon,
  ChevronRightIcon,
  PinIcon,
} from "@govtechmy/myds-react/icon";
import { FilterDropdowns } from "./FilterDropdowns";
import type { SearchBarMapProps } from "../../types/maps";
import { getSchoolS3Json } from "../../services/school.svc";
import { getRoute } from "../../services/route.svc";
import {
  SearchBar,
  SearchBarInput,
  SearchBarInputContainer,
  SearchBarSearchButton,
} from "@govtechmy/myds-react/search-bar";
import { clx } from "@govtechmy/myds-react/utils";
import { Button } from "@govtechmy/myds-react/button";
import { SchoolInfoWindow } from "./SchoolInfoWindow";
import { useMapViewStore } from "../../store/mapView";
import { NEGERI_LIST } from "../../contentData";
import { calculateDistance } from "../../utils/calculateDistance";
import { useLocationSessionStore } from "../../store/locationSession";
import SekolahAngkatMadaniIcon from "../../icons/SekolahAngkatMadaniIcon";
import underScoreRemover from "../../utils/underscoreRemover";

/**
 * Highlights matching text portions by wrapping them in a styled <mark> element.
 */
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query || query.trim().length < 2) return text;
  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200 text-gray-900 rounded-sm px-0.5">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

type SearchBarMapComponentProps = {
  schoolTypes: string[];
  selectedPeringkat: string;
  setSelectedPeringkat: (value: string) => void;
};

export function SearchBarMap({
  schoolTypes,
  selectedPeringkat,
  setSelectedPeringkat,
}: SearchBarMapComponentProps) {
  const {
    initialLocationSet,
    viewSchool,
    setViewSchool,
    localSuggestions,
    setLocalSuggestions,
    query,
    setQuery,
    handleSearch,
    localSuggestionsPage,
    hasMoreLocalSuggestions,
    isLoadingLocalSuggestions,
    dataTotal,
    setDataTotal,
    setPointA,
    setPointB,
    setRoute,
    clearRoute,
  } = useMapViewStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedNegeri, setSelectedNegeri] = useState("ALL");
  const [selectedJenis, setSelectedJenis] = useState("ALL");
  const debounceTimerRef = useRef<number | null>(null);
  const setCenter = useMapViewStore((s) => s.setCenter);
  const setZoom = useMapViewStore((s) => s.setZoom);
  const { initialLocationUser } = useLocationSessionStore();

  // Field A (From) state
  const [fieldAValue, setFieldAValue] = useState("Lokasi Semasa");
  const [fieldAIsCurrentLocation, setFieldAIsCurrentLocation] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const inputARef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const isSwappingRef = useRef(false);
  const hoverRequestIdRef = useRef(0);

  // Use predefined lists instead of extracting from markers
  const negeriList = NEGERI_LIST;
  const prevPeringkatRef = useRef(selectedPeringkat);

  // Set pointA from user location when it becomes available
  useEffect(() => {
    if (fieldAIsCurrentLocation && initialLocationUser[0] != null && initialLocationUser[1] != null) {
      setPointA([initialLocationUser[0], initialLocationUser[1]]);
    }
  }, [fieldAIsCurrentLocation, initialLocationUser, setPointA]);

  // Fetch OSRM route when both pointA and pointB are set
  const pointA = useMapViewStore((s) => s.pointA);
  const pointB = useMapViewStore((s) => s.pointB);

  useEffect(() => {
    if (!pointA || !pointB) {
      clearRoute();
      return;
    }

    let cancelled = false;

    const fetchRoute = async () => {
      const result = await getRoute(pointA, pointB);
      if (cancelled) return;

      if (result) {
        setRoute(result.coordinates, result.distance, result.duration);
      } else {
        clearRoute();
      }
    };

    fetchRoute();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointA?.[0], pointA?.[1], pointB?.[0], pointB?.[1]]);

  // Reset selectedJenis to ALL when peringkat changes, then trigger search
  useEffect(() => {
    if (prevPeringkatRef.current !== selectedPeringkat) {
      prevPeringkatRef.current = selectedPeringkat;
      // Reset jenis when peringkat changes - this will trigger the search via selectedJenis change
      if (selectedJenis !== "ALL") {
        setSelectedJenis("ALL");
      } else {
        // If jenis is already ALL, manually trigger search since selectedJenis won't change
        if (initialLocationSet) {
          handleSearch({
            namaSekolah: query.trim().length >= 3 ? query : "",
            negeri: selectedNegeri !== "ALL" ? selectedNegeri : "ALL",
            jenis: "ALL",
            peringkat: selectedPeringkat !== "ALL" ? selectedPeringkat : "ALL",
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeringkat]);

  // Also reset if the current jenis is not valid for the new schoolTypes list
  useEffect(() => {
    if (selectedJenis !== "ALL" && !schoolTypes.includes(selectedJenis)) {
      setSelectedJenis("ALL");
    }
  }, [schoolTypes, selectedJenis]);

  // Handler for MyDS SearchBar onValueChange (Field B - destination)
  const handleValueChange = (value: string) => {
    setQuery(value);
  };

  // Handler for Field A value change
  const handleFieldAChange = (value: string) => {
    setFieldAValue(value);
    if (value === "" || value === "Lokasi Semasa") {
      setFieldAIsCurrentLocation(true);
      if (initialLocationUser[0] != null && initialLocationUser[1] != null) {
        setPointA([initialLocationUser[0], initialLocationUser[1]]);
      }
    } else {
      setFieldAIsCurrentLocation(false);
      // Clear pointA when typing a custom value (no geocoding available)
      setPointA(null);
    }
  };

  // Swap A and B values
  const handleSwap = () => {
    const currentA = fieldAValue;
    const currentAIsLocation = fieldAIsCurrentLocation;
    const currentB = query;
    const pointACoords = useMapViewStore.getState().pointA;
    const pointBCoords = useMapViewStore.getState().pointB;

    // Mark as swapping to prevent debounce search from firing
    isSwappingRef.current = true;

    // Move B text → A
    if (currentB && currentB.trim().length > 0) {
      setFieldAValue(currentB);
      setFieldAIsCurrentLocation(false);
    } else {
      setFieldAValue("Lokasi Semasa");
      setFieldAIsCurrentLocation(true);
    }

    // Move A text → B
    if (currentAIsLocation) {
      setQuery("");
    } else if (currentA && currentA.trim().length > 0 && currentA !== "Lokasi Semasa") {
      setQuery(currentA);
    } else {
      setQuery("");
    }

    // Swap coordinates
    setPointA(pointBCoords);
    setPointB(pointACoords);

    // Pan map to new destination (pointB = old pointA)
    if (pointACoords) {
      setCenter(pointACoords);
      setZoom(15);
    }

    // Reset swapping flag after state updates propagate
    setTimeout(() => {
      isSwappingRef.current = false;
    }, 500);
  };

  useEffect(() => {
    const handleSlashFocus = (e: KeyboardEvent) => {
      if (e.key === "/" && !isExpanded) {
        e.preventDefault();
        setIsExpanded(true);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      } else if (
        e.key === "/" &&
        isExpanded &&
        document.activeElement !== inputRef.current
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    let resizeTimer: number | null = null;
    const handleResize = () => {
      if (resizeTimer) {
        clearTimeout(resizeTimer);
      }
      resizeTimer = window.setTimeout(() => {
        if (window.innerWidth < 768 && isExpanded) {
          setIsExpanded(false);
        }
      }, 150);
    };

    window.addEventListener("keydown", handleSlashFocus);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("keydown", handleSlashFocus);
      window.removeEventListener("resize", handleResize);
      if (resizeTimer) {
        clearTimeout(resizeTimer);
      }
    };
  }, [isExpanded]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Trigger search when query is set (with debouncing)
  useEffect(() => {
    // Skip search during a swap operation
    if (isSwappingRef.current) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmedQuery = query.trim();

    if (trimmedQuery.length >= 3 && initialLocationSet) {
      setIsExpanded(true);
      debounceTimerRef.current = window.setTimeout(() => {
        handleSearch({
          namaSekolah: query,
          negeri: selectedNegeri !== "ALL" ? selectedNegeri : "ALL",
          jenis: selectedJenis !== "ALL" ? selectedJenis : "ALL",
          peringkat: selectedPeringkat !== "ALL" ? selectedPeringkat : "ALL",
        }).then(() => {
          // After search completes, find exact match from current store state
          const currentSuggestions = useMapViewStore.getState().localSuggestions;
          if (currentSuggestions.length > 0) {
            const trimmedQuery = query.trim().toLowerCase();
            const exactMatch = currentSuggestions.find(
              (school) => school.namaSekolah.toLowerCase() === trimmedQuery,
            );

            if (exactMatch) {
              handleSelect(exactMatch);
            } else {
              // No exact match found, don't show school info window
              setViewSchool(null);
            }
          }
        });
      }, 250);
    } else if (trimmedQuery.length < 3 && initialLocationSet) {
      setLocalSuggestions([]);
      setDataTotal(0);
      // No query — fetch all with current filters
      handleSearch({
        namaSekolah: "",
        negeri: selectedNegeri !== "ALL" ? selectedNegeri : "ALL",
        jenis: selectedJenis !== "ALL" ? selectedJenis : "ALL",
        peringkat: selectedPeringkat !== "ALL" ? selectedPeringkat : "ALL",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, initialLocationSet]);

  useEffect(() => {
    if (!initialLocationSet) return;
    handleSearch({
      namaSekolah: query.trim().length >= 3 ? query : "",
      negeri: selectedNegeri !== "ALL" ? selectedNegeri : "ALL",
      jenis: selectedJenis !== "ALL" ? selectedJenis : "ALL",
      peringkat: selectedPeringkat !== "ALL" ? selectedPeringkat : "ALL",
    });
    // Note: selectedPeringkat change is handled separately to reset jenis first
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedJenis, selectedNegeri]);

  const handleHover = async (school: SearchBarMapProps) => {
    try {
      if (!school.kodSekolah) return;
      const requestId = ++hoverRequestIdRef.current;
      const detail = await getSchoolS3Json(
        undefined,
        school.negeri,
        school.parlimen,
        school.kodSekolah,
      );
      // Only update if this is still the latest hover request
      if (requestId === hoverRequestIdRef.current && detail) {
        setViewSchool(detail);
      }
    } catch (error) {
      console.error("Error fetching school details on hover:", error);
    }
  };

  const handleSelect = async (school: SearchBarMapProps) => {
    try {
      if (!school.kodSekolah) {
        console.error("School code is null");
        return;
      }
      const detail = await getSchoolS3Json(
        undefined,
        school.negeri,
        school.parlimen,
        school.kodSekolah,
      );
      if (detail) {
        setViewSchool(detail);
        setCenter([school.koordinatYY, school.koordinatXX]);
        setZoom(16);

        // Set pointB when a school is selected
        setPointB([school.koordinatYY, school.koordinatXX]);

        // Populate Field B with school name
        isSwappingRef.current = true;
        setQuery(school.namaSekolah);
        setTimeout(() => {
          isSwappingRef.current = false;
        }, 500);

        // Close the expanded search panel on mobile/tablet (md and smaller)
        if (window.innerWidth < 768) {
          setIsExpanded(false);
        }
      }
    } catch (error) {
      console.error("Error fetching school details:", error);
    }
  };

  const loadMoreSuggestions = () => {
    if (isLoadingLocalSuggestions || !hasMoreLocalSuggestions) return;

    handleSearch(
      {
        namaSekolah: query.trim().length >= 3 ? query : "",
        negeri: selectedNegeri !== "ALL" ? selectedNegeri : "ALL",
        jenis: selectedJenis !== "ALL" ? selectedJenis : "ALL",
        peringkat: selectedPeringkat !== "ALL" ? selectedPeringkat : "ALL",
      },
      (localSuggestionsPage || 1) + 1,
      true,
    );
  };

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    // Distance (in px) from the bottom at which to trigger loading more results
    const threshold = 50;

    if (
      target.scrollTop + target.clientHeight >=
      target.scrollHeight - threshold
    ) {
      loadMoreSuggestions();
    }
  };

  return (
    <div
      className={`absolute flex z-[500] bottom-0 
          ${
            isExpanded
              ? "top-0 md:top-0 left-0 gap-4 justify-start w-full md:w-auto"
              : "top-[16px] left-3 right-3 sm:left-3 sm:right-3 flex-col gap-2 h-[45px] justify-center sm:justify-start"
          }
        `}
    >
      <div
        className={`shadow-md border border-otl-divider bg-white 
            ${
              isExpanded
                ? "w-full md:max-w-[350px]"
                : "rounded-full cursor-pointer w-full md:max-w-[350px]"
            }
          `}
        onClick={() => {
          if (!isExpanded) {
            setIsExpanded(true);
            // Close school info window on mobile when expanding search
            if (window.innerWidth < 768 && viewSchool) {
              setViewSchool(null);
            }
          }
        }}
      >
        <div className={clx("h-full w-full flex flex-col")}>
          {/* Header with back button */}
          {isExpanded && (
            <div className="flex items-center gap-2 pt-[16px] px-4">
              <Button
                variant="unset"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className="p-1.5 pl-0"
                aria-label="Tutup carian"
              >
                <ArrowBackIcon className="size-4" />
              </Button>
              <span className="text-sm font-medium text-txt-primary">Carian Sekolah</span>
            </div>
          )}

          {/* A-to-B fields (expanded view) */}
          {isExpanded ? (
            <div className="flex items-stretch gap-2 px-4 py-3">
              {/* Vertical dot connector */}
              <div className="flex flex-col items-center justify-center gap-1 py-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-blue-300" />
                <div className="w-0.5 flex-1 bg-gray-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-red-300" />
              </div>

              {/* Input fields */}
              <div className="flex flex-col flex-1 gap-2">
                {/* Field A - From */}
                <div className="flex items-center border border-otl-divider rounded-lg px-3 py-2 bg-gray-50">
                  <input
                    ref={inputARef}
                    type="text"
                    placeholder="Dari"
                    aria-label="Lokasi asal"
                    value={fieldAValue}
                    onChange={(e) => handleFieldAChange(e.target.value)}
                    onFocus={() => {
                      if (fieldAIsCurrentLocation) {
                        setFieldAValue("");
                      }
                    }}
                    onBlur={() => {
                      if (fieldAValue.trim() === "") {
                        setFieldAValue("Lokasi Semasa");
                        setFieldAIsCurrentLocation(true);
                        if (initialLocationUser[0] != null && initialLocationUser[1] != null) {
                          setPointA([initialLocationUser[0], initialLocationUser[1]]);
                        }
                      }
                    }}
                    className={clx(
                      "flex-1 bg-transparent text-sm outline-none",
                      fieldAIsCurrentLocation ? "text-blue-600" : "text-txt-primary",
                    )}
                  />
                </div>

                {/* Field B - To (school search) */}
                <div className="flex items-center border border-otl-divider rounded-lg px-3 py-2 bg-white">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Ke - Carian Sekolah"
                    aria-label="Destinasi sekolah"
                    value={query}
                    onChange={(e) => handleValueChange(e.target.value)}
                    className="flex-1 bg-transparent text-sm outline-none text-txt-primary"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400 shrink-0"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
              </div>

              {/* Swap button */}
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSwap();
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors text-txt-primary pointer-events-auto cursor-pointer"
                  title="Tukar A dan B"
                  aria-label="Tukar lokasi asal dan destinasi"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="pointer-events-none"
                  >
                    <path d="M7 3l-4 4 4 4" />
                    <path d="M3 7h18" />
                    <path d="M17 21l4-4-4-4" />
                    <path d="M21 17H3" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            /* Collapsed view - single search bar */
            <div className="flex items-center gap-2">
              <SearchBar size="large" className="w-full">
                <SearchBarInputContainer className="border-none shadow-[none] w-full">
                  <SearchBarInput
                    placeholder="Carian Sekolah"
                    value={query}
                    onValueChange={handleValueChange}
                    className=""
                  />
                  <SearchBarSearchButton />
                </SearchBarInputContainer>
              </SearchBar>
            </div>
          )}

          {isExpanded && (
            <>
              <FilterDropdowns
                selectedNegeri={selectedNegeri}
                selectedJenis={selectedJenis}
                selectedPeringkat={selectedPeringkat}
                negeriList={negeriList}
                jenisList={schoolTypes}
                setSelectedNegeri={setSelectedNegeri}
                setSelectedJenis={setSelectedJenis}
                setSelectedPeringkat={setSelectedPeringkat}
              />
              {dataTotal > 0 && (
                <div className="p-4 pt-0 text-txt-black-500">
                  {dataTotal} buah sekolah ditemui berdasarkan carian anda
                </div>
              )}
            </>
          )}

          {isExpanded && (
            <div
              ref={listRef}
              onScroll={handleScroll}
              tabIndex={0}
              className="w-full h-full overflow-y-auto overflow-x-auto border-t border-otl-divider flex-1 focus:outline-2 focus:outline-otl-primary-200 focus:outline-offset-2 "
            >
              {localSuggestions.length > 0 ? (
                localSuggestions.map((school, idx) => (
                  <li
                    key={school.kodSekolah || idx}
                    onClick={() => handleSelect(school)}
                    onMouseEnter={() => handleHover(school)}
                    className="px-4 py-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <div className="flex gap-2 items-center pb-3">
                          <span className="text-xs font-medium text-txt-primary bg-bg-primary-100 px-2 py-0.5 rounded-full w-fit border border-bg-primary-700">
                            {school.jenisLabel || "Sekolah"}
                          </span>
                          {school.isSekolahAngkatMADANI && (
                            <SekolahAngkatMadaniIcon />
                          )}
                        </div>

                        <span className="text-base font-medium text-gray-900">
                          {highlightMatch(
                            `${school?.namaSekolah ?? "Sekolah"} ${school?.kodSekolah ?? ""}`.trim(),
                            query,
                          )}
                        </span>

                        <span className="text-sm text-gray-500 pb-3">
                          {highlightMatch(
                            `${underScoreRemover(school.bandarSurat ?? "")}, ${underScoreRemover(school.negeri ?? "")}`,
                            query,
                          )}
                        </span>

                        <span className="mt-1 flex items-center text-sm text-primary-600 gap-1">
                          {initialLocationUser?.[0] &&
                            initialLocationUser?.[1] && (
                              <>
                                <PinIcon className="w-4 h-4" />
                                {(() => {
                                  const distanceInMeters = calculateDistance(
                                    initialLocationUser[0],
                                    initialLocationUser[1],
                                    school.koordinatYY,
                                    school.koordinatXX,
                                  );
                                  if (distanceInMeters > 1000) {
                                    return `${(distanceInMeters / 1000).toFixed(2)} km dari lokasi anda`;
                                  }
                                  return `${distanceInMeters.toFixed(2)} meter dari lokasi anda`;
                                })()}
                              </>
                            )}
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
        <>
          {/* Desktop view - side panel */}
          <div
            className={clx(
              "hidden md:block bg-transparent rounded-xl overflow-y-auto",
              isExpanded
                ? "my-10 mx-3 max-w-[328px]"
                : "absolute top-[53px] max-h-[78vh] w-full max-w-[350px]",
            )}
          >
            <SchoolInfoWindow
              school={viewSchool}
              setSelected={() => setViewSchool(null)}
              mobile={false}
              searchQuery={query}
            />
          </div>

          {/* Mobile view - bottom sheet */}
          <div
            className={clx(
              "md:hidden fixed inset-x-0 bottom-0 z-[60] flex flex-col",
              isFullScreen ? "top-[31vh]" : "max-h-[40vh]",
            )}
          >
            <div
              className={clx(
                "overflow-y-auto overscroll-none",
                isFullScreen ? "h-full" : "flex-1",
              )}
            >
              <SchoolInfoWindow
                school={viewSchool}
                setSelected={() => {
                  setViewSchool(null);
                  setIsFullScreen(false);
                }}
                mobile={true}
                isFullScreen={isFullScreen}
                onToggleFullScreen={() => setIsFullScreen(!isFullScreen)}
                searchQuery={query}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
