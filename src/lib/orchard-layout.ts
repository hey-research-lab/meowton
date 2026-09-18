export type Vec3 = [number, number, number];

function hash(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function isPath(x: number, z: number) {
  const cx = Math.sin(z * 0.14) * 2.6;
  return Math.abs(x - cx) <= 1.15 && z > -16 && z < 8;
}

export type OrchardLayout = {
  grass: Vec3[];
  grassColor: string[];
  dirt: Vec3[];
  trunks: Vec3[];
  leaves: Vec3[];
  apples: Vec3[];
  dropFrom: Vec3;
};

export function buildOrchard(): OrchardLayout {
  const grass: Vec3[] = [];
  const grassColor: string[] = [];
  const dirt: Vec3[] = [];
  const SIZE = 22;

  for (let x = -SIZE; x <= SIZE; x++) {
    for (let z = -SIZE; z <= SIZE; z++) {
      if (x * x + z * z > SIZE * SIZE + 8) continue;
      if (z > 8) continue;
      if (isPath(x, z)) {
        dirt.push([x, 0, z]);
      } else {
        grass.push([x, 0, z]);
        const n = hash(x * 19.7 + z * 11.3);
        grassColor.push(n > 0.62 ? "#8fbc6a" : n > 0.3 ? "#7aa352" : "#6b9448");
      }
    }
  }

  const treeSpots: Vec3[] = [
    [-8, 0, -5],
    [6, 0, -7],
    [-11, 0, 1],
    [8, 0, -2],
    [-6, 0, -10],
    [5, 0, -12],
    [-13, 0, -6],
    [10, 0, -9],
    [-9, 0, 6],
    [-14, 0, -1],
    [7, 0, 5],
    [-4, 0, -13],
    [3, 0, -11],
    [-12, 0, 7],
    [11, 0, -5],
    [-7, 0, 4],
  ];

  const trunks: Vec3[] = [];
  const leaves: Vec3[] = [];
  const apples: Vec3[] = [];

  for (const [tx, , tz] of treeSpots) {
    if (isPath(Math.round(tx), Math.round(tz))) continue;
    const h = 3 + Math.floor(hash(tx * 3 + tz) * 3);
    for (let y = 1; y <= h; y++) trunks.push([tx, y, tz]);
    const canopy = 1 + (hash(tz * 9 + tx) > 0.5 ? 1 : 0);
    for (let lx = -canopy; lx <= canopy; lx++) {
      for (let ly = 0; ly <= canopy + 1; ly++) {
        for (let lz = -canopy; lz <= canopy; lz++) {
          const d = Math.abs(lx) + Math.abs(ly) * 0.7 + Math.abs(lz);
          if (d > canopy + 1.1) continue;
          if (lx === 0 && lz === 0 && ly === 0) continue;
          leaves.push([tx + lx, h + ly, tz + lz]);
        }
      }
    }
    const fruit = 1 + Math.floor(hash(tx + tz * 4) * 3);
    for (let i = 0; i < fruit; i++) {
      const ox = (hash(tx + i * 3.1) - 0.5) * 2.2;
      const oz = (hash(tz + i * 5.7) - 0.5) * 2.2;
      apples.push([tx + ox, h + 0.2 + hash(i + tx) * 1.4, tz + oz]);
    }
  }

  trunks.push([1.2, 2.2, 1.4], [1.2, 3.1, 1.4], [0.5, 3.4, 1.1]);
  leaves.push([0.5, 4.1, 1.1], [1.2, 4.2, 1.4], [0.2, 4.3, 0.6], [0.6, 4.8, 1.0]);
  const dropFrom: Vec3 = [0.2, 4.55, 0.85];
  apples.push(dropFrom);

  return { grass, grassColor, dirt, trunks, leaves, apples, dropFrom };
}
