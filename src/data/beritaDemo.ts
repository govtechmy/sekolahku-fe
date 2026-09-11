// Dev-only fallback for the Berita (news) section.
//
// News cards need a CMS-hosted image (and the category tag overlays that image),
// so dummy DB rows can't reproduce the look locally. In development, when the
// API returns no siaran, we show this sample content with working images so the
// full home layout is visible. Gated by `import.meta.env.DEV` — never used in
// production, where real siaran data is present.
import type { NewsCardItem } from "../components/shared/NewsCard";

const demoImage =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80";

export const DEMO_BERITA = [
  {
    _id: "demo-1",
    title:
      "KPM Memperkasakan Inisiatif Pendidikan Digital & Kebajikan Murid Luar Bandar",
    articleDate: "2026-04-20",
    imageHero: { url: demoImage, alt: "Berita" },
    categoryInfo: { name: "Kenyataan Media", colors: "#E5484D" },
  },
  {
    _id: "demo-2",
    title: "Jadual Sesi Penggal Persekolahan & Cuti Perayaan Kalendar Terkini",
    articleDate: "2026-04-18",
    imageHero: { url: demoImage, alt: "Berita" },
    categoryInfo: { name: "Pengumuman", colors: "#2FA36B" },
  },
  {
    _id: "demo-3",
    title: "Pelancaran Modul DELIMa 3.0 untuk Pembelajaran Digital Menyeluruh",
    articleDate: "2026-04-15",
    imageHero: { url: demoImage, alt: "Berita" },
    categoryInfo: { name: "Berita", colors: "#4F86F7" },
  },
  {
    _id: "demo-4",
    title: "Permohonan Bantuan Awal Persekolahan (BAP) 2026 Kini Dibuka",
    articleDate: "2026-04-12",
    imageHero: { url: demoImage, alt: "Berita" },
    categoryInfo: { name: "Bantuan", colors: "#F59E0B" },
  },
] satisfies NewsCardItem[];
