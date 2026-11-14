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
  type: "info" | "navigation";
  targetSceneId?: string;
}

export interface TourScene {
  id: string;
  name: string;
  panoramaUrl: string;
  thumbnailUrl?: string;
  initialYaw: number;
  initialPitch: number;
  hotspots: TourHotspot[];
  historicalNotes: string;
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
