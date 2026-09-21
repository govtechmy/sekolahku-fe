import { useParams } from "react-router-dom";
import {
  GlobeIcon,
  LinkIcon,
  ArrowOutgoingIcon,
  CheckCircleIcon,
  DocumentIcon,
  MapIcon,
  InfoIcon,
  BookIcon,
  GovtOfficeIcon,
  TrophyIcon,
  MoonIcon,
  BookMOEIcon,
  StarIcon,
  FormsIcon,
  QuestionCircleIcon,
} from "@govtechmy/myds-react/icon";
import HelmetMeta from "../seo/HelmetMeta";
import PageContainer from "../components/layout/PageContainer";

type Laluan = {
  Icon: typeof GovtOfficeIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  badge: string;
  badgeBg: string;
  badgeColor: string;
  desc: string;
};

const LALUAN: Laluan[] = [
  {
    Icon: GovtOfficeIcon,
    iconBg: "#E7F0FE",
    iconColor: "#0062FF",
    title: "Sekolah Menengah Kebangsaan",
    badge: "Tiada permohonan",
    badgeBg: "#E7F8EF",
    badgeColor: "#0FA968",
    desc: "Penempatan automatik mengikut alamat semasa murid. Didaftarkan oleh guru Tahun 6 melalui eDaftar Sekolah Menengah.",
  },
  {
    Icon: TrophyIcon,
    iconBg: "#F1EEFE",
    iconColor: "#A78BFA",
    title: "Sekolah Khusus",
    badge: "Perlu permohonan",
    badgeBg: "#F1EEFE",
    badgeColor: "#7C3AED",
    desc: "SBP, SMKA dan MRSM digabungkan dalam satu sistem permohonan yang sama mulai 2025. Semak syarat sebelum memohon.",
  },
];

const MEMOHON_T1_LIST = [
  "Permohonan boleh dibuat secara dalam talian melalui portal rasmi Kementerian Pendidikan Malaysia (KPM).",
  "Anda digalakkan untuk menyemak panduan permohonan dan syarat kemasukan yang ditetapkan.",
  "Semak tawaran permohonan kemasukan ke Sekolah Khusus melalui pautan semakan.",
];

type SchoolOption = {
  key: string;
  Icon: typeof GovtOfficeIcon;
  iconColor: string;
  name: string;
  subtitle: string;
  badge: string;
  desc: string;
  links: { label: string; href: string }[];
};

const SCHOOL_OPTIONS: SchoolOption[] = [
  {
    key: "SBP",
    Icon: GovtOfficeIcon,
    iconColor: "#0062FF",
    name: "SBP",
    subtitle: "Sekolah Berasrama Penuh",
    badge: "Satu sistem permohonan",
    desc: "Sekolah Berasrama Penuh (SBP) ialah institusi pendidikan elit KPM yang menyediakan persekitaran pembelajaran kondusif bagi pelajar cemerlang dalam akademik dan kokurikulum.",
    links: [
      {
        label: "Info lanjut mengenai SBP",
        href: "https://spskt1.moe.gov.my/spat1_mohon/info_sbp.cfm",
      },
    ],
  },
  {
    key: "SMKA",
    Icon: MoonIcon,
    iconColor: "#14B8A6",
    name: "SMKA",
    subtitle: "Sek. Men. Kebangsaan Agama",
    badge: "Satu sistem permohonan",
    desc: "Sekolah Menengah Kebangsaan Agama (SMKA) ialah institusi pendidikan yang menggabungkan pendidikan akademik dan pengajian Islam.",
    links: [
      {
        label: "Info lanjut SMKA",
        href: "https://spskt1.moe.gov.my/spat1_mohon/info_smka.cfm",
      },
    ],
  },
  {
    key: "MRSM",
    Icon: BookMOEIcon,
    iconColor: "#F59E0B",
    name: "MRSM",
    subtitle: "Maktab Rendah Sains MARA",
    badge: "Satu sistem permohonan",
    desc: "Maktab Rendah Sains MARA (MRSM) dikendalikan oleh Majlis Amanah Rakyat (MARA), selain sekolah khusus di bawah KPM.",
    links: [
      {
        label: "Program dan Lokasi MRSM",
        href: "https://www.mara.gov.my/bm/pendidikan/mrsm/program-sistem-pendidikan-mrsm/",
      },
    ],
  },
  {
    key: "SSeM",
    Icon: StarIcon,
    iconColor: "#F472B6",
    name: "SSeM",
    subtitle: "Sekolah Seni Malaysia",
    badge: "Sistem permohonan tersendiri",
    desc: "Sekiranya anak anda mempunyai bakat atau minat yang kuat terhadap bidang kesenian, mereka boleh memohon ke Sekolah Seni Malaysia (SSeM).",
    links: [
      { label: "Sistem Permohonan SSeM", href: "https://essem.moe.gov.my/" },
      {
        label: "Info lanjut SSeM",
        href: "https://www.moe.gov.my/sekolah-seni-malaysia",
      },
    ],
  },
  {
    key: "SSM",
    Icon: TrophyIcon,
    iconColor: "#34D399",
    name: "SSM",
    subtitle: "Sekolah Sukan Malaysia",
    badge: "Sistem permohonan tersendiri",
    desc: "Fokus menawarkan pendidikan akademik dan latihan sukan secara formal bagi melahirkan atlet muda berbakat dalam pelbagai jenis sukan.",
    links: [
      {
        label: "Baca lanjut Sekolah Sukan",
        href: "https://www.moe.gov.my/sekolah-sukan-malaysia",
      },
    ],
  },
];

type RefLink = { label: string; href: string };

const REF_COL_A: RefLink[] = [
  {
    label: "Sekolah Menengah",
    href: "https://www.malaysia.gov.my/my/categories/sekolah--pendidikan/sekolah-menengah",
  },
  {
    label: "Sekolah Menengah Kebangsaan di Malaysia",
    href: "https://www.malaysia.gov.my/my/categories/sekolah--pendidikan/sekolah-menengah/sekolah-menengah-kebangsaan-di-malaysia",
  },
  {
    label: "Memilih Aliran Akademik",
    href: "https://www.malaysia.gov.my/my/categories/sekolah--pendidikan/sekolah-menengah/memilih-aliran-akademik",
  },
  {
    label: "Memohon Sekolah Khusus Tingkatan 1",
    href: "https://www.malaysia.gov.my/my/categories/sekolah--pendidikan/sekolah-menengah/memohon-sekolah-khusus-tingkatan-1",
  },
  {
    label: "Memohon Sekolah Khusus Tingkatan 4",
    href: "https://www.malaysia.gov.my/my/categories/sekolah--pendidikan/sekolah-menengah/memohon-sekolah-khusus-tingkatan-4",
  },
  {
    label: "Sekolah Berasrama Penuh (SBP)",
    href: "https://www.malaysia.gov.my/my/categories/sekolah--pendidikan/sekolah-menengah/sekolah-berasrama-penuh-sbp",
  },
  {
    label: "Sekolah Menengah Kebangsaan Agama (SMKA)",
    href: "https://www.malaysia.gov.my/my/categories/sekolah--pendidikan/sekolah-menengah/sekolah-menengah-kebangsaan-agama-smka",
  },
  {
    label: "Maktab Rendah Sains MARA (MRSM)",
    href: "https://www.malaysia.gov.my/my/categories/sekolah--pendidikan/sekolah-menengah/maktab-rendah-sains-mara-mrsm",
  },
];

const REF_COL_B: RefLink[] = [
  {
    label: "Kolej Vokasional (KV)",
    href: "https://www.malaysia.gov.my/my/categories/sekolah--pendidikan/sekolah-menengah/kolej-vokasional-kv",
  },
  {
    label: "Sekolah Menengah Teknik (SMT)",
    href: "https://www.malaysia.gov.my/my/categories/sekolah--pendidikan/sekolah-menengah/sekolah-menengah-teknik-smt",
  },
  {
    label: "Maktab Tentera Diraja (MTD)",
    href: "https://www.malaysia.gov.my/my/categories/sekolah--pendidikan/sekolah-menengah/maktab-tentera-diraja-mtd",
  },
  {
    label: "Sekolah Seni Malaysia (SSeM)",
    href: "https://www.malaysia.gov.my/my/categories/sekolah--pendidikan/sekolah-menengah/sekolah-seni-malaysia-ssem",
  },
  {
    label: "Sekolah Sukan Malaysia (SSM)",
    href: "https://www.malaysia.gov.my/my/categories/sekolah--pendidikan/sekolah-menengah/sekolah-sukan-malaysia-ssm",
  },
  {
    label: "Sekolah Menengah Swasta",
    href: "https://www.malaysia.gov.my/my/categories/sekolah--pendidikan/sekolah-menengah/sekolah-menengah-swasta",
  },
  {
    label: "Pilihan Selain Sekolah Menengah Kebangsaan",
    href: "https://www.malaysia.gov.my/my/categories/sekolah--pendidikan/sekolah-menengah/pilihan-selain-sekolah-menengah-kebangsaan",
  },
];

function SumberLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 border-t border-[#F0F1F4] pt-3 font-body text-[10px] text-txt-black-500 hover:underline"
    >
      <LinkIcon className="size-[11px]" />
      {label}
    </a>
  );
}

export default function KemasukanTingkatan1() {
  const { lang } = useParams<{ lang: string }>();
  const domain = import.meta.env.VITE_DOMAIN_NAME;

  return (
    <>
      <HelmetMeta
        title="Kemasukan Tingkatan 1 - SekolahKu"
        description="Penempatan ke sekolah menengah kebangsaan dibuat secara automatik. Permohonan berasingan hanya diperlukan untuk sekolah khusus seperti SBP, SMKA dan MRSM."
        canonical={`${domain}/${lang}/kemasukan-tingkatan-1`}
      />

      {/* Hero */}
      <section className="relative overflow-hidden rounded-b-[32px] bg-[#EAF2FE]">
        <div className="absolute inset-0 bg-[url('/utama/Tingkatan-1.png')] bg-cover bg-center bg-no-repeat" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(115% 75% at 50% 26%, #FFFFFFEB 0%, #FFFFFFB8 60%, #FFFFFF00 100%), linear-gradient(0deg, #FFFFFF 0%, #FFFFFFD9 8%, #FFFFFF40 20%, #FFFFFF00 48%, #FFFFFF00 100%)",
          }}
        />
        <div className="relative mx-auto flex min-h-[500px] max-w-[1280px] flex-col items-center gap-3 px-[18px] pb-16 pt-28 text-center md:px-6">
          <div className="flex flex-col items-center gap-1">
            <span className="font-body text-xs font-bold tracking-[1.5px] text-[#0B4FCC]">
              SEKOLAH MENENGAH · PENDAFTARAN
            </span>
            <h1 className="font-heading text-[32px] font-extrabold leading-tight text-[#0A1930] md:text-[38px]">
              Kemasukan Tingkatan 1
            </h1>
          </div>
          <p className="max-w-[700px] font-body text-base font-medium text-[#173254]">
            Penempatan ke sekolah menengah kebangsaan dibuat secara automatik.
            Permohonan berasingan hanya diperlukan untuk sekolah khusus seperti
            SBP, SMKA dan MRSM.
          </p>
          <div className="flex items-center gap-2 pt-2 text-[#0A1930]">
            <GlobeIcon className="size-3.5" />
            <span className="font-body text-sm">Sumber: malaysia.gov.my</span>
          </div>
        </div>
      </section>

      <PageContainer className="px-[18px] md:px-6">
        <div className="grid grid-cols-1 gap-6 py-12 lg:grid-cols-[976fr_360fr]">
          {/* Main column */}
          <div className="flex flex-col gap-6">
            {/* Intro */}
            <div className="flex flex-col gap-3.5">
              <p className="font-body text-base leading-relaxed text-txt-black-700">
                Semua murid warganegara Malaysia akan mendapat penempatan
                sekolah menengah berdasarkan alamat semasa murid.
              </p>
              <p className="font-body text-base leading-relaxed text-txt-black-700">
                Kemasukan dan penempatan murid ke sekolah menengah kebangsaan
                akan didaftarkan oleh guru sekolah rendah kebangsaan semasa
                Tahun 6 menerusi aplikasi eDaftar Sekolah Menengah.
              </p>
              <SumberLink
                label="Sumber: Sekolah Menengah Kebangsaan di Malaysia — malaysia.gov.my"
                href="https://www.malaysia.gov.my/my/categories/sekolah--pendidikan/sekolah-menengah/sekolah-menengah-kebangsaan-di-malaysia"
              />
            </div>

            {/* Dua Laluan */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {LALUAN.map((l) => (
                <div
                  key={l.title}
                  className="flex flex-col gap-3 rounded-2xl border border-otl-divider bg-bg-white p-[22px]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex size-10 shrink-0 items-center justify-center rounded-[10px]"
                        style={{ backgroundColor: l.iconBg }}
                      >
                        <l.Icon
                          className="size-5"
                          style={{ color: l.iconColor }}
                        />
                      </div>
                      <span className="font-heading text-base font-bold text-txt-black-900">
                        {l.title}
                      </span>
                    </div>
                    <span
                      className="shrink-0 rounded-xl px-2.5 py-1 font-body text-[10px] font-bold"
                      style={{
                        backgroundColor: l.badgeBg,
                        color: l.badgeColor,
                      }}
                    >
                      {l.badge}
                    </span>
                  </div>
                  <p className="font-body text-[13px] leading-relaxed text-[#404A5A]">
                    {l.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Memohon Sekolah Khusus Tingkatan 1 */}
            <section className="flex flex-col gap-4 rounded-2xl border border-otl-divider bg-bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-[10px] bg-[#F1EEFE]">
                  <DocumentIcon className="size-5 text-[#A78BFA]" />
                </div>
                <h2 className="font-heading text-lg font-bold text-txt-black-900">
                  Memohon Sekolah Khusus Tingkatan 1
                </h2>
              </div>
              <p className="font-body text-sm leading-relaxed text-[#404A5A]">
                Mulai 2025, permohonan Tingkatan 1 ke sekolah khusus iaitu SBP,
                MRSM dan SMKA telah digabungkan melalui satu sistem permohonan
                yang sama. Ibu bapa digalakkan untuk menyemak syarat kemasukan
                dan keperluan anak-anak bagi sekolah khusus yang disasarkan
                sebelum memohon.
              </p>
              <ul className="flex flex-col gap-3">
                {MEMOHON_T1_LIST.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircleIcon className="mt-0.5 size-[18px] shrink-0 text-[#A78BFA]" />
                    <span className="font-body text-sm text-[#404A5A]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <SumberLink
                label="Sumber: Memohon Sekolah Khusus Tingkatan 1 — malaysia.gov.my"
                href="https://www.malaysia.gov.my/my/categories/sekolah--pendidikan/sekolah-menengah/memohon-sekolah-khusus-tingkatan-1"
              />
            </section>

            {/* Pilihan Sekolah Khusus */}
            <div className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <h2 className="font-heading text-lg font-bold text-txt-black-900">
                  Pilihan Sekolah Khusus
                </h2>
                <p className="font-body text-[13px] text-txt-black-500">
                  Semak syarat dan keperluan setiap sekolah sebelum memohon.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                {SCHOOL_OPTIONS.map((s) => (
                  <div
                    key={s.key}
                    className="flex flex-col gap-2.5 rounded-2xl bg-bg-washed p-[18px]"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-bg-white">
                        <s.Icon
                          className="size-[18px]"
                          style={{ color: s.iconColor }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-heading text-[15px] font-extrabold text-txt-black-900">
                          {s.name}
                        </span>
                        <span className="font-body text-[10px] text-txt-black-500">
                          {s.subtitle}
                        </span>
                      </div>
                    </div>
                    <span
                      className="w-fit rounded-[10px] bg-bg-white px-2 py-1 font-body text-[9px] font-bold"
                      style={{ color: s.iconColor }}
                    >
                      {s.badge}
                    </span>
                    <p className="font-body text-xs leading-relaxed text-[#4A5462]">
                      {s.desc}
                    </p>
                    {s.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 font-body text-[11px] font-bold text-[#0062FF] hover:underline"
                      >
                        {link.label}
                        <ArrowOutgoingIcon className="size-3" />
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Memilih Aliran Akademik */}
            <section className="flex flex-col gap-4 rounded-2xl border border-otl-divider bg-bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-[10px] bg-[#E6F7F5]">
                  <MapIcon className="size-5 text-[#14B8A6]" />
                </div>
                <h2 className="font-heading text-lg font-bold text-txt-black-900">
                  Memilih Aliran Akademik
                </h2>
              </div>
              <p className="font-body text-sm leading-relaxed text-[#404A5A]">
                Sebagai ibu bapa kepada remaja, anda pasti sudah dapat mengenal
                pasti bakat, minat dan kecenderungan anak-anak dalam
                pembelajaran. Selain memastikan anak-anak mendapat pendidikan
                menengah yang menyeluruh, mereka juga boleh meneroka
                peluang-peluang yang sesuai dengan kecenderungan mereka.
              </p>
              <SumberLink
                label="Sumber: Memilih Aliran Akademik — malaysia.gov.my"
                href="https://www.malaysia.gov.my/my/categories/sekolah--pendidikan/sekolah-menengah/memilih-aliran-akademik"
              />
            </section>

            {/* Nota Tingkatan 4 */}
            <div className="flex gap-3 rounded-[14px] border border-[#EFE7D6] bg-[#FBF9F4] p-[18px]">
              <div className="flex size-[34px] shrink-0 items-center justify-center rounded-[9px] bg-[#FEF3D9]">
                <InfoIcon className="size-[17px] text-[#8A5B00]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="font-body text-[13px] font-bold text-txt-black-900">
                  Merancang untuk Tingkatan 4?
                </span>
                <p className="font-body text-xs leading-relaxed text-txt-black-500">
                  Kolej Vokasional (KV), Sekolah Menengah Teknik (SMT) dan
                  Maktab Tentera Diraja (MTD) hanya membuka kemasukan di
                  peringkat Tingkatan 4.
                </p>
                <a
                  href="https://spskt4.moe.gov.my/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 font-body text-[11px] font-bold text-[#0062FF] hover:underline"
                >
                  Sekolah Khusus Tingkatan 4
                  <ArrowOutgoingIcon className="size-3" />
                </a>
              </div>
            </div>

            {/* Rujukan */}
            <section className="flex flex-col gap-5 rounded-2xl border border-otl-divider bg-bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[#E7EAF1]">
                  <BookIcon className="size-5 text-txt-black-700" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h2 className="font-heading text-lg font-bold text-txt-black-900">
                    Rujukan
                  </h2>
                  <p className="font-body text-xs text-txt-black-500">
                    Kandungan halaman ini diadaptasi daripada portal
                    malaysia.gov.my
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[...REF_COL_A, ...REF_COL_B].map((ref) => (
                  <a
                    key={ref.href}
                    href={ref.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-body text-xs font-semibold text-[#0062FF] hover:underline"
                  >
                    <ArrowOutgoingIcon className="size-3" />
                    {ref.label}
                  </a>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-6">
            <div className="rounded-2xl bg-[#0062FF] p-5 text-white">
              <span className="font-body text-xs font-bold tracking-[1.5px] text-white/80">
                SEKOLAH KHUSUS T1
              </span>
              <h3 className="mt-3 font-heading text-lg font-bold">
                Permohonan & semakan
              </h3>
              <p className="mt-2 font-body text-sm text-white/85">
                Satu sistem untuk SBP, SMKA dan MRSM melalui portal rasmi KPM.
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <a
                  href="https://spskt1.moe.gov.my/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-[10px] bg-white px-4 py-3 font-body text-[13px] font-bold text-[#0062FF] transition hover:bg-white/90"
                >
                  Permohonan Tingkatan 1
                  <ArrowOutgoingIcon className="size-3.5" />
                </a>
                <a
                  href="https://spskt1.moe.gov.my/spat1_mohon/panduan.cfm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-[10px] border border-white/30 bg-white/10 px-4 py-3 font-body text-[13px] font-bold text-white transition hover:bg-white/20"
                >
                  Panduan Permohonan
                  <ArrowOutgoingIcon className="size-3.5" />
                </a>
                <a
                  href="https://spskt1.moe.gov.my/semakan_sbpt1/index.cfm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-[10px] border border-white/30 bg-white/10 px-4 py-3 font-body text-[13px] font-bold text-white transition hover:bg-white/20"
                >
                  Semakan Tawaran
                  <ArrowOutgoingIcon className="size-3.5" />
                </a>
              </div>
            </div>

            <div className="rounded-2xl bg-bg-washed p-5">
              <div className="flex items-center gap-2">
                <FormsIcon className="size-[18px] text-[#0062FF]" />
                <h3 className="font-heading text-base font-bold text-txt-black-900">
                  eDaftar Sekolah Menengah
                </h3>
              </div>
              <p className="mt-3 font-body text-sm text-txt-black-500">
                Untuk sekolah menengah kebangsaan, pendaftaran diuruskan oleh
                guru sekolah rendah semasa Tahun 6 — ibu bapa tidak perlu
                memohon.
              </p>
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
                Hubungi sekolah rendah anak anda, Pejabat Pendidikan Daerah
                (PPD) atau Jabatan Pendidikan Negeri (JPN) untuk pertanyaan
                lanjut.
              </p>
            </div>
          </aside>
        </div>
      </PageContainer>
    </>
  );
}
