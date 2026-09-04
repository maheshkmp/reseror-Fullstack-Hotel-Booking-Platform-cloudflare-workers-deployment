"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const VIEW_TYPES = [
  "ocean",
  "city",
  "garden",
  "mountain",
  "pool",
  "courtyard",
  "street",
  "interior",
] as const;

interface ViewTypeFilterProps {
  selectedViews: string[];
  onChange: (views: string[]) => void;
}

export function ViewTypeFilter({
  selectedViews,
  onChange,
}: ViewTypeFilterProps) {
  const handleViewTypeChange = (viewType: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedViews, viewType]);
    } else {
      onChange(selectedViews.filter((v) => v !== viewType));
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">View Type</Label>
      <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
        {VIEW_TYPES.map((viewType) => (
          <div key={viewType} className="flex items-center space-x-2">
            <Checkbox
              id={`view-${viewType}`}
              checked={selectedViews.includes(viewType)}
              onCheckedChange={(checked) =>
                handleViewTypeChange(viewType, checked as boolean)
              }
            />
            <Label
              htmlFor={`view-${viewType}`}
              className="text-sm font-normal cursor-pointer capitalize"
            >
              {viewType} view
            </Label>
          </div>
        ))}
      </div>
      {selectedViews.length > 0 && (
        <div className="text-xs text-gray-500">
          {selectedViews.length} view type(s) selected
        </div>
      )}
    </div>
  );
}
