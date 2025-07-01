import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { 
  organicVertexShader, 
  organicFragmentShader, 
  updateShaderUniforms 
} from '../../shaders/index';
import type { OrganicSphereProps } from '../../types/OrganicSphere.types';
import { colorPalettes } from '../../constants/constants'

export default function OrganicBreathingSphere({
  radius = 1.5,
  quality = 256,
  breathSpeed = 0.35,
  scaleAmplitude = 0.15,
  baseHue = 0.75,
  enableRotation = false,
  rotationSpeed = 0.05,
  colorStyle = 'pastel',
  syncWithBreath = true,
  noiseAmplitude = 0.3,
  noiseScale = [2.0, 4.0, 8.0] as [number, number, number],
  noiseSpeed = 0.2,
  emissiveIntensity = 0.3,
}: OrganicSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const geometry = useMemo(() => 
    new THREE.SphereGeometry(radius, quality, quality), 
    [radius, quality]
  );

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uBreathPhase: { value: 0 },
        uColor: { value: new THREE.Color(0.1, 0.2, 0.25) },
        uAccentColor: { value: new THREE.Color(0.3, 0.25, 0.4) },
        uBrightness: { value: 0.8 },
        uSaturation: { value: 0.5 },
        uEmissiveIntensity: { value: 0.3 },
        uAmplitude: { value: 0.25 },
        uNoiseScale: { value: new THREE.Vector3(1.5, 2.5, 3.5) },
        uNoiseSpeed: { value: 0.1 },
        uBreathAmplitude: { value: 0.08 }
      },
      vertexShader: organicVertexShader,
      fragmentShader: organicFragmentShader,
      transparent: true,
      side: THREE.DoubleSide
    });
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    const time = state.clock.elapsedTime;
    const breathTime = time * breathSpeed;

    const material = materialRef.current;
    
    if (typeof updateShaderUniforms === 'function') {
      const shaderSettings = {
        time: time,
        breathPhase: breathTime,
        amplitude: noiseAmplitude,
        noiseSpeed: noiseSpeed,
        breathAmplitude: scaleAmplitude,
        emissiveIntensity: emissiveIntensity + Math.abs(Math.sin(breathTime) * 0.1),
      };

      updateShaderUniforms(material, time, breathTime, shaderSettings);
    } else {
      if (material.uniforms) {
        material.uniforms.uTime.value = time;
        material.uniforms.uBreathPhase.value = breathTime;
        
        if (material.uniforms.uBreathAmplitude) {
          material.uniforms.uBreathAmplitude.value = scaleAmplitude;
        }
      }
    }

    if (enableRotation) {
      meshRef.current.rotation.y += state.clock.getDelta() * rotationSpeed;
    }

    const palette = colorPalettes[colorStyle];
    let colorPhase: number;
    
    if (syncWithBreath) {
      const breathCycles = breathTime / (2 * Math.PI);
      colorPhase = breathCycles * 0.1;
    } else {
      const colorSpeed = colorStyle === 'rainbow' ? 0.02 : 0.015;
      colorPhase = time * colorSpeed;
    }

    const colorIndex = Math.floor(colorPhase) % palette.length;
    const nextColorIndex = (colorIndex + 1) % palette.length;
    const colorMix = colorPhase % 1;

    const currentColor = palette[colorIndex];
    const nextColor = palette[nextColorIndex];

    const mainColor: [number, number, number] = currentColor.main.map((c, i) => 
      c + (nextColor.main[i] - c) * colorMix
    ) as [number, number, number];
    
    const accentColor: [number, number, number] = currentColor.accent.map((c, i) => 
      c + (nextColor.accent[i] - c) * colorMix
    ) as [number, number, number];

    if (material.uniforms?.uColor && material.uniforms?.uAccentColor) {
      material.uniforms.uColor.value.set(...mainColor);
      material.uniforms.uAccentColor.value.set(...accentColor);
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <primitive ref={materialRef} object={shaderMaterial} attach="material" />
    </mesh>
  );
}