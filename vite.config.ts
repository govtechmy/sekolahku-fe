import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Honour PORT (preview harness assigns one); default to Vite's 5173 otherwise.
  server: { port: Number(process.env.PORT) || 5173 },
  build: {
    manifest: true,
  },
  server: {
    // The school-detail JSON lives on a CDN that returns no CORS headers for
    // localhost, so a direct browser fetch is blocked. In dev, point
    // VITE_DATA_BASE_URL at "/cdn-data" and let Vite proxy it server-side.
    proxy: {
      "/cdn-data": {
        target: "https://dncqb1id1qkni.cloudfront.net",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cdn-data/, ""),
      },
    },
  },
});
