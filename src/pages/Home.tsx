import SectionItemNews from "../components/shared/SectionItemNews";
import SectionHeader from "../components/shared/SectionHeader";
import SectionItemLinks from "../components/shared/SectionItemLinks";
import type { AnalyticsModel, SiaranItem } from "../models/response";
import { dataItemLinks } from "../contentData";
import { useEffect, useRef, useState } from "react";
import HomeHero from "../components/Hero/HomeHero";
import { getAllTakwim } from "../services/takwim.svc";
import type { TakwimItem } from "../types/takwim";
import { useNavigate, useParams } from "react-router-dom";
import { getSiaranList } from "../services/siaran.svc";
import SectionItemTakwim from "../components/shared/SectionItemTakwim";
import SectionItemAnalytics from "../components/shared/SectionItemAnalytics";
import SectionItemStats from "../components/shared/SectionItemStats";
import { getAnalytics } from "../services/analytics.svc";
import { formatFileVersion } from "../utils/fileVersionFormat";
import HelmetMeta from "../seo/HelmetMeta";
import { DEMO_BERITA } from "../data/beritaDemo";
import { ArrowForwardIcon } from "@govtechmy/myds-react/icon";

export default function HomePage() {
  const [analytics, setAnalytics] = useState<AnalyticsModel | null>(null);
  //later add loading for all , check design
  const [dataItemCalendar, setDataItemCalendar] = useState<TakwimItem[]>();
  const [dataItemNews, setDataItemNews] = useState<SiaranItem[]>();
  const inputRef = useRef<HTMLInputElement>(null!);
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      }
    };

    const fetchTakwim = async () => {
      try {
        const data = await getAllTakwim();
        setDataItemCalendar(data.items.slice(0, 5)); // Get only the first 5 items for the homepage
      } catch (error) {
        console.error("Error fetching Takwim:", error);
      }
    };

    const fetchSiaran = async () => {
      try {
        const data = await getSiaranList();
        setDataItemNews(data.items);
      } catch (error) {
        console.error("Error fetching Siaran:", error);
      }
    };

    fetchSiaran();
    fetchTakwim();
    fetchAnalytics();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Avoid triggering when typing in inputs
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isTyping) return;

      if (e.key === "/") {
        e.preventDefault(); // stop browser quick-find
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const domain = import.meta.env.VITE_DOMAIN_NAME;

  // Dev-only: news needs CMS-hosted images, so when the local API returns no
  // siaran we fall back to sample content in development only.
  const newsToShow =
    dataItemNews && dataItemNews.length > 0
      ? dataItemNews
      : import.meta.env.DEV
        ? DEMO_BERITA
        : dataItemNews;

  return (
    <div>
      <HelmetMeta
        title="SekolahKu - Portal Maklumat Sekolah Malaysia"
        description="Portal rasmi untuk maklumat sekolah di seluruh Malaysia. Cari sekolah, lihat berita KPM, dan akses takwim pendidikan."
        canonical={`${domain}/${lang}/home`}
      />
      <HomeHero />

      {/* EMIS figures overlap the bottom of the rounded hero, like the mockup */}
      {analytics && (
        <div className="relative z-10 mx-auto w-full max-w-[1328px] px-4 md:px-[24px] -mt-20 md:-mt-24">
          <SectionItemStats analytics={analytics} />
        </div>
      )}

      <div className="mx-auto flex-1 px-0 md:px-[24px] lg:px-[24px] xl:px-[24px] max-w-[1328px] pt-12 pb-16 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] gap-12 lg:gap-8 xl:gap-10">
          {/* Left column: Berita, then Pautan Pantas + Takwim */}
          <div className="flex flex-col gap-12">
            {newsToShow && newsToShow.length > 0 && (
              <SectionHeader
                header="PEMBERITAHUAN TERKINI"
                title="Berita & Pengumuman KPM"
                isLastSection={true}
                className="lg:px-0"
                headerAction={
                  <button
                    type="button"
                    onClick={() => navigate(`/${lang}/berita-kpm`)}
                    className="flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-body-sm font-semibold text-txt-black-900 transition-colors hover:bg-bg-gray-50 focus:outline-primary-200"
                  >
                    Semua Berita
                    <ArrowForwardIcon className="size-4" />
                  </button>
                }
                children={
                  <SectionItemNews
                    dataItemNews={newsToShow}
                    redirectDesc="Baca seterusnya"
                    mainTitleClassName="mb-0"
                  />
                }
              />
            )}

            <div className="grid grid-cols-1 px-4 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)] gap-6 lg:px-0">
              <div id="pautan" className="flex flex-col gap-3">
                <h2 className="font-heading text-body-lg font-bold text-txt-black-900">
                  Pautan Pantas
                </h2>
                <SectionItemLinks dataItemLinks={dataItemLinks} />
              </div>

              {dataItemCalendar && dataItemCalendar.length > 0 && (
                <div className="flex flex-col gap-2.5">
                  <h2 className="font-heading text-body-lg font-bold text-txt-black-900">
                    Kalendar Aktiviti Persekolahan
                  </h2>
                  <SectionItemTakwim dataItemCalendar={dataItemCalendar} />
                  <button
                    type="button"
                    onClick={() => navigate(`/${lang}/takwim`)}
                    className="w-fit text-body-sm font-semibold text-[#0062FF] hover:underline focus:outline-primary-200"
                  >
                    Lihat Seluruh Takwim Tahunan &gt;
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right column: Analitik */}
          <div className="flex flex-col">
            {analytics && (
              <SectionHeader
                header="ANALITIK"
                title="Statistik Sekolah di Malaysia"
                subTitle={formatFileVersion(analytics?.fileVersion)}
                sourceBtn={true}
                isLastSection={true}
                className="lg:px-0"
                children={<SectionItemAnalytics analytics={analytics} />}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
