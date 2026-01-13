import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Match the Center type used in mapView.ts
export type Center = [number | null, number | null];

export interface LocationSessionState {
  initialLocationUser: Center;
  setInitialLocationUser: (location: Center) => void;
}

export const useLocationSessionStore = create<LocationSessionState>()(
  persist(
    (set) => ({
      initialLocationUser: [null, null],
      setInitialLocationUser: (location) =>
        set({ initialLocationUser: location }),
    }),
    {
      name: "locationSession", // key in sessionStorage
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
