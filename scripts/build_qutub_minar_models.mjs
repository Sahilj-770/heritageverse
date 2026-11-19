/**
 * HeritageVerse — Qutub Minar Architectural 3D Asset Pipeline
 * Converts and textures qutub-minar-tower.obj into museum-grade WebGL PBR GLB models.
 */

import fs from "fs";
import path from "path";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import sharp from "sharp";

// ─── NODE.JS POLYFILLS FOR GLTFEXPORTER ─────────────────────────────────────
if (typeof global.FileReader === "undefined") {
  global.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = buf;
        if (this.onloadend) this.onloadend();
      });
    }
    readAsDataURL(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = `data:application/octet-stream;base64,${Buffer.from(buf).toString("base64")}`;
        if (this.onloadend) this.onloadend();
      });
    }
  };
}

global.ImageData = class ImageData {
  constructor(data, width, height) {
    this.data = data;
    this.width = width;
    this.height = height;
  }
};

class NodeFakeCanvas {
  constructor(w = 1, h = 1) {
    this.width = w;
    this.height = h;
    this._data = null;
  }
  getContext(type) {
    return {
      putImageData: (imgData) => {
        this._data = imgData.data;
        this.width = imgData.width;
        this.height = imgData.height;
      },
      translate: () => {},
      scale: () => {},
      drawImage: () => {},
    };
  }
  toBlob(callback, mimeType) {
    sharp(Buffer.from(this._data), {
      raw: { width: this.width, height: this.height, channels: 4 },
    })
      .png({ compressionLevel: 9 })
      .toBuffer()
      .then((pngBuf) => {
        callback(new Blob([pngBuf], { type: "image/png" }));
      })
      .catch((err) => {
        console.error("Canvas toBlob error:", err);
        callback(new Blob([this._data], { type: "image/png" }));
      });
  }
}

if (typeof global.document === "undefined") {
  global.document = {
    createElement(tag) {
      if (tag === "canvas") return new NodeFakeCanvas(256, 256);
      return {};
    },
  };
}

const OBJ_SOURCE_PATH = "c:/Users/SAHIL/Downloads/qutub-minar-tower.obj";
const OUT_DIR_EXTERIOR = "public/models/monuments/qutub-minar/exterior";
const OUT_DIR_HISTORICAL = "public/models/monuments/qutub-minar/historical";

fs.mkdirSync(OUT_DIR_EXTERIOR, { recursive: true });
fs.mkdirSync(OUT_DIR_HISTORICAL, { recursive: true });

// ─── PROCEDURAL PBR TEXTURE GENERATORS ───────────────────────────────────────

/** 1. Delhi Quartzite Flagstone: Soft buff-grey paving for the plinth & courtyard */
function generateQuartziteFlagstonePixels(w = 512, h = 512) {
  const data = new Uint8Array(w * h * 4);
  const bw = 128, bh = 64;
  for (let y = 0; y < h; y++) {
    const row = Math.floor(y / bh);
    const xOff = (row % 2) * (bw / 2);
    const dy = Math.min(y % bh, bh - 1 - (y % bh));
    for (let x = 0; x < w; x++) {
      const col = Math.floor((x + xOff) / bw);
      const dx = Math.min((x + xOff) % bw, bw - 1 - ((x + xOff) % bw));
      const dist = Math.min(dx, dy);
      const blockHash = ((row * 139 + col * 277) % 11) - 5;
      const idx = (y * w + x) * 4;

      const blend = Math.min(1.0, dist / 2.0);
      const baseR = 196 + blockHash * 2;
      const baseG = 184 + blockHash * 2;
      const baseB = 166 + blockHash;
      const mortR = 145, mortG = 138, mortB = 126;

      data[idx] = Math.round(mortR + (baseR - mortR) * blend);
      data[idx + 1] = Math.round(mortG + (baseG - mortG) * blend);
      data[idx + 2] = Math.round(mortB + (baseB - mortB) * blend);
      data[idx + 3] = 255;
    }
  }
  return data;
}

/** 2. Variegated Red & Buff Sandstone: Warm fluted ashlar stone for lower storeys */
function generateVariegatedSandstonePixels(w = 512, h = 512) {
  const data = new Uint8Array(w * h * 4);
  const bw = 256, bh = 128;
  for (let y = 0; y < h; y++) {
    const row = Math.floor(y / bh);
    const xOff = (row % 2) * (bw / 2);
    const dy = Math.min(y % bh, bh - 1 - (y % bh));
    // Subtle horizontal sedimentary strata
    const strata = Math.sin(y * 0.08) * 8;
    for (let x = 0; x < w; x++) {
      const col = Math.floor((x + xOff) / bw);
      const dx = Math.min((x + xOff) % bw, bw - 1 - ((x + xOff) % bw));
      const dist = Math.min(dx, dy);
      const blockHash = ((row * 173 + col * 311) % 13) - 6;
      const idx = (y * w + x) * 4;

      const blend = Math.min(1.0, dist / 2.0);
      const baseR = Math.min(255, Math.max(0, 188 + blockHash * 3 + strata));
      const baseG = Math.min(255, Math.max(0, 96 + blockHash * 2 + strata * 0.6));
      const baseB = Math.min(255, Math.max(0, 72 + blockHash + strata * 0.4));
      const mortR = 135, mortG = 70, mortB = 55;

      data[idx] = Math.round(mortR + (baseR - mortR) * blend);
      data[idx + 1] = Math.round(mortG + (baseG - mortG) * blend);
      data[idx + 2] = Math.round(mortB + (baseB - mortB) * blend);
      data[idx + 3] = 255;
    }
  }
  return data;
}

/** 3. Calligraphy Band: Intricate deep carved Arabic inscription frieze */
function generateCalligraphyBandPixels(w = 512, h = 256) {
  const data = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) {
    const isBorder = y < 12 || y > h - 13;
    const bandNoise = Math.sin(x_calligraphy_loop(y)) * 10;
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      // Simulated Arabic Naskh scripture rhythm
      const scriptPattern =
        Math.sin(x * 0.15 + Math.cos(y * 0.2) * 2) * Math.cos(y * 0.12) > 0.15;
      
      if (isBorder) {
        data[idx] = 95; data[idx + 1] = 42; data[idx + 2] = 32; data[idx + 3] = 255;
      } else if (scriptPattern) {
        // Raised calligraphic text
        data[idx] = 168; data[idx + 1] = 78; data[idx + 2] = 60; data[idx + 3] = 255;
      } else {
        // Recessed shadowed ground
        data[idx] = 98; data[idx + 1] = 45; data[idx + 2] = 35; data[idx + 3] = 255;
      }
    }
  }
  return data;
}

function x_calligraphy_loop(y) {
  return y * 0.05;
}

/** 4. Deep Red Sandstone: Rich ferruginous Sikri stone for storeys 2 and 3 */
function generateDeepRedSandstonePixels(w = 512, h = 512) {
  const data = new Uint8Array(w * h * 4);
  const bw = 256, bh = 128;
  for (let y = 0; y < h; y++) {
    const row = Math.floor(y / bh);
    const xOff = (row % 2) * (bw / 2);
    const dy = Math.min(y % bh, bh - 1 - (y % bh));
    for (let x = 0; x < w; x++) {
      const col = Math.floor((x + xOff) / bw);
      const dx = Math.min((x + xOff) % bw, bw - 1 - ((x + xOff) % bw));
      const dist = Math.min(dx, dy);
      const blockHash = ((row * 151 + col * 283) % 9) - 4;
      const idx = (y * w + x) * 4;

      const blend = Math.min(1.0, dist / 2.0);
      const baseR = 156 + blockHash * 2;
      const baseG = 58 + blockHash;
      const baseB = 44 + blockHash;
      const mortR = 110, mortG = 42, mortB = 32;

      data[idx] = Math.round(mortR + (baseR - mortR) * blend);
      data[idx + 1] = Math.round(mortG + (baseG - mortG) * blend);
      data[idx + 2] = Math.round(mortB + (baseB - mortB) * blend);
      data[idx + 3] = 255;
    }
  }
  return data;
}

/** 5. White Makrana Marble: Fine crystalline ivory marble for storeys 4 & 5 */
function generateWhiteMakranaMarblePixels(w = 512, h = 512) {
  const data = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      // Soft crystalline marbling veining
      const vein1 = Math.sin(x * 0.02 + y * 0.03 + Math.sin(x * 0.05) * 1.5);
      const vein2 = Math.cos(x * 0.04 - y * 0.015);
      const vein = Math.abs(vein1 * vein2);
      const isVein = vein > 0.85;

      if (isVein) {
        data[idx] = 210; data[idx + 1] = 208; data[idx + 2] = 202; data[idx + 3] = 255;
      } else {
        const val = 238 + ((x * 7 + y * 13) % 7) - 3;
        data[idx] = val; data[idx + 1] = val; data[idx + 2] = Math.max(0, val - 4); data[idx + 3] = 255;
      }
    }
  }
  return data;
}

function createDataTexture(rawUint8, width, height, repX = 1, repY = 1) {
  const tex = new THREE.DataTexture(rawUint8, width, height, THREE.RGBAFormat);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repX, repY);
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

console.log("Generating Qutub Minar PBR architectural materials...");
const flagstoneTex = createDataTexture(generateQuartziteFlagstonePixels(512, 512), 512, 512, 2, 2);
const variegatedSandstoneTex = createDataTexture(generateVariegatedSandstonePixels(512, 512), 512, 512, 2, 2);
const calligraphyTex = createDataTexture(generateCalligraphyBandPixels(512, 256), 512, 256, 4, 1);
const deepRedSandstoneTex = createDataTexture(generateDeepRedSandstonePixels(512, 512), 512, 512, 2, 2);
const makranaMarbleTex = createDataTexture(generateWhiteMakranaMarblePixels(512, 512), 512, 512, 2, 2);

// ─── MATERIALS SETUP ────────────────────────────────────────────────────────
const courtyardMat = new THREE.MeshStandardMaterial({
  name: "CourtyardFlagstone",
  map: flagstoneTex,
  roughness: 0.92,
  metalness: 0.02,
});

const variegatedSandstoneMat = new THREE.MeshStandardMaterial({
  name: "VariegatedSandstone",
  map: variegatedSandstoneTex,
  roughness: 0.88,
  metalness: 0.02,
});

const calligraphyMat = new THREE.MeshStandardMaterial({
  name: "CalligraphyBand",
  map: calligraphyTex,
  roughness: 0.92,
  metalness: 0.02,
});

const balconyMat = new THREE.MeshStandardMaterial({
  name: "BalconyCarvedStone",
  map: variegatedSandstoneTex,
  color: new THREE.Color(0xd47f66),
  roughness: 0.85,
  metalness: 0.02,
});

const deepRedSandstoneMat = new THREE.MeshStandardMaterial({
  name: "DeepRedSandstone",
  map: deepRedSandstoneTex,
  roughness: 0.88,
  metalness: 0.02,
});

const makranaMarbleMat = new THREE.MeshStandardMaterial({
  name: "WhiteMakranaMarble",
  map: makranaMarbleTex,
  roughness: 0.38,
  metalness: 0.04,
});

const interiorVoidMat = new THREE.MeshStandardMaterial({
  name: "InteriorRecessVoid",
  color: new THREE.Color(0x1a1816),
  roughness: 0.98,
  metalness: 0.0,
});

const summitRailingMat = new THREE.MeshStandardMaterial({
  name: "SummitIronRailing",
  color: new THREE.Color(0x282625),
  roughness: 0.55,
  metalness: 0.82,
});

const materialMap = {
  CourtyardFlagstone: courtyardMat,
  VariegatedSandstone: variegatedSandstoneMat,
  CalligraphyBand: calligraphyMat,
  BalconyCarvedStone: balconyMat,
  DeepRedSandstone: deepRedSandstoneMat,
  WhiteMakranaMarble: makranaMarbleMat,
  InteriorRecessVoid: interiorVoidMat,
  SummitIronRailing: summitRailingMat,
};

// ─── MODEL EXPORT HELPER ────────────────────────────────────────────────────
function exportSceneToGLB(scene, filePath) {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      (glb) => {
        fs.writeFileSync(filePath, Buffer.from(glb));
        const stats = fs.statSync(filePath);
        console.log(`✓ Saved ${filePath} (${(stats.size / 1024).toFixed(1)} KB)`);
        resolve(stats.size);
      },
      (err) => reject(err),
      { binary: true }
    );
  });
}

// ─── ADD CONTEXTUAL COURTYARD & HISTORIC IRON PILLAR ────────────────────────
function buildPrecinctGround() {
  const precinct = new THREE.Group();
  precinct.name = "QutbComplexPrecinct";

  // 1. Broad outer stone terrace plinth (48m x 48m)
  const terraceGeo = new THREE.BoxGeometry(48, 0.5, 48);
  const terrace = new THREE.Mesh(terraceGeo, courtyardMat);
  terrace.position.set(0, -0.25, 0);
  terrace.receiveShadow = true;
  precinct.add(terrace);

  // 2. Surrounding archaeological lawn apron (90m x 90m)
  const lawnGeo = new THREE.CylinderGeometry(52, 54, 0.4, 48);
  const lawnMat = new THREE.MeshStandardMaterial({
    name: "ArchaeologicalLawn",
    color: new THREE.Color(0x445e33),
    roughness: 0.95,
    metalness: 0.01,
  });
  const lawn = new THREE.Mesh(lawnGeo, lawnMat);
  lawn.position.set(0, -0.45, 0);
  lawn.receiveShadow = true;
  precinct.add(lawn);

  // 3. The 4th-Century Gupta Iron Pillar (Kirti Stambha) of Chandragupta II
  // Located ~18m West-Northwest from the Minar in Quwwat-ul-Islam courtyard
  const pillarGroup = new THREE.Group();
  pillarGroup.name = "IronPillarOfDelhi";
  pillarGroup.position.set(-18, 0, -6);

  const ironPillarMat = new THREE.MeshStandardMaterial({
    name: "AncientRustResistantIron",
    color: new THREE.Color(0x2d2b29),
    roughness: 0.72,
    metalness: 0.78,
  });

  // Base stone platform
  const pPlinthGeo = new THREE.CylinderGeometry(2.0, 2.2, 0.4, 24);
  const pPlinth = new THREE.Mesh(pPlinthGeo, courtyardMat);
  pPlinth.position.y = 0.2;
  pillarGroup.add(pPlinth);

  // Iron shaft (7.21 meters tall, diameter ~42cm tapering to 30cm)
  const shaftGeo = new THREE.CylinderGeometry(0.18, 0.22, 6.2, 24);
  const shaft = new THREE.Mesh(shaftGeo, ironPillarMat);
  shaft.position.y = 3.5;
  shaft.castShadow = true;
  pillarGroup.add(shaft);

  // Bell-shaped capital with fluted amalaka and square abacus
  const capitalGeo = new THREE.CylinderGeometry(0.32, 0.22, 0.8, 16);
  const capital = new THREE.Mesh(capitalGeo, ironPillarMat);
  capital.position.y = 6.9;
  pillarGroup.add(capital);

  // Protective ASI brass fence around Iron Pillar
  const fenceMat = new THREE.MeshStandardMaterial({
    name: "ProtectiveFence",
    color: new THREE.Color(0x8a7248),
    roughness: 0.5,
    metalness: 0.7,
  });
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const postGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.1, 8);
    const post = new THREE.Mesh(postGeo, fenceMat);
    post.position.set(Math.cos(angle) * 2.6, 0.55, Math.sin(angle) * 2.6);
    pillarGroup.add(post);
  }

  precinct.add(pillarGroup);

  // 4. ASI Blue Enamel Monument Information Pedestal
  const infoGroup = new THREE.Group();
  infoGroup.name = "ASIMonumentPlaque";
  infoGroup.position.set(0, 0, 14.5);

  const plaqueBaseGeo = new THREE.BoxGeometry(1.6, 0.8, 0.4);
  const plaqueBase = new THREE.Mesh(plaqueBaseGeo, courtyardMat);
  plaqueBase.position.y = 0.4;
  infoGroup.add(plaqueBase);

  const plaqueBoardGeo = new THREE.BoxGeometry(1.4, 0.9, 0.06);
  const plaqueBoardMat = new THREE.MeshStandardMaterial({
    color: 0x123060, // ASI Blue
    roughness: 0.4,
    metalness: 0.2,
  });
  const plaqueBoard = new THREE.Mesh(plaqueBoardGeo, plaqueBoardMat);
  plaqueBoard.position.set(0, 1.1, 0.15);
  plaqueBoard.rotation.x = -0.35;
  infoGroup.add(plaqueBoard);

  precinct.add(infoGroup);

  return precinct;
}

// ─── MAIN BUILD PIPELINE ────────────────────────────────────────────────────
async function build() {
  console.log("Loading Qutub Minar OBJ source from:", OBJ_SOURCE_PATH);
  const objText = fs.readFileSync(OBJ_SOURCE_PATH, "utf8");
  const loader = new OBJLoader();
  const rawObj = loader.parse(objText);

  console.log("Binding authentic PBR materials to mesh hierarchy...");
  rawObj.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      const mtlName = Array.isArray(child.material)
        ? child.material[0]?.name
        : child.material?.name;

      if (mtlName && materialMap[mtlName]) {
        child.material = materialMap[mtlName];
      } else {
        // Fallback default sandstone
        child.material = variegatedSandstoneMat;
      }
    }
  });

  // ─── 1. BUILD COMPLETE EXTERIOR MODEL ─────────────────────────────────────
  console.log("Building Qutub Minar Exterior 3D Model with surrounding precinct...");
  const exteriorScene = new THREE.Scene();
  exteriorScene.name = "QutubMinarComplex";
  exteriorScene.add(rawObj);
  exteriorScene.add(buildPrecinctGround());

  const exteriorGlbPath = path.join(OUT_DIR_EXTERIOR, "qutub-minar-exterior.glb");
  await exportSceneToGLB(exteriorScene, exteriorGlbPath);

  // ─── 2. BUILD HISTORICAL 1199 CE RECONSTRUCTION MODEL ─────────────────────
  // (Original 1199-1220 CE Red Sandstone Minar of Aibak and Iltutmish prior to Tughlaq's marble reconstruction)
  console.log("Building Historical 1199-1220 CE Reconstruction Variant...");
  const historicalScene = new THREE.Scene();
  historicalScene.name = "QutubMinar_1199CE_Reconstruction";

  // Clone tower and apply uniform red sandstone to upper tiers to illustrate the pre-1368 lightning state
  const historicalTower = rawObj.clone(true);
  historicalTower.traverse((child) => {
    if (child.isMesh) {
      if (child.material.name === "WhiteMakranaMarble") {
        child.material = deepRedSandstoneMat; // Pre-Tughlaq red sandstone state
      }
    }
  });
  historicalScene.add(historicalTower);
  historicalScene.add(buildPrecinctGround());

  const historicalGlbPath = path.join(
    OUT_DIR_HISTORICAL,
    "qutub-minar-1199-reconstruction.glb"
  );
  await exportSceneToGLB(historicalScene, historicalGlbPath);

  console.log("\n==================================================");
  console.log("QUTUB MINAR 3D MODELS BUILT AND READY FOR PRODUCTION!");
  console.log("==================================================");
}

build().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
