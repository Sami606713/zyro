"use client";

import { ContactShadows } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { useRef } from "react";
import type { Group } from "three";

const metal = {
  color: "#f4f1ea",
  metalness: 0.72,
  roughness: 0.2,
};

function Zed({ still }: { still: boolean }) {
  const ref = useRef<Group>(null);
  const angle = Math.atan2(-1.28, -2.2);

  useFrame((state) => {
    const group = ref.current;
    if (!group) return;
    const wide = state.size.width >= 1000;
    const spin = still ? 0.55 : state.clock.elapsedTime * 0.32;
    const px = still ? 0 : state.pointer.x;
    const py = still ? 0 : state.pointer.y;
    group.scale.setScalar(wide ? 1 : 0.85);
    group.position.x = wide ? 1.15 : 0;
    group.position.y = (wide ? 0.05 : 0) + (still ? 0 : Math.sin(state.clock.elapsedTime * 0.8) * 0.05);
    group.rotation.y = spin + px * 0.45;
    group.rotation.x = 0.28 + py * 0.18;
  });

  return (
    <group ref={ref}>
      <mesh position={[0, 0.82, 0]}>
        <boxGeometry args={[2.2, 0.3, 0.46]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[0, 0, angle]}>
        <boxGeometry args={[2.72, 0.3, 0.46]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      <mesh position={[0, -0.82, 0]}>
        <boxGeometry args={[2.2, 0.3, 0.46]} />
        <meshStandardMaterial {...metal} />
      </mesh>
    </group>
  );
}

function Scene({ still }: { still: boolean }) {
  return (
    <>
      <color attach="background" args={["#090a0c"]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[4.2, 5.4, 3.6]} intensity={3.2} color="#f7f4ee" />
      <directionalLight position={[-3.2, -1.4, 2]} intensity={1.8} color="#e4ff4a" />
      <spotLight
        position={[2.2, 3.4, 4.5]}
        intensity={28}
        angle={0.5}
        penumbra={0.65}
        color="#ffffff"
      />
      <Zed still={still} />
      <ContactShadows
        position={[1.25, -1.65, 0]}
        opacity={0.45}
        scale={7}
        blur={2.6}
        far={3.5}
        color="#050505"
        resolution={256}
      />
    </>
  );
}

export default function HeroScene() {
  const reduce = useReducedMotion();

  return (
    <Canvas
      camera={{ position: [0.2, 0.15, 5.4], fov: 34 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
    >
      <Scene still={Boolean(reduce)} />
    </Canvas>
  );
}
