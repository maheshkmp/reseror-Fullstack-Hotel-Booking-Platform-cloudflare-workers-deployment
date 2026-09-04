import { getClient } from "../rpc/server";

type GetUserReturnT = {
  userType: "user" | "hotelOwner" | "systemAdmin" | null;
  setup: boolean;
};

export async function getUserType(cookieHeader?: string | null, userAgent?: string | null): Promise<GetUserReturnT> {
  const rpcClient = await getClient(cookieHeader, userAgent);

  const response = await rpcClient.api.system["check-user-type"].$get({});

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error fetching user type:", errorData);
    return { userType: null, setup: false };
  }

  const responseData = await response.json();

  return {
    userType: responseData.userType,
    setup: responseData.setup ?? false
  };
}
