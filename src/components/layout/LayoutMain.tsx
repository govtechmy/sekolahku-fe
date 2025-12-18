import FooterMyds from "./FooterMyds";
import MastheadMyds from "./MastheadMyds";
import NavbarMyds from "./NavbarMyds";
import HomeHero from "./HomeHero";
import SiaranHero from "./SiaranHero";
import SchoolProfileHero from "./SchoolProfileHero";
import { Outlet, useLocation } from "react-router-dom";

export default function LayoutMain() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentPage = pathSegments[1] || 'home';

  return (
    <>
      <MastheadMyds></MastheadMyds>
      <NavbarMyds></NavbarMyds>
      
      {currentPage === 'home' && <HomeHero />}
      {currentPage === 'siaran' && <SiaranHero />}
      {currentPage === 'halaman-sekolah' && <SchoolProfileHero />}
      
      {/* use outlet instead of children to tell where to render child routes for the current route hierarchy. */}
      <div className="mx-auto flex-1 px-[18px] sm:px-[18px] md:px-[24px] lg:px-[24px] xl:px-[24px] max-w-[1328px] py-16 flex flex-col">
        <Outlet />
      </div>
      <FooterMyds></FooterMyds>
    </>
  );
}
