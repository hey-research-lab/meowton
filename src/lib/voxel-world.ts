export const S = 0.5;
export const WX = 56;
export const WY = 18;
export const WZ = 56;
export const CX = 28;
export const CZ = 28;

export const BLOCK = {
  AIR: 0,
  GRASS: 1,
  DIRT: 2,
  WOOD: 3,
  LEAF: 4,
  LEAF_LIT: 5,
  APPLE: 6,
  STONE: 7,
  GOLD: 8,
  MOSS: 9,
} as const;

type Three = typeof import("three");

export type OrchardData = {
  blocks: Uint8Array;
  appleSpawns: { x: number; y: number; z: number }[];
  drop: { x: number; y: number; z: number };
  cat: { x: number; y: number; z: number };
  groundY: number;
  trunks: { x: number; z: number }[];
  waypoints: { x: number; z: number }[];
};

const PALETTE: Record<number, [number, number, number]> = {
  [BLOCK.GRASS]: [0.45, 0.58, 0.32],
  [BLOCK.DIRT]: [0.52, 0.36, 0.22],
  [BLOCK.WOOD]: [0.42, 0.28, 0.16],
  [BLOCK.LEAF]: [0.28, 0.5, 0.22],
  [BLOCK.LEAF_LIT]: [0.4, 0.62, 0.26],
  [BLOCK.APPLE]: [0.82, 0.16, 0.2],
  [BLOCK.STONE]: [0.72, 0.64, 0.5],
  [BLOCK.GOLD]: [0.8, 0.66, 0.36],
  [BLOCK.MOSS]: [0.4, 0.52, 0.28],
};

const GRASS_TOP: [number, number, number] = [0.5, 0.66, 0.3];

const FACES: {
  d: [number, number, number];
  v: [number, number, number][];
  shade: number;
}[] = [
  {
    d: [0, 1, 0],
    v: [
      [0, 1, 1],
      [1, 1, 1],
      [1, 1, 0],
      [0, 1, 0],
    ],
    shade: 1,
  },
  {
    d: [0, -1, 0],
    v: [
      [0, 0, 0],
      [1, 0, 0],
      [1, 0, 1],
      [0, 0, 1],
    ],
    shade: 0.48,
  },
  {
    d: [0, 0, -1],
    v: [
      [1, 0, 0],
      [0, 0, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
    shade: 0.8,
  },
  {
    d: [0, 0, 1],
    v: [
      [0, 0, 1],
      [1, 0, 1],
      [1, 1, 1],
      [0, 1, 1],
    ],
    shade: 0.86,
  },
  {
    d: [-1, 0, 0],
    v: [
      [0, 0, 0],
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0],
    ],
    shade: 0.7,
  },
  {
    d: [1, 0, 0],
    v: [
      [1, 0, 1],
      [1, 0, 0],
      [1, 1, 0],
      [1, 1, 1],
    ],
    shade: 0.74,
  },
];

function idx(x: number, y: number, z: number) {
  return x + y * WX + z * WX * WY;
}

function inb(x: number, y: number, z: number) {
  return x >= 0 && y >= 0 && z >= 0 && x < WX && y < WY && z < WZ;
}

function hash2(x: number, z: number) {
  const n = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function hash3(x: number, y: number, z: number) {
  const n = Math.sin(x * 73.1 + y * 157.3 + z * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

export function toWorld(x: number, y: number, z: number) {
  return {
    x: (x - CX + 0.5) * S,
    y: y * S,
    z: (z - CZ + 0.5) * S,
  };
}

export function generateOrchard(): OrchardData {
  const blocks = new Uint8Array(WX * WY * WZ);
  const appleSpawns: { x: number; y: number; z: number }[] = [];

  const set = (x: number, y: number, z: number, id: number) => {
    if (!inb(x, y, z)) return;
    blocks[idx(x, y, z)] = id;
  };

  for (let z = 0; z < WZ; z++) {
    for (let x = 0; x < WX; x++) {
      const dx = x - CX;
      const dz = z - CZ;
      const d = Math.hypot(dx, dz);
      const n = hash2(x, z);
      const rim = d > 12 ? Math.floor(n * Math.min(2, (d - 12) / 10) + n * 0.25) : 0;
      const h = 2 + rim;
      for (let y = 0; y <= h; y++) {
        let id: number = BLOCK.DIRT;
        if (y === 0) id = BLOCK.STONE;
        else if (y === h) id = n > 0.86 && d > 5 ? BLOCK.MOSS : BLOCK.GRASS;
        else if (y === 1 && n > 0.55) id = BLOCK.STONE;
        set(x, y, z, id);
      }
    }
  }

  const pathZ0 = CZ - 10;
  for (let z = pathZ0; z < CZ + 10; z++) {
    for (let dx = -1; dx <= 1; dx++) {
      const x = CX + dx;
      const n = hash2(x, z);
      if (dx !== 0 && n > 0.7) continue;
      set(x, 2, z, BLOCK.STONE);
    }
  }

  const addTree = (
    tx: number,
    tz: number,
    trunkH: number,
    radius: number,
  ) => {
    const top = 3 + trunkH;
    for (let y = 3; y <= top; y++) set(tx, y, tz, BLOCK.WOOD);
    const cy = top + 1;
    const rMax = Math.ceil(radius);
    for (let y = cy - rMax; y <= cy + rMax; y++) {
      for (let dz = -rMax; dz <= rMax; dz++) {
        for (let dx = -rMax; dx <= rMax; dx++) {
          const dist = Math.hypot(dx, dz, (y - cy) * 0.92);
          if (dist > radius) continue;
          if (dx === 0 && dz === 0 && y <= top) continue;
          const n = hash3(tx + dx, y, tz + dz);
          if (n < 0.14) continue;
          const outer = dist > radius - 0.85;
          if (outer && n > 0.9) {
            set(tx + dx, y, tz + dz, BLOCK.APPLE);
            appleSpawns.push(toWorld(tx + dx, y, tz + dz));
          } else {
            set(tx + dx, y, tz + dz, n > 0.55 ? BLOCK.LEAF_LIT : BLOCK.LEAF);
          }
        }
      }
    }
  };

  const addBush = (bx: number, bz: number) => {
    set(bx, 3, bz, BLOCK.LEAF);
    if (hash2(bx, bz) > 0.4) set(bx, 4, bz, BLOCK.LEAF_LIT);
    if (hash2(bx + 1, bz) > 0.45) set(bx + 1, 3, bz, BLOCK.LEAF);
  };

  const grove = [
    [CX + 6, CZ - 6, 5, 2.35],
    [CX + 11, CZ - 5, 6, 2.55],
    [CX + 16, CZ - 8, 5, 2.4],
    [CX - 5, CZ - 7, 5, 2.3],
    [CX - 10, CZ - 9, 5, 2.25],
    [CX, CZ - 11, 6, 2.5],
    [CX + 8, CZ - 12, 5, 2.35],
    [CX - 7, CZ - 13, 4, 2.2],
    [CX + 14, CZ - 14, 5, 2.4],
    [CX - 14, CZ - 11, 4, 2.15],
    [CX + 4, CZ - 16, 5, 2.3],
    [CX - 3, CZ - 18, 4, 2.2],
    [CX + 10, CZ - 19, 5, 2.35],
  ] as const;
  for (const [tx, tz, h, r] of grove) addTree(tx, tz, h, r);

  for (const [bx, bz] of [
    [CX - 4, CZ + 3],
    [CX + 5, CZ + 2],
    [CX - 8, CZ + 1],
    [CX + 8, CZ + 4],
    [CX + 3, CZ - 3],
    [CX - 6, CZ - 2],
    [CX + 13, CZ - 2],
    [CX - 12, CZ + 2],
  ] as const) {
    addBush(bx, bz);
  }

  const cat = { x: -1.45, y: 3 * S, z: 2.15 };
  const drop = { x: 2.35, y: 3.55, z: -0.4 };
  const trunks = grove.map(([tx, tz]) => toWorld(tx, 3, tz));
  const waypoints = [
    { x: -1.45, z: 2.15 },
    { x: 0.15, z: 1.35 },
    { x: 1.7, z: 0.35 },
    { x: 2.55, z: -0.85 },
    { x: 1.1, z: -1.65 },
    { x: -0.35, z: -1.2 },
    { x: -1.8, z: -0.15 },
    { x: -2.15, z: 1.1 },
  ];

  return { blocks, appleSpawns, drop, cat, groundY: 3 * S, trunks, waypoints };
}

export function meshOrchard(THREE: Three, blocks: Uint8Array) {
  const positions: number[] = [];
  const normals: number[] = [];
  const colors: number[] = [];

  const solid = (x: number, y: number, z: number) => {
    if (y < 0) return true;
    if (!inb(x, y, z)) return false;
    return blocks[idx(x, y, z)] !== BLOCK.AIR;
  };

  for (let z = 0; z < WZ; z++) {
    for (let y = 0; y < WY; y++) {
      for (let x = 0; x < WX; x++) {
        const id = blocks[idx(x, y, z)];
        if (id === BLOCK.AIR) continue;
        const jitter = (hash3(x, y, z) - 0.5) * 0.07;
        for (const face of FACES) {
          if (solid(x + face.d[0], y + face.d[1], z + face.d[2])) continue;
          let [cr, cg, cb] = PALETTE[id] ?? PALETTE[BLOCK.STONE];
          if (id === BLOCK.GRASS && face.d[1] > 0) {
            [cr, cg, cb] = GRASS_TOP;
          } else if (id === BLOCK.GRASS) {
            [cr, cg, cb] = [0.34, 0.5, 0.22];
          }
          const shade = face.shade * (1 + jitter);
          const r = Math.min(1, cr * shade);
          const g = Math.min(1, cg * shade);
          const b = Math.min(1, cb * shade);
          const v = face.v;
          const tri = [0, 1, 2, 0, 2, 3];
          for (const t of tri) {
            positions.push((x + v[t][0] - CX) * S, (y + v[t][1]) * S, (z + v[t][2] - CZ) * S);
            normals.push(face.d[0], face.d[1], face.d[2]);
            colors.push(r, g, b);
          }
        }
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geo.computeBoundingSphere();

  const mat = new THREE.MeshLambertMaterial({
    vertexColors: true,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.name = "orchard";
  return mesh;
}
