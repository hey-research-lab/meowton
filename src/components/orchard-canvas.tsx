import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import * as THREE from "three";
import { catPose } from "@/lib/cat-pose";
import { OrchardWorld } from "@/components/orchard/world";

function Lights() {
  return (
    <>
      <color attach="background" args={["#f7f5ef"]} />
      <fog attach="fog" args={["#efe8d8", 24, 56]} />
      <ambientLight intensity={0.82} color="#f7efe0" />
      <hemisphereLight args={["#ffe8c8", "#5a7a40", 0.48]} />
      <directionalLight
        castShadow
        position={[12, 18, 10]}
        intensity={1.9}
        color="#ffd89a"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={2}
        shadow-camera-far={56}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={18}
        shadow-camera-bottom={-14}
        shadow-bias={-0.0009}
      />
    </>
  );
}

function CameraRig() {
  const gl = useThree((s) => s.gl);

  useLayoutEffect(() => {
    gl.shadowMap.type = THREE.PCFShadowMap;
  }, [gl]);

  useFrame(({ camera }) => {
    const tx = 0.25 + catPose.x * 0.18;
    const tz = 11.4 + catPose.z * 0.12;
    camera.position.x += (tx - camera.position.x) * 0.04;
    camera.position.y += (6.35 - camera.position.y) * 0.04;
    camera.position.z += (tz - camera.position.z) * 0.04;
    camera.lookAt(catPose.x * 0.35, 1.25, catPose.z * 0.35);
  });

  return null;
}

export function OrchardCanvas() {
  return (
    <Canvas
      className="orchard-canvas"
      shadows
      dpr={[1, 1.5]}
      frameloop="always"
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [0.25, 6.35, 11.4], fov: 40, near: 0.2, far: 90 }}
    >
      <Lights />
      <CameraRig />
      <OrchardWorld />
    </Canvas>
  );
}
