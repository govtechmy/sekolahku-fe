import { useParams } from "react-router-dom";
import { Button, ButtonIcon } from "@govtechmy/myds-react/button";
import {
  ReloadIcon,
  GlobeIcon,
  CheckCircleIcon,
  UserIcon,
  DocumentIcon,
  CheckShieldIcon,
  ArrowOutgoingIcon,
  BookIcon,
  QuestionCircleIcon,
} from "@govtechmy/myds-react/icon";
import HelmetMeta from "../seo/HelmetMeta";
import PageContainer from "../components/layout/PageContainer";

type ChecklistSection = {
  Icon: typeof CheckCircleIcon;
  iconBg: string;
  accent: string;
  title: string;
  items: string[];
};

const SECTIONS: ChecklistSection[] = [
  {
    Icon: UserIcon,
    iconBg: "#E7F0FE",
    accent: "#0062FF",
    title: "Syarat Kelayakan",
    items: [
      "Kanak-kanak mestilah warganegara Malaysia",
      "Tarikh Lahir: Pastikan anak anda lahir pada tahun kelayakan sesi persekolahan yang ingin didaftarkan",
      "Tarikh buka dan tutup pendaftaran: Anda perlu mengambil maklum mengenai tarikh buka dan tutup pendaftaran di portal KPM",
    ],
  },
  {
    Icon: DocumentIcon,
    iconBg: "#F1EEFE",
    accent: "#A78BFA",
    title: "Dokumen Sokongan",
    items: [
      "Sijil lahir anak",
      "Kad pengenalan ibu bapa atau penjaga",
      "Bukti alamat tempat tinggal seperti bil utiliti terkini",
      "Dokumen sekiranya berkaitan seperti surat perakuan penjagaan",
      "Dokumen sokongan perlu dimuat naik semasa proses permohonan dalam talian",
    ],
  },
  {
    Icon: CheckShieldIcon,
    iconBg: "#E6F7F5",
    accent: "#14B8A6",
    title: "Semakan Penempatan dan Rayuan",
    items: [
      "Semakan penempatan dan rayuan pertukaran boleh dibuat secara dalam talian dalam tempoh yang ditetapkan.",
      "Sekiranya anda menghadapi masalah atau mempunyai sebarang pertanyaan lanjut, anda boleh menghubungi Pejabat Pendidikan Daerah (PPD) atau Jabatan Pendidikan Negeri (JPN) yang berdekatan.",
    ],
  },
];

export default function KemasukanTahun1() {
  const { lang } = useParams<{ lang: string }>();
  const domain = import.meta.env.VITE_DOMAIN_NAME;

  return (
    <>
      <HelmetMeta
        title="Kemasukan Tahun 1 - SekolahKu"
        description="Panduan permohonan kemasukan anak ke Tahun 1 — syarat kelayakan, dokumen sokongan dan semakan penempatan."
        canonical={`${domain}/${lang}/kemasukan-tahun-1`}
      />

      {/* Hero */}
      <section className="relative overflow-hidden rounded-b-[32px] bg-[#EAF2FE]">
        <div className="absolute inset-0 bg-[url('/utama/Tahun-1.png')] bg-cover bg-center bg-no-repeat" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(115% 75% at 50% 26%, #FFFFFFEB 0%, #FFFFFFB8 60%, #FFFFFF00 100%), linear-gradient(0deg, #FFFFFF 0%, #FFFFFFD9 8%, #FFFFFF40 20%, #FFFFFF00 48%, #FFFFFF00 100%)",
          }}
        />
        <div className="relative mx-auto flex min-h-[480px] max-w-[1280px] flex-col items-center justify-center gap-1 px-[18px] py-20 text-center md:min-h-[540px] md:px-6 lg:min-h-[600px]">
          <span className="font-body text-xs font-bold tracking-[1.5px] text-[#0B4FCC]">
            SEKOLAH RENDAH · PENDAFTARAN
          </span>
          <h1 className="font-heading text-[32px] font-extrabold leading-tight text-[#0A1930] md:text-[38px]">
            Kemasukan Tahun 1
          </h1>
          <p className="mt-3 max-w-[640px] font-body text-base font-medium text-[#173254]">
            Panduan permohonan kemasukan anak ke Tahun 1 — syarat kelayakan,
            dokumen sokongan dan semakan penempatan.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
            <div className="flex items-center gap-2 text-[#0A1930]">
              <ReloadIcon className="size-3.5" />
              <span className="font-body text-sm">Dikemas kini 5 Sep 2025</span>
            </div>
            <div className="flex items-center gap-2 text-[#0A1930]">
              <GlobeIcon className="size-3.5" />
              <span className="font-body text-sm">Sumber: malaysia.gov.my</span>
            </div>
          </div>
        </div>
      </section>

      <PageContainer className="px-[18px] md:px-6">
        <div className="grid grid-cols-1 gap-6 py-12 lg:grid-cols-[976fr_360fr]">
          {/* Main column */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <p className="font-body text-base leading-relaxed text-txt-black-700">
                Salah satu proses penting untuk anak-anak memasuki alam
                persekolahan di peringkat rendah adalah memohon Tahun 1. Ibu
                bapa perlu memastikan permohonan dibuat dalam tempoh yang
                ditetapkan, menyemak keputusan penempatan dan menyediakan
                dokumen yang diperlukan.
              </p>
              <p className="font-body text-base font-semibold text-txt-black-900">
                Proses permohonan boleh dilakukan secara dalam talian melalui
                Sistem Bersepadu Kementerian Pendidikan Malaysia (MOEIS).
              </p>
            </div>

            {SECTIONS.map(({ Icon, iconBg, accent, title, items }) => (
              <section
                key={title}
                className="rounded-2xl border border-otl-divider bg-bg-white p-6"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div
                    className="flex size-10 items-center justify-center rounded-[10px]"
                    style={{ backgroundColor: iconBg }}
                  >
                    <Icon className="size-5" style={{ color: accent }} />
                  </div>
                  <h2 className="font-heading text-lg font-bold text-txt-black-900">
                    {title}
                  </h2>
                </div>
                <ul className="flex flex-col gap-3">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircleIcon
                        className="mt-0.5 size-[18px] shrink-0"
                        style={{ color: accent }}
                      />
                      <span className="font-body text-sm text-[#404A5A]">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <section className="flex gap-5 rounded-2xl border border-otl-divider bg-bg-white p-6">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[#E7EAF1]">
                <BookIcon className="size-5 text-txt-black-700" />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="font-heading text-lg font-bold text-txt-black-900">
                  Rujukan
                </h2>
                <p className="font-body text-sm text-txt-black-500">
                  Kandungan halaman ini diadaptasi daripada portal rasmi
                  malaysia.gov.my. Dikemas kini pada 5 September 2025.
                </p>
                <a
                  href="https://www.malaysia.gov.my/my/categories/sekolah--pendidikan/sekolah-rendah/memohon-tahun-1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1.5 font-body text-sm font-semibold text-[#0062FF] hover:underline"
                >
                  <ArrowOutgoingIcon className="size-3.5" />
                  Memohon Tahun 1 — malaysia.gov.my
                </a>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-6">
            <div className="rounded-2xl bg-[#0062FF] p-5 text-white">
              <span className="font-body text-xs font-bold tracking-[1.5px] text-white/80">
                MULA PERMOHONAN
              </span>
              <h3 className="mt-3 font-heading text-lg font-bold">
                Mohon secara dalam talian
              </h3>
              <p className="mt-2 font-body text-sm text-white/85">
                Permohonan Tahun 1 dibuat melalui Sistem Bersepadu KPM (MOEIS)
                menggunakan idMe.
              </p>
              <a
                href="https://idme.moe.gov.my/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 block"
              >
                <Button className="w-full items-center justify-center bg-white text-[#0062FF] hover:bg-white/90">
                  MOEIS - idMe
                  <ButtonIcon>
                    <ArrowOutgoingIcon />
                  </ButtonIcon>
                </Button>
              </a>
            </div>

            <div className="rounded-2xl bg-bg-washed p-5">
              <div className="flex items-center gap-2">
                <QuestionCircleIcon
                  className="size-[18px]"
                  style={{ color: "#14B8A6" }}
                />
                <h3 className="font-heading text-base font-bold text-txt-black-900">
                  Perlu bantuan?
                </h3>
              </div>
              <p className="mt-3 font-body text-sm text-txt-black-500">
                Hubungi Pejabat Pendidikan Daerah (PPD) atau Jabatan Pendidikan
                Negeri (JPN) yang berdekatan untuk pertanyaan lanjut.
              </p>
            </div>
          </aside>
        </div>
      </PageContainer>
    </>
  );
}
