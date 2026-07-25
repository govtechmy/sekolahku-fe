import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import LangWrapper from "./components/layout/LangWrapper";
import LayoutMain from "./components/layout/LayoutMain";
import LayoutMap from "./components/layout/LayoutMap";
import { importSchoolMapsPage } from "./pages/SchoolMaps.lazy";

const HomePage = lazy(() => import("./pages/Home"));
const SchoolMapsPage = lazy(importSchoolMapsPage);
const ErrorPage = lazy(() => import("./pages/Error"));
const SchoolProfile = lazy(() => import("./pages/SchoolProfile"));
const Siaran = lazy(() => import("./pages/Siaran/Siaran"));
const SiaranId = lazy(() => import("./pages/Siaran/SiaranId"));
const Takwim = lazy(() => import("./pages/Takwim/Takwim"));
const DisclaimerPage = lazy(() => import("./pages/Disclaimer"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicy"));

/**
 * Neutral, layout-preserving fallback shown while a lazy route chunk loads.
 * Fills the space the routed content would occupy so the surrounding shell
 * (masthead, navbar, footer) doesn't collapse or jump.
 */
function RouteFallback() {
  return (
    <div
      className="flex-grow min-h-[50vh] w-full bg-bg-white"
      aria-busy="true"
      aria-live="polite"
    />
  );
}

export default function AppRoutes() {
  const lang = localStorage.getItem("lang") || "ms";

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${lang}`} replace />} />
      <Route path=":lang" element={<LangWrapper />}>
        <Route element={<LayoutMain />}>
          {/* no home is not on / but on /home  so redirect */}
          <Route index element={<RedirectHomePage />} />
          <Route
            path="home"
            element={
              <Suspense fallback={<RouteFallback />}>
                <HomePage />
              </Suspense>
            }
          />
          <Route
            path="halaman-sekolah/:id"
            element={
              <Suspense fallback={<RouteFallback />}>
                <SchoolProfile />
              </Suspense>
            }
          />
          <Route
            path="berita-kpm"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Siaran />
              </Suspense>
            }
          />
          <Route
            path="berita-kpm/:id"
            element={
              <Suspense fallback={<RouteFallback />}>
                <SiaranId />
              </Suspense>
            }
          />
          <Route
            path="takwim"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Takwim />
              </Suspense>
            }
          />
          <Route
            path="disclaimer"
            element={
              <Suspense fallback={<RouteFallback />}>
                <DisclaimerPage />
              </Suspense>
            }
          />
          <Route
            path="privacy-policy"
            element={
              <Suspense fallback={<RouteFallback />}>
                <PrivacyPolicyPage />
              </Suspense>
            }
          />
          <Route
            path="404"
            element={
              <Suspense fallback={<RouteFallback />}>
                <ErrorPage />
              </Suspense>
            }
          />
          <Route path="*" element={<Redirect404Page />} />
        </Route>
        <Route element={<LayoutMap />}>
          <Route
            path="carian-sekolah"
            element={
              <Suspense fallback={<MapRouteFallback />}>
                <SchoolMapsPage />
              </Suspense>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
}

/**
 * Fallback for the full-height map layout. A plain text fallback would look
 * broken here, so we fill the remaining viewport height with a neutral panel.
 */
function MapRouteFallback() {
  return (
    <div
      className="flex-grow w-full bg-bg-washed"
      aria-busy="true"
      aria-live="polite"
    />
  );
}

function Redirect404Page() {
  const { lang } = useParams<{ lang: string }>();
  const allowedLangs = ["en", "ms"];
  const langStorage = localStorage.getItem("lang");
  const targetLang =
    lang && allowedLangs.includes(lang) ? lang : langStorage || "ms";
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
    targetLang = "ms"; // fallback
  }

  return <Navigate to={`/${targetLang}/home`} replace />;
}
