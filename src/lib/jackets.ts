export const JACKET_IDS = [
  "rust",
  "apple",
  "forest",
  "navy",
  "gold",
  "cream",
  "ink",
  "clay",
] as const;

export type JacketId = (typeof JACKET_IDS)[number];

export type Jacket = {
  id: JacketId;
  label: string;
  swatch: string;
  color: string;
};

export const JACKETS: Jacket[] = [
  { id: "rust", label: "Rust", swatch: "#8b3d2a", color: "#8b3d2a" },
  { id: "apple", label: "Apple", swatch: "#c41e3a", color: "#c41e3a" },
  { id: "forest", label: "Forest", swatch: "#3d6b3a", color: "#3d6b3a" },
  { id: "navy", label: "Navy", swatch: "#2c3d5c", color: "#2c3d5c" },
  { id: "gold", label: "Gold", swatch: "#c4a35a", color: "#c4a35a" },
  { id: "cream", label: "Cream", swatch: "#e8d9c0", color: "#e8d9c0" },
  { id: "ink", label: "Ink", swatch: "#1c1410", color: "#1c1410" },
  { id: "clay", label: "Clay", swatch: "#c46a3c", color: "#c46a3c" },
];

const BY_ID = Object.fromEntries(JACKETS.map((j) => [j.id, j])) as Record<
  JacketId,
  Jacket
>;

export function isJacketId(value: unknown): value is JacketId {
  return typeof value === "string" && JACKET_IDS.includes(value as JacketId);
}

export function getJacket(id: JacketId | null | undefined): Jacket {
  return (id && BY_ID[id]) || BY_ID.rust;
}

const STORAGE_KEY = "meowton-jacket-v1";

export function readStoredJacket(): JacketId {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (isJacketId(value)) return value;
  } catch {
    /* ignore */
  }
  return "rust";
}

export function writeStoredJacket(id: JacketId) {
  try {
    window.localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* ignore */
  }
}
