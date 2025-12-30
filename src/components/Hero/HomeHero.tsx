import { popularLinks } from "../../contentData";
import Hero from "../shared/Hero";
import SearchBar from "../shared/SearchBar";

export default function HomeHero() {
  return (
    <Hero
      title="Selamat Datang Ke Portal Sekolahku"
      search={<SearchBar />}
      links={popularLinks}
      HeroclassName="bg-gradient-to-b from-[#E6F0FF] via-[#F2F7FF] to-[#FFFFFF]"
      background={
        <>
          <div className="block lg:hidden h-full w-full bg-[url('/utama/home-hero-mobile.svg')] bg-contain bg-center bg-no-repeat" />
          <div className="hidden lg:block h-full w-full bg-[url('/utama/sekolahku.png')] bg-contain bg-center bg-no-repeat" />
        </>
      }
    />
  );
}
