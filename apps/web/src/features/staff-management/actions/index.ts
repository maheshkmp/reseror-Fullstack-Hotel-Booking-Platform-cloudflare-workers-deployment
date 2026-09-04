"use server";

import { getForwardedHeaders } from "@/lib/server-utils";
import { CreateStaff, UpdateStaff } from "../schemas";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function listStaff(page = 1, limit = 10) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/staff?page=${page}&limit=${limit}`, {
      headers: await getForwardedHeaders(),
    });

    if (!response.ok) throw new Error("Failed to fetch staff");

    const result = await response.json();
    return {
      staff: result.data || [],
      total: result.meta?.totalCount || 0,
    };
  } catch (error) {
    console.error("listStaff error:", error);
    return { staff: [], total: 0 };
  }
}

export async function createStaff(data: CreateStaff) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/staff`, {
      method: "POST",
      headers: {
        ...(await getForwardedHeaders()),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create staff");
    }

    return await response.json();
  } catch (error: any) {
    console.error("createStaff error:", error);
    throw error;
  }
}

export async function updateStaff(id: string, data: UpdateStaff) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/staff/${id}`, {
      method: "PATCH",
      headers: {
        ...(await getForwardedHeaders()),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Failed to update staff");

    return await response.json();
  } catch (error) {
    console.error("updateStaff error:", error);
    throw error;
  }
}

export async function deleteStaff(id: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/staff/${id}`, {
      method: "DELETE",
      headers: await getForwardedHeaders(),
    });

    if (!response.ok) throw new Error("Failed to delete staff");

    return true;
  } catch (error) {
    console.error("deleteStaff error:", error);
    throw error;
  }
}
