import Hero from "../shared/Hero";
import SearchBarMain from "../shared/SearchBar";
import { DateRangePicker } from "@govtechmy/myds-react/daterange-picker";

export default function SiaranHero() {
  return (
    <Hero
      title="Siaran Sekolahku"
      variant="full"
      search={<SearchBarMain desc='"tajuk siaran", "pengumuman"' />}
      background={
        <>
          <div
            className="block h-full w-full bg-center bg-no-repeat bg-cover lg:hidden"
            style={{
              backgroundImage: `url('/utama/siaran/hero-banner/mobile-sekolahku.svg')`,
            }}
          />
          <div
            className="hidden h-full w-full bg-cover bg-center bg-no-repeat lg:block"
            style={{
              backgroundImage: `url('/utama/siaran/hero-banner/large-sekolahku.svg')`,
            }}
          />
        </>
      }
      filters={<DateRangePicker />}
    />
  );
}
