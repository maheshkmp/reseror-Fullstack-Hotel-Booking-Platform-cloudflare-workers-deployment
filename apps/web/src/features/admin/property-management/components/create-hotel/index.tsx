"use client";

import { Stepper } from "@/components/ui/stepper";
import { cn } from "@/lib/utils";
import { Building, User } from "lucide-react";
import { toast } from "sonner";
import { CreateHotel } from "./create-hotel";
import { CreateUser } from "./create-user";
import { useCreateHotelStore } from "./store";

type Props = {
  className?: string;
};

export default function CreateHotelForm({ className }: Props) {
  const { activeTab, userId, setActiveTab } = useCreateHotelStore();

  return (
    <div
      className={cn(
        "flex-1 w-full h-full bg-secondary/40 rounded-sm px-4 py-6",
        className
      )}
    >
      {/* Stepper Component */}
      <div className="w-full max-w-lg mx-auto">
        <Stepper
          steps={[
            {
              id: "user",
              title: "Hotel Owner",
              description: "Provide the details of the hotel owner",
              icon: <User />
            },
            {
              id: "hotel",
              title: "Hotel Details",
              description: "Provide the details of the hotel",
              icon: <Building />
            }
          ]}
          currentStep={activeTab === "user" ? 0 : 1}
          onStepChange={(step) => {
            if (!userId && step === 1) {
              toast.error(
                "Please setup a owner before proceeding to hotel details."
              );
              return;
            }

            setActiveTab(step === 0 ? "user" : "hotel");
          }}
        />
      </div>

      {/* Form Component */}
      <div className="w-full flex items-center justify-center">
        {activeTab === "user" && <CreateUser />}
        {activeTab === "hotel" && <CreateHotel />}
      </div>
    </div>
  );
}
