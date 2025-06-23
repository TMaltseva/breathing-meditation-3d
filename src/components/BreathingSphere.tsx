import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useBreathingAnimation } from '../hooks/useBreathingAnimation';

interface BreathingSphereProps {
  radius?: number;
  quality?: number;
  metalness?: number;
  roughness?: number;
  breathSpeed?: number;
  scaleAmplitude?: number;
  baseHue?: number;
  enableRotation?: boolean;
  rotationSpeed?: number;
  colorStyle?: 'pastel' | 'vibrant' | 'monochrome' | 'rainbow';
  syncWithBreath?: boolean;
}

export default function BreathingSphere({
  radius = 1.5,
  quality = 64,
  metalness = 0.02,
  roughness = 0.15,
  breathSpeed = 0.35,
  scaleAmplitude = 0.15,
  baseHue = 0.75,
  enableRotation = false,
  rotationSpeed = 0.05,
  colorStyle = 'pastel',
  syncWithBreath = true
}: BreathingSphereProps) {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  
  const geometry = useMemo(() => 
    new THREE.SphereGeometry(radius, quality, quality), 
    [radius, quality]
  );

  useBreathingAnimation(meshRef, materialRef, {
    breathSpeed,
    scaleAmplitude,
    baseHue,
    enableRotation,
    rotationSpeed,
    colorStyle,
    syncWithBreath
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial 
        ref={materialRef}
        metalness={metalness}
        roughness={roughness}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}