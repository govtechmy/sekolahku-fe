import {
  PutrajayaIcon,
  BookIcon,
  UserGroupIcon,
  CheckCircleIcon,
} from "@govtechmy/myds-react/icon";
import type { AnalyticsModel } from "../../models/response";

interface SectionItemStatsProps {
  analytics: AnalyticsModel;
}

type StatDef = {
  key: "jumlahSekolah" | "jumlahGuru" | "jumlahPelajar";
  eyebrow: string;
  label: string;
  accent: string;
  soft: string;
  Icon: typeof PutrajayaIcon;
};

const STATS: StatDef[] = [
  {
    key: "jumlahSekolah",
    eyebrow: "Data Rasmi EMIS",
    label: "Jumlah Sekolah",
    accent: "#A78BFA",
    soft: "#F1EEFE",
    Icon: PutrajayaIcon,
  },
  {
    key: "jumlahGuru",
    eyebrow: "Aktif Mengajar",
    label: "Jumlah Guru",
    accent: "#14B8A6",
    soft: "#E6F7F5",
    Icon: BookIcon,
  },
  {
    key: "jumlahPelajar",
    eyebrow: "Enrolmen Semasa",
    label: "Jumlah Murid",
    accent: "#F59E0B",
    soft: "#FEF3E0",
    Icon: UserGroupIcon,
  },
];

export default function SectionItemStats({ analytics }: SectionItemStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {STATS.map(({ key, eyebrow, label, accent, soft, Icon }) => (
        <div
          key={key}
          className="flex flex-col gap-4 rounded-2xl border border-otl-gray-200 bg-bg-white p-5"
        >
          <div
            className="flex items-center gap-1.5 text-body-xs font-semibold"
            style={{ color: accent }}
          >
            <CheckCircleIcon className="size-3.5" />
            {eyebrow}
          </div>
          <div
            className="size-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: soft, color: accent }}
          >
            <Icon className="size-6" />
          </div>
          <div className="text-txt-black-900 font-heading text-3xl font-bold leading-none">
            {analytics?.[key]?.toLocaleString() ?? "-"}
          </div>
          <div className="text-txt-black-500 text-body-sm font-normal">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
