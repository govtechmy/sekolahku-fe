import { useState } from "react";
import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ChevronRightIcon } from "@govtechmy/myds-react/icon";
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
  "#0062FF", // SK
  "#F472B6", // SJKC
  "#34D399", // SJKT
  "#F59E0B", // SRABK
  "#A78BFA", // SKPK
  "#C9B79C", // SMKK9
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
  const totalValue = validData.reduce((sum, item) => sum + item.total, 0);

  function RenderLegend() {
    return (
      <div className={clx("flex w-full flex-col gap-1", className)}>
        {validData.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <div
              key={index}
              className={clx(
                "flex items-center gap-2 rounded-lg px-2 py-1.5 cursor-pointer transition-colors focus:outline-primary-200",
                isActive
                  ? "bg-bg-white outline outline-1 outline-otl-primary-200"
                  : "hover:bg-bg-gray-100",
              )}
              tabIndex={0}
              role="button"
              aria-label={`${getCategoryLabel(item.jenis)}. Jumlah: ${item.total}`}
              aria-pressed={isActive}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(undefined)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveIndex(isActive ? undefined : index);
                }
              }}
              onClick={() => setActiveIndex(isActive ? undefined : index)}
            >
              <div
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: chartColors[index] ?? "#CCCCCC" }}
                aria-hidden="true"
              />
              <div
                className={clx(
                  "min-w-0 flex-1 text-body-sm text-txt-black-900",
                  isActive ? "font-semibold" : "font-normal",
                )}
              >
                {getCategoryLabel(item.jenis)}
              </div>
              <div className="shrink-0 text-body-sm font-semibold text-txt-black-500">
                {item.total.toLocaleString()}
              </div>
              <ChevronRightIcon
                className="size-3.5 shrink-0"
                style={{
                  color: isActive
                    ? (chartColors[index] ?? "#0062FF")
                    : "transparent",
                }}
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-6 sm:flex-row">
      {/* Pie Chart */}
      <div className="relative size-[180px] shrink-0 [&_*]:!outline-none">
        <ResponsiveContainer width={180} height={180}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="62%"
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
                  stroke="#FFFFFF"
                  strokeWidth={1.5}
                  opacity={
                    activeIndex === undefined || activeIndex === index ? 1 : 0.5
                  }
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-body-lg font-bold text-txt-black-900">
            {totalValue.toLocaleString()}
          </span>
          <span className="text-body-xs text-txt-black-500">Sekolah</span>
        </div>
      </div>

      {/* Legend */}
      <RenderLegend />
    </div>
  );
}
