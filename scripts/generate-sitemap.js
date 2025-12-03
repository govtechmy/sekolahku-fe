import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Force load .env.development
// const envFile = path.join(__dirname, "..", ".env.development");
// console.log("Loading env file:", envFile);

// prod
dotenv.config()
// dev
// dotenv.config({ path: envFile });

// Test output
console.log("Loaded VITE_DOMAIN_NAME:", process.env.VITE_DOMAIN_NAME);

function generateSitemap() {
  const baseUrl = process.env.VITE_DOMAIN_NAME;

  if (!baseUrl) {
    console.error("ERROR: VITE_DOMAIN_NAME is missing from .env.development");
    process.exit(1);
  }

  const routes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "snap-routes.json"), "utf8")
  );

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  routes.forEach((route) => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${route}</loc>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;

  fs.writeFileSync(path.join(__dirname, "..", "public", "sitemap.xml"), xml);

  console.log("✔ Sitemap generated successfully!");
}

generateSitemap()
