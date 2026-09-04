import { authClient } from "@/lib/auth-client";

export async function updateUserDetails({
  image,
  name,
  email,
  bio,
  phoneNumber,
  nationality,
  dateOfBirth,
}: {
  image?: string;
  name?: string;
  email?: string;
  bio?: string;
  phoneNumber?: string;
  nationality?: string;
  dateOfBirth?: Date;
}) {
  try {
    const response = await (authClient.updateUser as any)({
      image,
      name,
      bio,
      phoneNumber,
      nationality,
      dateOfBirth,
    });
    return response;
  } catch (error) {
    console.error("Failed to update user details:", error);
    throw error;
  }
}

export async function changeUserEmail({ email }: { email: string }) {
  try {
    const response = await authClient.changeEmail({
      newEmail: email,
    });
    return response;
  } catch (error) {
    console.error("Failed to change user email:", error);
    throw error;
  }
}

export async function deleteUser() {
  try {
    const response = await authClient.deleteUser();
    return response;
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
}
