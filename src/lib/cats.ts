export const COAT_IDS = [
  "ginger",
  "tuxedo",
  "calico",
  "siamese",
  "jellie",
  "black",
] as const;

export type CoatId = (typeof COAT_IDS)[number];

export type CatSlot =
  | "fur"
  | "stripe"
  | "belly"
  | "muzzle"
  | "ink"
  | "nose"
  | "eyes";

export type Coat = {
  id: CoatId;
  label: string;
  swatch: string;
  fur: number;
  stripe: number;
  belly: number;
  muzzle: number;
  ink: number;
  nose: number;
  eyes: number;
};

export const COATS: Coat[] = [
  {
    id: "ginger",
    label: "Ginger",
    swatch: "#f4a12c",
    fur: 0xf4a12c,
    stripe: 0xc56a1a,
    belly: 0xfff3d1,
    muzzle: 0xf9fffe,
    ink: 0x1d1d21,
    nose: 0xb02e26,
    eyes: 0x80c71f,
  },
  {
    id: "tuxedo",
    label: "Tuxedo",
    swatch: "#1d1d21",
    fur: 0x1d1d21,
    stripe: 0x111111,
    belly: 0xf9fffe,
    muzzle: 0xf9fffe,
    ink: 0x1d1d21,
    nose: 0xb02e26,
    eyes: 0x80c71f,
  },
  {
    id: "calico",
    label: "Calico",
    swatch: "#e07a2f",
    fur: 0xf4a12c,
    stripe: 0x1d1d21,
    belly: 0xf9fffe,
    muzzle: 0xf9fffe,
    ink: 0x1d1d21,
    nose: 0xb02e26,
    eyes: 0x80c71f,
  },
  {
    id: "siamese",
    label: "Siamese",
    swatch: "#e8d2a8",
    fur: 0xf3e2c4,
    stripe: 0x6b3f24,
    belly: 0xfff8ea,
    muzzle: 0xfff8ea,
    ink: 0x1d1d21,
    nose: 0xc47a7a,
    eyes: 0x3aa0d8,
  },
  {
    id: "jellie",
    label: "Jellie",
    swatch: "#9aa0a6",
    fur: 0x9aa0a6,
    stripe: 0x6b7280,
    belly: 0xe8eaed,
    muzzle: 0xf9fffe,
    ink: 0x1d1d21,
    nose: 0xb02e26,
    eyes: 0x80c71f,
  },
  {
    id: "black",
    label: "Black",
    swatch: "#2a2a2e",
    fur: 0x1d1d21,
    stripe: 0x3a3a40,
    belly: 0x2c2c32,
    muzzle: 0xf9fffe,
    ink: 0x111111,
    nose: 0xb02e26,
    eyes: 0xf4a12c,
  },
];

export const CAT_SLOTS: CatSlot[] = [
  "fur",
  "stripe",
  "belly",
  "muzzle",
  "ink",
  "nose",
  "eyes",
];

const BY_ID = Object.fromEntries(COATS.map((c) => [c.id, c])) as Record<
  CoatId,
  Coat
>;

export function isCoatId(value: unknown): value is CoatId {
  return typeof value === "string" && COAT_IDS.includes(value as CoatId);
}

export function getCoat(id: CoatId | null | undefined): Coat {
  return (id && BY_ID[id]) || BY_ID.ginger;
}

const STORAGE_KEY = "meowton-coat";

export function readStoredCoat(): CoatId {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (isCoatId(value)) return value;
  } catch {
    /* ignore */
  }
  return "ginger";
}

export function writeStoredCoat(id: CoatId) {
  try {
    window.localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* ignore */
  }
}
