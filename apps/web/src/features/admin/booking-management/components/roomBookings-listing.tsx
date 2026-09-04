"use client";

import { useState } from "react";
import { DataTable } from "@/components/table/data-table";
import DataTableError from "@/components/table/data-table-error";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { useGetAllRoomBookings } from "../api/use-get-roomBookings";
import { useUpdateRoomBooking } from "../api/use-update-roomBooking";
import { useDeleteRoomBooking } from "../api/use-delete-roomBooking";
import { columns } from "./roomBookings-table/columns";
import { useRoomBookingsTableFilters } from "./roomBookings-table/use-roomBookings-table-filters";
import { BulkActionToolbar } from "./roomBookings-table/bulk-action-toolbar";
import { toast } from "sonner";

export default function RoomBookingsListing() {
  const { 
    page, 
    limit, 
    searchQuery,
    hotelId,
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

  const updateMutation = useUpdateRoomBooking();
  const deleteMutation = useDeleteRoomBooking();

  const { data, error, isPending } = useGetAllRoomBookings({
    limit,
    page,
    search: searchQuery,
    hotelId,
    status,
    isPaid: paymentStatus,
    paymentType: paymentMethod as any,
    checkInDateFrom: from,
    checkInDateTo: to,
    minAmount,
    maxAmount
  });

  const selectedRows = Object.keys(rowSelection).filter(key => rowSelection[key]);

  const handleBulkUpdateStatus = async (newStatus: string) => {
    setIsBulkPending(true);
    let successCount = 0;
    try {
      for (const id of selectedRows) {
        await updateMutation.mutateAsync({ id, status: newStatus as any });
        successCount++;
      }
      toast.success(`Successfully updated ${successCount} bookings to ${newStatus}`);
    } catch {
      toast.error(`Failed to update some bookings`);
    } finally {
      setIsBulkPending(false);
      setRowSelection({});
    }
  };

  const handleBulkDelete = async () => {
    setIsBulkPending(true);
    let successCount = 0;
    try {
      for (const id of selectedRows) {
        await deleteMutation.mutateAsync({ id });
        successCount++;
      }
      toast.success(`Successfully deleted ${successCount} bookings`);
    } catch {
      toast.error(`Failed to delete some bookings`);
    } finally {
      setIsBulkPending(false);
      setRowSelection({});
    }
  };

  if (isPending) {
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
      
      <BulkActionToolbar
        selectedRowIds={selectedRows}
        onClearSelection={() => setRowSelection({})}
        onBulkUpdateStatus={handleBulkUpdateStatus}
        onBulkDelete={handleBulkDelete}
      />
    </>
  );
}
