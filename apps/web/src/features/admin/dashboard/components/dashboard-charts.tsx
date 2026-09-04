"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  TooltipProps,
} from "recharts";
import { TrendingUp, DollarSign, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChartData {
  name: string;
  value: number;
  bookings?: number;
}

interface PieData {
  name: string;
  value: number;
  color: string;
}

interface DashboardChartsProps {
  growthData: ChartData[];
  revenueData: ChartData[];
  distributionData?: PieData[];
  isLoading?: boolean;
  chartType?: "line" | "bar" | "mixed";
  colors?: {
    growth?: string;
    revenue?: string;
    grid?: string;
    tooltip?: string;
  };
}

const CustomTooltip = ({ active, payload, label, customColors }: any) => {
  if (active && payload && payload.length) {
    return (
      <div 
        className="p-3 rounded-xl shadow-xl border border-gray-100"
        style={{ background: "#fff" }}
      >
        <p className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">{label}</p>
        <div className="space-y-1.5">
          {payload.map((item: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[11px] font-medium text-gray-500 capitalize">{item.name}</span>
              </div>
              <span className="text-[11px] font-bold text-gray-900">
                {item.name === "revenue" ? `$${item.value?.toLocaleString()}` : item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function DashboardCharts({
  growthData,
  revenueData,
  distributionData = [],
  isLoading,
  colors = {
    growth: "#07143d",
    revenue: "#f59e0b",
    grid: "#f0f0f0",
    tooltip: "#07143d",
  },
}: DashboardChartsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {[1, 2].map((i) => (
          <div key={i} className="h-[380px] bg-white rounded-2xl border border-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Area Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Booking Trends</h3>
              <p className="text-[11px] text-gray-400">Total volume over the last 6 months</p>
            </div>
            <div className="p-2 rounded-lg" style={{ background: "rgba(7,20,61,0.05)" }}>
              <TrendingUp className="w-4 h-4" style={{ color: colors.growth }} />
            </div>
          </div>
          
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.growth} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={colors.growth} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  fontSize={10}
                  tick={{ fill: "#94a3b8", fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  fontSize={10}
                  tick={{ fill: "#94a3b8", fontWeight: 600 }}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip customColors={colors} />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={colors.growth}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorGrowth)"
                  name="bookings"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Revenue Performance</h3>
              <p className="text-[11px] text-gray-400">Monthly earnings and transaction volume</p>
            </div>
    
          </div>
          
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  fontSize={10}
                  tick={{ fill: "#94a3b8", fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  fontSize={10}
                  tick={{ fill: "#94a3b8", fontWeight: 600 }}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip customColors={colors} />} />
                <Bar
                  dataKey="value"
                  fill={colors.revenue}
                  radius={[4, 4, 0, 0]}
                  name="revenue"
                  barSize={20}
                />
                <Bar
                  dataKey="bookings"
                  fill={colors.growth}
                  radius={[4, 4, 0, 0]}
                  name="bookings"
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Property Distribution Pie Chart - Only show if data exists */}
      {distributionData && distributionData.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Property Distribution</h3>
              <p className="text-[11px] text-gray-400">Inventory breakdown by category</p>
            </div>
            <div className="p-2 rounded-lg bg-gray-50">
              <Building2 className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip customColors={colors} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {distributionData.map((entry, index) => (
                <div key={index} className="p-4 rounded-xl border border-gray-100 bg-gray-50/30">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {entry.name}
                    </span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{entry.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
