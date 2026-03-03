import Hero from "../../components/shared/Hero";
import SearchBarMain from "../../components/shared/SearchBar";
import {
  DateRangePicker,
  type DateRange,
} from "@govtechmy/myds-react/daterange-picker";
import { useNavigate, useParams } from "react-router-dom";
import { AutoPagination } from "@govtechmy/myds-react/pagination";
import { useEffect, useState, useRef } from "react";
import { getSiaranList, getSearchSiaran } from "../../services/siaran.svc";
import type { SiaranItem } from "../../models/response";
import Card from "../../components/shared/Cards";
import { formatDate } from "../../utils/dateFormatter";
import { Button } from "@govtechmy/myds-react/button";

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
  const debounceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchSiaran = async () => {
      try {
        const response =
          debouncedSearchQuery ||
          (dateRange?.from != undefined && dateRange?.to != undefined)
            ? await getSearchSiaran(
                pageNumber,
                debouncedSearchQuery,
                dateRange?.from ? dateRange.from.toISOString() : undefined,
                dateRange?.to
                  ? (() => {
                      const endDate = new Date(dateRange.to);
                      endDate.setHours(23, 59, 59, 999);
                      return endDate.toISOString();
                    })()
                  : undefined,
              )
            : await getSiaranList({ pageNumber });
        setItems(response.items);
        setPageNumber(response.pageNumber);
        setPageSize(response.pageSize);
        setTotalRecord(response.totalRecords);
      } catch (error) {
        console.error("Error fetching siaran:", error);
      }
    };

    fetchSiaran();
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
        const response = await getSearchSiaran(1, value);
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

  const handleResetFilters = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    setSearchQuery("");
    setDebouncedSearchQuery("");
    setSearchSuggestions([]);
    setDateRange({ from: undefined, to: undefined });
    setPageNumber(1);
  };

  return (
    <>
      <Hero
        title="Berita KPM"
        variant="full"
        className="h-[350px]"
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
          />
        }
        background={
          <>
            <div className="block lg:hidden h-full w-full bg-[url('/utama/siaran/hero-banner/mobile-sekolahku.svg')] bg-cover bg-center bg-no-repeat" />
            <div className="hidden lg:block h-full w-full bg-[url('/utama/siaran/hero-banner/large-sekolahku.svg')] bg-cover bg-center bg-no-repeat" />
          </>
        }
        filters={
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <DateRangePicker value={dateRange} onValueChange={setDateRange} />
            <Button variant="primary-fill" onClick={handleResetFilters}>
              Set Semula
            </Button>
          </div>
        }
      />
      <div className="mx-auto flex-1 px-[18px] sm:px-[18px] md:px-[24px] lg:px-[24px] xl:px-[24px] max-w-[1280px] py-16 flex flex-col">
        <Card totalPages={totalRecord}>
          <div className="flex flex-col justify-center gap-8">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
              {items?.map((item, index) => {
                if (!item) {
                  return (
                    <div
                      key={`placeholder-${index}`}
                      className="h-[260px] sm:h-[300px] md:h-[354px]"
                    />
                  );
                }
                return (
                  <Card.Item
                    key={item._id}
                    item={{
                      imageSrc: item.imageHero?.url,
                      imageAlt: item.imageHero?.alt,
                      header: "", //item.categoryInfo?.name,
                      headerColor: item.categoryInfo?.colors,
                      date: formatDate(item.articleDate),
                      title: item.title,
                      redirectDesc: "Baca",
                    }}
                    onClick={() => {
                      navigate(`/${lang}/berita-kpm/${item._id}`);
                    }}
                  />
                );
              })}
            </div>
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
          </div>
        </Card>
      </div>
    </>
  );
}
