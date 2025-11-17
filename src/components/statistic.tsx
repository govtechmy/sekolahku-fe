import { Button } from "@govtechmy/myds-react/button";
import CustomChart from "./Chart";
import { useState, useCallback, useMemo } from "react";

export default function Statistic() {
  const [selectedCategory, setSelectedCategory] = useState("Murid");
  const [selectedYearRange, setSelectedYearRange] = useState({ start: 2020, end: 2021 });

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Sample data for different years (you can replace with real data)
  const yearlyData = useMemo(() => ({
    2020: { spm: { daily: 500, total: "250,000" }, stem: { daily: 150, total: "60,000" }, koku: { daily: 8, total: "280,000" } },
    2021: { spm: { daily: 600, total: "275,000" }, stem: { daily: 180, total: "65,000" }, koku: { daily: 9, total: "295,000" } },
    2022: { spm: { daily: 680, total: "295,000" }, stem: { daily: 210, total: "72,000" }, koku: { daily: 10, total: "305,000" } },
    2023: { spm: { daily: 733, total: "313,352" }, stem: { daily: 231, total: "78,828" }, koku: { daily: 11, total: "313,352" } }
  }), []);

  // Calculate cumulative data based on year range
  const getDataForRange = useCallback(() => {
    const startYear = selectedYearRange.start;
    const endYear = selectedYearRange.end;
    
    const cumulativeData = { spm: { daily: 0, total: 0 }, stem: { daily: 0, total: 0 }, koku: { daily: 0, total: 0 } };
    
    for (let year = startYear; year <= endYear; year++) {
      if (yearlyData[year as keyof typeof yearlyData]) {
        const data = yearlyData[year as keyof typeof yearlyData];
        cumulativeData.spm.daily += data.spm.daily;
        cumulativeData.spm.total += parseInt(data.spm.total.replace(/,/g, ''));
        cumulativeData.stem.daily += data.stem.daily;
        cumulativeData.stem.total += parseInt(data.stem.total.replace(/,/g, ''));
        cumulativeData.koku.daily += data.koku.daily;
        cumulativeData.koku.total += parseInt(data.koku.total.replace(/,/g, ''));
      }
    }
    
    return {
      spm: { daily: cumulativeData.spm.daily, total: cumulativeData.spm.total.toLocaleString() },
      stem: { daily: cumulativeData.stem.daily, total: cumulativeData.stem.total.toLocaleString() },
      koku: { daily: cumulativeData.koku.daily, total: cumulativeData.koku.total.toLocaleString() }
    };
  }, [selectedYearRange, yearlyData]);

  const currentData = getDataForRange();

  const handleSliderDrag = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const slider = event.currentTarget;
    const rect = slider.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    
    // Convert percentage to year (2020 to 2023)
    const yearRange = 2023 - 2020;
    const selectedYear = Math.round(2020 + (percentage / 100) * yearRange);
    
    setSelectedYearRange({ start: 2020, end: Math.max(2020, selectedYear) });
  }, []);

  // Calculate slider position based on selected year range
  const sliderPosition = ((selectedYearRange.end - 2020) / (2023 - 2020)) * 100;

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
                  title={`SPM ${selectedYearRange.start === selectedYearRange.end ? selectedYearRange.end : `${selectedYearRange.start}-${selectedYearRange.end}`}`}
                  daily={currentData.spm.daily}
                  total={currentData.spm.total}
                  dataKey="spm"
                  selectedYearRange={selectedYearRange}
                />
              </div>
              <div className="w-full md:w-1/3">
                <CustomChart
                  title={`STEM ${selectedYearRange.start === selectedYearRange.end ? selectedYearRange.end : `${selectedYearRange.start}-${selectedYearRange.end}`}`}
                  daily={currentData.stem.daily}
                  total={currentData.stem.total}
                  dataKey="stem"
                  selectedYearRange={selectedYearRange}
                />
              </div>
              <div className="w-full md:w-1/3">
                <CustomChart
                  title={`Kokurikulum ${selectedYearRange.start === selectedYearRange.end ? selectedYearRange.end : `${selectedYearRange.start}-${selectedYearRange.end}`}`}
                  daily={currentData.koku.daily}
                  total={currentData.koku.total}
                  dataKey="koku"
                  selectedYearRange={selectedYearRange}
                />
              </div>
            </div>

            {/* Time Series Slider */}
            <div className="flex items-center gap-3 w-full">
              <span className="text-txt-black-500 text-sm">2020</span>
              <div 
                className="flex-1 h-1.5 bg-otl-gray-200 rounded-full relative cursor-pointer"
                onClick={handleSliderDrag}
              >
                <div 
                  className="absolute h-1.5 bg-bg-black-400 rounded-full transition-all duration-200"
                  style={{ width: `${sliderPosition}%` }}
                ></div>
                <div className="absolute w-4.5 h-4.5 bg-white border-2 border-bg-black-400 rounded-full shadow left-0 top-1/2 -translate-y-1/2 -translate-x-0 flex items-center justify-center"></div>
                <div 
                  className="absolute w-4.5 h-4.5 bg-white border-2 border-bg-black-400 rounded-full shadow top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center transition-all duration-200 cursor-grab active:cursor-grabbing"
                  style={{ left: `${sliderPosition}%` }}
                ></div>
              </div>
              <span className="text-txt-black-500 text-sm">2023</span>
            </div>
            
            {/* Year Range Display */}
            <div className="text-center text-txt-black-700 text-sm font-medium">
              Data dari tahun {selectedYearRange.start} hingga {selectedYearRange.end}
              {selectedYearRange.start === selectedYearRange.end && ` (${selectedYearRange.end})`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
