import { create } from "zustand";
import type { MarkerType } from "../types/maps";

type Center = [number, number];
type MarkerMap = Map<string, { lat: number; lng: number; dataUrl: string; markerType: MarkerType }>;

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
    set((prev) => {
      console.log("[mapView] setCenter", { prevCenter: prev.center, nextCenter: c });
      return { center: c };
    });
  },
  setZoom: (z) => {
    set((prev) => {
      console.log("[mapView] setZoom", { prevZoom: prev.zoom, nextZoom: z });
      return { zoom: z };
    });
  },
  setRadius: (r) => {
    set((prev) => {
      console.log("[mapView] setRadius", { prevRadius: prev.radius, nextRadius: r });
      return { radius: r };
    });
  },
  setInitialLocationSet: (v) => {
    set((prev) => {
      console.log("[mapView] setInitialLocationSet", { prev: prev.initialLocationSet, next: v });
      return { initialLocationSet: v };
    });
  },
  setSchoolMarkers: (markers) => {
    set((state) => {
      const next = typeof markers === "function" ? markers(state.schoolMarkers) : markers;
      console.log("[mapView] setSchoolMarkers", {
        inputType: typeof markers,
        prevSize: state.schoolMarkers.size,
        nextSize: next.size
      });
      return { schoolMarkers: next };
    });
  }
}));

console.log("[mapView] useMapViewStore created");