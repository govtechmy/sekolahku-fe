import { Routes, Route, Navigate, useParams } from "react-router-dom";
import LangWrapper from "./components/layout/LangWrapper";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import SchoolMapsPage from "./pages/SchoolMaps";
import ErrorPage from "./pages/Error";
import LayoutMain from "./components/layout/LayoutMain";
import SchoolProfile from "./pages/SchoolProfile";
import Siaran from "./pages/Siaran/Siaran";
import SiaranId from "./pages/Siaran/SiaranId";
import LayoutMap from "./components/layout/LayoutMap";

export default function AppRoutes() {
  const lang = localStorage.getItem("lang") || "ms";

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${lang}`} replace />} />
      <Route path=":lang" element={<LangWrapper />}>
        <Route element={<LayoutMain />}>
          {/* no home is not on / but on /home  so redirect */}
          <Route index element={<RedirectHomePage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />

          <Route path="halaman-sekolah" element={<SchoolProfile />} />
          <Route path="halaman-sekolah/:id" element={<SchoolProfile />} />
          <Route path="siaran" element={<Siaran />} />
          <Route path="siaran/:id" element={<SiaranId />} />
          <Route
            path="testingpage"
            element={<div> this is testing page</div>}
          />
          <Route path="404" element={<ErrorPage />} />
          <Route path="*" element={<Redirect404Page />} />
        </Route>
        <Route element={<LayoutMap />}>
          <Route path="carian-sekolah" element={<SchoolMapsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

function Redirect404Page() {
  const { lang } = useParams<{ lang: string }>();
  const allowedLangs = ["en", "ms"];
  const langStorage = localStorage.getItem("lang");
  const targetLang =
    lang && allowedLangs.includes(lang) ? lang : langStorage || "en";
  return <Navigate to={`/${targetLang}/404`} replace />;
}

function RedirectHomePage() {
  const { lang } = useParams<{ lang?: string }>();
  const allowedLangs = ["en", "ms"];
  const langStorage = localStorage.getItem("lang");

  let targetLang: string;

  if (lang && allowedLangs.includes(lang)) {
    targetLang = lang;
  } else if (langStorage && allowedLangs.includes(langStorage)) {
    targetLang = langStorage;
  } else {
    targetLang = "en"; // fallback
  }

  return <Navigate to={`/${targetLang}/home`} replace />;
}
