"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IconAlertTriangle, IconDownload, IconUpload } from "@tabler/icons-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { getClient } from "@/lib/rpc/client";

export function BackupPanel() {
  const [downloading, setDownloading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"full" | "merge">("full");
  const [confirmText, setConfirmText] = useState("");
  
  const handleExport = async () => {
    try {
      setDownloading(true);
      toast.info("Preparing backup...");
      
      const client = await getClient();
      const res = await client.backup.export.$get();
      if (!res.ok) {
        toast.error("Failed to export backup");
        return;
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reseror-backup-${new Date().toISOString().split('T')[0]}.json.gz`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success("Backup downloaded successfully");
    } catch (e: any) {
      console.error(e);
      toast.error("An error occurred during backup: " + e.message);
    } finally {
      setDownloading(false);
    }
  };

  const handleRestore = async () => {
    if (!file) {
      toast.error("Please choose a backup file first");
      return;
    }
    
    if (confirmText !== "RESTORE") {
      toast.error("Please type RESTORE to confirm");
      return;
    }
    
    try {
      setRestoring(true);
      
      // Decompress GZIP in browser
      const ds = new DecompressionStream("gzip");
      const decompressedStream = file.stream().pipeThrough(ds);
      const text = await new Response(decompressedStream).text();
      const data = JSON.parse(text);
      
      toast.info("Sending data to server. This may take a minute...");
      
      const client = await getClient();
      const res = await client.backup.restore.$post({
        json: {
          mode,
          data
        }
      });
      
      if (!res.ok) {
        // Fallback for API errors
        toast.error("Failed to restore backup");
        return;
      }

      const result = await res.json();
      
      if (result.success) {
        toast.success(result.message);
        setConfirmText("");
        setFile(null);
        setTimeout(() => window.location.reload(), 2000);
      } else {
        toast.error(result.message || "Failed to restore backup");
      }
    } catch (e: any) {
      console.error(e);
      toast.error("An error occurred during restore. Check console for details.");
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconDownload className="h-5 w-5" />
            Export Backup
          </CardTitle>
          <CardDescription>
            Download a full logical backup of all application data (excluding valid tokens/sessions).
            This backup will be saved as a compressed JSON file.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Click the button below to generate and download a fresh snapshot of the database.
          </p>
          <Button onClick={handleExport} disabled={downloading || restoring} className="w-full">
            {downloading ? "Preparing Download..." : "Download Backup"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <IconAlertTriangle className="h-5 w-5" />
            Restore Database
          </CardTitle>
          <CardDescription>
            Restore your database from an existing `.json.gz` backup file.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Alert variant="destructive">
                <IconAlertTriangle className="h-4 w-4" />
                <AlertTitle>Danger Zone</AlertTitle>
                <AlertDescription>
                    Restoring a backup can be destructive. Please ensure you know what you are doing.
                </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label>Select Backup File (.json.gz)</Label>
              <Input 
                type="file" 
                accept=".json.gz" 
                onChange={(e) => setFile(e.target.files?.[0] || null)} 
                disabled={restoring || downloading}
              />
            </div>

            <div className="space-y-3 pt-2">
              <Label>Restore Mode</Label>
              <RadioGroup value={mode} onValueChange={(val: any) => setMode(val)}>
                <div className="flex items-start space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="full" id="r-full" className="mt-1" />
                  <div className="grid gap-1">
                      <Label htmlFor="r-full" className="font-semibold">Full Replace (Destructive)</Label>
                      <p className="text-xs text-muted-foreground">Truncates tables before inserting. Best for emergencies and fresh databases.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="merge" id="r-merge" className="mt-1" />
                  <div className="grid gap-1">
                      <Label htmlFor="r-merge" className="font-semibold">Merge (Non-Destructive)</Label>
                      <p className="text-xs text-muted-foreground">Inserts missing records only. Ignores conflicts. Best for partial syncs.</p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2 pt-2">
              <Label className="text-destructive font-semibold">Type RESTORE to confirm</Label>
              <Input 
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="RESTORE"
                className="border-destructive/50"
                autoComplete="off"
                disabled={restoring || downloading}
              />
            </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="destructive" 
            className="w-full" 
            disabled={!file || confirmText !== "RESTORE" || restoring || downloading}
            onClick={handleRestore}
          >
            <IconUpload className="mr-2 h-4 w-4" />
            {restoring ? "Restoring..." : "Restore Backup"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
