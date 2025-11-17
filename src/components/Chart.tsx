import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface ChartProps {
  title: string;
  daily: number;
  total: string | number;
  dataKey: string;
}

const chartData = [
  { month: "Jan", spm: 40, stem: 60, koku: 50 },
  { month: "Feb", spm: 170, stem: 150, koku: 160 },
  { month: "Mar", spm: 360, stem: 320, koku: 340 },
  { month: "Apr", spm: 610, stem: 580, koku: 590 },
  { month: "May", spm: 570, stem: 530, koku: 550 },
  { month: "Jun", spm: 540, stem: 510, koku: 520 },
  { month: "Jul", spm: 450, stem: 400, koku: 420 },
  { month: "Aug", spm: 645, stem: 600, koku: 620 },
];

export default function CustomChart({
  title,
  daily,
  total,
  dataKey,
}: ChartProps) {
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
              //   angle={-45}
            />
            <YAxis
              stroke="#6B7280"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              // domain={[0, 650]}
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
              dataKey={dataKey}
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
