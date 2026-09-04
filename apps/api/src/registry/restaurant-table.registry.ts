import { createRouter } from "../lib/setup-api";

import * as handlers from "../handlers/restaurant-table.handlers";
import * as routes from "../routes/restaurant-table.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.update, handlers.update)
  .openapi(routes.remove, handlers.remove);

export default router;
