"use client";

import { ImagesIcon, UploadIcon } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMediaLibraryStore } from "../../store/library-store";
import type { ActiveTab, onUseSelectedT } from "../gallery-view";

type Props = {
  currentTab: ActiveTab;
  setCurrentTab: React.Dispatch<React.SetStateAction<ActiveTab>>;
  onUseSelected?: onUseSelectedT;
  selectionMode?: boolean;
};

export function GalleryTabBar({
  currentTab,
  setCurrentTab,
  onUseSelected,
  selectionMode = false
}: Props) {
  const { selectedFiles, setSelectedFiles } = useMediaLibraryStore();

  return (
    <nav className="border-y border-secondary/90 flex items-center justify-between bg-transparent w-full h-12">
      <div className="flex items-center gap-3 h-full">
        {/* Upload selector */}
        <Button
          variant={"ghost"}
          className={cn(
            `px-4 h-full rounded-none hover:bg-secondary/30 cursor-pointer`,
            currentTab === "upload" && "border-b-2 border-primary"
          )}
          onClick={() => setCurrentTab("upload")}
        >
          <span
            className={`${
              currentTab === "upload" ? "text-primary" : "text-primary/60"
            } flex items-center gap-3`}
          >
            <UploadIcon className="size-4" />
            Upload Files
          </span>
        </Button>

        {/* Library selector */}
        <Button
          variant={"ghost"}
          className={cn(
            `px-4 h-full rounded-none hover:bg-secondary/30 cursor-pointer`,
            currentTab === "library" && "border-b-2 border-primary"
          )}
          onClick={() => setCurrentTab("library")}
        >
          <span
            className={`${
              currentTab === "library" ? "text-primary" : "text-primary/60"
            } flex items-center gap-3`}
          >
            <ImagesIcon className="size-4" />
            Media Library
            {selectionMode && currentTab === "library" && (
              <span className={cn(
                "inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[10px] font-bold transition-all",
                selectedFiles.length === 0
                  ? "bg-amber-100 text-amber-700 ring-1 ring-amber-300"
                  : "bg-primary text-primary-foreground"
              )}>
                {selectedFiles.length === 0 ? "Select" : `${selectedFiles.length} ✓`}
              </span>
            )}
            {selectionMode && currentTab !== "library" && (
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2 bg-amber-500"></span>
              </span>
            )}
          </span>
        </Button>
      </div>

      {currentTab === "library" && (
        <div className="">
          {selectedFiles.length > 0 && (
            <div className="flex items-center gap-1">
              <Button
                variant={"outline"}
                className="h-full rounded-none"
                onClick={() => {
                  setSelectedFiles([]);
                  onUseSelected?.([]);
                }}
              >
                Clear Selection
              </Button>
              <Button
                className="h-full rounded-none"
                onClick={() => onUseSelected?.(selectedFiles)}
              >
                Use Selected
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
