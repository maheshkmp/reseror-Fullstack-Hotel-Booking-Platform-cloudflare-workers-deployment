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

import { CreateRoomBooking } from "@/features/admin/booking-management/components/create-booking/create-room-booking";
import RoomBookingsListing from "@/features/admin/booking-management/components/roomBookings-listing";
import { RoomBookingsTableActions } from "@/features/admin/booking-management/components/roomBookings-table/roomBookings-table-actions";
import { RoomBookingsStats } from "@/features/admin/booking-management/components/roomBookings-table/room-bookings-stats";
import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";

export default function RoomBookingManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col gap-3 h-full overflow-hidden">
        <AppPageShell
          title="Room Bookings"
          description={`Comprehensive platform booking management`}
          actionComponent={
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2 bg-primary text-primary-foreground font-bold uppercase tracking-tight text-[11px] h-8 shadow-none">
                  <Plus className="w-3.5 h-3.5" />
                  Create Booking
                </Button>
              </DialogTrigger>
              <DialogContent className="!w-[90vw] !max-w-none max-h-[95vh] overflow-y-auto border-border bg-background shadow-none">
                <DialogHeader className="border-b border-border/50 pb-4 mb-4">
                  <DialogTitle className="text-xl font-bold tracking-tight">New Room Booking</DialogTitle>
                </DialogHeader>
                <CreateRoomBooking onSuccess={() => setIsDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          }
        />

        <div className="flex-none">
          <RoomBookingsStats />
        </div>

        <div className="flex flex-1 flex-col gap-3 min-h-0 overflow-hidden">
          <div className="bg-secondary/20 p-2 rounded-md border border-border/40">
            <RoomBookingsTableActions />
          </div>

          <div className="flex-1 min-h-0 overflow-hidden bg-background border border-border/40 rounded-md">
            <RoomBookingsListing />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
