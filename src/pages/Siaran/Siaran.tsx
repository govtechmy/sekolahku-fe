import ContentHero from "../../components/Hero/ContentHero";
import NewsCard from "../../components/shared/NewsCard";
import {
  DateRangePicker,
  type DateRange,
} from "@govtechmy/myds-react/daterange-picker";
import { Button } from "@govtechmy/myds-react/button";
import {
  ArrowOutgoingIcon,
  CrossIcon,
  SearchIcon,
} from "@govtechmy/myds-react/icon";
import { useNavigate, useParams } from "react-router-dom";
import { AutoPagination } from "@govtechmy/myds-react/pagination";
import { useEffect, useState, useRef } from "react";
import { getSiaranList } from "../../services/siaran.svc";
import type { SiaranItem } from "../../models/response";
import HelmetMeta from "../../seo/HelmetMeta";
import { DEMO_BERITA } from "../../data/beritaDemo";

export default function Siaran() {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const [items, setItems] = useState<SiaranItem[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [totalRecord, setTotalRecord] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [searchSuggestions, setSearchSuggestions] = useState<SiaranItem[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const debounceTimerRef = useRef<number | null>(null);
  const searchQueryRef = useRef<string>("");

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  useEffect(() => {
    let ignore = false;
    const fetchSiaran = async () => {
      setIsLoading(true);
      try {
        const startDate = dateRange?.from?.toISOString();
        let endDate: string | undefined;
        if (dateRange?.to) {
          const end = new Date(dateRange.to);
          end.setHours(23, 59, 59, 999);
          endDate = end.toISOString();
        }
        const response = await getSiaranList({
          pageNumber,
          search: debouncedSearchQuery || undefined,
          startDate,
          endDate,
        });
        // Discard superseded responses so a slow earlier request can't
        // overwrite the state of a newer filter/page selection.
        if (ignore) return;
        setItems(response.items);
        setPageSize(response.pageSize);
        setTotalRecord(response.totalRecords);
      } catch (error) {
        if (ignore) return;
        console.error("Error fetching siaran:", error);
        setItems([]);
        setTotalRecord(0);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    fetchSiaran();
    return () => {
      ignore = true;
    };
  }, [pageNumber, debouncedSearchQuery, dateRange]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    searchQueryRef.current = value;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (value.trim().length === 0) {
      setSearchSuggestions([]);
      setDebouncedSearchQuery("");
      setPageNumber(1);
      return;
    }

    // Debounce both the committed query and the suggestion request; only apply
    // suggestions if this is still the latest query when the response lands.
    debounceTimerRef.current = window.setTimeout(async () => {
      setDebouncedSearchQuery(value);
      setPageNumber(1);
      try {
        const response = await getSiaranList({ pageNumber: 1, search: value });
        if (searchQueryRef.current === value) {
          setSearchSuggestions(response.items.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching search suggestions:", error);
        if (searchQueryRef.current === value) setSearchSuggestions([]);
      }
    }, 500);
  };

  const handleSearchSubmit = () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setSearchSuggestions([]);
    setDebouncedSearchQuery(searchQuery);
    setPageNumber(1);
  };

  const domain = import.meta.env.VITE_DOMAIN_NAME;

  const hasActiveFilter =
    !!debouncedSearchQuery ||
    (dateRange?.from != undefined && dateRange?.to != undefined);
  // Dev-only: siaran needs CMS-hosted images, so when the local API returns no
  // news (and no filter is applied) we show sample content in development.
  const useDemo =
    !isLoading && items.length === 0 && !hasActiveFilter && import.meta.env.DEV;
  const displayItems = useDemo ? DEMO_BERITA : items;

  return (
    <>
      <HelmetMeta
        title="Berita KPM - SekolahKu"
        description="Berita dan siaran terkini daripada Kementerian Pendidikan Malaysia."
        canonical={`${domain}/${lang}/berita-kpm`}
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
              placeholder="Carian Berita KPM"
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
                    onClick={() => navigate(`/${lang}/berita-kpm/${item._id}`)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-body-sm text-txt-black-700 hover:bg-bg-washed"
                  >
                    <span className="line-clamp-2">{item.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        }
        filters={
          <div className="flex w-full items-center justify-center gap-2">
            <DateRangePicker
              value={dateRange}
              onValueChange={(v) => {
                setDateRange(v);
                setPageNumber(1);
              }}
              locale="ms"
              placeholder="Pilih Tarikh"
              aria-label="Julat tarikh"
            />
            {dateRange?.from && (
              <Button
                onClick={() => {
                  setDateRange(undefined);
                  setPageNumber(1);
                }}
                variant="default-outline"
                className="p-1.5"
                aria-label="Kosongkan julat tarikh"
              >
                <CrossIcon className="size-4" />
              </Button>
            )}
          </div>
        }
      />

      <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col px-[18px] py-16 md:px-[24px]">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="flex flex-col overflow-hidden rounded-2xl border border-otl-gray-200"
              >
                <div className="aspect-[16/9] w-full animate-pulse bg-bg-gray-100" />
                <div className="flex flex-col gap-3 p-4">
                  <div className="h-3 w-24 animate-pulse rounded bg-bg-gray-100" />
                  <div className="h-4 w-full animate-pulse rounded bg-bg-gray-100" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : displayItems.length === 0 ? (
          <div className="flex min-h-[240px] flex-col items-center justify-center gap-2 text-center">
            <p className="font-heading text-body-lg font-bold text-txt-black-900">
              Tiada berita ditemui
            </p>
            <p className="text-body-sm text-txt-black-500">
              Cuba ubah kata carian atau julat tarikh.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {displayItems.map((item) => (
                <NewsCard key={item._id} item={item} lang={lang} />
              ))}
            </div>
            {!useDemo && totalRecord > 0 && (
              <div className="flex justify-center">
                <AutoPagination
                  page={pageNumber}
                  limit={pageSize}
                  count={totalRecord}
                  maxDisplay={4}
                  onPageChange={(page) => setPageNumber(page)}
                  type="default"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
