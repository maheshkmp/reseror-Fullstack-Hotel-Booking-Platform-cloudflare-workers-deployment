import { createRouter } from "../lib/setup-api";

import * as handlers from "../handlers/hotel.handler";
import * as routes from "../routes/hotel.routes";

import * as imageHandlers from "../handlers/hotel-images.handler";
import * as imageRoutes from "../routes/hotel-images.routes";

import * as amenitiesHandlers from "../handlers/amenities.handler";
import * as amenitiesRoutes from "../routes/amenities.routes";

import * as policiesHandlers from "../handlers/policies.handler";
import * as policiesRoutes from "../routes/policies.routes";

import * as nearbyPoisHandlers from "../handlers/nearby-pois.handler";
import * as nearbyPoisRoutes from "../routes/nearby-pois.routes";

import * as languagesHandlers from "../handlers/languages.handler";
import * as languagesRoutes from "../routes/languages.routes";

import * as safetyHandlers from "../handlers/safety.handler";
import * as safetyRoutes from "../routes/safety.routes";

import * as sustainabilityHandlers from "../handlers/sustainability.handler";
import * as sustainabilityRoutes from "../routes/sustainability.routes";

import * as transportHandlers from "../handlers/transport.handler";
import * as transportRoutes from "../routes/transport.routes";

import * as faqsHandlers from "../handlers/faqs.handler";
import * as faqsRoutes from "../routes/faqs.routes";

import * as paymentMethodsHandlers from "../handlers/payment-methods.handler";
import * as paymentMethodsRoutes from "../routes/payment-methods.routes";

import * as commonAreasHandlers from "../handlers/common-areas.handler";
import * as commonAreasRoutes from "../routes/common-areas.routes";

import { cacheMiddleware } from "../lib/cache";
import { httpCacheMiddleware } from "../lib/http-cache";

const router = createRouter();

// Apply caching to read-heavy public/semi-public routes
router.use("/hotels/list", cacheMiddleware(60));
router.use("/hotels/get/:id", cacheMiddleware(60));

// Set HTTP Cache-Control headers for browser/CDN caching
router.use("/hotels/list", httpCacheMiddleware(60));
router.use("/hotels/get/:id", httpCacheMiddleware(60));

router
  .openapi(routes.exportHotelsRoute, handlers.exportHotelsHandler)
  .openapi(routes.importHotelsRoute, handlers.importHotelsHandler)
  .openapi(routes.downloadHotelTemplateRoute, handlers.downloadHotelTemplateHandler)
  .openapi(routes.removeHotelRoute, handlers.removeHotelHandler)
  .openapi(
    imageRoutes.getAllHotelImagesRoute,
    imageHandlers.getAllHotelImagesHandler
  )
  .openapi(routes.listAllHotelTypesRoute, handlers.listHotelTypesHandler)
  .openapi(routes.createNewHotelTypeRoute, handlers.createHotelTypeHandler)
  .openapi(routes.updateHotelTypeRoute, handlers.updateHotelTypeHandler)
  .openapi(routes.removeHotelTypeRoute, handlers.removeHotelTypeHandler)
  .openapi(routes.listAllHotelsRoute, handlers.listAllHotelsHandler)
  .openapi(routes.createNewHotelRoute, handlers.createNewHotelHandler)
  .openapi(routes.updateHotelRoute, handlers.updateHotelHandler)
  .openapi(
    routes.createNewHotelRouteByAdmin,
    handlers.createNewHotelByAdminHandler
  )
  .openapi(routes.getMyHotelRoute, handlers.getMyHotelHandler)
  .openapi(routes.getHotelRoomTypesRoute, handlers.getHotelRoomTypesHandler)
  .openapi(routes.getHotelRoomsRoute, handlers.getHotelRoomsHandler)
  .openapi(routes.getHotelByIdRoute, handlers.getHotelByIdHandler)
  .openapi(
    routes.getHotelPerformanceRoute,
    handlers.getHotelPerformanceHandler
  )

  // Hotel Images Management

  .openapi(imageRoutes.getHotelImagesRoute, imageHandlers.getHotelImagesHandler)
  .openapi(
    imageRoutes.addNewHotelImagesRoute,
    imageHandlers.addNewHotelImagesHandler
  )
  .openapi(
    imageRoutes.updateHotelImageRoute,
    imageHandlers.updateHotelImageHandler
  )
  .openapi(
    imageRoutes.removeHotelImageRoute,
    imageHandlers.removeHotelImageHandler
  )

  // Hotel amentities
  .openapi(
    amenitiesRoutes.getHotelAmenitiesRoute,
    amenitiesHandlers.getHotelAmenitiesHandler
  )
  .openapi(
    amenitiesRoutes.upsertAmenitiesToHotelRoute,
    amenitiesHandlers.upsertAmenitiesToHotelHandler
  )

  // Hotel policies
  .openapi(
    policiesRoutes.getHotelPoliciesRoute,
    policiesHandlers.getHotelPoliciesHandler
  )
  .openapi(
    policiesRoutes.upsertPoliciesToHotelRoute,
    policiesHandlers.upsertPoliciesToHotelHandler
  )

  // Hotel Nearby POIs
  .openapi(
    nearbyPoisRoutes.getHotelNearbyPoisRoute,
    nearbyPoisHandlers.getHotelNearbyPoisHandler
  )
  .openapi(
    nearbyPoisRoutes.upsertNearbyPoisToHotelRoute,
    nearbyPoisHandlers.upsertNearbyPoisToHotelHandler
  )
  .openapi(
    nearbyPoisRoutes.updateHotelNearbyPoiRoute,
    nearbyPoisHandlers.updateHotelNearbyPoiHandler
  )
  .openapi(
    nearbyPoisRoutes.removeHotelNearbyPoiRoute,
    nearbyPoisHandlers.removeHotelNearbyPoiHandler
  )

  // Hotel Languages
  .openapi(
    languagesRoutes.getHotelLanguagesRoute,
    languagesHandlers.getHotelLanguagesHandler
  )
  .openapi(
    languagesRoutes.upsertLanguagesToHotelRoute,
    languagesHandlers.upsertLanguagesToHotelHandler
  )
  .openapi(
    languagesRoutes.removeHotelLanguageRoute,
    languagesHandlers.removeHotelLanguageHandler
  )

  // Hotel Safety Features
  .openapi(
    safetyRoutes.getHotelSafetyFeaturesRoute,
    safetyHandlers.getHotelSafetyFeaturesHandler
  )
  .openapi(
    safetyRoutes.upsertSafetyToHotelRoute,
    safetyHandlers.upsertSafetyToHotelHandler
  )
  .openapi(
    safetyRoutes.removeHotelSafetyRoute,
    safetyHandlers.removeHotelSafetyHandler
  )
  
  // Hotel Sustainability
  .openapi(
    sustainabilityRoutes.getHotelSustainabilityRoute,
    sustainabilityHandlers.getHotelSustainabilityHandler
  )
  .openapi(
    sustainabilityRoutes.addHotelSustainabilityRoute,
    sustainabilityHandlers.addHotelSustainabilityHandler
  )

  // Hotel Transport
  .openapi(
    transportRoutes.getHotelTransportRoute,
    transportHandlers.getHotelTransportHandler
  )
  .openapi(
    transportRoutes.addHotelTransportRoute,
    transportHandlers.addHotelTransportHandler
  )

  // Hotel FAQs
  .openapi(
    faqsRoutes.getHotelFaqsRoute,
    faqsHandlers.getHotelFaqsHandler
  )
  .openapi(
    faqsRoutes.upsertFaqsToHotelRoute,
    faqsHandlers.upsertFaqsToHotelHandler
  )

  // Hotel Payment Methods
  .openapi(
    paymentMethodsRoutes.getHotelPaymentMethodsRoute,
    paymentMethodsHandlers.getHotelPaymentMethodsHandler
  )
  .openapi(
    paymentMethodsRoutes.upsertPaymentMethodsToHotelRoute,
    paymentMethodsHandlers.upsertPaymentMethodsToHotelHandler
  )

  // Hotel Common Areas
  .openapi(
    commonAreasRoutes.getHotelCommonAreasRoute,
    commonAreasHandlers.getHotelCommonAreasHandler
  )
  .openapi(
    commonAreasRoutes.upsertCommonAreasToHotelRoute,
    commonAreasHandlers.upsertCommonAreasToHotelHandler
  );

export default router;
