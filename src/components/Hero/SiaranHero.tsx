import Hero from "../shared/Hero";
import SearchBarMain from "../shared/SearchBar";
import { DateRangePicker } from "@govtechmy/myds-react/daterange-picker";

export default function SiaranHero() {

  return (
    <Hero
      title="Siaran Sekolahku"
      variant="full"
      search={<SearchBarMain            
        desc='"tajuk siaran", "pengumuman"'
/>}
      background={
        <>
          <div className="block lg:hidden h-full w-full bg-[url('/utama/siaran/hero-banner/mobile-sekolahku.svg')] bg-contain bg-center bg-no-repeat" />
          <div className="hidden lg:block h-full w-full bg-[url('/utama/siaran/hero-banner/large-sekolahku.svg')] bg-cover bg-center bg-no-repeat" />
        </>
      }
      filters={<DateRangePicker />}
    />
  );
}
