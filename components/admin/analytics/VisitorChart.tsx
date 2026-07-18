"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface ChartPoint {
  date: string;
  visitors: number;
}

interface Props {
  data?: ChartPoint[];
}

const demoData: ChartPoint[] = [
  { date: "Mon", visitors: 12 },
  { date: "Tue", visitors: 18 },
  { date: "Wed", visitors: 15 },
  { date: "Thu", visitors: 24 },
  { date: "Fri", visitors: 30 },
  { date: "Sat", visitors: 22 },
  { date: "Sun", visitors: 38 },
];

export default function VisitorChart({ data = demoData }: Props) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Visitor Trend</h2>

        <p className="text-sm text-gray-500">Daily visitor activity.</p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="visitors"
              stroke="#22C55E"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
