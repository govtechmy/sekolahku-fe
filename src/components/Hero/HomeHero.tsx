import { useNavigate, useParams } from "react-router-dom";
import { useMapViewStore } from "../../store/mapView";
import { SimpleSelect, SimpleSelectItem } from "../shared/SelectComponent";
import { SearchIcon, ArrowOutgoingIcon } from "@govtechmy/myds-react/icon";
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
      {/* Light background: line-art school illustration washed out under a
          soft gradient so the headline and card read on top. overflow-hidden
          lives here (not the section) so the rounded corners clip the bg
          without clipping the search dropdowns. */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-b-[32px] bg-[#F7F8FA]">
        <div className="absolute inset-0 bg-[url('/utama/hero-portal-sekolahku.png')] bg-cover bg-bottom bg-no-repeat" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #FFFFFFC4 0%, #FFFFFF4D 50%, #FFFFFFF7 90%)",
          }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-[860px] flex-col items-center gap-5 px-5 pt-16 pb-32 text-center">
        {/* Title */}
        <h1 className="m-0 flex flex-col items-center gap-0.5">
          <span
            className="font-body text-xs font-bold leading-tight tracking-[1.5px]"
            style={{ color: "#0B4FCC" }}
          >
            SELAMAT DATANG KE
          </span>
          <span
            className="font-heading text-4xl font-extrabold leading-tight md:text-[38px]"
            style={{ color: "#0A1930" }}
          >
            PORTAL SEKOLAHKU
          </span>
        </h1>

        {/* Search card. relative z-20 keeps its suggestion/select dropdowns
            above the stats cards (z-10) that overlap the hero's bottom edge. */}
        <div className="relative z-20 flex w-full max-w-[760px] flex-col gap-3.5 rounded-[20px] border border-[#DCE6F5] bg-white p-5 shadow-xl">
          {/* relative z-30 lifts the search suggestions dropdown above the
              filter row below it (which comes later in the DOM). */}
          <div className="relative z-30 flex w-full items-center gap-2.5 rounded-[14px] bg-[#F7F8FA] py-2 pl-4 pr-2">
            <SearchIcon className="size-[18px] shrink-0 text-txt-black-500" />
            <input
              value={query}
              onChange={(e) => handleValueChange(e.target.value)}
              onKeyDown={handleSearchEnter}
              placeholder="Masukkan Nama Sekolah, Kod Sekolah (cth: WBA0001), atau Lokasi..."
              className="min-w-0 flex-1 bg-transparent font-body text-sm text-txt-black-900 outline-none placeholder:text-txt-black-500"
            />
            <button
              type="button"
              onClick={() => goSearch(query)}
              className="flex shrink-0 items-center gap-1.5 rounded-[10px] bg-[#0062FF] px-5 py-2.5 font-body text-[13px] font-bold text-white transition hover:bg-[#0052D6]"
            >
              Cari
              <ArrowOutgoingIcon className="size-3.5" />
            </button>
            {isLoadingLocalSuggestions === false &&
              query.trim().length >= 3 &&
              localSuggestions.length > 0 && (
                <div className="absolute left-0 top-full z-30 mt-1 max-h-[400px] w-full overflow-y-auto rounded-md border border-otl-gray-200 bg-bg-dialog py-1 shadow-context-menu">
                  {localSuggestions.map((item) => (
                    <button
                      key={item.kodSekolah ?? item.namaSekolah}
                      type="button"
                      onClick={() => {
                        const selectedQuery = item.namaSekolah ?? "";
                        setQuery(selectedQuery);
                        goSearch(selectedQuery);
                      }}
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-body-sm text-txt-black-700 hover:bg-bg-washed"
                    >
                      <span className="line-clamp-2">
                        {item.namaSekolah}
                        {item.kodSekolah ? ` ${item.kodSekolah}` : ""}
                      </span>
                    </button>
                  ))}
                </div>
              )}
          </div>

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
