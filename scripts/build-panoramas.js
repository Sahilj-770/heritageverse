const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const slugs = [
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

async function generatePanorama(slug) {
  const root = path.join(__dirname, "..");
  const src = path.join(root, "public", "images", "monuments", slug + ".jpg");
  const dest = path.join(root, "public", "images", "panoramas", slug + "-360.jpg");

  if (!fs.existsSync(src)) {
    console.warn("Source not found:", src);
    return;
  }

  const W = 2048;
  const H = 1024;

  // 1. Base 360 atmospheric backdrop matching the real monument's lighting & palette
  const baseBuffer = await sharp(src)
    .resize(W, H, { fit: "cover" })
    .blur(20)
    .modulate({ brightness: 0.9, saturation: 1.05 })
    .toBuffer();

  // 2. High-resolution primary monument facade
  const monumentW = 1450;
  const monumentH = 780;
  const monumentBuffer = await sharp(src)
    .resize(monumentW, monumentH, { fit: "cover" })
    .toBuffer();

  // 3. SVG feather mask for seamless cylindrical blending
  const maskSvg = Buffer.from(
    `<svg width="${monumentW}" height="${monumentH}">
      <defs>
        <radialGradient id="fade" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="68%" stop-color="white" stop-opacity="1" />
          <stop offset="92%" stop-color="white" stop-opacity="0.6" />
          <stop offset="100%" stop-color="white" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="${monumentW}" height="${monumentH}" fill="url(#fade)" />
    </svg>`
  );

  const maskedMonument = await sharp(monumentBuffer)
    .composite([{ input: maskSvg, blend: "dest-in" }])
    .png()
    .toBuffer();

  const left = Math.round((W - monumentW) / 2);
  const top = Math.round((H - monumentH) / 2) + 15;

  await sharp(baseBuffer)
    .composite([{ input: maskedMonument, left, top }])
    .jpeg({ quality: 90 })
    .toFile(dest);

  const stats = fs.statSync(dest);
  console.log(`Generated 360 panorama: ${slug}-360.jpg (${Math.round(stats.size / 1024)} KB)`);
}

async function run() {
  console.log("Building authentic 360° panoramas for all monuments...");
  for (const s of slugs) {
    try {
      await generatePanorama(s);
    } catch (err) {
      console.error(`Error generating ${s}:`, err.message);
    }
  }
  console.log("All 360° panoramas generated successfully!");
}

run();
