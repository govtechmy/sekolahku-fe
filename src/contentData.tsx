import {
  UserGroupIcon,
  GovtOfficeIcon,
  JataNegaraIcon,
  UserIcon,
  PhoneIcon,
  PrinterIcon,
  EmailIcon,
  PinIcon,
} from "@govtechmy/myds-react/icon";
import type { FindNearbyUpdatedEndpoint } from "./types/maps";

export const siaranSocialLinks = [
  {
    platform: "hyperlink",
    href: "#",
    ariaLabel: "Siaran link",
  },
  {
    platform: "email",
    href: "#",
    ariaLabel: "Email link",
  },
  {
    platform: "facebook",
    href: "#",
    ariaLabel: "Facebook link",
  },
  {
    platform: "twitter",
    href: "#",
    ariaLabel: "Twitter link",
  },
];

export const footerSocialLinks = [
  {
    platform: "facebook",
    href: "#",
    ariaLabel: "Facebook link",
  },
  {
    platform: "twitter",
    href: "#",
    ariaLabel: "Twitter link",
  },
  {
    platform: "instagram",
    href: "#",
    ariaLabel: "Instagram link",
  },
  {
    platform: "youtube",
    href: "#",
    ariaLabel: "Youtube link",
  },
];

export const siaranAcaraDummyDocuments: any[] = [
  {
    name: "file1.pdf",
    type: "application/pdf",
    size: 5000,
    fileurl: "https://s3.ap-southeast-5.amazonaws.com/my.gov.digital.rdm-bucket-dev/koleksi/6940f28bda85479d8fcadd5a/1765864075415-9.Teks_Ucapan.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAYYUPU5VVRZXW42B3%2F20260102%2Fap-southeast-5%2Fs3%2Faws4_request&X-Amz-Date=20260102T014005Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLXNvdXRoZWFzdC01IkgwRgIhAMqZUFI0KT5LBTedGvyWbkwYR1q6O1xCSvPWbktlRVHwAiEAx%2Bti8sTmR%2F1QSTBCbEL%2FpucuukkK41IRxosqX4pz9t0qgwQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2MDI2NzA0Mjc0OTkiDM8LwqwSQdv7W8%2FcASrXA4UAHmixQLrpfN1IoivYqvVJVeuR3epyKmoihiYXSjKGMrQd4kC44lUiyTKfXqW5vzdDeWw60G2EDnnnzOFRdOgB3LHYoHJRb%2FI17PTzVyR7rcn5lhQjSl5W0PjbW7XyoAsU8vOx09T3n8I1G7HSeWJPrimlFiu1SX25NzfQh1QmPdMiVTohubCykhqOYZuTpH4QylyeAgcHdlYlwCgbylOf3gbr6xJAaHqBBcYUDtHFdzI5OHwgCcDT0H%2F%2FPuI9%2B42nLyJzmtPkIWlqLhzICJxJWBjGi%2BQMkjzknHSlwMUj4zlON9rQugsKqC%2FoiithitbM0F25IlcEMY9lgu3Alr1iUyFa0w7N%2BneUMobKbXSXgAnKbfOQuVKZAWo0nUCYl1k09PZJ97wX4Scb0mAntnc%2BG%2FOTCb2%2F%2Bij26IaUYCDqbunLTAABYsLF%2FIx5M1lzz6ohDvJSaepDs0vtbupxDTdhh%2BZCspJ%2B3tvYlX0uhj13Zi%2BREue1uFy%2BWZvkoIx58CzaDH1pQ1IexGZW7FrHA%2BsID23xhhDRKPwNdU3nEltQ6M6pRt8Lqu3%2Fzfknjo3%2FhD2ZNXVh1AAQJlLPLDDJRTlZ4RUBpfDIhMakHvYYBgshrM9iOvrg1jDuwdzKBjqkAWMUyOcIMJ8VSQiBlC1adO6qOmf%2B2CmFTZ9pV55o3kysZOh1f0r40oQ8kCmknDfG8k7onqxAuEGT9RyVFnbzlNwQrSkslFvmcgboCv57OYIgPCs78%2Bka8YmXpU9xjyIij9hWpygdFGI5EOWXMmZVq0vW11zsrFIfEJuK3xbUOjoNmtxwFw9863sQGDHAsH1%2BfN7srF69GQFxP%2B57HnT63vJsMy7Q&X-Amz-Signature=2e0f54db7de110a87df88ce30936b60a9766d654d9e339047be6352aadb16771&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
    isExistingFile: false,
  },
  {
    name: "file2.pdf",
    type: "application/pdf",
    size: 50000,
    fileurl: "https://s3.ap-southeast-5.amazonaws.com/my.gov.digital.rdm-bucket-dev/koleksi/6940f28bda85479d8fcadd5a/1765864075415-9.Teks_Ucapan.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAYYUPU5VVRZXW42B3%2F20260102%2Fap-southeast-5%2Fs3%2Faws4_request&X-Amz-Date=20260102T014005Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLXNvdXRoZWFzdC01IkgwRgIhAMqZUFI0KT5LBTedGvyWbkwYR1q6O1xCSvPWbktlRVHwAiEAx%2Bti8sTmR%2F1QSTBCbEL%2FpucuukkK41IRxosqX4pz9t0qgwQI8%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2MDI2NzA0Mjc0OTkiDM8LwqwSQdv7W8%2FcASrXA4UAHmixQLrpfN1IoivYqvVJVeuR3epyKmoihiYXSjKGMrQd4kC44lUiyTKfXqW5vzdDeWw60G2EDnnnzOFRdOgB3LHYoHJRb%2FI17PTzVyR7rcn5lhQjSl5W0PjbW7XyoAsU8vOx09T3n8I1G7HSeWJPrimlFiu1SX25NzfQh1QmPdMiVTohubCykhqOYZuTpH4QylyeAgcHdlYlwCgbylOf3gbr6xJAaHqBBcYUDtHFdzI5OHwgCcDT0H%2F%2FPuI9%2B42nLyJzmtPkIWlqLhzICJxJWBjGi%2BQMkjzknHSlwMUj4zlON9rQugsKqC%2FoiithitbM0F25IlcEMY9lgu3Alr1iUyFa0w7N%2BneUMobKbXSXgAnKbfOQuVKZAWo0nUCYl1k09PZJ97wX4Scb0mAntnc%2BG%2FOTCb2%2F%2Bij26IaUYCDqbunLTAABYsLF%2FIx5M1lzz6ohDvJSaepDs0vtbupxDTdhh%2BZCspJ%2B3tvYlX0uhj13Zi%2BREue1uFy%2BWZvkoIx58CzaDH1pQ1IexGZW7FrHA%2BsID23xhhDRKPwNdU3nEltQ6M6pRt8Lqu3%2Fzfknjo3%2FhD2ZNXVh1AAQJlLPLDDJRTlZ4RUBpfDIhMakHvYYBgshrM9iOvrg1jDuwdzKBjqkAWMUyOcIMJ8VSQiBlC1adO6qOmf%2B2CmFTZ9pV55o3kysZOh1f0r40oQ8kCmknDfG8k7onqxAuEGT9RyVFnbzlNwQrSkslFvmcgboCv57OYIgPCs78%2Bka8YmXpU9xjyIij9hWpygdFGI5EOWXMmZVq0vW11zsrFIfEJuK3xbUOjoNmtxwFw9863sQGDHAsH1%2BfN7srF69GQFxP%2B57HnT63vJsMy7Q&X-Amz-Signature=2e0f54db7de110a87df88ce30936b60a9766d654d9e339047be6352aadb16771&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
    isExistingFile: true,
  },
  {
    name: "SBP-English College.png",
    type: "image/png",
    size: 50000,
    lastModified: 0,
    fileurl: "https://s3.ap-southeast-5.amazonaws.com/my.gov.digital.rdm-bucket-dev/koleksi/6942133cbbee7f09b4f5b646/1765937980719-1.Galeri_Peristiwa.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAYYUPU5VVYZT7ZWR5%2F20260102%2Fap-southeast-5%2Fs3%2Faws4_request&X-Amz-Date=20260102T010743Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEKT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLXNvdXRoZWFzdC01IkYwRAIgUnvqZn3te4eclKIFhByWX2CcfBG41upzEELztvIG%2FOsCICdVpIIIoMnf4kHlkA4wGf%2FPsEdE0L%2FPrqmg5KBG9dZ3KoMECPL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjAyNjcwNDI3NDk5IgyIZsLN43VpvE9mmwUq1wMINs68cPkATWEY07IdCudwvqhvACbhnB%2BdJ2hXhx1F5UyeQozMwaqrfqcJN6HHY0gVz%2Fj8q%2Fnm5dNfL2wNcczeVYqbIgWAHG231beFLEqVSnCyKxWS8XFKoHWmRXndxrAm7OBG%2Fag%2BQ41Sg7JukNDcZGI2gcTAI6hgHYaosxMxopu%2BVu3XvEJZJwmflNdfI9N6%2BW84Q06yT6SykMYfLbXxiM3OI9zcx8uUsv0J7E6nZtNpdOe6wl0MZ3J4d76Zhv78oAoIogTIckvkoU16olIIJroP1SUqrSx9PhQIr%2Fh9lILX83pNJqEDMj%2Bu5lXFgBCWmgl8iNfkgQ2DqRp0GF2rRsiSBvLgMlbq0EmU9KPR3X61bNj8Li0sohNv3BdjLVrBGqFaazboqEk41sd0ImiQTyyYJTwSosbikO0%2FtBVMfMRMIlXrWVCutxAE0WwI4nzoxm1fJWM4cPvfuBoFeISrDj2bqFcDoXoh3Pu0Orlva1mzYafX7Ba%2BE8j1lF%2FjVrwbqZxIcwYcLAM5YEo%2FQKTG7%2BAFwjBfjDxknV0VWK8YXCX0U%2BsETMlkKZU4%2Foxm5h83gyC3QSHtxSyT2%2Bq2gCYZDJgmB4e5XZRCmFOz%2BjRS%2BKbG7kIXV7Yw87PcygY6pgHZtdak7kqED38uNGblEYlxDcKOCC0aluCaWMmnTuopkwdw38vp2jzw5yz2he2HLLepRQ15qcxCwhC1l657ljK61yGH7yYYhBxjzVWcqheXjwV7Fz%2FXur4wfdNh9p3fyfggld%2BcU22bNUEBqEQDZ8tayH%2F6CHAyqnMNg5kzCQX3mKpS5pRHIkhSKsmNdhLAJjGfj3Nivt9dSVqXOgfssyP7EmrmAjxp&X-Amz-Signature=2697d5f58096e1dc76bdac9ef17ef43a1b8b54f2ffc772c1bdcd7b537886fe42&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
    isExistingFile: true,
  }
];

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
    id: 1,
    day: "SABTU",
    date: "15 FEB",
    year: 2025,
    title: "Hari Kanak-Kanak Sedunia",
    imageSrc: "/utama/calendaritem/1.png",
    imageAlt: "xxx",
    readTime: "2 min",
    link: "https://litipsum.com/",
    content:
      "Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Proin eget tortor risus. Donec rutrum congue leo eget malesuada.",
    description:
      "Sambutan khas bagi menghargai kanak-kanak serta meningkatkan kesedaran tentang hak dan kebajikan mereka.",
  },
  {
    id: 2,
    day: "ISNIN",
    date: "11 MAC",
    year: 2025,
    title: "Hari Sukan Malaysia 2025",
    imageSrc: "/utama/calendaritem/2.jpg",
    imageAlt: "xxx",
    readTime: "3 min",
    link: "https://litipsum.com/",
    content:
      "Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Proin eget tortor risus. Donec rutrum congue leo eget malesuada. Cras ultricies ligula sed magna dictum porta. Vivamus suscipit tortor eget felis porttitor volutpat.",
    description:
      "Kursus persediaan SPM percuma untuk semua calon. Daftar sekarang dan tingkatkan peluang kejayaan anda.",
  },
  {
    id: 3,
    day: "JUMAAT",
    date: "16 MEI",
    year: 2025,
    title: "Hari Guru Malaysia 2025",
    imageSrc: "/utama/calendaritem/3.jpg",
    imageAlt: "xxx",
    readTime: "4 min",
    link: "https://litipsum.com/",
    content:
      "Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Nulla quis lorem ut libero malesuada feugiat.",
    description:
      "Penghargaan kepada para pendidik atas jasa dan sumbangan mereka dalam membentuk generasi masa depan.",
  },
  {
    id: 4,
    day: "ISNIN",
    date: "11 MAC",
    year: 2025,
    title: "Hari Bapa Malaysia 2025",
    imageSrc: "/utama/calendaritem/4.jpg",
    imageAlt: "xxx",
    readTime: "2 min",
    link: "https://litipsum.com/",
    content:
      "Donec sollicitudin molestie malesuada. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi.",
    description:
      "Hari istimewa untuk menghargai peranan dan pengorbanan seorang bapa dalam institusi keluarga.",
  },
  {
    id: 5,
    day: "ISNIN",
    date: "11 MAC",
    year: 2025,
    title: "Hari Sukan Malaysia 2025",
    imageSrc: "/utama/calendaritem/2.jpg",
    imageAlt: "xxx",
    readTime: "5 min",
    link: "https://litipsum.com/",
    content:
      "Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Pellentesque in ipsum id orci porta dapibus.",
    description:
      "Program dan aktiviti sukan kebangsaan bagi menggalakkan gaya hidup sihat dalam kalangan rakyat Malaysia.",
  },
  {
    id: 6,
    day: "JUMAAT",
    date: "16 MEI",
    year: 2025,
    title: "Hari Guru Malaysia 2025",
    imageSrc: "/utama/calendaritem/3.jpg",
    imageAlt: "xxx",
    readTime: "1 min",
    link: "https://litipsum.com/",
    content:
      "Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus.",
    description:
      "Sambutan ringkas tetapi bermakna bagi mengenang jasa dan dedikasi warga pendidik.",
  },
  {
    id: 7,
    day: "ISNIN",
    date: "11 MAC",
    year: 2025,
    title: "Hari Bapa Malaysia 2025",
    imageSrc: "/utama/calendaritem/4.jpg",
    imageAlt: "xxx",
    readTime: "3 min",
    link: "https://litipsum.com/",
    content: "Sed porttitor lectus nibh. Proin eget tortor risus.",
    description:
      "Mengiktiraf peranan bapa sebagai tonggak utama dalam pembangunan keluarga dan masyarakat.",
  },
  {
    id: 8,
    day: "JUMAAT",
    date: "16 MEI",
    year: 2025,
    title: "Hari Guru Malaysia 2025",
    imageSrc: "/utama/calendaritem/3.jpg",
    imageAlt: "xxx",
    readTime: "2 min",
    link: "https://litipsum.com/",
    content:
      "Cras ultricies ligula sed magna dictum porta. Donec sollicitudin molestie malesuada.",
    description:
      "Acara tahunan bagi meraikan sumbangan guru dalam sistem pendidikan negara.",
  },
  {
    id: 9,
    day: "ISNIN",
    date: "11 MAC",
    year: 2025,
    title: "Hari Bapa Malaysia 2025",
    imageSrc: "/utama/calendaritem/4.jpg",
    imageAlt: "xxx",
    readTime: "4 min",
    link: "https://litipsum.com/",
    content:
      "Pellentesque in ipsum id orci porta dapibus. Curabitur arcu erat, accumsan id imperdiet et.",
    description:
      "Kesedaran tentang kepentingan peranan seorang bapa dalam pembangunan sahsiah anak-anak.",
  },
  {
    id: 10,
    day: "ISNIN",
    date: "11 MAC",
    year: 2025,
    title: "Hari Sukan Malaysia 2025",
    imageSrc: "/utama/calendaritem/2.jpg",
    imageAlt: "xxx",
    readTime: "1 min",
    link: "https://litipsum.com/",
    content: "Quisque velit nisi, pretium ut lacinia in, elementum id enim.",
    description:
      "Aktiviti sukan ringkas dan penyertaan komuniti bagi memupuk budaya aktif.",
  },
  {
    id: 11,
    day: "JUMAAT",
    date: "16 MEI",
    year: 2025,
    title: "Hari Guru Malaysia 2025",
    imageSrc: "/utama/calendaritem/3.jpg",
    imageAlt: "xxx",
    readTime: "5 min",
    link: "https://litipsum.com/",
    content:
      "Nulla quis lorem ut libero malesuada feugiat. Curabitur non nulla sit amet nisl tempus convallis.",
    description:
      "Pengisian program dan aktiviti khas sempena sambutan Hari Guru peringkat kebangsaan.",
  },
  {
    id: 12,
    day: "ISNIN",
    date: "11 MAC",
    year: 2025,
    title: "Hari Bapa Malaysia 2025",
    imageSrc: "/utama/calendaritem/4.jpg",
    imageAlt: "xxx",
    readTime: "2 min",
    link: "https://litipsum.com/",
    content:
      "Praesent sapien massa, convallis a pellentesque nec, egestas non nisi.",
    description:
      "Sambutan untuk menghargai kasih sayang dan pengorbanan seorang ayah.",
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
    link: "https://eoperasii.my/",
  },
  {
    icon: <JataNegaraIcon />,
    name: "e-GTukar",
    link: "https://epgo.moe.gov.my/menu/maklumat_perlu.cfm",
  },
  {
    icon: <JataNegaraIcon />,
    name: "SPL-KPM",
    link: "https://eoperasi.moe.gov.my/",
  },
  {
    icon: <JataNegaraIcon />,
    name: "EMIS",
    link: "https://emisonline.moe.gov.my/",
  },
  {
    icon: <JataNegaraIcon />,
    name: "DELIMa",
    link: "https://delima.moe-dl.edu.my/",
  },
];

export const popularLinks = [
  {
    label: "Analitik Sekolah",
    link: "/analitik",
  },
];

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
      { Segamat: [2.5147, 102.8158] },
      { Sekijang: [2.412, 102.806] },
      { Labis: [2.3865, 103.0215] },
      { Pagoh: [2.1463, 102.663] },
      { Ledang: [2.265, 102.586] },
      { Bakri: [2.04, 102.62] },
      { Muar: [2.05, 102.5679] },
      { "Parit Sulong": [1.8539, 103.0842] },
      { "Ayer Hitam": [1.9302, 103.2964] },
      { "Sri Gading": [1.851, 103.08] },
      { "Batu Pahat": [1.8534, 102.94] },
      { "Simpang Renggam": [1.8262, 103.3058] },
      { Kluang: [2.0251, 103.3317] },
      { Sembrong: [2.13, 103.5] },
      { Mersing: [2.4312, 103.8367] },
      { Tenggara: [1.675, 103.9] },
      { "Kota Tinggi": [1.7381, 103.8999] },
      { Pengerang: [1.3506, 104.0147] },
      { Tebrau: [1.5527, 103.791] },
      { "Pasir Gudang": [1.472, 103.8866] },
      { "Johor Bahru": [1.4927, 103.7414] },
      { Pulai: [1.478, 103.596] },
      { "Iskandar Puteri": [1.475, 103.667] },
      { Kulai: [1.656, 103.603] },
      { Pontian: [1.4856, 103.389] },
      { "Tanjung Piai": [1.2689, 103.5066] },
    ],
  },

  {
    name: "Kedah",
    flagFile: "Flag_of_Kedah.svg",
    districts: [
      { Langkawi: [6.3269, 99.843] },
      { Jerlun: [6.266, 100.367] },
      { "Kubang Pasu": [6.429, 100.417] },
      { "Padang Terap": [6.204, 100.606] },
      { "Pokok Sena": [6.185, 100.507] },
      { "Alor Setar": [6.121, 100.367] },
      { "Kuala Kedah": [6.078, 100.292] },
      { Pendang: [5.998, 100.478] },
      { Jerai: [5.785, 100.431] },
      { Sik: [5.802, 100.733] },
      { Merbok: [5.642, 100.487] },
      { "Sungai Petani": [5.647, 100.487] },
      { Baling: [5.679, 100.916] },
      { "Padang Serai": [5.4, 100.541] },
      { "Kulim-Bandar Baharu": [5.23, 100.53] },
    ],
  },

  {
    name: "Kelantan",
    flagFile: "Flag_of_Kelantan.svg",
    districts: [
      { Tumpat: [6.198, 102.171] },
      { "Pengkalan Chepa": [6.155, 102.293] },
      { "Kota Bharu": [6.1233, 102.2381] },
      { "Pasir Mas": [6.04, 102.139] },
      { "Rantau Panjang": [5.84, 101.97] },
      { "Kubang Kerian": [6.08, 102.285] },
      { Bachok: [5.794, 102.417] },
      { Ketereh: [5.972, 102.287] },
      { "Tanah Merah": [5.8, 102.15] },
      { "Pasir Puteh": [5.835, 102.425] },
      { Machang: [5.764, 102.22] },
      { Jeli: [5.709, 101.843] },
      { "Kuala Krai": [5.535, 102.2] },
      { "Gua Musang": [4.881, 101.965] },
    ],
  },
  {
    name: "Melaka",
    flagFile: "Flag_of_Malacca.svg",
    districts: [
      { "Masjid Tanah": [2.35, 102.117] },
      { "Alor Gajah": [2.38, 102.23] },
      { "Tangga Batu": [2.26, 102.2] },
      { "Bukit Katil": [2.216, 102.285] },
      { "Kota Melaka": [2.19, 102.25] },
      { Jasin: [2.3, 102.43] },
    ],
  },

  {
    name: "Negeri Sembilan",
    flagFile: "Flag_of_Negeri_Sembilan.svg",
    districts: [
      { Jelebu: [3.05, 102.05] },
      { Jempol: [2.7, 102.4] },
      { Seremban: [2.725, 101.938] },
      { "Kuala Pilah": [2.73, 102.25] },
      { Rasah: [2.71, 101.94] },
      { Rembau: [2.6, 102.083] },
      { "Telok Kemang": [2.52, 101.8] },
      { Tampin: [2.47, 102.23] },
    ],
  },

  {
    name: "Pahang",
    flagFile: "Flag_of_Pahang.svg",
    districts: [
      { "Cameron Highlands": [4.471, 101.393] },
      { Lipis: [4.184, 102.047] },
      { Raub: [3.793, 101.857] },
      { Jerantut: [3.936, 102.362] },
      { "Indera Mahkota": [3.84, 103.34] },
      { Kuantan: [3.807, 103.326] },
      { "Paya Besar": [3.74, 103.28] },
      { Pekan: [3.5, 103.39] },
      { Maran: [3.56, 102.77] },
      { "Kuala Krau": [3.55, 102.2] },
      { Temerloh: [3.43, 102.15] },
      { Bentong: [3.534, 101.91] },
      { Bera: [3.111, 102.417] },
      { Rompin: [2.71, 103.43] },
    ],
  },

  {
    name: "Perak",
    flagFile: "Flag_of_Perak.svg",
    districts: [
      { Gerik: [5.42, 101.132] },
      { Lenggong: [5.05, 100.97] },
      { Larut: [4.85, 100.73] },
      { "Parit Buntar": [5.125, 100.493] },
      { "Bagan Serai": [5.0, 100.55] },
      { "Bukit Gantang": [4.85, 100.733] },
      { Taiping: [4.85, 100.733] },
      { "Padang Rengas": [4.85, 100.95] },
      { "Sungai Siput": [4.765, 101.061] },
      { Tambun: [4.625, 101.144] },
      { "Ipoh Timur": [4.61, 101.115] },
      { "Ipoh Barat": [4.597, 101.064] },
      { "Batu Gajah": [4.47, 101.05] },
      { "Kuala Kangsar": [4.775, 100.94] },
      { Beruas: [4.35, 100.7] },
      { Parit: [4.45, 100.9] },
      { Kampar: [4.315, 101.15] },
      { Gopeng: [4.472, 101.165] },
      { Tapah: [4.202, 101.265] },
      { "Pasir Salak": [4.17, 100.88] },
      { Lumut: [4.23, 100.63] },
      { "Bagan Datuk": [3.98, 100.9] },
      { "Teluk Intan": [4.022, 101.02] },
      { "Tanjong Malim": [3.683, 101.53] },
    ],
  },
  {
    name: "Perlis",
    flagFile: "Flag_of_Perlis.svg",
    districts: [
      { "Padang Besar": [6.661, 100.316] },
      { Kangar: [6.433, 100.199] },
      { Arau: [6.433, 100.277] },
    ],
  },

  {
    name: "Pulau Pinang",
    flagFile: "Flag_of_Penang_(Malaysia).svg",
    districts: [
      { "Kepala Batas": [5.517, 100.43] },
      { "Tasek Gelugor": [5.48, 100.49] },
      { Bagan: [5.45, 100.38] },
      { "Permatang Pauh": [5.38, 100.41] },
      { "Bukit Mertajam": [5.36, 100.47] },
      { "Batu Kawan": [5.28, 100.45] },
      { "Nibong Tebal": [5.17, 100.49] },
      { "Bukit Bendera": [5.43, 100.29] },
      { Tanjong: [5.43, 100.33] },
      { Jelutong: [5.39, 100.32] },
      { "Bukit Gelugor": [5.37, 100.3] },
      { "Bayan Baru": [5.32, 100.3] },
      { "Balik Pulau": [5.32, 100.22] },
    ],
  },

  {
    name: "Sabah",
    flagFile: "Flag_of_Sabah.svg",
    districts: [
      { Kudat: [6.887, 116.828] },
      { "Kota Marudu": [6.503, 116.779] },
      { "Kota Belud": [6.35, 116.6] },
      { Tuaran: [6.13, 116.18] },
      { Sepanggar: [6.053, 116.115] },
      { "Kota Kinabalu": [5.98, 116.073] },
      { Putatan: [5.915, 116.05] },
      { Penampang: [5.905, 116.1] },
      { Papar: [5.733, 116.033] },
      { Kimanis: [5.31, 115.93] },
      { Beaufort: [5.346, 115.74] },
      { Sipitang: [5.073, 115.56] },
      { Ranau: [5.96, 116.665] },
      { Keningau: [5.338, 116.16] },
      { Tenom: [4.923, 115.942] },
      { Pensiangan: [4.385, 116.195] },
      { Beluran: [6.35, 117.5] },
      { Libaran: [5.92, 118.07] },
      { "Batu Sapi": [5.83, 118.12] },
      { Sandakan: [5.845, 118.11] },
      { Kinabatangan: [5.305, 117.997] },
      { "Lahad Datu": [5.02, 118.33] },
      { Semporna: [4.483, 118.609] },
      { Tawau: [4.244, 117.882] },
      { Kalabakan: [4.609, 117.489] },
    ],
  },

  {
    name: "Sarawak",
    flagFile: "Flag_of_Sarawak.svg",
    districts: [
      { "Mas Gading": [1.446, 110.2] },
      { Santubong: [1.776, 110.335] },
      { "Petra Jaya": [1.576, 110.34] },
      { "Bandar Kuching": [1.56, 110.345] },
      { Stampin: [1.52, 110.365] },
      { "Kota Samarahan": [1.456, 110.379] },
      { "Puncak Borneo": [1.223, 110.224] },
      { Serian: [1.202, 110.433] },
      { "Batang Sadong": [1.716, 110.62] },
      { "Batang Lupar": [1.54, 111.24] },
      { "Sri Aman": [1.238, 111.452] },
      { "Lubok Antu": [1.134, 112.05] },
      { Betong: [1.403, 111.384] },
      { Saratok: [1.797, 111.233] },
      { "Tanjong Manis": [2.128, 111.209] },
      { Igan: [2.043, 111.608] },
      { Sarikei: [2.13, 111.52] },
      { Julau: [2.001, 112.06] },
      { Kanowit: [2.138, 112.268] },
      { Lanang: [2.3, 111.82] },
      { Sibu: [2.287, 111.83] },
      { Mukah: [2.9, 112.09] },
      { Selangau: [2.62, 112.235] },
      { Kapit: [2.023, 112.936] },
      { "Hulu Rajang": [2.5, 113.5] },
      { Bintulu: [3.17, 113.03] },
      { Sibuti: [4.08, 113.59] },
      { Miri: [4.398, 113.993] },
      { Baram: [4.35, 115.0] },
      { Limbang: [4.75, 115.0] },
      { Lawas: [4.9, 115.41] },
    ],
  },

  {
    name: "Selangor",
    flagFile: "Flag_of_Selangor.svg",
    districts: [
      { "Sabak Bernam": [3.6775, 100.9866] },
      { "Sungai Besar": [3.674, 100.99] },
      { "Hulu Selangor": [3.5763, 101.6544] },
      { "Tanjong Karang": [3.4309, 101.2425] },
      { "Kuala Selangor": [3.342, 101.25] },
      { Selayang: [3.3216, 101.6517] },
      { Gombak: [3.2379, 101.6865] },
      { Ampang: [3.1517, 101.7612] },
      { Pandan: [3.137, 101.77] },
      { "Hulu Langat": [3.0899, 101.787] },
      { Bangi: [2.957, 101.769] },
      { Puchong: [3.0226, 101.6167] },
      { Subang: [3.081, 101.533] },
      { "Petaling Jaya": [3.1073, 101.6067] },
      { Damansara: [3.146, 101.586] },
      { "Sungai Buloh": [3.2087, 101.5586] },
      { "Shah Alam": [3.0733, 101.5185] },
      { Kapar: [3.0853, 101.4348] },
      { Klang: [3.0439, 101.4467] },
      { "Kota Raja": [2.998, 101.473] },
      { "Kuala Langat": [2.864, 101.55] },
      { Sepang: [2.693, 101.749] },
    ],
  },
  {
    name: "Terengganu",
    flagFile: "Flag_of_Terengganu.svg",
    districts: [
      { Besut: [5.532, 102.546] },
      { Setiu: [5.65, 102.75] },
      { "Kuala Nerus": [5.305, 103.067] },
      { "Kuala Terengganu": [5.33, 103.14] },
      { Marang: [5.205, 103.23] },
      { "Hulu Terengganu": [5.07, 102.78] },
      { Dungun: [4.76, 103.42] },
      { Kemaman: [4.23, 103.42] },
    ],
  },

  {
    name: "Wilayah Persekutuan Kuala Lumpur",
    flagFile: "Flag_of_the_Federal_Territories_of_Malaysia.svg",
    districts: [
      { Kepong: [3.219, 101.64] },
      { Batu: [3.22, 101.68] },
      { "Wangsa Maju": [3.2, 101.75] },
      { Segambut: [3.188, 101.66] },
      { Setiawangsa: [3.162, 101.75] },
      { Titiwangsa: [3.174, 101.71] },
      { "Bukit Bintang": [3.146, 101.709] },
      { "Lembah Pantai": [3.116, 101.665] },
      { Seputeh: [3.099, 101.684] },
      { Cheras: [3.082, 101.741] },
      { "Bandar Tun Razak": [3.086, 101.729] },
    ],
  },

  {
    name: "Wilayah Persekutuan Labuan",
    flagFile: "Flag_of_Labuan.svg",
    districts: [{ Labuan: [5.283, 115.241] }],
  },

  {
    name: "Wilayah Persekutuan Putrajaya",
    flagFile: "Flag_of_Putrajaya.svg",
    districts: ["Putrajaya"],
  },
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
  },
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
            koordinatXX: 3.158,
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

export const notableMalaysians = [
  // Arts
  {
    name: "Michelle Yeoh",
    field: "Arts",
    note: "Internationally acclaimed actress",
  },
  {
    name: "P. Ramlee",
    field: "Arts",
    note: "Iconic actor, director, and musician",
  },
  {
    name: "Siti Nurhaliza",
    field: "Arts",
    note: "Award-winning singer and songwriter",
  },
];
