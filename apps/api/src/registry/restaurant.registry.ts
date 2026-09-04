import { createRouter } from "../lib/setup-api";

import * as imageHandlers from "../handlers/restaurant-images.handler";
import * as imageRoutes from "../routes/restaurant-images.routes";
import * as handlers from "../handlers/restaurant.handler";
import * as routes from "../routes/restaurant.routes";

import { cacheMiddleware } from "../lib/cache";
import { httpCacheMiddleware } from "../lib/http-cache";

const router = createRouter();

// Apply caching to read-heavy routes
router.use("/", (c, next) => {
  if (c.req.method === "GET" && c.req.path === "/restaurant/") {
    return cacheMiddleware(60)(c, next);
  }
  return next();
});
router.use("/:id", (c, next) => {
  if (c.req.method === "GET" && !c.req.path.includes("images")) {
    return cacheMiddleware(60)(c, next);
  }
  return next();
});

// Set HTTP Cache-Control headers
router.use("/", (c, next) => {
  if (c.req.method === "GET" && c.req.path === "/restaurant/") {
    return httpCacheMiddleware(60)(c, next);
  }
  return next();
});
router.use("/:id", (c, next) => {
  if (c.req.method === "GET" && !c.req.path.includes("images")) {
    return httpCacheMiddleware(60)(c, next);
  }
  return next();
});

router
  // Restaurant Type Images routes
  .openapi(
    imageRoutes.getRestaurantImagesRoute,
    imageHandlers.getRestaurantImagesHandler
  )
  .openapi(
    imageRoutes.addRestaurantImageRoute,
    imageHandlers.addRestaurantImageHandler
  )
  .openapi(
    imageRoutes.updateRestaurantImageRoute,
    imageHandlers.updateRestaurantImageHandler
  )
  .openapi(
    imageRoutes.removeRestaurantImageRoute,
    imageHandlers.removeRestaurantImageHandler
  )

  // Restaurants routes
  .openapi(routes.listRestaurantsRoute, handlers.listRestaurantsHandler)
  .openapi(routes.getMyRestaurantsRoute, handlers.getMyRestaurantsHandler)
  .openapi(routes.getRestaurantRoute, handlers.getRestaurantHandler)
  .openapi(routes.createRestaurantRoute, handlers.createRestaurantHandler)

  .openapi(routes.updateRestaurantRoute, handlers.updateRestaurantHandler)
  .openapi(routes.deleteRestaurantRoute, handlers.deleteRestaurantHandler);

export default router;
