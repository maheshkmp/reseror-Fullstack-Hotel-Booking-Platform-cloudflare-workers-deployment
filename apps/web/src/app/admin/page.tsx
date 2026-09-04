"use client";

import { useState, useMemo } from "react";
import { RefreshCw, Calendar, Building2, Star, FileText, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

import { KPICard, KPICardsGrid } from "@/features/admin/dashboard/components/kpi-cards";
const DashboardCharts = dynamic(
  () => import("@/features/admin/dashboard/components/dashboard-charts").then((m) => m.DashboardCharts),
  { ssr: false }
);
import { RecentBookings } from "@/features/admin/dashboard/components/recent-bookings";
import { RecentReviews } from "@/features/admin/dashboard/components/recent-reviews";
import { ActivityFeed } from "@/features/admin/dashboard/components/activity-feed";

import { useGetArticles } from "@/features/admin/article-management/api/use-get-article";
import { useGetRestaurants } from "@/features/resturant/actions/use-get-restaurant";
import { useGetReviews } from "@/features/review/actions/use-get-review";
import { useGetRoomBookings } from "@/features/roomBookings/actions/get-room-booking";
import { useGetCashRoomBookings } from "@/features/userPayment-management/api/use-get-userPayment";
import { useGetUsers } from "@/features/admin/users-management/api/use-get-users";

export default function SuperAdminDashboard() {
  const [timeRange, setTimeRange] = useState("7d");

  const { data: restaurants, isLoading: restaurantsLoading, refetch: refetchRestaurants } = useGetRestaurants({ page: 1, limit: 100 });
  const { data: reviews, isLoading: reviewsLoading, refetch: refetchReviews } = useGetReviews({ page: 1, limit: 100 });
  const { data: bookings, isLoading: bookingsLoading, refetch: refetchBookings } = useGetRoomBookings({ page: 1, limit: 100 });
  const { data: cashPayments, isLoading: paymentsLoading, refetch: refetchPayments } = useGetCashRoomBookings({ page: 1, limit: 100 });
  const { data: articles, isLoading: articlesLoading, refetch: refetchArticles } = useGetArticles({ page: 1, limit: 100 });
  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useGetUsers({ page: 1, limit: 100 });

  const isLoading = restaurantsLoading || reviewsLoading || bookingsLoading || paymentsLoading || articlesLoading || usersLoading;

  const handleRefresh = () => {
    refetchRestaurants();
    refetchReviews();
    refetchBookings();
    refetchPayments();
    refetchArticles();
    refetchUsers();
  };

  const getMonthYear = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("default", { month: "short", year: "2-digit" });
  };

  const { growthData, revenueData } = useMemo(() => {
    if (isLoading) return { growthData: [], revenueData: [] };

    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return d.toLocaleString("default", { month: "short", year: "2-digit" });
    });

    const monthStats = months.map((month) => ({
      name: month,
      bookings: 0,
      revenue: 0,
    }));

    bookings?.data?.forEach((b: any) => {
      const m = getMonthYear(b.createdAt);
      const idx = monthStats.findIndex((s) => s.name === m);
      if (idx !== -1) {
        monthStats[idx].bookings += 1;
        monthStats[idx].revenue += Number(b.totalAmount || 0);
      }
    });

    return {
      growthData: monthStats.map((s) => ({ name: s.name, value: s.bookings })),
      revenueData: monthStats.map((s) => ({ name: s.name, value: s.revenue, bookings: s.bookings })),
    };
  }, [bookings, isLoading]);

  const stats = useMemo(() => {
    const totalBookings = bookings?.meta?.totalCount || 0;
    const totalRestaurants = restaurants?.meta?.totalCount || 0;
    const totalReviews = reviews?.meta?.totalCount || 0;
    const totalArticles = articles?.meta?.totalCount || 0;
    const totalPayments = cashPayments?.meta?.totalCount || 0;
    const totalUsers = usersData?.total || 0;

    const avgRating =
      reviews?.data?.length > 0
        ? (
            reviews.data.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) /
            reviews.data.length
          ).toFixed(1)
        : "0.0";

    return { totalBookings, totalRestaurants, totalReviews, totalArticles, totalPayments, totalUsers, avgRating };
  }, [bookings, restaurants, reviews, articles, cashPayments, usersData]);

  return (
    <div className="flex flex-col gap-8 pb-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Platform overview and performance metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time range */}
          <div
            className="flex items-center p-1 rounded-lg"
            style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.07)" }}
          >
            {["24h", "7d", "30d"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className="h-7 px-3 text-[11px] font-bold uppercase rounded-md transition-all"
                style={{
                  background: timeRange === range ? "#fff" : "transparent",
                  color: timeRange === range ? "#07143d" : "#9ca3af",
                  border: timeRange === range ? "1px solid rgba(0,0,0,0.08)" : "1px solid transparent",
                }}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-9 px-4 flex items-center gap-2 rounded-lg text-[11px] font-bold uppercase tracking-wide transition-colors disabled:opacity-50"
            style={{ border: "1px solid rgba(0,0,0,0.1)", background: "#fff", color: "#07143d" }}
          >
            <RefreshCw
              className={cn("w-3.5 h-3.5", isLoading && "animate-spin")}
            />
            {isLoading ? "Syncing…" : "Refresh"}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <KPICardsGrid>
        <KPICard
          title="Total Bookings"
          value={stats.totalBookings.toLocaleString()}
          icon={Calendar}
          trend={{ value: "+12%", label: "vs last month", isPositive: true }}
          isLoading={isLoading}
        />
        <KPICard
          title="Active Properties"
          value={stats.totalRestaurants}
          icon={Building2}
          trend={{ value: "+3", label: "new this week", isPositive: true }}
          isLoading={isLoading}
        />
        <KPICard
          title="Avg Rating"
          value={`${stats.avgRating}/5`}
          icon={Star}
          trend={{ value: stats.totalReviews, label: "total reviews", isPositive: true }}
          isLoading={isLoading}
        />
        <KPICard
          title="Revenue"
          value={`$${stats.totalPayments.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: "+8.4%", label: "growth", isPositive: true }}
          isLoading={isLoading}
        />
        <KPICard
          title="Total Articles"
          value={stats.totalArticles}
          icon={FileText}
          isLoading={isLoading}
        />
        <KPICard
          title="Active Users"
          value={stats.totalUsers}
          icon={Users}
          trend={{ value: "Active", label: "status", isPositive: true }}
          isLoading={isLoading}
        />
      </KPICardsGrid>

      {/* Charts */}
      <DashboardCharts
        growthData={growthData}
        revenueData={revenueData}
        isLoading={isLoading}
        chartType="line"
        colors={{
          growth: "#07143d",
          revenue: "#f59e0b",
          grid: "#f0f0f0",
          tooltip: "#07143d",
        }}
      />

      {/* Bottom grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <RecentBookings bookings={bookings?.data || []} isLoading={isLoading} />
          <RecentReviews reviews={reviews?.data || []} isLoading={isLoading} />
        </div>

        <div className="space-y-6">
          <ActivityFeed
            bookings={bookings?.data || []}
            reviews={reviews?.data || []}
            articles={articles?.data || []}
            restaurants={restaurants?.data || []}
            users={usersData?.users || []}
            isLoading={isLoading}
          />

          {/* Platform status */}
          <div
            className="p-5 rounded-xl"
            style={{ border: "1px solid #efefef", background: "#fff" }}
          >
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Platform Health
              </p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                  Operational
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: "API Latency", value: "124ms" },
                { label: "Uptime (30d)", value: "99.98%" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{item.label}</span>
                  <span className="text-xs font-bold text-gray-800 font-mono">{item.value}</span>
                </div>
              ))}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">Resource Usage</span>
                  <span className="text-xs font-bold text-gray-800">85%</span>
                </div>
                <div
                  className="w-full h-1.5 rounded-full overflow-hidden"
                  style={{ background: "#f3f4f6" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: "85%", background: "#07143d" }}
                  />
                </div>
              </div>

              <p className="text-[10px] text-gray-300 pt-1">
                Last backup: 2 hours ago
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}