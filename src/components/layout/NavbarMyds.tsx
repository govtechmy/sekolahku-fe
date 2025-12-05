 import { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Button, ButtonIcon } from "@govtechmy/myds-react/button";
// import { GlobeIcon } from "@govtechmy/myds-react/icon";
import {
  Navbar,
  NavbarMenu,
  NavbarMenuItem,
  NavbarAction,
} from "@govtechmy/myds-react/navbar";
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
  // const { lang } = useParams<{ lang: string }>();
  const [isHidden, setIsHidden] = useState(false);
  // const [selectedLang, setSelectedLang] = useState(
  //   localStorage.getItem("lang") || "ms"
  // );

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
      <div className="flex items-center gap-2.5">
        <img src="/JataNegara.svg" />
        <div className="font-heading text-txt-black-900 text-body-lg font-semibold">Sekolahku</div>
      </div>
      <NavbarMenu
        classNameNavDesktop=""
        classNameNavMobile={`top-[-4vh] ${isHidden ? "block" : "hidden"}`}
      >
        <NavbarMenuItem href="/menu1">Utama</NavbarMenuItem>
        <NavbarMenuItem href="/menu2">Analitik</NavbarMenuItem>
        <NavbarMenuItem href="carian-sekolah">Carian Sekolah</NavbarMenuItem>
        <NavbarMenuItem href="siaran">Siaran</NavbarMenuItem>
        <NavbarMenuItem href="/menu5">Acara</NavbarMenuItem>
      </NavbarMenu>

      <NavbarAction onClick={() => setIsHidden((prev) => !prev)}>
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
