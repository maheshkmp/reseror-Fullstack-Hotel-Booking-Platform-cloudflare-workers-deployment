"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PropertyClass } from "@/features/hotels/schemas/property-classes.schema";
import { CellAction } from "./cell-action";
import React from 'react';

export const columns: ColumnDef<PropertyClass>[] = [
  {
    accessorKey: "name",
    header: "Classification",
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5 max-w-[200px]">
        <div className="size-7 rounded bg-secondary flex items-center justify-center text-[10px] font-black text-muted-foreground border border-border/50 shrink-0 uppercase tracking-tighter">
          {row.original.name.slice(0, 2)}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-bold text-foreground truncate">{row.original.name}</span>
          <span className="text-[9px] text-muted-foreground truncate uppercase tracking-tighter tabular-nums opacity-60">ID: {row.original.id.toString().slice(0, 8)}</span>
        </div>
      </div>
    )
  },
  {
    accessorKey: "createdAt",
    header: "Established",
    cell: ({ row }) => (
      <span className="text-[10px] text-muted-foreground font-medium tabular-nums uppercase">
        {new Date(row.original.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
      </span>
    )
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction />,
  },
];
