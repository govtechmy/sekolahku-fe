import SectionItemNews from "../components/shared/SectionItemNews";
import SectionHeader from "../components/shared/SectionHeader";
import SectionItemCalendar from "../components/shared/SectionItemCalendar";
import SectionItemAnalytics from "../components/shared/SectionItemAnalytics";
import SectionItemLinks from "../components/shared/SectionItemLinks";
import Hero from "../components/shared/Hero";
import SearchBarHome from "../components/shared/SearchBarHome";
import Statistic from "../components/statistic";
import {
  statisticYearlyData,
  chartBaseData,
  dataItemAnalytics,
  dataItemCalendar,
  dataItemLinks,
  dataItemNews,
  popularLinks,
} from "../contentData";

export default function HomePage() {
  return (
    <div>
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen -mt-16">
      <Hero
        title="Selamat Datang Ke Portal Sekolahku"
        search={<SearchBarHome />}
        links={popularLinks}
        background={
          <>
                    <div
                        className="block h-full w-full bg-center bg-no-repeat bg-cover lg:hidden"
                        style={{
                            backgroundImage: `url('/utama/home-hero-mobile.svg')`,
                        }}
                    />
                    <div
                        className="hidden h-full w-full bg-cover bg-center bg-no-repeat lg:block"
                        style={{
                            backgroundImage: `url('/utama/sekolahku.png')`,
                        }}
                    />
                </>
        }
      ></Hero></div>

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
    </div>
  );
}
