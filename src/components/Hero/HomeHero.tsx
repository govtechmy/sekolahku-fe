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

  return (
    <Hero
      title="Selamat Datang Ke Portal Sekolahku"
      search={
        <SearchBar
          query={query}
          setQuery={setQuery}
          handleValueChange={handleValueChange}
          suggestions={localSuggestions}
          getKey={(item) => item.kodSekolah ?? ""}
          getLabel={(item) => item.namaSekolah}
          onSelect={(item) => {
            setQuery(item.namaSekolah ?? "");
            navigate(`/${lang || "ms"}/carian-sekolah`);
          }}
        />
      }
      links={[{ label: "Pautan Pantas", link: "#pautan" }]}
      HeroclassName="bg-gradient-to-b from-[#E6F0FF] via-[#F2F7FF] to-[#FFFFFF]"
      background={
        <>
          <div className="block lg:hidden h-full w-full bg-[url('/utama/home-hero-mobile.svg')] bg-cover bg-center bg-no-repeat" />
          <div className="hidden lg:block h-full w-full bg-[url('/utama/sekolahku.png')] bg-cover bg-center bg-no-repeat" />
        </>
      }
    />
  );
}
