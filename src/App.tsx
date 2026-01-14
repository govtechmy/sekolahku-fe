import { useEffect, useState } from "react";
import AccessGuard from "./components/AccessGuard";
import AppRoutes from "./router";
import { BrowserRouter } from "react-router-dom";

function App() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@tinybirdco/flock.js";
    script.defer = true;
    script.setAttribute("data-token", import.meta.env.VITE_TINYBIRD_TOKEN);
    script.setAttribute("data-host", import.meta.env.VITE_TINYBIRD_HOST);
    script.setAttribute(
      "data-datasource",
      import.meta.env.VITE_TINYBIRD_DATASOURCE,
    );
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const [isAllowed, setIsAllowedState] = useState(false);
  const isProduction = import.meta.env.VITE_APP_ENV === "production";

  const setIsAllowed = (value: boolean) => {
    setIsAllowedState(value);
    sessionStorage.setItem("dev_access_allowed", value.toString());
  };

  const devCode = "dev1234";

  useEffect(() => {
    if (isProduction) {
      setIsAllowed(true);
      return;
    }

    const devStorage = sessionStorage.getItem("dev_access_allowed");
    if (!devStorage) {
      if (!import.meta.env.VITE_APP_CODE) {
        sessionStorage.setItem("dev_access_allowed", "true");
      } else {
        sessionStorage.setItem("dev_access_allowed", "false");
      }
    }

    const isAllowedFromStorage =
      sessionStorage.getItem("dev_access_allowed") === "true";
    if (isAllowedFromStorage) setIsAllowed(true);
  }, [isProduction]);

  return (
    // Temporarily used
    <>
      {!isAllowed && !isProduction ? (
        <AccessGuard
          correctCode={devCode}
          onAccessGranted={() => setIsAllowed(true)}
        />
      ) : (
        <BrowserRouter>
          <AppRoutes></AppRoutes>
        </BrowserRouter>
      )}
    </>
    //Temporary disabled
    // <BrowserRouter>
    //   <AppRoutes></AppRoutes>
    // </BrowserRouter>
  );
}
export default App;
