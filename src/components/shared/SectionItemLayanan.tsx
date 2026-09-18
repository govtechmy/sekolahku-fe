import {
  PutrajayaIcon,
  DocumentFilledIcon,
  BookIcon,
  MoneyIcon,
  ArrowForwardIcon,
} from "@govtechmy/myds-react/icon";
import { useNavigate, useParams } from "react-router-dom";
import { buildSchoolSearchPath } from "../../utils/schoolSearchUrl";

type LayananItem = {
  Icon: typeof PutrajayaIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  desc: string;
  to: (lang: string | undefined) => string;
};

const LAYANAN_ITEMS: LayananItem[] = [
  {
    Icon: PutrajayaIcon,
    iconColor: "#0062FF",
    iconBg: "#E7F0FE",
    title: "Cari Sekolah",
    desc: "Cari sekolah mengikut lokasi, jenis dan peringkat.",
    to: (lang) => buildSchoolSearchPath(lang),
  },
  {
    Icon: DocumentFilledIcon,
    iconColor: "#E5484D",
    iconBg: "#FDEAEA",
    title: "Kemasukan Tahun 1",
    desc: "Syarat, tarikh penting dan panduan permohonan.",
    to: (lang) => `/${lang || "ms"}/kemasukan-tahun-1`,
  },
  {
    Icon: BookIcon,
    iconColor: "#A78BFA",
    iconBg: "#F1EEFE",
    title: "Kemasukan Tingkatan 1",
    desc: "Syarat, tarikh penting dan panduan permohonan.",
    to: (lang) => `/${lang || "ms"}/kemasukan-tingkatan-1`,
  },
  {
    Icon: MoneyIcon,
    iconColor: "#14B8A6",
    iconBg: "#E6F7F5",
    title: "Bantuan Persekolahan",
    desc: "Semak bantuan yang sesuai untuk anak anda.",
    to: (lang) => `/${lang || "ms"}/bantuan-persekolahan`,
  },
];

export default function SectionItemLayanan() {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-[22px] font-bold text-txt-black-900">
          Apa yang anda ingin lakukan?
        </h2>
        <p className="font-body text-[13px] text-txt-black-500">
          Akses pantas kepada perkhidmatan dan maklumat persekolahan.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {LAYANAN_ITEMS.map(({ Icon, iconColor, iconBg, title, desc, to }) => (
          <button
            key={title}
            type="button"
            onClick={() => navigate(to(lang))}
            className="group flex flex-col items-start gap-2.5 rounded-2xl bg-[#F7F8FA] p-5 text-left transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:ring-2 hover:ring-otl-primary-200 focus:outline-primary-200"
          >
            <div
              className="flex size-11 items-center justify-center rounded-xl"
              style={{ backgroundColor: iconBg }}
            >
              <Icon className="size-5" style={{ color: iconColor }} />
            </div>
            <div className="font-body text-sm font-bold text-txt-black-900">
              {title}
            </div>
            <div className="w-full font-body text-[11px] leading-[14px] text-txt-black-500">
              {desc}
            </div>
            <ArrowForwardIcon
              className="size-3.5 shrink-0"
              style={{ color: iconColor }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
