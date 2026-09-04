"use client";

  import { 
    CheckCircle2, 
    Clock, 
    XCircle, 
    TrendingUp, 
    Calendar,
    Users
  } from "lucide-react";
  import { KPICard, KPICardsGrid } from "@/features/admin/dashboard/components/kpi-cards";
  import { useGetRoomBookingsStats } from "../../api/use-get-roomBookings";
  
  export function RoomBookingsStats() {
    const { data, isLoading } = useGetRoomBookingsStats();
    
    const stats = data?.data;
  
    return (
      <KPICardsGrid>
        <KPICard
          title="Total Bookings"
          value={stats?.total ?? 0}
          icon={Calendar}
          isLoading={isLoading}
        />
        <KPICard
          title="Confirmed"
          value={stats?.confirmed ?? 0}
          icon={CheckCircle2}
          isLoading={isLoading}
          className="border-emerald-500/20"
        />
        <KPICard
          title="Pending"
          value={stats?.pending ?? 0}
          icon={Clock}
          isLoading={isLoading}
          className="border-amber-500/20"
        />
        <KPICard
          title="Cancelled"
          value={stats?.cancelled ?? 0}
          icon={XCircle}
          isLoading={isLoading}
          className="border-rose-500/20"
        />
        <KPICard
          title="Total Revenue"
          value={`${stats?.totalRevenue?.toLocaleString() ?? 0} USD`}
          icon={TrendingUp}
          isLoading={isLoading}
        />
        <KPICard
          title="This Month"
          value={stats?.thisMonthBookings ?? 0}
          icon={Users}
          isLoading={isLoading}
        />
      </KPICardsGrid>
    );
  }
  
