/**
 * HeritageVerse 3D Digital Museum Asset Generator
 * Builds high-fidelity, authentic GLB models for Shaniwar Wada
 * directly referencing user-provided 3D renders, video orbit,
 * and ASI archival survey records.
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

// Polyfill FileReader, ImageData, and document.createElement('canvas') for Node.js GLTFExporter
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
      .png()
      .toBuffer()
      .then((buf) => {
        callback(new Blob([buf], { type: "image/png" }));
      });
  }
}

global.document = {
  createElement: (tag) => {
    if (tag === "canvas") return new NodeFakeCanvas();
    return {};
  },
};

const OUT_DIR_EXTERIOR = "public/models/monuments/shaniwar-wada/exterior";
const OUT_DIR_INTERIOR = "public/models/monuments/shaniwar-wada/interior";
const OUT_DIR_HISTORICAL = "public/models/monuments/shaniwar-wada/historical";

[OUT_DIR_EXTERIOR, OUT_DIR_INTERIOR, OUT_DIR_HISTORICAL].forEach((d) => {
  fs.mkdirSync(d, { recursive: true });
});

// ─── PROCEDURAL PBR TEXTURE GENERATORS ───────────────────────────────────────

/** 1. Basalt Ashlar Stone: Large, smooth monumental stone blocks with soft subtle joints and zero noise */
function generateBasaltStonePixels(w = 512, h = 512) {
  const data = new Uint8Array(w * h * 4);
  const bh = 128, bw = 256; // Big monumental stone blocks
  for (let y = 0; y < h; y++) {
    const row = Math.floor(y / bh);
    const xOff = (row % 2) * (bw / 2);
    const dy = Math.min(y % bh, bh - 1 - (y % bh));
    for (let x = 0; x < w; x++) {
      const col = Math.floor((x + xOff) / bw);
      const dx = Math.min((x + xOff) % bw, bw - 1 - ((x + xOff) % bw));
      const dist = Math.min(dx, dy);
      const blockHash = ((row * 137 + col * 269) % 9) - 4;
      const idx = (y * w + x) * 4;

      // Soft bilinear bevel over 2 pixels: smooth and restful to the eyes
      const blend = Math.min(1.0, dist / 2.0);
      const baseR = 142 + blockHash;
      const baseG = 138 + blockHash;
      const baseB = 132 + blockHash;
      const mortR = 120, mortG = 116, mortB = 112;

      data[idx] = Math.round(mortR + (baseR - mortR) * blend);
      data[idx+1] = Math.round(mortG + (baseG - mortG) * blend);
      data[idx+2] = Math.round(mortB + (baseB - mortB) * blend);
      data[idx+3] = 255;
    }
  }
  return data;
}

/** 2. Terracotta Brick: Large, smooth warm brick courses with soft seams and zero pixel noise */
function generateTerracottaBrickPixels(w = 512, h = 512) {
  const data = new Uint8Array(w * h * 4);
  const bh = 64, bw = 128; // Big smooth bricks
  for (let y = 0; y < h; y++) {
    const row = Math.floor(y / bh);
    const xOff = (row % 2) * (bw / 2);
    const dy = Math.min(y % bh, bh - 1 - (y % bh));
    for (let x = 0; x < w; x++) {
      const col = Math.floor((x + xOff) / bw);
      const dx = Math.min((x + xOff) % bw, bw - 1 - ((x + xOff) % bw));
      const dist = Math.min(dx, dy);
      const blockHash = ((row * 131 + col * 257) % 9) - 4;
      const idx = (y * w + x) * 4;

      const blend = Math.min(1.0, dist / 2.0);
      const baseR = 160 + blockHash;
      const baseG = 100 + Math.floor(blockHash * 0.6);
      const baseB = 82 + Math.floor(blockHash * 0.5);
      const mortR = 135, mortG = 92, mortB = 78;

      data[idx] = Math.round(mortR + (baseR - mortR) * blend);
      data[idx+1] = Math.round(mortG + (baseG - mortG) * blend);
      data[idx+2] = Math.round(mortB + (baseB - mortB) * blend);
      data[idx+3] = 255;
    }
  }
  return data;
}

/** 3. Buff Sandstone: Large smooth dressed stone blocks for Delhi Gate portal */
function generateBuffSandstonePixels(w = 256, h = 256) {
  const data = new Uint8Array(w * h * 4);
  const bh = 64, bw = 128;
  for (let y = 0; y < h; y++) {
    const row = Math.floor(y / bh);
    const xOff = (row % 2) * (bw / 2);
    const dy = Math.min(y % bh, bh - 1 - (y % bh));
    for (let x = 0; x < w; x++) {
      const col = Math.floor((x + xOff) / bw);
      const dx = Math.min((x + xOff) % bw, bw - 1 - ((x + xOff) % bw));
      const dist = Math.min(dx, dy);
      const blockHash = ((row * 97 + col * 181) % 9) - 4;
      const idx = (y * w + x) * 4;

      const blend = Math.min(1.0, dist / 2.0);
      const baseR = 202 + blockHash;
      const baseG = 190 + blockHash;
      const baseB = 172 + blockHash;
      const mortR = 170, mortG = 160, mortB = 146;

      data[idx] = Math.round(mortR + (baseR - mortR) * blend);
      data[idx+1] = Math.round(mortG + (baseG - mortG) * blend);
      data[idx+2] = Math.round(mortB + (baseB - mortB) * blend);
      data[idx+3] = 255;
    }
  }
  return data;
}

/** 4. Teakwood Planks: Dark weathered timber with vertical grain and iron strap details */
function generateTeakwoodPixels(w = 256, h = 256) {
  const data = new Uint8Array(w * h * 4);
  const pw = 24;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const isJoint = (x % pw === 0 || x % pw === pw - 1);
      const idx = (y * w + x) * 4;
      const grain = ((x * 7 + (y % 16) * 3) % 9) - 4;
      if (isJoint) {
        data[idx] = 34; data[idx+1] = 22; data[idx+2] = 14; data[idx+3] = 255;
      } else {
        data[idx] = Math.max(0, Math.min(255, 62 + grain));
        data[idx+1] = Math.max(0, Math.min(255, 42 + grain));
        data[idx+2] = Math.max(0, Math.min(255, 28 + grain));
        data[idx+3] = 255;
      }
    }
  }
  return data;
}

/** 5. Natural Grass Lawn */
function generateLawnPixels(w = 256, h = 256) {
  const data = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const noise = ((x * 31 + y * 47) % 21) - 10;
      data[idx] = Math.max(0, Math.min(255, 96 + noise));
      data[idx+1] = Math.max(0, Math.min(255, 136 + noise));
      data[idx+2] = Math.max(0, Math.min(255, 66 + noise));
      data[idx+3] = 255;
    }
  }
  return data;
}

/** 6. Paving Flagstones */
function generatePavingPixels(w = 256, h = 256) {
  const data = new Uint8Array(w * h * 4);
  const sw = 32, sh = 32;
  for (let y = 0; y < h; y++) {
    const row = Math.floor(y / sh);
    const isMortarY = (y % sh === 0);
    const xOff = (row % 2) * 16;
    for (let x = 0; x < w; x++) {
      const col = Math.floor((x + xOff) / sw);
      const isMortarX = ((x + xOff) % sw === 0);
      const idx = (y * w + x) * 4;
      const noise = ((row * 43 + col * 79) % 15) - 7;
      if (isMortarY || isMortarX) {
        data[idx] = 80; data[idx+1] = 76; data[idx+2] = 72; data[idx+3] = 255;
      } else {
        data[idx] = Math.max(0, Math.min(255, 142 + noise));
        data[idx+1] = Math.max(0, Math.min(255, 136 + noise));
        data[idx+2] = Math.max(0, Math.min(255, 130 + noise));
        data[idx+3] = 255;
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

console.log("Generating procedural PBR texture maps...");
const stoneTexTower = createDataTexture(generateBasaltStonePixels(512, 512), 512, 512, 1.5, 1.0);
const stoneTexWall = createDataTexture(generateBasaltStonePixels(512, 512), 512, 512, 1.5, 1.0);
const brickTexParapet = createDataTexture(generateTerracottaBrickPixels(512, 512), 512, 512, 2.0, 1.0);
const sandstoneTexPortal = createDataTexture(generateBuffSandstonePixels(256, 256), 256, 256, 1.0, 1.0);
const teakTexGate = createDataTexture(generateTeakwoodPixels(256, 256), 256, 256, 2, 2);
const lawnTexGround = createDataTexture(generateLawnPixels(256, 256), 256, 256, 8, 8);
const pavingTexGround = createDataTexture(generatePavingPixels(256, 256), 256, 256, 4, 4);

// ─── MATERIALS MATCHING 3D RENDERS ──────────────────────────────────────────

// Grey basalt stone for towers and lower bastion bodies - Smooth matte dressed ashlar
const basaltTowerMat = new THREE.MeshStandardMaterial({
  name: "BasaltTowerAshlar",
  map: stoneTexTower,
  roughness: 0.94,
  metalness: 0.02,
});

// Grey basalt stone for rampart lower wall courses - Smooth matte monumental blocks
const basaltWallMat = new THREE.MeshStandardMaterial({
  name: "BasaltCurtainWall",
  map: stoneTexWall,
  roughness: 0.94,
  metalness: 0.02,
});

// Terracotta red/brown brick for upper rampart parapet & coping - Smooth warm brickwork
const brickParapetMat = new THREE.MeshStandardMaterial({
  name: "TerracottaBrickParapet",
  map: brickTexParapet,
  roughness: 0.90,
  metalness: 0.02,
});

// Distinct buff sandstone for Delhi Gate central portal
const sandstonePortalMat = new THREE.MeshStandardMaterial({
  name: "BuffSandstoneGatewayPortal",
  map: sandstoneTexPortal,
  roughness: 0.90,
  metalness: 0.02,
});

// Dressed stone trim for plinths, cornices, steps, and mouldings
const dressedStoneMat = new THREE.MeshStandardMaterial({
  name: "DressedStoneTrim",
  color: 0x9c968c,
  roughness: 0.82,
  metalness: 0.06,
});

// Deep shadow dark basalt for arrow slits and recessed embrasures
const darkBasaltMat = new THREE.MeshStandardMaterial({
  name: "DarkBasaltShadow",
  color: 0x1e1c1a,
  roughness: 0.95,
  metalness: 0.02,
});

// Flagstone paving for steps, walkways, and terrace floors
const pavingMat = new THREE.MeshStandardMaterial({
  name: "FlagstonePaving",
  map: pavingTexGround,
  roughness: 0.86,
  metalness: 0.04,
});

// Weathered teakwood for spiked gate leaves
const teakGateMat = new THREE.MeshStandardMaterial({
  name: "WeatheredTeakwoodGate",
  map: teakTexGate,
  roughness: 0.76,
  metalness: 0.1,
});

// Warm carved timber for Nagarkhana pillars, cusped arches, and brackets (Render Image 3)
const carvedTimberMat = new THREE.MeshStandardMaterial({
  name: "CarvedTimberBalustrade",
  color: 0xa27f52,
  roughness: 0.72,
  metalness: 0.08,
});

// Light lime stucco plaster for side walls
const stuccoMat = new THREE.MeshStandardMaterial({
  name: "LimeStuccoPlaster",
  color: 0xd6cebe,
  roughness: 0.85,
  metalness: 0.04,
});

// Forged iron / steel for straps, spikes, and knocker
const ironMat = new THREE.MeshStandardMaterial({
  name: "ForgedIronElephantSpikes",
  color: 0x222224,
  roughness: 0.4,
  metalness: 0.85,
});

// Historic blue enamel sign plate
const blueSignMat = new THREE.MeshStandardMaterial({
  name: "HistoricBlueSignEnamel",
  color: 0x183b66,
  roughness: 0.45,
  metalness: 0.3,
});

// Gold lettering
const goldSignMat = new THREE.MeshStandardMaterial({
  name: "GoldLettering",
  color: 0xdfbc4c,
  roughness: 0.3,
  metalness: 0.85,
});

// Carved white marble lotus basin for Hazari Karanje
const marbleLotusMat = new THREE.MeshStandardMaterial({
  name: "CarvedWhiteMarbleLotus",
  color: 0xeae6dc,
  roughness: 0.35,
  metalness: 0.15,
});

// Terracotta clay tiles for roofs
const terracottaRoofMat = new THREE.MeshStandardMaterial({
  name: "TerracottaRoofTiles",
  color: 0x8a4234,
  roughness: 0.82,
  metalness: 0.05,
});

// Water surface
const waterMat = new THREE.MeshStandardMaterial({
  name: "ReflectiveWater",
  color: 0x2e525a,
  roughness: 0.15,
  metalness: 0.65,
});

// Green grass lawn
const lawnMat = new THREE.MeshStandardMaterial({
  name: "ManicuredLawn",
  map: lawnTexGround,
  roughness: 0.95,
  metalness: 0.0,
});

// Tree foliage
const foliageMat = new THREE.MeshStandardMaterial({
  name: "TreeCanopyFoliage",
  color: 0x36542d,
  roughness: 0.9,
  metalness: 0.0,
});

// Brass finials and water jets
const brassMat = new THREE.MeshStandardMaterial({
  name: "PolishedBrassFinial",
  color: 0xc49e4d,
  roughness: 0.32,
  metalness: 0.85,
});

// Enable DoubleSide on all architectural materials to eliminate any see-through or hollow faces
[
  basaltTowerMat,
  basaltWallMat,
  brickParapetMat,
  sandstonePortalMat,
  dressedStoneMat,
  darkBasaltMat,
  pavingMat,
  teakGateMat,
  carvedTimberMat,
  stuccoMat,
  ironMat,
  marbleLotusMat,
  terracottaRoofMat,
  lawnMat,
].forEach((mat) => {
  mat.side = THREE.DoubleSide;
});

// Helper to export scene to GLB
function saveSceneToGLB(scene, filePath) {
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

// ─── PROCEDURAL ARCHITECTURAL BUILDERS ───────────────────────────────────────

/** 16-petal lotus basin shape */
function createLotusShape(radius, petalDepth) {
  const shape = new THREE.Shape();
  const N = 16;
  const segments = 128;
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const r = radius + petalDepth * Math.cos(N * theta);
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  return shape;
}

/** Turned wooden balustrade with round corner posts and spherical finials */
function createBalustrade(length, height = 0.9) {
  const group = new THREE.Group();
  const bottomRail = new THREE.Mesh(new THREE.BoxGeometry(length, 0.08, 0.12), carvedTimberMat);
  bottomRail.position.y = 0.04;
  group.add(bottomRail);

  const topRail = new THREE.Mesh(new THREE.BoxGeometry(length, 0.1, 0.16), carvedTimberMat);
  topRail.position.y = height - 0.05;
  group.add(topRail);

  const numBalusters = Math.max(2, Math.floor(length / 0.28));
  const spacing = length / numBalusters;
  for (let i = 0; i <= numBalusters; i++) {
    const bx = -length / 2 + i * spacing;
    const baluster = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.045, height - 0.18, 8),
      carvedTimberMat
    );
    baluster.position.set(bx, height / 2, 0);
    group.add(baluster);
  }

  for (let end of [-length / 2, length / 2]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.14, height, 0.14), carvedTimberMat);
    post.position.set(end, height / 2, 0);
    group.add(post);

    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), carvedTimberMat);
    finial.position.set(end, height + 0.08, 0);
    group.add(finial);
  }

  return group;
}

/** Maratha cypress column (suru pillar) with cusped bracket capital */
function createSuruColumn(height = 3.2) {
  const group = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.32, 0.42), carvedTimberMat);
  base.position.y = 0.16;
  group.add(base);

  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.18, height - 0.65, 12),
    carvedTimberMat
  );
  shaft.position.y = 0.32 + (height - 0.65) / 2;
  group.add(shaft);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.18, 0.045, 8, 16),
    carvedTimberMat
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = height * 0.45;
  group.add(ring);

  const capital = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.32, 0.42), carvedTimberMat);
  capital.position.y = height - 0.16;
  group.add(capital);

  return group;
}

/** Authentic Maratha cusped foil arch */
function createCuspedArch(span = 1.4, archHeight = 0.55, thickness = 0.22) {
  const shape = new THREE.Shape();
  shape.moveTo(-span / 2, 0);
  shape.lineTo(-span / 2, archHeight);
  shape.lineTo(span / 2, archHeight);
  shape.lineTo(span / 2, 0);

  const hole = new THREE.Path();
  hole.moveTo(span / 2, 0);
  const numCusps = 5;
  for (let i = numCusps; i >= 0; i--) {
    const t = i / numCusps;
    const angle = t * Math.PI;
    const rx = (span / 2) * Math.cos(angle);
    const ry = (archHeight * 0.9) * Math.sin(angle) + 0.08 * Math.sin(angle * numCusps);
    if (i === numCusps) hole.moveTo(rx, Math.max(0, ry));
    else hole.lineTo(rx, Math.max(0, ry));
  }
  shape.holes.push(hole);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 2,
  });
  const mesh = new THREE.Mesh(geo, carvedTimberMat);
  mesh.castShadow = true;
  return mesh;
}

/** Carved stone bracket corbel */
function createStoneCorbel(width = 0.32, height = 0.75, depth = 0.85) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0, height);
  shape.lineTo(depth, height);
  shape.bezierCurveTo(depth * 0.8, height * 0.7, depth * 0.5, height * 0.3, 0, 0);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: width,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 2,
  });
  const mesh = new THREE.Mesh(geo, dressedStoneMat);
  mesh.rotation.y = -Math.PI / 2;
  mesh.castShadow = true;
  return mesh;
}

/** Architectural shade tree */
function createTree(scale = 1.0) {
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18 * scale, 0.32 * scale, 2.8 * scale, 8),
    carvedTimberMat
  );
  trunk.position.y = 1.4 * scale;
  trunk.castShadow = true;
  group.add(trunk);

  const canopies = [
    { pos: [0, 3.4 * scale, 0], r: 1.6 * scale },
    { pos: [0.7 * scale, 3.8 * scale, 0.4 * scale], r: 1.3 * scale },
    { pos: [-0.6 * scale, 3.6 * scale, -0.3 * scale], r: 1.4 * scale },
    { pos: [0, 4.5 * scale, 0], r: 1.1 * scale },
  ];

  canopies.forEach((c) => {
    const geo = new THREE.DodecahedronGeometry(c.r, 1);
    const m = new THREE.Mesh(geo, foliageMat);
    m.position.set(c.pos[0], c.pos[1], c.pos[2]);
    m.castShadow = true;
    group.add(m);
  });

  return group;
}

// ═════════════════════════════════════════════════════════════════════════════
// 1. BUILD HIGH-FIDELITY SHANIWAR WADA EXTERIOR CITADEL MODEL
// ═════════════════════════════════════════════════════════════════════════════
console.log("Building Upgraded Shaniwar Wada Exterior Model (direct reference to renders)...");
const exteriorScene = new THREE.Scene();
exteriorScene.name = "ShaniwarWada_Master_Exterior";

// Base Lawn Ground Plane encompassing fort and outer grounds
const groundMesh = new THREE.Mesh(new THREE.BoxGeometry(112, 1.0, 112), lawnMat);
groundMesh.position.set(0, -1.8, 0);
groundMesh.receiveShadow = true;
exteriorScene.add(groundMesh);

// Courtyard Interior Lawn (inside the 55m x 44m fort enclosure)
const courtyardGround = new THREE.Mesh(new THREE.BoxGeometry(53, 0.4, 42), lawnMat);
courtyardGround.position.set(0, -0.2, -10);
courtyardGround.receiveShadow = true;
exteriorScene.add(courtyardGround);

// ── 1.0 DILLI DARWAZA REAL-LIFE FORECOURT & STEPPED AMPHITHEATRE COMPLEX ─────
// Authentic replication of the famous Shaniwar Wada entrance grounds in Pune (IRL):
// 1. Raised Semicircular Stone Forecourt Podium (Stage) directly in front of the twin bastions
// 2. Central grand flight of stone steps connecting the podium to the lower lawns
// 3. Concentric curved stepped amphitheatre seating terraces radiating into the lawn
// 4. 3 radial paved aisles (spokes) cutting through the curved tiers
// 5. Official ASI monument notice plinth and heritage pedestals
const forecourtGroup = new THREE.Group();
forecourtGroup.name = "Dilli_Darwaza_IRL_Forecourt_Amphitheatre_Complex";

// ── 1.0.1 RAISED STONE FORECOURT PODIUM (STAGE) ─────────────────────────────
// Rectangular core apron extending from gate front (z = 12m to 20.5m, x = -17m to +17m)
const podiumRect = new THREE.Mesh(new THREE.BoxGeometry(34, 0.85, 8.5), pavingMat);
podiumRect.position.set(0, 0.425, 16.25);
podiumRect.receiveShadow = true;
podiumRect.castShadow = true;
forecourtGroup.add(podiumRect);

// Semicircular Stage Apron projecting forward (radius = 12m, centered at z = 12.5m, reaching z = 24.5m)
const stageFloorGeo = new THREE.RingGeometry(0.01, 12.0, 36, 1, Math.PI * 0.15, Math.PI * 0.7);
stageFloorGeo.rotateX(-Math.PI / 2);
stageFloorGeo.rotateY(Math.PI);
const stageFloorMesh = new THREE.Mesh(stageFloorGeo, pavingMat);
stageFloorMesh.position.set(0, 0.85, 12.5);
stageFloorMesh.receiveShadow = true;
forecourtGroup.add(stageFloorMesh);

// Curved Basalt Ashlar Retaining Wall of the stage platform
const stageWallGeo = new THREE.CylinderGeometry(12.0, 12.0, 0.85, 36, 1, true, -Math.PI * 0.35, Math.PI * 0.7);
const stageWallMesh = new THREE.Mesh(stageWallGeo, basaltWallMat);
stageWallMesh.position.set(0, 0.425, 12.5);
stageWallMesh.castShadow = true;
stageWallMesh.receiveShadow = true;
forecourtGroup.add(stageWallMesh);

// Projecting Dressed Stone Coping Rim along the curved edge of the podium
const stageCopingGeo = new THREE.CylinderGeometry(12.18, 12.18, 0.12, 36, 1, true, -Math.PI * 0.35, Math.PI * 0.7);
const stageCopingMesh = new THREE.Mesh(stageCopingGeo, dressedStoneMat);
stageCopingMesh.position.set(0, 0.88, 12.5);
stageCopingMesh.castShadow = true;
forecourtGroup.add(stageCopingMesh);

// Flanking Side Retaining Walls (West & East edges of the raised platform)
const westRetaining = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.85, 8.5), basaltWallMat);
westRetaining.position.set(-17.0, 0.425, 16.25);
westRetaining.castShadow = true;
forecourtGroup.add(westRetaining);

const westCoping = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.12, 8.5), dressedStoneMat);
westCoping.position.set(-17.0, 0.88, 16.25);
forecourtGroup.add(westCoping);

const eastRetaining = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.85, 8.5), basaltWallMat);
eastRetaining.position.set(17.0, 0.425, 16.25);
eastRetaining.castShadow = true;
forecourtGroup.add(eastRetaining);

const eastCoping = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.12, 8.5), dressedStoneMat);
eastCoping.position.set(17.0, 0.88, 16.25);
forecourtGroup.add(eastCoping);

// ── 1.0.2 CENTRAL GRAND FLIGHT OF STEPS ─────────────────────────────────────
// 5 wide stone steps cutting through the curved retaining wall from the podium to the lawn
for (let s = 0; s < 5; s++) {
  const sy = 0.68 - s * 0.17;
  const sz = 23.8 + s * 0.62;
  const sw = 5.2 + s * 0.25;
  const step = new THREE.Mesh(new THREE.BoxGeometry(sw, 0.18, 0.65), pavingMat);
  step.position.set(0, sy, sz);
  step.receiveShadow = true;
  step.castShadow = true;
  forecourtGroup.add(step);
}

// Stepped stone cheek walls flanking the central steps
for (let side of [-1, 1]) {
  const cheek = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.75, 3.2), dressedStoneMat);
  cheek.position.set(side * 3.0, 0.55, 25.0);
  cheek.castShadow = true;
  forecourtGroup.add(cheek);
}

// ── 1.0.3 CONCENTRIC STEPPED AMPHITHEATRE LAWN (SEATING TIERS) ──────────────
// 4 concentric curved tiers radiating out from the forecourt stage (Drone & IRL Photos)
const tiers = [
  { rInner: 15.0, rOuter: 19.5, y: 0.0, riserY: -0.16, riserH: 0.32 },
  { rInner: 19.5, rOuter: 24.5, y: -0.32, riserY: -0.48, riserH: 0.32 },
  { rInner: 24.5, rOuter: 30.0, y: -0.64, riserY: -0.80, riserH: 0.32 },
  { rInner: 30.0, rOuter: 36.0, y: -0.96, riserY: -1.12, riserH: 0.32 },
];

tiers.forEach((t) => {
  // Curved stone retaining riser
  const riserGeo = new THREE.CylinderGeometry(
    t.rInner, t.rInner, t.riserH, 36, 1, true,
    -Math.PI * 0.35, Math.PI * 0.7
  );
  const riserMesh = new THREE.Mesh(riserGeo, basaltWallMat);
  riserMesh.position.set(0, t.riserY, 12.5);
  riserMesh.castShadow = true;
  riserMesh.receiveShadow = true;
  forecourtGroup.add(riserMesh);

  // Curved grass seating terrace tread
  const grassGeo = new THREE.RingGeometry(
    t.rInner, t.rOuter, 36, 1,
    Math.PI * 0.15, Math.PI * 0.7
  );
  grassGeo.rotateX(-Math.PI / 2);
  grassGeo.rotateY(Math.PI);
  const grassMesh = new THREE.Mesh(grassGeo, lawnMat);
  grassMesh.position.set(0, t.y, 12.5);
  grassMesh.receiveShadow = true;
  forecourtGroup.add(grassMesh);

  // Stone coping lip on tier edge
  const lipGeo = new THREE.CylinderGeometry(
    t.rInner + 0.1, t.rInner + 0.1, 0.08, 36, 1, true,
    -Math.PI * 0.35, Math.PI * 0.7
  );
  const lipMesh = new THREE.Mesh(lipGeo, dressedStoneMat);
  lipMesh.position.set(0, t.y + 0.04, 12.5);
  forecourtGroup.add(lipMesh);
});

// ── 1.0.4 THREE RADIAL PAVED AISLES (SPOKES CONNECTING TIERS) ────────────────
// Center Aisle (X = 0)
const centerAisle = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.06, 22), pavingMat);
centerAisle.position.set(0, -0.45, 37);
centerAisle.receiveShadow = true;
forecourtGroup.add(centerAisle);

// Flanking Angled Aisles (-28 deg West, +28 deg East)
for (let angle of [-0.48, 0.48]) {
  const aisle = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.06, 20), pavingMat);
  aisle.rotation.y = angle;
  const midR = 25.0;
  aisle.position.set(
    midR * Math.sin(angle),
    -0.45,
    12.5 + midR * Math.cos(angle)
  );
  aisle.receiveShadow = true;
  forecourtGroup.add(aisle);
}

// ── 1.0.5 ASI HISTORICAL MONUMENT NOTICE PLINTHS & HERITAGE PEDESTALS ────────
// Official Archaeological Survey of India (ASI) Inscription Pedestal (West side of podium)
const asiPedestal = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.9, 0.7), dressedStoneMat);
asiPedestal.position.set(-5.2, 1.3, 18.0);
asiPedestal.castShadow = true;
forecourtGroup.add(asiPedestal);

const asiSignPlate = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.55, 0.08), blueSignMat);
asiSignPlate.rotation.x = -0.38;
asiSignPlate.position.set(-5.2, 1.95, 18.1);
asiSignPlate.castShadow = true;
forecourtGroup.add(asiSignPlate);

const asiGoldHeader = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.12, 0.1), goldSignMat);
asiGoldHeader.rotation.x = -0.38;
asiGoldHeader.position.set(-5.2, 2.1, 18.16);
forecourtGroup.add(asiGoldHeader);

// Symmetrical Historic Information Plinth (East side of podium)
const eastPedestal = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.9, 0.7), dressedStoneMat);
eastPedestal.position.set(5.2, 1.3, 18.0);
eastPedestal.castShadow = true;
forecourtGroup.add(eastPedestal);

const eastSignPlate = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.55, 0.08), blueSignMat);
eastSignPlate.rotation.x = -0.38;
eastSignPlate.position.set(5.2, 1.95, 18.1);
eastSignPlate.castShadow = true;
forecourtGroup.add(eastSignPlate);

// Traditional Heritage Wrought-Iron Lamp Posts at the terrace corners
for (let lx of [-16.2, 16.2]) {
  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 0.6, 8), ironMat);
  lampBase.position.set(lx, 1.15, 20.0);
  forecourtGroup.add(lampBase);

  const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 2.8, 8), ironMat);
  lampPole.position.set(lx, 2.85, 20.0);
  lampPole.castShadow = true;
  forecourtGroup.add(lampPole);

  const lampLantern = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.6, 0.45), brassMat);
  lampLantern.position.set(lx, 4.35, 20.0);
  forecourtGroup.add(lampLantern);
}

// ── 1.0.6 DILLI DARWAZA THRESHOLD STEPS ─────────────────────────────────────
// 3 Wide Dressed Stone Entrance Steps leading down from the portal into the forecourt
for (let s = 0; s < 3; s++) {
  const stepMesh = new THREE.Mesh(
    new THREE.BoxGeometry(7.2 + s * 0.6, 0.2, 0.7),
    pavingMat
  );
  stepMesh.position.set(0, 0.85 - s * 0.15, 14.2 + s * 0.7);
  stepMesh.receiveShadow = true;
  forecourtGroup.add(stepMesh);
}

exteriorScene.add(forecourtGroup);

// ── 1.1 DILLI DARWAZA (DELHI GATE) & MONUMENTAL TWIN BASTIONS ───────────────
// Direct reference to Render Image 3 (Front Gate Elevation) and Render Images 1, 4, 5
const dilliDarwazaGroup = new THREE.Group();
dilliDarwazaGroup.name = "Dilli_Darwaza_Master_Gate";

/**
 * Builds an authentic monumental bastion matching Render Images 3, 4, 5:
 * - 2-tier stepped stone plinth base
 * - Lower cylindrical drum in textured grey ashlar basalt
 * - Projecting mid-cornice torus moulding
 * - Row of dark vertical slit loops immediately below the mid-cornice
 * - Upper faceted drum with arched machicolation windows
 * - Crenellated stone parapet with beveled copings enclosing flat terrace
 */
function createMonumentalBastion(sideMultiplier, name) {
  const bGroup = new THREE.Group();
  bGroup.name = name;

  // 1. Two-Tiered Stepped Plinth Base (Full 360° solid cylinders)
  const plinth1 = new THREE.Mesh(
    new THREE.CylinderGeometry(5.2, 5.5, 0.35, 32),
    dressedStoneMat
  );
  plinth1.position.y = 0.175;
  plinth1.receiveShadow = true;
  bGroup.add(plinth1);

  const plinth2 = new THREE.Mesh(
    new THREE.CylinderGeometry(4.8, 5.1, 0.35, 32),
    dressedStoneMat
  );
  plinth2.position.y = 0.525;
  plinth2.receiveShadow = true;
  bGroup.add(plinth2);

  // 2. Lower Bastion Cylindrical Body (Full 360° solid cylinder, y = 0.7m to 6.8m)
  const lowerHeight = 6.1;
  const towerGeo = new THREE.CylinderGeometry(4.5, 4.7, lowerHeight, 32);
  const tower = new THREE.Mesh(towerGeo, basaltTowerMat);
  tower.position.y = 0.7 + lowerHeight / 2; // y = 3.75m
  tower.castShadow = true;
  tower.receiveShadow = true;
  bGroup.add(tower);

  // 3. Row of Dark Vertical Arrow Slits directly UNDER the Mid-Cornice (Render Images 3 & 4)
  // ~12 vertical black slit loops around the outer curve facing forward
  const numSlits = 12;
  for (let s = 1; s <= numSlits; s++) {
    const angle = (s / (numSlits + 1)) * (Math.PI * 0.95) - (Math.PI * 0.475);
    const r = 4.54;
    const slit = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.25, 0.28), darkBasaltMat);
    slit.position.set(Math.sin(angle) * r, 6.1, Math.cos(angle) * r);
    slit.rotation.y = angle;
    bGroup.add(slit);
  }

  // 4. Projecting Mid-Cornice Torus & Moulding (Full 360° solid rings, y = 6.8m to 7.2m)
  const lowerBevel = new THREE.Mesh(
    new THREE.CylinderGeometry(4.75, 4.55, 0.15, 32),
    dressedStoneMat
  );
  lowerBevel.position.y = 6.8;
  bGroup.add(lowerBevel);

  const torusMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(4.9, 4.9, 0.22, 32),
    dressedStoneMat
  );
  torusMesh.position.y = 6.98;
  bGroup.add(torusMesh);

  const upperBevel = new THREE.Mesh(
    new THREE.CylinderGeometry(4.65, 4.9, 0.15, 32),
    dressedStoneMat
  );
  upperBevel.position.y = 7.16;
  bGroup.add(upperBevel);

  // 5. Upper Faceted Drum (Full 360° 16-sided solid cylinder, y = 7.25m to 10.0m)
  const upperHeight = 2.75;
  const upperDrumGeo = new THREE.CylinderGeometry(4.45, 4.6, upperHeight, 16);
  const upperDrum = new THREE.Mesh(upperDrumGeo, basaltTowerMat);
  upperDrum.position.y = 7.25 + upperHeight / 2; // y = 8.62m
  upperDrum.castShadow = true;
  upperDrum.receiveShadow = true;
  bGroup.add(upperDrum);

  // 6. Arched Machicolation Window Embrasures on each outward facet of upper drum
  const numWindows = 7;
  for (let w = 1; w <= numWindows; w++) {
    const angle = (w / (numWindows + 1)) * (Math.PI * 0.9) - (Math.PI * 0.45);
    const r = 4.48;

    // Recessed dark window opening
    const winOpening = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.95, 0.35), darkBasaltMat);
    winOpening.position.set(Math.sin(angle) * r, 8.65, Math.cos(angle) * r);
    winOpening.rotation.y = angle;
    bGroup.add(winOpening);

    // Rounded arch top moulding over window
    const archTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, 0.38, 12),
      dressedStoneMat
    );
    archTop.rotation.x = Math.PI / 2;
    archTop.rotation.z = -angle;
    archTop.position.set(Math.sin(angle) * r, 9.15, Math.cos(angle) * r);
    bGroup.add(archTop);

    // Stone sill under window
    const sill = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.12, 0.42), dressedStoneMat);
    sill.position.set(Math.sin(angle) * r, 8.12, Math.cos(angle) * r);
    sill.rotation.y = angle;
    bGroup.add(sill);
  }

  // 7. Projecting Stone Cornice Platform at top of drum (Full 360° solid cylinder, y = 10.0m)
  const topCornice = new THREE.Mesh(
    new THREE.CylinderGeometry(4.8, 4.45, 0.25, 32),
    dressedStoneMat
  );
  topCornice.position.y = 10.12;
  bGroup.add(topCornice);

  // 8. Crenellated Parapet with Merlons & Slits around the exposed outer curve
  const numMerlons = 10;
  for (let m = 0; m < numMerlons; m++) {
    const angle = (m / (numMerlons - 1)) * (Math.PI * 1.1) - (Math.PI * 0.55);
    const r = 4.62;

    // Solid merlon block
    const merlon = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.95, 0.42), basaltTowerMat);
    merlon.position.set(Math.sin(angle) * r, 10.72, Math.cos(angle) * r);
    merlon.rotation.y = angle;
    bGroup.add(merlon);

    // Sloped stone cap
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.14, 0.46), dressedStoneMat);
    cap.position.set(Math.sin(angle) * r, 11.26, Math.cos(angle) * r);
    cap.rotation.y = angle;
    bGroup.add(cap);

    // Central narrow loophole slit
    const slit = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.45, 0.46), darkBasaltMat);
    slit.position.set(Math.sin(angle) * r, 10.65, Math.cos(angle) * r);
    slit.rotation.y = angle;
    bGroup.add(slit);
  }

  // 9. Flat Paved Terrace Floor (Full 360° solid circular platform)
  const terrace = new THREE.Mesh(
    new THREE.CylinderGeometry(4.45, 4.45, 0.2, 32),
    pavingMat
  );
  terrace.position.y = 10.1;
  bGroup.add(terrace);

  bGroup.position.set(sideMultiplier * 6.8, 0, 12);
  return bGroup;
}

dilliDarwazaGroup.add(createMonumentalBastion(-1, "West_Monumental_Bastion"));
dilliDarwazaGroup.add(createMonumentalBastion(1, "East_Monumental_Bastion"));

// ── 1.2 CENTRAL BUFF SANDSTONE PORTAL & ARCHWAY (Render Image 3) ────────────
const portalGroup = new THREE.Group();
portalGroup.name = "Dilli_Darwaza_Sandstone_Portal";

// Flanking Piers: Left and Right Masonry Jamb Walls (leaving the center 3.8m opening clear!)
const westPier = new THREE.Mesh(new THREE.BoxGeometry(1.4, 8.5, 4.2), sandstonePortalMat);
westPier.position.set(-2.6, 4.25, 12.0);
westPier.castShadow = true;
westPier.receiveShadow = true;
portalGroup.add(westPier);

const eastPier = new THREE.Mesh(new THREE.BoxGeometry(1.4, 8.5, 4.2), sandstonePortalMat);
eastPier.position.set(2.6, 4.25, 12.0);
eastPier.castShadow = true;
eastPier.receiveShadow = true;
portalGroup.add(eastPier);

// Top Spandrel / Header Wall above the Arch (from Y = 7.2m to 8.5m)
const headerWall = new THREE.Mesh(new THREE.BoxGeometry(6.6, 1.3, 4.2), sandstonePortalMat);
headerWall.position.set(0, 7.85, 12.0);
headerWall.castShadow = true;
portalGroup.add(headerWall);

// Recessed Pointed Archway Facade (with true cutout hole for the gate!)
const outerArchShape = new THREE.Shape();
outerArchShape.moveTo(-2.6, 0);
outerArchShape.lineTo(-2.6, 8.5);
outerArchShape.lineTo(2.6, 8.5);
outerArchShape.lineTo(2.6, 0);
outerArchShape.lineTo(1.9, 0);
outerArchShape.lineTo(1.9, 4.8);
outerArchShape.quadraticCurveTo(0.95, 7.1, 0, 7.5);
outerArchShape.quadraticCurveTo(-0.95, 7.1, -1.9, 4.8);
outerArchShape.lineTo(-1.9, 0);
outerArchShape.closePath();

const outerArchGeo = new THREE.ExtrudeGeometry(outerArchShape, {
  depth: 0.5,
  bevelEnabled: true,
  bevelThickness: 0.05,
  bevelSize: 0.05,
  bevelSegments: 2,
});
const outerArchMesh = new THREE.Mesh(outerArchGeo, dressedStoneMat);
outerArchMesh.position.set(0, 0, 13.8);
outerArchMesh.castShadow = true;
portalGroup.add(outerArchMesh);

// Historic Blue Enamel Signboard with Gold Inscription: शनिवार वाडा (Render Image 3)
const signPlate = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.44, 0.1), blueSignMat);
signPlate.position.set(0, 8.0, 14.38);
portalGroup.add(signPlate);

const signFrame = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.56, 0.06), dressedStoneMat);
signFrame.position.set(0, 8.0, 14.35);
portalGroup.add(signFrame);

const signLetters = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.16, 0.14), goldSignMat);
signLetters.position.set(0, 8.0, 14.42);
portalGroup.add(signLetters);

// ── 1.3 THE 21-FOOT SOLID TEAKWOOD GATES & ELEPHANT SPIKES (Render Image 3) ──
const gateAssembly = new THREE.Group();
gateAssembly.name = "Spiked_Teak_Double_Gates";

// Positioned clearly inside the arch opening at Z = 13.5m!
// Left Gate Leaf
const leftLeaf = new THREE.Mesh(new THREE.BoxGeometry(1.88, 7.2, 0.28), teakGateMat);
leftLeaf.position.set(-0.95, 3.6, 13.5);
leftLeaf.castShadow = true;
gateAssembly.add(leftLeaf);

// Right Gate Leaf
const rightLeaf = new THREE.Mesh(new THREE.BoxGeometry(1.88, 7.2, 0.28), teakGateMat);
rightLeaf.position.set(0.95, 3.6, 13.5);
rightLeaf.castShadow = true;
gateAssembly.add(rightLeaf);

// Central Heavy Iron Astragal Strip
const astragal = new THREE.Mesh(new THREE.BoxGeometry(0.16, 7.2, 0.36), ironMat);
astragal.position.set(0, 3.6, 13.58);
gateAssembly.add(astragal);

// 10 Heavy Horizontal Wrought-Iron Reinforcement Straps across each leaf (Render Image 3)
for (let b = 0; b < 10; b++) {
  const by = 0.6 + b * 0.65;
  const ironStrap = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.12, 0.34), ironMat);
  ironStrap.position.set(0, by, 13.56);
  gateAssembly.add(ironStrap);
}

// Forged Steel Anti-Elephant Spikes (projecting boldly forward toward viewer!)
const spikeRows = [1.9, 2.55, 3.2, 3.85, 4.5];
spikeRows.forEach((sy) => {
  for (let sx = -1.7; sx <= 1.7; sx += 0.32) {
    if (Math.abs(sx) < 0.16) continue;

    const washer = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.04), ironMat);
    washer.position.set(sx, sy, 13.72);
    gateAssembly.add(washer);

    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.45, 8), ironMat);
    spike.rotation.x = Math.PI / 2;
    spike.position.set(sx, sy, 13.96);
    spike.castShadow = true;
    gateAssembly.add(spike);
  }
});

// Pedestrian Wicket Gate ("Dindi Darwaja") cut into lower right leaf (Render Image 3)
const wicketFrame = new THREE.Mesh(new THREE.BoxGeometry(0.92, 1.85, 0.35), dressedStoneMat);
wicketFrame.position.set(0.95, 1.15, 13.58);
gateAssembly.add(wicketFrame);

const wicketDoor = new THREE.Mesh(new THREE.BoxGeometry(0.78, 1.7, 0.36), carvedTimberMat);
wicketDoor.position.set(0.95, 1.15, 13.58);
gateAssembly.add(wicketDoor);

const wicketKnocker = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.018, 6, 12), ironMat);
wicketKnocker.position.set(1.12, 1.15, 13.78);
gateAssembly.add(wicketKnocker);

portalGroup.add(gateAssembly);

// Row of Sculpted Stone Bracket Corbels supporting Nagarkhana Balcony (Render Image 3)
for (let bx = -2.8; bx <= 2.8; bx += 0.56) {
  const corbel = createStoneCorbel(0.22, 0.75, 0.95);
  corbel.position.set(bx, 8.5, 14.15);
  portalGroup.add(corbel);
}

dilliDarwazaGroup.add(portalGroup);

// ── 1.4 NAGARKHANA (UPPER TIMBER MUSIC GALLERY) (Render Image 3) ─────────────
const nagarkhanaGroup = new THREE.Group();
nagarkhanaGroup.name = "Nagarkhana_Balcony_Gallery";

// Cantilevered Wooden Balcony Floor Plinth
const nagarFloor = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.38, 4.4), carvedTimberMat);
nagarFloor.position.set(0, 8.68, 12.6);
nagarFloor.castShadow = true;
nagarkhanaGroup.add(nagarFloor);

// Front Turned Wooden Balustrade Railing (Render Image 3)
const frontRail = createBalustrade(6.6, 0.85);
frontRail.position.set(0, 8.88, 14.75);
nagarkhanaGroup.add(frontRail);

// 5 Carved Wooden Cypress Columns (Suru Pillars) forming 4 Cusped Arches (Render Image 3)
const numPillars = 5;
const pillarSpacing = 6.2 / (numPillars - 1);
for (let p = 0; p < numPillars; p++) {
  const px = -3.1 + p * pillarSpacing;
  const col = createSuruColumn(2.6);
  col.position.set(px, 8.88, 14.65);
  nagarkhanaGroup.add(col);

  if (p < numPillars - 1) {
    const arch = createCuspedArch(pillarSpacing, 0.6, 0.16);
    arch.position.set(px + pillarSpacing / 2, 10.75, 14.58);
    nagarkhanaGroup.add(arch);
  }
}

// Overhanging Sloping Wooden Chhajja Eaves with Timber Struts (Render Image 3)
const chhajjaMesh = new THREE.Mesh(new THREE.BoxGeometry(7.4, 0.18, 1.6), carvedTimberMat);
chhajjaMesh.rotation.x = 0.25;
chhajjaMesh.position.set(0, 11.6, 15.2);
chhajjaMesh.castShadow = true;
nagarkhanaGroup.add(chhajjaMesh);

for (let sx = -3.0; sx <= 3.0; sx += 1.0) {
  const strut = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.65, 0.1), carvedTimberMat);
  strut.rotation.x = 0.52;
  strut.position.set(sx, 11.35, 14.72);
  nagarkhanaGroup.add(strut);
}

// Flat/Shallow Timber Roof over Nagarkhana (Render Image 3)
const nagarRoof = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.35, 4.6), carvedTimberMat);
nagarRoof.position.set(0, 11.75, 12.6);
nagarRoof.castShadow = true;
nagarkhanaGroup.add(nagarRoof);

// Lime-wash Plaster Side Walls with Arched Windows
for (let side of [-1, 1]) {
  const sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.7, 4.2), stuccoMat);
  sideWall.position.set(side * 3.35, 10.15, 12.6);
  nagarkhanaGroup.add(sideWall);

  const winFrame = new THREE.Mesh(new THREE.BoxGeometry(0.38, 1.2, 0.85), carvedTimberMat);
  winFrame.position.set(side * 3.35, 10.2, 12.6);
  nagarkhanaGroup.add(winFrame);
}

// Rear Elevation: Balustrade overlooking the inner garden
const rearRail = createBalustrade(6.4, 0.85);
rearRail.position.set(0, 8.88, 10.45);
nagarkhanaGroup.add(rearRail);

dilliDarwazaGroup.add(nagarkhanaGroup);

// Rear Courtyard Exits: Two Arched Portals exiting into the inner garden
for (let ex of [-2.0, 2.0]) {
  const rearDoor = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.6, 0.22), teakGateMat);
  rearDoor.position.set(ex, 1.8, 9.8);
  dilliDarwazaGroup.add(rearDoor);
}

exteriorScene.add(dilliDarwazaGroup);

// ── 1.5 TWO-TONE RAMPARTS & 4 OTHER GATES (Render Images 1, 3, 4, 5) ─────────
// Authentic Maratha fortification: Lower ~60% Grey Basalt Stone, Upper ~40% Terracotta Brick!
const fortWallsGroup = new THREE.Group();
fortWallsGroup.name = "Citadel_Perimeter_Fortifications_And_Gates";

/**
 * Builds a two-tone rampart curtain wall:
 * - Lower section: Grey basalt stone wall (y = 0 to 5.6m, depth = 3.2m)
 * - Upper section: Terracotta red brick parapet (y = 5.6 to 8.8m, depth = 1.2m on outer face)
 * - Inner banquette walkway at y = 5.6m behind outer parapet
 * - Vertical loophole slits cut into the brickwork every 2.2m
 */
function createTwoToneWallSection(length, isAlongX = true) {
  const wallGroup = new THREE.Group();

  if (isAlongX) {
    // 1. Lower Basalt Stone Wall
    const stoneBase = new THREE.Mesh(
      new THREE.BoxGeometry(length, 5.6, 3.2),
      basaltWallMat
    );
    stoneBase.position.set(0, 2.8, 0);
    stoneBase.castShadow = true;
    stoneBase.receiveShadow = true;
    wallGroup.add(stoneBase);

    // 2. Inner Paved Banquette Walkway
    const walkway = new THREE.Mesh(
      new THREE.BoxGeometry(length, 0.2, 1.8),
      pavingMat
    );
    walkway.position.set(0, 5.6, -0.6);
    wallGroup.add(walkway);

    // 3. Upper Terracotta Brick Parapet Wall
    const brickParapet = new THREE.Mesh(
      new THREE.BoxGeometry(length, 3.2, 1.2),
      brickParapetMat
    );
    brickParapet.position.set(0, 7.2, 0.9);
    brickParapet.castShadow = true;
    wallGroup.add(brickParapet);

    // 4. Angled Brick Coping Rim
    const coping = new THREE.Mesh(
      new THREE.BoxGeometry(length, 0.18, 1.35),
      dressedStoneMat
    );
    coping.position.set(0, 8.85, 0.9);
    wallGroup.add(coping);

    // 5. Vertical Loophole Slits cut into the brickwork
    const numSlits = Math.max(1, Math.floor(length / 2.2));
    const slitSpacing = length / (numSlits + 1);
    for (let i = 1; i <= numSlits; i++) {
      const sx = -length / 2 + i * slitSpacing;
      const slit = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.2, 1.25), darkBasaltMat);
      slit.position.set(sx, 7.3, 0.9);
      wallGroup.add(slit);
    }
  } else {
    // Wall along Z axis
    // 1. Lower Basalt Stone Wall
    const stoneBase = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 5.6, length),
      basaltWallMat
    );
    stoneBase.position.set(0, 2.8, 0);
    stoneBase.castShadow = true;
    stoneBase.receiveShadow = true;
    wallGroup.add(stoneBase);

    // 2. Inner Paved Banquette Walkway
    const walkway = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.2, length),
      pavingMat
    );
    walkway.position.set(0, 5.6, 0);
    wallGroup.add(walkway);

    // 3. Upper Terracotta Brick Parapet Wall
    const brickParapet = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 3.2, length),
      brickParapetMat
    );
    brickParapet.position.set(0, 7.2, 0);
    brickParapet.castShadow = true;
    wallGroup.add(brickParapet);

    // 4. Coping Rim
    const coping = new THREE.Mesh(
      new THREE.BoxGeometry(1.35, 0.18, length),
      dressedStoneMat
    );
    coping.position.set(0, 8.85, 0);
    wallGroup.add(coping);

    // 5. Slits
    const numSlits = Math.max(1, Math.floor(length / 2.2));
    const slitSpacing = length / (numSlits + 1);
    for (let i = 1; i <= numSlits; i++) {
      const sz = -length / 2 + i * slitSpacing;
      const slit = new THREE.Mesh(new THREE.BoxGeometry(1.25, 1.2, 0.16), darkBasaltMat);
      slit.position.set(0, 7.3, sz);
      wallGroup.add(slit);
    }
  }

  return wallGroup;
}

// North Wall Flanking Dilli Darwaza
const nWallW = createTwoToneWallSection(16.5, true);
nWallW.position.set(-18.5, 0, 12);
fortWallsGroup.add(nWallW);

const nWallE = createTwoToneWallSection(16.5, true);
nWallE.position.set(18.5, 0, 12);
fortWallsGroup.add(nWallE);

// West Wall (with Jambhul / Narayan Darwaza)
const wWallN = createTwoToneWallSection(16, false);
wWallN.position.set(-27.5, 0, 1);
// Parapet faces West (-X)
wWallN.children[1].position.x = 0.6; // walkway inner
wWallN.children[2].position.x = -0.9; // brick parapet outer
wWallN.children[3].position.x = -0.9; // coping
for (let c = 4; c < wWallN.children.length; c++) wWallN.children[c].position.x = -0.9;
fortWallsGroup.add(wWallN);

const wWallS = createTwoToneWallSection(16, false);
wWallS.position.set(-27.5, 0, -21);
wWallS.children[1].position.x = 0.6;
wWallS.children[2].position.x = -0.9;
wWallS.children[3].position.x = -0.9;
for (let c = 4; c < wWallS.children.length; c++) wWallS.children[c].position.x = -0.9;
fortWallsGroup.add(wWallS);

// GATE 2: JAMBHUL DARWAZA (NARAYAN GATE) - Flush postern within West curtain wall
const jambhulGateGroup = new THREE.Group();
jambhulGateGroup.name = "Jambhul_Narayan_Darwaza";

const jambhulDoors = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.8, 2.2), teakGateMat);
jambhulDoors.position.set(-27.5, 2.4, -17);
jambhulGateGroup.add(jambhulDoors);

for (let iy = 0.8; iy <= 4.4; iy += 0.9) {
  const band = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.1, 2.2), ironMat);
  band.position.set(-27.5, iy, -17);
  jambhulGateGroup.add(band);
}
fortWallsGroup.add(jambhulGateGroup);

// East Wall (Continuous curtain wall with flush Mastani & Khidki posterns)
const eWallN = createTwoToneWallSection(16, false);
eWallN.position.set(27.5, 0, 1);
eWallN.children[1].position.x = -0.6; // walkway inner
eWallN.children[2].position.x = 0.9; // brick parapet outer
eWallN.children[3].position.x = 0.9;
for (let c = 4; c < eWallN.children.length; c++) eWallN.children[c].position.x = 0.9;
fortWallsGroup.add(eWallN);

const eWallS = createTwoToneWallSection(16, false);
eWallS.position.set(27.5, 0, -21);
eWallS.children[1].position.x = -0.6;
eWallS.children[2].position.x = 0.9;
eWallS.children[3].position.x = 0.9;
for (let c = 4; c < eWallS.children.length; c++) eWallS.children[c].position.x = 0.9;
fortWallsGroup.add(eWallS);

// GATE 3: MASTANI DARWAZA (ALI BAHADUR GATE) - Flush postern within East curtain wall
const mastaniGateGroup = new THREE.Group();
mastaniGateGroup.name = "Mastani_Darwaza";

const mastaniDoor = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.6, 2.0), teakGateMat);
mastaniDoor.position.set(27.5, 2.3, 1);
mastaniGateGroup.add(mastaniDoor);

for (let iy = 0.8; iy <= 4.0; iy += 0.8) {
  const band = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.1, 2.0), ironMat);
  band.position.set(27.5, iy, 1);
  mastaniGateGroup.add(band);
}
fortWallsGroup.add(mastaniGateGroup);

// GATE 4: KHIDKI DARWAZA (WINDOW GATE) - Flush postern within East curtain wall
const khidkiGateGroup = new THREE.Group();
khidkiGateGroup.name = "Khidki_Darwaza";

const khidkiDoor = new THREE.Mesh(new THREE.BoxGeometry(0.2, 4.6, 2.0), teakGateMat);
khidkiDoor.position.set(27.5, 2.3, -21);
khidkiGateGroup.add(khidkiDoor);

for (let iy = 0.8; iy <= 4.0; iy += 0.8) {
  const band = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.1, 2.0), ironMat);
  band.position.set(27.5, iy, -21);
  khidkiGateGroup.add(band);
}
fortWallsGroup.add(khidkiGateGroup);

// South Wall (Rear with Ganesh Darwaza)
const sWallW = createTwoToneWallSection(22, true);
sWallW.position.set(-13.5, 0, -32);
// Parapet faces South (-Z)
sWallW.children[1].position.z = 0.6; // walkway inner
sWallW.children[2].position.z = -0.9; // brick parapet outer
sWallW.children[3].position.z = -0.9;
for (let c = 4; c < sWallW.children.length; c++) sWallW.children[c].position.z = -0.9;
fortWallsGroup.add(sWallW);

const sWallE = createTwoToneWallSection(22, true);
sWallE.position.set(13.5, 0, -32);
sWallE.children[1].position.z = 0.6;
sWallE.children[2].position.z = -0.9;
sWallE.children[3].position.z = -0.9;
for (let c = 4; c < sWallE.children.length; c++) sWallE.children[c].position.z = -0.9;
fortWallsGroup.add(sWallE);

// GATE 5: GANESH DARWAZA - Flush postern within South rear curtain wall
const ganeshGateGroup = new THREE.Group();
ganeshGateGroup.name = "Ganesh_Darwaza";

const ganeshDoor = new THREE.Mesh(new THREE.BoxGeometry(2.2, 4.8, 0.2), teakGateMat);
ganeshDoor.position.set(8, 2.4, -32);
ganeshGateGroup.add(ganeshDoor);

for (let iy = 0.8; iy <= 4.2; iy += 0.85) {
  const band = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.1, 0.28), ironMat);
  band.position.set(8, iy, -32);
  ganeshGateGroup.add(band);
}
fortWallsGroup.add(ganeshGateGroup);

// ── SOLID STONE REVETMENT RAMPS (Matching 3D Render Images 1 & 2) ─────────────
// Authentic sloping stone ramps built against inner wall face leading to rampart walkway
function createSolidRampWedge(length, height = 5.4, width = 2.6) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(length, 0);
  shape.lineTo(length, height);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: width,
    bevelEnabled: false,
  });
  const mesh = new THREE.Mesh(geo, basaltWallMat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// 1. South Wall Ramp: Runs along inner face of South Wall (Z = -30.4) from X = -8 to X = -22
const southRamp = createSolidRampWedge(14, 5.4, 2.6);
// Slopes up towards -X: flip geometry
southRamp.rotation.y = Math.PI;
southRamp.position.set(-8, 0, -30.4);
fortWallsGroup.add(southRamp);

// 2. West Wall Ramp: Runs along inner face of West Wall (X = -25.9) from Z = -13 to Z = -25
const westRamp = createSolidRampWedge(12, 5.4, 2.6);
westRamp.rotation.y = -Math.PI / 2;
westRamp.position.set(-25.9, 0, -13);
fortWallsGroup.add(westRamp);

// 7 Secondary Fortification Bastions around perimeter (NW, NE, SW, SE, West, East, South)
// Built with matching authentic details: stepped plinth, lower cylinder, mid-cornice, arrow slits, upper faceted drum, crenellated parapet
const bastionCoords = [
  { x: -27.5, z: 12, name: "NW_Corner_Bastion" },
  { x: 27.5, z: 12, name: "NE_Corner_Bastion" },
  { x: -27.5, z: -32, name: "SW_Corner_Bastion" },
  { x: 27.5, z: -32, name: "SE_Corner_Bastion" },
  { x: -27.5, z: -10, name: "West_Mid_Bastion" },
  { x: 27.5, z: -10, name: "East_Mid_Bastion" },
  { x: 0, z: -32, name: "South_Mid_Bastion" },
];

bastionCoords.forEach((b) => {
  const bGroup = new THREE.Group();
  bGroup.name = b.name;

  // Stepped Plinth
  const bPlinth = new THREE.Mesh(new THREE.CylinderGeometry(4.0, 4.4, 0.6, 24), dressedStoneMat);
  bPlinth.position.y = 0.3;
  bGroup.add(bPlinth);

  // Lower Cylinder
  const bLower = new THREE.Mesh(new THREE.CylinderGeometry(3.7, 4.0, 5.8, 24), basaltTowerMat);
  bLower.position.y = 3.5;
  bLower.castShadow = true;
  bGroup.add(bLower);

  // Mid-Cornice & Slits
  for (let s = 0; s < 8; s++) {
    const angle = (s / 8) * Math.PI * 2;
    const slit = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.1, 0.25), darkBasaltMat);
    slit.position.set(Math.sin(angle) * 3.75, 5.8, Math.cos(angle) * 3.75);
    slit.rotation.y = angle;
    bGroup.add(slit);
  }

  const bCornice = new THREE.Mesh(new THREE.CylinderGeometry(4.1, 3.8, 0.3, 24), dressedStoneMat);
  bCornice.position.y = 6.5;
  bGroup.add(bCornice);

  // Upper Faceted Drum
  const bUpper = new THREE.Mesh(new THREE.CylinderGeometry(3.7, 3.9, 2.5, 16), basaltTowerMat);
  bUpper.position.y = 7.9;
  bUpper.castShadow = true;
  bGroup.add(bUpper);

  // Arched Windows
  for (let w = 0; w < 6; w++) {
    const angle = (w / 6) * Math.PI * 2;
    const win = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.85, 0.3), darkBasaltMat);
    win.position.set(Math.sin(angle) * 3.75, 8.0, Math.cos(angle) * 3.75);
    win.rotation.y = angle;
    bGroup.add(win);
  }

  // Parapet & Terrace
  const bTopCornice = new THREE.Mesh(new THREE.CylinderGeometry(4.1, 3.7, 0.25, 24), dressedStoneMat);
  bTopCornice.position.y = 9.25;
  bGroup.add(bTopCornice);

  // Solid Merlons around secondary bastion
  for (let m = 0; m < 8; m++) {
    const angle = (m / 8) * Math.PI * 2;
    const merlon = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.85, 0.38), basaltTowerMat);
    merlon.position.set(Math.sin(angle) * 3.85, 9.8, Math.cos(angle) * 3.85);
    merlon.rotation.y = angle;
    bGroup.add(merlon);

    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.12, 0.42), dressedStoneMat);
    cap.position.set(Math.sin(angle) * 3.85, 10.28, Math.cos(angle) * 3.85);
    cap.rotation.y = angle;
    bGroup.add(cap);
  }

  const bTerrace = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 3.8, 0.2, 24), pavingMat);
  bTerrace.position.y = 9.3;
  bGroup.add(bTerrace);

  bGroup.position.set(b.x, 0, b.z);
  fortWallsGroup.add(bGroup);
});

exteriorScene.add(fortWallsGroup);

// ── 1.6 INTERNAL GARDENS, HAZARI KARANJE & ROYAL COURTYARDS (Render Images 1 & 2)
const gardenGroup = new THREE.Group();
gardenGroup.name = "Citadel_Royal_Gardens_Complex";

// Central Paved Processional Avenue leading from Delhi Gate to Hazari Karanje
const centralAve = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.2, 42), pavingMat);
centralAve.position.set(0, 0.1, -9);
centralAve.receiveShadow = true;
gardenGroup.add(centralAve);

// ── HAZARI KARANJE (16-PETAL LOTUS FOUNTAIN) (Render Images 1 & 2) ───────────
const hazariKaranje = new THREE.Group();
hazariKaranje.name = "Hazari_Karanje_16_Petal_Lotus";

// Sunken court stone plinth retaining wall
const kPlinth = new THREE.Mesh(new THREE.BoxGeometry(11.2, 0.6, 11.2), dressedStoneMat);
kPlinth.position.set(0, 0.3, -5);
kPlinth.receiveShadow = true;
hazariKaranje.add(kPlinth);

// Perimeter Balustrade with round corner posts and spherical finials (Render Image 2)
const kRailN = createBalustrade(10.4, 0.75);
kRailN.position.set(0, 0.6, -0.1);
hazariKaranje.add(kRailN);

const kRailS = createBalustrade(10.4, 0.75);
kRailS.position.set(0, 0.6, -9.9);
hazariKaranje.add(kRailS);

const kRailW = createBalustrade(9.8, 0.75);
kRailW.rotation.y = Math.PI / 2;
kRailW.position.set(-5.1, 0.6, -5);
hazariKaranje.add(kRailW);

const kRailE = createBalustrade(9.8, 0.75);
kRailE.rotation.y = -Math.PI / 2;
kRailE.position.set(5.1, 0.6, -5);
hazariKaranje.add(kRailE);

// Sunken Inner Basin
const kBasin = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.4, 8.6), basaltWallMat);
kBasin.position.set(0, 0.4, -5);
hazariKaranje.add(kBasin);

// Authentic 16-Petal Carved White Marble Lotus (Outer & Inner Petal Rings)
const lotusOuterShape = createLotusShape(3.0, 0.55);
const lotusOuterGeo = new THREE.ExtrudeGeometry(lotusOuterShape, {
  depth: 0.35,
  bevelEnabled: true,
  bevelThickness: 0.08,
  bevelSize: 0.08,
  bevelSegments: 3,
});
const lotusOuterMesh = new THREE.Mesh(lotusOuterGeo, marbleLotusMat);
lotusOuterMesh.rotation.x = -Math.PI / 2;
lotusOuterMesh.position.set(0, 0.6, -5);
lotusOuterMesh.castShadow = true;
hazariKaranje.add(lotusOuterMesh);

const lotusInnerShape = createLotusShape(1.8, 0.35);
const lotusInnerGeo = new THREE.ExtrudeGeometry(lotusInnerShape, {
  depth: 0.3,
  bevelEnabled: true,
  bevelThickness: 0.05,
  bevelSize: 0.05,
  bevelSegments: 3,
});
const lotusInnerMesh = new THREE.Mesh(lotusInnerGeo, marbleLotusMat);
lotusInnerMesh.rotation.x = -Math.PI / 2;
lotusInnerMesh.rotation.z = Math.PI / 16;
lotusInnerMesh.position.set(0, 0.9, -5);
lotusInnerMesh.castShadow = true;
hazariKaranje.add(lotusInnerMesh);

const kWater = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.1, 16), waterMat);
kWater.position.set(0, 1.15, -5);
hazariKaranje.add(kWater);

const kJet = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.28, 0.8, 12), brassMat);
kJet.position.set(0, 1.5, -5);
hazariKaranje.add(kJet);

gardenGroup.add(hazariKaranje);

// ── CHIMAN BAUG WATER COMPLEX & PILLARED VERANDAH ────────────────────────────
const chimanGroup = new THREE.Group();
chimanGroup.name = "Chiman_Baug_Complex";

const cTankPlinth = new THREE.Mesh(new THREE.BoxGeometry(11, 0.6, 11), dressedStoneMat);
cTankPlinth.position.set(-14.5, 0.3, -16);
cTankPlinth.receiveShadow = true;
chimanGroup.add(cTankPlinth);

const cPoolWater = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.1, 4.8), waterMat);
cPoolWater.position.set(-14.5, 0.62, -16);
chimanGroup.add(cPoolWater);

const verandahGroup = new THREE.Group();
verandahGroup.name = "Chiman_Baug_Arcaded_Verandah";

const vFloor = new THREE.Mesh(new THREE.BoxGeometry(14, 0.35, 4.2), pavingMat);
vFloor.position.set(-14.5, 0.18, -23.5);
verandahGroup.add(vFloor);

for (let vx = -20; vx <= -9; vx += 2.2) {
  const vCol = createSuruColumn(2.6);
  vCol.position.set(vx, 0.35, -21.8);
  verandahGroup.add(vCol);
}

const vRoof = new THREE.Mesh(new THREE.BoxGeometry(14.6, 0.3, 4.8), terracottaRoofMat);
vRoof.rotation.x = 0.22;
vRoof.position.set(-14.5, 3.4, -23.8);
vRoof.castShadow = true;
verandahGroup.add(vRoof);

chimanGroup.add(verandahGroup);
gardenGroup.add(chimanGroup);

// ── RECTANGULAR MIRROR RESERVOIR POOL ────────────────────────────────────────
const reservoirGroup = new THREE.Group();
reservoirGroup.name = "Central_Mirror_Reservoir";

const rPlinth = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.5, 8.5), dressedStoneMat);
rPlinth.position.set(12.5, 0.25, -16);
reservoirGroup.add(rPlinth);

const rWater = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.1, 6.2), waterMat);
rWater.position.set(12.5, 0.52, -16);
reservoirGroup.add(rWater);

const rRailN = createBalustrade(9.8, 0.7);
rRailN.position.set(12.5, 0.5, -12);
reservoirGroup.add(rRailN);

const rRailS = createBalustrade(9.8, 0.7);
rRailS.position.set(12.5, 0.5, -20);
reservoirGroup.add(rRailS);

gardenGroup.add(reservoirGroup);

// ── PALACE FOUNDATION PLINTH RUINS (Render Images 1 & 2) ─────────────────────
const plinthsGroup = new THREE.Group();
plinthsGroup.name = "Palace_Plinth_Ruins";

const plinthBoxes = [
  { x: 0, z: -21, w: 18, d: 8, h: 0.65 },
  { x: -14, z: -8, w: 9, d: 7, h: 0.5 },
  { x: 14, z: -8, w: 9, d: 7, h: 0.5 },
  { x: 0, z: -27, w: 14, d: 6, h: 0.8 },
];

plinthBoxes.forEach((b) => {
  const pMesh = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), dressedStoneMat);
  pMesh.position.set(b.x, b.h / 2, b.z);
  pMesh.receiveShadow = true;
  plinthsGroup.add(pMesh);

  for (let sx = -b.w / 2 + 1.5; sx <= b.w / 2 - 1.5; sx += 3.0) {
    for (let sz = -b.d / 2 + 1.5; sz <= b.d / 2 - 1.5; sz += 3.0) {
      const stump = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.4, 0.45, 8),
        basaltWallMat
      );
      stump.position.set(b.x + sx, b.h + 0.22, b.z + sz);
      plinthsGroup.add(stump);
    }
  }
});
gardenGroup.add(plinthsGroup);

exteriorScene.add(gardenGroup);

await saveSceneToGLB(
  exteriorScene,
  path.join(OUT_DIR_EXTERIOR, "shaniwar-wada-exterior.glb")
);

// ═════════════════════════════════════════════════════════════════════════════
// 2. BUILD HIGH-FIDELITY SHANIWAR WADA INTERIOR WALKTHROUGH MODEL (Devdi)
// ═════════════════════════════════════════════════════════════════════════════
console.log("Building Shaniwar Wada Interior Walkthrough Model (Devdi Guard Hall)...");
const interiorScene = new THREE.Scene();
interiorScene.name = "ShaniwarWada_Master_Interior";

// Dilli Darwaza Devdi Corridor Floor (Walkable granite flagstone)
const intFloor = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.4, 38), pavingMat);
intFloor.position.set(0, -0.2, 0);
intFloor.name = "Walkable_Devdi_Floor";
interiorScene.add(intFloor);

// Left & Right Granite Ashlar Walls
const intWallW = new THREE.Mesh(new THREE.BoxGeometry(1.6, 7.5, 38), basaltWallMat);
intWallW.position.set(-5.0, 3.75, 0);
interiorScene.add(intWallW);

const intWallE = new THREE.Mesh(new THREE.BoxGeometry(1.6, 7.5, 38), basaltWallMat);
intWallE.position.set(5.0, 3.75, 0);
interiorScene.add(intWallE);

// Pointed Arch Ribs across the vaulted corridor ceiling
for (let z = -14; z <= 14; z += 4.5) {
  const rib = new THREE.Mesh(
    new THREE.TorusGeometry(4.2, 0.32, 10, 20, Math.PI),
    dressedStoneMat
  );
  rib.position.set(0, 5.2, z);
  rib.rotation.x = -Math.PI / 2;
  rib.rotation.z = Math.PI / 2;
  interiorScene.add(rib);
}

// Heavy Timber Overhead Rafter Beams
for (let bz = -16; bz <= 16; bz += 4.5) {
  const beam = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.42, 0.55), carvedTimberMat);
  beam.position.set(0, 6.8, bz);
  interiorScene.add(beam);
}

// Sentry Alcoves: Chaukidar Stone Guard Benches (Deep seats for Maratha sentries)
for (let side of [-1, 1]) {
  const bench = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.85, 6.5), dressedStoneMat);
  bench.position.set(side * 3.7, 0.42, 2.5);
  interiorScene.add(bench);

  for (let lz of [-2, 3]) {
    const sconce = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.7, 0.28), ironMat);
    sconce.position.set(side * 4.15, 3.4, lz);
    interiorScene.add(sconce);
  }
}

// Front North Entrance: The spiked Dilli Darwaza doors seen from inside
const frontGateFrame = new THREE.Mesh(new THREE.BoxGeometry(6.2, 7.5, 0.8), dressedStoneMat);
frontGateFrame.position.set(0, 3.75, 17.5);
interiorScene.add(frontGateFrame);

// Rear South Exit: Archway opening directly onto the sunny Hazari Karanje courtyard
const rearArchway = new THREE.Mesh(new THREE.BoxGeometry(6.2, 7.5, 0.8), dressedStoneMat);
rearArchway.position.set(0, 3.75, -17.5);
interiorScene.add(rearArchway);

// Sunlit Courtyard Glimpse (Hazari Karanje lotus fountain & lawn visible outside)
const courtPaving = new THREE.Mesh(new THREE.BoxGeometry(32, 0.3, 22), pavingMat);
courtPaving.position.set(0, -0.15, -28);
interiorScene.add(courtPaving);

const courtLotus = new THREE.Mesh(
  new THREE.ExtrudeGeometry(createLotusShape(2.4, 0.4), { depth: 0.3, bevelEnabled: true }),
  marbleLotusMat
);
courtLotus.rotation.x = -Math.PI / 2;
courtLotus.position.set(0, 0.2, -28);
interiorScene.add(courtLotus);

const courtJet = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.2, 0.6, 12), brassMat);
courtJet.position.set(0, 0.8, -28);
interiorScene.add(courtJet);

await saveSceneToGLB(
  interiorScene,
  path.join(OUT_DIR_INTERIOR, "shaniwar-wada-interior.glb")
);

// ═════════════════════════════════════════════════════════════════════════════
// 3. BUILD HISTORICAL 1732 CE RECONSTRUCTION MODEL (Megadambara 7-Storey Palace)
// ═════════════════════════════════════════════════════════════════════════════
console.log("Building Shaniwar Wada 1732 CE Reconstruction Model...");
const historicalScene = exteriorScene.clone(true);
historicalScene.name = "ShaniwarWada_1732_Reconstruction";

const palaceTowerGroup = new THREE.Group();
palaceTowerGroup.name = "Megadambara_Seven_Storey_Palace_Superstructure";

const storeys = [
  { level: 1, y: 1.0, w: 22, d: 15, h: 3.8, name: "Storey_1_Thorlya_Rayancha_Diwankhana" },
  { level: 2, y: 4.8, w: 20, d: 13.5, h: 3.5, name: "Storey_2_Ganesh_Mahal" },
  { level: 3, y: 8.3, w: 18, d: 12, h: 3.4, name: "Storey_3_Arsa_Mahal_Mirror_Hall" },
  { level: 4, y: 11.7, w: 16, d: 10.5, h: 3.2, name: "Storey_4_Royal_Suites" },
  { level: 5, y: 14.9, w: 14, d: 9, h: 3.0, name: "Storey_5_Private_Quarters" },
  { level: 6, y: 17.9, w: 12, d: 7.5, h: 2.8, name: "Storey_6_Observation_Chamber" },
  { level: 7, y: 20.7, w: 9.5, d: 6, h: 2.5, name: "Storey_7_Megadambara_Crown_Pavilion" },
];

storeys.forEach((s) => {
  const sGroup = new THREE.Group();
  sGroup.name = s.name;

  const core = new THREE.Mesh(new THREE.BoxGeometry(s.w - 1.2, s.h - 0.4, s.d - 1.2), stuccoMat);
  core.position.y = s.y + s.h / 2;
  core.castShadow = true;
  sGroup.add(core);

  const floorPlinth = new THREE.Mesh(new THREE.BoxGeometry(s.w, 0.35, s.d), carvedTimberMat);
  floorPlinth.position.y = s.y;
  floorPlinth.castShadow = true;
  sGroup.add(floorPlinth);

  const bFront = createBalustrade(s.w - 0.4, 0.75);
  bFront.position.set(0, s.y + 0.18, s.d / 2 - 0.1);
  sGroup.add(bFront);

  const bBack = createBalustrade(s.w - 0.4, 0.75);
  bBack.position.set(0, s.y + 0.18, -s.d / 2 + 0.1);
  sGroup.add(bBack);

  const bLeft = createBalustrade(s.d - 0.4, 0.75);
  bLeft.rotation.y = Math.PI / 2;
  bLeft.position.set(-s.w / 2 + 0.1, s.y + 0.18, 0);
  sGroup.add(bLeft);

  const bRight = createBalustrade(s.d - 0.4, 0.75);
  bRight.rotation.y = -Math.PI / 2;
  bRight.position.set(s.w / 2 - 0.1, s.y + 0.18, 0);
  sGroup.add(bRight);

  for (let px = -s.w / 2 + 1.2; px <= s.w / 2 - 1.2; px += 2.2) {
    const col = createSuruColumn(s.h - 0.4);
    col.position.set(px, s.y + 0.18, s.d / 2 - 0.2);
    sGroup.add(col);
  }

  const eaveFront = new THREE.Mesh(new THREE.BoxGeometry(s.w + 1.2, 0.22, 1.4), terracottaRoofMat);
  eaveFront.rotation.x = 0.25;
  eaveFront.position.set(0, s.y + s.h, s.d / 2 + 0.4);
  eaveFront.castShadow = true;
  sGroup.add(eaveFront);

  palaceTowerGroup.add(sGroup);
});

const topRoof = new THREE.Mesh(new THREE.ConeGeometry(7.2, 2.6, 4), terracottaRoofMat);
topRoof.rotation.y = Math.PI / 4;
topRoof.position.set(0, 24.5, 0);
topRoof.castShadow = true;
palaceTowerGroup.add(topRoof);

for (let fx of [-2.5, 0, 2.5]) {
  const finial = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.9, 12), brassMat);
  finial.position.set(fx, 26.2, 0);
  palaceTowerGroup.add(finial);
}

palaceTowerGroup.position.set(0, 0, -21);
historicalScene.add(palaceTowerGroup);

await saveSceneToGLB(
  historicalScene,
  path.join(OUT_DIR_HISTORICAL, "shaniwar-wada-1732-reconstruction.glb")
);

console.log("✓ All 3 upgraded authentic Shaniwar Wada 3D models generated successfully!");
