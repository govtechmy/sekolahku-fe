import Hero from "../shared/Hero";
import SearchBar from "../shared/SearchBar";
import { DateRangePicker } from "@govtechmy/myds-react/daterange-picker";

interface SiaranHeroProps {
  query: string;
  setQuery: (value: string) => void;
  handleValueChange: (value: string) => void;
  handleSearchEnter?: React.KeyboardEventHandler<HTMLInputElement>;
  suggestions: Array<{ id: string; title: string }>;
}

export default function SiaranHero({
  query,
  setQuery,
  handleValueChange,
  handleSearchEnter,
  suggestions,
}: SiaranHeroProps) {
  return (
    <Hero
      title="&nbsp;"
      variant="full"
      search={
        <SearchBar
          query={query}
          setQuery={setQuery}
          handleValueChange={handleValueChange}
          handleSearchEnter={handleSearchEnter}
          suggestions={suggestions}
          getKey={(item) => item.id}
          getLabel={(item) => item.title}
          searchBarTitle="Carian Berita KPM"
        />
      }
      background={
        // <>
        //   <div className="block lg:hidden h-full w-full bg-[url('/utama/siaran/hero-banner/mobile-sekolahku.svg')] bg-contain bg-center bg-no-repeat" />
        //   <div className="hidden lg:block h-full w-full bg-[url('/utama/siaran/hero-banner/large-sekolahku.svg')] bg-cover bg-center bg-no-repeat" />
        // </>
        <>
          <div className="relative block h-full w-full overflow-hidden bg-[#d9ecf7] lg:hidden">
            <div className="absolute inset-0 scale-110 bg-[url('/utama/kpm-hero-mobile.jpg')] bg-cover bg-center bg-no-repeat opacity-100 blur-2xl" />
            <div className="absolute inset-0 bg-[url('/utama/kpm-hero-mobile.jpg')] bg-contain bg-center bg-no-repeat" />
          </div>
          <div className="relative hidden h-full w-full overflow-hidden bg-[#d9ecf7] lg:block">
            <div className="absolute inset-0 scale-110 bg-[url('/utama/kpm-hero.jpg')] bg-cover bg-center bg-no-repeat opacity-100 blur-2xl" />
            <div className="absolute inset-0 bg-[url('/utama/kpm-hero.jpg')] bg-contain bg-center bg-no-repeat" />
          </div>
        </>
      }
      filters={<DateRangePicker />}
    />
  );
}
