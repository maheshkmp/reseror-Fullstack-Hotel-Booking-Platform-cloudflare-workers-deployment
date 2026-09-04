import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function HotelDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-pastel-gray text-[#07143d]">
      {/* Hero Section Skeleton */}
      <div className="max-w-6xl mx-auto px-6 mt-3 mb-2">
        <div className="bg-white/40 backdrop-blur-2xl border border-black/30 p-2 rounded-3xl h-16 shadow-[10px_20px_50px_rgba(0,0,0,0.05)] ring-2 ring-black/[0.13]">
          <Skeleton className="w-full h-full rounded-2xl" />
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 pt-1 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-0.5 h-auto lg:h-[300px] rounded-xl overflow-hidden">
          <Skeleton className="md:col-span-2 lg:col-span-2 lg:row-span-2 h-[300px] md:h-[300px]" />
          <Skeleton className="h-full" />
          <Skeleton className="h-full" />
          <Skeleton className="h-full" />
          <Skeleton className="h-full" />
        </div>
      </div>

      {/* Main Content Area Skeleton */}
      <div className="max-w-6xl mx-auto px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <Skeleton className="h-10 w-2/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-20 rounded-xl" />
                  <Skeleton className="h-10 w-20 rounded-xl" />
                </div>
              </div>
              <Skeleton className="h-6 w-1/3" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>

            <div className="w-full">
              <div className="sticky top-0 z-[50] -mx-6 px-6 py-3 bg-white/80 backdrop-blur-2xl border-b border-gray-100/50">
                <Skeleton className="h-10 w-80 rounded-2xl" />
              </div>
              <div className="mt-4 space-y-4">
                <Skeleton className="h-64 w-full rounded-2xl" />
                <Skeleton className="h-64 w-full rounded-2xl" />
                <Skeleton className="h-64 w-full rounded-2xl" />
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="hidden lg:block">
            <Card className="p-5 border border-black/5 sticky top-32 self-start bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-[320px] ring-1 ring-black/[0.03] space-y-4">
              <Skeleton className="h-6 w-1/2" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-14 rounded-2xl" />
                <Skeleton className="h-14 rounded-2xl" />
              </div>
              <Skeleton className="h-14 rounded-2xl w-full" />
              <Skeleton className="h-12 rounded-2xl w-full" />
              <Skeleton className="h-40 rounded-2xl w-full" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
