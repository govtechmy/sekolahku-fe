import axios from "axios";
import { useAuthStore } from "../store/store";

// Authenticated axios instance (uses default headers set by AuthStore)
export const authAxios = axios;

// Unauthenticated axios instance (no default headers)
export const unauthAxios = axios.create({
  // You can add default config here if needed, like timeout, baseURL, etc.
  timeout: 30000,
});

// Attach API key before every request
authAxios.interceptors.request.use((config) => {
  const apiKey = useAuthStore.getState().apiKey;
  if (apiKey) {
    config.headers["Sekolahku-X-Api-Key"] = apiKey;
  }
  return config;
});
