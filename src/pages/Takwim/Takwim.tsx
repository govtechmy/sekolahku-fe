import Hero from "../../components/shared/Hero";
import SearchBarMain from "../../components/shared/SearchBar";
import { AutoPagination } from "@govtechmy/myds-react/pagination";
import { useEffect, useState, useRef } from "react";
import { getAllTakwim, getSearchTakwim } from "../../services/takwim.svc";
import type { TakwimItem } from "../../types/takwim";
import SectionItemTakwim from "../../components/shared/SectionItemTakwim";

export default function Takwim() {
  const [items, setItems] = useState<TakwimItem[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [totalRecord, setTotalRecord] = useState<number>(0);
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

  return (
    <>
      <Hero
        title=""
        className="h-[350px]"
        variant="full"
        search={
          <SearchBarMain
            query={searchQuery}
            setQuery={setSearchQuery}
            handleValueChange={handleSearchChange}
            suggestions={searchSuggestions}
            getKey={(item) => item._id}
            getLabel={(item) => item.title ?? "Untitled"}
            searchBarTitle="Carian Takwim"
          />
        }
        background={
          // <>
          //   <div className="block lg:hidden h-full w-full bg-[url('/utama/siaran/hero-banner/mobile-sekolahku.svg')] bg-cover bg-center bg-no-repeat" />
          //   <div className="hidden lg:block h-full w-full bg-[url('/utama/siaran/hero-banner/large-sekolahku.svg')] bg-cover bg-center bg-no-repeat" />
          // </>
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
      <div className="mx-auto flex-1 px-[18px] md:px-[24px] lg:px-[24px] xl:px-[24px] max-w-[1280px] py-16 flex flex-col">
        <div className="flex flex-col gap-8">
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
