import type { AnalyticsModel } from "../../models/response";
import DoughnutChart from "../DoughnutChart";
import { toTitleCase } from "../../utils/titleCaseConverter";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@govtechmy/myds-react/dialog";

interface SectionItemAnalyticsProps {
  analytics: AnalyticsModel;
}

const NEGERI_BAR_COLORS = ["#0062FF", "#14B8A6", "#F59E0B"];
const BANTUAN_COLORS = ["#0062FF", "#F59E0B"];

export default function SectionItemAnalytics({
  analytics,
}: SectionItemAnalyticsProps) {
  const [selectedLevel, setSelectedLevel] = useState<"RENDAH" | "MENENGAH">(
    "RENDAH",
  );
  const [isNegeriModalOpen, setIsNegeriModalOpen] = useState(false);

  const filteredJenisData = useMemo(() => {
    return (analytics?.data?.jenisLabel || [])
      .map((item) => {
        const breakdown = item.peringkatBreakdown?.find(
          (b) => b.peringkat === selectedLevel,
        );
        const total =
          breakdown?.total ?? (item.peringkatBreakdown ? 0 : item.total);
        return { ...item, total };
      })
      .filter((item) => item.total > 0);
  }, [analytics?.data?.jenisLabel, selectedLevel]);

  const filteredBantuanData = useMemo(() => {
    return (analytics?.data?.bantuan || []).filter((item) => item.total > 0);
  }, [analytics?.data?.bantuan]);

  const taburanNegeri = useMemo(() => {
    const list = analytics?.data?.taburanNegeri ?? [];
    const top = list.slice(0, 6);
    // list is sorted desc, so the first item is the max for the bar scale.
    const max = Math.max(1, list[0]?.total ?? 1);
    return { list, top, max };
  }, [analytics?.data?.taburanNegeri]);

  return (
    <div className="flex flex-col gap-4">
      {/* Sekolah Mengikut Peringkat */}
      <div className="flex flex-col gap-[18px] rounded-2xl bg-[#F7F8FA] p-[22px]">
        <div className="flex items-center justify-between gap-3">
          <h3
            className="text-body-lg font-bold text-txt-black-900"
            tabIndex={0}
            aria-label="Sekolah Mengikut Peringkat"
          >
            Sekolah Mengikut Peringkat
          </h3>

          <div
            className="flex shrink-0 gap-0.5 rounded-[10px] bg-bg-gray-100 p-[3px]"
            role="radiogroup"
            aria-label="Pilih peringkat sekolah"
          >
            {(["RENDAH", "MENENGAH"] as const).map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`rounded-lg px-3.5 py-1.5 text-body-sm transition-all focus:outline-primary-200 ${
                  selectedLevel === level
                    ? "bg-bg-white font-bold text-txt-black-900 shadow-sm"
                    : "font-medium text-txt-black-500 hover:text-txt-black-700"
                }`}
                role="radio"
                aria-checked={selectedLevel === level}
                aria-label={`Peringkat ${level === "RENDAH" ? "rendah" : "menengah"}`}
              >
                {level === "RENDAH" ? "Rendah" : "Menengah"}
              </button>
            ))}
          </div>
        </div>

        <DoughnutChart data={filteredJenisData} />

        <p className="text-body-xs text-txt-black-500">
          Klik kategori untuk fokus segmen
        </p>
      </div>

      {/* Bantuan Kerajaan */}
      <div className="flex flex-col gap-5 rounded-2xl bg-[#F7F8FA] p-[22px]">
        <h3
          className="text-body-lg font-bold text-txt-black-900"
          tabIndex={0}
          aria-label="Bantuan Kerajaan"
        >
          Bantuan Kerajaan
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {filteredBantuanData.map((item, index) => (
            <div
              key={item.jenis}
              className="flex flex-col gap-1 rounded-xl bg-bg-white p-4"
            >
              <div
                className="font-heading text-[28px] font-bold leading-none"
                style={{
                  color: BANTUAN_COLORS[index % BANTUAN_COLORS.length],
                }}
              >
                {item.total.toLocaleString()}
              </div>
              <div className="text-body-sm font-semibold text-txt-black-900">
                {item.jenis}
              </div>
              <div className="text-body-xs text-txt-black-500">
                {item.peratus}% daripada keseluruhan
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Taburan Sekolah Mengikut Negeri */}
      {taburanNegeri.top.length > 0 && (
        <div className="flex flex-col gap-[18px] rounded-2xl bg-[#F7F8FA] p-[22px]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <h3
                className="text-body-lg font-bold text-txt-black-900"
                tabIndex={0}
                aria-label="Taburan Sekolah Mengikut Negeri"
              >
                Taburan Sekolah Mengikut Negeri
              </h3>
              <span className="text-body-xs text-txt-black-500">
                {taburanNegeri.top.length} negeri teratas mengikut jumlah
                sekolah
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsNegeriModalOpen(true)}
              className="shrink-0 text-body-xs font-semibold text-[#0062FF] hover:underline focus:outline-primary-200"
            >
              Lihat semua negeri &gt;
            </button>
          </div>
          <div className="flex flex-col gap-3.5">
            {taburanNegeri.top.map((item, index) => (
              <div key={item.negeri} className="flex items-center gap-3.5">
                <span
                  className="w-[110px] shrink-0 truncate text-body-sm font-semibold text-txt-black-900"
                  title={toTitleCase(item.negeri)}
                >
                  {toTitleCase(item.negeri)}
                </span>
                <div className="flex-1">
                  <div
                    className="h-4 rounded-lg"
                    style={{
                      width: `${(item.total / taburanNegeri.max) * 100}%`,
                      backgroundColor:
                        NEGERI_BAR_COLORS[
                          Math.floor(index / 2) % NEGERI_BAR_COLORS.length
                        ],
                    }}
                  />
                </div>
                <span className="w-14 shrink-0 text-right text-body-sm font-bold text-txt-black-500">
                  {item.total.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full per-state breakdown */}
      <Dialog open={isNegeriModalOpen} onOpenChange={setIsNegeriModalOpen}>
        <DialogBody className="!max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Taburan Sekolah Mengikut Negeri</DialogTitle>
          </DialogHeader>
          <DialogContent className="flex max-h-[60vh] flex-col gap-3.5 overflow-y-auto py-4">
            {taburanNegeri.list.map((item, index) => (
              <div key={item.negeri} className="flex items-center gap-3.5">
                <span
                  className="w-[130px] shrink-0 truncate text-body-sm font-semibold text-txt-black-900"
                  title={toTitleCase(item.negeri)}
                >
                  {toTitleCase(item.negeri)}
                </span>
                <div className="flex-1">
                  <div
                    className="h-4 rounded-lg"
                    style={{
                      width: `${(item.total / taburanNegeri.max) * 100}%`,
                      backgroundColor:
                        NEGERI_BAR_COLORS[
                          Math.floor(index / 2) % NEGERI_BAR_COLORS.length
                        ],
                    }}
                  />
                </div>
                <span className="w-14 shrink-0 text-right text-body-sm font-bold text-txt-black-500">
                  {item.total.toLocaleString()}
                </span>
              </div>
            ))}
          </DialogContent>
        </DialogBody>
      </Dialog>
    </div>
  );
}
