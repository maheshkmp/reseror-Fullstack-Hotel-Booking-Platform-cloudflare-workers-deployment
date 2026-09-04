"use client";

import { useGetRoomBookingsStatsByUserId } from "../../api/use-get-roomBookings-stats-by-user-id";
import { useGetRoomBookingsStats } from "../../api/use-get-roomBookings-stats";
import { KPICard } from "@/features/admin/dashboard/components/kpi-cards";
import { Calendar, CalendarRange, CheckCircle2, CircleDollarSign, Loader2, XCircle, ArrowUpRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export function RoomBookingsStats({ hotelId, mode = "user" }: { hotelId?: string; mode?: "user" | "hotel" }) {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  
  const userStatsQuery = useGetRoomBookingsStatsByUserId(session?.user?.id, { enabled: !!session && !isSessionPending });
  const hotelStatsQuery = useGetRoomBookingsStats({ hotelId }, { enabled: !!session && !isSessionPending });

  // If mode is 'hotel', we always use hotelStatsQuery (even if hotelId is undefined, 
  // as the backend handles 'all hotels' for the owner).
  const { data, isLoading } = mode === "hotel" ? hotelStatsQuery : userStatsQuery;

  if (isSessionPending) {
    return (
      <div className="flex h-24 items-center justify-center rounded-xl border border-border/50 bg-secondary/20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session) return null;

  if (isLoading) {
    return (
      <div className="flex h-24 items-center justify-center rounded-xl border border-border/50 bg-secondary/20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const stats = data?.data;

  if (!stats) return null;

  return (
    <div className="mb-2 mt-1">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-zinc-400" />
          <h3 className="text-sm font-bold tracking-tight text-zinc-900 uppercase tracking-[0.1em]">Booking Overview</h3>
        </div>
        <Link 
          href="/account/calendar"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-green-500 hover:text-green-900 bg-green-100/50 hover:bg-green-100 rounded-lg border border-green-200/50 transition-all group"
        >
          <CalendarRange className="w-3.5 h-3.5" />
          View Calendar
          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-secondary/20 p-3 rounded-xl border border-border/40">
        <KPICard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={CircleDollarSign}
          trend={{ value: "+12%", label: "vs last month", isPositive: true }}
          className="bg-background shadow-sm border-border/60"
        />
        <KPICard
          title="Total Bookings"
          value={stats.total.toLocaleString()}
          icon={Calendar}
          className="bg-background shadow-sm border-border/60"
        />
        <KPICard
          title="Confirmed"
          value={stats.confirmed.toLocaleString()}
          icon={CheckCircle2}
          className="bg-background shadow-sm border-border/60"
        />
        <KPICard
          title="Cancelled"
          value={stats.cancelled.toLocaleString()}
          icon={XCircle}
          className="bg-background shadow-sm border-border/60"
        />
      </div>
    </div>
  );
}
