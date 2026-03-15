import { useState } from "react";
import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { CategoryItem } from "../models/response";

interface DoughnutChartProps {
  title: string;
  data: CategoryItem[];
  colors?: string[];
}

const defaultColors = [
  "#A8C5E8",  // lighter blue
  "#FFB380",  // lighter orange
  "#8CD49B",  // lighter green
  "#F08A8A",  // lighter red
  "#C5A8DE",  // lighter purple
  "#C4A59A",  // lighter brown
  "#F5B8E0",  // lighter pink
  "#B3B3B3",  // lighter gray
  "#E0E18C",  // lighter yellow-green
  "#7DD9F0",  // lighter cyan
  "#D6E5F5",  // very light blue
  "#FFD9B3",  // very light orange
  "#C9EFD1",  // very light green
  "#FFC9C9",  // very light red
  "#E0D5EC",  // very light purple
  "#E0CEC7",  // very light brown
  "#FAE0ED",  // very light pink
  "#E0E0E0",  // very light gray
  "#EDEDC4",  // very light yellow
];

// Darker border colors corresponding to each fill color
const borderColors = [
  "#5A8BC4",  // darker blue
  "#E67E22",  // darker orange
  "#52A765",  // darker green
  "#C0504D",  // darker red
  "#8B6BB7",  // darker purple
  "#8C564B",  // darker brown
  "#D687B9",  // darker pink
  "#666666",  // darker gray
  "#A8A83A",  // darker yellow-green
  "#3FA9C7",  // darker cyan
  "#7AABDC",  // darker light blue
  "#F5A76D",  // darker light orange
  "#7DC993",  // darker light green
  "#F09694",  // darker light red
  "#B8A3D1",  // darker light purple
  "#B8A199",  // darker light brown
  "#E8BCD4",  // darker light pink
  "#AAAAAA",  // darker light gray
  "#C7C77D",  // darker light yellow
];

export default function DoughnutChart({
  title,
  data,
  colors,
}: DoughnutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const chartColors = colors || defaultColors.slice(0, data.length);
  const chartBorderColors = borderColors.slice(0, data.length);
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
            Peratus: {payload[0].payload.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };
  const renderLegend = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
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
      {title && (
        <h3
          className="text-lg font-semibold mb-4 text-center focus:outline focus:outline-2 focus:outline-otl-primary-200 focus:outline-offset-2 rounded"
          tabIndex={0}
          role="button"
          aria-label={title || "Chart title"}
        >
          {title}
        </h3>
      )}
      
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-center">
        {/* Pie Chart */}
        <div className="flex-shrink-0 w-full lg:w-auto flex justify-center">
          <div
            tabIndex={-1}
            style={{ outline: "none" }}
            className="[&_*]:!outline-none"
          >
            <ResponsiveContainer width={280} height={280}>
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
                      stroke={chartBorderColors[index]}
                      strokeWidth={2}
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
        </div>

        {/* Legend */}
        <div className="w-full lg:w-auto lg:max-w-md flex items-center justify-center">
          {renderLegend()}
        </div>
      </div>
    </div>
  );
}
