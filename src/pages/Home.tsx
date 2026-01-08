import SectionItemNews from "../components/shared/SectionItemNews";
import SectionHeader from "../components/shared/SectionHeader";
import SectionItemAnalytics from "../components/shared/SectionItemAnalytics";
import SectionItemLinks from "../components/shared/SectionItemLinks";
import { getAnalytics } from "../services/analytics.svc";
import type { AnalyticsModel, SiaranItem } from "../models/response";
import { dataItemLinks } from "../contentData";
import { useEffect, useRef, useState } from "react";
import HomeHero from "../components/Hero/HomeHero";
import { getAllAcara } from "../services/acara.svc";
import SectionItemCalendar from "../components/shared/SectionItemCalendar";
import type { AcaraItem } from "../types/acara";
import { useParams } from "react-router-dom";
import { getSiaranList } from "../services/siaran.svc";

export default function HomePage() {
  const [analytics, setAnalytics] = useState<AnalyticsModel | null>(null);
  //later add loading for all , check design
  const [dataItemCalendar, setDataItemCalendar] = useState<AcaraItem[]>();
  const [dataItemNews, setDataItemNews] = useState<SiaranItem[]>();
  const inputRef = useRef<HTMLInputElement>(null!);
  const { lang } = useParams<{ lang: string }>();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      }
    };

    const fetchAcara = async () => {
      try {
        const data = await getAllAcara();
        setDataItemCalendar(data.items);
      } catch (error) {
        console.error("Error fetching Acara:", error);
      }
    };

    const fetchSiaran = async () => {
      try {
        const data = await getSiaranList();
        setDataItemNews(data.items);
      } catch (error) {
        console.error("Error fetching Acara:", error);
      }
    };

    fetchSiaran();
    fetchAcara();
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

  return (
    <div>
      <HomeHero />
      <div className="mx-auto flex-1 px-0 md:px-[24px] lg:px-[24px] xl:px-[24px] max-w-[1328px] py-16 flex flex-col">
        {/* design loading for this */}
        {dataItemNews && (
          <SectionHeader
            header="SIARAN"
            ButtonLabel="Semua Berita"
            children={
              <SectionItemNews
                dataItemNews={dataItemNews}
                mainTitle="Apa yang Sedang Berlaku di Sekolah-sekolah Malaysia"
                redirectDesc="Baca"
              />
            }
          />
        )}

        {/* design loading for this  */}
        {dataItemCalendar && (
          <SectionHeader
            header="KALENDAR"
            children={
              <SectionItemCalendar
                dataItemCalendar={dataItemCalendar}
                mainTitle="Majlis yang bakal disambut tahun ini"
                lang={lang}
              />
            }
            ButtonLabel="Semua Acara"
          />
        )}

        {/* design loading for this  */}
        {analytics && (
          <SectionHeader
            header="ANALITIK"
            title="Fakta Menarik Sekolah di Malaysia"
            children={<SectionItemAnalytics analytics={analytics} />}
          />
        )}

        <div id="pautan">
          {/* design loading for this, hardcoded atm  */}
          <SectionHeader
            header="PAUTAN PANTAS"
            title="Pautan Popular bagi guru, pelajar dan ibu bapa"
            children={<SectionItemLinks dataItemLinks={dataItemLinks} />}
          />
        </div>

        {/* <Statistic
        yearlyData={statisticYearlyData}
        chartBaseData={chartBaseData}
      /> */}
      </div>
    </div>
  );
}
