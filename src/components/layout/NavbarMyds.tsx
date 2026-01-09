import { Link, useLocation, useParams } from "react-router-dom";
import {
  Navbar,
  NavbarAction,
  NavbarMenu,
  NavbarMenuItem,
} from "../shared/mydsNavbar";
// import { Button, ButtonIcon } from "@govtechmy/myds-react/button";
// import { GlobeIcon } from "@govtechmy/myds-react/icon";

// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@govtechmy/myds-react/select";
// import { ThemeSwitch } from "@govtechmy/myds-react/theme-switch";
// import i18n from "../../i18n";
// import CartIcon from "../../icons/CartIcon";

export default function NavbarMyds() {
  // const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const location = useLocation();
  // const [selectedLang, setSelectedLang] = useState(
  //   localStorage.getItem("lang") || "ms"
  // );

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const activeItem =
    pathSegments.length > 1 ? pathSegments[1] : pathSegments[0] || "home";
  const currentLang = lang || localStorage.getItem("lang") || "ms";

  const handleNavItemClick = () => {
    const closeButton = document.querySelector<HTMLButtonElement>(
      '[aria-label="Close navigation menu"]',
    );
    closeButton?.click();
    console.log("hehehe");
  };

  // Sync state when URL param changes (for manual URL changes or navigation)
  // useEffect(() => {
  //   if (lang && (lang === "en" || lang === "ms")) {
  //     setSelectedLang(lang);
  //     localStorage.setItem("lang", lang);
  //     i18n.changeLanguage(lang);
  //   }
  // }, [lang]);

  // const updateLanguage = (newLang: string) => {
  //   setSelectedLang(newLang);
  //   localStorage.setItem("lang", newLang);
  //   i18n.changeLanguage(newLang);
  //   const currentPath = window.location.pathname;
  //   const newPath = currentPath.replace(/^\/(en|ms)/, `/${newLang}`);
  //   navigate(newPath);
  // };

  return (
    <Navbar>
      <Link
        to={`/${currentLang}/home`}
        className="flex items-center gap-2.5 focus:outline-otl-primary-200 rounded-sm"
      >
        <img src="/JataNegara.svg" />
        <div className="font-heading text-txt-black-900 text-body-lg font-semibold">
          Sekolahku
        </div>
      </Link>
      <NavbarMenu classNameNavDesktop="" classNameNavMobile="z-[1200]">
        <NavbarMenuItem
          asChild
          href={`/${currentLang}/home`}
          aria-current={activeItem === "home" ? "page" : undefined}
          className={activeItem === "home" ? "bg-bg-washed" : ""}
        >
          <Link to={`/${currentLang}/home`} onClick={handleNavItemClick}>
            Utama
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem
          asChild
          href={`/${currentLang}/carian-sekolah`}
          aria-current={activeItem === "carian-sekolah" ? "page" : undefined}
          className={activeItem === "carian-sekolah" ? "bg-bg-washed" : ""}
        >
          <Link
            to={`/${currentLang}/carian-sekolah`}
            onClick={handleNavItemClick}
          >
            Carian Sekolah
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem
          asChild
          href={`/${currentLang}/siaran`}
          aria-current={activeItem === "siaran" ? "page" : undefined}
          className={activeItem === "siaran" ? "bg-bg-washed" : ""}
        >
          <Link to={`/${currentLang}/siaran`} onClick={handleNavItemClick}>
            Siaran
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem
          asChild
          href={`/${currentLang}/acara`}
          aria-current={activeItem === "acara" ? "page" : undefined}
          className={activeItem === "acara" ? "bg-bg-washed" : ""}
        >
          <Link to={`/${currentLang}/acara`} onClick={handleNavItemClick}>
            Acara
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>

      <NavbarAction>
        {/* Search Button */}
        {/* <Button
          variant="default-ghost"
          iconOnly
          aria-label="search-button"
          size="small"
        >
          <ButtonIcon>
            <CartIcon />
          </ButtonIcon>
        </Button> */}

        {/* Theme Switch */}
        {/* <ThemeSwitch as="toggle" /> */}

        {/* Language Selector */}
        {/* <div className="hidden sm:block">
          <Select
            value={selectedLang}
            onValueChange={(value) => updateLanguage(value)}
            variant="outline"
            size="small"
          >
            <SelectTrigger aria-label="language-selection">
              <GlobeIcon className="h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end" className="font-body rounded-[4px] py-1">
              <SelectItem value="en">BI</SelectItem>
              <SelectItem value="ms">BM</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </NavbarAction>
    </Navbar>
  );
}
