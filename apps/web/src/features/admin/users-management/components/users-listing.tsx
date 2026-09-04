"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { columns } from "./users-table/columns";
import { DataTable } from "@/components/table/data-table";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { useUsersTableFilters } from "./users-table/use-users-table-filters";
import DataTableError from "@/components/table/data-table-error";
import { useGetUsers } from "../api/use-get-users";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, ShieldCheck, Hotel, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { value: "all", label: "All Users", icon: Users },
  { value: "admin", label: "Administrators", icon: ShieldCheck },
  { value: "hotelOwner", label: "Partners", icon: Hotel },
  { value: "customer", label: "Customers", icon: User },
];

export default function UsersListing() {
  const { page, limit, searchQuery, tab, setTab } = useUsersTableFilters();

  const { data, error, isPending } = useGetUsers({
    limit,
    page,
    search: searchQuery,
    tab,
  });

  return (
    <div className="flex flex-1 flex-col gap-6 min-h-0 overflow-hidden pt-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Tabs value={tab} onValueChange={(t) => setTab(t)} className="w-full sm:w-auto">
          <TabsList className="flex h-12 items-center justify-start rounded-none border-b border-border bg-transparent p-0 text-muted-foreground w-full">
            {TABS.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className={cn(
                  "inline-flex items-center justify-center whitespace-nowrap px-4 py-3 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                  "data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none rounded-none bg-transparent"
                )}
              >
                <t.icon className="size-4 mr-2" />
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
           <div className="px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/40 flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Total:</span>
              <span className="text-xs font-bold tabular-nums text-foreground">{data?.total || 0}</span>
           </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative">
        <AnimatePresence mode="wait">
          {isPending ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-0"
            >
              <DataTableSkeleton columnCount={columns.length} rowCount={10} />
            </motion.div>
          ) : !data || error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <DataTableError error={error as any} />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full bg-background border border-border/40 rounded-2xl overflow-hidden shadow-sm shadow-black/5"
            >
              <DataTable
                columns={columns}
                data={data?.users || []}
                totalItems={data?.total || 0}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

