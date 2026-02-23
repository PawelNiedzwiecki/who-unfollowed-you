const STORAGE_KEY = "unfollowers_data";

export interface StoredData {
  followers: string[];
  following: string[];
}

export function saveData(data: StoredData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage may be full or unavailable — silently ignore
  }
}

export function loadData(): StoredData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "followers" in parsed &&
      "following" in parsed &&
      Array.isArray((parsed as StoredData).followers) &&
      Array.isArray((parsed as StoredData).following)
    ) {
      return parsed as StoredData;
    }
    return null;
  } catch {
    return null;
  }
}

export function clearData(): void {
  localStorage.removeItem(STORAGE_KEY);
}
