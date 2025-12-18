import { create } from "zustand";
import type { MarkerMap } from "../utils/markerProcessors";

type Center = [number, number];

interface MapViewState {
  center: Center;
  zoom: number;
  initialLocationSet: boolean;
  radius: number;
  schoolMarkers: MarkerMap;
  setRadius: (r: number)=> void
  setCenter: (c: Center) => void;
  setZoom: (z: number) => void;
  setInitialLocationSet: (v: boolean) => void;
  setSchoolMarkers: (markers: MarkerMap | ((prev: MarkerMap) => MarkerMap)) => void;
}

export const useMapViewStore = create<MapViewState>((set) => ({
  center: [3.760115447396889, 108.46252441406251],
  zoom: 6,
  radius: 0,
  initialLocationSet: false,
  schoolMarkers: new Map() as MarkerMap,
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
      const next = typeof markers === "function" ? markers(state.schoolMarkers) : markers;
      return { schoolMarkers: next };
    });
  }
}));