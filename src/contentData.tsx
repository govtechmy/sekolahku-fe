import {
  UserGroupIcon,
  BookIcon,
  GovtOfficeIcon,
  FlagIcon,
  DesktopIcon,
  StarIcon,
  JataNegaraIcon,
  UserIcon,
  PhoneIcon,
  PrinterIcon,
  EmailIcon,
  PinIcon,
} from "@govtechmy/myds-react/icon";
import type { FindNearbyUpdatedEndpoint } from "./types/maps";

export const findNearbyUpdatedEndpoint: FindNearbyUpdatedEndpoint = {
  viewInfoLokasi: {
    koordinatXX: 37.7749,
    koordinatYY: -122.4194,
    zoom: 6,
  },
  markerGroups: [
    {
      markerType: "INDIVIDUAL",
      radiusInMeter: 0,
      infoLokasi: {
        koordinatXX: 37.7749,
        koordinatYY: -122.4194,
      },
      kodSekolah: "SCH001",
    },
    {
      markerType: "INDIVIDUAL",
      radiusInMeter: 0,
      infoLokasi: {
        koordinatXX: 37.7749,
        koordinatYY: -122.4194,
      },
      kodSekolah: "SCH001",
    },
    {
      markerType: "INDIVIDUAL",
      radiusInMeter: 0,
      infoLokasi: {
        koordinatXX: 37.7749,
        koordinatYY: -122.4194,
      },
      kodSekolah: "SCH001",
    },
  ],
};

export const NEGERI_LIST = [
  "JOHOR",
  "KEDAH",
  "KELANTAN",
  "MELAKA",
  "NEGERI SEMBILAN",
  "PAHANG",
  "PERAK",
  "PERLIS",
  "PULAU PINANG",
  "SABAH",
  "SARAWAK",
  "SELANGOR",
  "TERENGGANU",
  "WILAYAH PERSEKUTUAN KUALA LUMPUR",
  "WILAYAH PERSEKUTUAN LABUAN",
  "WILAYAH PERSEKUTUAN PUTRAJAYA",
];

export const JENIS_LIST = ["SK", "K9"];

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
    id: "1",
    imageSrc: "/utama/newsitem/1.png",
    imageAlt: "Pelajar Belajar Menggunakan Tablet",
    header: "Berita",
    title: "Bantuan Tablet Malaysia",
    description:
      "Program bantuan tablet untuk pelajar Malaysia kini dibuka. Dapatkan peralatan digital untuk membantu pembelajaran anda.",
    date: "11 FEB 2025",
    readTime: "3 min",
    link: "https://loremipsum.io/ultimate-list-of-lorem-ipsum-generators/",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    id: "2",
    imageSrc: "/utama/newsitem/2.png",
    imageAlt: "Pelajar Belajar",
    header: "Pengumuman",
    title: "Jadual Peperiksaan Akhir Tahun 2024",
    description:
      "Jadual peperiksaan akhir tahun 2024 telah dikeluarkan. Semak tarikh dan masa peperiksaan anda dengan teliti.",
    date: "10 FEB 2024",
    readTime: "2 min",
    link: "https://www.lipsum.com/feed/html",
    content:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
  },
  {
    id: "3",
    imageSrc: "/utama/newsitem/3.png",
    imageAlt: "Pelajar Belajar Menggunakan Tablet",
    header: "Berita",
    title: "Penangguhan Cuti Sekolah Akhir Tahun 2025",
    description:
      "Notis penting mengenai perubahan tarikh cuti sekolah akhir tahun. Semua pelajar dan ibu bapa diminta untuk mengambil maklum.",
    date: "8 FEB 2024",
    readTime: "4 min",
    link: "https://generator.lorem-ipsum.info/",
    content:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.",
  },
  {
    id: "4",
    imageSrc: "/utama/newsitem/4.png",
    imageAlt: "Pelajar Belajar",
    header: "Pengumuman",
    title: "Jadual Peperiksaan SPM 2025",
    description:
      "Jadual lengkap peperiksaan SPM 2025 kini tersedia. Muat turun dan buat persediaan awal untuk kejayaan anda.",
    date: "5 FEB 2024",
    readTime: "2 min",
    link: "https://www.blindtextgenerator.com/lorem-ipsum",
    content:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.",
  },
  {
    id: "5",
    imageSrc: "/utama/newsitem/3.png",
    imageAlt: "Pelajar Belajar Menggunakan Tablet",
    header: "Berita",
    title: "Penangguhan Cuti Sekolah Akhir Tahun 2025",
    description:
      "Kemas kini terkini berkenaan penangguhan cuti sekolah. Pastikan anda sentiasa mengikuti perkembangan terbaru dari pihak sekolah.",
    date: "8 FEB 2024",
    readTime: "4 min",
    link: "https://loremipsum.io/21-of-the-best-placeholder-image-generators/",
    content:
      "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.",
  },
  {
    id: "6",
    imageSrc: "/utama/newsitem/4.png",
    imageAlt: "Pelajar Belajar",
    header: "Pengumuman",
    title: "Jadual Peperiksaan SPM 2025",
    description:
      "Persiapan menghadapi SPM 2025 bermula sekarang. Ketahui tarikh penting dan tips berjaya dalam peperiksaan.",
    date: "5 FEB 2024",
    readTime: "2 min",
    link: "https://www.lipsum.com/",
    content:
      "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.",
  },
  {
    id: "7",
    imageSrc: "/utama/newsitem/1.png",
    imageAlt: "Pelajar Belajar Menggunakan Tablet",
    header: "Berita",
    title: "Bantuan Tablet Malaysia",
    description:
      "Inisiatif kerajaan untuk menyediakan tablet kepada pelajar berprestasi. Permohonan kini dibuka untuk semua yang layak.",
    date: "11 FEB 2025",
    readTime: "3 min",
    link: "https://loremipsum.de/downloads.html",
    content:
      "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. Ut enim ad minima veniam.",
  },
  {
    id: "8",
    imageSrc: "/utama/newsitem/2.png",
    imageAlt: "Pelajar Belajar",
    header: "Pengumuman",
    title: "Jadual Peperiksaan Akhir Tahun 2024",
    description:
      "Semakan semula jadual peperiksaan akhir tahun. Ada beberapa perubahan penting yang perlu anda ketahui.",
    date: "10 FEB 2024",
    readTime: "2 min",
    link: "https://www.webfx.com/tools/lorem-ipsum-generator/",
    content:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  },
  {
    id: "9",
    imageSrc: "/utama/newsitem/3.png",
    imageAlt: "Pelajar Belajar Menggunakan Tablet",
    header: "Berita",
    title: "Penangguhan Cuti Sekolah Akhir Tahun 2025",
    description:
      "Maklumat terkini tentang tarikh cuti sekolah yang ditangguhkan. Sila rujuk kepada pihak sekolah untuk butiran lanjut.",
    date: "8 FEB 2024",
    readTime: "4 min",
    link: "https://loripsum.net/",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.",
  },
  {
    id: "10",
    imageSrc: "/utama/newsitem/4.png",
    imageAlt: "Pelajar Belajar",
    header: "Pengumuman",
    title: "Jadual Peperiksaan SPM 2025",
    description:
      "Panduan lengkap untuk calon SPM 2025. Ketahui semua yang perlu anda tahu untuk bersedia menghadapi peperiksaan.",
    date: "5 FEB 2024",
    readTime: "2 min",
    link: "https://meettheipsums.com/",
    content:
      "Donec sollicitudin molestie malesuada. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Pellentesque in ipsum id orci porta dapibus. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.",
  },
  {
    id: "11",
    imageSrc: "/utama/newsitem/3.png",
    imageAlt: "Pelajar Belajar Menggunakan Tablet",
    header: "Berita",
    title: "Penangguhan Cuti Sekolah Akhir Tahun 2025",
    description:
      "Pengumuman rasmi dari Kementerian Pendidikan mengenai penangguhan cuti sekolah. Bacaan wajib untuk semua.",
    date: "8 FEB 2024",
    readTime: "4 min",
    link: "https://hipsum.co/",
    content:
      "Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.",
  },
  {
    id: "12",
    imageSrc: "/utama/newsitem/4.png",
    imageAlt: "Pelajar Belajar",
    header: "Pengumuman",
    title: "Jadual Peperiksaan SPM 2025",
    description:
      "Tarikh akhir pendaftaran peperiksaan SPM 2025 semakin hampir. Pastikan anda tidak terlepas peluang ini.",
    date: "5 FEB 2024",
    readTime: "2 min",
    link: "https://baconipsum.com/",
    content:
      "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Curabitur aliquet quam id dui posuere blandit. Nulla quis lorem ut libero malesuada feugiat. Quisque velit nisi, pretium ut lacinia in, elementum id enim.",
  },
  {
    id: "13",
    imageSrc: "/utama/newsitem/1.png",
    imageAlt: "Pelajar Belajar Menggunakan Tablet",
    header: "Berita",
    title: "Bantuan Tablet Malaysia",
    description:
      "Senarai syarat kelayakan untuk menerima bantuan tablet percuma. Semak sama ada anda layak untuk memohon.",
    date: "11 FEB 2025",
    readTime: "3 min",
    link: "https://www.cupcakeipsum.com/",
    content:
      "Cras ultricies ligula sed magna dictum porta. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Donec rutrum congue leo eget malesuada. Proin eget tortor risus.",
  },
  {
    id: "14",
    imageSrc: "/utama/newsitem/2.png",
    imageAlt: "Pelajar Belajar",
    header: "Pengumuman",
    title: "Jadual Peperiksaan Akhir Tahun 2024",
    description:
      "Format baharu peperiksaan akhir tahun 2024. Pelajari perubahan yang telah dibuat untuk tahun ini.",
    date: "10 FEB 2024",
    readTime: "2 min",
    link: "https://pirateipsum.me/",
    content:
      "Pellentesque in ipsum id orci porta dapibus. Vivamus suscipit tortor eget felis porttitor volutpat. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Sed porttitor lectus nibh.",
  },
  {
    id: "15",
    imageSrc: "/utama/newsitem/3.png",
    imageAlt: "Pelajar Belajar Menggunakan Tablet",
    header: "Berita",
    title: "Penangguhan Cuti Sekolah Akhir Tahun 2025",
    description:
      "Implikasi penangguhan cuti sekolah terhadap aktiviti ko-kurikulum. Ketahui perubahan jadual yang akan berlaku.",
    date: "8 FEB 2024",
    readTime: "4 min",
    link: "https://www.catipsum.com/index.php",
    content:
      "Nulla porttitor accumsan tincidunt. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula.",
  },
  {
    id: "16",
    imageSrc: "/utama/newsitem/4.png",
    imageAlt: "Pelajar Belajar",
    header: "Pengumuman",
    title: "Jadual Peperiksaan SPM 2025",
    description:
      "Tips dan strategi menghadapi SPM 2025 daripada pelajar cemerlang terdahulu. Baca pengalaman mereka di sini.",
    date: "5 FEB 2024",
    readTime: "2 min",
    link: "https://slipsum.com/",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sollicitudin molestie malesuada. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Vivamus magna justo, lacinia eget consectetur sed.",
  },
  {
    id: "17",
    imageSrc: "/utama/newsitem/3.png",
    imageAlt: "Pelajar Belajar Menggunakan Tablet",
    header: "Berita",
    title: "Penangguhan Cuti Sekolah Akhir Tahun 2025",
    description:
      "Soalan lazim berkaitan penangguhan cuti sekolah. Dapatkan jawapan kepada semua persoalan anda di sini.",
    date: "8 FEB 2024",
    readTime: "4 min",
    link: "https://www.office-ipsum.com/",
    content:
      "Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Curabitur aliquet quam id dui posuere blandit. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Nulla quis lorem ut libero malesuada feugiat.",
  },
  {
    id: "18",
    imageSrc: "/utama/newsitem/4.png",
    imageAlt: "Pelajar Belajar",
    header: "Pengumuman",
    title: "Jadual Peperiksaan SPM 2025",
    description:
      "Kursus persediaan SPM percuma untuk semua calon. Daftar sekarang dan tingkatkan peluang kejayaan anda.",
    date: "5 FEB 2024",
    readTime: "2 min",
    link: "https://litipsum.com/",
    content:
      "Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Proin eget tortor risus. Donec rutrum congue leo eget malesuada. Cras ultricies ligula sed magna dictum porta. Vivamus suscipit tortor eget felis porttitor volutpat.",
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

export const popularLinks = [
  {
    label: "Analitik Sekolah",
    link: "/analitik",
  },
]

// SekolahDetails-Data to Fetch
export const dataSekolahJumlah = [
  { label: "PELAJAR", value: "1", amount: "4,065", icon: <UserGroupIcon /> },
  { label: "GURU", value: "2", amount: "4,065", icon: <UserIcon /> },
];
export const dataSekolahAbout = [
  {
    value: "1",
    label: "Maktab Sultan Abu Bakar (English College)",
    icon: <GovtOfficeIcon width={24} height={24} />,
  },
  {
    value: "2",
    label: "07-222 2651",
    icon: <PhoneIcon width={24} height={24} />,
  },
  {
    value: "3",
    label: "07-222 2651",
    icon: <PrinterIcon width={24} height={24} />,
  },
  {
    value: "4",
    label: "english.college@moe.gov.my",
    icon: <EmailIcon width={24} height={24} />,
  },
  {
    value: "5",
    label:
      "Jalan Sungai Chat, Sri Gelam, 80100 Johor Bahru, Johor Darul Ta'zim",
    icon: <PinIcon width={24} height={24} />,
  },
];
export const dataSekolahInfo = [
  { label: "KOD SEKOLAH", value: "JEB1001" },
  { label: "NEGERI", value: "Johor" },
  { label: "PPD", value: "PPD Johor Bahru" },
  { label: "PARLIMEN", value: "Pulai" },
  { label: "BANTUAN", value: "SBK" },
  { label: "BIL SESI", value: "2 Sesi | Pagi & Petang" },
  { label: "PRASEKOLAH", value: "", icon: "cross" },
  { label: "INTEGRASI", value: "", icon: "checked" },
];
export const dataSekolahSuggestion = [
  {
    label: "Sekolah Menengah Kebangsaan Dato Jaafar",
    value: "001",
    address: "Johor Bharu",
  },
  {
    label: "Sekolah Menengah Kebangsaan Aminuddin Baki",
    value: "002",
    address: "Pulai, Johor Bharu",
  },
  {
    label: "Sekolah Menengah Kebangsaan Saint Joseph",
    value: "003",
    address: "Johor Bharu",
  },
];

// Malaysian States and Districts data
export const dataPilihLokasi = [
  {
    name: "Johor",
    flagFile: "Flag_of_Johor.svg",
    districts: [
      { "Segamat": [2.5147, 102.8158] },
      { "Sekijang": [2.4120, 102.8060] },
      { "Labis": [2.3865, 103.0215] },
      { "Pagoh": [2.1463, 102.6630] },
      { "Ledang": [2.2650, 102.5860] },
      { "Bakri": [2.0400, 102.6200] },
      { "Muar": [2.0500, 102.5679] },
      { "Parit Sulong": [1.8539, 103.0842] },
      { "Ayer Hitam": [1.9302, 103.2964] },
      { "Sri Gading": [1.8510, 103.0800] },
      { "Batu Pahat": [1.8534, 102.9400] },
      { "Simpang Renggam": [1.8262, 103.3058] },
      { "Kluang": [2.0251, 103.3317] },
      { "Sembrong": [2.1300, 103.5000] },
      { "Mersing": [2.4312, 103.8367] },
      { "Tenggara": [1.6750, 103.9000] },
      { "Kota Tinggi": [1.7381, 103.8999] },
      { "Pengerang": [1.3506, 104.0147] },
      { "Tebrau": [1.5527, 103.7910] },
      { "Pasir Gudang": [1.4720, 103.8866] },
      { "Johor Bahru": [1.4927, 103.7414] },
      { "Pulai": [1.4780, 103.5960] },
      { "Iskandar Puteri": [1.4750, 103.6670] },
      { "Kulai": [1.6560, 103.6030] },
      { "Pontian": [1.4856, 103.3890] },
      { "Tanjung Piai": [1.2689, 103.5066] },
    ],
  },

  {
    name: "Kedah",
    flagFile: "Flag_of_Kedah.svg",
    districts: [
      { "Langkawi": [6.3269, 99.8430] },
      { "Jerlun": [6.2660, 100.3670] },
      { "Kubang Pasu": [6.4290, 100.4170] },
      { "Padang Terap": [6.2040, 100.6060] },
      { "Pokok Sena": [6.1850, 100.5070] },
      { "Alor Setar": [6.1210, 100.3670] },
      { "Kuala Kedah": [6.0780, 100.2920] },
      { "Pendang": [5.9980, 100.4780] },
      { "Jerai": [5.7850, 100.4310] },
      { "Sik": [5.8020, 100.7330] },
      { "Merbok": [5.6420, 100.4870] },
      { "Sungai Petani": [5.6470, 100.4870] },
      { "Baling": [5.6790, 100.9160] },
      { "Padang Serai": [5.4000, 100.5410] },
      { "Kulim-Bandar Baharu": [5.2300, 100.5300] },
    ],
  },

  {
    name: "Kelantan",
    flagFile: "Flag_of_Kelantan.svg",
    districts: [
      { "Tumpat": [6.1980, 102.1710] },
      { "Pengkalan Chepa": [6.1550, 102.2930] },
      { "Kota Bharu": [6.1233, 102.2381] },
      { "Pasir Mas": [6.0400, 102.1390] },
      { "Rantau Panjang": [5.8400, 101.9700] },
      { "Kubang Kerian": [6.0800, 102.2850] },
      { "Bachok": [5.7940, 102.4170] },
      { "Ketereh": [5.9720, 102.2870] },
      { "Tanah Merah": [5.8000, 102.1500] },
      { "Pasir Puteh": [5.8350, 102.4250] },
      { "Machang": [5.7640, 102.2200] },
      { "Jeli": [5.7090, 101.8430] },
      { "Kuala Krai": [5.5350, 102.2000] },
      { "Gua Musang": [4.8810, 101.9650] },
    ],
  },
  {
    name: "Melaka",
    flagFile: "Flag_of_Malacca.svg",
    districts: [
      { "Masjid Tanah": [2.3500, 102.1170] },
      { "Alor Gajah": [2.3800, 102.2300] },
      { "Tangga Batu": [2.2600, 102.2000] },
      { "Bukit Katil": [2.2160, 102.2850] },
      { "Kota Melaka": [2.1900, 102.2500] },
      { "Jasin": [2.3000, 102.4300] },
    ],
  },

  {
    name: "Negeri Sembilan",
    flagFile: "Flag_of_Negeri_Sembilan.svg",
    districts: [
      { "Jelebu": [3.0500, 102.0500] },
      { "Jempol": [2.7000, 102.4000] },
      { "Seremban": [2.7250, 101.9380] },
      { "Kuala Pilah": [2.7300, 102.2500] },
      { "Rasah": [2.7100, 101.9400] },
      { "Rembau": [2.6000, 102.0830] },
      { "Telok Kemang": [2.5200, 101.8000] },
      { "Tampin": [2.4700, 102.2300] },
    ],
  },

  {
    name: "Pahang",
    flagFile: "Flag_of_Pahang.svg",
    districts: [
      { "Cameron Highlands": [4.4710, 101.3930] },
      { "Lipis": [4.1840, 102.0470] },
      { "Raub": [3.7930, 101.8570] },
      { "Jerantut": [3.9360, 102.3620] },
      { "Indera Mahkota": [3.8400, 103.3400] },
      { "Kuantan": [3.8070, 103.3260] },
      { "Paya Besar": [3.7400, 103.2800] },
      { "Pekan": [3.5000, 103.3900] },
      { "Maran": [3.5600, 102.7700] },
      { "Kuala Krau": [3.5500, 102.2000] },
      { "Temerloh": [3.4300, 102.1500] },
      { "Bentong": [3.5340, 101.9100] },
      { "Bera": [3.1110, 102.4170] },
      { "Rompin": [2.7100, 103.4300] },
    ],
  },

  {
    name: "Perak",
    flagFile: "Flag_of_Perak.svg",
    districts: [
      { "Gerik": [5.4200, 101.1320] },
      { "Lenggong": [5.0500, 100.9700] },
      { "Larut": [4.8500, 100.7300] },
      { "Parit Buntar": [5.1250, 100.4930] },
      { "Bagan Serai": [5.0000, 100.5500] },
      { "Bukit Gantang": [4.8500, 100.7330] },
      { "Taiping": [4.8500, 100.7330] },
      { "Padang Rengas": [4.8500, 100.9500] },
      { "Sungai Siput": [4.7650, 101.0610] },
      { "Tambun": [4.6250, 101.1440] },
      { "Ipoh Timur": [4.6100, 101.1150] },
      { "Ipoh Barat": [4.5970, 101.0640] },
      { "Batu Gajah": [4.4700, 101.0500] },
      { "Kuala Kangsar": [4.7750, 100.9400] },
      { "Beruas": [4.3500, 100.7000] },
      { "Parit": [4.4500, 100.9000] },
      { "Kampar": [4.3150, 101.1500] },
      { "Gopeng": [4.4720, 101.1650] },
      { "Tapah": [4.2020, 101.2650] },
      { "Pasir Salak": [4.1700, 100.8800] },
      { "Lumut": [4.2300, 100.6300] },
      { "Bagan Datuk": [3.9800, 100.9000] },
      { "Teluk Intan": [4.0220, 101.0200] },
      { "Tanjong Malim": [3.6830, 101.5300] },
    ],
  },
  {
    name: "Perlis",
    flagFile: "Flag_of_Perlis.svg",
    districts: [
      { "Padang Besar": [6.6610, 100.3160] },
      { "Kangar": [6.4330, 100.1990] },
      { "Arau": [6.4330, 100.2770] },
    ],
  },

  {
    name: "Pulau Pinang",
    flagFile: "Flag_of_Penang_(Malaysia).svg",
    districts: [
      { "Kepala Batas": [5.5170, 100.4300] },
      { "Tasek Gelugor": [5.4800, 100.4900] },
      { "Bagan": [5.4500, 100.3800] },
      { "Permatang Pauh": [5.3800, 100.4100] },
      { "Bukit Mertajam": [5.3600, 100.4700] },
      { "Batu Kawan": [5.2800, 100.4500] },
      { "Nibong Tebal": [5.1700, 100.4900] },
      { "Bukit Bendera": [5.4300, 100.2900] },
      { "Tanjong": [5.4300, 100.3300] },
      { "Jelutong": [5.3900, 100.3200] },
      { "Bukit Gelugor": [5.3700, 100.3000] },
      { "Bayan Baru": [5.3200, 100.3000] },
      { "Balik Pulau": [5.3200, 100.2200] },
    ],
  },

  {
    name: "Sabah",
    flagFile: "Flag_of_Sabah.svg",
    districts: [
      { "Kudat": [6.8870, 116.8280] },
      { "Kota Marudu": [6.5030, 116.7790] },
      { "Kota Belud": [6.3500, 116.6000] },
      { "Tuaran": [6.1300, 116.1800] },
      { "Sepanggar": [6.0530, 116.1150] },
      { "Kota Kinabalu": [5.9800, 116.0730] },
      { "Putatan": [5.9150, 116.0500] },
      { "Penampang": [5.9050, 116.1000] },
      { "Papar": [5.7330, 116.0330] },
      { "Kimanis": [5.3100, 115.9300] },
      { "Beaufort": [5.3460, 115.7400] },
      { "Sipitang": [5.0730, 115.5600] },
      { "Ranau": [5.9600, 116.6650] },
      { "Keningau": [5.3380, 116.1600] },
      { "Tenom": [4.9230, 115.9420] },
      { "Pensiangan": [4.3850, 116.1950] },
      { "Beluran": [6.3500, 117.5000] },
      { "Libaran": [5.9200, 118.0700] },
      { "Batu Sapi": [5.8300, 118.1200] },
      { "Sandakan": [5.8450, 118.1100] },
      { "Kinabatangan": [5.3050, 117.9970] },
      { "Lahad Datu": [5.0200, 118.3300] },
      { "Semporna": [4.4830, 118.6090] },
      { "Tawau": [4.2440, 117.8820] },
      { "Kalabakan": [4.6090, 117.4890] },
    ],
  },

  {
    name: "Sarawak",
    flagFile: "Flag_of_Sarawak.svg",
    districts: [
      { "Mas Gading": [1.4460, 110.2000] },
      { "Santubong": [1.7760, 110.3350] },
      { "Petra Jaya": [1.5760, 110.3400] },
      { "Bandar Kuching": [1.5600, 110.3450] },
      { "Stampin": [1.5200, 110.3650] },
      { "Kota Samarahan": [1.4560, 110.3790] },
      { "Puncak Borneo": [1.2230, 110.2240] },
      { "Serian": [1.2020, 110.4330] },
      { "Batang Sadong": [1.7160, 110.6200] },
      { "Batang Lupar": [1.5400, 111.2400] },
      { "Sri Aman": [1.2380, 111.4520] },
      { "Lubok Antu": [1.1340, 112.0500] },
      { "Betong": [1.4030, 111.3840] },
      { "Saratok": [1.7970, 111.2330] },
      { "Tanjong Manis": [2.1280, 111.2090] },
      { "Igan": [2.0430, 111.6080] },
      { "Sarikei": [2.1300, 111.5200] },
      { "Julau": [2.0010, 112.0600] },
      { "Kanowit": [2.1380, 112.2680] },
      { "Lanang": [2.3000, 111.8200] },
      { "Sibu": [2.2870, 111.8300] },
      { "Mukah": [2.9000, 112.0900] },
      { "Selangau": [2.6200, 112.2350] },
      { "Kapit": [2.0230, 112.9360] },
      { "Hulu Rajang": [2.5000, 113.5000] },
      { "Bintulu": [3.1700, 113.0300] },
      { "Sibuti": [4.0800, 113.5900] },
      { "Miri": [4.3980, 113.9930] },
      { "Baram": [4.3500, 115.0000] },
      { "Limbang": [4.7500, 115.0000] },
      { "Lawas": [4.9000, 115.4100] },
    ],
  },

  {
    name: "Selangor",
    flagFile: "Flag_of_Selangor.svg",
    districts: [
      { "Sabak Bernam": [3.6775, 100.9866] },
      { "Sungai Besar": [3.6740, 100.9900] },
      { "Hulu Selangor": [3.5763, 101.6544] },
      { "Tanjong Karang": [3.4309, 101.2425] },
      { "Kuala Selangor": [3.3420, 101.2500] },
      { "Selayang": [3.3216, 101.6517] },
      { "Gombak": [3.2379, 101.6865] },
      { "Ampang": [3.1517, 101.7612] },
      { "Pandan": [3.1370, 101.7700] },
      { "Hulu Langat": [3.0899, 101.7870] },
      { "Bangi": [2.9570, 101.7690] },
      { "Puchong": [3.0226, 101.6167] },
      { "Subang": [3.0810, 101.5330] },
      { "Petaling Jaya": [3.1073, 101.6067] },
      { "Damansara": [3.1460, 101.5860] },
      { "Sungai Buloh": [3.2087, 101.5586] },
      { "Shah Alam": [3.0733, 101.5185] },
      { "Kapar": [3.0853, 101.4348] },
      { "Klang": [3.0439, 101.4467] },
      { "Kota Raja": [2.9980, 101.4730] },
      { "Kuala Langat": [2.8640, 101.5500] },
      { "Sepang": [2.6930, 101.7490] },
    ],
  },
  {
    name: "Terengganu",
    flagFile: "Flag_of_Terengganu.svg",
    districts: [
      { "Besut": [5.5320, 102.5460] },
      { "Setiu": [5.6500, 102.7500] },
      { "Kuala Nerus": [5.3050, 103.0670] },
      { "Kuala Terengganu": [5.3300, 103.1400] },
      { "Marang": [5.2050, 103.2300] },
      { "Hulu Terengganu": [5.0700, 102.7800] },
      { "Dungun": [4.7600, 103.4200] },
      { "Kemaman": [4.2300, 103.4200] },
    ],
  },

  {
    name: "Wilayah Persekutuan Kuala Lumpur",
    flagFile: "Flag_of_the_Federal_Territories_of_Malaysia.svg",
    districts: [
      { "Kepong": [3.2190, 101.6400] },
      { "Batu": [3.2200, 101.6800] },
      { "Wangsa Maju": [3.2000, 101.7500] },
      { "Segambut": [3.1880, 101.6600] },
      { "Setiawangsa": [3.1620, 101.7500] },
      { "Titiwangsa": [3.1740, 101.7100] },
      { "Bukit Bintang": [3.1460, 101.7090] },
      { "Lembah Pantai": [3.1160, 101.6650] },
      { "Seputeh": [3.0990, 101.6840] },
      { "Cheras": [3.0820, 101.7410] },
      { "Bandar Tun Razak": [3.0860, 101.7290] },
    ],
  },

  {
    name: "Wilayah Persekutuan Labuan",
    flagFile: "Flag_of_Labuan.svg",
    districts: [
      { "Labuan": [5.2830, 115.2410] },
    ],
  },

  {
    name: "Wilayah Persekutuan Putrajaya",
    flagFile: "Flag_of_Putrajaya.svg",
    districts: ["Putrajaya"]
  }
] as const;

export const STATE_STYLES: Record<string, L.PathOptions> = {
  Johor: {
    color: "#0066ff",
    weight: 2,
    fillColor: "#3388ff",
    fillOpacity: 0.12,
  },
  Selangor: {
    color: "#ff4444",
    weight: 2,
    fillColor: "#ff8888",
    fillOpacity: 0.12,
  },
  Pahang: {
    color: "#ffffff",
    weight: 2,
    fillColor: "#ffff66",
    fillOpacity: 0.12,
  },
  Sarawak: {
    color: "#FFDB58",
    weight: 2,
    fillColor: "#FFFF8F",
    fillOpacity: 0.12,
  },
  Sabah: {
    color: "#00FFFF",
    weight: 2,
    fillColor: "#0096FF",
    fillOpacity: 0.12,
  },
  Kelantan: {
    color: "#AFE1AF",
    weight: 2,
    fillColor: "#097969",
    fillOpacity: 0.12,
  }
};


export const findNearbyGroupAppend = {
  viewInfoLokasi: {
    koordinatXX: 3.1578,
    koordinatYY: 101.7118,
    zoom: 7,
  },
  markerGroups: [
    {
      markerType: "INDIVIDUAL",
      radiusInMeter: 0,
      infoLokasi: {
        koordinatXX: 3.1578,
        koordinatYY: 101.7118,
      },
      kodSekolah: "SCH007",
    },
    {
      markerType: "GROUP",
      radiusInMeter: 10.0,
      infoLokasi: {
        koordinatXX: 3.1578,
        koordinatYY: 101.7118,
      },
      total: 5,
      items: [
        {
          kodSekolah: "SCH008",
          infoLokasi: {
            koordinatXX: 3.1573,
            koordinatYY: 101.7113,
          },
        },
        {
          kodSekolah: "SCH009",
          infoLokasi: {
            koordinatXX: 3.1578,
            koordinatYY: 101.7118,
          },
        },
        {
          kodSekolah: "SCH0010",
          infoLokasi: {
            koordinatXX: 3.1583,
            koordinatYY: 101.7123,
          },
        },
        {
          kodSekolah: "SCH0011",
          infoLokasi: {
            koordinatXX: 3.1576,
            koordinatYY: 101.7115,
          },
        },
        {
          kodSekolah: "SCH0012",
          infoLokasi: {
            koordinatXX: 3.1580,
            koordinatYY: 101.7121,
          },
        },
      ],
    },
  ],
};

// GET http://localhost:3000/schools/find-nearby?latitude=4.9&longitude=100.4&zoom=5

export const findNearbyGroup2 = {
  viewInfoLokasi: {
    koordinatXX: 37.7749,
    koordinatYY: -122.4194,
    zoom: 6,
  },
  markerGroups: [
    {
      markerType: "NEGERI",
      radiusInMeter: 0,
      infoLokasi: {
        koordinatXX: 37.7749,
        koordinatYY: -122.4194,
      },
      total: 1000,
    },
  ],
};

// GET http://localhost:3000/schools/find-nearby?latitude=4.9&longitude=100.4&zoom=9

export const findNearbyGroup3 = {
  viewInfoLokasi: {
    koordinatXX: 37.7749,
    koordinatYY: -122.4194,
    zoom: 6,
  },
  markerGroups: [
    {
      markerType: "PARLIMEN",
      radiusInMeter: 0,
      infoLokasi: {
        koordinatXX: 37.7749,
        koordinatYY: -122.4194,
      },
      total: 230,
    },
  ],
};

// GET http://localhost:3000/schools/find-nearby?latitude=4.9&longitude=100.4&zoom=12

export const findNearbyGroup4 = {
  viewInfoLokasi: {
    koordinatXX: 37.7749,
    koordinatYY: -122.4194,
    zoom: 6,
  },
  markerGroups: [
    {
      markerType: "group",
      radiusInMeter: 0,
      infoLokasi: {
        koordinatXX: 37.7749,
        koordinatYY: -122.4194,
      },
      total: 10,
      items: [
        {
          kodSekolah: "SCH002",
          infoLokasi: {
            koordinatXX: 37.775,
            koordinatYY: -122.418,
          },
        },
        {
          kodSekolah: "SCH003",
          infoLokasi: {
            koordinatXX: 37.776,
            koordinatYY: -122.417,
          },
        },
        {
          kodSekolah: "SCH004",
          infoLokasi: {
            koordinatXX: 37.777,
            koordinatYY: -122.416,
          },
        },
        {
          kodSekolah: "SCH005",
          infoLokasi: {
            koordinatXX: 37.778,
            koordinatYY: -122.415,
          },
        },
        {
          kodSekolah: "SCH006",
          infoLokasi: {
            koordinatXX: 37.779,
            koordinatYY: -122.414,
          },
        },
      ],
    },
  ],
};

// GET http://localhost:3000/schools/find-nearby?latitude=4.9&longitude=100.4&zoom=14

export const findNearbyGroup5 = {
  viewInfoLokasi: {
    koordinatXX: 37.7749,
    koordinatYY: -122.4194,
    zoom: 6,
  },
  markerGroups: [
    {
      markerType: "INDIVIDUAL",
      radiusInMeter: 0,
      infoLokasi: {
        koordinatXX: 37.7749,
        koordinatYY: -122.4194,
      },
      kodSekolah: "SCH001",
    },
    {
      markerType: "INDIVIDUAL",
      radiusInMeter: 0,
      infoLokasi: {
        koordinatXX: 37.7749,
        koordinatYY: -122.4194,
      },
      kodSekolah: "SCH001",
    },
    {
      markerType: "INDIVIDUAL",
      radiusInMeter: 0,
      infoLokasi: {
        koordinatXX: 37.7749,
        koordinatYY: -122.4194,
      },
      kodSekolah: "SCH001",
    },
  ],
};
