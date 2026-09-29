import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type UIEvent,
} from "react";
import {
  ArrowBackIcon,
  ChevronRightIcon,
  InfoIcon,
  PinIcon,
} from "@govtechmy/myds-react/icon";
import { FIRST_LOAD_ZOOM } from "../../constants/mapDefaults";
import { SearchFallbackIndicator } from "../shared/SearchFallbackIndicator";
import type { SearchBarMapProps } from "../../types/maps";
import { getSchoolS3Json } from "../../services/school.svc";
import { searchPoi, type PoiResult } from "../../services/geocode.svc";
import { getRoute, getRouteDistances } from "../../services/route.svc";
import {
  SearchBar,
  SearchBarInput,
  SearchBarInputContainer,
  SearchBarSearchButton,
} from "@govtechmy/myds-react/search-bar";
import { clx } from "@govtechmy/myds-react/utils";
import { Button } from "@govtechmy/myds-react/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@govtechmy/myds-react/tooltip";
import { SchoolInfoWindow } from "./SchoolInfoWindow";
import { useMapViewStore } from "../../store/mapView";
import { calculateDistance } from "../../utils/calculateDistance";
import { useLocationSessionStore } from "../../store/locationSession";
import SekolahAngkatMadaniIcon from "../../icons/SekolahAngkatMadaniIcon";
import underScoreRemover from "../../utils/underscoreRemover";

// Desktop sidebar width bounds (px) — drag-resizable between these.
const SIDEBAR_DEFAULT_WIDTH = 350;
const SIDEBAR_MIN_WIDTH = 280;
const SIDEBAR_MAX_WIDTH = 600;

type SearchBarMapComponentProps = {
  schoolTypes: string[];
  selectedPeringkat: string;
  selectedNegeri: string;
  selectedJenis: string;
  setSelectedJenis: (value: string) => void;
};

export function SearchBarMap({
  schoolTypes,
  selectedPeringkat,
  selectedNegeri,
  selectedJenis,
  setSelectedJenis,
}: SearchBarMapComponentProps) {
  const {
    viewSchool,
    setViewSchool,
    localSuggestions,
    localSuggestionsPage,
    hasMoreLocalSuggestions,
    isLoadingLocalSuggestions,
    handleSearch,
    query,
    setQuery,
    setPointA,
    setPointB,
    setRoute,
    clearRoute,
  } = useMapViewStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Desktop-only panel width, drag-resizable via the handle on its right
  // edge (see SIDEBAR_MIN/MAX_WIDTH below). Session-only — resets on reload.
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH);
  const resizeStartRef = useRef<{ startX: number; startWidth: number } | null>(
    null,
  );

  const handleResizePointerMove = useCallback((e: PointerEvent) => {
    const start = resizeStartRef.current;
    if (!start) return;
    const next = Math.min(
      SIDEBAR_MAX_WIDTH,
      Math.max(
        SIDEBAR_MIN_WIDTH,
        start.startWidth + (e.clientX - start.startX),
      ),
    );
    setSidebarWidth(next);
  }, []);

  const handleResizePointerUp = useCallback(() => {
    resizeStartRef.current = null;
    window.removeEventListener("pointermove", handleResizePointerMove);
    window.removeEventListener("pointerup", handleResizePointerUp);
    window.removeEventListener("pointercancel", handleResizePointerUp);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, [handleResizePointerMove]);

  const handleResizePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      resizeStartRef.current = { startX: e.clientX, startWidth: sidebarWidth };
      window.addEventListener("pointermove", handleResizePointerMove);
      window.addEventListener("pointerup", handleResizePointerUp);
      // A drag can end without a pointerup — window loses focus, a native
      // dialog opens, a touch gesture gets taken over by the OS — so without
      // this the cursor/listeners would stick and any later mouse movement
      // would resize the panel with no drag in progress.
      window.addEventListener("pointercancel", handleResizePointerUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [sidebarWidth, handleResizePointerMove, handleResizePointerUp],
  );

  // Arrow-key resizing so the handle is keyboard-operable, not just
  // draggable (WAI-ARIA "window splitter" pattern).
  const handleResizeKeyDown = useCallback((e: React.KeyboardEvent) => {
    const step = 20;
    let delta = 0;
    if (e.key === "ArrowLeft") delta = -step;
    else if (e.key === "ArrowRight") delta = step;
    else return;
    e.preventDefault();
    setSidebarWidth((prev) =>
      Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, prev + delta)),
    );
  }, []);

  // Drop stale listeners if the component unmounts mid-drag.
  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", handleResizePointerMove);
      window.removeEventListener("pointerup", handleResizePointerUp);
      window.removeEventListener("pointercancel", handleResizePointerUp);
    };
  }, [handleResizePointerMove, handleResizePointerUp]);
  const debounceTimerRef = useRef<number | null>(null);
  const setCenter = useMapViewStore((s) => s.setCenter);
  const setZoom = useMapViewStore((s) => s.setZoom);
  const { initialLocationUser } = useLocationSessionStore();

  // Field A (From) state
  const [fieldAValue, setFieldAValue] = useState("Lokasi Semasa");
  const [fieldAIsCurrentLocation, setFieldAIsCurrentLocation] = useState(true);

  // Field A POI geocoding (search "From" like Google Maps) state
  const [fieldASuggestions, setFieldASuggestions] = useState<PoiResult[]>([]);
  const [fieldAFocused, setFieldAFocused] = useState(false);
  const [fieldALoading, setFieldALoading] = useState(false);
  const fieldADebounceRef = useRef<number | null>(null);
  const fieldAAbortRef = useRef<AbortController | null>(null);
  const fieldABlurTimerRef = useRef<number | null>(null);
  // Set right after a suggestion is picked so the geocode effect doesn't
  // immediately re-search the committed label and reopen the dropdown.
  const fieldACommittedRef = useRef(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const inputARef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  // True while handleSelect writes the school name into the query, so that write does not trigger a search.
  const isSelectingRef = useRef(false);
  // Name of the school behind pointB, so a new query can drop its pin.
  const selectedNameRef = useRef<string | null>(null);
  // Only the latest handleSelect fetch may set the card.
  const selectRequestIdRef = useRef(0);

  const prevPeringkatRef = useRef(selectedPeringkat);

  // Set pointA from user location when it becomes available
  useEffect(() => {
    if (
      fieldAIsCurrentLocation &&
      initialLocationUser[0] != null &&
      initialLocationUser[1] != null
    ) {
      setPointA([initialLocationUser[0], initialLocationUser[1]]);
    }
  }, [fieldAIsCurrentLocation, initialLocationUser, setPointA]);

  // Origin / destination + computed driving route (OSRM).
  const pointA = useMapViewStore((s) => s.pointA);
  const pointB = useMapViewStore((s) => s.pointB);
  const setDistancesFromOrigin = useMapViewStore(
    (s) => s.setDistancesFromOrigin,
  );
  // Origin coords as primitives — stable, statically-checkable effect deps.
  const originLat = pointA?.[0];
  const originLng = pointA?.[1];

  // Recompute distances on already-loaded results the moment the origin
  // resolves or changes; the backend re-query below handles the order.
  useEffect(() => {
    setDistancesFromOrigin([originLat ?? null, originLng ?? null]);
  }, [originLat, originLng, setDistancesFromOrigin]);
  const routeAbortRef = useRef<AbortController | null>(null);

  // Road (driving) distance in meters for the first few results, keyed by
  // kodSekolah. Filled by one OSRM /table call; other rows keep straight-line.
  // kodSekolah whose drive-time disclaimer is open; controlled so a tap
  // opens it on touch devices (Radix tooltips are hover/focus only).
  const [driveTipKod, setDriveTipKod] = useState<string | null>(null);
  const [roadDistances, setRoadDistances] = useState<
    Map<string, { distance: number; duration: number | null }>
  >(new Map());
  const tableAbortRef = useRef<AbortController | null>(null);
  const tableDebounceRef = useRef<number | null>(null);
  // Surfaced when selecting a school fails to load its detail (see handleSelect).
  const [selectError, setSelectError] = useState<string | null>(null);
  // How many of the top suggestions get a real road distance.
  // Matches the backend pageSize (12) so the whole visible page shows an OSRM
  // road distance in one /table call, instead of straight-line for rows 11–12.
  const ROAD_DISTANCE_TOP_N = 12;

  // Fetch a road-following route (distance + duration) whenever both the
  // origin (Field A: current location or a picked POI) and destination
  // (Field B: selected school) are set.
  useEffect(() => {
    if (!pointA || !pointB) {
      routeAbortRef.current?.abort();
      clearRoute();
      return;
    }

    routeAbortRef.current?.abort();
    const controller = new AbortController();
    routeAbortRef.current = controller;

    getRoute(pointA, pointB, controller.signal).then((result) => {
      if (routeAbortRef.current !== controller) return; // stale
      if (result) {
        setRoute(result.coordinates, result.distance, result.duration);
      } else {
        clearRoute();
      }
    });

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointA?.[0], pointA?.[1], pointB?.[0], pointB?.[1]]);

  // Reset jenis when peringkat changes; the backend search effect below
  // re-runs automatically for both values.
  useEffect(() => {
    if (prevPeringkatRef.current !== selectedPeringkat) {
      prevPeringkatRef.current = selectedPeringkat;
      if (selectedJenis !== "ALL") {
        setSelectedJenis("ALL");
      }
    }
  }, [selectedJenis, selectedPeringkat, setSelectedJenis]);

  // Also reset if the current jenis is not valid for the new schoolTypes list
  useEffect(() => {
    if (selectedJenis !== "ALL" && !schoolTypes.includes(selectedJenis)) {
      setSelectedJenis("ALL");
    }
  }, [schoolTypes, selectedJenis, setSelectedJenis]);

  // Handler for MyDS SearchBar onValueChange (Field B - destination)
  const handleValueChange = (value: string) => {
    setQuery(value);
  };

  // Handler for Field A value change
  const handleFieldAChange = (value: string) => {
    // User is typing again → allow the geocode effect to run.
    fieldACommittedRef.current = false;
    setFieldAValue(value);
    if (value === "" || value === "Lokasi Semasa") {
      setFieldAIsCurrentLocation(true);
      // Never keep a previously picked place as the origin once Field A is cleared.
      setPointA(
        initialLocationUser[0] != null && initialLocationUser[1] != null
          ? [initialLocationUser[0], initialLocationUser[1]]
          : null,
      );
    } else {
      setFieldAIsCurrentLocation(false);
      // Origin is unknown until the user picks a POI suggestion.
      setPointA(null);
    }
  };

  // Pick a geocoded POI as the route origin (Field A).
  const handleSelectPoi = (poi: PoiResult) => {
    fieldACommittedRef.current = true;
    setFieldAValue(poi.label);
    setFieldAIsCurrentLocation(false);
    setPointA([poi.lat, poi.lng]);
    // Show the area around the picked place, where the nearby schools are listed.
    setCenter([poi.lat, poi.lng]);
    setZoom(FIRST_LOAD_ZOOM);
    setFieldASuggestions([]);
    setFieldALoading(false);
    setFieldAFocused(false);
    inputARef.current?.blur();
  };

  // Reset Field A back to the device's current location.
  const handleUseCurrentLocation = () => {
    fieldACommittedRef.current = true;
    setFieldAValue("Lokasi Semasa");
    setFieldAIsCurrentLocation(true);
    setPointA(
      initialLocationUser[0] != null && initialLocationUser[1] != null
        ? [initialLocationUser[0], initialLocationUser[1]]
        : null,
    );
    setFieldASuggestions([]);
    setFieldALoading(false);
    setFieldAFocused(false);
    inputARef.current?.blur();
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

  // Debounced POI geocoding for Field A ("From"), Google-Maps style. Runs only
  // while the user is typing a custom origin (not "Lokasi Semasa").
  useEffect(() => {
    const q = fieldAValue.trim();
    if (
      fieldACommittedRef.current ||
      fieldAIsCurrentLocation ||
      q === "Lokasi Semasa" ||
      q.length < 3
    ) {
      setFieldASuggestions([]);
      setFieldALoading(false);
      return;
    }

    if (fieldADebounceRef.current) clearTimeout(fieldADebounceRef.current);
    setFieldALoading(true);
    fieldADebounceRef.current = window.setTimeout(() => {
      fieldAAbortRef.current?.abort();
      const controller = new AbortController();
      fieldAAbortRef.current = controller;
      searchPoi(q, controller.signal).then((results) => {
        // Ignore stale responses superseded by a newer request.
        if (fieldAAbortRef.current !== controller) return;
        setFieldASuggestions(results);
        setFieldALoading(false);
      });
    }, 450);

    return () => {
      if (fieldADebounceRef.current) clearTimeout(fieldADebounceRef.current);
    };
  }, [fieldAValue, fieldAIsCurrentLocation]);

  // Cleanup Field A timers / in-flight request on unmount.
  useEffect(() => {
    return () => {
      if (fieldADebounceRef.current) clearTimeout(fieldADebounceRef.current);
      if (fieldABlurTimerRef.current) clearTimeout(fieldABlurTimerRef.current);
      fieldAAbortRef.current?.abort();
    };
  }, []);

  const runBackendSearch = useCallback(
    (page = 1, append = false) =>
      handleSearch(
        {
          namaSekolah: query.trim() || undefined,
          negeri: selectedNegeri === "ALL" ? undefined : selectedNegeri,
          jenis: selectedJenis === "ALL" ? undefined : selectedJenis,
          peringkat:
            selectedPeringkat === "ALL" ? undefined : selectedPeringkat,
        },
        page,
        append,
      ),
    [handleSearch, query, selectedJenis, selectedNegeri, selectedPeringkat],
  );

  // Send every school query and supported filter directly to the backend.
  useEffect(() => {
    if (isSelectingRef.current) return;

    // A different query drops the previously selected school's pin, card and route.
    if (
      selectedNameRef.current !== null &&
      query.trim() !== selectedNameRef.current
    ) {
      selectedNameRef.current = null;
      selectRequestIdRef.current++;
      setPointB(null);
      setViewSchool(null);
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmedQuery = query.trim();

    if (trimmedQuery.length >= 2) {
      setIsExpanded(true);
    }

    // Show the spinner through the debounce too, not just once the request starts.
    useMapViewStore.setState({ isLoadingLocalSuggestions: true });
    debounceTimerRef.current = window.setTimeout(() => {
      void runBackendSearch().then(() => {
        if (trimmedQuery.length < 2) return;
        const current = useMapViewStore.getState().localSuggestions;
        const exactMatch = current.find(
          (school) =>
            school.namaSekolah.toLowerCase() === trimmedQuery.toLowerCase(),
        );
        if (exactMatch) handleSelect(exactMatch);
      });
    }, 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runBackendSearch]);

  // Re-query when the origin (Field A) changes: the backend re-sorts a name/filter
  // search nearest-first, and with no query or filter it lists the schools within
  // the radius of the origin (the user's location, or a picked place such as a mall).
  // This also covers the location resolving after the first search fired, which
  // would otherwise count every school (~10k). Kept apart from the effect above
  // so it doesn't re-run its exact-match auto-select.
  useEffect(() => {
    const hasFilter = [selectedNegeri, selectedJenis, selectedPeringkat].some(
      (value) => value !== "ALL",
    );
    const isIdle = query.trim().length < 2 && !hasFilter;
    // Idle with no origin: skip only while Field A is being typed (origin unknown
    // until a place is picked); with "Lokasi Semasa" it re-lists around the user.
    if (
      isSelectingRef.current ||
      (isIdle && originLat == null && !fieldAIsCurrentLocation)
    )
      return;
    void runBackendSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointA?.[0], pointA?.[1]]);

  // Road distances for the first N results (one OSRM /table call). Keyed off
  // the top-N kodSekolah so paging (append) doesn't re-trigger the request.
  const topKods = localSuggestions
    .slice(0, ROAD_DISTANCE_TOP_N)
    .map((s) => s.kodSekolah ?? "")
    .join(",");

  useEffect(() => {
    const top = localSuggestions
      .slice(0, ROAD_DISTANCE_TOP_N)
      .filter((s) => s.kodSekolah);
    if (originLat == null || originLng == null || top.length === 0) {
      setRoadDistances(new Map());
      return;
    }

    if (tableDebounceRef.current) clearTimeout(tableDebounceRef.current);
    tableDebounceRef.current = window.setTimeout(() => {
      tableAbortRef.current?.abort();
      const controller = new AbortController();
      tableAbortRef.current = controller;
      const dests = top.map(
        (s) => [s.koordinatYY, s.koordinatXX] as [number, number],
      );
      getRouteDistances([originLat, originLng], dests, controller.signal).then(
        (results) => {
          if (tableAbortRef.current !== controller) return; // stale
          const next = new Map<
            string,
            { distance: number; duration: number | null }
          >();
          results.forEach((r, i) => {
            const kod = top[i].kodSekolah;
            if (kod && r.distance != null)
              next.set(kod, { distance: r.distance, duration: r.duration });
          });
          setRoadDistances(next);
        },
      );
    }, 500);

    return () => {
      if (tableDebounceRef.current) clearTimeout(tableDebounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topKods, originLat, originLng]);

  // The backend orders by straight-line distance, which can disagree with the
  // road distance shown on each card. Once every top-N row has a road distance,
  // re-order those rows to match it; later pages keep the backend order.
  const displayedSuggestions = useMemo(() => {
    const top = localSuggestions.slice(0, ROAD_DISTANCE_TOP_N);
    const road = (s: (typeof top)[number]) =>
      s.kodSekolah ? roadDistances.get(s.kodSekolah)?.distance : undefined;
    if (top.length === 0 || top.some((s) => road(s) == null)) {
      return localSuggestions;
    }
    const sorted = [...top].sort((a, b) => road(a)! - road(b)!);
    return [...sorted, ...localSuggestions.slice(ROAD_DISTANCE_TOP_N)];
  }, [localSuggestions, roadDistances]);

  // Cleanup the /table request/timer on unmount.
  useEffect(() => {
    return () => {
      if (tableDebounceRef.current) clearTimeout(tableDebounceRef.current);
      tableAbortRef.current?.abort();
    };
  }, []);

  const handleSelect = async (school: SearchBarMapProps) => {
    try {
      setSelectError(null);
      if (!school.kodSekolah) {
        console.error("School code is null");
        return;
      }
      const requestId = ++selectRequestIdRef.current;
      const detail = await getSchoolS3Json(
        undefined,
        school.negeri,
        school.parlimen,
        school.kodSekolah,
      );
      if (requestId !== selectRequestIdRef.current) return;
      if (detail) {
        setViewSchool(detail);
        setCenter([school.koordinatYY, school.koordinatXX]);
        setZoom(16);

        // Set pointB when a school is selected
        setPointB([school.koordinatYY, school.koordinatXX]);
        selectedNameRef.current = school.namaSekolah;

        // Populate Field B with school name
        isSelectingRef.current = true;
        setQuery(school.namaSekolah);
        setTimeout(() => {
          isSelectingRef.current = false;
        }, 500);

        // Close the expanded search panel on mobile/tablet (md and smaller)
        if (window.innerWidth < 768) {
          setIsExpanded(false);
        }
      }
    } catch (error) {
      console.error("Error fetching school details:", error);
      setSelectError(
        "Gagal memuatkan maklumat sekolah. Sila cuba lagi sebentar.",
      );
    }
  };

  // Commit the current query: pinpoint the exact-name match if there is one,
  // otherwise fall back to the first (best-ranked) suggestion. Wired to Enter
  // and the search button so live typing itself never hijacks the map.
  const commitTopResult = async () => {
    // On a slow network the list can still hold the previous query's results,
    // so Enter would re-select the old school. Flush the pending search and
    // pick from the fresh results instead.
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    const search = runBackendSearch();
    const requestId = useMapViewStore.getState()._searchRequestId;
    await search;
    // Superseded by a newer search (the user kept typing): let that one win.
    if (useMapViewStore.getState()._searchRequestId !== requestId) return;
    const current = useMapViewStore.getState().localSuggestions;
    if (current.length === 0) return;
    const trimmed = query.trim().toLowerCase();
    const exact = current.find(
      (school) => school.namaSekolah.toLowerCase() === trimmed,
    );
    handleSelect(exact ?? current[0]);
  };

  const loadMoreSuggestions = () => {
    if (!hasMoreLocalSuggestions || isLoadingLocalSuggestions) return;
    void runBackendSearch(localSuggestionsPage + 1, true);
  };

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    // Distance (in px) from the bottom at which to trigger loading more results
    const threshold = 40;

    if (
      target.scrollTop + target.clientHeight >=
      target.scrollHeight - threshold
    ) {
      loadMoreSuggestions();
    }
  };

  return (
    <div
      className={`absolute flex z-[500] bottom-0 pointer-events-none
          ${
            isExpanded
              ? "top-0 md:top-0 left-0 right-0 md:right-6 gap-4 justify-start w-full md:w-auto"
              : "top-[16px] left-3 right-3 sm:left-3 sm:right-3 flex-col gap-2 h-[45px] justify-center sm:justify-start"
          }
        `}
    >
      <div
        style={
          { "--sidebar-width": `${sidebarWidth}px` } as React.CSSProperties
        }
        className={`pointer-events-auto shadow-md border border-otl-divider bg-white relative
            ${
              isExpanded
                ? "w-full md:w-[var(--sidebar-width)]"
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
        {/* Drag handle — desktop only, only while the panel is expanded
            (the collapsed pill-shaped search button isn't resizable). */}
        {isExpanded && (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Ubah saiz panel carian"
            aria-valuenow={sidebarWidth}
            aria-valuemin={SIDEBAR_MIN_WIDTH}
            aria-valuemax={SIDEBAR_MAX_WIDTH}
            tabIndex={0}
            onPointerDown={handleResizePointerDown}
            onKeyDown={handleResizeKeyDown}
            className="absolute right-0 top-0 z-10 -mr-1.5 hidden h-full w-3 cursor-col-resize touch-none focus:outline-none focus-visible:bg-otl-primary-200/30 md:block"
          >
            <div className="mx-auto h-full w-0.5 bg-transparent transition-colors hover:bg-otl-primary-200 active:bg-otl-primary-200" />
          </div>
        )}
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
              <span className="text-sm font-medium text-txt-primary">
                Carian Sekolah
              </span>
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
                {/* Field A - From (current location or POI search) */}
                <div className="relative">
                  <div className="flex items-center border border-otl-divider rounded-lg px-3 py-2 bg-gray-50">
                    <input
                      ref={inputARef}
                      type="text"
                      placeholder="Dari — lokasi semasa atau cari tempat"
                      aria-label="Lokasi asal"
                      value={fieldAValue}
                      onChange={(e) => handleFieldAChange(e.target.value)}
                      onFocus={() => {
                        setFieldAFocused(true);
                        if (fieldABlurTimerRef.current) {
                          clearTimeout(fieldABlurTimerRef.current);
                        }
                        if (fieldAIsCurrentLocation) {
                          setFieldAValue("");
                        }
                      }}
                      onBlur={() => {
                        // Delay so a click on a dropdown item registers first.
                        fieldABlurTimerRef.current = window.setTimeout(() => {
                          setFieldAFocused(false);
                          if (fieldAValue.trim() === "") {
                            setFieldAValue("Lokasi Semasa");
                            setFieldAIsCurrentLocation(true);
                            if (
                              initialLocationUser[0] != null &&
                              initialLocationUser[1] != null
                            ) {
                              setPointA([
                                initialLocationUser[0],
                                initialLocationUser[1],
                              ]);
                            }
                          }
                        }, 150);
                      }}
                      className={clx(
                        "flex-1 bg-transparent text-sm outline-none",
                        fieldAIsCurrentLocation
                          ? "text-blue-600"
                          : "text-txt-primary",
                      )}
                    />
                  </div>

                  {fieldAFocused && (
                    <div className="absolute left-0 right-0 top-full mt-1 z-[600] bg-white border border-otl-divider rounded-lg shadow-lg overflow-hidden max-h-64 overflow-y-auto">
                      {/* Switch back to the device's current location */}
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={handleUseCurrentLocation}
                        className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-blue-600 hover:bg-gray-50 border-b border-otl-divider"
                      >
                        <PinIcon className="w-4 h-4 shrink-0" />
                        Guna Lokasi Semasa
                      </button>

                      {fieldALoading && (
                        <div className="px-3 py-2 text-sm text-gray-500">
                          Mencari lokasi…
                        </div>
                      )}

                      {!fieldALoading &&
                        fieldASuggestions.map((poi) => (
                          <button
                            key={poi.id}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleSelectPoi(poi)}
                            className="w-full flex flex-col items-start gap-0.5 px-3 py-2 text-left hover:bg-gray-50 border-b last:border-b-0 border-otl-divider"
                          >
                            <span className="text-sm text-txt-primary line-clamp-1">
                              {poi.label}
                            </span>
                            {poi.sublabel && (
                              <span className="text-xs text-gray-500 line-clamp-1">
                                {poi.sublabel}
                              </span>
                            )}
                          </button>
                        ))}

                      {!fieldALoading &&
                        !fieldAIsCurrentLocation &&
                        fieldAValue.trim().length >= 3 &&
                        fieldASuggestions.length === 0 && (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            Tiada lokasi ditemui
                          </div>
                        )}

                      {!fieldAIsCurrentLocation &&
                        fieldAValue.trim().length > 0 &&
                        fieldAValue.trim().length < 3 && (
                          <div className="px-3 py-2 text-xs text-gray-400">
                            Taip sekurang-kurangnya 3 aksara, cth: “McDonald’s
                            Putrajaya”
                          </div>
                        )}
                    </div>
                  )}
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        void commitTopResult();
                      }
                    }}
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        void commitTopResult();
                      }
                    }}
                    className=""
                  />
                  <SearchBarSearchButton
                    onClick={() => void commitTopResult()}
                  />
                </SearchBarInputContainer>
              </SearchBar>
            </div>
          )}

          {selectError && (
            <div
              role="alert"
              className="mx-4 mb-2 flex items-center justify-between gap-3 rounded-lg border border-otl-danger-200 bg-danger-50 px-3 py-2 text-body-sm text-txt-danger"
            >
              <span>{selectError}</span>
              <button
                type="button"
                onClick={() => setSelectError(null)}
                className="shrink-0 font-semibold hover:underline"
              >
                Tutup
              </button>
            </div>
          )}

          {isExpanded && (
            <div
              ref={listRef}
              onScroll={handleScroll}
              tabIndex={0}
              className="w-full h-full overflow-y-auto overflow-x-auto border-t border-otl-divider flex-1 focus:outline-2 focus:outline-otl-primary-200 focus:outline-offset-2 "
            >
              {displayedSuggestions.length > 0 ? (
                displayedSuggestions.map((school, idx) => (
                  <li
                    key={school.kodSekolah || idx}
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
                          {`${underScoreRemover(school.bandarSurat ?? "")}, ${underScoreRemover(school.negeri ?? "")}`}
                        </span>

                        <span className="mt-1 flex flex-wrap items-center text-sm text-primary-600 gap-1">
                          {(() => {
                            const oLat =
                              pointA?.[0] ?? initialLocationUser?.[0];
                            const oLng =
                              pointA?.[1] ?? initialLocationUser?.[1];
                            if (oLat == null || oLng == null) return null;
                            const fromLabel =
                              pointA != null && !fieldAIsCurrentLocation
                                ? "titik asal"
                                : "lokasi anda";
                            // Prefer the OSRM road distance (top N);
                            // fall back to straight-line for the rest.
                            const road = school.kodSekolah
                              ? roadDistances.get(school.kodSekolah)
                              : undefined;
                            if (road != null) {
                              const text =
                                road.distance > 1000
                                  ? `${(road.distance / 1000).toFixed(2)} km ikut jalan dari ${fromLabel}`
                                  : `${Math.round(road.distance)} meter ikut jalan dari ${fromLabel}`;
                              return (
                                <>
                                  <PinIcon className="w-4 h-4" />
                                  {text}
                                  {road.duration != null && (
                                    <span className="text-xs text-gray-500">
                                      ·{" "}
                                      {Math.max(
                                        1,
                                        Math.round(road.duration / 60),
                                      )}{" "}
                                      min anggaran pandu
                                      <Tooltip
                                        open={driveTipKod === school.kodSekolah}
                                        onOpenChange={(open) =>
                                          setDriveTipKod(
                                            open
                                              ? (school.kodSekolah ?? null)
                                              : null,
                                          )
                                        }
                                      >
                                        <TooltipTrigger asChild>
                                          <button
                                            type="button"
                                            aria-label="Maklumat anggaran pandu"
                                            onClick={(e) => {
                                              // Don't select the school row, and
                                              // stop Radix closing it on click so
                                              // a tap opens it on touch devices.
                                              e.stopPropagation();
                                              e.preventDefault();
                                              setDriveTipKod(
                                                school.kodSekolah ?? null,
                                              );
                                            }}
                                            className="ml-1 inline-flex align-middle text-gray-400 hover:text-gray-600"
                                          >
                                            <InfoIcon className="size-3.5" />
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent className="z-[600] max-w-[240px] text-xs">
                                          Anggaran masa memandu berdasarkan
                                          laluan jalan raya tanpa mengambil kira
                                          trafik semasa. Sila rujuk aplikasi
                                          navigasi untuk maklumat perjalanan
                                          yang lebih tepat.
                                        </TooltipContent>
                                      </Tooltip>
                                    </span>
                                  )}
                                </>
                              );
                            }
                            const straight = calculateDistance(
                              oLat,
                              oLng,
                              school.koordinatYY,
                              school.koordinatXX,
                            );
                            const text =
                              straight > 1000
                                ? `${(straight / 1000).toFixed(2)} km dari ${fromLabel}`
                                : `${straight.toFixed(2)} meter dari ${fromLabel}`;
                            return (
                              <>
                                <PinIcon className="w-4 h-4" />
                                {text}
                              </>
                            );
                          })()}
                        </span>
                      </div>

                      <ChevronRightIcon className="w-5 h-5 text-txt-primary" />
                    </div>
                  </li>
                ))
              ) : isLoadingLocalSuggestions ? (
                <li>
                  <SearchFallbackIndicator
                    visible={true}
                    className="py-5"
                    label="Mencari..."
                  />
                </li>
              ) : (
                <li className="px-4 py-4 text-sm text-gray-500">
                  Tiada hasil carian
                </li>
              )}
              {localSuggestions.length > 0 && isLoadingLocalSuggestions && (
                <li className="border-t border-otl-divider">
                  <SearchFallbackIndicator visible={true} className="py-3" />
                </li>
              )}
            </div>
          )}
        </div>
      </div>
      {viewSchool && (
        <>
          {/* Desktop view - horizontal bar pinned to the bottom of the map */}
          <div
            className={clx(
              "hidden md:block pointer-events-auto bg-transparent rounded-xl overflow-y-auto",
              isExpanded
                ? "flex-1 self-end mb-2 mr-3 max-h-[42vh]"
                : "fixed bottom-3 left-3 right-20 max-h-[42vh]",
            )}
          >
            <SchoolInfoWindow
              school={viewSchool}
              setSelected={() => {
                setViewSchool(null);
                setPointB(null);
              }}
              mobile={false}
              layout="horizontal"
            />
          </div>

          {/* Mobile view - bottom sheet */}
          <div
            className={clx(
              "md:hidden pointer-events-auto fixed inset-x-0 bottom-0 z-[60] flex flex-col",
              isFullScreen ? "top-[31vh]" : "max-h-[40vh]",
            )}
          >
            <div
              className={clx(
                // Rounded sheet top; overflow clips the card's square white corners.
                "overflow-y-auto overscroll-none rounded-t-2xl bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.12)]",
                isFullScreen ? "h-full" : "flex-1",
              )}
            >
              <SchoolInfoWindow
                school={viewSchool}
                setSelected={() => {
                  setViewSchool(null);
                  setPointB(null);
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
