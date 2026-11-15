/**
 * HeritageVerse 3D Digital Heritage Museum Engine
 * Type Definitions for Models, Walkthroughs, Collisions, and Provenance Metadata
 */

export type ModelReadiness = 
  | "available" 
  | "in_production" 
  | "requires_source_material" 
  | "unavailable";

export type ReconstructionMethod = 
  | "photogrammetry" 
  | "laser_scan_lidar" 
  | "architectural_measured_drawing" 
  | "inferred_historical_reconstruction" 
  | "conceptual_curatorial_blockout";

export type EvidenceLevel = 
  | "verified_surviving" 
  | "archaeological_ruin"
  | "documented_reconstruction" 
  | "evidence_based_inferred" 
  | "illustrative_hypothesis";

export interface ModelMetadata {
  sourceType: string;
  sourceReferences: string[];
  creator: string;
  license: string;
  reconstructionMethod: ReconstructionMethod;
  historicalPeriod: string;
  confidenceLevel: number; // 0 to 100 percentage
  verificationStatus: "ASI_ARCHIVAL_VERIFIED" | "SCHOLARLY_RECONSTRUCTED" | "SURVEY_PENDING";
  knownLimitations: string[];
}

export interface ArchitecturalHotspot3D {
  id: string;
  name: string;
  category: "gate" | "bastion" | "pillar" | "arch" | "dome" | "fountain" | "plinth" | "carving" | "rampart";
  position: [number, number, number];
  cameraTarget?: [number, number, number];
  cameraPosition?: [number, number, number];
  title: string;
  description: string;
  architecturalDetails: string[];
  evidenceLevel: EvidenceLevel;
  historicalDate?: string;
  imageUrl?: string;
}

export interface WalkthroughArea {
  id: string;
  name: string;
  description: string;
  modelUrl: string;
  spawnPosition: [number, number, number];
  spawnRotationY: number; // in radians
  bounds: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
    floorY: number;
  };
  connectedAreaIds: string[];
  hotspots: ArchitecturalHotspot3D[];
}

export interface HistoricalVariant {
  id: string;
  name: string;
  yearLabel: string;
  period: string;
  description: string;
  modelUrl: string;
  evidenceLevel: EvidenceLevel;
  historicalChanges: string[];
}

export interface Monument3DManifestEntry {
  monumentSlug: string;
  name: string;
  readiness: ModelReadiness;
  readinessNotice: string;
  hasExterior: boolean;
  hasWalkthrough: boolean;
  hasHistoricalReconstruction: boolean;
  exteriorModelUrl?: string;
  exteriorLODs?: {
    low?: string;
    medium?: string;
    high?: string;
  };
  modelSizeMB?: number;
  polygonCount?: string;
  metadata: ModelMetadata;
  exteriorHotspots?: ArchitecturalHotspot3D[];
  walkthroughAreas?: WalkthroughArea[];
  historicalVariants?: HistoricalVariant[];
  fallbackPhotoUrl: string;
}

export type ExperienceMode = "explorer" | "walkthrough" | "historical";

export type LightingPreset = "studio" | "golden_hour" | "midday_sun" | "monsoon_diffuse";
