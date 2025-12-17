import SectionItemNews from "../components/shared/SectionItemNews";
import SectionHeader from "../components/shared/SectionHeader";
import SectionItemCalendar from "../components/shared/SectionItemCalendar";
import SectionItemAnalytics from "../components/shared/SectionItemAnalytics";
import { FilterAscIcon } from "@govtechmy/myds-react/icon";
import SectionItemLinks from "../components/shared/SectionItemLinks";
import Hero from "../components/shared/Hero";
import SearchBarHome from "../components/shared/SearchBarHome";
import { Button } from "@govtechmy/myds-react/button";
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
    <div className="mx-auto flex-1 px-[18px] sm:px-[18px] md:px-[24px] lg:px-[24px] xl:px-[24px] max-w-[1328px] py-16 flex flex-col">
      <Hero
        title="Selamat Datang Ke Portal Sekolahku"
        search={<SearchBarHome />}
        links={
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="text-body-sm text-txt-black-500">
              Pautan Popular:
            </div>
            <Button
              variant="default-outline"
              className="rounded-full text-xs flex justify-center text-txt-black-900"
              size="medium"
            >
              <div className="rounded-full bg-primary-50 text-txt-primary size-8 items-center justify-center flex">
                <FilterAscIcon className="!size-5" />
              </div>
              Analitik Sekolah
            </Button>
          </div>
        }
        background={
          <img src="/utama/sekolahku.png" alt="imej hero sekolahku" />
        }
      ></Hero>

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
    </div>
  );
}
