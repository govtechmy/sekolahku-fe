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
import { getAnalytics } from "../services/analytics.svc";

//all statistic are commented out and removed the imported analytics, will add later once confirmed later,

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
        setDataItemCalendar(data.items);
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

  return (
    <div>
      <HomeHero />
      <div className="mx-auto flex-1 px-0 md:px-[24px] lg:px-[24px] xl:px-[24px] max-w-[1328px] py-16 flex flex-col">
        {/* design loading for this */}
        {dataItemNews && dataItemNews.length > 0 && (
          <SectionHeader
            header="BERITA KPM"
            ButtonLabel="Semua Berita"
            ButtonClickHandler={() => navigate(`/${lang}/berita-kpm`)}
            children={
              <SectionItemNews
                dataItemNews={dataItemNews}
                redirectDesc="Baca"
                mainTitleClassName="mb-0"
              />
            }
          />
        )}

        {dataItemCalendar && dataItemCalendar.length > 0 && (
          <SectionHeader
            header="TAKWIM/KALENDAR"
            classNameHeader="mb-12"
            ButtonLabel="Lihat Semua"
            buttonLabelClassName="flex justify-end"
            ButtonClickHandler={() => navigate(`/${lang}/takwim`)}
            arrowIconDisplay={false}
          >
            <SectionItemTakwim
              dataItemCalendar={dataItemCalendar}
              lang={lang}
            />
          </SectionHeader>
        )}

        {/* design loading for this  */}
        {/* {dataItemCalendar && dataItemCalendar.length > 0 && (
          <SectionHeader
            header="TAKWIM"
            ButtonLabel="Semua Takwim"
            ButtonClickHandler={() => navigate(`/${lang}/takwim`)}
            children={
              <SectionItemCalendar
                dataItemCalendar={dataItemCalendar}
                mainTitle="Yang bakal disambut tahun ini"
                lang={lang}
              />
            }
          />
        )} */}

        {/* design loading for this  */}
        {analytics && (            <SectionHeader
              header="ANALITIK"
              title="Fakta Menarik Sekolah di Malaysia"
              subTitle={analytics.lastUpdatedAt || "Tiada Maklumat"}
              children={<SectionItemAnalytics analytics={analytics} />}
            />
        )}

        <div id="pautan">
          {/* design loading for this, hardcoded atm  */}
          <SectionHeader
            header="PAUTAN PINTAS"
            title=""
            children={<SectionItemLinks dataItemLinks={dataItemLinks} />}
            isLastSection={true}
            classNameHeader="mb-[20px]"
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
