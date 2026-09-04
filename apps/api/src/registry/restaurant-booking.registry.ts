import { OpenAPIHono } from "@hono/zod-openapi";
import type { APIBindings } from "@/types";
import * as routes from "../routes/restaurant-booking.routes";
import * as handlers from "../handlers/restaurant-booking.handler";

const registry = new OpenAPIHono<APIBindings>();

registry.openapi(routes.createRestaurantBookingRoute, handlers.createRestaurantBookingHandler);
registry.openapi(routes.listRestaurantBookingsRoute, handlers.listRestaurantBookingsHandler);
registry.openapi(routes.updateRestaurantBookingStatusRoute, handlers.updateRestaurantBookingStatusHandler);

export default registry;
