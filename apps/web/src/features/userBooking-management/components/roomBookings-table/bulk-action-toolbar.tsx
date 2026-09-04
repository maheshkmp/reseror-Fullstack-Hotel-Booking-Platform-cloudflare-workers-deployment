"use client";

import { Button } from "@/components/ui/button";
import { Ban, CheckCircle } from "lucide-react";

interface BulkActionToolbarProps {
  selectedRowIds: string[];
  onClearSelection: () => void;
  onBulkUpdateStatus: (status: string) => void;
  isPending?: boolean;
}

export function BulkActionToolbar({
  selectedRowIds,
  onClearSelection,
  onBulkUpdateStatus,
  isPending
}: BulkActionToolbarProps) {
  if (selectedRowIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-full border border-border/50 bg-background/80 backdrop-blur-md px-4 py-3 shadow-xl">
      <div className="flex items-center gap-2 pr-3 border-r border-border/50">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
          {selectedRowIds.length}
        </span>
        <span className="text-xs font-medium text-foreground tracking-tight">
          Selected
        </span>
      </div>
      
      <div className="flex items-center gap-1.5">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 text-xs bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-200"
          onClick={() => onBulkUpdateStatus("confirmed")}
          disabled={isPending}
        >
          <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
          Confirm
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 text-xs bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-200"
          onClick={() => onBulkUpdateStatus("cancelled")}
          disabled={isPending}
        >
          <Ban className="mr-1.5 h-3.5 w-3.5" />
          Cancel
        </Button>
      </div>

      <div className="pl-3 border-l border-border/50">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-xs text-muted-foreground hover:text-foreground"
          onClick={onClearSelection}
          disabled={isPending}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
