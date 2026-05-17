import { useState } from "react";
import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { CategoryItem } from "../models/response";
import {
  SCHOOL_JENIS_BANTUAN,
  SCHOOL_TYPE_LABELS,
} from "../constants/schoolTypes";
import { clx } from "@govtechmy/myds-react/utils";

interface DoughnutChartProps {
  title?: string;
  data: CategoryItem[];
  colors?: string[];
  className?: string;
  type?: "SCHOOL_TYPE" | "SCHOOL_JENIS_BANTUAN";
}

const defaultColors = [
  "#A8C5E8", // lighter blue
  "#FFB380", // lighter orange
  "#8CD49B", // lighter green
  "#F08A8A", // lighter red
  "#C5A8DE", // lighter purple
  "#C4A59A", // lighter brown
  "#F5B8E0", // lighter pink
  "#B3B3B3", // lighter gray
  "#E0E18C", // lighter yellow-green
  "#7DD9F0", // lighter cyan
  "#D6E5F5", // very light blue
  "#FFD9B3", // very light orange
  "#C9EFD1", // very light green
  "#FFC9C9", // very light red
  "#E0D5EC", // very light purple
  "#E0CEC7", // very light brown
  "#FAE0ED", // very light pink
  "#E0E0E0", // very light gray
  "#EDEDC4", // very light yellow
];

// Darker border colors corresponding to each fill color
const borderColors = [
  "#5A8BC4", // darker blue
  "#E67E22", // darker orange
  "#52A765", // darker green
  "#C0504D", // darker red
  "#8B6BB7", // darker purple
  "#8C564B", // darker brown
  "#D687B9", // darker pink
  "#666666", // darker gray
  "#A8A83A", // darker yellow-green
  "#3FA9C7", // darker cyan
  "#7AABDC", // darker light blue
  "#F5A76D", // darker light orange
  "#7DC993", // darker light green
  "#F09694", // darker light red
  "#B8A3D1", // darker light purple
  "#B8A199", // darker light brown
  "#E8BCD4", // darker light pink
  "#AAAAAA", // darker light gray
  "#C7C77D", // darker light yellow
  "#94A9C7", // darker very light blue
  "#D9A96F", // darker very light orange
  "#8FC09B", // darker very light green
  "#E09999", // darker very light red
  "#B39DC4", // darker very light purple
  "#B8A598", // darker very light brown
  "#D9B0C7", // darker very light pink
  "#B3B3B3", // darker very light gray
  "#C4C48A", // darker very light yellow
  "#5A8BC4", // fallback (cycling back to start)
];

export default function DoughnutChart({
  data,
  colors,
  className,
  type = "SCHOOL_TYPE",
}: DoughnutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  // Graceful handling for invalid or empty data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-txt-black-500 text-sm">Tiada data tersedia</p>
        </div>
      </div>
    );
  }

  // Accept generic categories (including unknown jenis keys) and normalize numbers.
  const validData = data
    .filter((item) => item && item.jenis != null)
    .map((item) => ({
      jenis: String(item.jenis),
      total:
        typeof item.total === "number"
          ? item.total
          : Number.parseFloat(String(item.total)) || 0,
      peratus:
        typeof item.peratus === "number"
          ? item.peratus
          : Number.parseFloat(String(item.peratus)) || 0,
    }));

  if (validData.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-txt-black-500 text-sm">
            Tiada data sah untuk dipaparkan
          </p>
        </div>
      </div>
    );
  }

  const hasPositiveData = validData.some((item) => item.total > 0);

  if (!hasPositiveData) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-txt-black-500 text-sm">
            Tiada data sah untuk dipaparkan
          </p>
        </div>
      </div>
    );
  }

  const chartColors = colors || defaultColors.slice(0, validData.length);
  const chartBorderColors = borderColors.slice(0, validData.length);

  const getCategoryLabel = (jenis?: string) => {
    const key = jenis ?? "";
    if (type === "SCHOOL_TYPE") {
      return SCHOOL_TYPE_LABELS[key] ?? jenis ?? "-";
    }
    return SCHOOL_JENIS_BANTUAN[key] ?? jenis ?? "-";
  };

  const chartData = validData.map((item) => ({
    name: getCategoryLabel(item.jenis),
    value: Math.max(0, item?.total ?? 0), // Ensure non-negative values
  }));

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };
  const onPieLeave = () => {
    setActiveIndex(undefined);
  };
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
    }>;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-otl-gray-200 rounded shadow-lg">
          <p className="font-semibold text-txt-black-900">
            {payload[0]?.name ?? "0"}
          </p>
          <p className="text-txt-black-700">
            Jumlah: {payload[0]?.value ?? "0"}
          </p>
        </div>
      );
    }
    return null;
  };
  function RenderLegend() {
    return (
      <div
        className={clx(
          "w-full grid grid-cols-1 gap-x-6 gap-y-3 text-sm",
          className,
        )}
      >
        {validData &&
          validData.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2 rounded-md p-2 -m-2 cursor-pointer
                       transition-colors focus:outline focus:outline-2 focus:outline-otl-primary-200 focus:outline-offset-2
                       hover:bg-bg-gray-50"
              tabIndex={0}
              role="button"
              aria-label={`${getCategoryLabel(item.jenis)}. Jumlah: ${
                typeof item?.total === "number" ? item.total : "0"
              }`}
              aria-pressed={activeIndex === index}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(undefined)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveIndex(activeIndex === index ? undefined : index);
                }
              }}
              onClick={() =>
                setActiveIndex(activeIndex === index ? undefined : index)
              }
            >
              <div className="flex flex-row items-center gap-4">
                <div
                  className="w-6 h-6 rounded-full flex-shrink-0"
                  style={{ backgroundColor: chartColors[index] ?? "#CCCCCC" }}
                  aria-hidden="true"
                />

                <div className="text-txt-black-900 font-medium">
                  {getCategoryLabel(item.jenis)}
                </div>
              </div>

              <div className="text-txt-black-500 font-normal">
                {item?.total ?? 0}
              </div>
            </div>
          ))}
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col gap-6 items-center justify-center flex-1 h-full lg:flex-row">
        {/* Pie Chart */}
        <div className="flex w-full justify-center lg:w-1/2 lg:flex-none">
          <div className="[&_*]:!outline-none">
            <ResponsiveContainer width={280} height={280}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="50%"
                  outerRadius="100%"
                  paddingAngle={0}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                >
                  {chartData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={chartColors[index] ?? "#CCCCCC"}
                      stroke={chartBorderColors[index] ?? "#999999"}
                      strokeWidth={2}
                      opacity={
                        activeIndex === undefined || activeIndex === index
                          ? 1
                          : 0.6
                      }
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend */}
        <div className="flex w-full h-full items-center justify-center lg:w-1/2 lg:flex-none lg:justify-between">
          <RenderLegend />
        </div>
      </div>
    </div>
  );
}
