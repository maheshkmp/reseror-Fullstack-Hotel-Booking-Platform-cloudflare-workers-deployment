"use client";

import React from "react";
import { useSaveRegistry } from "../context/save-context";
import { Button } from "@/components/ui/button";
import { Loader2, Save, Undo2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SaveBar() {
  const { isDirty, isSaving, saveAll, resetAll } = useSaveRegistry();

  return (
    <AnimatePresence>
      {(isDirty || isSaving) && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] pb-6 px-4 pointer-events-none flex justify-center">
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white/60 dark:bg-blue-950/60 backdrop-blur-xl shadow-lg ring-1 ring-slate-200/50 dark:ring-slate-800/50 rounded-full p-2 md:pl-16 md:pr-2 flex items-center justify-between gap-6 pointer-events-auto w-full max-w-[400px] md:max-w-fit"
          >
            <div className="hidden md:flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/20" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 tracking-tight">
                Unsaved changes
              </p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetAll}
                disabled={isSaving}
                className="rounded-full flex-1 md:flex-none text-yellow-500 hover:text-slate-900 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 px-4 h-9 text-xs font-semibold tracking-wide"
              >
                Discard
              </Button>
              
              <Button
                size="sm"
                onClick={saveAll}
                disabled={isSaving}
                className="rounded-full flex-1 md:flex-none h-9 px-6 text-xs font-bold tracking-wide bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/10 transition-all active:scale-95 disabled:opacity-70"
              >
                {isSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                ) : (
                  <Save className="w-3.5 h-3.5 mr-2" />
                )}
                {isSaving ? "Saving..." : "Save Now"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
