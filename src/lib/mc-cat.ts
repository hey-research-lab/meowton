import type { CoatId } from "@/lib/cats";

type Three = typeof import("three");
type Texture = InstanceType<Three["Texture"]>;
type Material = InstanceType<Three["MeshLambertMaterial"]>;
type Group = InstanceType<Three["Group"]>;
type Object3D = InstanceType<Three["Object3D"]>;

/** Official vanilla files. `black.png` is tuxedo; solid black is `all_black`. */
export const COAT_TEXTURE: Record<CoatId, string> = {
  tabby: "/cat/tabby.png",
  red: "/cat/red.png",
  calico: "/cat/calico.png",
  british: "/cat/british_shorthair.png",
  black: "/cat/all_black.png",
  jellie: "/cat/jellie.png",
  persian: "/cat/persian.png",
  siamese: "/cat/siamese.png",
  white: "/cat/white.png",
  ragdoll: "/cat/ragdoll.png",
  tuxedo: "/cat/black.png",
};

const TEX_W = 64;
const TEX_H = 32;

function setMcUvs(
  geo: InstanceType<Three["BoxGeometry"]>,
  u: number,
  v: number,
  w: number,
  h: number,
  d: number,
) {
  const attr = geo.attributes.uv;
  const faces: [number, number, number, number][] = [
    [u + d + w, v + d, d, h],
    [u, v + d, d, h],
    [u + d, v, w, d],
    [u + d + w, v, w, d],
    [u + d + w + d, v + d, w, h],
    [u + d, v + d, w, h],
  ];
  for (let f = 0; f < 6; f++) {
    const [su, sv, sw, sh] = faces[f];
    const u0 = su / TEX_W;
    const u1 = (su + sw) / TEX_W;
    const v0 = 1 - sv / TEX_H;
    const v1 = 1 - (sv + sh) / TEX_H;
    const i = f * 4;
    attr.setXY(i + 0, u0, v0);
    attr.setXY(i + 1, u1, v0);
    attr.setXY(i + 2, u0, v1);
    attr.setXY(i + 3, u1, v1);
  }
  attr.needsUpdate = true;
}

function voxel(
  THREE: Three,
  color: number,
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number,
  parent: Group,
  mats: Material[],
) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshLambertMaterial({ color });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  mats.push(mat);
  return mesh;
}

/** Isaac kit: powdered wig + rust coat, still cubes. */
function dressNewton(THREE: Three, facing: Group, head: Group, mats: Material[]) {
  const WIG = 0xf3eee3;
  const CURL = 0xe6dfd2;
  const COAT = 0x8c3d24;
  const SKIRT = 0x6e2f19;
  const VEST = 0x3d5640;
  const CRAVAT = 0xf7f4ec;
  const GOLD = 0xd4a43a;

  voxel(THREE, WIG, 5.6, 2.2, 4.4, 0, 2.4, 0.3, head, mats);
  voxel(THREE, CURL, 2.5, 4.4, 2.6, 3.15, 0.35, 0.55, head, mats);
  voxel(THREE, CURL, 2.5, 4.4, 2.6, -3.15, 0.35, 0.55, head, mats);
  voxel(THREE, WIG, 4.8, 3.8, 2.5, 0, 0.55, 2.7, head, mats);
  voxel(THREE, CURL, 1.7, 3.5, 1.7, 2.7, -0.55, -1.55, head, mats);
  voxel(THREE, CURL, 1.7, 3.5, 1.7, -2.7, -0.55, -1.55, head, mats);
  voxel(THREE, CURL, 1.5, 2.2, 1.5, 3.5, 1.7, 1.9, head, mats);
  voxel(THREE, CURL, 1.5, 2.2, 1.5, -3.5, 1.7, 1.9, head, mats);
  voxel(THREE, WIG, 2.2, 1.6, 2.2, 0, 3.2, -0.4, head, mats);

  voxel(THREE, COAT, 7.2, 5.0, 11.0, 0, 6.05, 0.5, facing, mats);
  voxel(THREE, SKIRT, 7.4, 3.2, 6.2, 0, 4.35, 5.1, facing, mats);
  voxel(THREE, COAT, 2.2, 3.2, 3.4, 4.3, 6.15, -3.1, facing, mats);
  voxel(THREE, COAT, 2.2, 3.2, 3.4, -4.3, 6.15, -3.1, facing, mats);
  voxel(THREE, VEST, 4.0, 3.4, 2.0, 0, 6.15, -5.5, facing, mats);
  voxel(THREE, CRAVAT, 3.2, 2.6, 1.5, 0, 7.45, -7.15, facing, mats);
  voxel(THREE, CRAVAT, 2.2, 1.5, 1.2, 0, 6.55, -7.55, facing, mats);
  voxel(THREE, GOLD, 0.7, 0.9, 0.45, 0.85, 6.35, -6.45, facing, mats);
}

function mcBox(
  THREE: Three,
  mat: Material,
  u: number,
  v: number,
  w: number,
  h: number,
  d: number,
) {
  const geo = new THREE.BoxGeometry(w, h, d);
  setMcUvs(geo, u, v, w, h, d);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export type McCatBones = {
  facing: Group;
  body: Group;
  head: Group;
  tail1: Group;
  tail2: Group;
  frontL: Group;
  frontR: Group;
  hindL: Group;
  hindR: Group;
};

export type McCat = {
  root: Group;
  material: Material;
  bones: McCatBones;
  headLocal: { x: number; y: number; z: number };
  dispose: () => void;
};

const STAND = {
  bodyX: -Math.PI / 2,
  headX: 0,
  tail1X: 0.55,
  tail2X: 0.35,
} as const;

/** Java OcelotModel / Bedrock animation.cat.walk — trot, ±57.3° × speed. */
export function tickCatRig(
  bones: McCatBones,
  input: { t: number; dist: number; speed: number; phase: string; jumping: boolean },
) {
  const { t, dist, phase, jumping } = input;
  const speed = jumping ? 0 : Math.max(0, Math.min(1.15, input.speed));
  const look = phase === "bonk" ? 0.15 : 1;
  const swing = Math.cos(dist * 0.6662) * speed;
  const swingOpp = Math.cos(dist * 0.6662 + Math.PI) * speed;

  bones.frontL.rotation.x = swingOpp;
  bones.frontR.rotation.x = swing;
  bones.hindL.rotation.x = swing;
  bones.hindR.rotation.x = swingOpp;

  bones.body.rotation.x = STAND.bodyX + Math.sin(dist * 1.33) * 0.04 * speed;
  bones.head.rotation.y = (Math.sin(t * 0.5) * 0.16 + Math.sin(t * 0.14) * 0.08) * look;
  bones.head.rotation.x = STAND.headX + Math.sin(t * 0.75) * 0.05 * look;
  bones.tail1.rotation.x = STAND.tail1X + Math.cos(dist * 1.0) * 0.14 * Math.max(0.25, speed);
  bones.tail1.rotation.z = Math.sin(t * 1.35) * 0.05;
  bones.tail2.rotation.x = STAND.tail2X + Math.cos(dist * 1.0) * 0.22 * Math.max(0.25, speed);
  bones.tail2.rotation.z = Math.sin(t * 1.35 + 0.5) * 0.1;
}

export function tickSitRig(
  bones: McCatBones,
  t: number,
  phase: string,
) {
  tickCatRig(bones, { t, dist: 0, speed: 0, phase, jumping: false });
}

/**
 * Standing quadruped matching the official wiki isometric render:
 * slim 4×6×16 body, 5×4×5 head, 1-wide tail, 2-wide legs.
 */
export function buildMcCat(THREE: Three, texture: Texture): McCat {
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = THREE.SRGBColorSpace;

  const material = new THREE.MeshLambertMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.08,
  });

  const root = new THREE.Group();
  const facing = new THREE.Group();
  root.add(facing);

  const body = new THREE.Group();
  body.position.set(0, 6.2, 0);
  body.rotation.x = STAND.bodyX;
  body.add(mcBox(THREE, material, 20, 0, 4, 16, 6));
  facing.add(body);

  const head = new THREE.Group();
  head.position.set(0, 8.6, -9.2);
  const skull = mcBox(THREE, material, 0, 0, 5, 4, 5);
  skull.position.set(0, 0, -0.5);
  const nose = mcBox(THREE, material, 0, 24, 3, 2, 2);
  nose.position.set(0, -1, -3);
  const earL = mcBox(THREE, material, 0, 10, 1, 1, 2);
  earL.position.set(1.5, 2.5, 1);
  const earR = mcBox(THREE, material, 6, 10, 1, 1, 2);
  earR.position.set(-1.5, 2.5, 1);
  head.add(skull, nose, earL, earR);
  facing.add(head);

  const tail1 = new THREE.Group();
  tail1.position.set(0, 8.2, 8);
  tail1.rotation.x = STAND.tail1X;
  const t1 = mcBox(THREE, material, 0, 15, 1, 8, 1);
  t1.position.set(0, 4, 0);
  tail1.add(t1);
  const tail2 = new THREE.Group();
  tail2.position.set(0, 8, 0);
  tail2.rotation.x = STAND.tail2X;
  const t2 = mcBox(THREE, material, 4, 15, 1, 8, 1);
  t2.position.set(0, 4, 0);
  tail2.add(t2);
  tail1.add(tail2);
  facing.add(tail1);

  const hindL = new THREE.Group();
  hindL.position.set(1.1, 6, 5.2);
  const hindLMesh = mcBox(THREE, material, 8, 13, 2, 6, 2);
  hindLMesh.position.set(0, -3, 0);
  hindL.add(hindLMesh);
  facing.add(hindL);
  const hindR = new THREE.Group();
  hindR.position.set(-1.1, 6, 5.2);
  const hindRMesh = mcBox(THREE, material, 8, 13, 2, 6, 2);
  hindRMesh.position.set(0, -3, 0);
  hindR.add(hindRMesh);
  facing.add(hindR);

  const frontL = new THREE.Group();
  frontL.position.set(1.2, 6, -5.2);
  const frontLMesh = mcBox(THREE, material, 40, 0, 2, 6, 2);
  frontLMesh.position.set(0, -3, 0);
  frontL.add(frontLMesh);
  facing.add(frontL);
  const frontR = new THREE.Group();
  frontR.position.set(-1.2, 6, -5.2);
  const frontRMesh = mcBox(THREE, material, 40, 0, 2, 6, 2);
  frontRMesh.position.set(0, -3, 0);
  frontR.add(frontRMesh);
  facing.add(frontR);

  const kit: Material[] = [];
  dressNewton(THREE, facing, head, kit);

  return {
    root,
    material,
    bones: { facing, body, head, tail1, tail2, frontL, frontR, hindL, hindR },
    headLocal: { x: 0, y: 8.6, z: -9.2 },
    dispose: () => {
      root.traverse((obj: Object3D) => {
        const mesh = obj as InstanceType<Three["Mesh"]>;
        if (mesh.geometry) mesh.geometry.dispose();
      });
      material.dispose();
      for (const m of kit) m.dispose();
    },
  };
}

export function applyCatTexture(material: Material, texture: Texture, THREE: Three) {
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  const prev = material.map;
  material.map = texture;
  material.needsUpdate = true;
  if (prev && prev !== texture) prev.dispose();
}
