"use client";

import { RestaurantList } from "@/features/resturant/components/restaurant-list";
import { 
  IconToolsKitchen2,
  IconPlus
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminRestaurantsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <IconToolsKitchen2 className="w-6 h-6 text-blue-600" />
            Restaurant Management
          </h1>
          <p className="text-slate-500 text-sm">
            Monitor, approve, edit and manage all restaurants across the platform.
          </p>
        </div>
        
        {/* <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-900/10 h-10">
          <Link href="/admin/restaurants/new" className="flex items-center gap-2">
            <IconPlus className="w-4 h-4" />
            Add Restaurant
          </Link>
        </Button> */}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-6">
        <RestaurantList />
      </div>
    </div>
  );
}
