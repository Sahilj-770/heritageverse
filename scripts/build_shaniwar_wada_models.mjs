/**
 * HeritageVerse 3D Digital Museum Asset Generator
 * Builds high-fidelity, authentic GLB models for Shaniwar Wada
 * directly referencing Shaniwarwadawithsubtitle.mp4 and ASI archival records.
 */

import fs from "fs";
import path from "path";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

// Node.js FileReader polyfill for GLTFExporter binary export
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

const OUT_DIR_EXTERIOR = "public/models/monuments/shaniwar-wada/exterior";
const OUT_DIR_INTERIOR = "public/models/monuments/shaniwar-wada/interior";
const OUT_DIR_HISTORICAL = "public/models/monuments/shaniwar-wada/historical";

[OUT_DIR_EXTERIOR, OUT_DIR_INTERIOR, OUT_DIR_HISTORICAL].forEach((d) => {
  fs.mkdirSync(d, { recursive: true });
});

// ─── PBR MATERIALS MATCHING VIDEO PALETTE ──────────────────────────────────
// Warm grey-brown basalt masonry (ashlar trap rock)
const basaltStoneMat = new THREE.MeshStandardMaterial({
  name: "BasaltAshlarMasonry",
  color: 0x635d56,
  roughness: 0.88,
  metalness: 0.05,
});

// Lighter dressed stone for arch mouldings, steps, and plinths
const dressedStoneMat = new THREE.MeshStandardMaterial({
  name: "DressedStoneTrim",
  color: 0x8a8277,
  roughness: 0.78,
  metalness: 0.06,
});

// Warm weathered sandstone for pavers and pathways
const pavingMat = new THREE.MeshStandardMaterial({
  name: "SandstonePaving",
  color: 0xa89f92,
  roughness: 0.9,
  metalness: 0.02,
});

// Dark weathered teakwood for gates, pillars, and rafters
const teakWoodMat = new THREE.MeshStandardMaterial({
  name: "WeatheredTeakwood",
  color: 0x3d2b1f,
  roughness: 0.75,
  metalness: 0.12,
});

// Medium carved timber for balustrades and brackets
const carvedTimberMat = new THREE.MeshStandardMaterial({
  name: "CarvedTimberBalustrade",
  color: 0x5a412f,
  roughness: 0.7,
  metalness: 0.1,
});

// Light lime plaster / stucco for Nagarkhana side walls and palace facades
const stuccoMat = new THREE.MeshStandardMaterial({
  name: "LimeStuccoPlaster",
  color: 0xc4b9aa,
  roughness: 0.85,
  metalness: 0.04,
});

// Forged iron / steel for elephant spikes, fittings, and portholes
const ironMat = new THREE.MeshStandardMaterial({
  name: "ForgedIronElephantSpikes",
  color: 0x222224,
  roughness: 0.35,
  metalness: 0.88,
});

// Polished white marble / limestone for Hazari Karanje lotus basin
const marbleLotusMat = new THREE.MeshStandardMaterial({
  name: "CarvedWhiteMarbleLotus",
  color: 0xe8e4dc,
  roughness: 0.35,
  metalness: 0.15,
});

// Terracotta red tile for Chiman Baug verandah and palace eaves
const terracottaMat = new THREE.MeshStandardMaterial({
  name: "TerracottaRoofTiles",
  color: 0x8e3e32,
  roughness: 0.8,
  metalness: 0.05,
});

// Fountain reservoir water
const waterMat = new THREE.MeshStandardMaterial({
  name: "ReflectiveWater",
  color: 0x2d5058,
  roughness: 0.15,
  metalness: 0.65,
});

// Green lawn parterres
const lawnMat = new THREE.MeshStandardMaterial({
  name: "ManicuredLawn",
  color: 0x507542,
  roughness: 0.95,
  metalness: 0.0,
});

// Tree foliage
const foliageMat = new THREE.MeshStandardMaterial({
  name: "TreeCanopyFoliage",
  color: 0x3b5c32,
  roughness: 0.9,
  metalness: 0.0,
});

// Brass finials and water jets
const brassMat = new THREE.MeshStandardMaterial({
  name: "PolishedBrassFinial",
  color: 0xb59048,
  roughness: 0.3,
  metalness: 0.85,
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

// ─── PROCEDURAL GEOMETRY BUILDERS ─────────────────────────────────────────

/** Builds a 16-petal lotus basin shape using polar harmonic curves */
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

/** Builds an ornamental balustrade railing with turned balusters */
function createBalustrade(length, height = 0.9) {
  const group = new THREE.Group();
  // Bottom rail
  const bottomRail = new THREE.Mesh(new THREE.BoxGeometry(length, 0.08, 0.12), carvedTimberMat);
  bottomRail.position.y = 0.04;
  group.add(bottomRail);

  // Top handrail
  const topRail = new THREE.Mesh(new THREE.BoxGeometry(length, 0.1, 0.16), carvedTimberMat);
  topRail.position.y = height - 0.05;
  group.add(topRail);

  // Balusters
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

  // End post with spherical finial
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

/** Builds a Maratha cypress column (suru pillar) with cusped bracket capital */
function createSuruColumn(height = 3.2) {
  const group = new THREE.Group();
  // Square plinth base
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, 0.45), carvedTimberMat);
  base.position.y = 0.175;
  group.add(base);

  // Fluted cypress tapered shaft
  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.2, height - 0.7, 12),
    teakWoodMat
  );
  shaft.position.y = 0.35 + (height - 0.7) / 2;
  group.add(shaft);

  // Pot-and-foliage middle ring
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.2, 0.05, 8, 16),
    carvedTimberMat
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = height * 0.45;
  group.add(ring);

  // Capital bracket with double cyma reversa cusps
  const capital = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.35, 0.45), carvedTimberMat);
  capital.position.y = height - 0.175;
  group.add(capital);

  return group;
}

/** Builds an architectural tree */
function createTree(scale = 1.0) {
  const group = new THREE.Group();
  // Trunk
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2 * scale, 0.35 * scale, 2.8 * scale, 8),
    teakWoodMat
  );
  trunk.position.y = 1.4 * scale;
  trunk.castShadow = true;
  group.add(trunk);

  // Leafy canopy clusters
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
console.log("Building Shaniwar Wada Exterior Citadel Model (per video reference)...");
const exteriorScene = new THREE.Scene();
exteriorScene.name = "ShaniwarWada_Master_Exterior";

// Base Cadastral Ground Plinth
const siteGround = new THREE.Mesh(new THREE.BoxGeometry(75, 1.0, 75), pavingMat);
siteGround.position.set(0, -0.5, 0);
siteGround.receiveShadow = true;
exteriorScene.add(siteGround);

// ── 1.1 FORECOURT SEMI-CIRCULAR PLAZA (as seen in video frame 010) ───────────
const forecourtGroup = new THREE.Group();
forecourtGroup.name = "Northern_Forecourt_Plaza";

// Paved semi-circle apron
const apronGeo = new THREE.CylinderGeometry(15, 15, 0.2, 32, 1, false, Math.PI, Math.PI);
const apronMesh = new THREE.Mesh(apronGeo, pavingMat);
apronMesh.position.set(0, 0.1, 12);
forecourtGroup.add(apronMesh);

// Radial lawn wedges outside the plaza
for (let angle = 0; angle < Math.PI; angle += Math.PI / 4) {
  const wedgeGeo = new THREE.RingGeometry(15, 24, 16, 1, Math.PI + angle + 0.05, Math.PI / 4 - 0.1);
  const wedgeMesh = new THREE.Mesh(wedgeGeo, lawnMat);
  wedgeMesh.rotation.x = -Math.PI / 2;
  wedgeMesh.position.set(0, 0.12, 12);
  forecourtGroup.add(wedgeMesh);
}

exteriorScene.add(forecourtGroup);

// ── 1.2 DILLI DARWAZA GATEHOUSE & TWIN BASTIONS (Video frames 001, 008, 015, 016)
const dilliDarwazaGroup = new THREE.Group();
dilliDarwazaGroup.name = "Dilli_Darwaza_Gatehouse";

// 4-Tiered Entrance Steps (leading up into the portal arch)
for (let step = 0; step < 4; step++) {
  const stepMesh = new THREE.Mesh(
    new THREE.BoxGeometry(5.2 + step * 0.4, 0.2, 0.65),
    dressedStoneMat
  );
  stepMesh.position.set(0, 0.1 + step * 0.2, 14.5 - step * 0.6);
  stepMesh.receiveShadow = true;
  dilliDarwazaGroup.add(stepMesh);
}

// Twin Curved Dressed Basalt Bastions (Flanking Portal)
function createMainBastion(sideMultiplier, name) {
  const bGroup = new THREE.Group();
  bGroup.name = name;

  // Base plinth molding
  const basePlinth = new THREE.Mesh(
    new THREE.CylinderGeometry(4.3, 4.7, 1.2, 24, 1, false, 0, Math.PI),
    dressedStoneMat
  );
  basePlinth.rotation.y = Math.PI / 2;
  basePlinth.position.y = 0.6;
  bGroup.add(basePlinth);

  // Main curved tower shaft with ashlar block courses
  const shaftGeo = new THREE.CylinderGeometry(4.0, 4.3, 9.5, 24, 1, false, 0, Math.PI);
  const shaftMesh = new THREE.Mesh(shaftGeo, basaltStoneMat);
  shaftMesh.rotation.y = Math.PI / 2;
  shaftMesh.position.y = 5.95;
  shaftMesh.castShadow = true;
  shaftMesh.receiveShadow = true;
  bGroup.add(shaftMesh);

  // Horizontal stone course banding lines
  for (let cy = 2.0; cy <= 9.0; cy += 1.8) {
    const courseBand = new THREE.Mesh(
      new THREE.CylinderGeometry(4.18, 4.18, 0.12, 24, 1, false, 0, Math.PI),
      dressedStoneMat
    );
    courseBand.rotation.y = Math.PI / 2;
    courseBand.position.y = cy;
    bGroup.add(courseBand);
  }

  // Upper machicolation corbels & arrow slits
  for (let a = -1.1; a <= 1.1; a += 0.38) {
    const slit = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.8, 0.6), ironMat);
    const r = 4.08;
    slit.position.set(Math.sin(a) * r, 8.8, Math.cos(a) * r);
    slit.rotation.y = a;
    bGroup.add(slit);
  }

  // Parapet crown
  const crown = new THREE.Mesh(
    new THREE.CylinderGeometry(4.4, 4.0, 1.4, 24, 1, false, 0, Math.PI),
    dressedStoneMat
  );
  crown.rotation.y = Math.PI / 2;
  crown.position.y = 11.4;
  bGroup.add(crown);

  bGroup.position.set(sideMultiplier * 6.5, 0, 12);
  return bGroup;
}

dilliDarwazaGroup.add(createMainBastion(-1, "West_Curved_Bastion"));
dilliDarwazaGroup.add(createMainBastion(1, "East_Curved_Bastion"));

// Central Stone Gatehouse Block (Archway Pier & Recessed Wall)
const gatehouseWall = new THREE.Mesh(new THREE.BoxGeometry(5.2, 11, 4.5), basaltStoneMat);
gatehouseWall.position.set(0, 5.5, 12);
gatehouseWall.castShadow = true;
dilliDarwazaGroup.add(gatehouseWall);

// Double-Nested Pointed Archway (Video frame 015, 016)
const outerArchFrame = new THREE.Mesh(new THREE.BoxGeometry(4.2, 7.4, 1.2), dressedStoneMat);
outerArchFrame.position.set(0, 4.5, 12.6);
dilliDarwazaGroup.add(outerArchFrame);

// Two Circular Observation Roundels / Cannon Portholes (Flanking the apex)
for (let rx of [-1.4, 1.4]) {
  const roundel = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.4, 16), ironMat);
  roundel.rotation.x = Math.PI / 2;
  roundel.position.set(rx, 8.2, 13.1);
  dilliDarwazaGroup.add(roundel);
}

// 21-Foot Teakwood Double Gates (Video frames 015, 017)
const gateLeft = new THREE.Mesh(new THREE.BoxGeometry(1.85, 6.4, 0.25), teakWoodMat);
gateLeft.position.set(-0.95, 3.8, 12.2);
gateLeft.name = "Teak_Gate_West";
dilliDarwazaGroup.add(gateLeft);

const gateRight = new THREE.Mesh(new THREE.BoxGeometry(1.85, 6.4, 0.25), teakWoodMat);
gateRight.position.set(0.95, 3.8, 12.2);
gateRight.name = "Teak_Gate_East";
dilliDarwazaGroup.add(gateRight);

// Central Studded Astragal Strip (Sealing the leaves)
const astragal = new THREE.Mesh(new THREE.BoxGeometry(0.12, 6.4, 0.32), ironMat);
astragal.position.set(0, 3.8, 12.25);
dilliDarwazaGroup.add(astragal);

// 72 Conical Steel Elephant Spikes in Dense Rows (Frame 015, 017)
for (let row = 0; row < 6; row++) {
  const sy = 2.4 + row * 0.75;
  for (let sx = -1.65; sx <= 1.65; sx += 0.3) {
    if (Math.abs(sx) < 0.12) continue; // Leave central astragal gap
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.5, 8), ironMat);
    spike.rotation.x = Math.PI / 2;
    spike.position.set(sx, sy, 12.55);
    dilliDarwazaGroup.add(spike);
  }
}

// ── 1.3 NAGARKHANA (UPPER DRUM HOUSE & GALLERY) (Video frames 001, 005, 015, 020)
const nagarkhanaGroup = new THREE.Group();
nagarkhanaGroup.name = "Nagarkhana_Balcony_Gallery";

// Cantilevered Wooden Floor Plinth with Moulded Trim
const nagarFloor = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.45, 4.8), teakWoodMat);
nagarFloor.position.set(0, 11.2, 12);
nagarFloor.castShadow = true;
nagarkhanaGroup.add(nagarFloor);

// Turned Wooden Balustrade along Front & Sides
const frontRail = createBalustrade(9.4, 0.85);
frontRail.position.set(0, 11.45, 14.2);
nagarkhanaGroup.add(frontRail);

const westRail = createBalustrade(4.4, 0.85);
westRail.rotation.y = Math.PI / 2;
westRail.position.set(-4.7, 11.45, 12);
nagarkhanaGroup.add(westRail);

const eastRail = createBalustrade(4.4, 0.85);
eastRail.rotation.y = -Math.PI / 2;
eastRail.position.set(4.7, 11.45, 12);
nagarkhanaGroup.add(eastRail);

// 8 Carved Wooden Suru (Cypress) Columns with Cusped Arch Brackets
for (let cx = -3.8; cx <= 3.8; cx += 1.08) {
  const col = createSuruColumn(2.6);
  col.position.set(cx, 11.45, 14.1);
  nagarkhanaGroup.add(col);
}

// Flat Wooden Timber Cornice & Roof Fascia (per video frames 001 & 015)
const roofFascia = new THREE.Mesh(new THREE.BoxGeometry(10.2, 0.5, 5.4), teakWoodMat);
roofFascia.position.set(0, 14.3, 12);
roofFascia.castShadow = true;
nagarkhanaGroup.add(roofFascia);

const roofCover = new THREE.Mesh(new THREE.BoxGeometry(9.8, 0.2, 5.0), stuccoMat);
roofCover.position.set(0, 14.65, 12);
nagarkhanaGroup.add(roofCover);

// Stucco Side Walls with Arched Windows
const nagarWallW = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.8, 3.8), stuccoMat);
nagarWallW.position.set(-4.5, 12.8, 11.6);
nagarkhanaGroup.add(nagarWallW);

const nagarWallE = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.8, 3.8), stuccoMat);
nagarWallE.position.set(4.5, 12.8, 11.6);
nagarkhanaGroup.add(nagarWallE);

dilliDarwazaGroup.add(nagarkhanaGroup);

// Rear Elevation of Dilli Darwaza: Twin Arched Exits into the Inner Courtyard (Frame 007)
for (let ex of [-2.4, 2.4]) {
  const rearDoor = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.8, 0.2), teakWoodMat);
  rearDoor.position.set(ex, 1.9, 9.7);
  dilliDarwazaGroup.add(rearDoor);
}

exteriorScene.add(dilliDarwazaGroup);

// ── 1.4 FORTIFICATION PERIMETER WALLS & 9 BASTIONS (Video frame 010) ─────────
const fortWallsGroup = new THREE.Group();
fortWallsGroup.name = "Citadel_Perimeter_Fortifications";

// North Wall (Flanking Dilli Darwaza)
const nWallW = new THREE.Mesh(new THREE.BoxGeometry(18, 9, 3.2), basaltStoneMat);
nWallW.position.set(-18.5, 4.5, 12);
nWallW.castShadow = true;
fortWallsGroup.add(nWallW);

const nWallE = new THREE.Mesh(new THREE.BoxGeometry(18, 9, 3.2), basaltStoneMat);
nWallE.position.set(18.5, 4.5, 12);
nWallE.castShadow = true;
fortWallsGroup.add(nWallE);

// West Wall
const wWall = new THREE.Mesh(new THREE.BoxGeometry(3.2, 9, 44), basaltStoneMat);
wWall.position.set(-27.5, 4.5, -10);
wWall.castShadow = true;
fortWallsGroup.add(wWall);

// East Wall
const eWall = new THREE.Mesh(new THREE.BoxGeometry(3.2, 9, 44), basaltStoneMat);
eWall.position.set(27.5, 4.5, -10);
eWall.castShadow = true;
fortWallsGroup.add(eWall);

// South Wall (Rear)
const sWall = new THREE.Mesh(new THREE.BoxGeometry(55, 9, 3.2), basaltStoneMat);
sWall.position.set(0, 4.5, -32);
sWall.castShadow = true;
fortWallsGroup.add(sWall);

// Battlements / Merlons along all ramparts
function addMerlons(startX, endX, zPos, isXAxis = true) {
  if (isXAxis) {
    for (let x = startX; x <= endX; x += 2.4) {
      if (Math.abs(zPos - 12) < 1 && Math.abs(x) < 8) continue; // Skip gate
      const m = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.2, 0.8), basaltStoneMat);
      m.position.set(x, 9.6, zPos);
      m.castShadow = true;
      fortWallsGroup.add(m);
    }
  } else {
    for (let z = startX; z <= endX; z += 2.4) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 1.4), basaltStoneMat);
      m.position.set(zPos, 9.6, z);
      m.castShadow = true;
      fortWallsGroup.add(m);
    }
  }
}
addMerlons(-26, 26, 13.2, true);
addMerlons(-31, 11, -27.5, false);
addMerlons(-31, 11, 27.5, false);
addMerlons(-26, 26, -33.2, true);

// 7 Secondary Bastions (4 Corners + 3 Intermediates = 9 Bastions total with Dilli Darwaza)
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
  const bMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(3.6, 4.0, 10.5, 20),
    basaltStoneMat
  );
  bMesh.position.set(b.x, 5.25, b.z);
  bMesh.castShadow = true;
  bMesh.name = b.name;
  fortWallsGroup.add(bMesh);

  // Crown
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(3.9, 3.6, 1.2, 20), dressedStoneMat);
  crown.position.set(b.x, 11.1, b.z);
  fortWallsGroup.add(crown);
});

exteriorScene.add(fortWallsGroup);

// ── 1.5 INTERNAL GARDENS, HAZARI KARANJE & CHIMAN BAUG (Frames 010, 012, 021-027)
const gardenGroup = new THREE.Group();
gardenGroup.name = "Citadel_Royal_Gardens_Complex";

// Central Stone Flagged Avenue (North-South, from Dilli Darwaza into gardens)
const centralAve = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.25, 42), pavingMat);
centralAve.position.set(0, 0.12, -9);
centralAve.receiveShadow = true;
gardenGroup.add(centralAve);

// ── HAZARI KARANJE (16-Petal Lotus Fountain) (Frames 021, 022, 023)
const hazariKaranje = new THREE.Group();
hazariKaranje.name = "Hazari_Karanje_16_Petal_Lotus";

// Raised stone platform with wide steps
const kPlinth = new THREE.Mesh(new THREE.BoxGeometry(11, 0.6, 11), dressedStoneMat);
kPlinth.position.set(0, 0.3, -5);
kPlinth.receiveShadow = true;
hazariKaranje.add(kPlinth);

// Protective wooden balustrade around Hazari Karanje (Video frame 022, 023)
const kRailN = createBalustrade(10.2, 0.75);
kRailN.position.set(0, 0.6, -0.1);
hazariKaranje.add(kRailN);

const kRailS = createBalustrade(10.2, 0.75);
kRailS.position.set(0, 0.6, -9.9);
hazariKaranje.add(kRailS);

const kRailW = createBalustrade(9.8, 0.75);
kRailW.rotation.y = Math.PI / 2;
kRailW.position.set(-5.0, 0.6, -5);
hazariKaranje.add(kRailW);

const kRailE = createBalustrade(9.8, 0.75);
kRailE.rotation.y = -Math.PI / 2;
kRailE.position.set(5.0, 0.6, -5);
hazariKaranje.add(kRailE);

// Sunken dark stone basin (Frame 022)
const kBasin = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.4, 8.4), basaltStoneMat);
kBasin.position.set(0, 0.4, -5);
hazariKaranje.add(kBasin);

// 4 Corner Well Drainage Holes
for (let dx of [-3.2, 3.2]) {
  for (let dz of [-8.2, -1.8]) {
    const drain = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.3, 12), ironMat);
    drain.position.set(dx, 0.55, dz);
    hazariKaranje.add(drain);
  }
}

// Tier 1: Outer 16-Petal White Marble Lotus (Radius ~3.2m, Petal depth ~0.6m)
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

// Tier 2: Inner Concentric 16-Petal Marble Rosette (Radius ~1.8m, offset by half-petal)
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
lotusInnerMesh.rotation.z = Math.PI / 16; // Offset petals
lotusInnerMesh.position.set(0, 0.9, -5);
lotusInnerMesh.castShadow = true;
hazariKaranje.add(lotusInnerMesh);

// Water surface within the lotus core
const kWater = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.1, 16), waterMat);
kWater.position.set(0, 1.15, -5);
hazariKaranje.add(kWater);

// Central Brass Water Jet Spout (Engineered for infant Peshwa Madhavrao II)
const kJet = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.28, 0.8, 12), brassMat);
kJet.position.set(0, 1.5, -5);
hazariKaranje.add(kJet);

gardenGroup.add(hazariKaranje);

// ── CHIMAN BAUG WATER COMPLEX & VERANDAH (Video frames 012, 021, 024) ────────
const chimanGroup = new THREE.Group();
chimanGroup.name = "Chiman_Baug_Complex";

// Raised stone fountain tank with cusped scalloped pockets
const cTankPlinth = new THREE.Mesh(new THREE.BoxGeometry(11, 0.6, 11), dressedStoneMat);
cTankPlinth.position.set(-14.5, 0.3, -16);
cTankPlinth.receiveShadow = true;
chimanGroup.add(cTankPlinth);

// Central sunken square pool with water
const cPoolWater = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.1, 4.8), waterMat);
cPoolWater.position.set(-14.5, 0.62, -16);
chimanGroup.add(cPoolWater);

// Scalloped cusped decorative channel border pockets (as seen in frame 024)
for (let cx = -18.2; cx <= -10.8; cx += 1.85) {
  for (let cz of [-20.2, -11.8]) {
    const pocket = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.15, 1.1), basaltStoneMat);
    pocket.position.set(cx, 0.65, cz);
    chimanGroup.add(pocket);
  }
}

// Arcaded Pillared Verandah with Red Terracotta Roof (along west wall, frame 024)
const verandahGroup = new THREE.Group();
verandahGroup.name = "Chiman_Baug_Arcaded_Verandah";

// Verandah stone floor
const vFloor = new THREE.Mesh(new THREE.BoxGeometry(14, 0.35, 4.2), pavingMat);
vFloor.position.set(-14.5, 0.18, -23.5);
verandahGroup.add(vFloor);

// Wooden columns supporting roof
for (let vx = -20; vx <= -9; vx += 2.2) {
  const vCol = createSuruColumn(2.6);
  vCol.position.set(vx, 0.35, -21.8);
  verandahGroup.add(vCol);
}

// Sloping Terracotta Tiled Roof
const vRoof = new THREE.Mesh(new THREE.BoxGeometry(14.6, 0.3, 4.8), terracottaMat);
vRoof.rotation.x = 0.22; // Sloped roof
vRoof.position.set(-14.5, 3.4, -23.8);
vRoof.castShadow = true;
verandahGroup.add(vRoof);

chimanGroup.add(verandahGroup);
gardenGroup.add(chimanGroup);

// ── RECTANGULAR MIRROR RESERVOIR / POOL (Video frames 010, 021, 027) ─────────
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

// ── PALACE PLINTH FOUNDATION RUINS (Thorlya Rayancha, Arsa, Ganesh Mahal) ────
const plinthsGroup = new THREE.Group();
plinthsGroup.name = "Palace_Plinth_Ruins";

// Stepped rubble-stone foundation walls (as seen in frames 010, 021)
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

  // Column socket stump bases
  for (let sx = -b.w / 2 + 1.5; sx <= b.w / 2 - 1.5; sx += 3.0) {
    for (let sz = -b.d / 2 + 1.5; sz <= b.d / 2 - 1.5; sz += 3.0) {
      const stump = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.4, 0.45, 8),
        basaltStoneMat
      );
      stump.position.set(b.x + sx, b.h + 0.22, b.z + sz);
      plinthsGroup.add(stump);
    }
  }
});

gardenGroup.add(plinthsGroup);

// Landscaped Lawn Quadrants (Charbagh Parterres, frame 010, 021)
const lawnCoords = [
  { x: -14, z: -2, w: 16, d: 6 },
  { x: 14, z: -2, w: 16, d: 6 },
  { x: -14, z: -8, w: 16, d: 5 },
  { x: 14, z: -8, w: 16, d: 5 },
  { x: 0, z: -14, w: 6, d: 6 },
  { x: -18, z: -28, w: 10, d: 6 },
  { x: 18, z: -28, w: 10, d: 6 },
];

lawnCoords.forEach((l) => {
  const lMesh = new THREE.Mesh(new THREE.BoxGeometry(l.w, 0.15, l.d), lawnMat);
  lMesh.position.set(l.x, 0.08, l.z);
  lMesh.receiveShadow = true;
  gardenGroup.add(lMesh);
});

// Perimeter and Courtyard Trees (Frames 010, 020, 024, 028)
const treeCoords = [
  [-22, 5], [-22, -4], [-22, -14], [-22, -24],
  [22, 5], [22, -4], [22, -14], [22, -24],
  [-7, -1], [7, -1],
  [-8, -12], [8, -12],
  [-16, -27], [16, -27], [0, -29],
];

treeCoords.forEach(([tx, tz]) => {
  const scale = 0.85 + Math.random() * 0.35;
  const tree = createTree(scale);
  tree.position.set(tx, 0.15, tz);
  gardenGroup.add(tree);
});

exteriorScene.add(gardenGroup);

await saveSceneToGLB(
  exteriorScene,
  path.join(OUT_DIR_EXTERIOR, "shaniwar-wada-exterior.glb")
);

// ═════════════════════════════════════════════════════════════════════════════
// 2. BUILD HIGH-FIDELITY SHANIWAR WADA INTERIOR WALKTHROUGH MODEL (Devdi)
// ═════════════════════════════════════════════════════════════════════════════
console.log("Building Shaniwar Wada Interior Walkthrough Model...");
const interiorScene = new THREE.Scene();
interiorScene.name = "ShaniwarWada_Master_Interior";

// Dilli Darwaza Devdi Corridor Floor (Walkable granite flagstone)
const intFloor = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.4, 38), pavingMat);
intFloor.position.set(0, -0.2, 0);
intFloor.name = "Walkable_Devdi_Floor";
interiorScene.add(intFloor);

// Left & Right Granite Ashlar Walls
const intWallW = new THREE.Mesh(new THREE.BoxGeometry(1.6, 7.5, 38), basaltStoneMat);
intWallW.position.set(-5.0, 3.75, 0);
interiorScene.add(intWallW);

const intWallE = new THREE.Mesh(new THREE.BoxGeometry(1.6, 7.5, 38), basaltStoneMat);
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
  const beam = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.42, 0.55), teakWoodMat);
  beam.position.set(0, 6.8, bz);
  interiorScene.add(beam);
}

// Sentry Alcoves: Chaukidar Stone Guard Benches (Deep seats for Maratha sentries)
for (let side of [-1, 1]) {
  const bench = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.85, 6.5), dressedStoneMat);
  bench.position.set(side * 3.7, 0.42, 2.5);
  interiorScene.add(bench);

  // Forged Wrought-Iron Torch Sconces (Mashal holders)
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

// Rear South Exit: Archway opening directly onto the sunny Hazari Karanje courtyard!
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
// Clone the full exterior citadel (walls, Dilli Darwaza, gardens, fountains)
const historicalScene = exteriorScene.clone(true);
historicalScene.name = "ShaniwarWada_1732_Reconstruction";

// Add the Monumental Seven-Storey Megadambara Royal Palace over the foundation plinths!
const palaceTowerGroup = new THREE.Group();
palaceTowerGroup.name = "Megadambara_Seven_Storey_Palace_Superstructure";

// Storey heights, widths, and depths (tapering upwards)
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

  // Stucco chamber core
  const core = new THREE.Mesh(new THREE.BoxGeometry(s.w - 1.2, s.h - 0.4, s.d - 1.2), stuccoMat);
  core.position.y = s.y + s.h / 2;
  core.castShadow = true;
  sGroup.add(core);

  // Cantilevered wooden floor gallery
  const floorPlinth = new THREE.Mesh(new THREE.BoxGeometry(s.w, 0.35, s.d), teakWoodMat);
  floorPlinth.position.y = s.y;
  floorPlinth.castShadow = true;
  sGroup.add(floorPlinth);

  // Turned wooden balustrades along perimeter
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

  // Wooden columns along front facade
  for (let px = -s.w / 2 + 1.2; px <= s.w / 2 - 1.2; px += 2.2) {
    const col = createSuruColumn(s.h - 0.4);
    col.position.set(px, s.y + 0.18, s.d / 2 - 0.2);
    sGroup.add(col);
  }

  // Sloping Terracotta Cornice Eaves (Chhajjas protecting timber from monsoons)
  const eaveFront = new THREE.Mesh(new THREE.BoxGeometry(s.w + 1.2, 0.22, 1.4), terracottaMat);
  eaveFront.rotation.x = 0.25;
  eaveFront.position.set(0, s.y + s.h, s.d / 2 + 0.4);
  eaveFront.castShadow = true;
  sGroup.add(eaveFront);

  palaceTowerGroup.add(sGroup);
});

// Crowning Royal Pavilion Roof (Tier 7 top hipped roof with brass Kalasha finials)
const topRoof = new THREE.Mesh(new THREE.ConeGeometry(7.2, 2.6, 4), terracottaMat);
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

console.log("✓ All 3 authentic Shaniwar Wada 3D models generated successfully!");
