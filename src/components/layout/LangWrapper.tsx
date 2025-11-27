import { Navigate, Outlet, useParams } from "react-router-dom";
import i18n from "../../i18n";
import { useEffect } from "react";

export default function LangWrapper() {
  const { lang } = useParams<{ lang: string }>();
  const isValidLang = lang === "ms" || lang === "en";

  useEffect(() => {
    if (isValidLang) {
      localStorage.setItem("lang", lang!);
      i18n.changeLanguage(lang!);
    } else {
      localStorage.setItem("lang", "en");
      i18n.changeLanguage("en");
    }
  }, [lang, isValidLang]);

  if (!isValidLang) {
    const localStorageLang = localStorage.getItem("lang");
    if (localStorageLang !== "en" && localStorageLang !== "ms") {
      return <Navigate to="/en" replace />;
    }
    return <Navigate to={`/${localStorageLang}`} replace />;
  }

  return <Outlet />;
}
