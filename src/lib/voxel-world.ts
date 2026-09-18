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
};

const PALETTE: Record<number, [number, number, number]> = {
  [BLOCK.GRASS]: [0.24, 0.42, 0.227],
  [BLOCK.DIRT]: [0.43, 0.29, 0.196],
  [BLOCK.WOOD]: [0.345, 0.22, 0.137],
  [BLOCK.LEAF]: [0.165, 0.345, 0.165],
  [BLOCK.LEAF_LIT]: [0.29, 0.478, 0.22],
  [BLOCK.APPLE]: [0.768, 0.118, 0.227],
  [BLOCK.STONE]: [0.545, 0.478, 0.408],
  [BLOCK.GOLD]: [0.768, 0.64, 0.353],
  [BLOCK.MOSS]: [0.325, 0.455, 0.267],
};

const GRASS_TOP: [number, number, number] = [0.31, 0.52, 0.275];

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

  const pathZ0 = CZ + 1;
  for (let z = pathZ0; z < WZ - 2; z++) {
    for (let dx = -1; dx <= 1; dx++) {
      const x = CX + dx;
      const n = hash2(x, z);
      if (dx !== 0 && n > 0.65) continue;
      set(x, 2, z, BLOCK.STONE);
      if (n > 0.82) set(x, 3, z, BLOCK.MOSS);
    }
  }

  const addTree = (
    tx: number,
    tz: number,
    trunkH: number,
    radius: number,
  ) => {
    const top = 3 + trunkH;
    for (let y = 3; y < top; y++) set(tx, y, tz, BLOCK.WOOD);
    set(tx, top, tz, BLOCK.WOOD);
    for (let y = top - 2; y <= top + 2; y++) {
      const yr = 1 - Math.abs(y - top) / 3;
      const r = Math.max(1, Math.round(radius * yr + 0.2));
      for (let dz = -r; dz <= r; dz++) {
        for (let dx = -r; dx <= r; dx++) {
          const dist = Math.hypot(dx, dz, (y - top) * 0.85);
          if (dist > radius + 0.15) continue;
          if (dx === 0 && dz === 0 && y <= top) continue;
          const n = hash3(tx + dx, y, tz + dz);
          if (n < 0.16) continue;
          const leaf = n > 0.62 ? BLOCK.LEAF_LIT : BLOCK.LEAF;
          set(tx + dx, y, tz + dz, leaf);
          if (n > 0.62 && y <= top && dist > 0.85 && dist < radius * 0.95) {
            set(tx + dx, y - 1, tz + dz, BLOCK.APPLE);
            appleSpawns.push(toWorld(tx + dx, y - 1, tz + dz));
          }
        }
      }
    }
  };

  addTree(CX - 4, CZ - 4, 7, 3.05);
  addTree(CX + 6, CZ - 5, 6, 2.9);
  addTree(CX, CZ - 8, 8, 3.2);
  addTree(CX - 11, CZ - 9, 5, 3);
  addTree(CX + 12, CZ - 10, 6, 3.2);
  addTree(CX - 16, CZ - 5, 5, 2.8);
  addTree(CX + 16, CZ - 6, 5, 2.8);
  addTree(CX - 8, CZ - 14, 4, 2.6);
  addTree(CX + 8, CZ - 15, 5, 2.8);

  for (const [bx, bz] of [
    [CX - 16, CZ + 5],
    [CX + 16, CZ + 6],
    [CX - 18, CZ + 8],
    [CX + 17, CZ + 9],
  ] as const) {
    set(bx, 3, bz, BLOCK.LEAF);
    set(bx, 4, bz, hash2(bx, bz) > 0.5 ? BLOCK.LEAF_LIT : BLOCK.LEAF);
    if (hash2(bx, bz) > 0.4) set(bx, 3, bz + 1, BLOCK.LEAF);
  }

  set(CX - 10, 3, CZ - 2, BLOCK.STONE);
  set(CX - 10, 4, CZ - 2, BLOCK.STONE);
  set(CX - 10, 5, CZ - 2, BLOCK.GOLD);

  const cat = { x: 0, y: 3 * S, z: 2.6 };
  const drop = { x: 0.4, y: 6.6, z: 1.4 };

  return { blocks, appleSpawns, drop, cat, groundY: 3 * S };
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
            [cr, cg, cb] = [0.27, 0.4, 0.2];
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
