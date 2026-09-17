import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  SearchIcon,
  ArrowForwardIcon,
  ArrowOutgoingIcon,
  GovtOfficeIcon,
  BookIcon,
} from "@govtechmy/myds-react/icon";
import HelmetMeta from "../seo/HelmetMeta";
import PageContainer from "../components/layout/PageContainer";
import {
  SimpleSelect,
  SimpleSelectItem,
} from "../components/shared/SelectComponent";

type Jenis = "Biasiswa" | "Pinjaman" | "Bantuan Kewangan";
type Peringkat =
  | "Pra-Universiti"
  | "TVET / Diploma"
  | "Ijazah Sarjana Muda"
  | "Pelbagai Peringkat";

type Program = {
  name: string;
  provider: string;
  jenis: Jenis;
  peringkat: Peringkat;
  href: string;
  thumbnail?: string;
};

const PROGRAMS: Program[] = [
  {
    name: "Program Penajaan Nasional PPN",
    provider: "Jabatan Perkhidmatan Awam",
    jenis: "Biasiswa",
    peringkat: "Pra-Universiti",
    href: "https://penajaan.jpa.gov.my/index.php/info-penajaan/latihan-sebelum-perkhidmatan/program-pelajar/program-penajaan-nasional-ppn",
    thumbnail: "/utama/bantuan/shot-1.png",
  },
  {
    name: "Program Khas Lepasan Sijil Pelajaran Malaysia Dalam Negara LSPM",
    provider: "Jabatan Perkhidmatan Awam",
    jenis: "Biasiswa",
    peringkat: "Pra-Universiti",
    href: "https://penajaan.jpa.gov.my/info-penajaan/latihan-sebelum-perkhidmatan/program-pelajar/program-khas-lepasan-sijil-pelajaran-malaysia-dalam-negara-lspm.html",
    thumbnail: "/utama/bantuan/shot-2.png",
  },
  {
    name: "Program Khas Jepun Korea Perancis dan Jerman JKPJ",
    provider: "Jabatan Perkhidmatan Awam",
    jenis: "Biasiswa",
    peringkat: "Pra-Universiti",
    href: "https://penajaan.jpa.gov.my/info-penajaan/latihan-sebelum-perkhidmatan/program-pelajar/program-khas-jepun-korea-perancis-dan-jerman-jkpj.html",
    thumbnail: "/utama/bantuan/shot-3.png",
  },
  {
    name: "Program Ijazah Dalam Negara PIDN",
    provider: "Jabatan Perkhidmatan Awam",
    jenis: "Biasiswa",
    peringkat: "Ijazah Sarjana Muda",
    href: "https://penajaan.jpa.gov.my/info-penajaan/latihan-sebelum-perkhidmatan/program-pelajar/program-ijazah-dalam-negara-pidn.html",
    thumbnail: "/utama/bantuan/shot-4.png",
  },
  {
    name: "Program Khas Perubatan Pergigian dan Farmasi Ijazah Pertama PPF1",
    provider: "Jabatan Perkhidmatan Awam",
    jenis: "Biasiswa",
    peringkat: "Ijazah Sarjana Muda",
    href: "https://penajaan.jpa.gov.my/info-penajaan/latihan-sebelum-perkhidmatan/program-pelajar/program-khas-perubatan-pergigian-dan-farmasi-ijazah-pertama-ppf1.html",
    thumbnail: "/utama/bantuan/shot-5.png",
  },
  {
    name: "Dermasiswa B40",
    provider: "Jabatan Perkhidmatan Awam",
    jenis: "Bantuan Kewangan",
    peringkat: "Ijazah Sarjana Muda",
    href: "https://penajaan.jpa.gov.my/index.php/info-penajaan/latihan-sebelum-perkhidmatan/program-pelajar/program-dermasiswa-b40-db40",
    thumbnail: "/utama/bantuan/shot-6.png",
  },
  {
    name: "Program Pembangunan Bakat Muda YTP",
    provider: "Majlis Amanah Rakyat",
    jenis: "Biasiswa",
    peringkat: "Pelbagai Peringkat",
    href: "https://www.mara.gov.my/bm/pendidikan/pembiayaan-pelajaran/peringkat-persediaan/",
    thumbnail: "/utama/bantuan/shot-7.png",
  },
  {
    name: "Program Pinjaman Pelajaran Tertiari TESP",
    provider: "Majlis Amanah Rakyat",
    jenis: "Pinjaman",
    peringkat: "Ijazah Sarjana Muda",
    href: "https://www.mara.gov.my/bm/pendidikan/pembiayaan-pelajaran/peringkat-diploma-ijazah/#",
    thumbnail: "/utama/bantuan/shot-8.png",
  },
  {
    name: "Program Pelajar Cemerlang IPMa",
    provider: "Majlis Amanah Rakyat",
    jenis: "Biasiswa",
    peringkat: "Pra-Universiti",
    href: "https://www.mara.gov.my/bm/pendidikan/pembiayaan-pelajaran/peringkat-diploma-ijazah/#tab-id-4",
    thumbnail: "/utama/bantuan/shot-9.png",
  },
  {
    name: "Biasiswa Kijang",
    provider: "Bank Negara Malaysia",
    jenis: "Biasiswa",
    peringkat: "Ijazah Sarjana Muda",
    href: "https://www.bnm.gov.my/careers/scholarships",
    thumbnail: "/utama/bantuan/shot-10.png",
  },
  {
    name: "PETRONAS Education Sponsorship Programme PESP",
    provider: "PETRONAS",
    jenis: "Biasiswa",
    peringkat: "Ijazah Sarjana Muda",
    href: "https://educationsponsorship.petronas.com.my/OAS",
    thumbnail: "/utama/bantuan/shot-11.png",
  },
  {
    name: "Program Biasiswa Khazanah",
    provider: "Yayasan Khazanah",
    jenis: "Biasiswa",
    peringkat: "Ijazah Sarjana Muda",
    href: "https://www.yayasankhazanah.com.my/scholarship-programmes",
    thumbnail: "/utama/bantuan/shot-12.png",
  },
  {
    name: "TNB Prime Scholarship",
    provider: "Yayasan Tenaga Nasional",
    jenis: "Biasiswa",
    peringkat: "Ijazah Sarjana Muda",
    href: "https://ytn.tnb.com.my/biasiswa-prime-scholarship/",
    thumbnail: "/utama/bantuan/shot-13.png",
  },
  {
    name: "Shell Malaysia Scholarship Programme",
    provider: "Shell Malaysia",
    jenis: "Biasiswa",
    peringkat: "Ijazah Sarjana Muda",
    href: "https://www.shell.com.my/careers/students-and-graduates/scholarships.html",
  },
  {
    name: "MMU Undergraduate Excellence Scholarship",
    provider: "Multimedia University",
    jenis: "Biasiswa",
    peringkat: "Ijazah Sarjana Muda",
    href: "https://www.mmu.edu.my/mmu-scholarship/#ug-local",
    thumbnail: "/utama/bantuan/shot-15.png",
  },
  {
    name: "Program Pinjaman Lepasan Sekolah",
    provider: "Perbadanan Tabung Pembangunan Kemahiran",
    jenis: "Pinjaman",
    peringkat: "TVET / Diploma",
    href: "https://www.ptpk.gov.my/loan-repayment/item/325-program-pinjaman-lepasan-sekolah",
    thumbnail: "/utama/bantuan/shot-16.png",
  },
  {
    name: "Program Pinjaman Pekerja",
    provider: "Perbadanan Tabung Pembangunan Kemahiran",
    jenis: "Pinjaman",
    peringkat: "TVET / Diploma",
    href: "https://www.ptpk.gov.my/loan-repayment/item/324-program-pinjaman-pekerja",
    thumbnail: "/utama/bantuan/shot-17.png",
  },
  {
    name: "Pinjaman Latihan Kemahiran Islamik PLK-i",
    provider: "Perbadanan Tabung Pembangunan Kemahiran",
    jenis: "Pinjaman",
    peringkat: "TVET / Diploma",
    href: "https://www.ptpk.gov.my/announcement/item/289-training-loan-plk-i",
    thumbnail: "/utama/bantuan/shot-18.png",
  },
  {
    name: "Bantuan Kewangan Pelajar Kolej Komuniti BKPKK",
    provider: "Kementerian Pendidikan Tinggi",
    jenis: "Bantuan Kewangan",
    peringkat: "TVET / Diploma",
    href: "https://biasiswa.mohe.gov.my/biasiswa/index_penajaan.php",
    thumbnail: "/utama/bantuan/shot-19.png",
  },
  {
    name: "Bantuan Kewangan Asasi Universiti Awam",
    provider: "Kementerian Pendidikan Tinggi",
    jenis: "Bantuan Kewangan",
    peringkat: "Pra-Universiti",
    href: "https://biasiswa.mohe.gov.my/biasiswa/index_penajaan.php",
    thumbnail: "/utama/bantuan/shot-20.png",
  },
  {
    name: "Bantuan Kewangan Asasi TVET",
    provider: "Kementerian Pendidikan Tinggi",
    jenis: "Bantuan Kewangan",
    peringkat: "TVET / Diploma",
    href: "https://biasiswa.mohe.gov.my/biasiswa/index_penajaan.php",
    thumbnail: "/utama/bantuan/shot-21.png",
  },
  {
    name: "Bantuan Kewangan OKU BKOKU",
    provider: "Kementerian Pendidikan Tinggi",
    jenis: "Bantuan Kewangan",
    peringkat: "Pelbagai Peringkat",
    href: "https://bkoku.mohe.gov.my/",
    thumbnail: "/utama/bantuan/shot-22.png",
  },
  {
    name: "Program Pendidikan Khas PPK",
    provider: "Kementerian Pendidikan Tinggi",
    jenis: "Bantuan Kewangan",
    peringkat: "Pelbagai Peringkat",
    href: "https://bkoku.mohe.gov.my/",
    thumbnail: "/utama/bantuan/shot-23.png",
  },
  {
    name: "Pinjaman Pendidikan PTPTN",
    provider: "Perbadanan Tabung Pendidikan Tinggi Nasional",
    jenis: "Pinjaman",
    peringkat: "Ijazah Sarjana Muda",
    href: "https://www.ptptn.gov.my/",
    thumbnail: "/utama/bantuan/shot-24.png",
  },
];

const PROVIDERS = Array.from(new Set(PROGRAMS.map((p) => p.provider)));
const JENIS_LIST: Jenis[] = ["Biasiswa", "Pinjaman", "Bantuan Kewangan"];
const PERINGKAT_LIST: Peringkat[] = [
  "Pra-Universiti",
  "TVET / Diploma",
  "Ijazah Sarjana Muda",
  "Pelbagai Peringkat",
];

export default function BantuanPersekolahan() {
  const { lang } = useParams<{ lang: string }>();
  const domain = import.meta.env.VITE_DOMAIN_NAME;

  const [query, setQuery] = useState("");
  const [provider, setProvider] = useState("ALL");
  const [jenis, setJenis] = useState("ALL");
  const [peringkat, setPeringkat] = useState("ALL");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROGRAMS.filter((p) => {
      if (provider !== "ALL" && p.provider !== provider) return false;
      if (jenis !== "ALL" && p.jenis !== jenis) return false;
      if (peringkat !== "ALL" && p.peringkat !== peringkat) return false;
      if (
        q &&
        !p.name.toLowerCase().includes(q) &&
        !p.provider.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [query, provider, jenis, peringkat]);

  return (
    <>
      <HelmetMeta
        title="Bantuan Persekolahan - SekolahKu"
        description="Senarai penajaan, biasiswa dan pinjaman pendidikan daripada agensi kerajaan dan syarikat."
        canonical={`${domain}/${lang}/bantuan-persekolahan`}
      />

      {/* Hero */}
      <section className="relative overflow-hidden rounded-b-[32px] bg-[#EAF2FE]">
        <div className="absolute inset-0 bg-[url('/utama/Bantuan.png')] bg-cover bg-center bg-no-repeat" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(115% 75% at 50% 26%, #FFFFFFEB 0%, #FFFFFFB8 60%, #FFFFFF00 100%), linear-gradient(0deg, #FFFFFF 0%, #FFFFFFD9 8%, #FFFFFF40 20%, #FFFFFF00 48%, #FFFFFF00 100%)",
          }}
        />
        <div className="relative mx-auto flex min-h-[640px] max-w-[1280px] flex-col items-center gap-5 px-[18px] pb-32 pt-16 text-center md:px-6">
          <div className="flex flex-col items-center gap-1">
            <span className="font-body text-xs font-bold tracking-[1.5px] text-[#0B4FCC]">
              PANDUAN PEMBIAYAAN PENDIDIKAN
            </span>
            <h1 className="font-heading text-[32px] font-extrabold leading-tight text-[#0A1930] md:text-[38px]">
              Bantuan Persekolahan
            </h1>
          </div>

          <div className="w-full max-w-[760px] rounded-[20px] border border-[#DCE6F5] bg-white p-5 shadow-xl">
            <div className="flex w-full items-center gap-2.5 rounded-[14px] bg-[#F7F8FA] py-2 pl-4 pr-2">
              <SearchIcon className="size-[18px] shrink-0 text-txt-black-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari bantuan, biasiswa atau penyedia..."
                className="min-w-0 flex-1 bg-transparent font-body text-sm text-txt-black-900 outline-none placeholder:text-txt-black-500"
              />
              <button
                type="button"
                className="flex shrink-0 items-center gap-1.5 rounded-[10px] bg-[#0062FF] px-5 py-2.5 font-body text-[13px] font-bold text-white transition hover:bg-[#0052D6]"
              >
                Cari
                <ArrowForwardIcon className="size-3.5" />
              </button>
            </div>

            <div className="mt-3.5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5 text-left">
                <label
                  htmlFor="bantuan-filter-penyedia"
                  className="font-body text-[10px] font-bold tracking-[0.5px] text-txt-black-500"
                >
                  Penyedia
                </label>
                <SimpleSelect
                  id="bantuan-filter-penyedia"
                  size="medium"
                  variant="outline"
                  value={provider}
                  onValueChange={setProvider}
                  placeholder="Semua Penyedia"
                  className="w-full"
                >
                  <SimpleSelectItem value="ALL">
                    Semua Penyedia
                  </SimpleSelectItem>
                  {PROVIDERS.map((p) => (
                    <SimpleSelectItem key={p} value={p}>
                      {p}
                    </SimpleSelectItem>
                  ))}
                </SimpleSelect>
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label
                  htmlFor="bantuan-filter-jenis"
                  className="font-body text-[10px] font-bold tracking-[0.5px] text-txt-black-500"
                >
                  Jenis Bantuan
                </label>
                <SimpleSelect
                  id="bantuan-filter-jenis"
                  size="medium"
                  variant="outline"
                  value={jenis}
                  onValueChange={setJenis}
                  placeholder="Semua Jenis"
                  className="w-full"
                >
                  <SimpleSelectItem value="ALL">Semua Jenis</SimpleSelectItem>
                  {JENIS_LIST.map((j) => (
                    <SimpleSelectItem key={j} value={j}>
                      {j}
                    </SimpleSelectItem>
                  ))}
                </SimpleSelect>
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label
                  htmlFor="bantuan-filter-peringkat"
                  className="font-body text-[10px] font-bold tracking-[0.5px] text-txt-black-500"
                >
                  Peringkat Pengajian
                </label>
                <SimpleSelect
                  id="bantuan-filter-peringkat"
                  size="medium"
                  variant="outline"
                  value={peringkat}
                  onValueChange={setPeringkat}
                  placeholder="Semua Peringkat"
                  className="w-full"
                >
                  <SimpleSelectItem value="ALL">
                    Semua Peringkat
                  </SimpleSelectItem>
                  {PERINGKAT_LIST.map((p) => (
                    <SimpleSelectItem key={p} value={p}>
                      {p}
                    </SimpleSelectItem>
                  ))}
                </SimpleSelect>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PageContainer className="px-[18px] md:px-6">
        <div className="flex flex-col gap-8 py-12">
          <div className="flex flex-col gap-1.5">
            <span className="font-body text-xs font-bold tracking-[1.5px] text-[#0062FF]">
              PENAJAAN & BANTUAN KEWANGAN
            </span>
            <h2 className="font-heading text-2xl font-bold text-txt-black-900 md:text-[28px]">
              {filtered.length} Program Bantuan Tersedia
            </h2>
            <p className="max-w-[760px] font-body text-sm text-txt-black-500">
              Senarai penajaan, biasiswa dan pinjaman pendidikan daripada agensi
              kerajaan dan syarikat. Klik mana-mana kad untuk ke portal rasmi.
            </p>
          </div>

          {filtered.length === 0 ? (
            <p className="font-body text-sm text-txt-black-500">
              Tiada program dijumpai.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <a
                  key={p.name}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col overflow-hidden rounded-2xl border border-otl-divider bg-bg-white shadow-sm transition hover:shadow-md"
                >
                  {p.thumbnail ? (
                    <div
                      className="h-[120px] w-full bg-[#EAF2FE] bg-cover bg-center"
                      style={{ backgroundImage: `url('${p.thumbnail}')` }}
                    />
                  ) : (
                    <div className="flex h-[120px] w-full flex-col items-center justify-center gap-2 bg-[#FBE7E3]">
                      <div className="flex size-[52px] items-center justify-center rounded-xl bg-white p-2 shadow-md">
                        <img
                          src="https://icons.duckduckgo.com/ip3/shell.com.my.ico"
                          alt=""
                          className="size-full object-contain"
                        />
                      </div>
                      <span className="font-heading text-lg font-extrabold text-[#D42E12]">
                        Shell Malaysia
                      </span>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-1.5 p-3.5">
                    <div className="flex flex-1 flex-col gap-1.5">
                      <span className="font-body text-[13px] font-bold leading-tight text-txt-black-900">
                        {p.name}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <GovtOfficeIcon className="size-3 shrink-0 text-txt-black-500" />
                        <span className="font-body text-[11px] text-txt-black-500">
                          {p.provider}
                        </span>
                      </div>
                    </div>
                    <div className="h-px w-full bg-otl-divider" />
                    <div className="flex items-center gap-1.5">
                      <span className="font-body text-xs font-bold text-[#0062FF]">
                        Buka portal rasmi
                      </span>
                      <ArrowOutgoingIcon className="size-3.5 text-[#0062FF]" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          <section className="flex gap-5 rounded-2xl border border-otl-divider bg-bg-white p-6">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[#E7EAF1]">
              <BookIcon className="size-5 text-txt-black-700" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="font-heading text-lg font-bold text-txt-black-900">
                Rujukan
              </h2>
              <p className="font-body text-sm text-txt-black-500">
                Senarai {PROGRAMS.length} program di halaman ini diadaptasi
                daripada portal rasmi malaysia.gov.my. Setiap kad memaut terus
                ke portal penyedia masing-masing.
              </p>
              <a
                href="https://www.malaysia.gov.my/my/categories/sekolah--pendidikan/penajaan-dan-bantuan-kewangan"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1.5 font-body text-sm font-semibold text-[#0062FF] hover:underline"
              >
                <ArrowOutgoingIcon className="size-3.5" />
                Penajaan dan Bantuan Kewangan — malaysia.gov.my
              </a>
            </div>
          </section>
        </div>
      </PageContainer>
    </>
  );
}
