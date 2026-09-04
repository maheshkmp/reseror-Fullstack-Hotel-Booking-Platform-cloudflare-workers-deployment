import { headers } from "next/headers";
import { getUserType } from "@/lib/helpers/get-user-type";

export default async function AccountPageLayout({
  hotel,
  user,
  children
}: {
  hotel?: React.ReactNode;
  user?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const cookieHeader = (await headers()).get("cookie");
  const { userType } = await getUserType(cookieHeader);

  return (
    <>
      {userType === "hotelOwner" || userType === "systemAdmin" ? hotel : user}
      {children}
    </>
  );
}

