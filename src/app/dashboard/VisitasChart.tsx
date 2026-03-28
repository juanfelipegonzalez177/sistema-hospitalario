"use client";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

export function VisitasChart({ data }: { data: { mes: string; total: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorVisitas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#16a34a" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#16a34a" stopOpacity={0}   />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
formatter={(v: any) => [`${v} visitas`, ""]}        />
        <Area
          type="monotone" dataKey="total" stroke="#16a34a"
          strokeWidth={2} fill="url(#colorVisitas)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}