import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@govtechmy/myds-react/hooks";
import "./index.css";
import App from "./App.tsx";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </Suspense>
    </ThemeProvider>
  </StrictMode>,
);
