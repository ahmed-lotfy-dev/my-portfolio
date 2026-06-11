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

  const targets = useMemo(() => {
    switch (pose) {
      case "standing":
        return { y: 0.8, headRot: [0, 0, 0], leftArm: [0, 0, 0], rightArm: [0, 0, 0] };
      case "sitting":
        return { y: 0.4, headRot: [0, 0.3, 0], leftArm: [0, 0, -0.5], rightArm: [0, 0, 0.5] };
      case "typing":
        return { y: 0.4, headRot: [0.1, 0, 0], leftArm: [0.5, 0, -0.8], rightArm: [0.5, 0, 0.8] };
      case "presenting":
        return { y: 0.4, headRot: [0, -0.5, 0], leftArm: [0, 0, -1.2], rightArm: [0.3, 0, 0.3] };
    }
  }, [pose]);

  useFrame((state, delta) => {
    if (!groupRef.current || !headRef.current) return;

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

    const breathe = Math.sin(state.clock.elapsedTime * 2) * 0.02;
    groupRef.current.position.y = (groupRef.current.position.y || 0) + breathe;
  });

  return (
    <group ref={groupRef} position={[0, 0.8, 0]}>
      <mesh ref={headRef} position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.1} roughness={0.5} />
      </mesh>
      <mesh position={[0.08, 0.6, 0.2]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[-0.08, 0.6, 0.2]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <capsuleGeometry args={[0.2, 0.35, 16, 16]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.1} roughness={0.6} />
      </mesh>
      <group ref={leftArmRef} position={[0.3, 0.2, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <capsuleGeometry args={[0.06, 0.25, 8, 8]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.1} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.35, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.1} roughness={0.5} />
        </mesh>
      </group>
      <group ref={rightArmRef} position={[-0.3, 0.2, 0]}>
        <mesh position={[0, -0.15, 0]}>
          <capsuleGeometry args={[0.06, 0.25, 8, 8]} />
          <meshStandardMaterial color="#3b82f6" metalness={0.1} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.35, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.1} roughness={0.5} />
        </mesh>
      </group>
      {pose === "standing" && (
        <>
          <mesh position={[0.1, -0.3, 0]}>
            <capsuleGeometry args={[0.08, 0.3, 8, 8]} />
            <meshStandardMaterial color="#1e40af" metalness={0.1} roughness={0.6} />
          </mesh>
          <mesh position={[-0.1, -0.3, 0]}>
            <capsuleGeometry args={[0.08, 0.3, 8, 8]} />
            <meshStandardMaterial color="#1e40af" metalness={0.1} roughness={0.6} />
          </mesh>
        </>
      )}
    </group>
  );
}
