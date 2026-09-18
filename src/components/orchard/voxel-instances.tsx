import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Vec3 } from "@/lib/orchard-layout";

type Props = {
  items: Vec3[];
  colors?: string[];
  color?: string;
  size?: Vec3;
  yLift?: number;
  castShadow?: boolean;
  receiveShadow?: boolean;
};

const dummy = new THREE.Object3D();
const tint = new THREE.Color();

export function VoxelInstances({
  items,
  colors,
  color = "#ffffff",
  size = [1, 1, 1],
  yLift = 0.5,
  castShadow = true,
  receiveShadow = true,
}: Props) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const count = items.length;
  const colorKey = colors?.join(",") ?? color;

  const layout = useMemo(() => items, [items]);

  useLayoutEffect(() => {
    const inst = mesh.current;
    if (!inst || count === 0) return;
    for (let i = 0; i < count; i++) {
      const p = layout[i];
      dummy.position.set(p[0], p[1] + yLift, p[2]);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
      if (colors) inst.setColorAt(i, tint.set(colors[i] ?? color));
    }
    inst.instanceMatrix.needsUpdate = true;
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
  }, [layout, count, colors, color, yLift, colorKey]);

  if (count === 0) return null;

  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, count]}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      frustumCulled={false}
    >
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={colors ? "#ffffff" : color}
        roughness={0.82}
        metalness={0.02}
      />
    </instancedMesh>
  );
}
