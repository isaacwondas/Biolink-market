"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";

const data = [
  { v: 10 },

  { v: 14 },

  { v: 12 },

  { v: 22 },

  { v: 26 },

  { v: 35 },

  { v: 32 },
];

export default function MiniChart() {
  return (
    <div className="h-20">
      <ResponsiveContainer>
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="v"
            stroke="#10b981"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
