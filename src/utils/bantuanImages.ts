// Maps each Bantuan Persekolahan program slug to its illustration, exported
// from the design.pen mockup's AI-generated card art (the CMS content has no
// image field of its own) and re-encoded as JPEG for web-appropriate size.
const BANTUAN_IMAGE_BASE = "/utama/bantuan";

const BANTUAN_IMAGE_MAP: Record<string, string> = {
  "bantuan-perjalanan-dan-pengangkutan-murid-ppm": `${BANTUAN_IMAGE_BASE}/bantuan-perjalanan-dan-pengangkutan-murid-ppm.jpg`,
  "program-susu-sekolah-pss": `${BANTUAN_IMAGE_BASE}/program-susu-sekolah-pss.jpg`,
  "program-3k3c": `${BANTUAN_IMAGE_BASE}/program-3k3c.jpg`,
  "bantuan-geran-per-kapita-pcg": `${BANTUAN_IMAGE_BASE}/bantuan-geran-per-kapita-pcg.jpg`,
  "bantuan-prasekolah": `${BANTUAN_IMAGE_BASE}/bantuan-prasekolah.jpg`,
  "bantuan-sukan": `${BANTUAN_IMAGE_BASE}/bantuan-sukan.jpg`,
  "elaun-murid-berkeperluan-khas-embpk": `${BANTUAN_IMAGE_BASE}/elaun-murid-berkeperluan-khas-embpk.jpg`,
  "elaun-prauniversiti-epu": `${BANTUAN_IMAGE_BASE}/elaun-prauniversiti-epu.jpg`,
  "bantuan-makanan-asrama-bma": `${BANTUAN_IMAGE_BASE}/bantuan-makanan-asrama-bma.jpg`,
  "rancangan-makanan-tambahan": `${BANTUAN_IMAGE_BASE}/rancangan-makanan-tambahan.jpg`,
  "bantuan-pcg-bukan-mata-pelajaran": `${BANTUAN_IMAGE_BASE}/bantuan-pcg-bukan-mata-pelajaran.jpg`,
  "kelas-dewasa-ibu-bapa-orang-asli-dan-penan-kedap": `${BANTUAN_IMAGE_BASE}/kelas-dewasa-ibu-bapa-orang-asli-dan-penan-kedap.jpg`,
  "projek-khas-murid-sekolah-berasrama-penuh-pksbp": `${BANTUAN_IMAGE_BASE}/projek-khas-murid-sekolah-berasrama-penuh-pksbp.jpg`,
  "bantuan-jaket-keselamatan-murid-jkm": `${BANTUAN_IMAGE_BASE}/bantuan-jaket-keselamatan-murid-jkm.jpg`,
  "bantuan-kecil-persekutuan": `${BANTUAN_IMAGE_BASE}/bantuan-kecil-persekutuan.jpg`,
  "biasiswa-sukan-bs": `${BANTUAN_IMAGE_BASE}/biasiswa-sukan-bs.jpg`,
  "bantuan-kumpulan-wang-amanah-pelajar-miskin-kwapm": `${BANTUAN_IMAGE_BASE}/bantuan-kumpulan-wang-amanah-pelajar-miskin-kwapm.jpg`,
  "pengurusan-asrama-harian-2": `${BANTUAN_IMAGE_BASE}/pengurusan-asrama-harian-2.jpg`,
  "bantuan-awal-persekolahan": `${BANTUAN_IMAGE_BASE}/bantuan-awal-persekolahan.jpg`,
  "bantuan-kokurikulum": `${BANTUAN_IMAGE_BASE}/bantuan-kokurikulum.jpg`,
};

// Kept only as a last-resort guard (e.g. a future slug added to the CMS
// before its illustration is exported) — every current slug above resolves.
export const BANTUAN_IMAGE_FALLBACK = `${BANTUAN_IMAGE_BASE}/default.svg`;

export function getBantuanImage(slug: string): string {
  return BANTUAN_IMAGE_MAP[slug] ?? BANTUAN_IMAGE_FALLBACK;
}
