"use client";

import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string | number;
    label: string;
    isPositive?: boolean;
  };
  isLoading?: boolean;
  className?: string;
}

export function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  isLoading,
  className,
}: KPICardProps) {
  return (
    <div 
      className={cn("p-3 rounded-2xl bg-white transition-all duration-200", className)}
      style={{ border: "1px solid #efefef" }}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
            {title}
          </span>
          <Icon className="w-3.5 h-3.5 text-gray-300" />
        </div>
        
        <div className="flex flex-col gap-1.5">
          {isLoading ? (
            <div className="h-8 w-24 bg-gray-50 rounded animate-pulse" />
          ) : (
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
              {value}
            </h3>
          )}
          
          {trend && !isLoading && (
            <div className="flex items-center gap-1.5 pt-0.5">
              <span
                className={cn(
                  "text-[8px] font-bold tracking-tight px-1.5 rounded bg-opacity-10",
                  trend.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                )}
              >
                {trend.value}
              </span>
              <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">
                {trend.label}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function KPICardsGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {children}
    </div>
  );
}
