"use client";

import React, { useState } from "react";
import { Plus, Users, ShieldCheck, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import { useGetStaff } from "../api";
import { columns } from "./staff-table/columns";
import { StaffAddForm } from "./staff-forms";
import { motion, AnimatePresence } from "framer-motion";

export default function StaffListing() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isPending, error } = useGetStaff(page, limit);

  return (
    <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UserCog className="size-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Staff Management</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Manage your administrative team and their system access levels.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="shadow-lg shadow-primary/20 gap-2">
          <Plus className="size-4" />
          Add Staff Member
        </Button>
      </div>

      {/* Stats Section (Premium Feel) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border/50 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="size-10 bg-blue-500/10 rounded-full flex items-center justify-center">
            <Users className="size-5 text-blue-500" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60">Total Staff</p>
            <p className="text-xl font-bold tabular-nums">{data?.total || 0}</p>
          </div>
        </div>
        <div className="bg-card border border-border/50 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="size-10 bg-amber-500/10 rounded-full flex items-center justify-center">
            <ShieldCheck className="size-5 text-amber-500" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60">Admins</p>
            <p className="text-xl font-bold tabular-nums">
              {data?.staff.filter((s: { role: string; }) => s.role === "admin").length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
        <AnimatePresence mode="wait">
          {isPending ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-1"
            >
              <DataTableSkeleton columnCount={columns.length} rowCount={5} />
            </motion.div>
          ) : error ? (
            <div className="p-8 text-center text-rose-500 font-medium">
              Failed to load staff members. Please try again.
            </div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full"
            >
              <DataTable
                columns={columns}
                data={data?.staff || []}
                totalItems={data?.total || 0}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <StaffAddForm isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
}
