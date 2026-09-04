"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import InfluencersTable from "./influencers-table";
import AffiliateUsageTable from "./affiliate-usage-table";
import { Users, DollarSign, TrendingUp } from "lucide-react";
import { useInfluencers, useAffiliateUsage } from "../hooks/use-affiliate";
import { useMemo } from "react";

export default function AffiliateManagement() {
  const { data: influencers } = useInfluencers();
  const { data: usage } = useAffiliateUsage();

  const stats = useMemo(() => {
    const totalEarnings = usage?.reduce((acc: number, u: any) => acc + parseFloat(u.commissionAmount), 0) || 0;
    const totalRevenue = usage?.length || 0; // Simple count for now
    const activeInfluencers = influencers?.filter((inf: any) => inf.isActive).length || 0;

    return {
      totalEarnings,
      totalRevenue,
      activeInfluencers,
    };
  }, [influencers, usage]);

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-blue-600">
            {/* <Users size={16} /> */}
            <span className="text-[10px] font-black uppercase tracking-widest">Active Influencers</span>
          </div>
          <p className="text-3xl font-black text-slate-900 tracking-tighter">{stats.activeInfluencers}</p>
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-emerald-600">
            {/* <TrendingUp size={16} /> */}
            <span className="text-[10px] font-black uppercase tracking-widest">Total Bookings</span>
          </div>
          <p className="text-3xl font-black text-slate-900 tracking-tighter">{stats.totalRevenue}</p>
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-amber-600">
            {/* <DollarSign size={16} /> */}
            <span className="text-[10px] font-black uppercase tracking-widest">Total Commissions</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-black text-slate-400">USD</span>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">{stats.totalEarnings.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="influencers" className="space-y-6">
        <TabsList className="bg-slate-100/50 p-1 rounded-xl">
          <TabsTrigger value="influencers" className="rounded-lg px-6 py-2 text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Influencers
          </TabsTrigger>
          <TabsTrigger value="earnings" className="rounded-lg px-6 py-2 text-xs font-bold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Earnings & Payouts
          </TabsTrigger>
          <div className="flex-1" />
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider border-slate-200 hover:bg-slate-50 mr-1"
            onClick={() => {
              window.open(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/affiliate/report/payouts`, "_blank");
            }}
          >
            Export Payout Report
          </Button>
        </TabsList>
        <TabsContent value="influencers">
          <InfluencersTable />
        </TabsContent>
        <TabsContent value="earnings">
          <AffiliateUsageTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
