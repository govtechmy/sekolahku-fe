import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import type { CategoryItem } from "../models/response";
import { clx } from "@govtechmy/myds-react/utils";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  title: string;
  data: CategoryItem[];
  colors?: string[];
}

export default function DoughnutChart({ title, data, colors }: DoughnutChartProps) {
  const defaultColors = [
    '#172554',
    '#1E3A8A',
    '#1E40AF',
    '#1D4ED8',
    '#2563EB',
    '#3A75F6',
    '#6394FF',
    '#96B7FF',
    '#C2D5FF',
    '#DBEAFE',
    '#99cdf0',
    '#b3d9f4',
    '#cce5f8',
    '#e6f2fc',
    '#f0f7fd',
    '#f5faff',
    '#f9fcff',
    '#fcfeff',
    '#feffff',
  ];

  const chartData = {
    labels: data.map((item) => item.jenis),
    datasets: [
      {
        label: "Total",
        data: data.map((item) => item.total),
        backgroundColor: colors || defaultColors.slice(0, data.length),
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label;
            const value = context.parsed;
            const percentage = data[context.dataIndex].peratus;
            return `${label}: ${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  const colorClasses = colors?.length
  ? colors
  : defaultColors;

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-lg font-semibold text-txt-primary mb-4 text-center">
        {title}
      </h3>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-[180px] h-[300px]">
          <Doughnut data={chartData} options={options} />
        </div>
      </div>
      
      {/* Custom Legend - 2 Column Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
  {data.map((item, index) => (
    <div key={index} className="flex justify-center items-center gap-2">
      <div
        className={clx(
          "w-2 h-2 rounded-full flex-shrink-0",
          colorClasses[index] ?? "bg-blue-500"
        )}
      />
      <span className="text-txt-black-700 truncate">
        {item.jenis}: {item.total.toLocaleString()} ({item.peratus}%)
      </span>
    </div>
  ))}
    </div>
    </div>
  );
}
