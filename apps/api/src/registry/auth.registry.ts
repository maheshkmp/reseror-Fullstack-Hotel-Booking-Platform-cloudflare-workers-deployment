import { createRouter } from "../lib/setup-api";
import * as handlers from "../handlers/auth.handlers";
import * as routes from "../routes/auth.routes";

const router = createRouter()
  .openapi(routes.test, handlers.test)
  .openapi(routes.verifyEmail, handlers.verifyEmail)
  .openapi(routes.debugOtp, handlers.debugOtp)
  .openapi(routes.switchRole, handlers.switchRole);

export default router;
