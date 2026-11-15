export type UserRole = "visitor" | "contributor" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export type HeritageRegion = 
  | "Northern India"
  | "Western India"
  | "Southern India"
  | "Eastern India"
  | "Central India";

export type HeritageCategory = 
  | "Forts & Citadels"
  | "Palaces & Mansions"
  | "Rock-Cut Caves & Temples"
  | "Sacred Temples & Shrines"
  | "Museums & Archives"
  | "Colonial & Civic Heritage";

export type HistoricalPeriod = 
  | "Ancient (Prior to 6th Century CE)"
  | "Classical & Early Medieval (6th - 12th Century)"
  | "Medieval & Sultanate (12th - 16th Century)"
  | "Mughal & Maratha Empires (16th - 18th Century)"
  | "Colonial & Modern Era (18th - 20th Century)";

export interface MonumentImage {
  id: string;
  url: string;
  caption: string;
  attribution: string;
  license: string;
}

export interface TourHotspot {
  id: string;
  title: string;
  description: string;
  yaw: number; // horizontal angle in degrees (-180 to 180)
  pitch: number; // vertical angle in degrees (-90 to 90)
  x?: number; // horizontal coordinate percentage (0 - 100) for standard photographic view
  y?: number; // vertical coordinate percentage (0 - 100) for standard photographic view
  type: "info" | "navigation";
  targetSceneId?: string;
  architecturalFeature?: string;
  historicalPeriod?: string;
  imageUrl?: string;
  attribution?: string;
}

export interface TourSceneConnection {
  targetSceneId: string;
  label: string;
  yaw: number;
  pitch: number;
}

export type SceneType = "equirectangular_360" | "standard_photo" | "unavailable";

export interface SceneSourceMetadata {
  sourceUrl?: string;
  author?: string;
  license?: string;
  originalDimensions?: { width: number; height: number };
  camera?: string;
  dateTaken?: string;
  verificationStatus: "verified_genuine_360" | "verified_authentic_photo" | "field_survey_pending";
}

export interface TourScene {
  id: string;
  name: string;
  sceneType?: SceneType;
  panoramaUrl?: string;
  standardPhotoUrl?: string;
  thumbnailUrl?: string;
  initialYaw: number;
  initialPitch: number;
  hotspots: TourHotspot[];
  historicalNotes: string;
  areaLabel?: string;
  surveyType?: "field_photographic" | "certified_lidar" | "archival_reconstruction";
  sourceMetadata?: SceneSourceMetadata;
  connections?: TourSceneConnection[];
}

export interface Monument {
  id: string;
  slug: string;
  name: string;
  vernacularName?: string;
  shortDescription: string;
  historicalBackground: string;
  architecturalStyle: string;
  culturalSignificance: string;
  conservationStatus: "Good" | "Requires Monitoring" | "At Risk" | "Under Restoration";
  sdgRelevance: string;
  location: string;
  district: string;
  state: string;
  region: HeritageRegion;
  coordinates: {
    lat: number;
    lng: number;
  };
  category: HeritageCategory;
  period: HistoricalPeriod;
  yearBuilt: string;
  builder?: string;
  visitorInformation: {
    timings: string;
    entryFee: string;
    bestTimeToVisit: string;
    nearestTransit: string;
    verified: boolean;
  };
  featured: boolean;
  coverImage: string;
  images: MonumentImage[];
  tourScenes: TourScene[];
  model3d?: {
    url?: string;
    status: "available" | "in_preparation" | "scheduled";
    format?: "glb" | "gltf";
    polyCount?: string;
    surveyMethod?: string;
    attribution?: string;
  };
  sources: {
    title: string;
    url?: string;
    publisher: string;
  }[];
}

export interface CommunitySubmission {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  monumentId: string;
  monumentName: string;
  type: "story" | "photograph" | "oral_history" | "correction";
  title: string;
  content: string;
  mediaUrl?: string;
  mediaAttribution?: string;
  status: "pending" | "approved" | "rejected";
  adminFeedback?: string;
  createdAt: string;
}

export interface ConservationReport {
  id: string;
  userId: string;
  userName: string;
  monumentId: string;
  monumentName: string;
  category: "weathering" | "vandalism" | "pollution" | "structural_crack" | "vegetation_overgrowth" | "neglect";
  severity: "low" | "medium" | "high" | "urgent";
  description: string;
  areaLocation: string; // e.g. "North-eastern Bastion"
  photoUrl?: string;
  dateObserved: string;
  status: "pending" | "investigating" | "archived" | "acknowledged";
  adminNotes?: string;
  createdAt: string;
}

// ─── Heritage Trip Planner & Routing Types ──────────────────────────────

export type TransportMode = 
  | "driving"       // Car / Taxi
  | "motorcycle"    // Two-wheeler / Scooter
  | "bicycle"       // Cycle tour
  | "walking"       // Pedestrian / Heritage Walk
  | "transit";      // Train / Bus / Metro (Public Transit)

export interface TransportProfileInfo {
  id: TransportMode;
  name: string;
  icon: string;
  speedKmh: number;
  description: string;
  routingSupported: boolean;
  transitNotice?: string;
}

export interface TripStop {
  id: string;
  monumentId?: string;
  monumentSlug?: string;
  name: string;
  locationName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  order: number;
  isCustomLocation?: boolean;
  recommendedDurationMins?: number;
  notes?: string;
}

export interface RouteStep {
  instruction: string;
  distanceMeters: number;
  durationSeconds: number;
  name?: string;
}

export interface RouteLeg {
  fromStopIndex: number;
  toStopIndex: number;
  fromName: string;
  toName: string;
  distanceMeters: number;
  durationSeconds: number;
  geometry: [number, number][]; // [lng, lat] coordinate pairs for MapLibre/GeoJSON
  steps?: RouteStep[];
}

export interface Trip {
  id: string;
  title: string;
  description?: string;
  transportMode: TransportMode;
  stops: TripStop[];
  totalDistanceMeters: number;
  totalDurationSeconds: number;
  routeGeometry: [number, number][]; // Full continuous [lng, lat] GeoJSON coordinates
  legs: RouteLeg[];
  createdAt: string;
  updatedAt: string;
  isSaved?: boolean;
}

// ─── Heritage Passport & Cultural Journal Types ─────────────────────────

export interface VisitedMonumentRecord {
  monumentId: string;
  monumentSlug: string;
  monumentName: string;
  visitedAt: string;
  virtualTourCompleted: boolean;
}

export interface FieldJournalNote {
  id: string;
  monumentId: string;
  monumentName: string;
  monumentSlug: string;
  title: string;
  content: string;
  date: string;
}

export interface HeritagePassport {
  visited: VisitedMonumentRecord[];
  notes: FieldJournalNote[];
  completedToursCount: number;
  lastUpdated: string;
}

// ─── Contextual Heritage Companion Types ────────────────────────────────

export type CompanionTopic = 
  | "what_am_i_looking_at"
  | "why_important"
  | "interesting_story"
  | "architectural_analysis"
  | "what_to_explore_next";

export interface CompanionAnswer {
  topic: CompanionTopic;
  title: string;
  historicalTruth: string;
  folkloreVsFact?: string;
  architecturalHighlights?: string[];
  recommendedNextSteps?: string[];
  sources: { title: string; publisher: string }[];
  narrationScript: string;
}
