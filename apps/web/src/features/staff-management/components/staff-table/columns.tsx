"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, XCircle, User as UserIcon, ShieldCheck, ShieldAlert, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CellAction } from "./cell-action";
import { cn } from "@/lib/utils";
import React from 'react';
import { format } from "date-fns";
import { Staff } from "../../schemas";

const RoleIcon = ({ role }: { role: string }) => {
  switch (role) {
    case "admin": return <ShieldCheck className="size-3 text-amber-500" />;
    case "moderator": return <ShieldAlert className="size-3 text-blue-500" />;
    case "support": return <Shield className="size-3 text-emerald-500" />;
    default: return <Shield className="size-3 text-muted-foreground" />;
  }
};

export const columns: ColumnDef<Staff>[] = [
  {
    accessorKey: "name",
    header: "Staff Member",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="relative">
          {row.original.image ? (
            <img
              alt={row.original.name}
              src={row.original.image}
              className="size-9 rounded-xl bg-secondary object-cover border border-border/50"
            />
          ) : (
            <div className="size-9 rounded-xl bg-gradient-to-br from-secondary/50 to-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground border border-border/50">
              <UserIcon className="size-4 opacity-40" />
            </div>
          )}
          {!row.original.banned && (
             <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-emerald-500 border-2 border-background rounded-full" />
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-foreground tracking-tight">{row.original.name}</span>
          <span className="text-[10px] text-muted-foreground truncate">{row.original.email}</span>
        </div>
      </div>
    )
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role || "staff";
      return (
        <Badge 
          variant="outline" 
          className={cn(
            "h-6 px-2 gap-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border-border/50 bg-secondary/30",
            role === "admin" && "text-amber-600 bg-amber-500/5 border-amber-500/20"
          )}
        >
          <RoleIcon role={role} />
          {role}
        </Badge>
      );
    }
  },
  {
    accessorKey: "createdAt",
    header: "Joined Date",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-xs font-medium text-foreground/80 tabular-nums">
          {format(new Date(row.original.createdAt), "MMM d, yyyy")}
        </span>
      </div>
    )
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
