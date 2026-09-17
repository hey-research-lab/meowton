import { useEffect, useRef } from "react";

const WALK_SRC = "/sprites/cat-walk.png";
const SIT_SRC = "/sprites/cat-sit.png";
const APPLE_SRCS = ["/sprites/apple-a.png", "/sprites/apple-b.png"] as const;

type Apple = {
  x: number;
  y: number;
  vy: number;
  rot: number;
  vr: number;
  kind: 0 | 1;
  scale: number;
  caught: boolean;
  catchT: number;
};

type Cat = {
  x: number;
  vy: number;
  dir: 1 | -1;
  frame: number;
  frameT: number;
  jumping: boolean;
};

const jumpFns = new Set<() => void>();

export function requestCatJump() {
  jumpFns.forEach((fn) => fn());
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(src));
    img.src = src;
  });
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function OrchardScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;
    let raf = 0;
    let last = performance.now();
    let spawnT = 0;
    const reduced = prefersReducedMotion();

    const cat: Cat = {
      x: 0.38,
      vy: 0,
      dir: 1,
      frame: 0,
      frameT: 0,
      jumping: false,
    };
    let catY = 0;
    const apples: Apple[] = [];

    let walk: HTMLImageElement | null = null;
    let sit: HTMLImageElement | null = null;
    const appleImgs: (HTMLImageElement | null)[] = [null, null];

    const jump = () => {
      if (reduced) return;
      if (cat.jumping) return;
      cat.jumping = true;
      cat.vy = -920;
    };
    jumpFns.add(jump);

    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", onKey);

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);

    void Promise.allSettled([
      loadImage(WALK_SRC),
      loadImage(SIT_SRC),
      loadImage(APPLE_SRCS[0]),
      loadImage(APPLE_SRCS[1]),
    ]).then((results) => {
      if (cancelled) return;
      if (results[0].status === "fulfilled") walk = results[0].value;
      if (results[1].status === "fulfilled") sit = results[1].value;
      if (results[2].status === "fulfilled") appleImgs[0] = results[2].value;
      if (results[3].status === "fulfilled") appleImgs[1] = results[3].value;
    });

    const spawnApple = () => {
      if (apples.length > 8) return;
      apples.push({
        x: 0.08 + Math.random() * 0.84,
        y: 0.04 + Math.random() * 0.22,
        vy: 40 + Math.random() * 50,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 1.6,
        kind: Math.random() < 0.5 ? 0 : 1,
        scale: 0.78 + Math.random() * 0.4,
        caught: false,
        catchT: 0,
      });
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w < 2 || h < 2) return;

      const ground = h * 0.86;
      const catH = Math.max(88, Math.min(168, h * 0.2));
      const catW = catH * 0.92;
      const speed = reduced ? 0 : 0.055;

      if (!reduced) {
        cat.x += cat.dir * speed * dt * (cat.jumping ? 0.7 : 1);
        if (cat.x > 0.9) {
          cat.x = 0.9;
          cat.dir = -1;
        } else if (cat.x < 0.1) {
          cat.x = 0.1;
          cat.dir = 1;
        }
        cat.frameT += dt;
        if (cat.frameT > 0.14) {
          cat.frameT = 0;
          cat.frame = (cat.frame + 1) % 4;
        }
        if (cat.jumping) {
          cat.vy += 2400 * dt;
          catY += cat.vy * dt;
          if (catY >= 0) {
            catY = 0;
            cat.vy = 0;
            cat.jumping = false;
          }
        }
        spawnT += dt;
        if (spawnT > 1.35) {
          spawnT = 0;
          spawnApple();
        }
      } else {
        cat.x = 0.5;
        catY = 0;
      }

      const cx = cat.x * w;
      const cy = ground + catY;
      const hitW = catW * 0.45;
      const hitH = catH * 0.7;

      if (!reduced) {
        for (const a of apples) {
          if (a.caught) {
            a.catchT += dt * 3.2;
            continue;
          }
          a.vy += 420 * dt;
          a.y += (a.vy * dt) / h;
          a.rot += a.vr * dt;
          const ax = a.x * w;
          const ay = a.y * h;
          const size = 28 * a.scale;
          if (
            cat.jumping &&
            Math.abs(ax - cx) < hitW &&
            ay < cy &&
            ay > cy - hitH &&
            ay + size > cy - hitH
          ) {
            a.caught = true;
            a.catchT = 0;
          }
        }
        for (let i = apples.length - 1; i >= 0; i--) {
          const a = apples[i];
          if (a.y > 1.12 || a.catchT > 1) apples.splice(i, 1);
        }
      }

      ctx.clearRect(0, 0, w, h);

      for (const a of apples) {
        const img = appleImgs[a.kind];
        if (!img) continue;
        const ax = a.x * w;
        const ay = a.y * h;
        const size = 34 * a.scale * (a.caught ? 1 + a.catchT * 0.5 : 1);
        const alpha = a.caught ? Math.max(0, 1 - a.catchT) : 1;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(ax, ay);
        ctx.rotate(a.rot);
        ctx.drawImage(img, -size / 2, -size / 2, size, size);
        ctx.restore();
        if (a.caught) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, 0.55 - a.catchT);
          ctx.fillStyle = "#c4a35a";
          ctx.beginPath();
          ctx.arc(ax, ay, 10 + a.catchT * 28, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      const sprite = reduced ? (sit ?? walk) : (walk ?? sit);
      if (sprite) {
        const cols = 2;
        const rows = 2;
        const fw = sprite.width / cols;
        const fh = sprite.height / rows;
        const frame = reduced ? 0 : cat.jumping ? 1 : cat.frame;
        const col = frame % cols;
        const row = Math.floor(frame / cols) % rows;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(cat.dir, 1);
        ctx.drawImage(
          sprite,
          col * fw,
          row * fh,
          fw,
          fh,
          -catW / 2,
          -catH,
          catW,
          catH,
        );
        ctx.restore();
      }
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("keydown", onKey);
      jumpFns.delete(jump);
    };
  }, []);

  return (
    <div className="orchard-stage" aria-hidden="true">
      <img
        className="orchard-photo"
        src="/world/orchard.jpg"
        alt=""
        draggable={false}
      />
      <canvas ref={canvasRef} className="orchard-canvas" />
      <div className="orchard-vignette" />
    </div>
  );
}
