import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const sessionStorageAdapter = {
  getItem: (name: string) => {
    const value = sessionStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: unknown) => {
    sessionStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    sessionStorage.removeItem(name);
  },
};

type AuthStore = {
  apiKey: string | null;
  isAuthenticated: boolean;
  setApiKey: (apiKey: string) => void;
  getApi: () => string | null;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      apiKey: import.meta.env.VITE_API_KEY,
      isAuthenticated: false,

      setApiKey: (apiKey: string) => {
        set({ apiKey, isAuthenticated: true });
        axios.defaults.headers["Api-Key"] = apiKey;
      },

      getApi: () => get().apiKey,
    }),
    {
      name: "auth-storage",
      storage: sessionStorageAdapter,
    },
  ),
);
