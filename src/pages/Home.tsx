import SectionItemNews from "../components/shared/SectionItemNews";
import SectionHeader from "../components/shared/SectionHeader";
import SectionItemCalendar from "../components/shared/SectionItemCalendar";
import SectionItemAnalytics from "../components/shared/SectionItemAnalytics";
import SectionItemLinks from "../components/shared/SectionItemLinks";
import Statistic from "../components/statistic";
import { getAnalytics } from "../services/analytics.svc";
import type { AnalyticsModel } from "../models/response";
import {
  statisticYearlyData,
  chartBaseData,
  dataItemCalendar,
  dataItemLinks,
  dataItemNews,
} from "../contentData";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [analytics, setAnalytics] = useState<AnalyticsModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);
  return (
    <div className="mx-auto flex-1 px-[18px] sm:px-[18px] md:px-[24px] lg:px-[24px] xl:px-[24px] max-w-[1328px] py-16 flex flex-col">

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

      <SectionHeader
        header="KALENDAR"
        children={
          <SectionItemCalendar
            dataItemCalendar={dataItemCalendar}
            mainTitle="Majlis yang bakal disambut tahun ini"
          />
        }
        ButtonLabel="Semua Acara"
      />

      <SectionHeader
        header="ANALITIK"
        title="Fakta Menarik Sekolah di Malaysia"
        children={
          loading || !analytics ? (
            <div className="p-6 text-center">Loading analytics...</div>
          ) : (
            <SectionItemAnalytics analytics={analytics} />
          )
        }
      />

      <SectionHeader
        header="PAUTAN PANTAS"
        title="Pautan Popular bagi guru, pelajar dan ibu bapa"
        children={<SectionItemLinks dataItemLinks={dataItemLinks} />}
      />

      <Statistic
        yearlyData={statisticYearlyData}
        chartBaseData={chartBaseData}
      />
    </div>
  );
}
