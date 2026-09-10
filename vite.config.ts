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
});
