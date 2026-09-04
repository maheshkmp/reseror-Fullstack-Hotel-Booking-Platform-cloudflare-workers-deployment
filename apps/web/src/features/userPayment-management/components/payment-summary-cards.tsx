"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useGetUserPayments } from "../api/use-get-userPayments";
import { useUserHotelId } from "../api/use-user-hotel-id";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useSettleAllPayments } from "../api/use-settle-all-payments";
import { CreditCard, Loader2 } from "lucide-react";

export function PaymentSummaryCards() {
  const { hotelId, loading: loadingId } = useUserHotelId();
  const { data, isPending } = useGetUserPayments({
    hotelId,
    limit: 100,
  });
  const settleAllPayments = useSettleAllPayments();

  if (loadingId || isPending) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const payments = data?.data || [];

  // Total earnings = Sum of all payouts (Online net + Cash commission sum?) 
  // Actually, for the owner, "Earnings" is the Net from Online + Total from Cash? 
  // Let's keep it simple: "Total Bookings Value", "Net Payouts", "Pending Commissions"
  
  const totalNetEarnings = payments
    .filter(p => p.type === 'repay_net_from_online')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  const pendingCommissions = payments
    .filter(p => p.type === 'receive_commission_from_cash' && p.status === 'pending')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);
  
  const paidCommissions = payments
    .filter(p => p.type === 'receive_commission_from_cash' && p.paid)
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  const recentPayment = payments.find(p => p.paid);

  const stats = [
    {
      title: "Total Net Earnings",
      value: `$${totalNetEarnings.toLocaleString()}`,
      description: "From online bookings",
      color: "text-slate-900",
    },
    {
      title: "Pending Commissions",
      value: `$${pendingCommissions.toLocaleString()}`,
      description: "Owed to admin",
      color: "text-rose-600",
    },
    {
      title: "Total Paid Comm.",
      value: `$${paidCommissions.toLocaleString()}`,
      description: "Settled with admin",
      color: "text-emerald-600",
    },
    {
      title: "Confirmed Bookings",
      value: payments.length.toString(),
      description: "In ledger history",
      color: "text-indigo-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, i) => (
        <Card 
          key={i} 
          className="relative border border-slate-200 bg-white shadow-none rounded-xl overflow-hidden group hover:border-slate-300 transition-colors"
        >
          <CardContent className="py-2.5 px-5">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.08em]">{stat.title}</p>
                <h3 className={`text-xl font-black tracking-tight ${stat.color}`}>
                  {stat.value}
                </h3>
              </div>
              
              {stat.title === "Pending Commissions" && pendingCommissions > 0 && (
                <Button 
                  size="sm"
                  variant="outline"
                  className="h-8 rounded-lg border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[10px] px-3 transition-all"
                  onClick={() => settleAllPayments.mutate({ hotelId: hotelId || undefined })}
                  disabled={settleAllPayments.isPending}
                >
                  {settleAllPayments.isPending ? (
                    <Loader2 className="w-3 h-3 animate-spin mr-1.5" />
                  ) : (
                    <CreditCard className="w-3 h-3 mr-1.5" />
                  )}
                  Pay Now
                </Button>
              )}
            </div>
            
            <p className="text-[10px] text-slate-400 mt-2 font-medium italic opacity-80">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
