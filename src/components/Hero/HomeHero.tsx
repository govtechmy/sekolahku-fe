import { popularLinks } from "../../contentData";
import Hero from "../shared/Hero";
import SearchBarHome from "../shared/SearchBarHome";

export default function HomeHero() {
  return (
    <Hero
      title="Selamat Datang Ke Portal Sekolahku"
      search={<SearchBarHome />}
      links={popularLinks}
      gradientColors={{
        "top-gradient": "#E6F0FF",
        "middle-gradient": "#F2F7FF",
        "bottom-gradient": "#FFFFFF"
      }}
      background={
        <>
          <div
            className="block h-full w-full bg-center bg-no-repeat bg-cover lg:hidden"
            style={{
              backgroundImage: `url('/utama/home-hero-mobile.svg')`,
            }}
          />
          <div
            className="hidden h-full w-full bg-cover bg-center bg-no-repeat lg:block"
            style={{
              backgroundImage: `url('/utama/sekolahku.png')`,
            }}
          />
        </>
      }
    />
  );
}
