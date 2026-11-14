import { Monument, CommunitySubmission, ConservationReport, UserProfile } from "@/types/heritage";
import { SAMPLE_MONUMENTS, SAMPLE_COMMUNITY_SUBMISSIONS, SAMPLE_CONSERVATION_REPORTS } from "@/data/sampleData";

const STORAGE_KEYS = {
  MONUMENTS: "heritageverse_monuments_v7",
  SUBMISSIONS: "heritageverse_submissions_v2",
  REPORTS: "heritageverse_reports_v2",
  SAVED: "heritageverse_saved_monuments_v2",
  USER: "heritageverse_active_user",
};

export const DEFAULT_USER: UserProfile = {
  id: "usr-demo-curator",
  name: "Dr. Ananya Chitnis",
  email: "ananya.chitnis@heritageverse.org",
  role: "admin",
  createdAt: "2026-09-01T00:00:00Z"
};

// Safe client-side storage accessor
function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocalStorageItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage error:", e);
  }
}

export const HeritageStore = {
  // Monuments
  getMonuments: (): Monument[] => {
    // Purge outdated legacy caches on client load
    if (typeof window !== "undefined") {
      ["heritageverse_monuments_v1", "heritageverse_monuments_v2", "heritageverse_monuments_v3", "heritageverse_monuments_v4", "heritageverse_monuments_v5", "heritageverse_monuments_v6"].forEach(k => {
        try { localStorage.removeItem(k); } catch {}
      });
    }

    const stored = getLocalStorageItem<Monument[]>(STORAGE_KEYS.MONUMENTS, []);
    
    // Check if stored data is absent, smaller than sample, or corrupted with stale alma.jpg URLs
    const hasStaleAlma = stored?.some((m) =>
      m.tourScenes?.some((s) => s.panoramaUrl?.includes("alma") || s.panoramaUrl?.includes("pannellum.org"))
    );

    if (!stored || stored.length < SAMPLE_MONUMENTS.length || hasStaleAlma) {
      setLocalStorageItem(STORAGE_KEYS.MONUMENTS, SAMPLE_MONUMENTS);
      return SAMPLE_MONUMENTS;
    }

    // Always guarantee canonical assets (tourScenes, verified cover images, coordinates)
    const sampleMap = new Map(SAMPLE_MONUMENTS.map((m) => [m.id, m]));
    const reconciled = stored.map((m) => {
      const canonical = sampleMap.get(m.id);
      if (canonical) {
        return {
          ...m,
          tourScenes: canonical.tourScenes,
          coverImage: canonical.coverImage,
          images: canonical.images,
          coordinates: canonical.coordinates,
        };
      }
      return m;
    });

    return reconciled;
  },

  getMonumentBySlug: (slug: string): Monument | undefined => {
    const monuments = HeritageStore.getMonuments();
    const mon = monuments.find((m) => m.slug === slug);
    if (!mon) {
      return SAMPLE_MONUMENTS.find((m) => m.slug === slug);
    }
    // Safeguard canonical tourScenes against any stale local caches
    const canonical = SAMPLE_MONUMENTS.find((m) => m.slug === slug);
    if (canonical && mon.tourScenes?.some((s) => s.panoramaUrl?.includes("alma") || s.panoramaUrl?.includes("pannellum.org"))) {
      mon.tourScenes = canonical.tourScenes;
    }
    return mon;
  },

  saveMonument: (monument: Monument): void => {
    const monuments = HeritageStore.getMonuments();
    const index = monuments.findIndex((m) => m.id === monument.id);
    if (index >= 0) {
      monuments[index] = monument;
    } else {
      monuments.unshift(monument);
    }
    setLocalStorageItem(STORAGE_KEYS.MONUMENTS, monuments);
  },

  deleteMonument: (id: string): void => {
    const monuments = HeritageStore.getMonuments().filter((m) => m.id !== id);
    setLocalStorageItem(STORAGE_KEYS.MONUMENTS, monuments);
  },

  // Saved / Bookmarked Monuments
  getSavedMonumentIds: (): string[] => {
    return getLocalStorageItem<string[]>(STORAGE_KEYS.SAVED, ["m-shaniwar-wada", "m-karla-caves"]);
  },

  toggleSavedMonument: (id: string): boolean => {
    const saved = HeritageStore.getSavedMonumentIds();
    let updated: string[];
    let isSaved = false;
    if (saved.includes(id)) {
      updated = saved.filter((item) => item !== id);
      isSaved = false;
    } else {
      updated = [...saved, id];
      isSaved = true;
    }
    setLocalStorageItem(STORAGE_KEYS.SAVED, updated);
    return isSaved;
  },

  isMonumentSaved: (id: string): boolean => {
    const saved = HeritageStore.getSavedMonumentIds();
    return saved.includes(id);
  },

  // Community Submissions
  getSubmissions: (): CommunitySubmission[] => {
    return getLocalStorageItem<CommunitySubmission[]>(STORAGE_KEYS.SUBMISSIONS, SAMPLE_COMMUNITY_SUBMISSIONS);
  },

  getApprovedSubmissions: (): CommunitySubmission[] => {
    return HeritageStore.getSubmissions().filter((s) => s.status === "approved");
  },

  addSubmission: (submission: Omit<CommunitySubmission, "id" | "createdAt" | "status">): CommunitySubmission => {
    const current = HeritageStore.getSubmissions();
    const newSubmission: CommunitySubmission = {
      ...submission,
      id: "sub-" + Date.now(),
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    current.unshift(newSubmission);
    setLocalStorageItem(STORAGE_KEYS.SUBMISSIONS, current);
    return newSubmission;
  },

  updateSubmissionStatus: (id: string, status: "approved" | "rejected", feedback?: string): void => {
    const current = HeritageStore.getSubmissions();
    const target = current.find((s) => s.id === id);
    if (target) {
      target.status = status;
      if (feedback) target.adminFeedback = feedback;
      setLocalStorageItem(STORAGE_KEYS.SUBMISSIONS, current);
    }
  },

  // Conservation Reports
  getReports: (): ConservationReport[] => {
    return getLocalStorageItem<ConservationReport[]>(STORAGE_KEYS.REPORTS, SAMPLE_CONSERVATION_REPORTS);
  },

  addReport: (report: Omit<ConservationReport, "id" | "createdAt" | "status">): ConservationReport => {
    const current = HeritageStore.getReports();
    const newReport: ConservationReport = {
      ...report,
      id: "rep-" + Date.now(),
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    current.unshift(newReport);
    setLocalStorageItem(STORAGE_KEYS.REPORTS, current);
    return newReport;
  },

  updateReportStatus: (id: string, status: "pending" | "investigating" | "archived" | "acknowledged", notes?: string): void => {
    const current = HeritageStore.getReports();
    const target = current.find((r) => r.id === id);
    if (target) {
      target.status = status;
      if (notes) target.adminNotes = notes;
      setLocalStorageItem(STORAGE_KEYS.REPORTS, current);
    }
  },

  // Active User Profile / Role Switcher for Demo
  getUser: (): UserProfile => {
    return getLocalStorageItem<UserProfile>(STORAGE_KEYS.USER, DEFAULT_USER);
  },

  setUser: (user: UserProfile): void => {
    setLocalStorageItem(STORAGE_KEYS.USER, user);
  },

  setUserRole: (role: "visitor" | "contributor" | "admin"): UserProfile => {
    const user = HeritageStore.getUser();
    user.role = role;
    HeritageStore.setUser(user);
    return user;
  },

  // Reset to factory sample data
  resetToDefault: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.MONUMENTS);
    localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    localStorage.removeItem(STORAGE_KEYS.SAVED);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};
