import Hero from "../../components/shared/Hero";
import SearchBarMain from "../../components/shared/SearchBar";
import { Tag } from "@govtechmy/myds-react/tag";
import {
  DateRangePicker,
  type DateRange,
} from "@govtechmy/myds-react/daterange-picker";
import { useNavigate, useParams } from "react-router-dom";
import { AutoPagination } from "@govtechmy/myds-react/pagination";
import { useEffect, useState, useRef } from "react";
import { getAllTakwim, getSearchTakwim } from "../../services/takwim.svc";
import type { TakwimItem } from "../../types/takwim";
import { formatEventDay, formatEventDateMonth } from "../../utils/date";

export default function Takwim() {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const [items, setItems] = useState<TakwimItem[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [totalRecord, setTotalRecord] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [searchSuggestions, setSearchSuggestions] = useState<TakwimItem[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
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
        const response =
          debouncedSearchQuery ||
          (dateRange?.from != undefined && dateRange?.to != undefined)
            ? await getSearchTakwim(
                pageNumber,
                debouncedSearchQuery,
                dateRange?.from ? dateRange.from.toISOString() : undefined,
                dateRange?.to ? dateRange.to.toISOString() : undefined,
              )
            : await getAllTakwim(pageNumber);
        setItems(response.items);
        setPageNumber(response.pageNumber);
        setPageSize(response.pageSize);
        setTotalRecord(response.totalRecords);
      } catch (error) {
        console.error("Error fetching takwim:", error);
      }
    };

    fetchAcara();
  }, [pageNumber, debouncedSearchQuery, dateRange]);

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
        setSearchSuggestions(response.items.slice(0, 5));
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

  return (
    <>
      <Hero
        title="Takwim Sekolahku"
        variant="full"
        search={
          <SearchBarMain
            query={searchQuery}
            setQuery={setSearchQuery}
            handleValueChange={handleSearchChange}
            suggestions={searchSuggestions}
            getKey={(item) => item._id}
            getLabel={(item) => item.title}
            onSelect={(item: TakwimItem) => {
              navigate(`/${lang}/takwim/${item._id}`);
            }}
          />
        }
        background={
          <>
            <div className="block lg:hidden h-full w-full bg-[url('/utama/siaran/hero-banner/mobile-sekolahku.svg')] bg-cover bg-center bg-no-repeat" />
            <div className="hidden lg:block h-full w-full bg-[url('/utama/siaran/hero-banner/large-sekolahku.svg')] bg-cover bg-center bg-no-repeat" />
          </>
        }
        filters={
          <DateRangePicker value={dateRange} onValueChange={setDateRange} />
        }
      />
      <div className="mx-auto flex-1 px-[18px] md:px-[24px] lg:px-[24px] xl:px-[24px] max-w-[1280px] py-16 flex flex-col">
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 max-[400px]:grid-cols-1 max-sm:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items?.map((item) => (
              <div
                key={item._id}
                className="relative border border-otl-gray-200 rounded-lg h-[350px] flex flex-col overflow-hidden cursor-pointer hover:shadow-lg transition-shadow focus:outline-none focus:ring-[4px] focus:ring-fr-primary"
                aria-label={item.title}
                role="button"
                tabIndex={0}
                onClick={() => {
                  navigate(`/${lang}/takwim/${item._id}`);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/${lang}/takwim/${item._id}`);
                  }
                }}
              >
                {/* Background image */}
                <img
                  src={item.imageHero.url}
                  alt={item.imageHero.alt}
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />

                {/* Background Layer (only half height) */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[linear-gradient(0deg,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0)_100%)]"></div>
                {/* Foreground content */}
                <div className="relative z-10 flex flex-col justify-end h-full text-white p-4">
                  <Tag variant="primary" className="w-fit mb-3">
                    <div>{formatEventDay(item.articleDate)}</div>
                    <div> | </div>
                    <div>{formatEventDateMonth(item.articleDate)}</div>
                  </Tag>
                  <div className="text-txt-white text-body-lg font-semibold">
                    {item.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
