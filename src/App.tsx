import { useEffect, useState } from "react";
import AccessGuard from "./components/AccessGuard";
import AppRoutes from "./router";
import { BrowserRouter } from "react-router-dom";

function App() {
  sessionStorage.setItem("dev_access_allowed", "true");
  if (import.meta.env.VITE_APP_ENV === "production") {
    sessionStorage.setItem("dev_access_allowed", "false");
  }

  if (!import.meta.env.VITE_APP_CODE) {
    sessionStorage.setItem("dev_access_allowed", "true");
  }

  const [isAllowed, setIsAllowed] = useState(false);
  const devCode = "dev1234"

  useEffect(() => {
    const isAllowed = sessionStorage.getItem("dev_access_allowed") === "true";
    if (isAllowed) setIsAllowed(true);
  }, []);
  
  return (
    // Temporarily used
    <>
      {!isAllowed ? (
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
