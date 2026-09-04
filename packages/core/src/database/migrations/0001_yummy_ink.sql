ALTER TABLE "hotel_images" DROP CONSTRAINT "hotel_images_room_type_id_room_types_id_fk";
--> statement-breakpoint
DROP INDEX "hotel_images_room_type_idx";--> statement-breakpoint
ALTER TABLE "hotel_images" DROP COLUMN "room_type_id";