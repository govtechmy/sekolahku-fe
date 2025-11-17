import SectionItemNews from "../components/shared/SectionItemNews";
import SectionHeader from "../components/shared/SectionHeader";
import SectionItemCalendar from "../components/shared/SectionItemCalendar";
import SectionItemAnalytics from "../components/shared/SectionItemAnalytics";
import {
  BookIcon,
  DesktopIcon,
  FilterAscIcon,
  FlagIcon,
  GovtOfficeIcon,
  JataNegaraIcon,
  StarIcon,
  UserGroupIcon,
} from "@govtechmy/myds-react/icon";
import SectionItemLinks from "../components/shared/SectionItemLinks";
import Hero from "../components/shared/Hero";
import SearchBarHome from "../components/shared/SearchBarHome";
import { Button } from "@govtechmy/myds-react/button";
import Statistic from "../components/statistic";

export default function HomePage() {
  const dataItemNews = [
    {
      imageSrc: "/utama/newsitem/1.png",
      imageAlt: "Pelajar Belajar Menggunakan Tablet",
      header: "Berita",
      headerType: "Primary",
      title: "Bantuan Tablet Malaysia",
      date: "11 FEB 2025",
    },
    {
      imageSrc: "/utama/newsitem/2.png",
      imageAlt: "Pelajar Belajar",
      header: "Penggumuman",
      headerType: "Success",
      title: "Jadual Peperiksaan Akhir Tahun 2024",
      date: "10 FEB 2024",
    },
    {
      imageSrc: "/utama/newsitem/3.png",
      imageAlt: "Pelajar Belajar Menggunakan Tablet",
      header: "Berita",
      headerType: "Primary",
      title: "Penangguhan Cuti Sekolah Akhir Tahun 2025",
      date: "8 FEB 2024",
    },
    {
      imageSrc: "/utama/newsitem/4.png",
      imageAlt: "Pelajar Belajar",
      header: "Penggumuman",
      headerType: "Success",
      title: "Jadual Peperiksaan SPM 2025",
      date: "5 FEB 2024",
    },
    {
      imageSrc: "/utama/newsitem/3.png",
      imageAlt: "Pelajar Belajar Menggunakan Tablet",
      header: "Berita",
      headerType: "Primary",
      title: "Penangguhan Cuti Sekolah Akhir Tahun 2025",
      date: "8 FEB 2024",
    },
    {
      imageSrc: "/utama/newsitem/4.png",
      imageAlt: "Pelajar Belajar",
      header: "Penggumuman",
      headerType: "Success",
      title: "Jadual Peperiksaan SPM 2025",
      date: "5 FEB 2024",
    },
  ];
  const dataItemCalendar = [
    {
      day: "SABTU",
      date: "15 FEB",
      title: "Hari Kanak-Kanak Sedunia",
      imageSrc: "/utama/calendaritem/1.png",
      imageAlt: "xxx",
    },
    {
      day: "ISNIN",
      date: "11 MAC",
      title: "Hari Sukan Malaysia 2025",
      imageSrc: "/utama/calendaritem/2.jpg",
      imageAlt: "xxx",
    },
    {
      day: "JUMAAT",
      date: "16 MEI",
      title: "Hari Guru Malaysia 2025",
      imageSrc: "/utama/calendaritem/3.jpg",
      imageAlt: "xxx",
    },
    {
      day: "ISNIN",
      date: "11 MAC",
      title: "Hari Bapa Malaysia 2025",
      imageSrc: "/utama/calendaritem/4.jpg",
      imageAlt: "xxx",
    },
    {
      day: "ISNIN",
      date: "11 MAC",
      title: "Hari Sukan Malaysia 2025",
      imageSrc: "/utama/calendaritem/2.jpg",
      imageAlt: "xxx",
    },
    {
      day: "JUMAAT",
      date: "16 MEI",
      title: "Hari Guru Malaysia 2025",
      imageSrc: "/utama/calendaritem/3.jpg",
      imageAlt: "xxx",
    },
    {
      day: "ISNIN",
      date: "11 MAC",
      title: "Hari Bapa Malaysia 2025",
      imageSrc: "/utama/calendaritem/4.jpg",
      imageAlt: "xxx",
    },
  ];
  const dataItemAnalytics = [
    {
      icon: <UserGroupIcon />,
      statistic: "313,352",
      title: "Pelajar menduduki SPM 2024",
    },
    {
      icon: <BookIcon />,
      statistic: "78,828",
      title: "Pelajar memilih aliran STEM",
    },
    {
      icon: <GovtOfficeIcon />,
      statistic: "10,200",
      title: "Jumlah Sekolah di Malaysia",
    },
    {
      icon: <FlagIcon />,
      statistic: "50,041",
      title: "Pelajar menyertai sukan MSSM setiap tahun",
    },
    {
      icon: <DesktopIcon />,
      statistic: "7,587",
      title: "Sekolah telah menggunakan e-Learning",
    },
    {
      icon: <StarIcon />,
      statistic: "125,875",
      title: "Pelajar mendapat semua A untuk SPM 2024",
    },
  ];
  const dataItemLinks = [
    {
      icon: <JataNegaraIcon />,
      name: "SAPS NKRA",
      link: "https://sapsnkra.moe.gov.my/",
    },
    {
      icon: <JataNegaraIcon />,
      name: "APDM",
      link: "https://splkpm.moe.gov.my/",
    },
    {
      icon: <JataNegaraIcon />,
      name: "e-Operasi",
      link: "https://apdm.moe.gov.my/",
    },
    {
      icon: <JataNegaraIcon />,
      name: "e-GTukar",
      link: "https://emis.moe.gov.my/",
    },
    {
      icon: <JataNegaraIcon />,
      name: "SPL-KPM",
      link: "https://eoperasi.moe.gov.my/",
    },
    {
      icon: <JataNegaraIcon />,
      name: "EMIS",
      link: "https://delima.moe.gov.my/",
    },
    {
      icon: <JataNegaraIcon />,
      name: "DELIMa",
      link: "https://egtukar.moe.gov.my/",
    },
    {
      icon: <JataNegaraIcon />,
      name: "Nama Jabatan",
      link: "https://egtukar.moe.gov.my/",
    },
    {
      icon: <JataNegaraIcon />,
      name: "DELIMa",
      link: "https://egtukar.moe.gov.my/",
    },
  ];

  return (
    <div className="mx-auto flex-1 px-[18px] sm:px-[18px] md:px-[24px] lg:px-[24px] xl:px-[24px] max-w-[1328px] py-16 flex flex-col">
      <Hero
        title="Selamat Datang Ke Portal Sekolahku"
        search={<SearchBarHome />}
        links={
          <div className="flex flex-col gap-3">
            <div className="text-body-sm text-txt-black-500">
              Pautan Popular:
            </div>
            <Button
              variant="default-outline"
              className="rounded-full text-xs text-txt-black-900"
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

      <Statistic />

    </div>
  );
}
