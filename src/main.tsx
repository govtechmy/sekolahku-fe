import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@govtechmy/myds-react/hooks";
import "./index.css";
import App from "./App.tsx";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <App />
        </Suspense>
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>,
);
