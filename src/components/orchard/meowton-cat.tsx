import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { getJacket } from "@/lib/jackets";
import { onOrchardTap, useNewton } from "@/lib/newton";

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

export function MeowtonCat() {
  const jacketId = useNewton((s) => s.jacket);
  const jacket = getJacket(jacketId).color;
  const group = useRef<THREE.Group>(null);
  const motion = useRef({ y: 0, vy: 0, bob: 0 });

  useEffect(() => {
    return onOrchardTap(() => {
      const m = motion.current;
      if (m.y < 0.05) m.vy = 4.2;
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
    const g = group.current;
    if (!g) return;
    const reduced = useNewton.getState().reduced;
    const m = motion.current;
    if (!reduced) {
      m.bob += d * 5.2;
      m.vy -= 18 * d;
      m.y = Math.max(0, m.y + m.vy * d);
      if (m.y === 0) m.vy = 0;
    }
    const bob = reduced ? 0 : Math.sin(m.bob) * 0.045;
    g.position.y = m.y + bob;
    g.rotation.y = 0.42;
  });

  return (
    <group ref={group} position={[0, 0, 0.35]} scale={2.15}>
      <Box position={[0, 0.38, 0]} size={[0.78, 0.42, 0.62]} color={FUR} />
      <Box position={[0, 0.28, -0.42]} size={[0.42, 0.28, 0.38]} color={STRIPE} />
      <Box position={[0, 0.22, 0.08]} size={[0.5, 0.22, 0.4]} color={BELLY} />

      <Box position={[-0.28, 0.16, 0.28]} size={[0.22, 0.28, 0.22]} color={FUR} />
      <Box position={[0.28, 0.16, 0.28]} size={[0.22, 0.28, 0.22]} color={FUR} />
      <Box position={[-0.24, 0.16, -0.28]} size={[0.22, 0.28, 0.22]} color={FUR} />
      <Box position={[0.24, 0.16, -0.28]} size={[0.22, 0.28, 0.22]} color={FUR} />

      <Box position={[0.02, 0.55, -0.62]} size={[0.16, 0.16, 0.46]} color={STRIPE} />

      {jacketBoxes.map((box) => (
        <Box key={box.position.join(",")} {...box} color={jacket} />
      ))}

      <Box position={[0, 1.28, 0.12]} size={[0.7, 0.62, 0.66]} color={FUR} />
      <Box position={[0, 1.12, 0.42]} size={[0.42, 0.28, 0.22]} color={BELLY} />
      <Box position={[0, 1.08, 0.54]} size={[0.16, 0.12, 0.12]} color={NOSE} />
      <Box position={[-0.16, 1.32, 0.4]} size={[0.12, 0.12, 0.08]} color={EYE} />
      <Box position={[0.16, 1.32, 0.4]} size={[0.12, 0.12, 0.08]} color={EYE} />
      <Box position={[-0.28, 1.62, 0.08]} size={[0.18, 0.22, 0.16]} color={FUR} />
      <Box position={[0.28, 1.62, 0.08]} size={[0.18, 0.22, 0.16]} color={FUR} />
      <Box position={[-0.22, 1.38, 0.38]} size={[0.08, 0.04, 0.06]} color={INK} />
      <Box position={[0.22, 1.38, 0.38]} size={[0.08, 0.04, 0.06]} color={INK} />

      <Box position={[0, 1.62, 0]} size={[0.82, 0.28, 0.72]} color={WIG} />
      <Box position={[-0.48, 1.38, 0]} size={[0.22, 0.55, 0.55]} color={WIG} />
      <Box position={[0.48, 1.38, 0]} size={[0.22, 0.55, 0.55]} color={WIG} />
      <Box position={[-0.52, 1.08, 0.08]} size={[0.2, 0.28, 0.28]} color={WIG_SHADE} />
      <Box position={[0.52, 1.08, 0.08]} size={[0.2, 0.28, 0.28]} color={WIG_SHADE} />
      <Box position={[0, 1.48, -0.42]} size={[0.55, 0.4, 0.22]} color={WIG} />
      <Box position={[0.02, 1.05, -0.58]} size={[0.16, 0.42, 0.16]} color={WIG_SHADE} />
      <Box position={[0.02, 0.78, -0.58]} size={[0.12, 0.12, 0.12]} color={INK} />
    </group>
  );
}
