import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  type UIEvent,
} from "react";
import {
  ArrowBackIcon,
  ChevronRightIcon,
  PinIcon,
} from "@govtechmy/myds-react/icon";
import { FilterDropdowns } from "./FilterDropdowns";
import type { SearchBarMapProps } from "../../types/maps";
import type { ItemSekolahModel } from "../../models/response";
import Fuse from "fuse.js";
import {
  subscribeSchoolMarkers,
  type SchoolPoint,
} from "../../services/school.svc";
import { matchSchoolAcronym, toAcronymWords } from "../../utils/acronymMatch";
import { matchesSchoolSearchText } from "../../utils/schoolSearchText";
import { searchPoi, type PoiResult } from "../../services/geocode.svc";
import { getRoute, getRouteDistances } from "../../services/route.svc";

function schoolPointToSuggestion(p: SchoolPoint): SearchBarMapProps {
  return {
    namaSekolah: p.namaSekolah,
    kodSekolah: p.kodSekolah,
    koordinatYY: p.lat,
    koordinatXX: p.lng,
    negeri: p.negeri,
    bandarSurat: p.bandarSurat,
    jenisLabel: p.jenisLabel,
    jumlahPelajar: 0,
    jumlahGuru: 0,
    parlimen: p.parlimen,
    isSekolahAngkatMADANI: p.isSekolahAngkatMADANI,
  };
}
import { getSchoolS3Json } from "../../services/school.svc";
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
    viewSchool,
    setViewSchool,
    localSuggestions,
    setLocalSuggestions,
    query,
    setQuery,
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
  const [selectedSesi, setSelectedSesi] = useState("ALL");
  const setSesiFilter = useMapViewStore((s) => s.setSesiFilter);
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
  const isSwappingRef = useRef(false);
  const hoverRequestIdRef = useRef(0);
  // The school "pinned" by an actual click — survives mouse-leave. Hover only
  // previews; leaving the list restores this (or clears if nothing pinned).
  const pinnedSchoolRef = useRef<ItemSekolahModel | null>(null);

  // ---- Client-side fuzzy search over all schools ----
  const [allPoints, setAllPoints] = useState<SchoolPoint[]>([]);
  const [displayLimit, setDisplayLimit] = useState(30);
  const allMatchedRef = useRef<SchoolPoint[]>([]);
  const setMapFilters = useMapViewStore((s) => s.setMapFilters);

  useEffect(() => {
    // Progressive: the sidebar becomes searchable after the first page of
    // schools instead of waiting for the full dataset.
    return subscribeSchoolMarkers((points) => {
      setAllPoints(points);
    });
  }, []);

  // Build the search corpus once per dataset. `searchText` combines the school
  // type label (SMK, SK, SJKC…), name and code so queries like "smk gombak"
  // match (SMK via type + gombak via name). Town/state are intentionally
  // excluded to avoid location noise — use the dropdowns for those.
  const searchRecords = useMemo(
    () =>
      allPoints.map((p) => ({
        point: p,
        searchText:
          `${p.jenisLabel} ${p.namaSekolah} ${p.kodSekolah}`.toLowerCase(),
        // Word list for acronym matching, e.g.
        // ["smk","sekolah","menengah","kebangsaan","putrajaya","presint","8"].
        // Code is excluded so the acronym stays "type + name".
        words: toAcronymWords(`${p.jenisLabel} ${p.namaSekolah}`),
      })),
    [allPoints],
  );

  const fuse = useMemo(() => {
    if (searchRecords.length === 0) return null;
    return new Fuse(searchRecords, {
      keys: ["searchText"],
      threshold: 0.35,
      ignoreLocation: true,
      minMatchCharLength: 2,
      includeScore: true,
    });
  }, [searchRecords]);

  // Run a filtered + fuzzy search entirely on the client.
  const runFuzzySearch = useCallback(
    (params: {
      namaSekolah?: string;
      negeri?: string;
      jenis?: string;
      peringkat?: string;
      sesi?: string;
    }) => {
      const negeri = params.negeri ?? "ALL";
      const peringkat = params.peringkat ?? "ALL";
      const jenis = params.jenis ?? "ALL";
      const sesi = params.sesi ?? "ALL";
      const q = (params.namaSekolah ?? "").trim();

      // Keep the clustered map in sync with the same filters.
      setMapFilters({ negeri, peringkat, jenis });
      setSesiFilter(sesi);

      // 1) Apply dropdown filters.
      let base = allPoints.filter((p) => {
        if (negeri !== "ALL" && p.negeri !== negeri) return false;
        if (peringkat !== "ALL" && p.peringkat !== peringkat) return false;
        if (jenis === "SEKOLAH_ANGKAT_MADANI") {
          if (!p.isSekolahAngkatMADANI) return false;
        } else if (jenis !== "ALL" && p.jenisLabel !== jenis) {
          return false;
        }
        if (sesi !== "ALL" && p.sesi !== sesi) return false;
        return true;
      });

      // 2) Token-based match (every token must match). Short tokens (type
      // codes like SMK/SK/SJKC) use exact word-boundary matching so "smk"
      // does not fuzzily collapse into "sk". Longer tokens use fuzzy match
      // for typo tolerance.
      if (q.length >= 2 && fuse) {
        const ql = q.toLowerCase();
        const tokens = ql.split(/\s+/).filter(Boolean);
        let ids: Set<string> | null = null;
        // Best (lowest) Fuse score per school across fuzzy tokens — lexical
        // relevance signal used by the reranker (0 = perfect match).
        const fuzzyScore = new Map<string, number>();
        for (const tok of tokens) {
          let found: Set<string>;
          // Short tokens (type codes: SMK/SK/SJKC…) and code-like tokens
          // (containing digits, e.g. BBA3029) use exact word-boundary matching
          // so they don't fuzzily collapse into many near matches.
          const isExactToken = tok.length <= 4 || /\d/.test(tok);
          if (isExactToken) {
            const escaped = tok.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const re = new RegExp(`\\b${escaped}\\b`, "i");
            found = new Set(
              searchRecords
                .filter((r) => re.test(r.searchText))
                .map((r) => r.point.kodSekolah),
            );
          } else {
            const res = fuse.search(tok);
            found = new Set(res.map((r) => r.item.point.kodSekolah));
            for (const r of res) {
              const k = r.item.point.kodSekolah;
              const sc = r.score ?? 1;
              fuzzyScore.set(k, Math.min(fuzzyScore.get(k) ?? 1, sc));
            }
          }
          ids = ids
            ? new Set([...ids].filter((x: string) => found.has(x)))
            : found;
        }

        // Acronym / initialism matching for compact, space-less queries like
        // "smkpp8" -> "SMK Putrajaya Presint 8" (words: smk, sekolah, menengah,
        // kebangsaan, putrajaya, presint, 8). The token pipeline above can't
        // catch these because the letters are glued together. Run it as an
        // extra candidate producer and UNION it with the token matches; the
        // reranker below then orders everything.
        const acroIds = new Set<string>();
        const isCompact = ql.length >= 4 && !/\s/.test(ql);
        if (isCompact) {
          for (const r of searchRecords) {
            // Cheap guard: the query's first char must match the type code's
            // first char (acronyms start with the school type: smk/sk/sjkc…).
            if (ql[0] !== r.words[0]?.[0]) continue;
            if (matchSchoolAcronym(ql, r.words) >= 1) {
              acroIds.add(r.point.kodSekolah);
            }
          }
          if (acroIds.size > 0) {
            ids = ids ? new Set([...ids, ...acroIds]) : acroIds;
          }
        }

        if (ids) base = base.filter((p) => ids.has(p.kodSekolah));

        // --- Rerank (RAG-style stage 2) ---
        // Composite relevance: exact/prefix boosts + Fuse lexical score, with
        // distance only as a small tie-breaker. Higher score = better.
        // Distance is measured from the chosen origin (picked POI / current
        // location = pointA), falling back to the device location.
        const [rLat, rLng] =
          useMapViewStore.getState().pointA ??
          useLocationSessionStore.getState().initialLocationUser;
        const scoreOf = (p: SchoolPoint): number => {
          const name = p.namaSekolah.toLowerCase();
          let s = 0;
          if (p.kodSekolah.toLowerCase() === ql) s += 1000;
          if (name === ql) s += 800;
          else if (name.startsWith(ql)) s += 300;
          else if (name.includes(ql)) s += 150;
          // Acronym hits are a strong intent signal — rank them near the top.
          if (acroIds.has(p.kodSekolah)) s += 400;
          s += (1 - (fuzzyScore.get(p.kodSekolah) ?? 0)) * 100;
          if (rLat != null && rLng != null) {
            const km = calculateDistance(rLat, rLng, p.lat, p.lng) / 1000;
            s -= Math.min(km, 300) * 0.1;
          }
          return s;
        };
        base = base.slice().sort((a, b) => scoreOf(b) - scoreOf(a));
      } else {
        // No query — order by distance from the origin (nearest first).
        const [uLat, uLng] =
          useMapViewStore.getState().pointA ??
          useLocationSessionStore.getState().initialLocationUser;
        if (uLat != null && uLng != null) {
          base = base
            .slice()
            .sort(
              (a, b) =>
                calculateDistance(uLat, uLng, a.lat, a.lng) -
                calculateDistance(uLat, uLng, b.lat, b.lng),
            );
        }
      }

      // The home page already fetched matching API suggestions before
      // navigation. While the progressively loaded map corpus is still missing
      // that school's page, do not replace a valid carried result with an empty
      // list and flash "Tiada hasil carian".
      const hasNoActiveFilters =
        negeri === "ALL" &&
        peringkat === "ALL" &&
        jenis === "ALL" &&
        sesi === "ALL";
      const hasMatchingCarriedResult =
        q.length >= 2 &&
        base.length === 0 &&
        hasNoActiveFilters &&
        useMapViewStore
          .getState()
          .localSuggestions.some((school) =>
            matchesSchoolSearchText(
              `${school.jenisLabel ?? ""} ${school.namaSekolah} ${school.kodSekolah ?? ""}`,
              q,
            ),
          );

      if (hasMatchingCarriedResult) return;

      allMatchedRef.current = base;
      setDisplayLimit(30);
      setLocalSuggestions(base.slice(0, 30).map(schoolPointToSuggestion));
      setDataTotal(base.length);
    },
    [
      allPoints,
      fuse,
      searchRecords,
      setMapFilters,
      setSesiFilter,
      setLocalSuggestions,
      setDataTotal,
    ],
  );

  // Use predefined lists instead of extracting from markers
  const negeriList = NEGERI_LIST;
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
  const routeDistance = useMapViewStore((s) => s.routeDistance);
  const routeDuration = useMapViewStore((s) => s.routeDuration);
  // Origin coords as primitives — stable, statically-checkable effect deps.
  const originLat = pointA?.[0];
  const originLng = pointA?.[1];
  const routeAbortRef = useRef<AbortController | null>(null);

  // Road (driving) distance in meters for the nearest few results, keyed by
  // kodSekolah. Filled by one OSRM /table call; other rows keep straight-line.
  const [roadDistances, setRoadDistances] = useState<Map<string, number>>(
    new Map(),
  );
  const tableAbortRef = useRef<AbortController | null>(null);
  const tableDebounceRef = useRef<number | null>(null);
  // How many of the top (nearest) suggestions get a real road distance.
  const ROAD_DISTANCE_TOP_N = 10;

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

  // Reset selectedJenis to ALL when peringkat changes, then trigger search
  useEffect(() => {
    if (prevPeringkatRef.current !== selectedPeringkat) {
      prevPeringkatRef.current = selectedPeringkat;
      // Reset jenis when peringkat changes - this will trigger the search via selectedJenis change
      if (selectedJenis !== "ALL") {
        setSelectedJenis("ALL");
      } else {
        // If jenis is already ALL, manually trigger search since selectedJenis won't change
        runFuzzySearch({
          namaSekolah: query.trim().length >= 2 ? query : "",
          negeri: selectedNegeri,
          jenis: "ALL",
          peringkat: selectedPeringkat,
          sesi: selectedSesi,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeringkat]);

  // Also reset if the current jenis is not valid for the new schoolTypes list
  useEffect(() => {
    if (
      selectedJenis !== "ALL" &&
      selectedJenis !== "SEKOLAH_ANGKAT_MADANI" &&
      !schoolTypes.includes(selectedJenis)
    ) {
      setSelectedJenis("ALL");
    }
  }, [schoolTypes, selectedJenis]);

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
      if (initialLocationUser[0] != null && initialLocationUser[1] != null) {
        setPointA([initialLocationUser[0], initialLocationUser[1]]);
      }
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
    if (initialLocationUser[0] != null && initialLocationUser[1] != null) {
      setPointA([initialLocationUser[0], initialLocationUser[1]]);
    }
    setFieldASuggestions([]);
    setFieldALoading(false);
    setFieldAFocused(false);
    inputARef.current?.blur();
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
    } else if (
      currentA &&
      currentA.trim().length > 0 &&
      currentA !== "Lokasi Semasa"
    ) {
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

  // Trigger search when query is set (with debouncing)
  useEffect(() => {
    // Skip search during a swap operation
    if (isSwappingRef.current) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmedQuery = query.trim();

    if (trimmedQuery.length >= 2) {
      setIsExpanded(true);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      runFuzzySearch({
        namaSekolah: trimmedQuery,
        negeri: selectedNegeri,
        jenis: selectedJenis,
        peringkat: selectedPeringkat,
        sesi: selectedSesi,
      });

      // Auto-open the info window on an exact name match.
      if (trimmedQuery.length >= 2) {
        const current = useMapViewStore.getState().localSuggestions;
        const exactMatch = current.find(
          (school) =>
            school.namaSekolah.toLowerCase() === trimmedQuery.toLowerCase(),
        );
        if (exactMatch) handleSelect(exactMatch);
      }
    }, 250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Re-run search when filters, the dataset, OR the origin (Field A) change.
  // Including pointA keeps the list sorted from the *current* origin so the
  // per-row distances stay monotonic (nearest-first) after picking a POI /
  // switching back to current location.
  useEffect(() => {
    runFuzzySearch({
      namaSekolah: query.trim().length >= 2 ? query : "",
      negeri: selectedNegeri,
      jenis: selectedJenis,
      peringkat: selectedPeringkat,
      sesi: selectedSesi,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedJenis,
    selectedNegeri,
    selectedSesi,
    allPoints,
    originLat,
    originLng,
  ]);

  // Road distances for the nearest N results (one OSRM /table call). Keyed off
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
          const next = new Map<string, number>();
          results.forEach((r, i) => {
            const kod = top[i].kodSekolah;
            if (kod && r.distance != null) next.set(kod, r.distance);
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

  // Cleanup the /table request/timer on unmount.
  useEffect(() => {
    return () => {
      if (tableDebounceRef.current) clearTimeout(tableDebounceRef.current);
      tableAbortRef.current?.abort();
    };
  }, []);

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
        pinnedSchoolRef.current = detail;
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
    if (displayLimit >= allMatchedRef.current.length) return;
    const next = displayLimit + 30;
    setDisplayLimit(next);
    setLocalSuggestions(
      allMatchedRef.current.slice(0, next).map(schoolPointToSuggestion),
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
              {routeDistance != null && routeDuration != null && (
                <div className="px-4 pb-2 flex items-center gap-2 text-sm text-txt-primary">
                  <span className="font-semibold">
                    {(routeDistance / 1000).toFixed(1)} km
                  </span>
                  <span className="text-gray-300">•</span>
                  <span>{Math.max(1, Math.round(routeDuration / 60))} min</span>
                  <span className="text-xs text-gray-500">anggaran pandu</span>
                </div>
              )}
              <FilterDropdowns
                selectedNegeri={selectedNegeri}
                selectedJenis={selectedJenis}
                selectedPeringkat={selectedPeringkat}
                selectedSesi={selectedSesi}
                negeriList={negeriList}
                jenisList={schoolTypes}
                setSelectedNegeri={setSelectedNegeri}
                setSelectedJenis={setSelectedJenis}
                setSelectedPeringkat={setSelectedPeringkat}
                setSelectedSesi={(value) => {
                  setSelectedSesi(value);
                  setSesiFilter(value);
                }}
                onClearFilters={() => {
                  setSelectedNegeri("ALL");
                  setSelectedJenis("ALL");
                  setSelectedPeringkat("ALL");
                  setSelectedSesi("ALL");
                  setSesiFilter("ALL");
                  setQuery("");
                }}
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
              onMouseLeave={() => {
                // Leaving the list closes the hover preview, unless a school
                // has been pinned by an actual click.
                setViewSchool(pinnedSchoolRef.current);
              }}
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
                            // Prefer the OSRM road distance (top-N nearest);
                            // fall back to straight-line for the rest.
                            const road = school.kodSekolah
                              ? roadDistances.get(school.kodSekolah)
                              : undefined;
                            if (road != null) {
                              const text =
                                road > 1000
                                  ? `${(road / 1000).toFixed(2)} km ikut jalan dari ${fromLabel}`
                                  : `${Math.round(road)} meter ikut jalan dari ${fromLabel}`;
                              return (
                                <>
                                  <PinIcon className="w-4 h-4" />
                                  {text}
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
          {/* Desktop view - side panel (beside the sidebar, top aligned) */}
          <div
            className={clx(
              "hidden md:block bg-transparent rounded-xl overflow-y-auto",
              isExpanded
                ? "mt-2 ml-2 mr-3 max-w-[350px] max-h-[85vh]"
                : "absolute top-[53px] max-h-[78vh] w-full max-w-[350px]",
            )}
          >
            <SchoolInfoWindow
              school={viewSchool}
              setSelected={() => {
                pinnedSchoolRef.current = null;
                setViewSchool(null);
              }}
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
