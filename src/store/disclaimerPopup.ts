import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface PopupState {
  initialPopupState: boolean;
  setInitialPopupState: (status: boolean) => void;
}

export const usePopupState = create<PopupState>()(
  persist(
    (set) => ({
      initialPopupState: false,
      setInitialPopupState: (status) => set({ initialPopupState: status }),
    }),
    {
      name: "disclaimerPopupSession",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
