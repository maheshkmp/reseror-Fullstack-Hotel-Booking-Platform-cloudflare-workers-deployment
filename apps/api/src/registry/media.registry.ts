import { createRouter } from "../lib/setup-api";

import * as handlers from "../handlers/media.handler";
import * as routes from "../routes/media.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.getById, handlers.getById)
  .openapi(routes.create, handlers.create)
  .openapi(routes.update, handlers.update)
  .openapi(routes.remove, handlers.remove);

export default router;
