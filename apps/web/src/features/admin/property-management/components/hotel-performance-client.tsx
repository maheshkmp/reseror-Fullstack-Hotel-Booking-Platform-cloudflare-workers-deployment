"use client";

import { useGetHotelPerformance } from "../api/use-get-hotel-performance";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, Legend 
} from "recharts";
import { 
  Building2, 
  TrendingUp, 
  Users, 
  Activity, 
  ChevronLeft,
  DollarSign,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface PerformanceProps {
  id: string;
}

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export function HotelPerformanceClient({ id }: PerformanceProps) {
  const { data, isLoading, error } = useGetHotelPerformance(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="shadow-none border-slate-200">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[350px] w-full rounded-xl" />
          <Skeleton className="h-[350px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="border-destructive/20 bg-destructive/5 shadow-none">
        <CardContent className="p-12 text-center">
          <Activity className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-bold text-destructive">Analytics Unbound</h3>
          <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
            We encountered an issue retrieving performance data for this property.
          </p>
          <Button asChild variant="outline" className="mt-6 border-destructive/20 hover:bg-destructive/10">
            <Link href="/admin/hotels">Return to Listing</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
            Performance <span className="text-indigo-600">Console</span>
          </h2>
          <p className="text-sm text-muted-foreground font-medium flex items-center gap-2 mt-1">
            <Building2 className="size-3.5" /> {data.name}
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="shadow-none border-slate-200 font-bold uppercase tracking-tight text-[11px]">
          <Link href="/admin/hotels" className="flex items-center">
            <ChevronLeft className="mr-1.5 size-3.5" /> Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* KPI Overlays */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-none border-slate-200/60 bg-gradient-to-br from-indigo-50/50 to-white">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="size-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <DollarSign className="size-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-widest text-indigo-600/60 leading-none mb-1">Total Revenue</p>
              <h3 className="text-xl font-black text-slate-900 leading-none tracking-tight">${data.stats.totalRevenue.toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none border-slate-200/60">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="size-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <Briefcase className="size-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-widest text-emerald-600/60 leading-none mb-1">Total Bookings</p>
              <h3 className="text-xl font-black text-slate-900 leading-none tracking-tight">{data.stats.totalBookings.toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none border-slate-200/60">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="size-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-sm">
              <TrendingUp className="size-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-widest text-amber-600/60 leading-none mb-1">Avg. Order Value</p>
              <h3 className="text-xl font-black text-slate-900 leading-none tracking-tight">${Math.round(data.stats.avgOrderValue).toLocaleString()}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none border-slate-200/60">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="size-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-sm">
              <Users className="size-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-widest text-sky-600/60 leading-none mb-1">Current Occupancy</p>
              <h3 className="text-xl font-black text-slate-900 leading-none tracking-tight">{data.stats.occupancyRate}%</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="shadow-none border-slate-200/60 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <div className="space-y-1">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-900">Revenue Stream</CardTitle>
              <CardDescription className="text-[10px] font-medium">Performance over last 30 intervals</CardDescription>
            </div>
            <TrendingUp className="size-3.5 text-indigo-600" />
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }}
                  tickFormatter={(val) => val.split('-').slice(1).join('/')}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: 'none', fontSize: '11px', fontWeight: 600 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#4f46e5" 
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0, fill: '#4f46e5' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Breakdown */}
        <Card className="shadow-none border-slate-200/60 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <div className="space-y-1">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-900">Reservation States</CardTitle>
              <CardDescription className="text-[10px] font-medium">Inventory lifecycle distribution</CardDescription>
            </div>
            <Activity className="size-3.5 text-indigo-600" />
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={data.bookingStatusBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="status"
                >
                  {data.bookingStatusBreakdown.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  iconType="circle"
                  formatter={(value) => <span className="text-[10px] font-bold uppercase text-slate-600 tracking-tight">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Room Type Performance */}
        <Card className="shadow-none border-slate-200/60 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <div className="space-y-1">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-900">Yield by Inventory Type</CardTitle>
              <CardDescription className="text-[10px] font-medium">Revenue contribution by room category</CardDescription>
            </div>
            <Building2 className="size-3.5 text-indigo-600" />
          </CardHeader>
          <CardContent className="min-h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.roomTypePerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }} />
                <YAxis 
                  dataKey="roomTypeName" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  width={140}
                  tick={{ fontSize: 10, fill: '#0f172a', fontWeight: 700 }}
                />
                <Tooltip />
                <Bar dataKey="revenue" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
