import {
  UserGroupIcon,
  BookIcon,
  GovtOfficeIcon,
  FlagIcon,
  DesktopIcon,
  StarIcon,
  JataNegaraIcon,
} from "@govtechmy/myds-react/icon";

// Statistics data for different years
export const statisticYearlyData = {
  2020: {
    spm: { daily: 500, total: "250,000" },
    stem: { daily: 150, total: "60,000" },
    koku: { daily: 8, total: "280,000" },
  },
  2021: {
    spm: { daily: 600, total: "275,000" },
    stem: { daily: 180, total: "65,000" },
    koku: { daily: 9, total: "295,000" },
  },
  2022: {
    spm: { daily: 680, total: "295,000" },
    stem: { daily: 210, total: "72,000" },
    koku: { daily: 10, total: "305,000" },
  },
  2023: {
    spm: { daily: 733, total: "313,352" },
    stem: { daily: 231, total: "78,828" },
    koku: { daily: 11, total: "313,352" },
  },
};

// Chart data for different categories and years
export const chartBaseData = {
  spm: {
    2020: [30, 120, 280, 480, 440, 420, 350, 520, 580, 620, 650, 680],
    2021: [40, 150, 320, 550, 510, 480, 400, 580, 640, 690, 720, 750],
    2022: [35, 140, 300, 520, 480, 460, 380, 560, 610, 660, 690, 720],
    2023: [40, 170, 360, 610, 570, 540, 450, 645, 700, 750, 780, 800],
  },
  stem: {
    2020: [45, 110, 250, 450, 410, 390, 320, 490, 550, 590, 620, 650],
    2021: [60, 140, 290, 520, 480, 450, 370, 550, 610, 660, 690, 720],
    2022: [50, 130, 270, 490, 450, 430, 350, 530, 580, 630, 660, 690],
    2023: [60, 150, 320, 580, 530, 510, 400, 600, 660, 710, 740, 770],
  },
  koku: {
    2020: [35, 130, 270, 470, 430, 410, 330, 510, 570, 610, 640, 670],
    2021: [50, 160, 310, 540, 500, 470, 390, 570, 630, 680, 710, 740],
    2022: [45, 150, 290, 510, 470, 450, 370, 550, 600, 650, 680, 710],
    2023: [50, 160, 340, 590, 550, 520, 420, 620, 680, 730, 760, 790],
  },
};

export const dataItemNews = [
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
export const dataItemCalendar = [
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
export const dataItemAnalytics = [
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
export const dataItemLinks = [
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
