import { useNavigate, useParams } from "react-router-dom";
import { useMapViewStore } from "../../store/mapView";
import SearchBar from "../shared/SearchBar";
import { SimpleSelect, SimpleSelectItem } from "../shared/SelectComponent";
import { useRef, useState } from "react";
import { buildSchoolSearchPath } from "../../utils/schoolSearchUrl";
import { NEGERI_LIST } from "../../contentData";
import { SCHOOL_TYPE_LABELS } from "../../constants/schoolTypes";
import underScoreRemover from "../../utils/underscoreRemover";

const QUICK_SEARCHES = [
  "SK Putrajaya Presint 8(1)",
  "SMK Aminuddin Baki",
  "SJK (C) Chung Hwa",
];

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
        <div className="absolute inset-0 scale-105 bg-[url('/utama/hero.jpg')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1930]/85 via-[#0A1930]/80 to-[#0A1930]/90" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[860px] flex-col items-center gap-6 px-5 pt-16 pb-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5">
          <span
            className="size-1.5 rounded-full"
            style={{ backgroundColor: "#F0B429" }}
          />
          <span className="font-body text-body-xs font-medium text-white">
            Pusat Maklumat Pendidikan Kebangsaan
          </span>
        </div>

        {/* Title */}
        <div className="flex flex-col items-center gap-1">
          <span className="font-heading text-3xl font-semibold leading-tight text-white md:text-[34px]">
            Selamat Datang ke
          </span>
          <span
            className="font-heading text-4xl font-bold leading-tight tracking-wide md:text-[42px]"
            style={{ color: "#F0B429" }}
          >
            PORTAL SEKOLAHKU
          </span>
        </div>

        {/* Subtitle */}
        <p className="max-w-[640px] font-body text-body-md text-[#D9E8F6]">
          Gerbang maklumat komprehensif profil institusi persekolahan, statistik
          semasa, takwim akademik, dan perkhidmatan digital KPM di seluruh
          Malaysia.
        </p>

        {/* Search card. relative z-20 keeps its suggestion/select dropdowns
            above the stats cards (z-10) that overlap the hero's bottom edge. */}
        <div className="relative z-20 flex w-full max-w-[760px] flex-col gap-3 rounded-2xl bg-bg-white p-4 shadow-xl">
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

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <SimpleSelect
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

            <SimpleSelect
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

            <SimpleSelect
              size="medium"
              variant="outline"
              value={jenis}
              onValueChange={setJenis}
              placeholder="Jenis Aliran"
              className="w-full"
            >
              <SimpleSelectItem value="ALL">Semua Aliran</SimpleSelectItem>
              {Object.entries(SCHOOL_TYPE_LABELS).map(([value, label]) => (
                <SimpleSelectItem key={value} value={value}>
                  {label}
                </SimpleSelectItem>
              ))}
            </SimpleSelect>
          </div>
        </div>

        {/* Quick searches */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="font-body text-body-xs text-[#AFCBE8]">
            Carian Pantas:
          </span>
          {QUICK_SEARCHES.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                setQuery(label);
                goSearch(label);
              }}
              className="rounded-full bg-white/10 px-3 py-1 font-body text-body-xs text-white transition-colors hover:bg-white/20"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
