import ContentHero from "../../components/Hero/ContentHero";
import { AutoPagination } from "@govtechmy/myds-react/pagination";
import {
  ArrowOutgoingIcon,
  SearchIcon,
} from "@govtechmy/myds-react/icon";
import { useEffect, useState, useRef } from "react";
import { getAllTakwim, getSearchTakwim } from "../../services/takwim.svc";
import type { MoeTakwimResource, TakwimItem } from "../../types/takwim";
import SectionItemTakwim, {
  TakwimListItem,
} from "../../components/shared/SectionItemTakwim";
import PdfIconTakwim from "../../icons/pdfIconTakwim";
import HelmetMeta from "../../seo/HelmetMeta";
import { useParams } from "react-router-dom";

export default function Takwim() {
  const [items, setItems] = useState<TakwimItem[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [totalRecord, setTotalRecord] = useState<number>(0);
  const [moeTakwim, setMoeTakwim] = useState<MoeTakwimResource | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [searchSuggestions, setSearchSuggestions] = useState<TakwimItem[]>([]);
  const debounceTimerRef = useRef<number | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchAcara = async () => {
      try {
        const response = debouncedSearchQuery
          ? await getSearchTakwim(pageNumber, debouncedSearchQuery)
          : await getAllTakwim(pageNumber);
        if (response) {
          setItems(response.items ?? []);
          setPageNumber(response.pageNumber ?? 1);
          setPageSize(response.pageSize ?? 12);
          setTotalRecord(response.totalRecords ?? 0);
          setMoeTakwim(response.moeTakwim ?? null);
        }
      } catch (error) {
        console.error("Error fetching takwim:", error);
      }
    };

    fetchAcara();
  }, [pageNumber, debouncedSearchQuery]);

  const handleSearchChange = async (value: string) => {
    setSearchQuery(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmedValue = value.trim();
    if (trimmedValue.length > 0) {
      debounceTimerRef.current = window.setTimeout(() => {
        setDebouncedSearchQuery(value);
      }, 500);

      try {
        const response = await getSearchTakwim(1, value);
        setSearchSuggestions(response?.items?.slice(0, 5) ?? []);
      } catch (error) {
        console.error("Error fetching search suggestions:", error);
        setSearchSuggestions([]);
      }
    } else {
      setSearchSuggestions([]);
      setDebouncedSearchQuery("");
      setPageNumber(1);
    }
  };

  const handleSearchSubmit = () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setSearchSuggestions([]);
    setDebouncedSearchQuery(searchQuery);
    setPageNumber(1);
  };

  const { lang } = useParams<{ lang: string }>();
  const domain = import.meta.env.VITE_DOMAIN_NAME;

  return (
    <>
      <HelmetMeta
        title="Takwim Pendidikan - SekolahKu"
        description="Takwim dan kalendar pendidikan Malaysia. Semak tarikh penting dan acara sekolah."
        canonical={`${domain}/${lang}/takwim`}
      />
      <ContentHero
        search={
          <div className="relative z-30 flex w-full items-center gap-2.5 rounded-[14px] bg-[#F7F8FA] py-2 pl-4 pr-2">
            <SearchIcon className="size-[18px] shrink-0 text-txt-black-500" />
            <input
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearchSubmit();
                }
              }}
              placeholder="Carian Takwim"
              className="min-w-0 flex-1 bg-transparent font-body text-sm text-txt-black-900 outline-none placeholder:text-txt-black-500"
            />
            <button
              type="button"
              onClick={handleSearchSubmit}
              className="flex shrink-0 items-center gap-1.5 rounded-[10px] bg-[#0062FF] px-5 py-2.5 font-body text-[13px] font-bold text-white transition hover:bg-[#0052D6]"
            >
              Cari
              <ArrowOutgoingIcon className="size-3.5" />
            </button>
            {searchQuery.trim().length > 0 && searchSuggestions.length > 0 && (
              <div className="absolute left-0 top-full z-30 mt-1 max-h-[400px] w-full overflow-y-auto rounded-md border border-otl-gray-200 bg-bg-dialog py-1 shadow-context-menu">
                {searchSuggestions.map((item) => (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => {
                      setSearchQuery(item.title ?? "");
                      setSearchSuggestions([]);
                      setDebouncedSearchQuery(item.title ?? "");
                      setPageNumber(1);
                    }}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-body-sm text-txt-black-700 hover:bg-bg-washed"
                  >
                    <span className="line-clamp-2">{item.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        }
      />
      <div className="mx-auto flex-1 px-[18px] md:px-[24px] lg:px-[24px] xl:px-[24px] max-w-[1280px] py-16 flex flex-col">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col">
          {moeTakwim && (
            <TakwimListItem
              href={moeTakwim.url}
              leading={
                <div className="flex h-[60px] w-[52px] shrink-0 items-center justify-center rounded-[10px] bg-bg-white">
                  <PdfIconTakwim className="size-8" />
                </div>
              }
              title={`Muat turun ${moeTakwim.alt || "Kalendar Akademik"} (moe.gov.my)`}
              ariaLabel={`Muat turun ${moeTakwim.alt || "Kalendar Akademik"}`}
            />
          )}

          <SectionItemTakwim dataItemCalendar={items} />

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <AutoPagination
              page={pageNumber}
              limit={pageSize}
              count={totalRecord}
              maxDisplay={4}
              onPageChange={(page) => setPageNumber(page)}
              type="default"
            />
          </div>
        </div>
      </div>
    </>
  );
}
