"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { StarIcon, MapPinIcon, UtensilsIcon } from "lucide-react";
import type { Restaurant } from "core/zod";

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200";
    case "inactive":
      return "bg-gray-200 text-gray-600 border-gray-300";
    case "under_maintenance":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "pending_approval":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const getStatusEmoji = (status: string) => {
  switch (status) {
    case "active": return "🟢";
    case "inactive": return "🔴";
    case "under_maintenance": return "🟡";
    case "pending_approval": return "🔵";
    default: return "🔘";
  }
};

export const columns: ColumnDef<Restaurant>[] = [
  {
    accessorKey: "name",
    header: "Restaurant",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
          <UtensilsIcon className="w-4 h-4" />
        </div>
        <div>
          <div className="font-bold text-gray-900">{row.getValue("name")}</div>
          <div className="text-[10px] text-gray-500 font-medium">#{row.original.id.slice(0, 8)}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "brandName",
    header: "Brand",
    cell: ({ row }) => (
      <div className="text-sm font-medium text-gray-600">
        {row.getValue("brandName") || "—"}
      </div>
    ),
  },
  {
    accessorKey: "city",
    header: "Location",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-sm text-gray-600">
        <MapPinIcon className="w-3.5 h-3.5 text-gray-400" />
        {row.getValue("city")}, {row.original.state || "—"}
      </div>
    ),
  },
  {
    accessorKey: "starRating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.getValue("starRating") as number | null;
      return (
        <div className="flex items-center gap-1">
          <StarIcon className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="text-sm font-bold text-gray-900">{rating || "—"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant="outline" className={`${getStatusColor(status)} text-[10px] py-0 px-2 font-black uppercase tracking-wider`}>
          {getStatusEmoji(status)} {status.replace("_", " ")}
        </Badge>
      );
    },
  },
];
