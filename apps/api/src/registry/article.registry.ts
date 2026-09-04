import { createRouter } from "../lib/setup-api";

import * as handlers from "../handlers/article.handlers";
import * as routes from "../routes/article.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getById, handlers.getOne)
  .openapi(routes.getBySlug, handlers.getBySlug)
  .openapi(routes.incrementReadCount, handlers.incrementReadCount)
  .openapi(routes.update, handlers.patch)
  .openapi(routes.remove, handlers.remove);

export default router;
