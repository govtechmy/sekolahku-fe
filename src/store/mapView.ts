import { create } from "zustand";

type Center = [number, number];
type MarkerMap = Map<string, { lat: number; lng: number; dataUrl: string }>;

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
  schoolMarkers: new Map(),
  setCenter: (c) => {
    set({ center: c });
  },
  setZoom: (z) => {
    set({ zoom: z });
  },
  setRadius: (r) => {
    set({ radius: r });
  },
  setInitialLocationSet: (v) => {
    set({ initialLocationSet: v });
  },
  setSchoolMarkers: (markers) => {
    set((state) => ({
      schoolMarkers: typeof markers === 'function' ? markers(state.schoolMarkers) : markers
    }));
  }
}));