import { useState } from "react";
import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { CategoryItem } from "../models/response";

interface DoughnutChartProps {
  title: string;
  data: CategoryItem[];
  colors?: string[];
}

const defaultColors = [
  "#172554",
  "#1E3A8A",
  "#1E40AF",
  "#1D4ED8",
  "#2563EB",
  "#3A75F6",
  "#6394FF",
  "#96B7FF",
  "#C2D5FF",
  "#DBEAFE",
  "#99cdf0",
  "#b3d9f4",
  "#cce5f8",
  "#e6f2fc",
  "#f0f7fd",
  "#f5faff",
  "#f9fcff",
  "#fcfeff",
  "#feffff",
];

export default function DoughnutChart({
  title,
  data,
  colors,
}: DoughnutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const chartColors = colors || defaultColors.slice(0, data.length);
  const chartData = data.map((item) => ({
    name: item.jenis,
    value: item.total,
    percentage: item.peratus,
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
      payload: { percentage: number };
    }>;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-otl-gray-200 rounded shadow-lg">
          <p className="font-semibold text-txt-black-900">{payload[0].name}</p>
          <p className="text-txt-black-700">
            Total: {payload[0].value.toLocaleString()}
          </p>
          <p className="text-txt-black-700">
            Peratus: {payload[0].payload.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };
  const renderLegend = () => {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: chartColors[index] }}
            />
            <span className="text-txt-black-700 truncate text-xs">
              {item.jenis}: {item.total.toLocaleString()} ({item.peratus}%)
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-lg font-semibold text-txt-primary mb-4 text-center">
        {title}
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={0}
            dataKey="value"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
          >
            {chartData.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={chartColors[index]}
                opacity={
                  activeIndex === undefined || activeIndex === index ? 1 : 0.6
                }
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {renderLegend()}
    </div>
  );
}
