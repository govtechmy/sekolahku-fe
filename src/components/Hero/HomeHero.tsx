import { useNavigate, useParams } from "react-router-dom";
import { useMapViewStore } from "../../store/mapView";
import SearchBar from "../shared/SearchBar";
import { SimpleSelect, SimpleSelectItem } from "../shared/SelectComponent";
import { useRef, useState } from "react";
import { buildSchoolSearchPath } from "../../utils/schoolSearchUrl";
import { NEGERI_LIST } from "../../contentData";
import { SCHOOL_TYPE_LABELS } from "../../constants/schoolTypes";
import underScoreRemover from "../../utils/underscoreRemover";

const PERINGKAT_OPTIONS: [string, string][] = [
  ["RENDAH", "Rendah"],
  ["MENENGAH", "Menengah"],
];

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
  const isLoadingLocalSuggestions = useMapViewStore(
    (state) => state.isLoadingLocalSuggestions,
  );
  const debounceTimerRef = useRef<number | null>(null);

  const [negeri, setNegeri] = useState("ALL");
  const [peringkat, setPeringkat] = useState("ALL");
  const [jenis, setJenis] = useState("ALL");

  const handleValueChange = (value: string) => {
    setQuery(value);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    const trimmedValue = value.trim();
    if (trimmedValue.length >= 3) {
      debounceTimerRef.current = window.setTimeout(() => {
        handleSearch({ namaSekolah: value, negeri: "ALL", jenis: "ALL" });
      }, 500);
    } else {
      setLocalSuggestions([]);
    }
  };

  const goSearch = (q: string) =>
    navigate(buildSchoolSearchPath(lang, q, { negeri, peringkat, jenis }));

  const handleSearchEnter: React.KeyboardEventHandler<HTMLInputElement> = (
    e,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goSearch(query);
    }
  };

  return (
    <section className="relative flex min-h-[560px] items-center justify-center">
      {/* Background image with a dark navy wash so the headline reads on top.
          overflow-hidden lives here (not the section) so the rounded corners
          clip the bg without clipping the search dropdowns. */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-b-[32px]">
        <div className="absolute inset-0 scale-105 bg-[url('/utama/hero.png')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220]/[.91] from-0% to-[#0B1220]/[.08] to-70%" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[860px] flex-col items-center gap-5 px-5 pt-16 pb-32 text-center">
        {/* Title */}
        <h1 className="m-0 flex flex-col items-center gap-0.5">
          <span className="font-heading text-[22px] font-bold leading-tight text-white">
            Selamat Datang ke
          </span>
          <span
            className="font-heading text-4xl font-extrabold leading-tight md:text-[38px]"
            style={{ color: "#F0B429" }}
          >
            PORTAL SEKOLAHKU
          </span>
        </h1>

        {/* Search card. relative z-20 keeps its suggestion/select dropdowns
            above the stats cards (z-10) that overlap the hero's bottom edge. */}
        <div className="relative z-20 flex w-full max-w-[760px] flex-col gap-3.5 rounded-[20px] bg-bg-white p-5 shadow-xl">
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
              const selectedQuery = item.namaSekolah ?? "";
              setQuery(selectedQuery);
              goSearch(selectedQuery);
            }}
            searchBarTitle="Carian Sekolah"
            singlePageTotal={singlePageTotal}
            dataTotal={dataTotal}
            isSearchingBackend={isLoadingLocalSuggestions}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5 text-left">
              <label
                htmlFor="hero-filter-negeri"
                className="font-body text-[10px] font-bold tracking-[0.5px] text-txt-black-500"
              >
                Negeri / Wilayah
              </label>
              <SimpleSelect
                id="hero-filter-negeri"
                size="medium"
                variant="outline"
                value={negeri}
                onValueChange={setNegeri}
                placeholder="Negeri / Wilayah"
                className="w-full"
              >
                <SimpleSelectItem value="ALL">Semua Negeri</SimpleSelectItem>
                {NEGERI_LIST.map((n) => (
                  <SimpleSelectItem key={n} value={n}>
                    {underScoreRemover(n)}
                  </SimpleSelectItem>
                ))}
              </SimpleSelect>
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label
                htmlFor="hero-filter-peringkat"
                className="font-body text-[10px] font-bold tracking-[0.5px] text-txt-black-500"
              >
                Peringkat Persekolahan
              </label>
              <SimpleSelect
                id="hero-filter-peringkat"
                size="medium"
                variant="outline"
                value={peringkat}
                onValueChange={setPeringkat}
                placeholder="Peringkat Persekolahan"
                className="w-full"
              >
                <SimpleSelectItem value="ALL">Semua Peringkat</SimpleSelectItem>
                {PERINGKAT_OPTIONS.map(([value, label]) => (
                  <SimpleSelectItem key={value} value={value}>
                    {label}
                  </SimpleSelectItem>
                ))}
              </SimpleSelect>
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label
                htmlFor="hero-filter-jenis"
                className="font-body text-[10px] font-bold tracking-[0.5px] text-txt-black-500"
              >
                Jenis Aliran
              </label>
              <SimpleSelect
                id="hero-filter-jenis"
                size="medium"
                variant="outline"
                value={jenis}
                onValueChange={setJenis}
                placeholder="Jenis Aliran"
                className="w-full"
              >
                <SimpleSelectItem value="ALL">Semua Jenis</SimpleSelectItem>
                {Object.entries(SCHOOL_TYPE_LABELS).map(([value, label]) => (
                  <SimpleSelectItem key={value} value={value}>
                    {label}
                  </SimpleSelectItem>
                ))}
              </SimpleSelect>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
