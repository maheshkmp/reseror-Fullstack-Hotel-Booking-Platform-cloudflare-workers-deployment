import postgres from "postgres";

const sql = postgres("postgresql://neondb_owner:npg_dPAj4DR8gFNf@ep-lucky-tree-a408yo23-pooler.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require");

async function run() {
  try {
    await sql.unsafe(`
ALTER TABLE "restaurants" ADD COLUMN IF NOT EXISTS "total_seats" integer;
ALTER TABLE "restaurants" ADD COLUMN IF NOT EXISTS "allocated_seats" integer;
ALTER TABLE "restaurants" ADD COLUMN IF NOT EXISTS "breakfast_price" numeric(10, 2);
ALTER TABLE "restaurants" ADD COLUMN IF NOT EXISTS "lunch_price" numeric(10, 2);
ALTER TABLE "restaurants" ADD COLUMN IF NOT EXISTS "dinner_price" numeric(10, 2);
ALTER TABLE "restaurants" ADD COLUMN IF NOT EXISTS "buffet_price" numeric(10, 2);
ALTER TABLE "restaurants" ADD COLUMN IF NOT EXISTS "cuisine_type" varchar(255);
ALTER TABLE "restaurants" ADD COLUMN IF NOT EXISTS "dress_code" varchar(150);
ALTER TABLE "restaurants" ADD COLUMN IF NOT EXISTS "menu_url" varchar(500);
    `);
    console.log('Success!');
  } catch (e) {
    console.error('Failed:', e);
  }
  process.exit(0);
}
run();
