import { headers } from "next/headers";

/**
 * Gets headers from the current request and filters out problematic ones
 * (like Content-Type and Content-Length) that should be managed by the
 * fetch client when forwarding requests from a Server Action.
 */
export async function getForwardedHeaders() {
  const headersList = await headers();
  const headersObject = Object.fromEntries(headersList.entries());

  // Filter out headers that Next.js sets for the Server Action request
  // but should be set by the fetch client for the forwarded request.
  delete headersObject["content-type"];
  delete headersObject["content-length"];
  delete headersObject["connection"];
  delete headersObject["transfer-encoding"];
  delete headersObject["host"];

  return headersObject;
}
