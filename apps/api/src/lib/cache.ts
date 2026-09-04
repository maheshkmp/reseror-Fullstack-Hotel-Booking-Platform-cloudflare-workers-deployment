import { Context, Next } from "hono";

type CacheEntry = {
  value: any;
  expires: number;
  contentType: string;
};

const cache = new Map<string, CacheEntry>();

/**
 * Simple in-memory cache middleware for Hono
 * @param ttl Time to live in seconds
 */
export const cacheMiddleware = (ttl: number = 60) => {
  return async (c: Context, next: Next) => {
    // Only cache GET requests
    if (c.req.method !== "GET") {
      return await next();
    }

    const user = c.get("user");
    const session = c.get("session");
    const userId = user?.id || session?.userId || "guest";
    
    const key = `${userId}:${c.req.url}`;
    const cached = cache.get(key);

    if (cached && cached.expires > Date.now()) {
      c.header("X-Cache", "HIT");
      return c.newResponse(cached.value, 200, {
        "Content-Type": cached.contentType,
      });
    }

    await next();

    if (c.res.status === 200) {
      const contentType = c.res.headers.get("Content-Type") || "application/json";
      
      // We need to clone the response to read its body without consuming it for the original request
      const responseClone = c.res.clone();
      const body = await responseClone.blob();

      cache.set(key, {
        value: body,
        expires: Date.now() + ttl * 1000,
        contentType,
      });
      
      c.header("X-Cache", "MISS");
    }
  };
};

/**
 * Clear cache for a specific key or all
 */
export const clearCache = (key?: string) => {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
};

/**
 * Clear cache entries that match a pattern
 */
export const clearCacheByPattern = (pattern: string) => {
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
};

