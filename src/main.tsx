import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@govtechmy/myds-react/hooks";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <App />
      </Suspense>
    </ThemeProvider>
  </StrictMode>
);
