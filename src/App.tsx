import { useEffect } from "react";
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

  return (
    <BrowserRouter>
      <AppRoutes></AppRoutes>
    </BrowserRouter>
  );
}
export default App;
