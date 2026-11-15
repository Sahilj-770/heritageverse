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

const sampleDataPath = path.resolve('src/data/sampleData.ts');
const content = fs.readFileSync(sampleDataPath, 'utf8');

// Parse monuments carefully from sampleData
const monuments = [];
const lines = content.split('\n');
let curMon = null;
let curScene = null;
let inTourScenes = false;

for (let line of lines) {
  const trimmed = line.trim();
  if (trimmed.startsWith('id: "m-')) {
    curMon = { id: trimmed.match(/id:\s*"([^"]+)"/)[1], tourScenes: [] };
    monuments.push(curMon);
    inTourScenes = false;
  }
  if (!curMon) continue;

  if (trimmed.startsWith('slug: "')) curMon.slug = trimmed.match(/slug:\s*"([^"]+)"/)[1];
  if (!inTourScenes && trimmed.startsWith('name: "')) curMon.name = trimmed.match(/name:\s*"([^"]+)"/)[1];
  if (trimmed.startsWith('coverImage: "')) curMon.coverImage = trimmed.match(/coverImage:\s*"([^"]+)"/)[1];

  if (trimmed.startsWith('tourScenes: [')) inTourScenes = true;
  if (inTourScenes && trimmed.startsWith('{') && !curScene) {
    curScene = {};
  }
  if (curScene) {
    if (trimmed.startsWith('id: "')) curScene.id = trimmed.match(/id:\s*"([^"]+)"/)[1];
    if (trimmed.startsWith('name: "')) curScene.name = trimmed.match(/name:\s*"([^"]+)"/)[1];
    if (trimmed.startsWith('panoramaUrl: "')) curScene.panoramaUrl = trimmed.match(/panoramaUrl:\s*"([^"]+)"/)[1];
    if (trimmed.startsWith('thumbnailUrl: "')) curScene.thumbnailUrl = trimmed.match(/thumbnailUrl:\s*"([^"]+)"/)[1];
    if (trimmed.startsWith('}')) {
      if (curScene.panoramaUrl) curMon.tourScenes.push(curScene);
      curScene = null;
    }
  }
}

function analyzeImage(urlPath) {
  if (!urlPath) return { exists: false, error: 'No URL provided' };
  const localRel = 'public' + (urlPath.startsWith('/') ? urlPath : '/' + urlPath);
  const localAbs = path.resolve(localRel);
  if (!fs.existsSync(localAbs)) {
    return { exists: false, path: localRel, error: 'File not found on disk' };
  }
  const buf = fs.readFileSync(localAbs);
  const dims = getJpgDimensions(buf) || { width: 0, height: 0 };
  const ratio = dims.height ? (dims.width / dims.height).toFixed(2) : '0';
  return {
    exists: true,
    path: localRel,
    width: dims.width,
    height: dims.height,
    aspectRatio: ratio,
    sizeBytes: buf.length,
    sizeKB: (buf.length / 1024).toFixed(1),
  };
}

console.log(`=== HERITAGEVERSE IMAGE ASSET AUDIT REPORT ===\n`);
console.log(`Total Monuments Registered: ${monuments.length}\n`);

const fullAudit = monuments.map(m => {
  const coverAudit = analyzeImage(m.coverImage);
  const scenesAudit = m.tourScenes.map(s => ({
    sceneId: s.id,
    sceneName: s.name,
    panorama: analyzeImage(s.panoramaUrl),
    thumbnail: analyzeImage(s.thumbnailUrl),
  }));
  return {
    id: m.id,
    slug: m.slug,
    name: m.name,
    coverImage: coverAudit,
    tourScenes: scenesAudit,
  };
});

fs.writeFileSync('scripts/audit_results.json', JSON.stringify(fullAudit, null, 2));

console.log('| Monument | Slug | Cover Dimensions | Cover Size | Tour Scenes | Panorama Dims |');
console.log('|---|---|---|---|---|---|');
for (const a of fullAudit) {
  const scenePano = a.tourScenes[0] ? `${a.tourScenes[0].panorama.width}x${a.tourScenes[0].panorama.height} (${a.tourScenes[0].panorama.sizeKB} KB)` : 'None';
  console.log(`| ${a.name} | ${a.slug} | ${a.coverImage.width}x${a.coverImage.height} (${a.coverImage.aspectRatio}) | ${a.coverImage.sizeKB} KB | ${a.tourScenes.length} | ${scenePano} |`);
}
