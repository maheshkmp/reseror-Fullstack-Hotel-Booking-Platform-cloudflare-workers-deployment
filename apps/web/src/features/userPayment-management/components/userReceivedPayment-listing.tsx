"use client";

import { 
  MoreHorizontal, 
  Search,
  RefreshCcw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  ExternalLink,
  Eye,
  CreditCard
} from "lucide-react";
import { useState } from "react";
import { useGetUserPayments, useUpdateUserPayment, UserPayment } from "../api";
import { useUserHotelId } from "../api/use-user-hotel-id";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function UserReceivedPaymentListing() {
  const { hotelId } = useUserHotelId();
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<string>("");
  const [paidStatus, setPaidStatus] = useState<string>("");
  const [sort, setSort] = useState<"desc" | "asc">("desc");

  // Proof Submission State
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [proofUrl, setProofUrl] = useState("");
  const [bankName, setBankName] = useState("");
  const [refId, setRefId] = useState("");
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  const updateUserPayment = useUpdateUserPayment();

  const { data, isPending, error, refetch } = useGetUserPayments({
    page,
    limit: 10,
    search: search || undefined,
    type: type || undefined,
    paid: paidStatus === "paid" ? true : paidStatus === "pending" ? false : null,
    sort,
    hotelId: hotelId || undefined
  });

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusConfig = (paid: boolean | null, dueDate: string | null, status?: string) => {
    // If we have the new status field, use it
    if (status === "submitted") return { label: "Reviewing", dot: "bg-blue-500", text: "text-blue-700" };
    if (status === "rejected") return { label: "Rejected", dot: "bg-red-500", text: "text-red-700" };
    
    const isOverdue = !paid && dueDate && new Date(dueDate) < new Date();
    
    if (paid || status === "confirmed") return { label: "Paid", dot: "bg-emerald-500", text: "text-emerald-700" };
    if (isOverdue) return { label: "Overdue", dot: "bg-rose-500", text: "text-rose-700" };
    return { label: "Pending", dot: "bg-amber-500", text: "text-amber-700" };
  };

  const handleSubmitProof = async () => {
    if (!selectedPayment) return;
    try {
      await updateUserPayment.mutateAsync({
        id: selectedPayment.id,
        data: {
          proof: proofUrl,
          bankName,
          referenceId: refId,
          status: "submitted"
        }
      });
      toast.success("Proof of payment submitted for review");
      setIsSubmitOpen(false);
      setSelectedPayment(null);
      setProofUrl("");
      setRefId("");
      setBankName("");
    } catch (err) {
      toast.error("Failed to submit proof");
    }
  };

  const formatType = (type: string) => {
    if (type === "receive_commission_from_cash") return "Commission";
    if (type === "repay_net_from_online") return "Payout";
    if (type === "restaurant_booking_commission") return "Restaurant Fee";
    return type;
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <AlertCircle className="w-8 h-8 text-rose-600 mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-2">Error loading payments</h3>
        <p className="text-slate-500 text-sm mb-6 max-w-xs leading-relaxed">
          The financial service is currently unavailable.
        </p>
        <Button onClick={() => refetch()} variant="outline" size="sm" className="rounded-xl border-slate-200">
          <RefreshCcw className="w-3.5 h-3.5 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  const payments = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="flex flex-1 flex-col w-full h-full p-4 md:p-6 space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
        <div className="relative w-full lg:max-w-xs group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors w-4 h-4" />
          <Input
            placeholder="Search id or ref..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl border-slate-200 focus-visible:ring-indigo-500 bg-white shadow-none text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full lg:w-auto items-center">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="h-10 w-[140px] rounded-xl border-slate-200 bg-white shadow-none text-[13px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="receive_commission_from_cash">Commission</SelectItem>
              <SelectItem value="repay_net_from_online">Payout</SelectItem>
            </SelectContent>
          </Select>

          <Select value={paidStatus} onValueChange={setPaidStatus}>
            <SelectTrigger className="h-10 w-[140px] rounded-xl border-slate-200 bg-white shadow-none text-[13px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200">
              <SelectItem value="all">Every Status</SelectItem>
              <SelectItem value="paid">Paid Only</SelectItem>
              <SelectItem value="pending">Pending Only</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setSearch("");
              setType("");
              setPaidStatus("");
            }}
            className="h-10 px-4 rounded-xl text-slate-500 hover:bg-slate-50 font-bold text-xs uppercase tracking-tight"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="relative border border-slate-200 rounded-xl bg-white overflow-hidden shadow-none">
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-200 ">
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-10 font-bold text-slate-500 uppercase tracking-wider text-[10px] px-4">Transaction</TableHead>
              <TableHead className="h-10 font-bold text-slate-500 uppercase tracking-wider text-[10px] px-4">Details</TableHead>
              <TableHead className="h-10 font-bold text-slate-500 uppercase tracking-wider text-[10px] px-4 text-center">Proof</TableHead>
              <TableHead className="h-10 font-bold text-slate-500 uppercase tracking-wider text-[10px] px-4">Amount</TableHead>
              <TableHead className="h-10 font-bold text-slate-500 uppercase tracking-wider text-[10px] px-4">Status</TableHead>
              <TableHead className="h-10 font-bold text-slate-500 uppercase tracking-wider text-[10px] px-4">Refer. Date</TableHead>
              <TableHead className="h-10 font-bold text-slate-500 uppercase tracking-wider text-[10px] px-4 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-b border-slate-50">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j} className="px-4 py-2.5">
                      <Skeleton className="h-4 w-full rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center text-slate-400 text-sm">
                  No records matching your search.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment: UserPayment) => {
                const status = getStatusConfig(payment.paid, payment.dueDate, payment.status);
                return (
                  <TableRow 
                    key={payment.id} 
                    className="hover:bg-slate-50/50 transition-colors border-b border-slate-100/60"
                  >
                    <TableCell className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 tracking-tight text-[13px] uppercase">
                          {payment.bookingId ? `#B-${payment.bookingId.slice(0, 8)}` : 
                           payment.restaurantBookingId ? `#RB-${payment.restaurantBookingId.slice(0, 8)}` : 
                           `#P-${payment.id.slice(0, 8)}`}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {payment.bookingId ? "Room Booking" : 
                           payment.restaurantBookingId ? "Restaurant Reservation" : 
                           "Manual Entry"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-slate-700">
                          {formatType(payment.type)}
                        </span>
                        {payment.referenceId && (
                           <span className="text-[10px] text-slate-400 font-mono">
                             Ref: {payment.referenceId}
                           </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      {payment.proof ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a 
                                href={payment.proof} 
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                              >
                                <FileCheck className="w-4 h-4" />
                              </a>
                            </TooltipTrigger>
                            <TooltipContent className="rounded-xl border-slate-200 text-[11px] font-bold">
                              View Submitted Evidence
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <span className="text-[10px] text-slate-300 font-bold uppercase">None</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 font-bold text-slate-900 text-[13px]">
                        {formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-1.5 ">
                         <div className={cn("w-2 h-2 rounded-full", status.dot)} />
                         <span className={cn("text-[13px] font-bold uppercase tracking-tight", status.text)}>
                            {status.label}
                         </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-slate-500 font-medium text-[13px]">
                      {formatDate(payment.dueDate)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-slate-100 text-slate-400 transition-all">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-xl p-1.5 border-slate-200">
                          <DropdownMenuLabel className="px-2 py-1.5 text-[11px] font-bold text-slate-500 uppercase">Management</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-slate-100" />
                          <DropdownMenuItem 
                            className="rounded-lg px-2 py-1.5 text-[13px] font-bold focus:bg-slate-50 cursor-pointer flex items-center justify-between"
                            onClick={() => {}}
                          >
                            Details
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                          </DropdownMenuItem>
                          
                          {!payment.paid && payment.status !== "submitted" && (
                            <DropdownMenuItem 
                              className="rounded-lg px-2 py-1.5 text-[13px] font-bold focus:bg-indigo-50 text-indigo-600 cursor-pointer flex items-center justify-between"
                              onClick={() => {
                                setSelectedPayment(payment);
                                setIsSubmitOpen(true);
                              }}
                            >
                              Submit Proof
                              <FileCheck className="w-3.5 h-3.5" />
                            </DropdownMenuItem>
                          )}

                          {payment.proof && (
                             <DropdownMenuItem 
                              className="rounded-lg px-2 py-1.5 text-[13px] font-bold focus:bg-slate-50 cursor-pointer flex items-center justify-between text-indigo-600"
                              asChild
                            >
                              <a href={payment.proof} target="_blank" rel="noreferrer">
                                Open Proof
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Container */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-1">
          <div className="text-[12px] font-bold text-slate-400 uppercase tracking-tight">
            Page {meta.currentPage} of {meta.totalPages}
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={meta.currentPage === 1}
              className="h-8 w-8 p-0 rounded-lg border-slate-200 text-slate-500"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={meta.currentPage === meta.totalPages}
              className="h-8 w-8 p-0 rounded-lg border-slate-200 text-slate-500"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Proof Submission Dialog */}
      <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">Submit Payment Report</DialogTitle>
            <DialogDescription className="text-[12px] font-medium text-slate-500">
              Provide evidence of your commission payout for verification by the admin.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="bank" className="text-[11px] font-black uppercase tracking-widest text-slate-400">Payment Method / Bank</Label>
              <Input 
                id="bank" 
                placeholder="e.g. Bank of Ceylon, HNB, Stripe" 
                value={bankName}
                onChange={e => setBankName(e.target.value)}
                className="rounded-xl h-10 border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ref" className="text-[11px] font-black uppercase tracking-widest text-slate-400">Reference ID / Slip No</Label>
              <Input 
                id="ref" 
                placeholder="TXN-123456789" 
                value={refId}
                onChange={e => setRefId(e.target.value)}
                className="rounded-xl h-10 border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="proof" className="text-[11px] font-black uppercase tracking-widest text-slate-400">Proof Image URL</Label>
              <Input 
                id="proof" 
                placeholder="https://imgur.com/your-slip.png" 
                value={proofUrl}
                onChange={e => setProofUrl(e.target.value)}
                className="rounded-xl h-10 border-slate-200"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsSubmitOpen(false)} className="rounded-xl font-bold">Cancel</Button>
            <Button 
              onClick={handleSubmitProof} 
              disabled={!proofUrl || !bankName || updateUserPayment.isPending}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold px-8 shadow-md shadow-indigo-200"
            >
              {updateUserPayment.isPending ? "Submitting..." : "Send to Admin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
