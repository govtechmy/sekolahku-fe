import { create } from "zustand";
import type { MarkerMap } from "../utils/markerProcessors";
import type { SearchBarMapProps } from "../types/maps";
import type { ItemSekolahModel } from "../models/response";
import { getSchoolSuggestion } from "../services/school.svc";
import type { GeoJSONFeature } from "../types/polygon";

type Center = [number, number];

interface MapViewState {
  center: Center;
  zoom: number;
  initialLocationSet: boolean;
  radius: number;
  schoolMarkers: MarkerMap;
  userMarkers: MarkerMap;
  localSuggestions: SearchBarMapProps[];
  localSuggestionsPage: number;
  hasMoreLocalSuggestions: boolean;
  isLoadingLocalSuggestions: boolean;
  viewSchool: ItemSekolahModel | null;
  query: string;
  statePolygons: Map<string, GeoJSONFeature>;
  setCenter: (c: Center) => void;
  setRadius: (r: number) => void;
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
    },
    pageNumber?: number,
    append?: boolean,
  ) => Promise<void>;
  setQuery: (q: string) => void;
  // Polygon actions
  setStatePolygons: (polygons: Map<string, GeoJSONFeature>) => void;
  clearStatePolygons: () => void;
}

export const useMapViewStore = create<MapViewState>((set, get) => ({
  initialLocationUser: [3.760115447396889, 108.46252441406251],
  center: [3.760115447396889, 108.46252441406251],
  zoom: 6,
  radius: 3000,
  initialLocationSet: false,
  schoolMarkers: new Map() as MarkerMap,
  userMarkers: new Map() as MarkerMap,
  localSuggestions: [],
  localSuggestionsPage: 1,
  hasMoreLocalSuggestions: true,
  isLoadingLocalSuggestions: false,
  viewSchool: null,
  query: "",
  statePolygons: new Map<string, GeoJSONFeature>(),
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
    // Prevent overlapping requests regardless of UI timing
    if (get().isLoadingLocalSuggestions) {
      return;
    }
    try {
      set({ isLoadingLocalSuggestions: true });

      const results = await getSchoolSuggestion(params, pageNumber);
      const transformed = results.map(
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

      if (!append && transformed.length > 0) {
        const firstResult = transformed[0];
        set({
          center: [firstResult.koordinatYY, firstResult.koordinatXX],
          zoom: 18,
        });
      }
    } catch (error) {
      console.error("Error fetching school suggestions:", error);
      set((state) => ({
        localSuggestions: append ? state.localSuggestions : [],
        hasMoreLocalSuggestions: false,
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
