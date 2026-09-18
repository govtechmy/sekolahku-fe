import {
  PutrajayaIcon,
  BookIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@govtechmy/myds-react/icon";
import type { AnalyticsModel } from "../../models/response";

interface SectionItemStatsProps {
  analytics: AnalyticsModel;
}

type StatDef = {
  key: "jumlahSekolah" | "jumlahGuru" | "jumlahPelajar";
  eyebrow: string;
  accent: string;
  trend: string;
  trendUp: boolean;
  Icon: typeof PutrajayaIcon;
};

const STATS: StatDef[] = [
  {
    key: "jumlahSekolah",
    eyebrow: "Jumlah Sekolah",
    accent: "#A78BFA",
    trend: "+1.2%",
    trendUp: true,
    Icon: PutrajayaIcon,
  },
  {
    key: "jumlahGuru",
    eyebrow: "Jumlah Guru",
    accent: "#14B8A6",
    trend: "+3.8%",
    trendUp: true,
    Icon: BookIcon,
  },
  {
    key: "jumlahPelajar",
    eyebrow: "Jumlah Murid",
    accent: "#F59E0B",
    trend: "-0.6%",
    trendUp: false,
    Icon: UserGroupIcon,
  },
];

export default function SectionItemStats({ analytics }: SectionItemStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {STATS.map(({ key, eyebrow, accent, trend, trendUp, Icon }) => (
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
          <div className="flex w-full items-center justify-between">
            <div
              className="flex size-10 flex-shrink-0 items-center justify-center rounded-[10px]"
              style={{ backgroundColor: accent }}
            >
              <Icon className="size-5 text-white" />
            </div>
            <div
              className="flex items-center gap-0.5 rounded-xl px-2 py-1"
              style={{
                backgroundColor: trendUp ? "#E7F8EF" : "#FDECEC",
                color: trendUp ? "#0FA968" : "#DC3B3B",
              }}
            >
              {trendUp ? (
                <ArrowUpIcon className="size-3" />
              ) : (
                <ArrowDownIcon className="size-3" />
              )}
              <span className="text-[11px] font-bold">{trend}</span>
            </div>
          </div>
          <div className="text-txt-black-900 font-heading text-[27px] font-bold leading-none">
            {analytics?.[key]?.toLocaleString() ?? "-"}
          </div>
        </div>
      ))}
    </div>
  );
}
