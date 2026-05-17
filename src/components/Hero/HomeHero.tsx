import { useNavigate, useParams } from "react-router-dom";
import { useMapViewStore } from "../../store/mapView";
import Hero from "../shared/Hero";
import SearchBar from "../shared/SearchBar";
import { useRef } from "react";

export default function HomeHero() {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const {
    query,
    setQuery,
    handleSearch,
    localSuggestions,
    setLocalSuggestions,
  } = useMapViewStore();
  const dataTotal = useMapViewStore((state) => state.dataTotal);
  const singlePageTotal = useMapViewStore((state) => state.singlePageTotal);
  const debounceTimerRef = useRef<number | null>(null);

  const handleValueChange = (value: string) => {
    setQuery(value);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    const trimmedValue = value.trim();
    if (trimmedValue.length >= 3) {
      debounceTimerRef.current = window.setTimeout(() => {
        handleSearch({
          namaSekolah: value,
          negeri: "ALL",
          jenis: "ALL",
        });
      }, 500);
    } else {
      setLocalSuggestions([]);
    }
  };

  const handleSearchEnter: React.KeyboardEventHandler<HTMLInputElement> = (
    e,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      navigate(`/${lang || "ms"}/carian-sekolah`);
    }
  };

  return (
    // title="Selamat Datang Ke"
    //   homeTitle="Portal Sekolahku"
    <Hero
      title=""
      homeTitle=""
      variant="full"
      search={
        <SearchBar
          query={query}
          setQuery={setQuery}
          handleValueChange={handleValueChange}
          handleSearchEnter={handleSearchEnter}
          suggestions={localSuggestions}
          getKey={(item) => item.kodSekolah ?? ""}
          getLabel={(item) => item.namaSekolah}
          getSubLabel={(item) => item.kodSekolah}
          onSelect={(item) => {
            setQuery(item.namaSekolah ?? "");
            navigate(`/${lang || "ms"}/carian-sekolah`);
          }}
          searchBarTitle="Carian Sekolah"
          singlePageTotal={singlePageTotal}
          dataTotal={dataTotal}
        />
      }
      // links={[{ label: "Pautan Pintas", link: "#pautan" }]}
      // HeroclassName="bg-gradient-to-b from-[#3E7893] via-[#50A1D5] to-[#52A5D6]"
      HeroclassName=""
      background={
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
    />
  );
}
