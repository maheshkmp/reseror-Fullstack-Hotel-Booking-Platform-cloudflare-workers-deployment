"use client";

import { useGetUserPayments } from "@/features/userPayment-management/api/use-get-userPayments";
import { useUserHotelId } from "@/features/userPayment-management/api/use-user-hotel-id";
import { useGetRoomBookings } from "@/features/roomBookings/actions/get-room-booking";
import { useGetRoomBookingsStats } from "@/features/roomBookings/actions/get-room-booking-stats";
import { useGetMyHotel } from "@/features/hotels/queries/use-update-hotel-by-id";
import { useSettleAllPayments } from "@/features/userPayment-management/api/use-settle-all-payments";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useMemo } from "react";
import { List } from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowUpRight,
  TrendingUp,
  Banknote,
  FileWarning,
  CalendarDays,
  Target,
  ArrowRight,
  AlertCircle,
  Settings,
  CheckCircle2,
  CreditCard,
  History
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function HotelDashboard() {
  const { hotelId, loading: idLoading } = useUserHotelId();
  const { data: myHotel, isLoading: hotelLoading } = useGetMyHotel();
  const settleAllPayments = useSettleAllPayments();
  
  const { data: roomBookingsData, isLoading: roomBookingsLoading } = useGetRoomBookings({ 
    page: 1, 
    limit: 100, // Increased for calendar view
    hotelId: hotelId || "no-hotel-linked", // Strict filtering
  });

  const { data: stats, isLoading: statsLoading } = useGetRoomBookingsStats({
    hotelId: hotelId || undefined,
  });
  
  const { data: paymentsRes, isPending: paymentsLoading } = useGetUserPayments({
    hotelId: hotelId || undefined,
    limit: 100,
  });

  const payments = paymentsRes?.data || [];
  const bookings = useMemo(() => {
    if (!roomBookingsData?.data) return [];
    const seen = new Set();
    return roomBookingsData.data.filter((b: any) => {
      if (seen.has(b.id)) return false;
      seen.add(b.id);
      return b.hotelId === hotelId; // Force strict filtering
    });
  }, [roomBookingsData, hotelId]);
  
  const pendingApprovals = payments.filter((p: any) => p.type === 'receive_commission_from_cash' && !p.paid);

  const totalPayouts = stats?.totalRevenue || 0;

  const pendingCommissions = pendingApprovals
    .reduce((sum: number, p: any) => sum + parseFloat(p.amount || "0"), 0);

  const totalBookingsCount = stats?.total || 0;

  // Process daily insights from backend
  const chartData = useMemo(() => {
    if (!stats?.history || stats.history.length === 0) {
      // Fallback to empty defaults if no data
      return [];
    }
    
    return stats.history.map((day: any) => ({
      name: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: day.revenue,
      bookings: day.bookings,
      visits: day.visits,
      searches: day.searches,
      conversion: day.visits > 0 ? ((day.bookings / day.visits) * 100).toFixed(1) : 0
    }));
  }, [stats]);

  const tips = useMemo(() => {
    const list = [];
    if (myHotel) {
      if (!myHotel.description) list.push({ text: "Add a property description to attract more guests.", link: "/account/manage" });
      if (!myHotel.phone) list.push({ text: "Provide more images for more bookings.", link: "/account/manage" });
      if (!myHotel.latitude || !myHotel.longitude) list.push({ text: "Pin your exact location on the map for better visibility.", link: "/account/manage" });
      if (!myHotel.starRating) list.push({ text: "Set your star rating to manage guest expectations.", link: "/account/manage" });
    }
    return list;
  }, [myHotel]);

  if (idLoading || hotelLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-zinc-500">Loading metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-8 px-4 md:px-8 text-zinc-900">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-100 pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Live Property Overview</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
              {myHotel?.name || "Hotel Dashboard"}
            </h1>
            <p className="text-sm font-medium text-zinc-500 max-w-lg leading-relaxed">
              Track your property performance, manage reservations, and stay on top of daily operations with real-time insights.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/account/manage"
              className="group inline-flex items-center justify-center px-5 py-2 text-xs font-bold uppercase tracking-widest bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
            >
              <Settings className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-500" />
              Property Settings
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { 
              title: "Total Revenue", 
              value: `$${totalPayouts.toLocaleString()}`, 
              trend: "+12.5%", 
              trendColor: "text-emerald-600",
              bgColor: "bg-emerald-50",
              iconColor: "text-emerald-500",
              icon: Banknote,
              sub: "Revenue this year"
            },
            { 
              title: "Admin Dues", 
              value: `$${pendingCommissions.toLocaleString()}`, 
              trend: "Requires fulfillment", 
              trendColor: "text-rose-600",
              bgColor: "bg-rose-50",
              iconColor: "text-rose-500",
              icon: FileWarning,
              sub: "Pending commissions"
            },
            { 
              title: "Reservations", 
              value: totalBookingsCount, 
              trend: "All-time total", 
              trendColor: "text-zinc-500",
              bgColor: "bg-zinc-100",
              iconColor: "text-zinc-400",
              icon: CalendarDays,
              sub: "Confirmed bookings"
            },
            { 
              title: "Active Growth", 
              value: "+8.2%", 
              trend: "Trailing 30 days", 
              trendColor: "text-emerald-600",
              bgColor: "bg-blue-50",
              iconColor: "text-blue-500",
              icon: Target,
              sub: "Performance uptick"
            },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-zinc-200/80 rounded-xl px-6 py-5 hover:shadow-md transition-all group flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">{stat.title}</span>
                <div className={`p-2 rounded-xl ${stat.bgColor} ${stat.iconColor} transition-colors`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-2xl font-black tracking-tight text-zinc-900">
                    {stat.value}
                  </div>
                  <div className={`flex items-center text-[8px] font-bold uppercase tracking-wider ${stat.trendColor}`}>
                    {stat.trend}
                  </div>
                </div>

                {stat.title === "Admin Dues" && pendingCommissions > 0 && (
                  <Button 
                    size="sm"
                    className="w-full bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg text-[10px] font-bold uppercase tracking-widest h-9"
                    onClick={() => settleAllPayments.mutate({ hotelId: hotelId || undefined })}
                    disabled={settleAllPayments.isPending}
                  >
                    {settleAllPayments.isPending ? (
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    ) : (
                      <CreditCard className="w-3 h-3 mr-2" />
                    )}
                    Pay Total Now
                  </Button>
                )}
                
                {stat.title === "Admin Dues" && pendingCommissions === 0 && (
                  <Link 
                    href="/account/manage/payment-details"
                    className="flex items-center justify-center w-full bg-zinc-50 text-zinc-500 hover:text-zinc-900 border border-zinc-100 rounded-lg text-[9px] font-bold uppercase tracking-widest h-9 transition-colors"
                  >
                    <History className="w-3 h-3 mr-2" />
                    View History
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Left Column (Charts & Bookings) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Multi-Metric Deep Analytics */}
            {chartData.length > 0 && (
              <div className="bg-white border border-zinc-200/60 rounded-3xl p-8 shadow-sm">
                <div className="mb-10 flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-zinc-900">Monetary Growth</h2>
                    <p className="text-sm font-medium text-zinc-500 mt-1">Correlation between gross revenue and confirmed bookings.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                        Revenue
                      </span>
                    </div>
                    <div className="bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        Bookings
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorBook" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#F1F5F9" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 600 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 600 }}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '16px', 
                          border: 'none',
                          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                          padding: '16px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#4F46E5" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorRev)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="bookings" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorBook)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Visibility Reach Insights */}
                <div className="mt-12 pt-12 border-t border-zinc-100">
                  <div className="mb-10 flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                      <h2 className="text-xl font-extrabold text-zinc-900">Visibility Reach</h2>
                      <p className="text-sm font-medium text-zinc-500 mt-1">Property views vs. search appearances over the last 30 days.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-amber-500" />
                          Visits
                        </span>
                      </div>
                      <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-slate-500" />
                          Searches
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#F1F5F9" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 600 }}
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 600 }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: '16px', 
                            border: 'none',
                            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                            padding: '16px'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="visits" 
                          stroke="#F59E0B" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorVisits)" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="searches" 
                          stroke="#64748B" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          fill="transparent"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Latest Bookings Section */}
            <div className="bg-white border border-zinc-200/60 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-xl font-extrabold text-zinc-900">Latest Reservations</h2>
                  <p className="text-sm font-medium text-zinc-500 mt-1">Managing recent guest arrivals and bookings.</p>
                </div>
                <Link 
                  href="/account/calendar" 
                  className="inline-flex items-center px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-900 bg-zinc-50 hover:bg-zinc-100 rounded-xl border border-zinc-200 transition-all"
                >
                  Full Calendar <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {roomBookingsLoading ? (
                  <div className="py-12 flex flex-col items-center gap-3 text-zinc-400">
                    <div className="w-6 h-6 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
                    <span className="text-xs font-bold uppercase tracking-widest">Fetching...</span>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="py-12 text-center text-zinc-400 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                    <p className="text-sm font-medium">No recent bookings found.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-100 border border-zinc-100 rounded-2xl overflow-hidden shadow-sm">
                    {bookings.slice(0, 5).map((booking: any) => (
                      <div key={booking.id} className="group flex items-center justify-between px-5 py-4 bg-white hover:bg-zinc-50/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-300">
                            <List className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-zinc-900">#{booking.id.substring(0,8).toUpperCase()}</p>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                              Room {booking.roomId?.substring(0,6)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-10">
                          <div className="hidden md:block text-right">
                            <p className="text-xs font-bold text-zinc-900">
                              {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : "-"}
                            </p>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Booking Date</p>
                          </div>
                          <Badge variant="outline" className={cn(
                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                            booking.status === 'confirmed' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                            booking.status === 'pending' ? "bg-amber-50 text-amber-700 border-amber-100" :
                            "bg-zinc-50 text-zinc-700 border-zinc-200"
                          )}>
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-8">
            
            {/* Action Center - Attention Needed */}
            <div className="bg-white border border-zinc-200/60 rounded-3xl p-8 shadow-sm">
              <div className="mb-8">
                <h2 className="text-xl font-extrabold text-zinc-900 leading-tight">Action Center</h2>
                <p className="text-sm font-medium text-zinc-500 mt-1">Critical tasks and fulfillment alerts.</p>
              </div>
              
              {paymentsLoading ? (
                <div className="py-6 flex justify-center">
                  <div className="w-5 h-5 border-2 border-zinc-100 border-t-zinc-900 rounded-full animate-spin" />
                </div>
              ) : pendingApprovals.length > 0 ? (
                <div className="space-y-4">
                  {pendingApprovals.slice(0, 3).map((payment: any) => (
                    <div key={payment.id} className="relative overflow-hidden group p-5 bg-rose-50/30 border border-rose-100/50 rounded-2xl hover:bg-rose-50 transition-colors">
                      <div className="absolute top-0 right-0 p-2">
                        <AlertCircle className="w-4 h-4 text-rose-300" />
                      </div>
                      <div className="relative z-10">
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Administrative Debt</p>
                        <p className="text-sm font-bold text-zinc-900">Unpaid Commission</p>
                        <p className="text-xs text-zinc-600 mt-2 leading-relaxed font-medium">
                          Commission of <span className="font-extrabold text-rose-600">${payment.amount}</span> has been flagged as overdue.
                        </p>
                        <Link href="/account/manage/payment-details" className="group/btn mt-4 inline-flex items-center text-xs font-bold text-rose-600 uppercase tracking-widest hover:text-rose-700 transition-colors">
                          Settle Now <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-10 bg-zinc-50/50 border border-zinc-100 rounded-2xl text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 border border-zinc-100">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">Status Report</p>
                  <p className="text-sm font-bold text-zinc-900">Fully Operational</p>
                  <p className="text-xs font-medium text-zinc-500 mt-1.5 leading-relaxed">Everything is optimized and up to date.</p>
                </div>
              )}
            </div>

            {/* Smart Tips Sidebar */}
            <div className="relative overflow-hidden bg-slate-800 rounded-2xl p-4 text-white shadow-2xl shadow-zinc-900/20">
              <div className="absolute top-0 right-0 -m-4 w-24 h-24 bg-white/5 rounded-full blur-3xl" />
              <div className="relative z-10">
                <h2 className="text-xl font-extrabold mb-1">Optimization Guard</h2>
                <p className="text-sm font-medium text-zinc-400 mb-8">Systematic ways to increase your conversion rate.</p>

                {hotelLoading ? (
                  <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 animate-pulse">Analyzing...</div>
                ) : tips.length > 0 ? (
                  <div className="space-y-6">
                    {tips.map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
                          <span className="text-xs font-black text-zinc-300">{idx + 1}</span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-zinc-100 leading-snug">{tip.text}</p>
                          <Link href={tip.link} className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors">
                            Update Profile <ArrowRight className="w-3 h-3 ml-1.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-5 h-5 font-black" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-zinc-100">Profile Optimized</p>
                      <p className="text-[10px] text-zinc-400 mt-1 font-medium leading-snug">Property visibility is currently at its peak performance.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
