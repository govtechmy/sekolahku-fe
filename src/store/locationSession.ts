import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Match the Center type used in mapView.ts
export type Center = [number, number];

export interface LocationSessionState {
  initialLocationUser: Center;
  setInitialLocationUser: (location: Center) => void;
}

export const useLocationSessionStore = create<LocationSessionState>()(
  persist(
    (set) => ({
      initialLocationUser: [3.760115447396889, 108.46252441406251],
      setInitialLocationUser: (location) =>
        set({ initialLocationUser: location }),
    }),
    {
      name: "location-session", // key in sessionStorage
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
