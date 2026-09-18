export const COAT_IDS = [
  "tabby",
  "red",
  "calico",
  "british",
  "black",
  "jellie",
  "persian",
  "siamese",
  "white",
  "ragdoll",
  "tuxedo",
] as const;

export type CoatId = (typeof COAT_IDS)[number];

export type CatSlot =
  | "fur"
  | "stripe"
  | "belly"
  | "muzzle"
  | "socks"
  | "tip"
  | "ink"
  | "nose"
  | "eyes"
  | "eyes2";

export type Coat = {
  id: CoatId;
  label: string;
  swatch: string;
  fur: number;
  stripe: number;
  belly: number;
  muzzle: number;
  socks: number;
  tip: number;
  ink: number;
  nose: number;
  eyes: number;
  eyes2: number;
};

const INK = 0x1d1d21;
const NOSE = 0xc48a82;
const YELLOW = 0xe8c44a;
const GREEN = 0x4caf50;
const BLUE = 0x4aa8d8;
const AMBER = 0xe8a030;
const WHITE = 0xf4f1ea;

export const COATS: Coat[] = [
  {
    id: "tabby",
    label: "Tabby",
    swatch: "#8b5a3c",
    fur: 0x8b5a3c,
    stripe: 0x5c3a24,
    belly: 0xe8d5b8,
    muzzle: 0xe8d5b8,
    socks: 0xe8d5b8,
    tip: 0x5c3a24,
    ink: INK,
    nose: NOSE,
    eyes: YELLOW,
    eyes2: YELLOW,
  },
  {
    id: "red",
    label: "Red",
    swatch: "#e38a2c",
    fur: 0xe38a2c,
    stripe: 0xc46a1c,
    belly: 0xf0e6d0,
    muzzle: 0xf0e6d0,
    socks: 0xe8dcc8,
    tip: 0xc46a1c,
    ink: INK,
    nose: NOSE,
    eyes: GREEN,
    eyes2: GREEN,
  },
  {
    id: "calico",
    label: "Calico",
    swatch: "#e08a30",
    fur: 0xe08a30,
    stripe: 0x4a3020,
    belly: WHITE,
    muzzle: WHITE,
    socks: WHITE,
    tip: 0x4a3020,
    ink: INK,
    nose: NOSE,
    eyes: YELLOW,
    eyes2: BLUE,
  },
  {
    id: "british",
    label: "British",
    swatch: "#a8a8a8",
    fur: 0xa8a8a8,
    stripe: 0x6e6e6e,
    belly: 0xb8b8b8,
    muzzle: 0xb0b0b0,
    socks: 0x9a9a9a,
    tip: 0x6e6e6e,
    ink: INK,
    nose: 0x8a8a8a,
    eyes: YELLOW,
    eyes2: YELLOW,
  },
  {
    id: "black",
    label: "Black",
    swatch: "#14141c",
    fur: 0x14141c,
    stripe: 0x0c0c14,
    belly: 0x1a1a24,
    muzzle: 0x1a1a24,
    socks: 0x14141c,
    tip: 0x0c0c14,
    ink: 0x08080c,
    nose: 0xc49aa0,
    eyes: AMBER,
    eyes2: AMBER,
  },
  {
    id: "jellie",
    label: "Jellie",
    swatch: "#8a8a8a",
    fur: WHITE,
    stripe: 0x7a7a7a,
    belly: WHITE,
    muzzle: WHITE,
    socks: WHITE,
    tip: 0x7a7a7a,
    ink: INK,
    nose: NOSE,
    eyes: 0x8a9a70,
    eyes2: 0x8a9a70,
  },
  {
    id: "persian",
    label: "Persian",
    swatch: "#f5d9a8",
    fur: 0xf5d9a8,
    stripe: 0xd4b07a,
    belly: 0xfce4c0,
    muzzle: 0xfce4c0,
    socks: 0xf5d9a8,
    tip: 0xd4b07a,
    ink: INK,
    nose: NOSE,
    eyes: BLUE,
    eyes2: BLUE,
  },
  {
    id: "siamese",
    label: "Siamese",
    swatch: "#e8d8c4",
    fur: 0xe8d8c4,
    stripe: 0xc4a078,
    belly: 0xf3eadc,
    muzzle: 0xf3eadc,
    socks: 0xc4a078,
    tip: 0xc4a078,
    ink: INK,
    nose: NOSE,
    eyes: BLUE,
    eyes2: BLUE,
  },
  {
    id: "white",
    label: "White",
    swatch: "#f4f1ea",
    fur: WHITE,
    stripe: 0xe8e4dc,
    belly: WHITE,
    muzzle: WHITE,
    socks: WHITE,
    tip: WHITE,
    ink: INK,
    nose: NOSE,
    eyes: 0x7ec8e8,
    eyes2: YELLOW,
  },
  {
    id: "ragdoll",
    label: "Ragdoll",
    swatch: "#c4a090",
    fur: WHITE,
    stripe: 0xc4a090,
    belly: WHITE,
    muzzle: WHITE,
    socks: 0xc4a090,
    tip: 0xc4a090,
    ink: INK,
    nose: NOSE,
    eyes: BLUE,
    eyes2: BLUE,
  },
  {
    id: "tuxedo",
    label: "Tuxedo",
    swatch: "#1a1a24",
    fur: 0x14141c,
    stripe: 0x0c0c14,
    belly: WHITE,
    muzzle: WHITE,
    socks: 0xc8c8c8,
    tip: WHITE,
    ink: INK,
    nose: NOSE,
    eyes: GREEN,
    eyes2: GREEN,
  },
];

export const CAT_SLOTS: CatSlot[] = [
  "fur",
  "stripe",
  "belly",
  "muzzle",
  "socks",
  "tip",
  "ink",
  "nose",
  "eyes",
  "eyes2",
];

const BY_ID = Object.fromEntries(COATS.map((c) => [c.id, c])) as Record<
  CoatId,
  Coat
>;

export function isCoatId(value: unknown): value is CoatId {
  return typeof value === "string" && COAT_IDS.includes(value as CoatId);
}

export function getCoat(id: CoatId | null | undefined): Coat {
  return (id && BY_ID[id]) || BY_ID.red;
}

const STORAGE_KEY = "meowton-coat-v2";

export function readStoredCoat(): CoatId {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (value === "ginger") return "red";
    if (isCoatId(value)) return value;
  } catch {
    /* ignore */
  }
  return "red";
}

export function writeStoredCoat(id: CoatId) {
  try {
    window.localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* ignore */
  }
}
