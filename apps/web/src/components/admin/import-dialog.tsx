"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  FileSpreadsheet, 
  FileCheck, 
  Loader2, 
  AlertCircle,
  Download
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImportDialogProps {
  title: string;
  description: string;
  onImport: (file: File) => Promise<{ message: string; count?: number }>;
  onDownloadTemplate: () => void;
  trigger?: React.ReactNode;
}

export function ImportDialog({
  title,
  description,
  onImport,
  onDownloadTemplate,
  trigger
}: ImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selectedFile.type === "text/csv" ||
        selectedFile.name.endsWith(".xlsx") ||
        selectedFile.name.endsWith(".csv")
      ) {
        setFile(selectedFile);
      } else {
        toast.error("Invalid file format. Please upload an Excel or CSV file.");
      }
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsImporting(true);
    try {
      const result = await onImport(file);
      toast.success(`${result.message}${result.count ? ` (${result.count} records processed)` : ""}`);
      setIsOpen(false);
      setFile(null);
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import data. Please check the file format and try again.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="size-4" />
            Import
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50/50 transition-colors hover:bg-slate-50">
            <input
              type="file"
              id="import-file"
              className="hidden"
              accept=".xlsx, .csv"
              onChange={handleFileChange}
              disabled={isImporting}
            />
            <Label
              htmlFor="import-file"
              className={cn(
                "flex flex-col items-center justify-center cursor-pointer gap-2",
                isImporting && "opacity-50 cursor-not-allowed"
              )}
            >
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <FileCheck className="size-10 text-emerald-500" />
                  <span className="text-sm font-medium text-slate-700">{file.name}</span>
                  <span className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB</span>
                </div>
              ) : (
                <>
                  <Upload className="size-10 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">Click to upload or drag and drop</span>
                  <span className="text-xs text-slate-500">Excel (.xlsx) or CSV files only</span>
                </>
              )}
            </Label>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex gap-3">
            <AlertCircle className="size-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800">
              <p className="font-bold mb-1">Important Note:</p>
              <p>Make sure your file columns match the template. Existing records with matching IDs will be updated.</p>
            </div>
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-xs gap-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 self-start"
            onClick={onDownloadTemplate}
          >
            <Download className="size-3.5" />
            Download Template
          </Button>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isImporting}>
            Cancel
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={!file || isImporting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[100px]"
          >
            {isImporting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Importing...
              </>
            ) : (
              "Import Data"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
