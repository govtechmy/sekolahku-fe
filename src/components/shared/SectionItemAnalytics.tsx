import type { AnalyticsModel } from "../../models/response";
import {
  PutrajayaIcon,
  BookIcon,
  UserGroupIcon,
} from "@govtechmy/myds-react/icon";
import DoughnutChart from "../DoughnutChart";
import { SCHOOL_LEVEL } from "../../constants/schoolTypes";
import { useState, useMemo } from "react";

interface SectionItemAnalyticsProps {
  analytics: AnalyticsModel;
}

export default function SectionItemAnalytics({
  analytics,
}: SectionItemAnalyticsProps) {
  const [selectedLevel, setSelectedLevel] = useState<"RENDAH" | "MENENGAH">(
    "RENDAH",
  );

  const filteredJenisData = useMemo(() => {
    return (analytics?.data.jenisLabel || []).filter((item) => {
      const schoolLevels = SCHOOL_LEVEL[item.jenis];
      const isMatch = schoolLevels && schoolLevels.includes(selectedLevel);
      return isMatch;
    });
  }, [analytics?.data.jenisLabel, selectedLevel]);

  const filteredBantuanData = useMemo(() => {
    return analytics?.data.bantuan || [];
  }, [analytics?.data.bantuan]);

  return (
    <>
      <div className="border border-otl-gray-200 rounded-lg">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div
            className="flex items-center gap-6 px-6 py-8 border-otl-gray-200 border-b lg:border-r lg:border-b-0 focus:outline focus:outline-2 focus:outline-otl-primary-200 focus:outline-offset-[-2px]"
            tabIndex={0}
            role="button"
            aria-label={`Jumlah Sekolah di Malaysia: ${analytics?.jumlahSekolah?.toLocaleString() || "0"}`}
          >
            <div className="p-4 rounded-full bg-bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
              <PutrajayaIcon className="w-8 h-8" />
            </div>
            <div>
              <div className="text-txt-primary font-body text-3xl font-semibold">
                {analytics?.jumlahSekolah.toLocaleString()}
              </div>
              <div className="text-txt-black-700 font-body text-body-md font-semibold">
                Jumlah Sekolah di Malaysia
              </div>
            </div>
          </div>

          <div
            className="flex items-center gap-6 px-6 py-8 border-otl-gray-200 border-b lg:border-r lg:border-b-0 focus:outline focus:outline-2 focus:outline-otl-primary-200 focus:outline-offset-[-2px]"
            tabIndex={0}
            role="button"
            aria-label={`Jumlah Guru di Malaysia: ${analytics?.jumlahGuru?.toLocaleString() || "0"}`}
          >
            <div className="p-4 rounded-full bg-bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
              <BookIcon className="w-8 h-8" />
            </div>
            <div>
              <div className="text-txt-primary font-body text-3xl font-semibold">
                {analytics?.jumlahGuru.toLocaleString()}
              </div>
              <div className="text-txt-black-700 font-body text-body-md font-semibold">
                Jumlah Guru di Malaysia
              </div>
            </div>
          </div>

          <div
            className="flex items-center gap-6 px-6 py-8 border-otl-gray-200 border-b last:border-b-0 lg:border-b-0 lg:border-r-0 focus:outline focus:outline-2 focus:outline-otl-primary-200 focus:outline-offset-[-2px]"
            tabIndex={0}
            role="button"
            aria-label={`Jumlah Pelajar di Malaysia: ${analytics?.jumlahPelajar?.toLocaleString() || "0"}`}
          >
            <div className="p-4 rounded-full bg-bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
              <UserGroupIcon className="w-8 h-8" />
            </div>
            <div>
              <div className="text-txt-primary font-body text-3xl font-semibold">
                {analytics?.jumlahPelajar.toLocaleString()}
              </div>
              <div className="text-txt-black-700 font-body text-body-md font-semibold">
                Jumlah Pelajar di Malaysia
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="p-6 border-t border-otl-gray-200 flex flex-col items-center gap-4">
            <h3 className="text-lg font-semibold text-center">
              Sekolah Mengikut Peringkat
            </h3>

            <div 
              className="flex bg-gray-200 rounded-md p-[2px] gap-1"
              role="radiogroup"
              aria-label="Pilih peringkat sekolah"
            >
              <button
                onClick={() => setSelectedLevel("RENDAH")}
                className={`px-5 py-2 text-sm font-medium rounded-md transition-all focus:outline focus:outline-2 focus:outline-otl-primary-200 focus:outline-offset-2
                ${
                  selectedLevel === "RENDAH"
                    ? "bg-white text-txt-black-900 shadow"
                    : "text-gray-500 hover:text-txt-black-700"
                }`}
                role="radio"
                aria-checked={selectedLevel === "RENDAH"}
                aria-label="Peringkat rendah"
              >
                Rendah
              </button>

              <button
                onClick={() => setSelectedLevel("MENENGAH")}
                className={`px-5 py-2 text-sm font-medium rounded-md transition-all focus:outline focus:outline-2 focus:outline-otl-primary-200 focus:outline-offset-2
                ${
                  selectedLevel === "MENENGAH"
                    ? "bg-white text-txt-black-900 shadow"
                    : "text-txt-black-500 hover:text-txt-black-700"
                }`}
                role="radio"
                aria-checked={selectedLevel === "MENENGAH"}
                aria-label="Peringkat menengah"
              >
                Menengah
              </button>
            </div>

            <div className="w-full">
              <DoughnutChart title="" data={filteredJenisData} />
            </div>
          </div>
          <div className="p-6 border-t border-otl-gray-200 flex justify-center">
            <DoughnutChart title="Jenis Bantuan" data={filteredBantuanData} />
          </div>
        </div>
      </div>
    </>
  );
}
