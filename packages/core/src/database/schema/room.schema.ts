import { sql } from "drizzle-orm";
import {
  decimal,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";
import { boolean, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { timestamps } from "./helpers";
import { hotelImages, hotels } from "./hotel.schema";


export const roomTypes = pgTable(
  "room_types",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    hotelId: text("hotel_id")
      .references(() => hotels.id, { onDelete: "cascade" })
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    price: decimal("price", { precision: 10, scale: 2 }),
    // Occupancy details
    baseOccupancy: integer("base_occupancy").default(2).notNull(),
    maxOccupancy: integer("max_occupancy").default(2).notNull(),
    extraBedCapacity: integer("extra_bed_capacity").default(0),

    // Bed configuration (stored as JSON for flexibility)
    bedConfiguration: jsonb("bed_configuration"), // {king: 1, queen: 0, twin: 0, sofa_bed: 0}

    // Room details
    roomSizeSqm: decimal("room_size_sqm", { precision: 6, scale: 2 }),
    viewType: varchar("view_type", { length: 50 }),

    status: boolean("is_active").default(true).notNull(),
    isSmoking: boolean("is_smoking").default(false).notNull(),
    note: text("note"),

    ...timestamps,
  },
  (table) => [index("room_types_hotel_idx").on(table.hotelId)]
);

export const roomTypeImages = pgTable(
  "room_type_images",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    roomTypeId: text("room_type_id").references(() => roomTypes.id, {
      onDelete: "cascade",
    }),
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
    index("roomType_images_hotel_idx").on(table.hotelId),
    index("roomType_images_room_type_idx").on(table.roomTypeId),
    index("roomType_images_display_order_idx").on(table.displayOrder),
  ]
);

export const roomTypeImagesRelations = relations(roomTypeImages, ({ one }) => ({
  roomType: one(roomTypes, {
    fields: [roomTypeImages.roomTypeId],
    references: [roomTypes.id],
  }),
  hotel: one(hotels, {
    fields: [roomTypeImages.hotelId],
    references: [hotels.id],
  }),
}));

export const roomTypeAmenities = pgTable(
  "room_type_amenities",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    roomTypeId: text("room_type_id")
      .references(() => roomTypes.id, { onDelete: "cascade" })
      .notNull(),

    amenityType: varchar("amenity_type", { length: 100 }).notNull(), // ac, tv, wifi, minibar, etc.

    ...timestamps,
  },
  (table) => [index("room_type_amenities_room_type_idx").on(table.roomTypeId)]
);

export const rooms = pgTable(
  "rooms",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    hotelId: text("hotel_id")
      .references(() => hotels.id, { onDelete: "cascade" })
      .notNull(),
    roomTypeId: text("room_type_id")
      .references(() => roomTypes.id, { onDelete: "cascade" })
      .notNull(),
    roomNumber: varchar("room_number", { length: 20 }).notNull(),
    floorNumber: integer("floor_number"),
    isAccessible: boolean("is_accessible").default(false),
    status: varchar("status", { length: 50 }).default("available").notNull(),
    lastCleanedAt: timestamp("last_cleaned_at"),

    ...timestamps,
  },
  (table) => [
    index("rooms_hotel_idx").on(table.hotelId),
    uniqueIndex("rooms_hotel_room_number_idx").on(
      table.hotelId,
      table.roomNumber
    ),
    index("rooms_status_idx").on(table.status),
  ]
);

export const roomTypesRelations = relations(roomTypes, ({ one, many }) => ({
  hotel: one(hotels, { fields: [roomTypes.hotelId], references: [hotels.id] }),
  amenities: many(roomTypeAmenities),
  rooms: many(rooms),
  images: many(roomTypeImages),
}));

export const roomTypeAmenitiesRelations = relations(
  roomTypeAmenities,
  ({ one }) => ({
    roomType: one(roomTypes, {
      fields: [roomTypeAmenities.roomTypeId],
      references: [roomTypes.id],
    }),
  })
);

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  hotel: one(hotels, { fields: [rooms.hotelId], references: [hotels.id] }),
  roomType: one(roomTypes, {
    fields: [rooms.roomTypeId],
    references: [roomTypes.id],
  }),
}));
