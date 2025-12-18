import SectionItemNews from "../components/shared/SectionItemNews";
import SectionHeader from "../components/shared/SectionHeader";
import SectionItemCalendar from "../components/shared/SectionItemCalendar";
import SectionItemAnalytics from "../components/shared/SectionItemAnalytics";
import SectionItemLinks from "../components/shared/SectionItemLinks";
import Statistic from "../components/statistic";
import {
  statisticYearlyData,
  chartBaseData,
  dataItemAnalytics,
  dataItemCalendar,
  dataItemLinks,
  dataItemNews,
} from "../contentData";

export default function HomePage() {
  return (
    <>
      <SectionHeader
        header="SIARAN"
        ButtonLabel="Semua Berita"
        children={
          <SectionItemNews
            dataItemNews={dataItemNews}
            redirectDesc="Baca"
            mainTitle="Apa yang Sedang Berlaku di Sekolah-sekolah Malaysia"
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
          <SectionItemAnalytics dataItemAnalytics={dataItemAnalytics} />
        }
        ButtonLabel="Lihat Data Lengkap"
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
    </>
  );
}
