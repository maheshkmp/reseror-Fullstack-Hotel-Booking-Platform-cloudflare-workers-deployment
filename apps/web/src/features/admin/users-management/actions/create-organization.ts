"use server";

import { authClient } from "@/lib/auth-client";
import { getForwardedHeaders } from "@/lib/server-utils";
import { CreateOrganizationSchema } from "core/zod/create-organization";

export async function createOrganization(values: CreateOrganizationSchema) {
  return await authClient.organization.create(values, {
    headers: await getForwardedHeaders()
  });
}
