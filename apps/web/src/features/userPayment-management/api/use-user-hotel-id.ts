import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export function useUserHotelId() {
  const { data: session } = authClient.useSession();
  const [hotelId, setHotelId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHotelId() {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
        const response = await fetch(`${baseUrl}/api/users/${session.user.id}/profile`, {
          credentials: "include"
        });
        if (response.ok) {
          const data = await response.json();
          const id = data.hotelId || data.hotel_id;
          if (id) {
            setHotelId(id);
          }
        }
      } catch (error) {
        console.error("Error fetching user hotel ID:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHotelId();
  }, [session?.user?.id]);

  return { hotelId, loading };
}
