"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ComputerScreenProps {
  section: string;
}

const SCREEN_CONFIG: Record<string, { color: string; emissive: string }> = {
  hero: { color: "#1e40af", emissive: "#3b82f6" },
  about: { color: "#6366f1", emissive: "#818cf8" },
  projects: { color: "#8b5cf6", emissive: "#a78bfa" },
  contact: { color: "#ec4899", emissive: "#f472b6" },
};

export default function ComputerScreen({ section }: ComputerScreenProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const timerRef = useRef(0);

  const config = SCREEN_CONFIG[section] || SCREEN_CONFIG.hero;

  useFrame((_, delta) => {
    timerRef.current += delta;
    const t = timerRef.current;

    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.4 + Math.sin(t * 2) * 0.15;
    }
  });

  return (
    <group position={[-0.5, 0.36, -0.28]}>
      <mesh ref={meshRef}>
        <planeGeometry args={[0.85, 0.5]} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.emissive}
          emissiveIntensity={0.4}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[0.92, 0.57, 0.02]} />
        <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}
