import { createRouter } from "../lib/setup-api";

import * as handlers from "../handlers/reviewNrating.handlers";
import * as routes from "../routes/reviewNrating.routes";

const router = createRouter()
  .openapi(routes.listByHotelId, handlers.listByHotelId)
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getById, handlers.getOne)
  .openapi(routes.update, handlers.patch)
  .openapi(routes.remove, handlers.remove);

export default router;
