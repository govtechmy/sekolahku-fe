import { create } from "zustand";
import type { MarkerMap } from "../utils/markerProcessors";
import type { SearchBarMapProps } from "../types/maps";
import { handleSchoolSearch } from "../utils/handleSchoolSearch";

type Center = [number, number];

interface MapViewState {
  center: Center;
  initialLocationUser: Center;
  zoom: number;
  initialLocationSet: boolean;
  radius: number;
  schoolMarkers: MarkerMap;
  filteredSearchResult: SearchBarMapProps[];
  setCenter: (c: Center) => void;
  setInitialLocationUser: (c: Center) => void;
  setRadius: (r: number) => void;
  setZoom: (z: number) => void;
  setInitialLocationSet: (v: boolean) => void;
  setSchoolMarkers: (
    markers: MarkerMap | ((prev: MarkerMap) => MarkerMap)
  ) => void;
  setFilteredSearchResult: (val: SearchBarMapProps[]) => void;
  searchSchoolSuggestions: (params: {
    namaSekolah?: string;
    negeri?: string;
    jenis?: string;
  }) => Promise<void>;
}

export const useMapViewStore = create<MapViewState>((set) => ({
  initialLocationUser:[3.760115447396889, 108.46252441406251],
  center: [3.760115447396889, 108.46252441406251],
  zoom: 6,
  radius: 3000,
  initialLocationSet: false,
  schoolMarkers: new Map() as MarkerMap,
  filteredSearchResult: [],
  setCenter: (c) => {
    set(() => {
      return { center: c };
    });
  },
  setInitialLocationUser: (initlocuser) => {
    set(() => {
      return { initialLocationUser: initlocuser };
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
  setFilteredSearchResult: (val) => {
    set(() => ({ filteredSearchResult: val }));
  },
  searchSchoolSuggestions: async (params) => {
    // Delegate to utility to keep store clean
    await handleSchoolSearch(params, {
      setFilteredSearchResult: (val) => set(() => ({ filteredSearchResult: val })),
      setCenter: (center) => set(() => ({ center })),
      setZoom: (zoom) => set(() => ({ zoom })),
    });
  },
}));
