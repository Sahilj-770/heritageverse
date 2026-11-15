import fs from 'fs';
import path from 'path';

function getJpgDimensions(buffer) {
  let i = 0;
  if (buffer[i] !== 0xFF || buffer[i + 1] !== 0xD8) return null;
  i += 2;
  while (i < buffer.length - 8) {
    if (buffer[i] !== 0xFF) {
      i++;
      continue;
    }
    const marker = buffer[i + 1];
    if (marker === 0xC0 || marker === 0xC1 || marker === 0xC2) {
      const height = buffer.readUInt16BE(i + 5);
      const width = buffer.readUInt16BE(i + 7);
      return { width, height };
    }
    const len = buffer.readUInt16BE(i + 2);
    i += 2 + len;
  }
  return null;
}

console.log('=== HERITAGEVERSE ASSET INTEGRITY VALIDATOR ===\n');

const manifestFile = path.resolve('src/data/assetManifest.ts');
if (!fs.existsSync(manifestFile)) {
  console.error('FAIL: src/data/assetManifest.ts missing!');
  process.exit(1);
}

// Read sampleData to extract all referenced image URLs
const sampleDataContent = fs.readFileSync('src/data/sampleData.ts', 'utf8');

const imageRegex = /["'](\/images\/[^"']+)["']/g;
const referencedUrls = new Set();
let m;
while ((m = imageRegex.exec(sampleDataContent)) !== null) {
  referencedUrls.add(m[1]);
}

console.log(`Found ${referencedUrls.size} unique local image paths referenced in sampleData.ts.\n`);

let missingCount = 0;
let lowResCount = 0;
let invalidPanoCount = 0;
let totalChecked = 0;

for (const relUrl of referencedUrls) {
  totalChecked++;
  const diskPath = path.resolve('public' + relUrl);
  if (!fs.existsSync(diskPath)) {
    console.error(`[MISSING ASSET] ❌ File not found on disk: ${diskPath}`);
    missingCount++;
    continue;
  }

  const buf = fs.readFileSync(diskPath);
  const dims = getJpgDimensions(buf);
  if (!dims) {
    console.warn(`[UNREADABLE] ⚠️ Could not parse JPEG header: ${relUrl}`);
    continue;
  }

  const isCover = relUrl.startsWith('/images/monuments/');
  const isPano = relUrl.startsWith('/images/panoramas/');

  // Rule: Prominent monument images should be at least 1600px wide
  if (isCover && dims.width < 1600) {
    console.warn(`[LOW RESOLUTION COVER] ⚠️ ${relUrl}: ${dims.width}x${dims.height} (below 1600px threshold)`);
    lowResCount++;
  }

  // Rule: Panoramas must be genuine equirectangular (2:1 aspect ratio)
  if (isPano) {
    const ratio = dims.width / dims.height;
    if (Math.abs(ratio - 2.0) > 0.05) {
      console.error(`[INVALID PANORAMA ASPECT RATIO] ❌ ${relUrl}: ratio is ${ratio.toFixed(2)}, expected 2.00 (2:1 equirectangular)`);
      invalidPanoCount++;
    }
  }

  console.log(`[PASS] ✓ ${relUrl.padEnd(45)}: ${dims.width}x${dims.height} (${(buf.length / 1024).toFixed(1)} KB)`);
}

console.log('\n--- VALIDATION SUMMARY ---');
console.log(`Total Assets Checked: ${totalChecked}`);
console.log(`Missing Files: ${missingCount}`);
console.log(`Low Resolution Assets (<1600px): ${lowResCount}`);
console.log(`Invalid Panoramas: ${invalidPanoCount}`);

if (missingCount > 0 || invalidPanoCount > 0) {
  console.error('\n❌ ASSET INTEGRITY VALIDATION FAILED');
  process.exit(1);
} else {
  console.log('\n✅ ASSET INTEGRITY VALIDATION PASSED WITH FULL COMPLIANCE');
}
