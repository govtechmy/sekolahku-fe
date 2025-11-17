import { Button } from "@govtechmy/myds-react/button";
import CustomChart from "./Chart";
import { useState } from "react";

export default function Statistic() {
  const [selectedCategory, setSelectedCategory] = useState("Murid");

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="flex flex-col py-16 max-lg:px-10 px-[109px]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-12">
          {/* Header Section */}
          <div className="font-heading text-heading-sm font-semibold text-txt-black-900">
            Statistik Sekolah
          </div>

          {/* Chart Section */}
          <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
              <div className="flex flex-row">
                <Button
                  variant="default-ghost"
                  className={`rounded-full text-sm font-medium text-txt-black-500 ${
                    selectedCategory === "Murid"
                      ? "text-txt-black-900 bg-otl-gray-200 border-otl-gray-200"
                      : ""
                  }`}
                  size="small"
                  onClick={() => handleCategoryChange("Murid")}
                >
                  Murid
                </Button>
                <Button
                  variant="default-ghost"
                  className={`rounded-full text-sm font-medium text-txt-black-500 ${
                    selectedCategory === "Guru"
                      ? "text-txt-black-900 bg-otl-gray-200 border-otl-gray-200"
                      : ""
                  }`}
                  size="small"
                  onClick={() => handleCategoryChange("Guru")}
                >
                  Guru
                </Button>
              </div>
              <div className="text-txt-black-500 text-sm ">
                Data as of 4 Mar 2023, 23:59
              </div>
            </div>

            {/* Custom Chart */}
            <div className="flex flex-col md:flex-row gap-12 overflow-x-auto">
              <div className="w-full md:w-1/3">
                <CustomChart
                  title="SPM 2024"
                  daily={733}
                  total={"313,352"}
                  dataKey="spm"
                />
              </div>
              <div className="w-full md:w-1/3">
                <CustomChart
                  title="STEM"
                  daily={231}
                  total={"78,828"}
                  dataKey="stem"
                />
              </div>
              <div className="w-full md:w-1/3">
                <CustomChart
                  title="Kokurikulum"
                  daily={11}
                  total={"313,352"}
                  dataKey="koku"
                />
              </div>
            </div>

            {/* Time Series Slider */}
            <div className="flex items-center gap-3 w-full">
              <span className="text-txt-black-500 text-sm">2020</span>
              <div className="flex-1 h-1.5 bg-otl-gray-200 rounded-full relative">
                <div className="absolute h-1.5 bg-bg-black-400 rounded-full w-[20%]"></div>
                <div className="absolute w-4.5 h-4.5 bg-white border-2 border-bg-black-400 rounded-full shadow left-0 top-1/2 -translate-y-1/2 -translate-x-0 flex items-center justify-center"></div>
                <div className="absolute w-4.5 h-4.5 bg-white border-2 border-bg-black-400 rounded-full shadow left-[20%] top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center"></div>
              </div>
              <span className="text-txt-black-500 text-sm">2023</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
