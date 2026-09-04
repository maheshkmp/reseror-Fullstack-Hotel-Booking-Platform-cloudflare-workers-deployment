"use client";

import { ColumnDef } from "@tanstack/react-table";
import { UserWithRole } from "better-auth/plugins";
import { CheckCircle2, XCircle, User as UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { CellAction } from "./cell-action";
import { cn } from "@/lib/utils";
import React from 'react';
import { format } from "date-fns";

export type User = UserWithRole;

const StatusIndicator = React.memo(({ banned, reason }: { banned: boolean; reason?: string | null }) => {
  const content = (
    <div className="flex items-center gap-2 group/status cursor-default">
      <div className={cn(
        "size-2 rounded-full transition-all duration-500", 
        banned ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse"
      )} />
      <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/70 group-hover/status:text-foreground transition-colors">
        {banned ? "Banned" : "Active"}
      </span>
    </div>
  );

  if (banned && reason) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent className="bg-background border-border text-[11px] font-medium shadow-xl">
            {reason}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return content;
});

StatusIndicator.displayName = "StatusIndicator";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Identity",
    cell: ({ row }) => (
      <div className="flex items-center gap-3 max-w-[220px]">
        <div className="relative group/avatar">
          {row.original.image ? (
            <img
              alt={row.original.name}
              src={row.original.image}
              className="size-8 rounded-lg bg-secondary object-cover border border-border/50 shadow-sm transition-transform group-hover/avatar:scale-105"
            />
          ) : (
            <div className="size-8 rounded-lg bg-gradient-to-br from-secondary to-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground border border-border/50 shadow-sm uppercase">
              <UserIcon className="size-3.5 opacity-40" />
            </div>
          )}
          {!row.original.banned && (
             <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-emerald-500 border-2 border-background rounded-full" />
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[12px] font-semibold text-foreground truncate tracking-tight">{row.original.name}</span>
          <span className="text-[9px] text-muted-foreground/60 truncate uppercase tracking-widest font-medium">ID: {row.original.id.slice(0, 8)}</span>
        </div>
      </div>
    )
  },
  {
    accessorKey: "email",
    header: "Communication",
    cell: ({ row }) => (
      <div className="flex flex-col min-w-0 max-w-[200px]">
        <span className="text-[12px] font-medium text-foreground/90 truncate">{row.original.email}</span>
        <div className="flex items-center gap-1.5 mt-0.5">
          {row.original.emailVerified ? (
            <div className="flex items-center gap-1 px-1 py-0.5 rounded-sm bg-emerald-500/5 text-emerald-600">
              <CheckCircle2 className="size-2.5" />
              <span className="text-[8px] font-black uppercase tracking-widest">Verified</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-1 py-0.5 rounded-sm bg-muted/30 text-muted-foreground/60">
              <XCircle className="size-2.5" />
              <span className="text-[8px] font-black uppercase tracking-widest">Pending</span>
            </div>
          )}
        </div>
      </div>
    )
  },
  {
    accessorKey: "role",
    header: "Permission",
    cell: ({ row }) => {
      const role = row.original.role;
      const isAdmin = role === "admin";
      
      return (
        <Badge 
          variant="outline" 
          className={cn(
            "h-5 px-2 text-[9px] font-black uppercase tracking-widest rounded-md border-border/50 transition-colors",
            isAdmin ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-secondary/40 text-foreground/70"
          )}
        >
          {role}
        </Badge>
      );
    }
  },
  {
    accessorKey: "banned",
    header: "Presence",
    cell: ({ row }) => <StatusIndicator banned={!!row.original.banned} reason={row.original.banReason} />
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-[11px] text-foreground/80 font-bold tabular-nums">
          {format(new Date(row.original.createdAt), "MMM d, yyyy")}
        </span>
        <span className="text-[9px] text-muted-foreground/50 font-medium tabular-nums uppercase">
          {format(new Date(row.original.createdAt), "HH:mm a")}
        </span>
      </div>
    )
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
];

