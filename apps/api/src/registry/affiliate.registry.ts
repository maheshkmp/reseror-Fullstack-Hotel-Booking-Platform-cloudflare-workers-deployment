import { createRouter } from "../lib/setup-api";

import * as handlers from "../handlers/affiliate.handlers";
import * as routes from "../routes/affiliate.routes";

const router = createRouter()
  .openapi(routes.validatePromoCodeRoute, handlers.validatePromoCodeHandler)
  .openapi(routes.listInfluencersRoute, handlers.listInfluencersHandler)
  .openapi(routes.createInfluencerRoute, handlers.createInfluencerHandler)
  .openapi(routes.listAffiliateUsageRoute, handlers.listAffiliateUsageHandler)
  .openapi(
    routes.payoutAffiliateUsageRoute,
    handlers.payoutAffiliateUsageHandler
  )
  .openapi(routes.exportPayoutsReportRoute, handlers.exportPayoutsReportHandler);

export default router;
