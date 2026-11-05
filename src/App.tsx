import { useEffect } from "react";
import AppRoutes from "./router";
import { BrowserRouter } from "react-router-dom";

function App() {
  useEffect(() => {
    const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;
    if (!websiteId) return;
    const script = document.createElement("script");
    script.src = import.meta.env.VITE_UMAMI_SCRIPT_URL;
    script.defer = true;
    script.setAttribute("data-website-id", websiteId);
    script.setAttribute("data-domains", import.meta.env.VITE_UMAMI_DOMAINS);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes></AppRoutes>
    </BrowserRouter>
  );
}
export default App;
