import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = process.env.NODE_ENV || "staging";
const sourceFile = path.join(__dirname, `../public/robots.${env}.txt`);
const destFile = path.join(__dirname, "../public/robots.txt");

try {
  fs.copyFileSync(sourceFile, destFile);
  console.log(`✓ robots.txt updated for ${env} environment`);
} catch (error) {
  console.error(`Error copying robots.txt: ${error.message}`);
  process.exit(1);
}
