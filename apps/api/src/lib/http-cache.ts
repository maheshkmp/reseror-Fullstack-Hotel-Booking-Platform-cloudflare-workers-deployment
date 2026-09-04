import { Context, Next } from "hono";

/**
 * Middleware to set Cache-Control headers
 * @param seconds Time in seconds for max-age
 */
export const httpCacheMiddleware = (seconds: number = 60) => {
  return async (c: Context, next: Next) => {
    await next();
    if (c.req.method === "GET" && c.res.status === 200) {
      c.header("Cache-Control", `public, max-age=${seconds}, stale-while-revalidate=${Math.floor(seconds / 2)}`);
    }
  };
};
