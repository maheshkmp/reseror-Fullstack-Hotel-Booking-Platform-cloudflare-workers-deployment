import { createRouter } from "../lib/setup-api";

import * as handlers from "../handlers/hotel-payment.handler";
import * as routes from "../routes/hotel-payment.routes";

const router = createRouter()
  // Hotel Payments routes
  .openapi(routes.listPaymentsHotelRoute, handlers.listPaymentsHotelsHandler)
  .openapi(routes.getPaymentsHotelRoute, handlers.getPaymentsHotelHandler)
  .openapi(routes.createPaymentsHotelRoute, handlers.createPaymentsHotelHandler)
  .openapi(routes.updatePaymentsHotelRoute, handlers.updatePaymentsHotelHandler)
  .openapi(
    routes.deletePaymentsHotelRoute,
    handlers.deletePaymentsHotelHandler
  )
  .openapi(
    routes.settleAllPaymentsHotelRoute,
    handlers.settleAllPaymentsHandler
  );

export default router;
