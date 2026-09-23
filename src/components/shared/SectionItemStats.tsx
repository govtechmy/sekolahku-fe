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
  accent: string;
  Icon: typeof PutrajayaIcon;
};

const STATS: StatDef[] = [
  {
    key: "jumlahSekolah",
    eyebrow: "Jumlah Sekolah",
    accent: "#A78BFA",
    Icon: PutrajayaIcon,
  },
  {
    key: "jumlahGuru",
    eyebrow: "Jumlah Guru",
    accent: "#14B8A6",
    Icon: BookIcon,
  },
  {
    key: "jumlahPelajar",
    eyebrow: "Jumlah Murid",
    accent: "#F59E0B",
    Icon: UserGroupIcon,
  },
];

export default function SectionItemStats({ analytics }: SectionItemStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {STATS.map(({ key, eyebrow, accent, Icon }) => (
        <div
          key={key}
          className="flex flex-col gap-2 rounded-2xl border border-[#E4EAF4] bg-white p-4 shadow-[0_8px_20px_0_#0B12200F]"
        >
          <div
            className="flex items-center gap-1.5 text-[11px] font-semibold"
            style={{ color: accent }}
          >
            <CheckCircleIcon className="size-3" />
            {eyebrow}
          </div>
          <div
            className="flex size-10 flex-shrink-0 items-center justify-center rounded-[10px]"
            style={{ backgroundColor: accent }}
          >
            <Icon className="size-5 text-white" />
          </div>
          <div className="text-txt-black-900 font-heading text-[27px] font-bold leading-none">
            {analytics?.[key]?.toLocaleString() ?? "-"}
          </div>
        </div>
      ))}
    </div>
  );
}
