import ContentHero from "../../components/Hero/ContentHero";
import SearchBarMain from "../../components/shared/SearchBar";
import { AutoPagination } from "@govtechmy/myds-react/pagination";
import { useEffect, useState, useRef } from "react";
import { getAllTakwim, getSearchTakwim } from "../../services/takwim.svc";
import type { TakwimItem } from "../../types/takwim";
import SectionItemTakwim from "../../components/shared/SectionItemTakwim";
import HelmetMeta from "../../seo/HelmetMeta";
import { useParams } from "react-router-dom";

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
        title="Takwim Pendidikan"
        highlight="KEMENTERIAN PENDIDIKAN"
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
