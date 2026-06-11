"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ComputerScreenProps {
  section: string;
}

// Different screen content per section
const SCREEN_CONTENT = {
  hero: { color: "#1e40af", text: "Welcome" },
  about: { color: "#6366f1", text: "About Me" },
  projects: { color: "#8b5cf6", text: "Projects" },
  contact: { color: "#ec4899", text: "Contact" },
};

export default function ComputerScreen({ section }: ComputerScreenProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  const content = SCREEN_CONTENT[section as keyof typeof SCREEN_CONTENT] || SCREEN_CONTENT.hero;

  useFrame((state) => {
    if (materialRef.current) {
      // Pulsing glow effect
      materialRef.current.emissiveIntensity = 0.4 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
    }
  });

  return (
    <group position={[-0.5, 0.36, -0.28]}>
      {/* Main screen glow */}
      <mesh ref={meshRef}>
        <planeGeometry args={[0.85, 0.5]} />
        <meshStandardMaterial
          ref={materialRef}
          color={content.color}
          emissive={content.color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Screen border/frame */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[0.92, 0.57, 0.02]} />
        <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}
