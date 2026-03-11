import { useState, useEffect, useRef, type UIEvent } from "react";
import {
  ArrowBackIcon,
  ChevronRightIcon,
  PinIcon,
} from "@govtechmy/myds-react/icon";
import { FilterDropdowns } from "./FilterDropdowns";
import type { SearchBarMapProps } from "../../types/maps";
import { getSchoolS3Json } from "../../services/school.svc";
import {
  SearchBar,
  SearchBarInput,
  SearchBarInputContainer,
  SearchBarSearchButton,
  // SearchBarHint,
} from "@govtechmy/myds-react/search-bar";
import { clx } from "@govtechmy/myds-react/utils";
import { Button } from "@govtechmy/myds-react/button";
// import { Pill } from "@govtechmy/myds-react/pill";
import { SchoolInfoWindow } from "./SchoolInfoWindow";
import { useMapViewStore } from "../../store/mapView";
import { NEGERI_LIST } from "../../contentData";
import { calculateDistance } from "../../utils/calculateDistance";
import { useLocationSessionStore } from "../../store/locationSession";
import SekolahAngkatMadaniIcon from "../../icons/SekolahAngkatMadaniIcon";

export function SearchBarMap({ schoolTypes }: { schoolTypes: string[] }) {
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
  } = useMapViewStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedNegeri, setSelectedNegeri] = useState("ALL");
  const [selectedJenis, setSelectedJenis] = useState("ALL");
  const debounceTimerRef = useRef<number | null>(null);
  const setCenter = useMapViewStore((s) => s.setCenter);
  const setZoom = useMapViewStore((s) => s.setZoom);
  const { initialLocationUser } = useLocationSessionStore();

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Use predefined lists instead of extracting from markers
  const negeriList = NEGERI_LIST;

  // Handler for MyDS SearchBar onValueChange
  const handleValueChange = (value: string) => {
    setQuery(value);
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
        }).then(() => {
          // After search completes, find exact match
          if (localSuggestions.length > 0) {
            const trimmedQuery = query.trim().toLowerCase();
            const exactMatch = localSuggestions.find(
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
    } else if (trimmedQuery.length < 3) {
      setLocalSuggestions([]);
      setDataTotal(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, initialLocationSet]);

  useEffect(() => {
    if (!initialLocationSet) return;
    handleSearch({
      namaSekolah: query.trim().length >= 3 ? query : "",
      negeri: selectedNegeri !== "ALL" ? selectedNegeri : "ALL",
      jenis: selectedJenis !== "ALL" ? selectedJenis : "ALL",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedJenis, selectedNegeri]);

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
        setTimeout(() => {
          setZoom(15);
        }, 0);

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

    // Keep lazy-loading consistent with search bar: only load more when query has at least 3 characters
    if (query.trim().length < 3) return;

    handleSearch(
      {
        namaSekolah: query,
        negeri: selectedNegeri !== "ALL" ? selectedNegeri : undefined,
        jenis: selectedJenis !== "ALL" ? selectedJenis : undefined,
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
          <div
            className={clx(
              "flex items-center gap-2 ",
              isExpanded ? "py-[16px] px-4" : "",
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
                  isExpanded ? "border-none shadow-[none] !px-0" : "w-full",
                )}
              >
                <SearchBarInput
                  ref={inputRef}
                  placeholder="Carian Sekolah"
                  value={query}
                  onValueChange={handleValueChange}
                  // readOnly={!isExpanded}
                  className={clx(isExpanded ? "pl-0" : "")}
                />
                {/* {(!query || query.trim().length === 0) && (
                  <SearchBarHint className="">
                    Tekan <Pill size="small">/</Pill> untuk cari
                  </SearchBarHint>
                )} */}
                <SearchBarSearchButton/>
              </SearchBarInputContainer>
            </SearchBar>
          </div>
          {isExpanded && (
            <>
              <FilterDropdowns
                selectedNegeri={selectedNegeri}
                selectedJenis={selectedJenis}
                negeriList={negeriList}
                jenisList={schoolTypes}
                setSelectedNegeri={setSelectedNegeri}
                setSelectedJenis={setSelectedJenis}
              />
              {query.length > 1 && (
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
              className="w-full h-full overflow-y-auto overflow-x-auto border-t border-otl-divider flex-1"
            >
              {localSuggestions.length > 0 ? (
                localSuggestions.map((school, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleSelect(school)}
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
                          {`${school?.namaSekolah ?? "Sekolah"} ${school?.kodSekolah ?? ""}`.trim()}
                        </span>

                        <span className="text-sm text-gray-500 pb-3">
                          {school.bandarSurat}, {school.negeri}
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
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
