import { OpenAPIHono } from "@hono/zod-openapi";
import { OpenAPI, APIBindings } from "@/types";
import { BASE_PATH } from "@/lib/constants";

import index from "../routes/index.route";
import paymentsAdmin from "./admin-payment.registry";
import ads from "./ads.registry";
import article from "./article.registry";
import destination from "./destination.registry";
import paymentsHotel from "./hotel-payment.registry";
import hotels from "./hotel.registry";
import media from "./media.registry";
import propertyClasses from "./property-classes.registry";
import restaurantTable from "./restaurant-table.registry";
import restaurant from "./restaurant.registry";
import restaurantBooking from "./restaurant-booking.registry";
import reviewNrating from "./reviewNrating.registry";
import roomBookings from "./roomBookings.registry";
import rooms from "./rooms.registry";
import system from "./system.registry";
import tasks from "./tasks.registry";
import villas from "./villa.registry";
import wiishlist from "./wishlist.registry";
import auth from "./auth.registry";
import users from "./user.registry";
import siteSettings from "./site-settings.registry";
import affiliate from "./affiliate.registry";
import backup from "./backup.registry";
import amenities from "./amenities.registry";
import staff from "./staff.registry";

export function registerRoutes<T extends OpenAPI>(app: T) {
  return app
    .route("/", index)
    .route("/auth", auth)
    .route("/tasks", tasks)
    .route("/system", system)
    .route("/media", media)
    .route("/property-classes", propertyClasses)
    .route("/hotels", hotels)
    .route("/room-bookings", roomBookings)
    .route("/rooms", rooms)
    .route("/villa", villas)
    .route("/payments-admin", paymentsAdmin)
    .route("/restaurant", restaurant)
    .route("/restaurant-booking", restaurantBooking)
    .route("/article", article)
    .route("/restaurant-table", restaurantTable)
    .route("/review", reviewNrating)
    .route("/ads", ads)
    .route("/wishlist", wiishlist)
    .route("/destination", destination)
    .route("/users", users)
    .route("/site-settings", siteSettings)
    .route("/affiliate", affiliate)
    .route("/amenities", amenities)
    .route("/payments-hotel", paymentsHotel)
    .route("/staff", staff)
    .route("/backup", backup);
}

// For build-time OpenAPI generation only
export function getOpenAPIRouter() {
  return registerRoutes(new OpenAPIHono<APIBindings>().basePath(BASE_PATH));
}

// Type export for RPC - use a separate dry instance to avoid side effects during module evaluation
export const router = new OpenAPIHono<APIBindings>().basePath(BASE_PATH);
// We don't call registerRoutes(router) here at top-level to avoid instantiation issues.
// Instead, we just export the base type.
export type Router = ReturnType<typeof getOpenAPIRouter>;
