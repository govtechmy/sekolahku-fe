import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = process.env.NODE_ENV || "development";
const sourceFile = path.join(__dirname, `../public/robots.${env}.txt`);
const destFile = path.join(__dirname, "../public/robots.txt");
const distDir = path.join(__dirname, "../dist");

try {
  fs.copyFileSync(sourceFile, destFile);
  console.log(`✓ robots.txt updated for ${env} environment`);

  // Remove environment-specific robots files from dist
  const envRobotsFiles = [
    path.join(distDir, "robots.development.txt"),
    path.join(distDir, "robots.production.txt"),
  ];

  envRobotsFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`✓ Removed ${path.basename(file)} from dist`);
    }
  });
} catch (error) {
  console.error(`Error copying robots.txt: ${error.message}`);
  process.exit(1);
}
