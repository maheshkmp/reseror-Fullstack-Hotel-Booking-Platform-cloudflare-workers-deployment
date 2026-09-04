import type { CountryCode } from "libphonenumber-js";
import "server-only";

import { headers } from "next/headers";

export async function getGeolocation() {
  const allHeaders = await headers();
  const ipCountry = allHeaders.get("x-vercel-ip-country") as CountryCode | null;

  return ipCountry;
}
