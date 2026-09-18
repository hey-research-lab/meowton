import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { catPose } from "@/lib/cat-pose";
import { getJacket } from "@/lib/jackets";
import { onOrchardTap, useNewton } from "@/lib/newton";
import { CAT_PATH } from "@/lib/orchard-layout";

function Box({
  position,
  size,
  color,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.68} metalness={0.03} />
    </mesh>
  );
}

const FUR = "#e08a2c";
const STRIPE = "#c46a1c";
const BELLY = "#f3ead0";
const INK = "#1a1410";
const WIG = "#f7f2e8";
const WIG_SHADE = "#e4dccb";
const NOSE = "#c48a82";
const EYE = "#3d6b3a";
const SCALE = 1.7;

export function MeowtonCat() {
  const jacketId = useNewton((s) => s.jacket);
  const jacket = getJacket(jacketId).color;
  const root = useRef<THREE.Group>(null);
  const frontL = useRef<THREE.Group>(null);
  const frontR = useRef<THREE.Group>(null);
  const hindL = useRef<THREE.Group>(null);
  const hindR = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Group>(null);
  const motion = useRef({
    x: CAT_PATH[0][0],
    y: 0,
    z: CAT_PATH[0][2],
    vy: 0,
    yaw: 0.4,
    dist: 0,
    wp: 1,
    pause: 0.2,
    jumping: false,
  });

  useEffect(() => {
    return onOrchardTap(() => {
      const m = motion.current;
      if (!m.jumping && m.y < 0.05) {
        m.vy = 5.2;
        m.jumping = true;
      }
      useNewton.getState().setPhase("awake");
    });
  }, []);

  const jacketBoxes = useMemo(
    () =>
      [
        { position: [0, 0.72, 0.05] as [number, number, number], size: [0.92, 0.72, 0.7] as [number, number, number] },
        { position: [-0.58, 0.78, 0.05] as [number, number, number], size: [0.28, 0.42, 0.42] as [number, number, number] },
        { position: [0.58, 0.78, 0.05] as [number, number, number], size: [0.28, 0.42, 0.42] as [number, number, number] },
        { position: [0, 0.42, 0.38] as [number, number, number], size: [0.72, 0.18, 0.18] as [number, number, number] },
      ] as const,
    [],
  );

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.08);
    const g = root.current;
    if (!g) return;
    const reduced = useNewton.getState().reduced;
    const m = motion.current;
    const phase = useNewton.getState().phase;
    let speed = 0;

    if (m.jumping) {
      m.vy -= 18 * d;
      m.y += m.vy * d;
      if (m.y <= 0) {
        m.y = 0;
        m.vy = 0;
        m.jumping = false;
      }
    }

    if (!reduced && !m.jumping && phase !== "bonk") {
      if (m.pause > 0) {
        m.pause -= d;
      } else {
        const target = CAT_PATH[m.wp];
        const dx = target[0] - m.x;
        const dz = target[2] - m.z;
        const len = Math.hypot(dx, dz);
        if (len < 0.18) {
          m.wp = (m.wp + 1) % CAT_PATH.length;
          m.pause = 0.12;
        } else {
          const step = 1.45 * d;
          m.x += (dx / len) * step;
          m.z += (dz / len) * step;
          m.dist += step;
          speed = 1;
          const want = Math.atan2(dx, dz);
          let dyaw = want - m.yaw;
          while (dyaw > Math.PI) dyaw -= Math.PI * 2;
          while (dyaw < -Math.PI) dyaw += Math.PI * 2;
          m.yaw += dyaw * (1 - Math.exp(-8 * d));
        }
      }
    }

    const gait = reduced ? 0 : Math.cos(m.dist * 4.4) * 0.72 * Math.max(speed, m.jumping ? 0 : 0.15);
    if (frontL.current) frontL.current.rotation.x = gait;
    if (frontR.current) frontR.current.rotation.x = -gait;
    if (hindL.current) hindL.current.rotation.x = -gait;
    if (hindR.current) hindR.current.rotation.x = gait;
    if (tail.current) {
      tail.current.rotation.x = 0.35 + Math.cos(m.dist * 3.2) * 0.22;
      tail.current.rotation.z = Math.sin(m.dist * 2.4) * 0.12;
    }

    const bob = reduced ? 0 : Math.abs(Math.sin(m.dist * 4.4)) * 0.07 * (speed ? 1 : 0.25);
    g.position.set(m.x, m.y + bob, m.z);
    g.rotation.y = m.yaw;
    catPose.x = m.x;
    catPose.y = m.y + bob;
    catPose.z = m.z;
    catPose.yaw = m.yaw;
  });

  return (
    <group ref={root} position={[CAT_PATH[0][0], 0, CAT_PATH[0][2]]} scale={SCALE}>
      <Box position={[0, 0.42, 0]} size={[0.78, 0.42, 0.7]} color={FUR} />
      <Box position={[0, 0.32, 0.08]} size={[0.5, 0.22, 0.46]} color={BELLY} />
      {jacketBoxes.map((box) => (
        <Box key={box.position.join(",")} {...box} color={jacket} />
      ))}

      <group position={[0, 1.22, 0.16]}>
        <Box position={[0, 0, 0]} size={[0.7, 0.62, 0.66]} color={FUR} />
        <Box position={[0, -0.16, 0.3]} size={[0.42, 0.28, 0.22]} color={BELLY} />
        <Box position={[0, -0.2, 0.42]} size={[0.16, 0.12, 0.12]} color={NOSE} />
        <Box position={[-0.16, 0.1, 0.28]} size={[0.12, 0.12, 0.08]} color={EYE} />
        <Box position={[0.16, 0.1, 0.28]} size={[0.12, 0.12, 0.08]} color={EYE} />
        <Box position={[-0.28, 0.4, -0.04]} size={[0.18, 0.22, 0.16]} color={FUR} />
        <Box position={[0.28, 0.4, -0.04]} size={[0.18, 0.22, 0.16]} color={FUR} />
        <Box position={[0, 0.34, -0.12]} size={[0.82, 0.28, 0.72]} color={WIG} />
        <Box position={[-0.48, 0.1, -0.12]} size={[0.22, 0.55, 0.55]} color={WIG} />
        <Box position={[0.48, 0.1, -0.12]} size={[0.22, 0.55, 0.55]} color={WIG} />
        <Box position={[-0.52, -0.2, -0.04]} size={[0.2, 0.28, 0.28]} color={WIG_SHADE} />
        <Box position={[0.52, -0.2, -0.04]} size={[0.2, 0.28, 0.28]} color={WIG_SHADE} />
        <Box position={[0, 0.2, -0.54]} size={[0.55, 0.4, 0.22]} color={WIG} />
        <Box position={[0.02, -0.23, -0.7]} size={[0.16, 0.42, 0.16]} color={WIG_SHADE} />
        <Box position={[0.02, -0.5, -0.7]} size={[0.12, 0.12, 0.12]} color={INK} />
      </group>

      <group ref={tail} position={[0, 0.55, -0.48]}>
        <Box position={[0, 0, -0.22]} size={[0.16, 0.16, 0.5]} color={STRIPE} />
      </group>

      <group ref={frontL} position={[-0.28, 0.22, 0.28]}>
        <Box position={[0, -0.12, 0]} size={[0.22, 0.32, 0.22]} color={FUR} />
      </group>
      <group ref={frontR} position={[0.28, 0.22, 0.28]}>
        <Box position={[0, -0.12, 0]} size={[0.22, 0.32, 0.22]} color={FUR} />
      </group>
      <group ref={hindL} position={[-0.26, 0.22, -0.28]}>
        <Box position={[0, -0.12, 0]} size={[0.22, 0.32, 0.22]} color={FUR} />
      </group>
      <group ref={hindR} position={[0.26, 0.22, -0.28]}>
        <Box position={[0, -0.12, 0]} size={[0.22, 0.32, 0.22]} color={FUR} />
      </group>
    </group>
  );
}
