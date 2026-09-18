import { useEffect, useRef } from "react";
import { applyCatTexture, buildMcCat, COAT_TEXTURE, tickSitRig } from "@/lib/mc-cat";
import { onOrchardTap, useNewton } from "@/lib/newton";
import { generateOrchard, meshOrchard } from "@/lib/voxel-world";

type Three = typeof import("three");

const MAX_APPLES = 12;
const MAX_PARTICLES = 80;
const GRAVITY = 11.2;

type Apple = {
  live: boolean;
  destined: boolean;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  spin: number;
  scale: number;
};

type Particle = {
  live: boolean;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  max: number;
  scale: number;
  r: number;
  g: number;
  b: number;
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function makeSky(THREE: Three) {
  const geo = new THREE.SphereGeometry(48, 24, 16);
  const col = new Float32Array(geo.attributes.position.count * 3);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const t = Math.min(1, Math.max(0, (y + 8) / 28));
    const r = 0.96 * (1 - t) + 0.82 * t;
    const g = 0.91 * (1 - t) + 0.86 * t;
    const b = 0.8 * (1 - t) + 0.84 * t;
    col[i * 3] = r;
    col[i * 3 + 1] = g;
    col[i * 3 + 2] = b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const mat = new THREE.MeshBasicMaterial({
    vertexColors: true,
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  return mesh;
}

function playBonk() {
  try {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(240, t);
    osc.frequency.exponentialRampToValueAtTime(64, t + 0.2);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.24);
    void ctx.resume();
  } catch {
    /* ignore */
  }
}

function boot(canvas: HTMLCanvasElement, THREE: Three) {
  const reduced = prefersReducedMotion();
  useNewton.getState().reset(reduced);

  const orchard = generateOrchard();
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: window.innerWidth > 720,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0xf4ead8, 1);
  renderer.shadowMap.enabled = !reduced;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf4ead8);
  scene.fog = new THREE.Fog(0xf4ead8, 28, 64);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.2, 80);

  const hemi = new THREE.HemisphereLight(0xf7ead4, 0x4a6e38, 0.85);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffe2b0, 2.35);
  sun.position.set(14, 13, 5);
  sun.castShadow = !reduced;
  sun.shadow.mapSize.set(reduced ? 512 : 1536, reduced ? 512 : 1536);
  sun.shadow.camera.near = 2;
  sun.shadow.camera.far = 40;
  sun.shadow.camera.left = -14;
  sun.shadow.camera.right = 14;
  sun.shadow.camera.top = 12;
  sun.shadow.camera.bottom = -8;
  sun.shadow.bias = -0.0008;
  scene.add(sun);
  scene.add(new THREE.AmbientLight(0xf4ead8, 0.22));

  const sky = makeSky(THREE);
  scene.add(sky);

  const terrain = meshOrchard(THREE, orchard.blocks);
  scene.add(terrain);

  const loader = new THREE.TextureLoader();
  const coatCache = new Map<string, InstanceType<Three["Texture"]>>();
  const loadCoat = (id: string) => {
    const url = COAT_TEXTURE[id as keyof typeof COAT_TEXTURE] ?? COAT_TEXTURE.red;
    const hit = coatCache.get(url);
    if (hit) return hit;
    const tex = loader.load(url);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    tex.colorSpace = THREE.SRGBColorSpace;
    coatCache.set(url, tex);
    return tex;
  };
  const mcCat = buildMcCat(THREE, loadCoat(useNewton.getState().coat));
  const cat = mcCat.root;
  cat.position.set(orchard.cat.x, orchard.cat.y, orchard.cat.z);
  scene.add(cat);
  let lastCoat = useNewton.getState().coat;
  const unCoat = useNewton.subscribe((state) => {
    if (state.coat === lastCoat) return;
    lastCoat = state.coat;
    applyCatTexture(mcCat.material, loadCoat(state.coat), THREE);
  });

  const appleGeo = new THREE.BoxGeometry(0.48, 0.48, 0.48);
  const appleMat = new THREE.MeshLambertMaterial({ color: 0xd12a32 });
  const appleMesh = new THREE.InstancedMesh(appleGeo, appleMat, MAX_APPLES);
  appleMesh.castShadow = true;
  appleMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(appleMesh);

  const pGeo = new THREE.BoxGeometry(1, 1, 1);
  const pMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const pMesh = new THREE.InstancedMesh(pGeo, pMat, MAX_PARTICLES);
  pMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  pMesh.instanceColor = new THREE.InstancedBufferAttribute(
    new Float32Array(MAX_PARTICLES * 3),
    3,
  );
  scene.add(pMesh);

  const dummy = new THREE.Object3D();
  const look = new THREE.Vector3(0, 2.4, -1.4);
  const apples: Apple[] = Array.from({ length: MAX_APPLES }, () => ({
    live: false,
    destined: false,
    x: 0,
    y: 0,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    spin: 0,
    scale: 1,
  }));
  const particles: Particle[] = Array.from({ length: MAX_PARTICLES }, () => ({
    live: false,
    x: 0,
    y: 0,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0,
    life: 0,
    max: 1,
    scale: 0.1,
    r: 0.77,
    g: 0.12,
    b: 0.23,
  }));

  let phase: "ignorant" | "falling" | "bonk" | "awake" = reduced ? "awake" : "ignorant";
  let spawnTimer = 0;
  let destinedIn = reduced ? 99 : 2.8;
  let bonkT = 0;
  let hitstop = 0;
  let trauma = 0;
  let catX = orchard.cat.x;
  let catZ = orchard.cat.z;
  let catY = 0;
  let catVy = 0;
  let jumping = false;
  let dir: 1 | -1 = 1;
  let yaw = 2.72;
  let orbit = 0;
  let pointerX = 0;
  let pointerY = 0;
  const groundY = orchard.groundY;

  const CAT_SCALE = 0.125;
  const HEAD_FWD = 9.2;
  const HEAD_UP = 8.6;
  // Standing model faces −Z at yaw 0.
  const headX = () => catX + Math.sin(yaw) * HEAD_FWD * CAT_SCALE;
  const headY = () => groundY + catY + HEAD_UP * CAT_SCALE;
  const headZ = () => catZ - Math.cos(yaw) * HEAD_FWD * CAT_SCALE;

  const spawnApple = (opts: {
    destined?: boolean;
    from?: { x: number; y: number; z: number };
  }) => {
    const slot = apples.find((a) => !a.live);
    if (!slot) return;
    const src =
      opts.from ??
      orchard.appleSpawns[
        Math.floor(Math.random() * Math.max(1, orchard.appleSpawns.length))
      ] ??
      orchard.drop;
    slot.live = true;
    slot.destined = Boolean(opts.destined);
    slot.x = src.x + (opts.destined ? 0 : (Math.random() - 0.5) * 0.4);
    slot.y = src.y + 0.1;
    slot.z = src.z + (opts.destined ? 0 : (Math.random() - 0.5) * 0.4);
    slot.vx = opts.destined ? (headX() - slot.x) * 0.28 : (Math.random() - 0.5) * 0.5;
    slot.vy = opts.destined ? 0.05 : 0.15;
    slot.vz = opts.destined ? (headZ() - slot.z) * 0.28 : (Math.random() - 0.5) * 0.5;
    slot.spin = (Math.random() - 0.5) * 4;
    slot.scale = 1.05 + Math.random() * 0.28;
  };

  const burst = (
    x: number,
    y: number,
    z: number,
    n: number,
    color: [number, number, number],
  ) => {
    let left = n;
    for (const p of particles) {
      if (left <= 0) break;
      if (p.live) continue;
      p.live = true;
      p.x = x;
      p.y = y;
      p.z = z;
      p.vx = (Math.random() - 0.5) * 3.4;
      p.vy = 1.4 + Math.random() * 2.6;
      p.vz = (Math.random() - 0.5) * 3.4;
      p.life = 0;
      p.max = 0.45 + Math.random() * 0.4;
      p.scale = 0.06 + Math.random() * 0.08;
      p.r = color[0];
      p.g = color[1];
      p.b = color[2];
      left -= 1;
    }
  };

  const startDestined = () => {
    if (phase !== "ignorant") return;
    spawnApple({ destined: true, from: orchard.drop });
    phase = "falling";
    useNewton.getState().setPhase("falling");
  };

  const leap = () => {
    if (phase !== "awake") return;
    if (jumping) return;
    jumping = true;
    catVy = 4.6;
  };

  const onTap = () => {
    if (reduced) return;
    if (phase === "ignorant") startDestined();
    else if (phase === "awake") leap();
  };

  const unTap = onOrchardTap(onTap);
  const onKey = (e: KeyboardEvent) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
      e.preventDefault();
      onTap();
    }
  };
  window.addEventListener("keydown", onKey);
  const onMove = (e: PointerEvent) => {
    pointerX = e.clientX / Math.max(1, window.innerWidth) - 0.5;
    pointerY = e.clientY / Math.max(1, window.innerHeight) - 0.5;
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  const fit = () => {
    const dpr = Math.min(
      window.devicePixelRatio || 1,
      window.innerWidth < 700 ? 1.35 : 1.75,
    );
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = Math.max(w / Math.max(1, h), 0.4);
    camera.updateProjectionMatrix();
  };
  fit();
  const ro = new ResizeObserver(fit);
  ro.observe(canvas);

  if (reduced) {
    spawnApple({
      destined: true,
      from: { x: headX(), y: headY() + 0.16, z: headZ() },
    });
  } else {
    spawnApple({});
    spawnApple({});
  }

  let last = performance.now();
  let raf = 0;
  let running = true;

  const loop = (now: number) => {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    if (document.hidden) {
      last = now;
      return;
    }
    let dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    if (hitstop > 0) {
      hitstop -= dt;
      dt *= 0.12;
    }

    if (!reduced) {
      if (phase === "ignorant") {
        destinedIn -= dt;
        if (destinedIn <= 0) startDestined();
      }

      spawnTimer += dt;
      const interval = phase === "awake" ? 1.35 : 2.1;
      if (spawnTimer > interval && orchard.appleSpawns.length) {
        spawnTimer = 0;
        spawnApple({});
      }

      // Stays seated — animation.cat.sit. Walk patrol made it a dog again.

      if (jumping) {
        catVy -= GRAVITY * dt;
        catY += catVy * dt;
        if (catY <= 0) {
          catY = 0;
          catVy = 0;
          jumping = false;
          trauma = Math.min(1, trauma + 0.18);
          burst(catX, groundY + 0.1, catZ, 6, [0.55, 0.48, 0.4]);
        }
      }

      if (phase === "bonk") {
        bonkT += dt;
        if (bonkT > 1.15) {
          phase = "awake";
          useNewton.getState().setPhase("awake");
        }
      }

      for (const a of apples) {
        if (!a.live) continue;
        a.vy -= GRAVITY * dt;
        a.x += a.vx * dt;
        a.y += a.vy * dt;
        a.z += a.vz * dt;
        a.spin += dt * 2.2;
        const dist = Math.hypot(a.x - headX(), a.y - headY(), a.z - headZ());
        if (
          (phase === "falling" || phase === "ignorant") &&
          dist < 0.42 &&
          a.y > groundY + 0.45
        ) {
          a.live = false;
          phase = "bonk";
          bonkT = 0;
          hitstop = 0.09;
          trauma = 0.92;
          useNewton.getState().setPhase("bonk");
          burst(a.x, a.y, a.z, 18, [0.77, 0.12, 0.23]);
          playBonk();
        } else if (phase === "awake" && jumping && dist < 0.52) {
          a.live = false;
          useNewton.getState().addCatch();
          trauma = Math.min(1, trauma + 0.28);
          burst(a.x, a.y, a.z, 10, [0.77, 0.64, 0.35]);
        } else if (a.y < groundY + 0.12) {
          a.live = false;
          burst(a.x, groundY + 0.12, a.z, 7, [0.77, 0.12, 0.23]);
          trauma = Math.min(1, trauma + 0.08);
        }
      }

      for (const p of particles) {
        if (!p.live) continue;
        p.life += dt;
        if (p.life >= p.max) {
          p.live = false;
          continue;
        }
        p.vy -= GRAVITY * 0.9 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.z += p.vz * dt;
      }
    }

    const breathe = 1 + Math.sin(now * 0.0024) * (phase === "awake" ? 0.012 : 0.02);
    const squash =
      phase === "bonk"
        ? 0.72 + Math.min(bonkT, 0.4) * 0.7
        : jumping
          ? catVy > 0
            ? 1.12
            : 0.9
          : 1;
    if (!reduced) tickSitRig(mcCat.bones, now * 0.001, phase);
    cat.position.set(catX, groundY + catY, catZ);
    cat.rotation.y = yaw;
    cat.scale.set(
      (breathe / Math.sqrt(squash)) * CAT_SCALE,
      breathe * squash * CAT_SCALE,
      (breathe / Math.sqrt(squash)) * CAT_SCALE,
    );

    let ai = 0;
    for (const a of apples) {
      if (!a.live) continue;
      dummy.position.set(a.x, a.y, a.z);
      dummy.rotation.set(a.spin, a.spin * 0.6, a.spin * 0.3);
      dummy.scale.setScalar(a.scale);
      dummy.updateMatrix();
      appleMesh.setMatrixAt(ai, dummy.matrix);
      ai += 1;
    }
    dummy.scale.setScalar(0);
    dummy.position.set(0, -8, 0);
    dummy.updateMatrix();
    for (let i = ai; i < MAX_APPLES; i++) appleMesh.setMatrixAt(i, dummy.matrix);
    appleMesh.instanceMatrix.needsUpdate = true;

    let pi = 0;
    const fadeColor = pMesh.instanceColor;
    for (const p of particles) {
      if (!p.live) continue;
      const k = 1 - p.life / p.max;
      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(p.scale * (0.6 + k));
      dummy.updateMatrix();
      pMesh.setMatrixAt(pi, dummy.matrix);
      if (fadeColor) fadeColor.setXYZ(pi, p.r, p.g, p.b);
      pi += 1;
    }
    dummy.scale.setScalar(0);
    dummy.position.set(0, -8, 0);
    dummy.updateMatrix();
    for (let i = pi; i < MAX_PARTICLES; i++) {
      pMesh.setMatrixAt(i, dummy.matrix);
      if (fadeColor) fadeColor.setXYZ(i, 0, 0, 0);
    }
    pMesh.instanceMatrix.needsUpdate = true;
    if (fadeColor) fadeColor.needsUpdate = true;

    trauma = Math.max(0, trauma - dt * 1.6);
    const shake = trauma * trauma;
    const t = now * 0.001;
    const sx = shake * 0.28 * Math.sin(t * 27.1);
    const sy = shake * 0.22 * Math.sin(t * 31.7);
    const sz = shake * 0.16 * Math.sin(t * 23.3);

    if (!reduced) orbit += dt * 0.02;
    // Banner lock: cat left, canopy right, apple in the air.
    const yawCam = 1.08 + Math.sin(orbit) * 0.02;
    const radius = window.innerWidth < 700 ? 5.6 : 6.4;
    const height = window.innerWidth < 700 ? 2.25 : 2.5;
    const ox = Math.sin(yawCam) * radius + 0.55 + pointerX * 0.22;
    const oz = Math.cos(yawCam) * radius + 1.7 + pointerY * 0.08;
    camera.up.set(0, 1, 0);
    camera.position.set(
      ox + sx,
      groundY + height + pointerY * -0.05 + sy,
      oz + sz,
    );
    look.set(0.55, groundY + 2.05, -0.85);
    camera.lookAt(look);
    camera.rotation.z = shake * 0.03 * Math.sin(t * 19.0);

    renderer.render(scene, camera);
  };

  raf = requestAnimationFrame(loop);

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    ro.disconnect();
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("pointermove", onMove);
    unTap();
    unCoat();
    terrain.geometry.dispose();
    (terrain.material as InstanceType<Three["Material"]>).dispose();
    appleGeo.dispose();
    appleMat.dispose();
    pGeo.dispose();
    pMat.dispose();
    sky.geometry.dispose();
    (sky.material as InstanceType<Three["Material"]>).dispose();
    mcCat.dispose();
    for (const tex of coatCache.values()) tex.dispose();
    renderer.dispose();
  };
}

export function OrchardScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    let cleanup = () => {};
    void import("three").then((THREE) => {
      if (cancelled) return;
      cleanup = boot(canvas, THREE);
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <div className="orchard-stage" aria-hidden="true">
      <canvas ref={canvasRef} className="orchard-canvas" />
      <div className="orchard-vignette" />
    </div>
  );
}
