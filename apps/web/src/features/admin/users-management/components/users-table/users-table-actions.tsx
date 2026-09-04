"use client";

import { DataTableResetFilter } from "@/components/table/data-table-reset-filter";
import { DataTableSearch } from "@/components/table/data-table-search";
import { useUsersTableFilters } from "./use-users-table-filters";
import { ImportDialog } from "@/components/admin/import-dialog";
import { Button } from "@/components/ui/button";
import { Download, Plus, Upload, FilterX } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type Props = {};

export function UsersTableActions({}: Props) {
  const {
    // Search
    searchQuery,
    setSearchQuery,

    // Pagination
    setPage,

    // Reset
    resetFilters,
    isAnyFilterActive,

    // Status
    status,
    setStatus,
  } = useUsersTableFilters();

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-2">
      <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:max-w-sm group">
           <DataTableSearch
            searchKey="email"
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setPage={setPage}
          />
        </div>

        <div className="w-[140px]">
          <Select
            value={status || "all"}
            onValueChange={(val) => {
              setStatus(val === "all" ? null : val);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 rounded-xl border-border/40 bg-background/50 backdrop-blur-sm shadow-sm text-xs font-medium">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {isAnyFilterActive && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetFilters}
            className="h-9 px-2 text-xs font-bold uppercase tracking-widest text-rose-500 hover:text-rose-600 hover:bg-rose-50"
          >
            <FilterX className="size-3.5 mr-2" />
            Clear
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="h-9 w-[1px] bg-border/40 mx-2 hidden md:block" />
        
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-2 rounded-xl border-border/40 bg-background/50 backdrop-blur-sm hover:bg-secondary/50 font-bold text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-sm"
          onClick={async () => {
            try {
              const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/export`);
              if (searchQuery) url.searchParams.append("search", searchQuery);
              
              const response = await fetch(url.toString(), {
                credentials: "include",
              });
              
              if (!response.ok) {
                const errorText = await response.text();
                console.error(`Export failed with status ${response.status}:`, errorText);
                throw new Error(`Failed to export: ${response.status}`);
              }
              
              const blob = await response.blob();
              const downloadUrl = window.URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = downloadUrl;
              link.setAttribute("download", `users_${new Date().toISOString().split('T')[0]}.xlsx`);
              document.body.appendChild(link);
              link.click();
              link.remove();
              toast.success("Users exported successfully");
            } catch (error) {
              console.error("Export error:", error);
              toast.error("Failed to export users");
            }
          }}
        >
          <Download className="size-3.5 text-blue-500" />
          Export
        </Button>

        <ImportDialog
          title="Import Users"
          description="Upload an Excel file to bulk create or update users. Users will be matched by ID or Email."
          onDownloadTemplate={async () => {
             try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/template`, {
                  credentials: "include",
                });
                if (!response.ok) {
                  const errorText = await response.text();
                  console.error(`Export failed with status ${response.status}:`, errorText);
                  throw new Error(`Failed to export: ${response.status}`);
                }
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "user_import_template.xlsx");
                document.body.appendChild(link);
                link.click();
                link.remove();
              } catch (error) {
                toast.error("Failed to download template");
              }
          }}
          onImport={async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/import`, {
              method: "POST",
              credentials: "include",
              body: formData,
            });
            
            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.message || "Failed to import");
            }
            
            toast.success("Users imported successfully");
            return response.json();
          }}
          trigger={
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2 rounded-xl border-border/40 bg-background/50 backdrop-blur-sm hover:bg-secondary/50 font-bold text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-sm"
            >
              <Upload className="size-3.5 text-emerald-500" />
              Import
            </Button>
          }
        />
      </div>
    </div>
  );
}

