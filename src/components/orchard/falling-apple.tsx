import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useNewton } from "@/lib/newton";
import type { Vec3 } from "@/lib/orchard-layout";

type Props = { from: Vec3 };

export function FallingApple({ from }: Props) {
  const mesh = useRef<THREE.Mesh>(null);
  const state = useRef({
    t: 0,
    y: from[1],
    vy: 0,
    spin: 0,
    mode: "wait" as "wait" | "fall" | "rest",
  });

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.08);
    const m = mesh.current;
    if (!m) return;
    if (useNewton.getState().reduced) {
      m.position.set(from[0], from[1], from[2]);
      return;
    }
    const s = state.current;
    s.t += d;
    if (s.mode === "wait") {
      m.position.set(from[0], from[1] + Math.sin(s.t * 1.4) * 0.04, from[2]);
      if (s.t > 2.4) {
        s.mode = "fall";
        s.vy = 0;
        useNewton.getState().setPhase("falling");
      }
      return;
    }
    if (s.mode === "fall") {
      s.vy -= 11.5 * d;
      s.y += s.vy * d;
      s.spin += d * 4;
      m.position.set(from[0] * 0.35, s.y, from[2] * 0.2 + 0.7);
      m.rotation.set(s.spin, s.spin * 0.4, 0);
      if (s.y <= 1.72) {
        s.mode = "rest";
        s.t = 0;
        s.y = 1.72;
        useNewton.getState().setPhase("bonk");
        useNewton.getState().addCatch();
      }
      return;
    }
    m.position.set(0.18, 1.72, 0.82);
    if (s.t > 1.6) {
      s.mode = "wait";
      s.t = 0;
      s.y = from[1];
      s.vy = 0;
      useNewton.getState().setPhase("ignorant");
    }
  });

  return (
    <mesh ref={mesh} position={from} castShadow>
      <boxGeometry args={[0.28, 0.28, 0.28]} />
      <meshStandardMaterial color="#c41e3a" roughness={0.45} metalness={0.04} />
    </mesh>
  );
}
