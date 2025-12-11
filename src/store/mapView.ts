import { create } from "zustand";

type Center = [number, number];

interface MapViewState {
  center: Center;
  zoom: number;
  setCenter: (c: Center) => void;
  setZoom: (z: number) => void;
}

export const useMapViewStore = create<MapViewState>((set) => ({
  center: [3.760115447396889, 108.46252441406251],
  zoom: 6,
  setCenter: (c) => set({ center: c }),
  setZoom: (z) => set({ zoom: z }),
}));
