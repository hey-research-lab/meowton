import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { catPose } from "@/lib/cat-pose";
import { useNewton } from "@/lib/newton";
import type { Vec3 } from "@/lib/orchard-layout";

type Props = { from: Vec3 };

export function FallingApple({ from }: Props) {
  const mesh = useRef<THREE.Mesh>(null);
  const state = useRef({
    t: 0,
    x: from[0],
    y: from[1],
    z: from[2],
    vy: 0,
    spin: 0,
    mode: "wait" as "wait" | "fall" | "rest",
  });

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.08);
    const m = mesh.current;
    if (!m) return;
    const s = state.current;
    s.t += d;

    if (useNewton.getState().reduced) {
      m.position.set(from[0], from[1] + Math.sin(s.t * 1.6) * 0.06, from[2]);
      return;
    }

    if (s.mode === "wait") {
      s.x = from[0];
      s.y = from[1] + Math.sin(s.t * 2.2) * 0.08;
      s.z = from[2];
      m.position.set(s.x, s.y, s.z);
      m.rotation.z = Math.sin(s.t * 2) * 0.12;
      if (s.t > 1.35) {
        s.mode = "fall";
        s.vy = 0.4;
        useNewton.getState().setPhase("falling");
      }
      return;
    }

    if (s.mode === "fall") {
      s.vy -= 14 * d;
      s.y += s.vy * d;
      const tx = catPose.x + Math.sin(catPose.yaw) * 0.35;
      const tz = catPose.z + Math.cos(catPose.yaw) * 0.45;
      s.x += (tx - s.x) * 2.4 * d;
      s.z += (tz - s.z) * 2.4 * d;
      s.spin += d * 7;
      m.position.set(s.x, s.y, s.z);
      m.rotation.set(s.spin, s.spin * 0.4, s.spin * 0.2);
      const nearHead = Math.hypot(s.x - tx, s.z - tz) < 0.7 && s.y < 2.05;
      if (s.y <= 0.35 || nearHead) {
        s.mode = "rest";
        s.t = 0;
        s.y = Math.max(s.y, 0.4);
        useNewton.getState().setPhase("bonk");
        useNewton.getState().addCatch();
      }
      return;
    }

    m.position.set(s.x, 0.42 + Math.sin(s.t * 8) * 0.04, s.z);
    if (s.t > 0.9) {
      s.mode = "wait";
      s.t = 0;
      s.x = from[0];
      s.y = from[1];
      s.z = from[2];
      s.vy = 0;
      useNewton.getState().setPhase("ignorant");
    }
  });

  return (
    <mesh ref={mesh} position={from} castShadow>
      <boxGeometry args={[0.36, 0.36, 0.36]} />
      <meshStandardMaterial color="#c41e3a" roughness={0.42} metalness={0.05} />
    </mesh>
  );
}
