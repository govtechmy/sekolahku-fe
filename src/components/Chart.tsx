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

interface ChartProps {
  title: string;
  daily: number;
  total: string | number;
  dataKey: string;
  chartData?: ChartDataPoint[];
  selectedYearRange?: { start: number; end: number };
}

// Generate dynamic chart data based on year range
const generateChartData = (dataKey: string, yearRange: { start: number; end: number }) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Base data for different categories and years
  const baseData = {
    spm: {
      2020: [30, 120, 280, 480, 440, 420, 350, 520, 580, 620, 650, 680],
      2021: [40, 150, 320, 550, 510, 480, 400, 580, 640, 690, 720, 750],
      2022: [35, 140, 300, 520, 480, 460, 380, 560, 610, 660, 690, 720],
      2023: [40, 170, 360, 610, 570, 540, 450, 645, 700, 750, 780, 800],
    },
    stem: {
      2020: [45, 110, 250, 450, 410, 390, 320, 490, 550, 590, 620, 650],
      2021: [60, 140, 290, 520, 480, 450, 370, 550, 610, 660, 690, 720],
      2022: [50, 130, 270, 490, 450, 430, 350, 530, 580, 630, 660, 690],
      2023: [60, 150, 320, 580, 530, 510, 400, 600, 660, 710, 740, 770],
    },
    koku: {
      2020: [35, 130, 270, 470, 430, 410, 330, 510, 570, 610, 640, 670],
      2021: [50, 160, 310, 540, 500, 470, 390, 570, 630, 680, 710, 740],
      2022: [45, 150, 290, 510, 470, 450, 370, 550, 600, 650, 680, 710],
      2023: [50, 160, 340, 590, 550, 520, 420, 620, 680, 730, 760, 790],
    },
  };

  const data: ChartDataPoint[] = [];
  
  // Generate cumulative data for the selected year range
  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    let cumulativeValue = 0;
    
    // Sum up values from start year to end year for each month
    for (let year = yearRange.start; year <= yearRange.end; year++) {
      if (baseData[dataKey as keyof typeof baseData] && baseData[dataKey as keyof typeof baseData][year as keyof typeof baseData[keyof typeof baseData]]) {
        const yearData = baseData[dataKey as keyof typeof baseData][year as keyof typeof baseData[keyof typeof baseData]] as number[];
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
}: ChartProps) {
  const chartData = generateChartData(dataKey, selectedYearRange);

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
              width={30}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                padding: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value: number) => [
                <span style={{ color: "#3B82F6", fontWeight: "bold" }}>
                  {`Total: ${value.toLocaleString()}`}
                </span>,
              ]}
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
