import { createRouter } from "../lib/setup-api";

import * as handlers from "../handlers/user.handlers";
import * as routes from "../routes/user.routes";

const router = createRouter()
  // Admin Users routes
  .openapi(routes.exportUsersRoute, handlers.exportUsersHandler)
  .openapi(routes.importUsersRoute, handlers.importUsersHandler)
  .openapi(routes.downloadUserTemplateRoute, handlers.downloadUserTemplateHandler)
  .openapi(routes.listUsersRoute, handlers.listUsersHandler)
  .openapi(routes.getUserRoute, handlers.getUserHandler)
  .openapi(routes.getUserProfileRoute, handlers.getUserProfileHandler)
  .openapi(routes.updateUserRoute, handlers.updateUserHandler)
  .openapi(routes.deleteUserRoute, handlers.deleteUserHandler);

export default router;
