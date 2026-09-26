import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ArrowForwardIcon,
  SearchIcon,
  BookIcon,
} from "@govtechmy/myds-react/icon";
import HelmetMeta from "../seo/HelmetMeta";
import PageContainer from "../components/layout/PageContainer";
import BantuanCard from "../components/shared/BantuanCard";
import { getBantuanList } from "../services/bantuan.svc";
import type { BantuanListItem } from "../models/response";

export default function BantuanPersekolahan() {
  const { lang } = useParams<{ lang: string }>();
  const domain = import.meta.env.VITE_DOMAIN_NAME;

  const [items, setItems] = useState<BantuanListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const debounceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  useEffect(() => {
    let ignore = false;
    const fetchList = async () => {
      setIsLoading(true);
      try {
        const response = await getBantuanList(debouncedQuery || undefined);
        if (ignore) return;
        setItems(response.items);
      } catch (error) {
        if (ignore) return;
        console.error("Error fetching bantuan list:", error);
        setItems([]);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    fetchList();
    return () => {
      ignore = true;
    };
  }, [debouncedQuery]);

  const handleSearchChange = (value: string) => {
    setQuery(value);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = window.setTimeout(() => {
      setDebouncedQuery(value);
    }, 500);
  };

  const handleSearchSubmit = () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setDebouncedQuery(query);
  };

  return (
    <>
      <HelmetMeta
        title="Bantuan Persekolahan - SekolahKu"
        description="Senarai bantuan persekolahan dan pembelajaran daripada Kementerian Pendidikan Malaysia."
        canonical={`${domain}/${lang}/bantuan-persekolahan`}
      />

      {/* Hero */}
      <section className="relative overflow-hidden rounded-b-[32px] bg-[#EAF2FE]">
        <div className="absolute inset-0 bg-[url('/utama/Bantuan.png')] bg-cover bg-[position:center_70%] bg-no-repeat" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(75% 60% at 50% 16%, #FFFFFFEB 0%, #FFFFFFBF 50%, #FFFFFF00 100%), linear-gradient(0deg, #FFFFFF 0%, #FFFFFFD9 8%, #FFFFFF00 30%, #FFFFFF00 100%)",
          }}
        />
        <div className="relative mx-auto flex min-h-[623px] max-w-[1280px] flex-col items-center gap-5 px-[18px] pb-24 pt-28 text-center md:px-6">
          <div className="flex flex-col items-center gap-1">
            <span className="font-body text-xs font-bold tracking-[1.5px] text-[#0B4FCC]">
              BANTUAN PERSEKOLAHAN DAN PEMBELAJARAN
            </span>
            <h1 className="font-heading text-[32px] font-extrabold leading-tight text-[#0A1930] md:text-[38px]">
              Bantuan Persekolahan
            </h1>
          </div>

          <div className="w-full max-w-[760px] rounded-[20px] border border-[#DCE6F5] bg-white p-5 shadow-xl">
            <div className="flex w-full items-center gap-2.5 rounded-[14px] bg-[#F7F8FA] py-2 pl-4 pr-2">
              <SearchIcon className="size-[18px] shrink-0 text-txt-black-500" />
              <input
                value={query}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearchSubmit();
                  }
                }}
                placeholder="Cari bantuan persekolahan..."
                className="min-w-0 flex-1 bg-transparent font-body text-sm text-txt-black-900 outline-none placeholder:text-txt-black-500"
              />
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="flex shrink-0 items-center gap-1.5 rounded-[10px] bg-[#0062FF] px-5 py-2.5 font-body text-[13px] font-bold text-white transition hover:bg-[#0052D6]"
              >
                Cari
                <ArrowForwardIcon className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <PageContainer className="px-[18px] md:px-6">
        <div className="flex flex-col gap-8 py-12">
          <div className="flex flex-col gap-1.5">
            <span className="font-body text-xs font-bold tracking-[1.5px] text-[#0062FF]">
              BANTUAN PERSEKOLAHAN DAN PEMBELAJARAN
            </span>
            <h2 className="font-heading text-2xl font-bold text-txt-black-900 md:text-[28px]">
              {items.length} Program Bantuan Tersedia
            </h2>
            <p className="font-body text-sm text-txt-black-500">
              Senarai bantuan persekolahan dan pembelajaran daripada Kementerian
              Pendidikan. Klik mana-mana kad untuk ke maklumat rasmi.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="h-[232px] animate-pulse rounded-2xl bg-bg-gray-100"
                />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="font-body text-sm text-txt-black-500">
              Tiada program dijumpai.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <BantuanCard key={item.slug} item={item} lang={lang} />
              ))}
            </div>
          )}

          <section className="flex gap-5 rounded-2xl border border-otl-divider bg-bg-white p-6">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[#E7EAF1]">
              <BookIcon className="size-5 text-[#16284F]" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="font-heading text-base font-bold text-txt-black-900">
                Rujukan
              </h2>
              <p className="font-body text-xs leading-[1.5] text-txt-black-500">
                Senarai program di halaman ini diadaptasi daripada portal rasmi
                moe.gov.my. Klik mana-mana kad untuk maklumat lanjut.
              </p>
              <a
                href="https://www.malaysia.gov.my/my/categories/sekolah--pendidikan/penajaan-dan-bantuan-kewangan"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1.5 font-body text-xs font-bold text-[#0062FF] hover:underline"
              >
                <ArrowForwardIcon className="size-3.5" />
                Bantuan Persekolahan dan Pembelajaran — moe.gov.my
              </a>
            </div>
          </section>
        </div>
      </PageContainer>
    </>
  );
}
