"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function DeskScene() {
  const screen1Ref = useRef<THREE.Mesh>(null);
  const screen2Ref = useRef<THREE.Mesh>(null);
  const timerRef = useRef(0);

  useFrame((_, delta) => {
    timerRef.current += delta;
    const t = timerRef.current;

    if (screen1Ref.current) {
      const mat = screen1Ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.3 + Math.sin(t * 3) * 0.1;
    }
    if (screen2Ref.current) {
      const mat = screen2Ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.25 + Math.sin(t * 2.5 + 1) * 0.08;
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* Desk surface */}
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
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.6, 0.08, 0.6]} />
          <meshStandardMaterial color="#1e40af" metalness={0.2} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.5, -0.28]}>
          <boxGeometry args={[0.6, 0.7, 0.06]} />
          <meshStandardMaterial color="#1e40af" metalness={0.2} roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 16]} />
          <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.5} />
        </mesh>
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
        <mesh ref={screen1Ref}>
          <boxGeometry args={[0.9, 0.55, 0.03]} />
          <meshStandardMaterial color="#0f172a" emissive="#1e40af" emissiveIntensity={0.3} />
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

      {/* Monitor 2 (Right) */}
      <group position={[0.5, 0.35, -0.3]}>
        <mesh ref={screen2Ref}>
          <boxGeometry args={[0.9, 0.55, 0.03]} />
          <meshStandardMaterial color="#0f172a" emissive="#6366f1" emissiveIntensity={0.25} />
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
      <mesh position={[0, 0.05, 0.15]}>
        <boxGeometry args={[0.6, 0.02, 0.2]} />
        <meshStandardMaterial color="#334155" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Keyboard keys (simplified rows) */}
      {[-0.2, -0.07, 0.06, 0.19].map((z, row) => (
        <group key={row}>
          {[-0.2, -0.1, 0, 0.1, 0.2].map((x, col) => (
            <mesh key={col} position={[x * 0.5, 0.035, z]}>
              <boxGeometry args={[0.04, 0.01, 0.04]} />
              <meshStandardMaterial color="#475569" metalness={0.2} roughness={0.8} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Mouse */}
      <mesh position={[0.45, 0.04, 0.15]}>
        <boxGeometry args={[0.06, 0.02, 0.1]} />
        <meshStandardMaterial color="#334155" metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[0.45, 0.055, 0.13]}>
        <boxGeometry args={[0.03, 0.02, 0.04]} />
        <meshStandardMaterial color="#6366f1" metalness={0.2} roughness={0.7} />
      </mesh>

      {/* Coffee mug */}
      <group position={[-1.0, 0.06, -0.2]}>
        <mesh>
          <cylinderGeometry args={[0.04, 0.035, 0.08, 12]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.1} roughness={0.8} />
        </mesh>
        <mesh position={[0.05, 0.01, 0]} rotation={[0, 0, 0.3]}>
          <torusGeometry args={[0.025, 0.006, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.1} roughness={0.8} />
        </mesh>
      </group>

      {/* Desk mat */}
      <mesh position={[0, 0.045, 0.1]}>
        <boxGeometry args={[1.4, 0.005, 0.5]} />
        <meshStandardMaterial color="#1e293b" metalness={0.1} roughness={0.9} />
      </mesh>
    </group>
  );
}
