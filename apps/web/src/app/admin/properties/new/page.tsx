import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

import CreateHotelForm from "@/features/admin/property-management/components/create-hotel";
import PageContainer from "@/modules/layouts/page-container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function PropertyCreatePage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="">
          <Button asChild icon={<ArrowLeftIcon />} variant={"outline"}>
            <Link href="/admin/properties">Back to Properties</Link>
          </Button>
        </div>

        <Separator />

        <CreateHotelForm />
      </div>
    </PageContainer>
  );
}
