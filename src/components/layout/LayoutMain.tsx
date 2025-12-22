import HomeHero from "../Hero/HomeHero";
import SchoolProfileHero from "../Hero/SchoolProfileHero";
import SiaranHero from "../Hero/SiaranHero";
import FooterMyds from "./FooterMyds";
import MastheadMyds from "./MastheadMyds";
import NavbarMyds from "./NavbarMyds";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

type SchoolProps = {
  KODSEKOLAH: string;
  NAMASEKOLAH: string;
}

export default function LayoutMain() {
  const location = useLocation();
  const { id } = useParams();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentPage = pathSegments[1] || 'home';
  
  const [schools, setSchools] = useState<SchoolProps[]>([]);
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(true);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true);
        const response = await fetch('/school-list.json');
        if (response.ok) {
          const data = await response.json();
          console.log('Schools data:', data);
          
          if (isMountedRef.current) {
            setSchools(data);
          }
        } else {
          throw new Error('Failed to fetch');
        }
      } catch (error) {
        console.warn('Failed to fetch schools data:', error);
        if (isMountedRef.current) {
          setSchools([]);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchSchools();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const school = schools.find((s: SchoolProps) => s.KODSEKOLAH === id);

  return (
    <>
      <MastheadMyds></MastheadMyds>
      <NavbarMyds></NavbarMyds>
      
      {currentPage === 'home' && <HomeHero />}
      {currentPage === 'siaran' && <SiaranHero />}
      {currentPage === 'halaman-sekolah' && !loading && <SchoolProfileHero school={school} />}
      
      {/* use outlet instead of children to tell where to render child routes for the current route hierarchy. */}
      <div className="mx-auto flex-1 px-[18px] sm:px-[18px] md:px-[24px] lg:px-[24px] xl:px-[24px] max-w-[1328px] py-16 flex flex-col">
        <Outlet />
      </div>
      <FooterMyds></FooterMyds>
    </>
  );
}
