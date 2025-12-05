import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT = path.join(__dirname, "..", "school-list.json");
const OUTPUT = path.join(__dirname, "..", "snap-routes.json");

function buildRoutes() {
  const data = JSON.parse(fs.readFileSync(INPUT));

  const staticRoutes = [
    "/",
    "/home",
    "/about",
    "/carian-sekolah",
    "/siaran",
  ]
  const schoolProfile = "/halaman-sekolah"

  const dynamicRoutes = data.map((school) => `${schoolProfile}/${school.KODSEKOLAH}`);

  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  fs.writeFileSync(OUTPUT, JSON.stringify(allRoutes, null, 2));
  console.log(`✔ Generated`, allRoutes.length, `routes in snap-routes.json`);
}

buildRoutes()

// //For multiple langguage path
// const filePath = path.resolve('./school-list.json');
// const schoolList = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
// // console.log(schoolList);

// // Load school IDs from a JSON file
// // Example content: ["ABA0001", "BBA5002", ...]
// const schoolIds = schoolList

// const langs = ["en", "ms", ""];
// const routes = [];

// // static pages
// const staticRoutes = [
//   "/home",
//   "/about",
//   "/carian-sekolah",
//   "/en/home",
//   "/en/about",
//   "/en/carian-sekolah",
//   "/ms/home",
//   "/ms/about",
//   "/ms/carian-sekolah"
// ];

// routes.push("/", ...staticRoutes);

// // dynamic pages
// langs.forEach((lang) => {
//   schoolIds.forEach((id) => {
//     const kod = id.KODSEKOLAH
//     const schoolProfile = "/halaman-sekolah"
//     if(lang){
//       routes.push(`/${lang}${schoolProfile}/${kod}`);
//     }else{
//       routes.push(`${schoolProfile}/${kod}`);
//     }
//   });
// });

// // Write to snap-routes.json
// fs.writeFileSync("snap-routes.json", JSON.stringify(routes, null, 2));
// console.log("✔ Generated snap-routes.json with", routes.length, "routes");
