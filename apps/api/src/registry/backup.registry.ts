import { createRouter } from "../lib/setup-api";

import * as handlers from "../handlers/backup.handlers";
import * as routes from "../routes/backup.routes";

const router = createRouter()
  .openapi(routes.exportBackupRoute, handlers.exportBackupHandler)
  .openapi(routes.restoreBackupRoute, handlers.restoreBackupHandler);

export default router;
