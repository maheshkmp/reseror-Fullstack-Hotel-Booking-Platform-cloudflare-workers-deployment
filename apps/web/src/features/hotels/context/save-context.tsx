"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { toast } from "sonner";

type SaveRegistryEntry = {
  id: string;
  isDirty: boolean;
  onSave: () => Promise<void> | void;
  onReset?: () => void;
};

type SaveContextType = {
  register: (entry: SaveRegistryEntry) => void;
  unregister: (id: string) => void;
  isDirty: boolean;
  isSaving: boolean;
  saveAll: () => Promise<void>;
  resetAll: () => void;
};

const SaveContext = createContext<SaveContextType | undefined>(undefined);

export function SaveProvider({ children }: { children: React.ReactNode }) {
  const [registry, setRegistry] = useState<Record<string, SaveRegistryEntry>>({});
  const [isSaving, setIsSaving] = useState(false);

  const register = useCallback((entry: SaveRegistryEntry) => {
    setRegistry((prev) => ({
      ...prev,
      [entry.id]: entry,
    }));
  }, []);

  const unregister = useCallback((id: string) => {
    setRegistry((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const isDirty = useMemo(() => {
    const dirtyEntries = Object.entries(registry).filter(([_, entry]) => entry.isDirty);
    
    if (process.env.NODE_ENV === "development" && dirtyEntries.length > 0) {
      console.log("🛠️ SaveContext: Dirty Components ->", dirtyEntries.map(([id]) => id));
    }
    
    return dirtyEntries.length > 0;
  }, [registry]);

  const saveAll = useCallback(async () => {
    const dirtyEntries = Object.values(registry).filter((entry) => entry.isDirty);
    
    if (dirtyEntries.length === 0) return;

    setIsSaving(true);
    const savePromise = Promise.all(dirtyEntries.map((entry) => entry.onSave()));
    
    toast.promise(savePromise, {
      loading: "Saving all changes...",
      success: "All changes saved successfully",
      error: "Some changes failed to save. Please check your inputs.",
    });

    try {
      await savePromise;
    } catch (error) {
      console.error("Global save error:", error);
    } finally {
      setIsSaving(false);
    }
  }, [registry]);

  const resetAll = useCallback(() => {
    Object.values(registry).forEach((entry) => entry.onReset?.());
  }, [registry]);

  const value = useMemo(
    () => ({ register, unregister, isDirty, isSaving, saveAll, resetAll }),
    [register, unregister, isDirty, isSaving, saveAll, resetAll]
  );

  return <SaveContext.Provider value={value}>{children}</SaveContext.Provider>;
}

export function useSaveRegistry() {
  const context = useContext(SaveContext);
  if (!context) {
    throw new Error("useSaveRegistry must be used within a SaveProvider");
  }
  return context;
}
