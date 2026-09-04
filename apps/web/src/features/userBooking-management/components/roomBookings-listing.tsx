"use client";

import { useState } from "react";
import { DataTable } from "@/components/table/data-table";
import DataTableError from "@/components/table/data-table-error";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { useGetRoomBookingsByUser } from "../api/get-room-bookings-by-user-id";
import { useGetRoomBookings } from "../api/use-get-roomBookings";
import { useUpdateRoomBookingById } from "../api/use-update-roomBokking-by-id";
import { columns } from "./roomBookings-table/columns";
import { useRoomBookingsTableFilters } from "./roomBookings-table/use-roomBookings-table-filters";
import { BulkActionToolbar } from "./roomBookings-table/bulk-action-toolbar";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function RoomBookingsListing({ 
  hotelId: propHotelId,
  mode = "user"
}: { 
  hotelId?: string;
  mode?: "user" | "hotel";
}) {
  // 1. Extract session loading state to differentiate between "loading" and "unauthenticated"
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const userId = session?.user?.id;

  const { 
    page, 
    limit, 
    searchQuery,
    status,
    paymentStatus,
    paymentMethod,
    from,
    to,
    minAmount,
    maxAmount
  } = useRoomBookingsTableFilters();

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [isBulkPending, setIsBulkPending] = useState(false);

  const updateMutation = useUpdateRoomBookingById();

  // 3. Select query based on context:
  // If mode is "hotel", we are in "Management" mode (Owner dashboard).
  // Otherwise, we are in "user" mode (My Bookings page).
  
  const userBookingsQuery = useGetRoomBookingsByUser(userId, {
    limit,
    page,
    guestName: searchQuery || undefined,
    status: status || undefined,
    isPaid: paymentStatus as any,
    paymentType: paymentMethod as any,
    checkInDateFrom: from,
    checkInDateTo: to,
    minAmount,
    maxAmount
  });

  const hotelBookingsQuery = useGetRoomBookings({
    limit,
    page,
    hotelId: propHotelId,
    guestName: searchQuery || undefined,
    status: status || undefined,
    isPaid: paymentStatus as any,
    paymentType: paymentMethod as any,
    checkInDateFrom: from,
    checkInDateTo: to,
    minAmount,
    maxAmount
  }, { enabled: !!userId && !isSessionPending });

  const { data: userData, error: userError, isPending: isUserPending } = userBookingsQuery;
  const { data: hotelData, error: hotelError, isPending: isHotelPending } = hotelBookingsQuery;

  const isHotelMode = mode === "hotel";
  const data = isHotelMode ? hotelData : userData;
  const error = isHotelMode ? hotelError : userError;
  const isDataPending = isHotelMode ? isHotelPending : isUserPending;

  const selectedRows = Object.keys(rowSelection).filter(key => rowSelection[key]);

  const handleBulkUpdateStatus = async (newStatus: string) => {
    setIsBulkPending(true);
    
    // 2 & 3. Run updates concurrently and capture individual successes/failures
    const updatePromises = selectedRows.map(async (id) => {
      try {
        await updateMutation.mutateAsync({ id, data: { status: newStatus as any } });
        return { id, success: true };
      } catch {
        return { id, success: false };
      }
    });

    const results = await Promise.all(updatePromises);
    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    // Provide accurate UI feedback
    if (successful.length > 0) {
      toast.success(`Successfully updated ${successful.length} bookings to ${newStatus}`);
    }

    if (failed.length > 0) {
      toast.error(`Failed to update ${failed.length} booking(s)`);
      
      // Smart UI UX: Retain the failed items in the selection so the user can try again
      const newSelection: Record<string, boolean> = {};
      failed.forEach(({ id }) => {
        newSelection[id] = true;
      });
      setRowSelection(newSelection);
    } else {
      // Only clear selection completely if everything was successful
      setRowSelection({});
    }
    
    setIsBulkPending(false);
  };

  // 1. Properly evaluate loading states
  if (isSessionPending) {
    return <DataTableSkeleton columnCount={columns.length} rowCount={4} />;
  }

  // Prevent infinite skeleton if the user isn't logged in
  if (!userId) {
    return <DataTableError error={new Error("User not authenticated.")} />;
  }

  if (isDataPending) {
    return <DataTableSkeleton columnCount={columns.length} rowCount={4} />;
  }

  if (!data || error) {
    return <DataTableError error={error} />;
  }

  return (
    <>
   
      <DataTable
        columns={columns}
        data={data.data as any}
        totalItems={data.meta?.totalCount || data.data.length}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        getRowId={(row: any) => row.id}
      />
      
      {/* 4. Conditionally render the toolbar only when items are actually selected */}
      {selectedRows.length > 0 && (
        <BulkActionToolbar
          selectedRowIds={selectedRows}
          onClearSelection={() => setRowSelection({})}
          onBulkUpdateStatus={handleBulkUpdateStatus}
          isPending={isBulkPending}
        />
      )}
    </>
  );
}