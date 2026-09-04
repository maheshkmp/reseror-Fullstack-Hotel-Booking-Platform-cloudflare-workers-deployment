"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Building2,
  CheckCircle2,
  Clock,
  TrendingUp,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer 
} from "recharts";

interface PropertyStatsProps {
  hotels: any[];
  isLoading: boolean;
}

// Sparkline data generator for visual flair
const generateSparklineData = (baseValue: number) => {
  return Array.from({ length: 10 }).map((_, i) => ({
    value: baseValue + Math.random() * (baseValue * 0.2) * (Math.random() > 0.5 ? 1 : -1)
  }));
};

export function PropertyStats({ hotels = [], isLoading }: PropertyStatsProps) {
  const stats = useMemo(() => {
    if (!hotels || hotels.length === 0) {
      return {
        total: 0,
        pendingApproval: 0,
        active: 0,
        totalRevenue: 0,
        totalBookings: 0,
      };
    }

    return {
      total: hotels.length,
      pendingApproval: hotels.filter((h) => h.status === "pending_approval").length,
      active: hotels.filter((h) => h.status === "active").length,
      totalRevenue: hotels.reduce((sum, h) => sum + (h.performance?.totalRevenue || 0), 0),
      totalBookings: hotels.reduce((sum, h) => sum + (h.performance?.totalBookings || 0), 0),
    };
  }, [hotels]);

  const cards = [
    {
      title: "Total Properties",
      value: stats.total,
      icon: <Building2 className="h-4 w-4" />,
      color: "indigo",
      trend: "+12%",
      isPositive: true,
      data: generateSparklineData(20)
    },
    {
      title: "Est. Revenue",
      value: stats.totalRevenue,
      icon: <TrendingUp className="h-4 w-4" />,
      color: "emerald",
      isCurrency: true,
      trend: "+8.4%",
      isPositive: true,
      data: generateSparklineData(1500)
    },
    {
      title: "Bookings",
      value: stats.totalBookings,
      icon: <BookOpen className="h-4 w-4" />,
      color: "blue",
      trend: "-2.1%",
      isPositive: false,
      data: generateSparklineData(50)
    },
    {
      title: "Pending Approval",
      value: stats.pendingApproval,
      icon: <Clock className="h-4 w-4" />,
      color: "amber",
      trend: "Action Required",
      isNeutral: true,
      data: generateSparklineData(5)
    },
    {
      title: "Active Listings",
      value: stats.active,
      icon: <CheckCircle2 className="h-4 w-4" />,
      color: "purple",
      trend: "Steady",
      isNeutral: true,
      data: generateSparklineData(15)
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 rounded-2xl border border-slate-200 bg-slate-100/50 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden group p-3 border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300">
            {/* Background Gradient */}
            <div className={cn(
              "absolute top-0 right-0 h-14 w-14 -mr-4 -mt-4 rounded-full opacity-10 transition-transform group-hover:scale-150 duration-500",
              card.color === "indigo" ? "bg-indigo-500" :
              card.color === "emerald" ? "bg-emerald-500" :
              card.color === "blue" ? "bg-blue-500" :
              card.color === "amber" ? "bg-amber-500" : "bg-purple-500"
            )} />

            <div className="flex flex-col h-full gap-3 relative z-10">
              <div className="flex items-center justify-between">
                <div className={cn(
                  "p-2 rounded-lg",
                  card.color === "indigo" ? " text-indigo-600" :
                  card.color === "emerald" ? " text-emerald-600" :
                  card.color === "blue" ? " text-blue-600" :
                  card.color === "amber" ? " text-amber-600" : " text-purple-600"
                )}>
                  {card.icon}
                </div>
                
                {card.trend && (
                  <div className={cn(
                    "flex items-center text-[8px] font-bold px-1.5 rounded-full",
                    card.isPositive ? "bg-emerald-50 text-emerald-700" :
                    card.isNeutral ? "bg-slate-100 text-slate-600" : "bg-rose-50 text-rose-700"
                  )}>
                    {!card.isNeutral && (card.isPositive ? <ArrowUpRight className="size-2.5 mr-0.5" /> : <ArrowDownRight className="size-2.5 mr-0.5" />)}
                    {card.trend}
                  </div>
                )}
              </div>

              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                  {card.title}
                </p>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {card.isCurrency ? `$${card.value.toLocaleString()}` : card.value.toLocaleString()}
                </h3>
              </div>

              {/* Mini Sparkline */}
              <div className="h-4 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={card.data}>
                    <defs>
                      <linearGradient id={`gradient-${card.color}`} x1="0" y1="0" x2="0" y2="1">
                        <stop 
                          offset="5%" 
                          stopColor={
                            card.color === "indigo" ? "#6366f1" :
                            card.color === "emerald" ? "#10b981" :
                            card.color === "blue" ? "#3b82f6" :
                            card.color === "amber" ? "#f59e0b" : "#a855f7"
                          } 
                          stopOpacity={0.3}
                        />
                        <stop 
                          offset="95%" 
                          stopColor={
                            card.color === "indigo" ? "#6366f1" :
                            card.color === "emerald" ? "#10b981" :
                            card.color === "blue" ? "#3b82f6" :
                            card.color === "amber" ? "#f59e0b" : "#a855f7"
                          } 
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke={
                        card.color === "indigo" ? "#6366f1" :
                        card.color === "emerald" ? "#10b981" :
                        card.color === "blue" ? "#3b82f6" :
                        card.color === "amber" ? "#f59e0b" : "#a855f7"
                      } 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill={`url(#gradient-${card.color})`} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
