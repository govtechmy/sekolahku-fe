import { create } from "zustand";

type Center = [number, number];

interface MapViewState {
  center: Center;
  zoom: number;
  initialLocationSet: boolean;
  radius: number;
  setRadius: (r: number)=> void
  setCenter: (c: Center) => void;
  setZoom: (z: number) => void;
  setInitialLocationSet: (v: boolean) => void;
}

export const useMapViewStore = create<MapViewState>((set) => ({
  center: [3.760115447396889, 108.46252441406251],
  zoom: 6,
  radius: 0,
  initialLocationSet: false,
  setCenter: (c) => {
    console.log("[mapView] setCenter:", c);
    set({ center: c });
  },
  setZoom: (z) => {
    console.log("[mapView] setZoom:", z);
    set({ zoom: z });
  },
  setRadius: (r) => {
    console.log("[mapView] setRadius:", r);
    set({ radius: r });
  },
  setInitialLocationSet: (v) => {
    console.log("[mapView] setInitialLocationSet:", v);
    set({ initialLocationSet: v });
  },
}));
