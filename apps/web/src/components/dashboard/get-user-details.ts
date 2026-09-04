import { authClient } from "@/lib/auth-client";

export function getUserDetails() {
  const { data: session } = authClient.useSession();
  return {
    name: session?.user?.name || "Guest",
    email: session?.user?.email || "",
    avatar: session?.user?.image || "/avatars/shadcn.jpg",
    role: session?.user?.role || "user",
    roleName: session?.user?.role === "hotelOwner" ? "Hotel Owner" : 
              session?.user?.role === "admin" ? "System Admin" : "Traveler",
  };
}
