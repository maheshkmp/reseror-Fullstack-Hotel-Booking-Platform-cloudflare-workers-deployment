"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useState } from "react";

import AdminReceivedPaymentListing from "@/features/admin/adminPayment-management/components/adminReceivedPayment-listing";
import { CreateAdminPayment } from "@/features/admin/booking-management/components/admin-payments/components/create-adminPayment/create-adminPayment";
import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";

export default function AdminPaymentManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col gap-3 h-full overflow-hidden">
        <AppPageShell
          title="Admin Payments"
          description="Manage platform transactions and payout records"
          actionComponent={
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2 bg-primary text-primary-foreground font-bold uppercase tracking-tight text-[11px] h-8 shadow-none">
                  <Plus className="w-3.5 h-3.5" />
                  Create Record
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-border bg-background shadow-none">
                <DialogHeader className="border-b border-border/50 pb-4 mb-4">
                  <DialogTitle className="text-xl font-bold tracking-tight">Create Payment Record</DialogTitle>
                </DialogHeader>
                <CreateAdminPayment onSuccess={() => setIsDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          }
        />

        <div className="flex flex-1 flex-col gap-3 min-h-0 overflow-hidden">
          <div className="flex-1 min-h-0 overflow-hidden bg-background border border-border/40 rounded-md">
            <AdminReceivedPaymentListing />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
