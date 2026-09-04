import { $ } from "bun";
import { resolve } from "path";

const BUILDERS_DIR = import.meta.dir;
const TSCONFIG = resolve(BUILDERS_DIR, "tsconfig.types.json");

console.log("📝 Generating type definitions...");

try {
  await $`bun x tsc -p ${TSCONFIG}`;
  console.log("✓ Type definitions generated successfully\n");
} catch (error) {
  console.error("❌ Type generation failed:", error);
  process.exit(1);
}
