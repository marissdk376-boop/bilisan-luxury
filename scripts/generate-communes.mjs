/**
 * Run this once to generate communes.ts from wilayas-with-municipalities.json
 * Usage: node scripts/generate-communes.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Wilaya codes covered by Swift Express
const coveredCodes = new Set([2,3,4,5,6,7,9,10,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,34,35,36,39,40,41,42,43,44,45,46,47,48,55]);

const data = JSON.parse(readFileSync(join(root, "wilayas-with-municipalities.json"), "utf8"));

let out = `export const communesByWilaya: Record<string, string[]> = {\n`;

for (const wilaya of data) {
  if (!coveredCodes.has(wilaya.wilayaCode)) continue;

  // Sort communes alphabetically by Arabic name
  const sorted = [...wilaya.communes].sort((a, b) =>
    a.nameAr.localeCompare(b.nameAr, "ar")
  );
  const names = sorted.map(c => `"${c.nameAr}"`).join(", ");
  out += `  "${wilaya.nameAr}": [${names}],\n`;
}

out += `};\n`;

writeFileSync(join(root, "src/data/communes.ts"), out, "utf8");
console.log("✅ communes.ts generated successfully!");
