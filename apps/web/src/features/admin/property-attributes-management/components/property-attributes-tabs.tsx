"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Tags, Sparkles } from "lucide-react";

// Property Class
import PropertyClassListing from "@/features/admin/property-class-management/components/propertyClasses-listing";
import { PropertyClassTableActions } from "@/features/admin/property-class-management/components/propertyClass-table/propertyClasses-table-actions";

// Property Type
import PropertyTypesListing from "@/features/admin/property-type-management/components/property-types-listing";
import { PropertyTypesTableActions } from "@/features/admin/property-type-management/components/hotel-types-table/hotelTypes-table-actions";

// Amenities
import { AmenitiesListing } from "./amenities-listing";

export function PropertyAttributesTabs() {
  return (
    <Tabs defaultValue="classes" className="flex flex-col h-full gap-0">
      {/* Tab bar */}
      <div className="border-b border-border/50 pb-0 shrink-0">
        <TabsList className="h-auto bg-transparent p-0 gap-0 rounded-none border-0">
          <TabsTrigger
            value="classes"
            className="
              relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-none
              text-muted-foreground data-[state=active]:text-foreground
              data-[state=active]:shadow-none bg-transparent
              border-b-2 border-blue data-[state=active]:border-primary
              transition-colors
            "
          >
            <Tags className="size-4" />
            Property Classes
          </TabsTrigger>
          <TabsTrigger
            value="types"
            className="
              relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-none
              text-muted-foreground data-[state=active]:text-foreground
              data-[state=active]:shadow-none bg-transparent
              border-b-2 border-transparent data-[state=active]:border-primary
              transition-colors
            "
          >
            <Building2 className="size-4" />
            Property Types
          </TabsTrigger>
          <TabsTrigger
            value="amenities"
            className="
              relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-none
              text-muted-foreground data-[state=active]:text-foreground
              data-[state=active]:shadow-none bg-transparent
              border-b-2 border-transparent data-[state=active]:border-primary
              transition-colors
            "
          >
            <Sparkles className="size-4" />
            Amenities
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Property Classes Tab */}
      <TabsContent value="classes" className="flex flex-col flex-1 min-h-0 mt-0 pt-4 gap-3 overflow-hidden">
        <PropertyClassTableActions />
        <PropertyClassListing />
      </TabsContent>

      {/* Property Types Tab */}
      <TabsContent value="types" className="flex flex-col flex-1 min-h-0 mt-0 pt-4 gap-3 overflow-hidden">
        <PropertyTypesTableActions />
        <PropertyTypesListing />
      </TabsContent>

      {/* Amenities Tab */}
      <TabsContent value="amenities" className="flex flex-col flex-1 min-h-0 mt-0 pt-4 overflow-hidden">
        <AmenitiesListing />
      </TabsContent>
    </Tabs>
  );
}
