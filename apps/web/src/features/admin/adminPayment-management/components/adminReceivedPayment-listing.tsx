"use client";

import {
  CreditCard,
  DollarSign,
  Eye,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  XCircle,
  FileText
} from "lucide-react";
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateAdminPayment } from "../../booking-management/components/admin-payments/components/create-adminPayment/create-adminPayment";
import { useGetPaymentsAdmin, useUpdatePaymentAdmin } from "../api";
import { useGetHotels } from "@/features/hotels/queries/use-get-hotels";
import { useUpdateUserPayment } from "@/features/userPayment-management/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { KPICard } from "@/features/admin/dashboard/components/kpi-cards";
import { cn } from "@/lib/utils";
import React from 'react';

const StatusBadge = React.memo(({ settled, status }: { settled: boolean, status?: string }) => {
  let label = settled ? "Settled" : "Pending";
  let color = settled ? "bg-emerald-500" : "bg-amber-500";
  
  if (status === "submitted") {
    label = "Reviewing";
    color = "bg-blue-500";
  } else if (status === "rejected") {
    label = "Rejected";
    color = "bg-red-500";
  } else if (status === "confirmed") {
    label = "Approved";
    color = "bg-emerald-500";
  }

  return (
    <div className="flex items-center gap-1.5 group/status cursor-default">
      <div className={cn("size-1.5 rounded-full animate-pulse", color)} />
      <span className="text-[10px] font-bold uppercase tracking-tight text-foreground/70">
        {label}
      </span>
    </div>
  );
});
StatusBadge.displayName = "StatusBadge";

export default function AdminReceivedPaymentListing() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentType, setPaymentType] = useState<string>("all");
  const [paymentMethod, setPaymentMethod] = useState<string>("all");
  const [settledStatus, setSettledStatus] = useState<string>("all");
  const [selectedHotelId, setSelectedHotelId] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const { data: hotelsData } = useGetHotels({ limit: "100", sort: "asc" });
  const { data: paymentsData, isLoading, refetch } = useGetPaymentsAdmin({
    page: currentPage.toString(),
    limit: "12",
    sort: sortOrder,
    search: searchQuery || undefined,
    type: paymentType === "all" ? undefined : (paymentType as any),
    method: paymentMethod === "all" ? undefined : paymentMethod,
    hotelId: selectedHotelId === "all" ? undefined : selectedHotelId,
  });

  const updatePayment = useUpdatePaymentAdmin();
  const updateHotelPayment = useUpdateUserPayment(); // I will reuse or import the hotel update hook

  const metrics = useMemo(() => {
    if (!paymentsData?.data) return { total: 0, settled: 0, pending: 0 };
    return paymentsData.data.reduce((acc: any, curr: any) => {
      const amt = parseFloat(curr.amount || "0");
      acc.total += amt;
      if (curr.settled) acc.settled += amt;
      else acc.pending += amt;
      return acc;
    }, { total: 0, settled: 0, pending: 0 });
  }, [paymentsData?.data]);

  const handleMarkAsSettled = async (payment: any) => {
    try {
      if (payment.isReport) {
        await updateHotelPayment.mutateAsync({ 
          id: payment.id, 
          data: { status: "confirmed", paid: true, paidAt: new Date() } 
        });
        toast.success("Commission report approved");
      } else {
        await updatePayment.mutateAsync({ id: payment.id, data: { settled: true, settledAt: new Date() } });
        toast.success("Settlement verified");
      }
      refetch();
    } catch (err) {
      toast.error("Process failed");
    }
  };

  const handleRejectReport = async (id: string) => {
    const reason = window.prompt("Enter rejection reason:");
    if (reason === null) return;
    
    try {
      await updateHotelPayment.mutateAsync({ 
        id, 
        data: { status: "rejected", rejectionReason: reason } 
      });
      toast.success("Report rejected");
      refetch();
    } catch (err) {
      toast.error("Process failed");
    }
  };

  const formatCurrency = (amt: string) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(parseFloat(amt));

  const getHotelName = (id: string) => hotelsData?.data?.find((h: any) => h.id === id)?.name || "External Hotel";

  if (isLoading) return <div className="h-full w-full bg-accent/5 animate-pulse rounded-md" />;

  const payments = paymentsData?.data || [];
  const meta = paymentsData?.meta || { currentPage: 1, limit: 12, totalCount: 0, totalPages: 1 };

  return (
    <div className="flex flex-col gap-4 h-full overflow-hidden">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <KPICard title="Total Transactions" value={`$${metrics.total.toLocaleString()}`} icon={DollarSign} isLoading={isLoading} />
        <KPICard title="Settled Payouts" value={`$${metrics.settled.toLocaleString()}`} icon={CheckCircle2} isLoading={isLoading} />
        <KPICard title="Pending Settlement" value={`$${metrics.pending.toLocaleString()}`} icon={Clock} isLoading={isLoading} />
      </div>

      {/* Dynamic Filter Section */}
      <div className="flex flex-col lg:flex-row items-center gap-3 bg-secondary/30 p-2 rounded-md border border-border/40">
        <div className="relative flex-1 group">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/50 group-focus-within:text-foreground/50 transition-colors" />
          <Input
            placeholder="Search payments..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="pl-8 h-8 text-[11px] bg-background/50 border-border/40 shadow-none focus-visible:ring-1 focus-visible:ring-border/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedHotelId} onValueChange={(val) => { setSelectedHotelId(val); setCurrentPage(1); }}>
            <SelectTrigger className="h-8 w-[160px] text-[11px] font-bold uppercase tracking-tight bg-background/50 border-border/40">
              <SelectValue placeholder="All Hotels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ALL PROPERTIES</SelectItem>
              {hotelsData?.data?.map((hotel: any) => <SelectItem key={hotel.id} value={hotel.id}>{hotel.name}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={paymentType} onValueChange={(val) => { setPaymentType(val); setCurrentPage(1); }}>
            <SelectTrigger className="h-8 w-[110px] text-[11px] font-bold uppercase tracking-tight bg-background/50 border-border/40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ALL TYPES</SelectItem>
              <SelectItem value="incoming">INCOMING</SelectItem>
              <SelectItem value="outgoing">OUTGOING</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={() => refetch()} className="size-8 border-border/40 hover:bg-background shadow-none">
            <Filter className="size-3.5 text-muted-foreground/60" />
          </Button>
        </div>
      </div>

      {/* High-Density Table */}
      <div className="flex-1 min-h-0 border border-border/40 rounded-md bg-background overflow-hidden relative">
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-border">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-20 bg-secondary/80 backdrop-blur-sm shadow-sm border-b border-border/40">
              <tr>
                {["Transaction", "Partner", "Amount", "Status", "Recorded", ""].map((h, i) => (
                  <th key={h} className={cn("px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70", i === 5 && "text-right")}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((p: any) => (
                <tr key={p.id} className="group hover:bg-accent/10 border-b border-border/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="size-6 rounded bg-secondary/50 flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors border border-border/40">
                        {p.isReport ? <FileText className="size-3 text-indigo-500" /> : <CreditCard className="size-3" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-foreground font-mono">
                          {p.isReport ? (p.restaurantBookingId ? `#RB-${p.restaurantBookingId.slice(0, 8)}` : `#R-${p.id.slice(0, 8)}`) : `#P-${p.id.slice(0, 8)}`}
                        </span>
                        <span className="text-[9px] text-muted-foreground uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                          {p.isReport ? "Hotel Report" : `ORG: ${p.organizationId.slice(0, 8)}`}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-bold text-foreground/80 truncate block max-w-[180px]">{getHotelName(p.hotelId)}</span>
                    <span className="text-[9px] font-medium text-muted-foreground tabular-nums uppercase">ID: {p.hotelId.slice(0, 4)}...{p.hotelId.slice(-4)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-baseline gap-1">
                      <span className={cn("text-[13px] font-black", p.type === "incoming" ? "text-foreground" : "text-rose-600")}>
                        {p.type === "incoming" ? "+" : "-"}{p.amount.toLocaleString()}
                      </span>
                      <span className="text-[9px] font-black text-muted-foreground uppercase">USD</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge settled={p.settled} status={p.status} />
                  </td>
                  <td className="px-4 py-3 text-[10px] font-medium text-muted-foreground tabular-nums">
                    {new Date(p.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button variant="ghost" size="icon" className="size-7 border border-border/20 group-hover:border-border/50 shadow-none">
                        <Eye className="size-3.5 text-muted-foreground" />
                      </Button>
                      {!p.settled && p.status !== 'rejected' && (
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-7 border-emerald-500/20 bg-emerald-50/20 text-emerald-600 hover:bg-emerald-50/50 shadow-none transition-all"
                            onClick={() => handleMarkAsSettled(p)}
                            disabled={updatePayment.isPending || updateHotelPayment.isPending}
                          >
                            <CheckCircle2 className="size-3.5" />
                          </Button>
                          
                          {p.isReport && p.status === "submitted" && (
                            <Button
                              variant="outline"
                              size="icon"
                              className="size-7 border-rose-500/20 bg-rose-50/20 text-rose-600 hover:bg-rose-50/50 shadow-none transition-all"
                              onClick={() => handleRejectReport(p.id)}
                              disabled={updateHotelPayment.isPending}
                            >
                              <XCircle className="size-3.5" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compact Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-2 pt-1 border-t border-border/20">
          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tight">
            Displaying <span className="text-foreground">{(meta.currentPage - 1) * meta.limit + 1}-{Math.min(meta.currentPage * meta.limit, meta.totalCount)}</span> of <span className="text-foreground">{meta.totalCount}</span>
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage <= 1}
              className="size-6 border border-border/20 shadow-none"
            >
              <ChevronLeft className="size-3" />
            </Button>
            <span className="text-[11px] font-black w-6 text-center tabular-nums">{currentPage}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.min(meta.totalPages, prev + 1))}
              disabled={currentPage >= meta.totalPages}
              className="size-6 border border-border/20 shadow-none"
            >
              <ChevronRight className="size-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
