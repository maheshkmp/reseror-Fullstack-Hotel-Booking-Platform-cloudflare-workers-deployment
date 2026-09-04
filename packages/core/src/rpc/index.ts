import { hc } from "hono/client";
import type { Router } from "../../types";

// Create type-safe RPC client with Router type from API
// We use 'any' cast here to prevent Bun's builder from hitting a stack overflow
// during transpilation while keeping the types intact for the consumer.
const client = hc<any>(process.env.NEXT_PUBLIC_BACKEND_URL!, {
  fetch: (input: string | URL | Request, init?: RequestInit) => {
    return fetch(input, {
      ...init,
      credentials: "include" // Required for sending cookies cross-origin
    });
  }
}) as unknown as ReturnType<typeof hc<Router>>;

export type Client = typeof client;

export default (...args: Parameters<typeof hc>): Client => hc<any>(...args) as Client;
