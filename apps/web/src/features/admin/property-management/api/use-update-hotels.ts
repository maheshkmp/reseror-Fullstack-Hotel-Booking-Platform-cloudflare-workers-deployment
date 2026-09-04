"use server";

import { getClient } from "@/lib/rpc/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { hotelUpdateSchema } from "core/zod";

type UpdateHotelInput = z.infer<typeof hotelUpdateSchema>;

export async function updateHotel(id: string, data: UpdateHotelInput) {
  const rpcClient = await getClient();

  try {
    const parsed = hotelUpdateSchema.safeParse(data);
    if (!parsed.success) {
      const errorMessage = parsed.error.issues
        .map((issue) => issue.message)
        .join(", ");
      throw new Error(`Validation failed: ${errorMessage}`);
    }

    const result = await rpcClient.api.hotels[":id"].$patch({
      param: { id },
      json: parsed.data,
    });

    if (!result.ok) {
      const errorData = await result.json().catch(() => ({}));
      throw new Error(
        typeof errorData === "object" &&
          errorData !== null &&
          "message" in errorData &&
          typeof (errorData as any).message === "string"
          ? (errorData as any).message
          : `Failed to update hotel: ${result.status}`
      );
    }

    revalidatePath("/admin/hotels");
    return { success: true, data: await result.json() };
  } catch (error) {
    console.error("Hotel update error:", error);
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred while updating the hotel");
  }
}
