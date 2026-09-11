import ContentHero from "../../components/Hero/ContentHero";
import SearchBarMain from "../../components/shared/SearchBar";
import NewsCard from "../../components/shared/NewsCard";
import {
  SimpleSelect,
  SimpleSelectItem,
} from "../../components/shared/SelectComponent";
import {
  DateRangePicker,
  type DateRange,
} from "@govtechmy/myds-react/daterange-picker";
import { useNavigate, useParams } from "react-router-dom";
import { AutoPagination } from "@govtechmy/myds-react/pagination";
import { useEffect, useState, useRef } from "react";
import { getSiaranList, getSiaranCategories } from "../../services/siaran.svc";
import type { SiaranItem, SiaranCategory } from "../../models/response";
import HelmetMeta from "../../seo/HelmetMeta";
import { DEMO_BERITA } from "../../data/beritaDemo";

const ALL = "ALL";

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
  const [category, setCategory] = useState<string>(ALL);
  const [categories, setCategories] = useState<SiaranCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const debounceTimerRef = useRef<number | null>(null);
  const searchQueryRef = useRef<string>("");

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  useEffect(() => {
    getSiaranCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
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
          category: category !== ALL ? category : undefined,
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
  }, [pageNumber, debouncedSearchQuery, dateRange, category]);

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

  const domain = import.meta.env.VITE_DOMAIN_NAME;

  const hasActiveFilter =
    !!debouncedSearchQuery ||
    category !== ALL ||
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
        title="Berita & Pengumuman"
        highlight="KEMENTERIAN PENDIDIKAN"
        search={
          <SearchBarMain
            query={searchQuery}
            setQuery={setSearchQuery}
            handleValueChange={handleSearchChange}
            suggestions={searchSuggestions}
            getKey={(item) => item._id}
            getLabel={(item) => item.title}
            onSelect={(item: SiaranItem) => {
              navigate(`/${lang}/berita-kpm/${item._id}`);
            }}
            searchBarTitle="Carian Berita KPM"
          />
        }
        filters={
          <>
            <SimpleSelect
              size="medium"
              variant="outline"
              value={category}
              onValueChange={(v) => {
                setCategory(v);
                setPageNumber(1);
              }}
              placeholder="Kategori Berita"
              aria-label="Kategori berita"
              className="w-full"
            >
              <SimpleSelectItem value={ALL}>Semua Kategori</SimpleSelectItem>
              {categories.map((cat) => (
                <SimpleSelectItem key={cat._id} value={cat.value}>
                  {cat.name}
                </SimpleSelectItem>
              ))}
            </SimpleSelect>
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
          </>
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
              Cuba ubah kata carian, kategori, atau julat tarikh.
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
