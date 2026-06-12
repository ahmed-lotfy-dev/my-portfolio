"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AvatarProps {
  pose: "standing" | "sitting" | "typing" | "presenting";
}

export default function Avatar({ pose }: AvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftHandRef = useRef<THREE.Mesh>(null);
  const rightHandRef = useRef<THREE.Mesh>(null);
  const timerRef = useRef(0);

  const targets = useMemo(() => {
    switch (pose) {
      case "standing":
        return { y: 0.8, headRot: [0, 0, 0] as const, leftArm: [0, 0, 0] as const, rightArm: [0, 0, 0] as const };
      case "sitting":
        return { y: 0.4, headRot: [0, 0.3, 0] as const, leftArm: [0, 0, -0.5] as const, rightArm: [0, 0, 0.5] as const };
      case "typing":
        return { y: 0.4, headRot: [0.1, 0, 0] as const, leftArm: [0.5, 0, -0.8] as const, rightArm: [0.5, 0, 0.8] as const };
      case "presenting":
        return { y: 0.4, headRot: [0, -0.5, 0] as const, leftArm: [0, 0, -1.2] as const, rightArm: [0.3, 0, 0.3] as const };
    }
  }, [pose]);

  useFrame((state, delta) => {
    if (!groupRef.current || !headRef.current) return;

    // Use clock.elapsedTime from R3F state (still works, just deprecated warning)
    // Track our own timer to avoid deprecation
    timerRef.current += delta;
    const t = timerRef.current;

    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targets.y, delta * 2);
    headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targets.headRot[0], delta * 3);
    headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targets.headRot[1], delta * 3);

    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = THREE.MathUtils.lerp(leftArmRef.current.rotation.x, targets.leftArm[0], delta * 3);
      leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, targets.leftArm[2], delta * 3);
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, targets.rightArm[0], delta * 3);
      rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, targets.rightArm[2], delta * 3);
    }

    // Typing animation — fingers tapping
    if (pose === "typing" && leftHandRef.current && rightHandRef.current) {
      const tap = Math.sin(t * 8) * 0.08;
      leftHandRef.current.position.y = -0.3 + tap;
      rightHandRef.current.position.y = -0.3 - tap;
    }

    // Breathing
    const breathe = Math.sin(t * 2) * 0.02;
    groupRef.current.position.y = (groupRef.current.position.y || 0) + breathe;
  });

  return (
    <group ref={groupRef} position={[0, 0.8, 0]}>
      {/* Head */}
      <mesh ref={headRef} position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.1} roughness={0.5} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.08, 0.6, 0.2]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[-0.08, 0.6, 0.2]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 0.1, 0]}>
        <capsuleGeometry args={[0.2, 0.35, 16, 16]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.1} roughness={0.6} />
      </mesh>
      {/* Left Arm */}
      <group ref={leftArmRef} position={[0.3, 0.2, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <capsuleGeometry args={[0.06, 0.25, 8, 8]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.1} roughness={0.6} />
        </mesh>
        <mesh ref={leftHandRef} position={[0, -0.3, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.1} roughness={0.5} />
        </mesh>
      </group>
      {/* Right Arm */}
      <group ref={rightArmRef} position={[-0.3, 0.2, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <capsuleGeometry args={[0.06, 0.25, 8, 8]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.1} roughness={0.6} />
        </mesh>
        <mesh ref={rightHandRef} position={[0, -0.3, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.1} roughness={0.5} />
        </mesh>
      </group>
      {/* Legs */}
      <mesh position={[0.1, -0.2, 0]}>
        <capsuleGeometry args={[0.07, 0.3, 8, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.1} roughness={0.7} />
      </mesh>
      <mesh position={[-0.1, -0.2, 0]}>
        <capsuleGeometry args={[0.07, 0.3, 8, 8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.1} roughness={0.7} />
      </mesh>
    </group>
  );
}
