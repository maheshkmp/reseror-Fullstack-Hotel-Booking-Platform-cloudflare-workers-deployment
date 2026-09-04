"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HotelStatusFilterProps {
  value: string | null;
  onValueChange: (value: string | null) => void;
  className?: string;
}

export function HotelStatusFilter({
  value,
  onValueChange,
  className,
}: HotelStatusFilterProps) {
  return (
    <Select
      value={value || "all"}
      onValueChange={(v) => onValueChange(v === "all" ? null : v)}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Statuses</SelectItem>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="pending_approval">Pending Approval</SelectItem>
        <SelectItem value="inactive">Inactive</SelectItem>
        <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
      </SelectContent>
    </Select>
  );
}
