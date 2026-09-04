import { getClient } from "@/lib/rpc/client";
import { InsertRoomBookingSchema } from "@api/routes/room-booking/roomBookings.schema";

/**
 * Creates a new room booking.
 * @param data - The booking data (InsertRoomBookingSchema)
 * @returns The created booking or throws an error.
 */
export async function createRoomBooking(data: InsertRoomBookingSchema) {
  const rpcClient = await getClient();

  const response = await rpcClient.api["room-bookings"].$post({
    json: data,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Failed to create room booking");
  }

  return response.json();
}
