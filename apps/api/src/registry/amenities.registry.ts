import { OpenAPIHono } from "@hono/zod-openapi";

import {
  createNewAmenityHandler,
  listAllAmenitiesHandler,
  removeAmenityHandler,
  updateAmenityHandler,
} from "../handlers/amenities-admin.handler";
import {
  createNewAmenityRoute,
  listAllAmenitiesRoute,
  removeAmenityRoute,
  updateAmenityRoute,
} from "../routes/amenities-admin.routes";
import { APIBindings } from "@/types";

const router = new OpenAPIHono<APIBindings>();

router.openapi(listAllAmenitiesRoute, listAllAmenitiesHandler);
router.openapi(createNewAmenityRoute, createNewAmenityHandler);
router.openapi(updateAmenityRoute, updateAmenityHandler);
router.openapi(removeAmenityRoute, removeAmenityHandler);

export default router;
