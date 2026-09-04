import { createRouter } from "../lib/setup-api";

import * as imageHandlers from "../handlers/villa-images.handler";
import * as imageRoutes from "../routes/villa-images.routes";
import * as handlers from "../handlers/villa.handler";
import * as routes from "../routes/villa.routes";

const router = createRouter()


  // Villa Type Images routes
  .openapi(imageRoutes.getVillaImagesRoute, imageHandlers.getVillaImagesHandler)
  .openapi(imageRoutes.addVillaImageRoute, imageHandlers.addVillaImageHandler)
  .openapi(
    imageRoutes.updateVillaImageRoute,
    imageHandlers.updateVillaImageHandler
  )
  .openapi(
    imageRoutes.removeVillaImageRoute,
    imageHandlers.removeVillaImageHandler
  )

  // Villas routes
  .openapi(routes.listVillasRoute, handlers.listVillasHandler)
  .openapi(routes.getVillaRoute, handlers.getVillaHandler)
  .openapi(routes.createVillaRoute, handlers.createVillaHandler)
  .openapi(routes.updateVillaRoute, handlers.updateVillaHandler)
  .openapi(routes.deleteVillaRoute, handlers.deleteVillaHandler)

export default router;
