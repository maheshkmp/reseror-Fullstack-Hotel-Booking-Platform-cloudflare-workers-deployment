"use client";

import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle2, XCircle, ChevronUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface BulkActionsProps {
  selectedCount: number;
  onDelete: () => void;
  onStatusChange: (status: string) => void;
}

export function BulkActions({
  selectedCount,
  onDelete,
  onStatusChange,
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-3 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-in fade-in slide-in-from-bottom-8 duration-500 ring-1 ring-white/10">
      <div className="flex items-center gap-3 pr-4 border-r border-slate-700/50">
        <div className="size-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-indigo-500/20">
          {selectedCount}
        </div>
        <span className="text-sm font-bold text-slate-100 tracking-tight">
          Selected
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-4 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          onClick={onDelete}
        >
          <Trash2 className="size-3.5 mr-2 opacity-70" />
          Delete
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className="h-8 px-4 rounded-xl text-xs font-bold bg-white/10 text-white border-none hover:bg-white/20 transition-all gap-1.5"
            >
              Update Status
              <ChevronUp className="size-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" sideOffset={12} className="w-48 bg-slate-900 border-slate-800 text-slate-200 rounded-xl p-1 shadow-2xl">
            <DropdownMenuItem 
              className="rounded-lg focus:bg-white/10 focus:text-white"
              onClick={() => onStatusChange("active")}
            >
              <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
              <span>Mark as Active</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="rounded-lg focus:bg-white/10 focus:text-white"
              onClick={() => onStatusChange("inactive")}
            >
              <XCircle className="mr-2 h-4 w-4 text-slate-500" />
              <span>Mark as Inactive</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="rounded-lg focus:bg-white/10 focus:text-white"
              onClick={() => onStatusChange("under_maintenance")}
            >
              <XCircle className="mr-2 h-4 w-4 text-rose-500" />
              <span>Mark as Maintenance</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
