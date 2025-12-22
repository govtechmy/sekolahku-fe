import { create } from "zustand";
import type { MarkerMap } from "../utils/markerProcessors";
import type { SearchBarMapProps } from "../types/maps";
import type { ItemSekolahModel } from "../models/response";
import { getSchoolSuggestion } from "../services/school.svc";

type Center = [number, number];

interface MapViewState {
  center: Center;
  initialLocationUser: Center;
  zoom: number;
  initialLocationSet: boolean;
  radius: number;
  schoolMarkers: MarkerMap;
  localSuggestions: SearchBarMapProps[];
  viewSchool: ItemSekolahModel | null;
  setCenter: (c: Center) => void;
  setInitialLocationUser: (c: Center) => void;
  setRadius: (r: number) => void;
  setZoom: (z: number) => void;
  setInitialLocationSet: (v: boolean) => void;
  setSchoolMarkers: (
    markers: MarkerMap | ((prev: MarkerMap) => MarkerMap)
  ) => void;
  setLocalSuggestions: (suggestions: SearchBarMapProps[]) => void;
  setViewSchool: (school: ItemSekolahModel | null) => void;
  handleSearch: (params: {
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
  localSuggestions: [],
  viewSchool: null,
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
  setLocalSuggestions: (suggestions) => {
    set({ localSuggestions: suggestions });
  },
  setViewSchool: (school) => {
    set(() => {
      return { viewSchool: school };
    });
  },
  handleSearch: async (params) => {
    try {
      const results = await getSchoolSuggestion(params);
      const transformed = results.map((school): SearchBarMapProps => ({
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
      }));
      
      set({ localSuggestions: transformed });

      if (transformed.length > 0) {
        const firstResult = transformed[0];
        set({ 
          center: [firstResult.koordinatYY, firstResult.koordinatXX],
          zoom: 18
        });
      }
    } catch (error) {
      console.error("Error fetching school suggestions:", error);
      set({ localSuggestions: [] });
    }
  }
}));

