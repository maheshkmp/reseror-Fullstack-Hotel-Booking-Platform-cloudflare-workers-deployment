"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";
import { CreateHotelPayment } from "@/features/hotel-payments/components/create-hotelPayment/create-hotelPayment";
import RoomBookingsListing from "@/features/userBooking-management/components/roomBookings-listing";
import { RoomBookingsTableActions } from "@/features/userBooking-management/components/roomBookings-table/roomBookings-table-actions";
import { RoomBookingsStats } from "@/features/userBooking-management/components/roomBookings-table/room-bookings-stats";
import { useGetMyHotel } from "@/features/hotels/api/use-get-my-hotel";
import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";

export default function RoomBookingManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const { data: myHotel } = useGetMyHotel({ enabled: !!session && !isSessionPending });

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col space-y-4 min-w-0 overflow-hidden w-full">
        <AppPageShell
          title="Manage Booking Details"
          description={`Manage hotel booking details`}
          actionComponent={
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
      
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Payment Record</DialogTitle>
                </DialogHeader>
                <CreateHotelPayment onSuccess={() => setIsDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          }
        />

        <Separator />
        
        <RoomBookingsStats hotelId={myHotel?.id} mode="hotel" />
        
        <RoomBookingsTableActions />

        <RoomBookingsListing hotelId={myHotel?.id} mode="hotel" />
      </div>
    </PageContainer>
  );
}
