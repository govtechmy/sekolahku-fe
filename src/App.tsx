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

  const isProduction = import.meta.env.VITE_APP_ENV === "production";

  const getInitialAllowed = () => {
    if (isProduction) return true;

    const devStorage = sessionStorage.getItem("dev_access_allowed");
    if (devStorage !== null) {
      return devStorage === "true";
    }

    // First time visit in dev
    if (!import.meta.env.VITE_APP_CODE) {
      sessionStorage.setItem("dev_access_allowed", "true");
      return true;
    } else {
      sessionStorage.setItem("dev_access_allowed", "false");
      return false;
    }
  };

  const [isAllowed, setIsAllowedState] = useState(getInitialAllowed());

  const setIsAllowed = (value: boolean) => {
    setIsAllowedState(value);
    sessionStorage.setItem("dev_access_allowed", value.toString());
  };

  const devCode = "dev1234";

  return (
    <BrowserRouter>
      {!isAllowed && !isProduction ? (
        <AccessGuard
          correctCode={devCode}
          onAccessGranted={() => setIsAllowed(true)}
        />
      ) : (
        <AppRoutes></AppRoutes>
      )}
    </BrowserRouter>
  );
}
export default App;
