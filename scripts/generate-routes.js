import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

try {
  // Fix __dirname for ESM
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const INPUT = path.join(__dirname, "..", "school-list.json");
  const OUTPUT = path.join(__dirname, "..", "snap-routes.json");

  function buildRoutes() {
    const data = JSON.parse(fs.readFileSync(INPUT));

    const staticRoutes = ["/", "/home", "/about", "/carian-sekolah", "/siaran"];
    const schoolProfile = "/halaman-sekolah";
    const dynamicRoutes = data.map(
      (school) => `${schoolProfile}/${school.KODSEKOLAH}`,
    );

    const allRoutes = [...staticRoutes, ...dynamicRoutes];

    fs.writeFileSync(OUTPUT, JSON.stringify(allRoutes, null, 2));
    console.log(`✔ Generated`, allRoutes.length, `routes in snap-routes.json`);
  }

  buildRoutes();
} catch (error) {
  const err = JSON.stringify(error);
  if (!err.includes("ENOENT")) {
    console.warn("Error generating routes:", error);
  }
}
