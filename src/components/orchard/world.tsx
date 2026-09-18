import { useMemo } from "react";
import { buildOrchard } from "@/lib/orchard-layout";
import { FallingApple } from "@/components/orchard/falling-apple";
import { MeowtonCat } from "@/components/orchard/meowton-cat";
import { VoxelInstances } from "@/components/orchard/voxel-instances";

export function OrchardWorld() {
  const layout = useMemo(() => buildOrchard(), []);

  return (
    <group>
      <VoxelInstances
        items={layout.grass}
        colors={layout.grassColor}
        size={[0.96, 0.38, 0.96]}
        yLift={0.19}
        castShadow={false}
      />
      <VoxelInstances
        items={layout.dirt}
        color="#b08968"
        size={[0.96, 0.3, 0.96]}
        yLift={0.12}
        castShadow={false}
      />
      <VoxelInstances
        items={layout.trunks}
        color="#6b4423"
        size={[0.42, 1, 0.42]}
        yLift={0.5}
      />
      <VoxelInstances
        items={layout.leaves}
        color="#3f7a3a"
        size={[0.92, 0.92, 0.92]}
        yLift={0.46}
      />
      <VoxelInstances
        items={layout.apples}
        color="#c41e3a"
        size={[0.28, 0.28, 0.28]}
        yLift={0.14}
      />
      <MeowtonCat />
      <FallingApple from={layout.dropFrom} />
    </group>
  );
}
