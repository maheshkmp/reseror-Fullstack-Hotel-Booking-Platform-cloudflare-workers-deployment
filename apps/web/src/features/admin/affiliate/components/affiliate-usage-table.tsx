"use client";

import { useAffiliateUsage, usePayoutAffiliateUsage } from "../hooks/use-affiliate";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, DollarSign, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AffiliateUsageTable() {
  const { data: usage, isLoading } = useAffiliateUsage();
  const payoutMutation = usePayoutAffiliateUsage();

  const handlePayout = async (id: string) => {
    try {
      await payoutMutation.mutateAsync(id);
      toast.success("Payout marked as successful");
    } catch (err) {
      toast.error("Failed to mark payout");
    }
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold tracking-tight">Affiliate Earnings</h2>
      </div>

      <div className="border rounded-xl bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead className="font-black uppercase text-[10px] tracking-widest">Booking ID</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">Commission</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Disc. Amt</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Date</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Status</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usage?.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((u: any) => (
              <TableRow key={u.id}>
                <TableCell className="font-mono text-[10px] text-slate-500">{u.bookingId}</TableCell>
                <TableCell className="font-bold text-sm text-emerald-700">${u.commissionAmount}</TableCell>
                <TableCell className="text-center text-sm text-slate-500">${u.discountAmount}</TableCell>
                <TableCell className="text-center text-xs text-slate-500">
                  {format(new Date(u.createdAt), "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    {u.status === "paid" ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <CheckCircle2 size={10} /> Paid
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-50 text-amber-600 border border-amber-100">
                        <Clock size={10} /> Pending
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {u.status !== "paid" && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 text-[10px] uppercase font-black tracking-widest border-emerald-100 text-emerald-700 hover:bg-emerald-50"
                      onClick={() => handlePayout(u.id)}
                      disabled={payoutMutation.isPending}
                    >
                      {payoutMutation.isPending ? "..." : "Payout"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {usage?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-400 text-xs font-bold uppercase tracking-widest">
                  No earnings recorded
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
