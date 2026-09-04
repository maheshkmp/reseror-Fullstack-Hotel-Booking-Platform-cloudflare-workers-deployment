"use client";

import UserBookingListing from "@/features/user/user-booking/user-listing";
import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";
import { Dialog } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function RoomBookingManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Manage Booking Details"
          description={`Manage hotel booking details`}
          actionComponent={
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}></Dialog>
          }
        />

        <Separator />
        <UserBookingListing />
      </div>
    </PageContainer>
  );
}
