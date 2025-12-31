import Hero from "../shared/Hero";
import SearchBar from "../shared/SearchBar";
import { DateRangePicker } from "@govtechmy/myds-react/daterange-picker";

interface SiaranHeroProps {
  query: string;
  setQuery: (value: string) => void;
  handleValueChange: (value: string) => void;
  suggestions: Array<{ id: string; title: string }>;
}

export default function SiaranHero({
  query,
  setQuery,
  handleValueChange,
  suggestions,
}: SiaranHeroProps) {
  return (
    <Hero
      title="Siaran Sekolahku"
      variant="full"
      search={
        <SearchBar
          query={query}
          setQuery={setQuery}
          handleValueChange={handleValueChange}
          suggestions={suggestions}
          getKey={(item) => item.id}
          getLabel={(item) => item.title}
        />
      }
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
