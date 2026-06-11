"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function DeskScene() {
  const screenRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (screenRef.current) {
      // Subtle screen flicker
      const material = screenRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* Desk */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.5, 0.08, 1.2]} />
        <meshStandardMaterial color="#1e293b" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Desk Legs */}
      {[[-1.1, -0.4, -0.5], [1.1, -0.4, -0.5], [-1.1, -0.4, 0.5], [1.1, -0.4, 0.5]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.06, 0.8, 0.06]} />
          <meshStandardMaterial color="#334155" metalness={0.4} roughness={0.6} />
        </mesh>
      ))}

      {/* Chair */}
      <group position={[0, -0.3, 0.8]}>
        {/* Seat */}
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.6, 0.08, 0.6]} />
          <meshStandardMaterial color="#1e40af" metalness={0.2} roughness={0.8} />
        </mesh>
        {/* Back */}
        <mesh position={[0, 0.5, -0.28]}>
          <boxGeometry args={[0.6, 0.7, 0.06]} />
          <meshStandardMaterial color="#1e40af" metalness={0.2} roughness={0.8} />
        </mesh>
        {/* Base */}
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Wheels */}
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i / 5) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 0.25, -0.7, Math.sin(angle) * 0.25]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          );
        })}
      </group>

      {/* Monitor 1 (Left) */}
      <group position={[-0.5, 0.35, -0.3]}>
        {/* Screen */}
        <mesh ref={screenRef}>
          <boxGeometry args={[0.9, 0.55, 0.03]} />
          <meshStandardMaterial color="#0f172a" emissive="#1e40af" emissiveIntensity={0.3} />
        </mesh>
        {/* Stand */}
        <mesh position={[0, -0.35, 0]}>
          <boxGeometry args={[0.06, 0.2, 0.06]} />
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Base */}
        <mesh position={[0, -0.45, 0]}>
          <boxGeometry args={[0.3, 0.02, 0.2]} />
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
        </mesh>
      </group>

      {/* Monitor 2 (Right) */}
      <group position={[0.5, 0.35, -0.3]}>
        <mesh>
          <boxGeometry args={[0.9, 0.55, 0.03]} />
          <meshStandardMaterial color="#0f172a" emissive="#6366f1" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0, -0.35, 0]}>
          <boxGeometry args={[0.06, 0.2, 0.06]} />
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.45, 0]}>
          <boxGeometry args={[0.3, 0.02, 0.2]} />
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
        </mesh>
      </group>

      {/* Keyboard */}
      <mesh position={[0, 0.06, 0.15]}>
        <boxGeometry args={[0.5, 0.02, 0.15]} />
        <meshStandardMaterial color="#1e293b" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Mouse */}
      <mesh position={[0.4, 0.06, 0.15]}>
        <boxGeometry args={[0.06, 0.02, 0.1]} />
        <meshStandardMaterial color="#1e293b" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Coffee Mug */}
      <mesh position={[0.9, 0.08, 0.2]}>
        <cylinderGeometry args={[0.04, 0.035, 0.1, 16]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.1} roughness={0.8} />
      </mesh>
    </group>
  );
}
