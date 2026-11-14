const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "src", "data", "sampleData.ts");
let content = fs.readFileSync(file, "utf8");

const monuments = [
  "taj-mahal",
  "qutub-minar",
  "red-fort",
  "amer-fort",
  "hawa-mahal",
  "konark-sun-temple",
  "victoria-memorial",
  "hampi-virupaksha",
  "brihadisvara-temple",
  "meenakshi-temple",
  "khajuraho",
  "sanchi-stupa",
  "charminar",
  "ellora-caves",
  "gateway-of-india",
  "shaniwar-wada",
  "aga-khan-palace"
];

for (const slug of monuments) {
  // Replace the panoramaUrl within this monument's block
  const pattern = new RegExp(`(slug:\\s*"${slug}"[\\s\\S]*?panoramaUrl:\\s*")[^"]+(")`, "g");
  content = content.replace(pattern, `$1/images/panoramas/${slug}-360.jpg$2`);
}

fs.writeFileSync(file, content, "utf8");
console.log("Updated sampleData.ts with local 360 panorama URLs!");
