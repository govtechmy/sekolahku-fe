import { useState } from "react";
import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { CategoryItem } from "../models/response";

interface DoughnutChartProps {
  title: string;
  data: CategoryItem[];
  colors?: string[];
}

const defaultColors = [
  "#1F77B4",
  "#FF7F0E",
  "#2CA02C",
  "#D62728",
  "#9467BD",
  "#8C564B",
  "#E377C2",
  "#7F7F7F",
  "#BCBD22",
  "#17BECF",
  "#AEC7E8",
  "#FFBB78",
  "#98DF8A",
  "#FF9896",
  "#C5B0D5",
  "#C49C94",
  "#F7B6D2",
  "#C7C7C7",
  "#DBDB8D",
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

  const handleLegendKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveIndex(activeIndex === index ? undefined : index);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
    }
  };

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
            Peratus: {payload[0].payload.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };
  const renderLegend = () => {
    return (
      <div className="grid grid-cols-2 gap-x-6 gap-y-6 mt-4 text-sm">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-2 rounded-md p-2 -m-2 cursor-pointer
                       transition-colors focus:outline focus:outline-2 focus:outline-otl-primary-200 focus:outline-offset-2
                       hover:bg-bg-gray-50"
            tabIndex={0}
            role="button"
            aria-label={`${item.jenis}: ${item.peratus}%`}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(undefined)}
            onClick={() =>
              setActiveIndex(activeIndex === index ? undefined : index)
            }
            onKeyDown={(e) => handleLegendKeyDown(e, index)}
          >
            <div className="flex flex-row items-center gap-4">
              <div
                className="w-6 h-6 rounded-full flex-shrink-0"
                style={{ backgroundColor: chartColors[index] }}
                aria-hidden="true"
              />
              {item.jenis}
            </div>

            <div>{item.peratus}%</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      <h3
        className="text-lg font-semibold mb-4 text-center focus:outline focus:outline-2 focus:outline-otl-primary-200 focus:outline-offset-2 rounded"
        tabIndex={0}
        role="button"
        aria-label={title}
        onKeyDown={handleTitleKeyDown}
      >
        {title}
      </h3>
      <div
        tabIndex={-1}
        style={{ outline: "none" }}
        className="[&_*]:!outline-none"
      >
        <ResponsiveContainer width="100%" height={180}>
          <PieChart tabIndex={-1}>
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
              tabIndex={-1}
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
      </div>

      {renderLegend()}
    </div>
  );
}
