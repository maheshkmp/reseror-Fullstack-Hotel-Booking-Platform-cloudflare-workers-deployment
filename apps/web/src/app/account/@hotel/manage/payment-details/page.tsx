"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";

import { CreateHotelPayment } from "@/features/hotel-payments/components/create-hotelPayment/create-hotelPayment";
import UserReceivedPaymentListing from "@/features/userPayment-management/components/userReceivedPayment-listing";
import { PaymentSummaryCards } from "@/features/userPayment-management/components/payment-summary-cards";
import PageContainer from "@/modules/layouts/page-container";
import { useUserHotelId } from "@/features/userPayment-management/api/use-user-hotel-id";

export default function RoomBookingManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { hotelId } = useUserHotelId();

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col space-y-1 max-w-[1600px] mx-auto w-full px-4 md:px-6 py-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Payments & Payouts
            </h1>
            <p className="text-slate-500 font-medium max-w-xl text-sm leading-relaxed">
              Track your hotel's payouts, commissions, and transaction history with a simplified ledger view.
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-10 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm shadow-sm transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Record
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col border-slate-200 shadow-2xl rounded-2xl p-0 overflow-hidden">
              <div className="bg-slate-50/80 px-8 py-4 border-b border-slate-100 flex-shrink-0">
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold text-slate-800">
                    Create Transaction Record
                  </DialogTitle>
                </DialogHeader>
              </div>
              <div className="p-6 overflow-y-auto">
                <CreateHotelPayment 
                  hotelId={hotelId || ""} 
                  onSuccess={() => setIsDialogOpen(false)} 
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Section */}
        <PaymentSummaryCards />

        {/* List Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Financial History
            </h2>
          </div>
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-none overflow-hidden min-h-[450px]">
            <UserReceivedPaymentListing />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
