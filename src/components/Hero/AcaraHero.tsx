import Hero from "../shared/Hero";
import SearchBar from "../shared/SearchBar";
import { DateRangePicker } from "@govtechmy/myds-react/daterange-picker";

interface AcaraHeroProps {
  query: string;
  setQuery: (value: string) => void;
  handleValueChange: (value: string) => void;
  suggestions: Array<{ id: string; title: string }>;
}

export default function AcaraHero({ query, setQuery, handleValueChange, suggestions }: AcaraHeroProps) {
  return (
    <Hero
      title="Acara Sekolahku"
      variant="full"
      search={
        <SearchBar
          query={query}
          setQuery={setQuery}
          handleValueChange={handleValueChange}
          suggestions={suggestions}
          getKey={item => item.id}
          getLabel={item => item.title}
        />
      }
      background={
        <>
          <div className="block lg:hidden h-full w-full bg-[url('/utama/acara/hero-banner/mobile-sekolahku.svg')] bg-contain bg-center bg-no-repeat" />
          <div className="hidden lg:block h-full w-full bg-[url('/utama/acara/hero-banner/large-sekolahku.svg')] bg-cover bg-center bg-no-repeat" />
        </>
      }
      filters={<DateRangePicker />}
    />
  );
}
