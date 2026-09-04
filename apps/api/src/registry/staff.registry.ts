import { createRouter } from "../lib/setup-api";
import * as handlers from "../handlers/staff.handlers";
import * as routes from "../routes/staff.routes";

const router = createRouter()
  .openapi(routes.listStaffRoute, handlers.listStaffHandler)
  .openapi(routes.createStaffRoute, handlers.createStaffHandler)
  .openapi(routes.updateStaffRoute, handlers.updateStaffHandler)
  .openapi(routes.deleteStaffRoute, handlers.deleteStaffHandler);

export default router;
