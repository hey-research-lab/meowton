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

export function tickSitRig(bones: McCatBones, t: number, phase: string) {
  const look = phase === "bonk" ? 0.2 : 1;
  bones.body.rotation.x = STAND.bodyX + Math.sin(t * 2.1) * 0.012;
  bones.head.rotation.y = (Math.sin(t * 0.5) * 0.16 + Math.sin(t * 0.14) * 0.08) * look;
  bones.head.rotation.x = STAND.headX + Math.sin(t * 0.75) * 0.05 * look;
  bones.tail1.rotation.x = STAND.tail1X + Math.sin(t * 1.2) * 0.05;
  bones.tail1.rotation.z = Math.sin(t * 1.35) * 0.06;
  bones.tail2.rotation.x = STAND.tail2X + Math.sin(t * 1.8 + 0.4) * 0.1;
  bones.tail2.rotation.z = Math.sin(t * 1.35 + 0.5) * 0.12;
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

  const hind = (x: number) => {
    const g = new THREE.Group();
    g.position.set(x, 6, 5.2);
    const mesh = mcBox(THREE, material, 8, 13, 2, 6, 2);
    mesh.position.set(0, -3, 0);
    g.add(mesh);
    facing.add(g);
  };
  hind(1.1);
  hind(-1.1);

  const front = (x: number) => {
    const g = new THREE.Group();
    g.position.set(x, 6, -5.2);
    const mesh = mcBox(THREE, material, 40, 0, 2, 6, 2);
    mesh.position.set(0, -3, 0);
    g.add(mesh);
    facing.add(g);
  };
  front(1.2);
  front(-1.2);

  return {
    root,
    material,
    bones: { facing, body, head, tail1, tail2 },
    headLocal: { x: 0, y: 8.6, z: -9.2 },
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
