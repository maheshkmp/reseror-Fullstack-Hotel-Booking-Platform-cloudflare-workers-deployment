import { createRouter } from "../lib/setup-api";

import * as handlers from "../handlers/system.handlers";
import * as routes from "../routes/system.routes";

const router = createRouter()
  .openapi(routes.checkUserType, handlers.checkUserTypeHandler)
  .openapi(routes.testEmail, handlers.testEmailHandler);

export default router;
