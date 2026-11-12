import fs from "fs";
import path from "path";
import type { FullLearningSnapshot } from "./learningProfile";
import { mergeLearningSnapshots } from "./learningProfile";

const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "kertamarga-data")
  : path.join(process.cwd(), "data");
const PROFILES_FILE = path.join(DATA_DIR, "learning-profiles.json");

interface GlobalProfileStore {
  __kertamarga_profiles?: Map<number, FullLearningSnapshot>;
}

const g = globalThis as unknown as GlobalProfileStore;

function getProfileMap(): Map<number, FullLearningSnapshot> {
  if (g.__kertamarga_profiles) {
    return g.__kertamarga_profiles;
  }

  const map = new Map<number, FullLearningSnapshot>();
  try {
    if (fs.existsSync(PROFILES_FILE)) {
      const raw = fs.readFileSync(PROFILES_FILE, "utf-8");
      const parsed = JSON.parse(raw) as Record<string, FullLearningSnapshot>;
      if (parsed && typeof parsed === "object") {
        for (const [key, val] of Object.entries(parsed)) {
          const userId = Number(key);
          if (Number.isFinite(userId) && val) {
            map.set(userId, val);
          }
        }
      }
    }
  } catch (err) {
    console.warn("Gagal membaca learning-profiles.json:", err);
  }

  g.__kertamarga_profiles = map;
  return map;
}

function persistProfiles() {
  const map = getProfileMap();
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const obj: Record<string, FullLearningSnapshot> = {};
    for (const [id, snap] of map.entries()) {
      obj[String(id)] = snap;
    }
    fs.writeFileSync(PROFILES_FILE, JSON.stringify(obj, null, 2), "utf-8");
  } catch {
    // Biarkan fallback memori aktif tanpa crash di serverless
  }
}

export function getUserLearningProfile(userId: number): FullLearningSnapshot {
  const map = getProfileMap();
  return (
    map.get(userId) || {
      personalNotes: [],
      progressByField: {},
      surveyResult: null,
      updatedAt: new Date(0).toISOString(),
    }
  );
}

export function saveUserLearningProfile(
  userId: number,
  incoming: FullLearningSnapshot,
  mode: "replace" | "merge" = "merge"
): FullLearningSnapshot {
  const map = getProfileMap();
  const existing = map.get(userId);
  const next =
    mode === "replace" || !existing
      ? {
          ...incoming,
          updatedAt: new Date().toISOString(),
        }
      : mergeLearningSnapshots(incoming, existing);

  map.set(userId, next);
  persistProfiles();
  return next;
}
