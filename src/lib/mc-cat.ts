import type { CoatId } from "@/lib/cats";

type Three = typeof import("three");
type Texture = InstanceType<Three["Texture"]>;
type Material = InstanceType<Three["MeshLambertMaterial"]>;
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

type Group = InstanceType<Three["Group"]>;

export type McCatBones = {
  facing: Group;
  body: Group;
  head: Group;
  tail1: Group;
  tail2: Group;
};

export type McCat = {
  root: Group;
  material: Material;
  bones: McCatBones;
  headLocal: { x: number; y: number; z: number };
  dispose: () => void;
};

/** Bedrock `animation.cat.sit` rest + Java sit tail, in radians. */
const SIT = {
  bodyX: -Math.PI / 4,
  headX: 0,
  headY: 0,
  tail1X: 0.78,
  tail2X: 0.78,
} as const;

export function tickSitRig(bones: McCatBones, t: number, phase: string) {
  const look = phase === "bonk" ? 0.15 : 1;
  const flick = phase === "awake" ? 1.25 : 1;
  bones.body.rotation.x = SIT.bodyX + Math.sin(t * 1.7) * 0.018;
  bones.head.rotation.y = (Math.sin(t * 0.55) * 0.22 + Math.sin(t * 0.17) * 0.1) * look;
  bones.head.rotation.x = SIT.headX + Math.sin(t * 0.8) * 0.07 * look;
  bones.head.rotation.z = Math.sin(t * 0.4) * 0.03;
  // Tip-heavy sit tail — wiki sitting sticker + animation.cat.sit 45°/45°.
  bones.tail1.rotation.x = SIT.tail1X + Math.sin(t * 1.15) * 0.06;
  bones.tail1.rotation.z = Math.sin(t * 1.4) * 0.08 * flick;
  bones.tail2.rotation.x = SIT.tail2X + Math.sin(t * 2.05 + 0.4) * 0.14 * flick;
  bones.tail2.rotation.z = Math.sin(t * 1.4 + 0.7) * 0.16 * flick;
}

/**
 * Vanilla Ocelot/Cat cubes + official 64×32 entity texture.
 * Sitting pose from CatModel (Java), Y-flipped into Three so +Y is up.
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
  facing.rotation.y = Math.PI / 2;
  root.add(facing);

  const body = new THREE.Group();
  body.position.set(0, 16, -5);
  body.rotation.x = -Math.PI / 4;
  const bodyMesh = mcBox(THREE, material, 20, 0, 4, 16, 6);
  bodyMesh.position.set(0, -11, -5);
  body.add(bodyMesh);
  facing.add(body);

  const head = new THREE.Group();
  head.position.set(0, 12.3, -8);
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

  // tail2 is a child of tail1 — Bedrock geometry.cat, animation.cat.sit.
  const tail1 = new THREE.Group();
  tail1.position.set(0, 5.2, 6.2);
  tail1.rotation.x = SIT.tail1X;
  const t1 = mcBox(THREE, material, 0, 15, 1, 8, 1);
  t1.position.set(0, 4, 0);
  tail1.add(t1);
  const tail2 = new THREE.Group();
  tail2.position.set(0, 8, 0);
  tail2.rotation.x = SIT.tail2X;
  const t2 = mcBox(THREE, material, 4, 15, 1, 8, 1);
  t2.position.set(0, 4, 0);
  tail2.add(t2);
  tail1.add(tail2);
  facing.add(tail1);

  const hind = (x: number) => {
    const g = new THREE.Group();
    g.position.set(x, 6, 5);
    g.rotation.x = Math.PI / 2;
    const mesh = mcBox(THREE, material, 8, 13, 2, 6, 2);
    mesh.position.set(0, -3, 2);
    g.add(mesh);
    facing.add(g);
  };
  hind(1.1);
  hind(-1.1);

  const front = (x: number) => {
    const g = new THREE.Group();
    g.position.set(x, 7.9, -7);
    g.rotation.x = Math.PI / 20;
    const mesh = mcBox(THREE, material, 40, 0, 2, 10, 2);
    mesh.position.set(0, -5, 1);
    g.add(mesh);
    facing.add(g);
  };
  front(1.2);
  front(-1.2);

  return {
    root,
    material,
    bones: { facing, body, head, tail1, tail2 },
    headLocal: { x: 0, y: 12.3, z: -8 },
    dispose: () => {
      root.traverse((obj: Object3D) => {
        const mesh = obj as InstanceType<Three["Mesh"]>;
        if (mesh.geometry) mesh.geometry.dispose();
      });
      material.dispose();
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
