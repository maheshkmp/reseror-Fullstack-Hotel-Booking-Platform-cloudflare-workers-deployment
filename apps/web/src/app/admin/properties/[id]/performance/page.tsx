import { HotelPerformanceClient } from "@/features/admin/property-management/components/hotel-performance-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotel Performance | Admin Dashboard",
  description: "View detailed performance metrics and analytics for your property.",
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function HotelPerformancePage({ params }: PageProps) {
  const { id } = await params;
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 min-h-0">
      <HotelPerformanceClient id={id} />
    </div>
  );
}
