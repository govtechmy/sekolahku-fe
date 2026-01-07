import { Button } from "@govtechmy/myds-react/button";
import CustomChart from "./Chart";
import { useState, useCallback, useRef, useEffect } from "react";

interface YearlyData {
  [year: string]: {
    spm: { daily: number; total: string };
    stem: { daily: number; total: string };
    koku: { daily: number; total: string };
  };
}

interface ChartBaseData {
  [category: string]: {
    [year: string]: number[];
  };
}

interface StatisticProps {
  yearlyData: YearlyData;
  chartBaseData: ChartBaseData;
}

export default function Statistic({
  yearlyData,
  chartBaseData,
}: StatisticProps) {
  const [selectedCategory, setSelectedCategory] = useState("Murid");
  const [selectedYearRange, setSelectedYearRange] = useState({
    start: 2020,
    end: 2021,
  });
  const [isDragging, setIsDragging] = useState<"start" | "end" | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Calculate cumulative data based on year range
  const getDataForRange = useCallback(() => {
    const startYear = selectedYearRange.start;
    const endYear = selectedYearRange.end;

    const cumulativeData = {
      spm: { daily: 0, total: 0 },
      stem: { daily: 0, total: 0 },
      koku: { daily: 0, total: 0 },
    };

    for (let year = startYear; year <= endYear; year++) {
      if (yearlyData[year as keyof typeof yearlyData]) {
        const data = yearlyData[year as keyof typeof yearlyData];
        cumulativeData.spm.daily += data.spm.daily;
        cumulativeData.spm.total += parseInt(data.spm.total.replace(/,/g, ""));
        cumulativeData.stem.daily += data.stem.daily;
        cumulativeData.stem.total += parseInt(
          data.stem.total.replace(/,/g, ""),
        );
        cumulativeData.koku.daily += data.koku.daily;
        cumulativeData.koku.total += parseInt(
          data.koku.total.replace(/,/g, ""),
        );
      }
    }

    return {
      spm: {
        daily: cumulativeData.spm.daily,
        total: cumulativeData.spm.total.toLocaleString(),
      },
      stem: {
        daily: cumulativeData.stem.daily,
        total: cumulativeData.stem.total.toLocaleString(),
      },
      koku: {
        daily: cumulativeData.koku.daily,
        total: cumulativeData.koku.total.toLocaleString(),
      },
    };
  }, [selectedYearRange, yearlyData]);

  const currentData = getDataForRange();

  // Convert position to year
  const positionToYear = useCallback((clientX: number) => {
    if (!sliderRef.current) return 2020;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(
      0,
      Math.min(100, ((clientX - rect.left) / rect.width) * 100),
    );
    const yearRange = 2023 - 2020;
    return Math.round(2020 + (percentage / 100) * yearRange);
  }, []);

  const handleSliderClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (isDragging) return; // Don't handle clicks while dragging

      const clickedYear = positionToYear(event.clientX);
      const { start, end } = selectedYearRange;

      // Determine which handle to move based on proximity
      const distanceToStart = Math.abs(clickedYear - start);
      const distanceToEnd = Math.abs(clickedYear - end);

      if (distanceToStart <= distanceToEnd) {
        // Move start handle, but don't let it go beyond end
        setSelectedYearRange({ start: Math.min(clickedYear, end), end });
      } else {
        // Move end handle, but don't let it go before start
        setSelectedYearRange({ start, end: Math.max(clickedYear, start) });
      }
    },
    [isDragging, positionToYear, selectedYearRange],
  );

  const handleMouseDown = useCallback(
    (handle: "start" | "end") => (event: React.MouseEvent) => {
      event.stopPropagation();
      setIsDragging(handle);
    },
    [],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isDragging) return;

      const newYear = positionToYear(event.clientX);

      if (isDragging === "start") {
        // Don't let start year go beyond end year
        setSelectedYearRange((prev) => ({
          start: Math.min(newYear, prev.end),
          end: prev.end,
        }));
      } else if (isDragging === "end") {
        // Don't let end year go before start year
        setSelectedYearRange((prev) => ({
          start: prev.start,
          end: Math.max(newYear, prev.start),
        }));
      }
    },
    [isDragging, positionToYear],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Calculate slider positions based on selected year range
  const startPosition =
    ((selectedYearRange.start - 2020) / (2023 - 2020)) * 100;
  const endPosition = ((selectedYearRange.end - 2020) / (2023 - 2020)) * 100;

  return (
    <div className="flex flex-col pb-16 px-4 lg:px-[50px]">
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
                  title={`SPM ${
                    selectedYearRange.start === selectedYearRange.end
                      ? selectedYearRange.end
                      : `${selectedYearRange.start}-${selectedYearRange.end}`
                  }`}
                  daily={currentData.spm.daily}
                  total={currentData.spm.total}
                  dataKey="spm"
                  selectedYearRange={selectedYearRange}
                  chartBaseData={chartBaseData}
                />
              </div>
              <div className="w-full md:w-1/3">
                <CustomChart
                  title={`STEM ${
                    selectedYearRange.start === selectedYearRange.end
                      ? selectedYearRange.end
                      : `${selectedYearRange.start}-${selectedYearRange.end}`
                  }`}
                  daily={currentData.stem.daily}
                  total={currentData.stem.total}
                  dataKey="stem"
                  selectedYearRange={selectedYearRange}
                  chartBaseData={chartBaseData}
                />
              </div>
              <div className="w-full md:w-1/3">
                <CustomChart
                  title={`Kokurikulum ${
                    selectedYearRange.start === selectedYearRange.end
                      ? selectedYearRange.end
                      : `${selectedYearRange.start}-${selectedYearRange.end}`
                  }`}
                  daily={currentData.koku.daily}
                  total={currentData.koku.total}
                  dataKey="koku"
                  selectedYearRange={selectedYearRange}
                  chartBaseData={chartBaseData}
                />
              </div>
            </div>

            {/* Time Series Slider */}
            <div className="flex items-center gap-3 w-full">
              <span className="text-txt-black-500 text-sm">2020</span>
              <div
                ref={sliderRef}
                className="flex-1 h-1.5 bg-otl-gray-200 rounded-full relative cursor-pointer"
                onClick={handleSliderClick}
              >
                {/* Fill between start and end handles */}
                <div
                  className="absolute h-1.5 bg-bg-black-400 rounded-full transition-all duration-200"
                  style={{
                    left: `${startPosition}%`,
                    width: `${endPosition - startPosition}%`,
                  }}
                ></div>

                {/* Start handle */}
                <div
                  className="absolute w-4.5 h-4.5 bg-white border-2 border-bg-black-400 rounded-full shadow top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center transition-all duration-200 cursor-grab active:cursor-grabbing hover:scale-110 z-10"
                  style={{ left: `${startPosition}%` }}
                  onMouseDown={handleMouseDown("start")}
                >
                  <div className="w-1.5 h-1.5 bg-bg-black-400 rounded-full"></div>
                </div>

                {/* End handle */}
                <div
                  className="absolute w-4.5 h-4.5 bg-white border-2 border-bg-black-400 rounded-full shadow top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center transition-all duration-200 cursor-grab active:cursor-grabbing hover:scale-110 z-10"
                  style={{ left: `${endPosition}%` }}
                  onMouseDown={handleMouseDown("end")}
                >
                  <div className="w-1.5 h-1.5 bg-bg-black-400 rounded-full"></div>
                </div>
              </div>
              <span className="text-txt-black-500 text-sm">2023</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
