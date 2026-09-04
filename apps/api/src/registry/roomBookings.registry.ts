import { createRouter } from "../lib/setup-api";

import * as handlers from "../handlers/roomBookings.handlers";
import * as routes from "../routes/roomBookings.routes";

const router = createRouter()
  // Rooms routes
  .openapi(
    routes.listRoomBookingsByUserRoute,
    handlers.listRoomBookingsByUserHandler
  )
  .openapi(
    routes.getRoomBookingsStatsByUserRoute,
    handlers.getRoomBookingsStatsByUserHandler
  )
  .openapi(routes.getRoomBookingsStatsRoute, handlers.getRoomBookingsStatsHandler)
  .openapi(routes.listRoomBookingsRoute, handlers.listRoomBookingsHandler)
  .openapi(routes.getRoomBookingRoute, handlers.getRoomBookingHandler)
  .openapi(routes.createRoomBookingRoute, handlers.createRoomBookingHandler)
  .openapi(routes.updateRoomBookingRoute, handlers.updateRoomBookingHandler)
  .openapi(routes.deleteRoomBookingRoute, handlers.deleteRoomBookingHandler);

export default router;
