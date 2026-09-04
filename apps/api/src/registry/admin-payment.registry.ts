import { createRouter } from "../lib/setup-api";

import * as handlers from "../handlers/admin-payment.handler";
import * as routes from "../routes/admin-payment.routes";

const router = createRouter()
  // Admin Payments routes
  .openapi(routes.listPaymentsAdminRoute, handlers.listPaymentsAdminsHandler)
  .openapi(routes.getPaymentsAdminRoute, handlers.getPaymentsAdminHandler)
  .openapi(routes.createPaymentsAdminRoute, handlers.createPaymentsAdminHandler)
  .openapi(routes.updatePaymentsAdminRoute, handlers.updatePaymentsAdminHandler)
  .openapi(
    routes.deletePaymentsAdminRoute,
    handlers.deletePaymentsAdminHandler
  );

export default router;
