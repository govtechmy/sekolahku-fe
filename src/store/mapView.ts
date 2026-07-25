import { create } from "zustand";
import type { MarkerMap } from "../utils/markerProcessors";
import type { SearchBarMapProps } from "../types/maps";
import type { ItemSekolahModel } from "../models/response";
import { getSchoolSuggestion } from "../services/school.svc";
import type { GeoJSONFeature } from "../types/polygon";
import { useLocationSessionStore } from "./locationSession";

type Center = [number, number];

interface MapViewState {
  center: Center;
  zoom: number;
  initialLocationSet: boolean;
  radius: number;
  mapFilters: {
    negeri: string;
    peringkat: string;
    jenis: string;
    sesi: string;
  };
  schoolMarkers: MarkerMap;
  userMarkers: MarkerMap;
  localSuggestions: SearchBarMapProps[];
  localSuggestionsPage: number;
  hasMoreLocalSuggestions: boolean;
  isLoadingLocalSuggestions: boolean;
  _searchRequestId: number;
  viewSchool: ItemSekolahModel | null;
  query: string;
  statePolygons: Map<string, GeoJSONFeature>;
  dataTotal: number;
  singlePageTotal: number;
  pointA: [number, number] | null;
  pointB: [number, number] | null;
  routeCoordinates: [number, number][];
  routeDistance: number | null;
  routeDuration: number | null;
  setCenter: (c: Center) => void;
  setDataTotal: (total: number) => void;
  setSinglePageTotal: (total: number) => void;
  setRadius: (r: number) => void;
  setMapFilters: (f: {
    negeri: string;
    peringkat: string;
    jenis: string;
  }) => void;
  setSesiFilter: (sesi: string) => void;
  setZoom: (z: number) => void;
  setInitialLocationSet: (v: boolean) => void;
  setSchoolMarkers: (
    markers: MarkerMap | ((prev: MarkerMap) => MarkerMap),
  ) => void;
  setUserMarkers: (
    markers: MarkerMap | ((prev: MarkerMap) => MarkerMap),
  ) => void;
  setLocalSuggestions: (suggestions: SearchBarMapProps[]) => void;
  setViewSchool: (school: ItemSekolahModel | null) => void;
  handleSearch: (
    params: {
      namaSekolah?: string;
      negeri?: string;
      jenis?: string;
      peringkat?: string;
    },
    pageNumber?: number,
    append?: boolean,
  ) => Promise<void>;
  setQuery: (q: string) => void;
  setPointA: (point: [number, number] | null) => void;
  setPointB: (point: [number, number] | null) => void;
  setRoute: (
    coords: [number, number][],
    distance: number | null,
    duration: number | null,
  ) => void;
  clearRoute: () => void;
  // Polygon actions
  setStatePolygons: (polygons: Map<string, GeoJSONFeature>) => void;
  clearStatePolygons: () => void;
}

export const useMapViewStore = create<MapViewState>((set, get) => ({
  dataTotal: 0,
  singlePageTotal: 0,
  // initialLocationUser: [3.760115447396889, 108.46252441406251],
  center: [3.760115447396889, 108.46252441406251],
  zoom: 6,
  radius: 3000,
  mapFilters: { negeri: "ALL", peringkat: "ALL", jenis: "ALL", sesi: "ALL" },
  initialLocationSet: false,
  schoolMarkers: new Map() as MarkerMap,
  userMarkers: new Map() as MarkerMap,
  localSuggestions: [],
  localSuggestionsPage: 1,
  hasMoreLocalSuggestions: true,
  isLoadingLocalSuggestions: false,
  _searchRequestId: 0,
  viewSchool: null,
  query: "",
  statePolygons: new Map<string, GeoJSONFeature>(),
  pointA: null,
  pointB: null,
  routeCoordinates: [],
  routeDistance: null,
  routeDuration: null,
  setPointA: (point) => {
    set({ pointA: point });
  },
  setPointB: (point) => {
    set({ pointB: point });
  },
  setRoute: (coords, distance, duration) => {
    set({
      routeCoordinates: coords,
      routeDistance: distance,
      routeDuration: duration,
    });
  },
  clearRoute: () => {
    set({ routeCoordinates: [], routeDistance: null, routeDuration: null });
  },
  setDataTotal: (total) => {
    set({ dataTotal: total });
  },
  setSinglePageTotal: (total) => {
    set({ singlePageTotal: total });
  },
  setCenter: (c) => {
    set(() => {
      return { center: c };
    });
  },
  setZoom: (z) => {
    set(() => {
      return { zoom: z };
    });
  },
  setRadius: (r) => {
    set(() => {
      return { radius: r };
    });
  },
  setMapFilters: (f) => {
    set((s) => ({ mapFilters: { ...s.mapFilters, ...f } }));
  },
  setSesiFilter: (sesi) => {
    set((s) => ({ mapFilters: { ...s.mapFilters, sesi } }));
  },
  setInitialLocationSet: (v) => {
    set(() => {
      return { initialLocationSet: v };
    });
  },
  setSchoolMarkers: (markers) => {
    set((state) => {
      const next =
        typeof markers === "function" ? markers(state.schoolMarkers) : markers;
      return { schoolMarkers: next };
    });
  },
  setUserMarkers: (markers) => {
    set((state) => {
      const next =
        typeof markers === "function" ? markers(state.userMarkers) : markers;
      return { userMarkers: next };
    });
  },
  setLocalSuggestions: (suggestions) => {
    set({ localSuggestions: suggestions });
  },
  setViewSchool: (school) => {
    set(() => {
      return { viewSchool: school };
    });
  },
  handleSearch: async (params, pageNumber = 1, append = false) => {
    // Increment request ID — only the latest request's response will be applied
    const requestId = (get()._searchRequestId || 0) + 1;
    set({ _searchRequestId: requestId, isLoadingLocalSuggestions: true });

    // Keep the map's clustered source in sync with the active dropdown filters.
    set((s) => ({
      mapFilters: {
        ...s.mapFilters,
        negeri: params?.negeri ?? "ALL",
        peringkat: params?.peringkat ?? "ALL",
        jenis: params?.jenis ?? "ALL",
      },
    }));

    const hasActiveMapSearch = Boolean(
      params?.namaSekolah?.trim() ||
      (params?.negeri && params.negeri !== "ALL") ||
      (params?.jenis && params.jenis !== "ALL") ||
      (params?.peringkat && params.peringkat !== "ALL"),
    );

    try {
      const initialLocationUser =
        useLocationSessionStore.getState().initialLocationUser;
      const results = await getSchoolSuggestion(
        params,
        pageNumber,
        initialLocationUser,
      );

      // If a newer request was fired while we were waiting, discard this response
      if (get()._searchRequestId !== requestId) return;
      const dataResults = results.filteredData;
      const dataTotal = results.totalSchool;
      const singlePageTotal = results.totalInSinglePage;
      set({ singlePageTotal });
      set({ dataTotal });
      const transformed = dataResults.map(
        (school): SearchBarMapProps => ({
          namaSekolah: school.namaSekolah ?? "Sekolah Tidak Diketahui",
          kodSekolah: school.kodSekolah ?? "",
          koordinatYY: school.data.infoLokasi.koordinatYY,
          koordinatXX: school.data.infoLokasi.koordinatXX,
          negeri: school.data.infoPentadbiran.negeri ?? "",
          bandarSurat: school.data.infoKomunikasi.bandarSurat,
          jenisLabel: school.data.infoSekolah.jenisLabel ?? "",
          jumlahPelajar: school.data.infoSekolah.jumlahPelajar ?? 0,
          jumlahGuru: school.data.infoSekolah.jumlahGuru ?? 0,
          parlimen: school.data.infoPentadbiran.parlimen ?? "",
          isSekolahAngkatMADANI: school.isSekolahAngkatMADANI ?? false,
        }),
      );

      set((state) => {
        const newSuggestions = append
          ? [...state.localSuggestions, ...transformed]
          : transformed;

        return {
          localSuggestions: newSuggestions,
          localSuggestionsPage: pageNumber,
          //12 is page size returned from Backend. Atm not supported for changes.
          hasMoreLocalSuggestions: transformed.length >= 12,
        };
      });

      if (hasActiveMapSearch && !append && transformed.length > 0) {
        // Build new markers from search results
        const newMarkers: MarkerMap = new Map();
        transformed.forEach((school) => {
          if (school.kodSekolah) {
            newMarkers.set(school.kodSekolah, {
              koordinatXX: school.koordinatYY,
              koordinatYY: school.koordinatXX,
              dataUrl: "",
              markerType: "INDIVIDUAL",
              negeri: school.negeri,
              parlimen: school.parlimen,
            });
          }
        });

        // Calculate appropriate zoom based on spread of results
        let zoom = 18;
        if (transformed.length > 1) {
          const lats = transformed.map((s) => s.koordinatYY);
          const lngs = transformed.map((s) => s.koordinatXX);
          const latSpread = Math.max(...lats) - Math.min(...lats);
          const lngSpread = Math.max(...lngs) - Math.min(...lngs);
          const maxSpread = Math.max(latSpread, lngSpread);

          if (maxSpread > 2) zoom = 8;
          else if (maxSpread > 1) zoom = 9;
          else if (maxSpread > 0.5) zoom = 10;
          else if (maxSpread > 0.2) zoom = 11;
          else if (maxSpread > 0.1) zoom = 12;
          else if (maxSpread > 0.05) zoom = 13;
          else if (maxSpread > 0.01) zoom = 15;
          else zoom = 17;
        }

        // Center on midpoint of all results
        const avgLat =
          transformed.reduce((sum, s) => sum + s.koordinatYY, 0) /
          transformed.length;
        const avgLng =
          transformed.reduce((sum, s) => sum + s.koordinatXX, 0) /
          transformed.length;

        set({
          center: [avgLat, avgLng],
          zoom,
          schoolMarkers: newMarkers,
        });
      }

      if (hasActiveMapSearch && !append && transformed.length === 0) {
        set({
          schoolMarkers: new Map(),
          viewSchool: null,
        });
      }
    } catch (error) {
      console.error("Error fetching school suggestions:", error);
      set((state) => ({
        localSuggestions: append ? state.localSuggestions : [],
        hasMoreLocalSuggestions: append ? state.hasMoreLocalSuggestions : false,
        dataTotal: append ? state.dataTotal : 0,
      }));
    } finally {
      set({ isLoadingLocalSuggestions: false });
    }
  },
  setQuery: (q) => {
    set({ query: q });
  },
  setStatePolygons: (polygons) => {
    set({ statePolygons: polygons });
  },
  clearStatePolygons: () => {
    set({ statePolygons: new Map() });
  },
}));
