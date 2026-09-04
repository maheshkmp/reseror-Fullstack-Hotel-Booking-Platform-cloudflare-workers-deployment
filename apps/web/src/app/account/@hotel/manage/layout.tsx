import { HotelTabBar } from "@/features/hotels/components/hotel-tab-bar";
import { SaveProvider } from "@/features/hotels/context/save-context";
import { SaveBar } from "@/features/hotels/components/save-bar";
import { getClient } from "@/lib/rpc/server";
import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getUserType } from "@/lib/helpers/get-user-type";
import React from "react";

type Props = {
  children?: React.ReactNode;
};

export default async function HotelManagementLayout({ children }: Props) {
  const cookieHeader = (await headers()).get("cookie");
  const { userType } = await getUserType(cookieHeader);

  // System admins don't own a hotel — let them through directly
  if (userType === "systemAdmin") {
    return (
      <PageContainer scrollable={true}>
        <div className="flex flex-1 flex-col">
          {children}
        </div>
      </PageContainer>
    );
  }

  const rpcClient = await getClient();
  const myHotelRes = await rpcClient.api.hotels["my-hotel"].$get();

  if (!myHotelRes.ok) {
    const isNotFound = myHotelRes.status === 404;
    if (isNotFound) redirect("/account/setup");
    return <></>;
  }

  const myHotel = await myHotelRes.json();

  return (
    <SaveProvider>
      <PageContainer scrollable={false}>
        <div className="flex flex-1 flex-col space-y-4">
          <AppPageShell
            title={myHotel.name}
            description={
              myHotel.description?.slice(0, 70) + "..." ||
              `You are managing your property: ${myHotel.name}`
            }
            actionComponent={<></>}
          />

          <div className="">
            <Separator />

            <HotelTabBar />

            <Separator />
          </div>

          {children}
        </div>
        <SaveBar />
      </PageContainer>
    </SaveProvider>
  );
}
