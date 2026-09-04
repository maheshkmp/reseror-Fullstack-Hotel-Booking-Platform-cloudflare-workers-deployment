"use client";

import { useMemo } from "react";
import { DataTableResetFilter } from "@/components/table/data-table-reset-filter";
import { DataTableSearch } from "@/components/table/data-table-search";
import { useRoomBookingsTableFilters } from "./use-roomBookings-table-filters";
import { NativeSelect } from "@/components/ui/native-select";
import { Input } from "@/components/ui/input";
import { Filter, X, Calendar, DollarSign, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function RoomBookingsTableActions() {
  const {
    searchQuery,
    setSearchQuery,
    setPage,
    status,
    setStatus,
    paymentStatus,
    setPaymentStatus,
    paymentMethod,
    setPaymentMethod,
    from,
    setFrom,
    to,
    setTo,
    minAmount,
    setMinAmount,
    maxAmount,
    setMaxAmount,
    resetFilters,
    isAnyFilterActive
  } = useRoomBookingsTableFilters();

  // Calculate advanced filters count
  const advancedFilterCount = useMemo(() => {
    let count = 0;
    if (from || to) count++;
    if (minAmount || maxAmount) count++;
    if (paymentMethod) count++;
    return count;
  }, [from, to, minAmount, maxAmount, paymentMethod]);

  const hasDateFilter = !!(from || to);
  const hasAmountFilter = !!(minAmount || maxAmount);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-background/50 p-1 rounded-lg border border-border/40">
        <div className="flex-1 min-w-[200px]">
          <DataTableSearch
            searchKey="guest name"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setPage={setPage}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <NativeSelect
            value={status || ""}
            onChange={(e) => {
              setStatus(e.target.value || null);
              setPage(1);
            }}
            options={[
              { label: "All Statuses", value: "" },
              { label: "Pending", value: "pending" },
              { label: "Confirmed", value: "confirmed" },
              { label: "Cancelled", value: "cancelled" },
              { label: "Checked In", value: "checked_in" },
              { label: "Checked Out", value: "checked_out" },
              { label: "No Show", value: "no_show" },
            ]}
            className="w-[140px] h-9 text-xs"
          />

          <NativeSelect
            value={paymentStatus || ""}
            onChange={(e) => {
              setPaymentStatus(e.target.value || null);
              setPage(1);
            }}
            options={[
              { label: "All Payments", value: "" },
              { label: "Paid", value: "true" },
              { label: "Pending", value: "false" },
            ]}
            className="w-[140px] h-9 text-xs"
          />

          {/* Omitted Hotel Combo Select for User Portal per user request */}

          <DataTableResetFilter
            isFilterActive={isAnyFilterActive}
            onReset={resetFilters}
          />

          <Separator orientation="vertical" className="h-4 mx-1 hidden sm:block" />

          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant={advancedFilterCount > 0 ? "secondary" : "outline"} 
                size="sm" 
                className="h-9 gap-2 px-3 relative"
              >
                <Filter className="w-4 h-4" />
                <span className="text-xs font-medium">More Filters</span>
                {advancedFilterCount > 0 && (
                  <Badge 
                    variant="default" 
                    className="h-4.5 min-w-[18px] px-1 text-[10px] rounded-full flex items-center justify-center bg-primary text-primary-foreground absolute -top-1.5 -right-1.5 border-2 border-background"
                  >
                    {advancedFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-[380px]">
              <SheetHeader className="pb-4">
                <SheetTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Advanced Filters
                </SheetTitle>
                <SheetDescription>
                  Refine your search with specific criteria.
                </SheetDescription>
              </SheetHeader>
              
              <div className="flex flex-col gap-8 mt-4 overflow-y-auto max-h-[calc(100vh-180px)] pr-2">
                {/* Date Filter Section */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      Date Range
                    </div>
                    {hasDateFilter && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => { setFrom(null); setTo(null); }}
                        className="h-6 text-[10px] gap-1 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                        Clear
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium text-muted-foreground">From</label>
                      <Input
                        type="date"
                        value={from || ""}
                        onChange={(e) => {
                          setFrom(e.target.value || null);
                          setPage(1);
                        }}
                        className="h-8 text-xs bg-background"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium text-muted-foreground">To</label>
                      <Input
                        type="date"
                        value={to || ""}
                        onChange={(e) => {
                          setTo(e.target.value || null);
                          setPage(1);
                        }}
                        className="h-8 text-xs bg-background"
                      />
                    </div>
                  </div>
                </div>

                {/* Amount Filter Section */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <DollarSign className="w-3.5 h-3.5" />
                      Amount Range (USD)
                    </div>
                    {hasAmountFilter && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => { setMinAmount(null); setMaxAmount(null); }}
                        className="h-6 text-[10px] gap-1 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                        Clear
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium text-muted-foreground">Minimum</label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={minAmount || ""}
                          onChange={(e) => {
                            setMinAmount(e.target.value || null);
                            setPage(1);
                          }}
                          className="h-8 text-xs bg-background pl-6"
                        />
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">$</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-medium text-muted-foreground">Maximum</label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="Any"
                          value={maxAmount || ""}
                          onChange={(e) => {
                            setMaxAmount(e.target.value || null);
                            setPage(1);
                          }}
                          className="h-8 text-xs bg-background pl-6"
                        />
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">$</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Method Filter Section */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <CreditCard className="w-3.5 h-3.5" />
                      Payment Method
                    </div>
                    {paymentMethod && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => { setPaymentMethod(null); }}
                        className="h-6 text-[10px] gap-1 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                        Clear
                      </Button>
                    )}
                  </div>
                  <NativeSelect
                    value={paymentMethod || ""}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value || null);
                      setPage(1);
                    }}
                    options={[
                      { label: "Any Payment Method", value: "" },
                      { label: "Online (Credit/Debit Card)", value: "online" },
                      { label: "Pay at Hotel (Cash)", value: "cash" },
                    ]}
                    className="w-full h-9 text-xs bg-muted/30"
                  />
                </div>
              </div>

              {/* Reset Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t">
                {isAnyFilterActive ? (
                  <Button 
                    variant="outline" 
                    className="w-full h-10 text-xs font-medium border-dashed hover:border-destructive hover:text-destructive transition-colors"
                    onClick={resetFilters}
                  >
                    Clear All Filters
                  </Button>
                ) : (
                  <Button disabled variant="outline" className="w-full h-10 text-xs opacity-50">
                    No Filters Applied
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
