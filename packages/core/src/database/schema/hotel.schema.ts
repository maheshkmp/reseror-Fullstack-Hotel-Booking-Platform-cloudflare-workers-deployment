import { relations, sql } from "drizzle-orm";
import {
  boolean,
  date,
  decimal,
  index,
  integer,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { timestamps } from "./helpers";
import { organization, user } from "./auth.schema";
import { rooms, roomTypes } from "./room.schema";
import { restaurants } from "./restaurant.schema";


export const hotelTypes = pgTable("hotel_types", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }),

  thumbnail: text("thumbnail"),

  ...timestamps,
});

export const propertyClasses = pgTable("property_classes", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }),

  thumbnail: text("thumbnail"),

  ...timestamps,
});

export const amenities = pgTable("amenities", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }),

  icon: text("icon"), // Map to react-icons string e.g., 'FaWifi'

  ...timestamps,
});

// Core Hotel & Property Management Tables
export const hotels = pgTable(
  "hotels",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    organizationId: text("organization_id")
      .references(() => organization.id, { onDelete: "cascade" })
      .notNull(),
    createdBy: text("created_by")
      .references(() => user.id, { onDelete: "set null" })
      .notNull(),

    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    brandName: varchar("brand_name", { length: 255 }),

    // Address fields
    street: varchar("street", { length: 255 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    state: varchar("state", { length: 100 }),
    country: varchar("country", { length: 100 }).notNull(),
    postalCode: varchar("postal_code", { length: 20 }),
    latitude: decimal("latitude", { precision: 10, scale: 8 }),
    longitude: decimal("longitude", { precision: 11, scale: 8 }),
    formattedAddress: text("formatted_address"),

    // Contact info
    phone: varchar("phone", { length: 20 }),
    email: varchar("email", { length: 255 }),
    website: varchar("website", { length: 500 }),

    // Hotel details
    hotelType: text("hotel_type").references(() => hotelTypes.id, {
      onDelete: "set null",
    }),
    starRating: integer("star_rating").default(0),
    propertyClass: text("property_class").references(() => propertyClasses.id, {
      onDelete: "set null",
    }),

    // Operational details
    checkInTime: varchar("check_in_time", { length: 5 }).default("15:00"), // From HH:MM
    checkInEnd: varchar("check_in_end", { length: 5 }), // Until HH:MM
    checkOutStart: varchar("check_out_start", { length: 5 }), // From HH:MM
    checkOutTime: varchar("check_out_time", { length: 5 }).default("11:00"), // Until HH:MM

    status: varchar("status", { length: 50 }).default("pending_approval").notNull(),
    slug: varchar("slug", { length: 255 }).unique(),

    // House Rules & Policy Fields
    minAge: integer("min_age").default(0),
    childrenAllowed: boolean("children_allowed").default(true),
    extraBedsAvailable: boolean("extra_beds_available").default(false),
    extraBedsPolicy: text("extra_beds_policy"),
    
    // Revenue & Commission
    commissionRate: decimal("commission_rate", { precision: 10, scale: 2 }).default("10.00"),

    tags: text("tags").array().default(sql`'{}'::text[]`),

    ...timestamps,
  },
  (table) => [
    index("hotels_city_idx").on(table.city),
    index("hotels_location_idx").on(table.latitude, table.longitude),
    index("hotels_status_idx").on(table.status),
  ]
);

export const hotelAmenities = pgTable(
  "hotel_amenities",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    hotelId: text("hotel_id")
      .references(() => hotels.id, { onDelete: "cascade" })
      .notNull(),

    amenityType: varchar("amenity_type", { length: 100 }).notNull(), // wifi, parking, pool, gym, spa, etc.
    isPopular: boolean("is_popular").default(false),

    ...timestamps,
  },
  (table) => [
    index("hotel_amenities_hotel_idx").on(table.hotelId),
    index("hotel_amenities_type_idx").on(table.amenityType),
  ]
);

export const hotelImages = pgTable(
  "hotel_images",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    hotelId: text("hotel_id")
      .references(() => hotels.id, { onDelete: "cascade" })
      .notNull(),

    imageUrl: text("image_url").notNull(),
    altText: varchar("alt_text", { length: 255 }),
    displayOrder: integer("display_order").default(0),
    isThumbnail: boolean("is_thumbnail").default(false),

    ...timestamps,
  },
  (table) => [
    index("hotel_images_hotel_idx").on(table.hotelId),
    // index("hotel_images_room_type_idx").on(table.roomTypeId),
    index("hotel_images_display_order_idx").on(table.displayOrder),
  ]
);

export const hotelPolicies = pgTable(
  "hotel_policies",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    hotelId: text("hotel_id")
      .references(() => hotels.id, { onDelete: "cascade" })
      .notNull(),
    policyType: varchar("policy_type", { length: 100 }).notNull(), // cancellation, pet, smoking, etc.
    policyText: text("policy_text").notNull(),

    effectiveDate: date("effective_date").defaultNow().notNull(),
    isActive: boolean("is_active").default(true).notNull(),

    ...timestamps,
  },
  (table) => [
    index("hotel_policies_hotel_idx").on(table.hotelId),
    index("hotel_policies_type_idx").on(table.policyType),
  ]
);

export const hotelNearbyPois = pgTable(
  "hotel_nearby_pois",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    hotelId: text("hotel_id")
      .references(() => hotels.id, { onDelete: "cascade" })
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    type: varchar("type", { length: 100 }).notNull(), // attraction, transit, dining, etc.
    distanceText: varchar("distance_text", { length: 100 }), // e.g., "500m"
    durationText: varchar("duration_text", { length: 100 }), // e.g., "10 mins walk"
    latitude: decimal("latitude", { precision: 10, scale: 8 }),
    longitude: decimal("longitude", { precision: 11, scale: 8 }),
    isActive: boolean("is_active").default(true).notNull(),

    ...timestamps,
  },
  (table) => [
    index("hotel_nearby_pois_hotel_idx").on(table.hotelId),
    index("hotel_nearby_pois_type_idx").on(table.type),
  ]
);

// Relation Definitions

export const hotelRelations = relations(hotels, ({ many, one }) => ({
  amenities: many(hotelAmenities),
  roomTypes: many(roomTypes),
  rooms: many(rooms),
  restaurants: many(restaurants),

  images: many(hotelImages),
  policies: many(hotelPolicies),
  nearbyPois: many(hotelNearbyPois),
  languages: many(hotelLanguages),
  safetyFeatures: many(hotelSafetyFeatures),
  sustainability: many(hotelSustainability),
  transportParking: many(hotelTransportParking),
  paymentMethods: many(hotelPaymentMethods),
  faqs: many(hotelFaqs),
  commonAreas: many(hotelCommonAreas),
  hotelType: one(hotelTypes, {
    fields: [hotels.hotelType],
    references: [hotelTypes.id],
  }),
  propertyClass: one(propertyClasses, {
    fields: [hotels.propertyClass],
    references: [propertyClasses.id],
  }),
  user: one(user, {
    fields: [hotels.createdBy],
    references: [user.id],
  }),
}));

export const hotelAmenitiesRelations = relations(hotelAmenities, ({ one }) => ({
  hotel: one(hotels, {
    fields: [hotelAmenities.hotelId],
    references: [hotels.id],
  }),
}));

export const hotelImagesRelations = relations(hotelImages, ({ one }) => ({
  hotel: one(hotels, {
    fields: [hotelImages.hotelId],
    references: [hotels.id],
  }),
}));

export const hotelPoliciesRelations = relations(hotelPolicies, ({ one }) => ({
  hotel: one(hotels, {
    fields: [hotelPolicies.hotelId],
    references: [hotels.id],
  }),
}));

export const hotelNearbyPoisRelations = relations(
  hotelNearbyPois,
  ({ one }) => ({
    hotel: one(hotels, {
      fields: [hotelNearbyPois.hotelId],
      references: [hotels.id],
    }),
  })
);

export const hotelLanguages = pgTable(
  "hotel_languages",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    hotelId: text("hotel_id")
      .references(() => hotels.id, { onDelete: "cascade" })
      .notNull(),
    languageCode: varchar("language_code", { length: 10 }).notNull(), // ISO 639-1

    ...timestamps,
  },
  (table) => [
    index("hotel_languages_hotel_idx").on(table.hotelId),
    index("hotel_languages_code_idx").on(table.languageCode),
  ]
);

export const hotelSafetyFeatures = pgTable(
  "hotel_safety_features",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    hotelId: text("hotel_id")
      .references(() => hotels.id, { onDelete: "cascade" })
      .notNull(),
    featureType: varchar("feature_type", { length: 100 }).notNull(), // smoke_alarm, fire_extinguisher, etc.

    ...timestamps,
  },
  (table) => [
    index("hotel_safety_features_hotel_idx").on(table.hotelId),
    index("hotel_safety_features_type_idx").on(table.featureType),
  ]
);

export const hotelLanguagesRelations = relations(hotelLanguages, ({ one }) => ({
  hotel: one(hotels, {
    fields: [hotelLanguages.hotelId],
    references: [hotels.id],
  }),
}));

export const hotelSafetyFeaturesRelations = relations(
  hotelSafetyFeatures,
  ({ one }) => ({
    hotel: one(hotels, {
      fields: [hotelSafetyFeatures.hotelId],
      references: [hotels.id],
    }),
  })
);

export const hotelSustainability = pgTable(
  "hotel_sustainability",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    hotelId: text("hotel_id")
      .references(() => hotels.id, { onDelete: "cascade" })
      .notNull(),
    initiativeType: varchar("initiative_type", { length: 100 }).notNull(), // e.g., plastic_free, water_conservation

    ...timestamps,
  },
  (table) => [
    index("hotel_sustainability_hotel_idx").on(table.hotelId),
    index("hotel_sustainability_type_idx").on(table.initiativeType),
  ]
);

export const hotelTransportParking = pgTable(
  "hotel_transport_parking",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    hotelId: text("hotel_id")
      .references(() => hotels.id, { onDelete: "cascade" })
      .notNull(),
    featureType: varchar("feature_type", { length: 100 }).notNull(), // e.g., free_onsite_parking, ev_charging

    ...timestamps,
  },
  (table) => [
    index("hotel_transport_parking_hotel_idx").on(table.hotelId),
    index("hotel_transport_parking_type_idx").on(table.featureType),
  ]
);

export const hotelSustainabilityRelations = relations(
  hotelSustainability,
  ({ one }) => ({
    hotel: one(hotels, {
      fields: [hotelSustainability.hotelId],
      references: [hotels.id],
    }),
  })
);

export const hotelTransportParkingRelations = relations(
  hotelTransportParking,
  ({ one }) => ({
    hotel: one(hotels, {
      fields: [hotelTransportParking.hotelId],
      references: [hotels.id],
    }),
  })
);

export const hotelPaymentMethods = pgTable(
  "hotel_payment_methods",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    hotelId: text("hotel_id")
      .references(() => hotels.id, { onDelete: "cascade" })
      .notNull(),
    cardType: varchar("card_type", { length: 50 }).notNull(), // visa, mastercard, amex, etc.

    ...timestamps,
  },
  (table) => [
    index("hotel_payment_methods_hotel_idx").on(table.hotelId),
  ]
);

export const hotelFaqs = pgTable(
  "hotel_faqs",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    hotelId: text("hotel_id")
      .references(() => hotels.id, { onDelete: "cascade" })
      .notNull(),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    displayOrder: integer("display_order").default(0).notNull(),

    ...timestamps,
  },
  (table) => [
    index("hotel_faqs_hotel_idx").on(table.hotelId),
  ]
);

export const hotelCommonAreas = pgTable(
  "hotel_common_areas",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    hotelId: text("hotel_id")
      .references(() => hotels.id, { onDelete: "cascade" })
      .notNull(),
    areaType: varchar("area_type", { length: 100 }).notNull(), // kitchen, lounge, terrace, etc.

    ...timestamps,
  },
  (table) => [
    index("hotel_common_areas_hotel_idx").on(table.hotelId),
  ]
);

export const hotelPaymentMethodsRelations = relations(
  hotelPaymentMethods,
  ({ one }) => ({
    hotel: one(hotels, {
      fields: [hotelPaymentMethods.hotelId],
      references: [hotels.id],
    }),
  })
);

export const hotelFaqsRelations = relations(hotelFaqs, ({ one }) => ({
  hotel: one(hotels, {
    fields: [hotelFaqs.hotelId],
    references: [hotels.id],
  }),
}));

export const hotelCommonAreasRelations = relations(
  hotelCommonAreas,
  ({ one }) => ({
    hotel: one(hotels, {
      fields: [hotelCommonAreas.hotelId],
      references: [hotels.id],
    }),
  })
);
