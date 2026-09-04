import { createRouter } from "../lib/setup-api";

import * as handlers from "../handlers/property-classes.handler";
import * as routes from "../routes/property-classes.routes";

const router = createRouter()
  .openapi(
    routes.listAllPropertyClassesRoute,
    handlers.listPropertyClassesHandler
  )
  .openapi(
    routes.createNewPropertyClassRoute,
    handlers.createPropertyClassHandler
  )
  .openapi(routes.updatePropertyClassRoute, handlers.updatePropertyClassHandler)
  .openapi(
    routes.removePropertyClassRoute,
    handlers.removePropertyClassHandler
  );

export default router;
