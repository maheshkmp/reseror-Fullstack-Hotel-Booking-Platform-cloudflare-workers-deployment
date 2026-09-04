"use client";

import { DataTable } from "@/components/table/data-table";
import DataTableError from "@/components/table/data-table-error";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { useGetRoomBookings } from "../api/use-get-adminPayment";
import { columns } from "./adminPayment-table/columns";
import { useRoomBookingsTableFilters } from "./adminPayment-table/use-adminPayment-table-filters";

export default function RoomBookingsListing() {
  const { page, limit, searchQuery } = useRoomBookingsTableFilters();

  const { data, error, isPending } = useGetRoomBookings({
    limit,
    page,
    search: searchQuery,
  });

  if (isPending) {
    return <DataTableSkeleton columnCount={columns.length} rowCount={4} />;
  }

  if (!data || error) {
    return <DataTableError error={error} />;
  }

  return (
    <DataTable
      columns={columns}
      data={data.data as any}
      totalItems={data.data.length}
    />
  );
}
