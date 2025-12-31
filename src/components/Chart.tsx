import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface ChartDataPoint {
  month: string;
  value: number;
  year: number;
}

interface ChartBaseData {
  [category: string]: {
    [year: string]: number[];
  };
}

interface ChartProps {
  title: string;
  daily: number;
  total: string | number;
  dataKey: string;
  chartData?: ChartDataPoint[];
  selectedYearRange?: { start: number; end: number };
  chartBaseData: ChartBaseData;
}

// Generate dynamic chart data based on year range
const generateChartData = (
  dataKey: string,
  yearRange: { start: number; end: number },
  baseData: ChartBaseData,
) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const data: ChartDataPoint[] = [];

  // Generate cumulative data for the selected year range
  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    let cumulativeValue = 0;

    // Sum up values from start year to end year for each month
    for (let year = yearRange.start; year <= yearRange.end; year++) {
      if (
        baseData[dataKey as keyof typeof baseData] &&
        baseData[dataKey as keyof typeof baseData][
          year as keyof (typeof baseData)[keyof typeof baseData]
        ]
      ) {
        const yearData = baseData[dataKey as keyof typeof baseData][
          year as keyof (typeof baseData)[keyof typeof baseData]
        ] as number[];
        cumulativeValue += yearData[monthIndex] || 0;
      }
    }

    data.push({
      month: months[monthIndex],
      value: cumulativeValue,
      year: yearRange.end,
    });
  }

  return data;
};

export default function CustomChart({
  title,
  daily,
  total,
  dataKey,
  selectedYearRange = { start: 2020, end: 2023 },
  chartBaseData,
}: ChartProps) {
  const chartData = generateChartData(
    dataKey,
    selectedYearRange,
    chartBaseData,
  );

  return (
    <div>
      <div className="bg-white">
        <div className="flex flex-col gap-3 items-start justify-between mb-6">
          <div>
            <h3 className="text-txt-black-900 font-bold text-lg font-body">
              {title}
            </h3>
          </div>

          <div className="flex flex-row gap-8">
            <div>
              <p className="text-txt-black-500 font-medium font-body text-sm">
                Daily
              </p>
              <p className="text-txt-black-900 font-medium font-body text-lg">
                +{daily}
              </p>
            </div>

            <div>
              <p className="text-txt-black-500 font-medium font-body text-sm">
                Total
              </p>
              <p className="text-txt-black-900 font-medium font-body text-lg">
                {total}
              </p>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200} minWidth={250}>
          <AreaChart
            data={chartData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id={`color${dataKey}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="#6B7280"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              textAnchor="end"
              height={20}
              interval={0}
            />
            <YAxis
              stroke="#6B7280"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                padding: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value) => (
                <span style={{ color: "#3B82F6", fontWeight: "bold" }}>
                  {`Total: ${
                    Array.isArray(value)
                      ? value.join(", ")
                      : typeof value === "number"
                        ? value.toLocaleString()
                        : (value ?? 0).toString()
                  }`}
                </span>
              )}
              labelFormatter={(label) => (
                <span style={{ color: "#1F2937", fontWeight: "600" }}>
                  {`Month: ${label}`}
                </span>
              )}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              fillOpacity={1}
              fill={`url(#color${dataKey})`}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
