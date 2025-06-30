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
  quality = 128,
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
  shaderConfig = 'organic',
  debugMode = false
}: OrganicSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const geometry = useMemo(() => 
    new THREE.SphereGeometry(radius, quality, quality), 
    [radius, quality]
  );

 

  const shaderMaterial = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      vertexShader: organicVertexShader,
      fragmentShader: organicFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uBreathPhase: { value: 0 },
        uAmplitude: { value: noiseAmplitude },
        uFrequency: { value: 1.0 },
        uNoiseScale: { value: new THREE.Vector3(...noiseScale) },
        uNoiseSpeed: { value: noiseSpeed },
        uBreathAmplitude: { value: scaleAmplitude },
        uColor: { value: new THREE.Vector3(0.9, 0.8, 1.0) },
        uAccentColor: { value: new THREE.Vector3(0.8, 0.6, 1.0) },
        uMetalness: { value: 0.02 },
        uRoughness: { value: 0.15 },
        uEmissiveIntensity: { value: emissiveIntensity },
      },
      transparent: true,
      side: THREE.DoubleSide,
    });

    return material;
  }, [noiseAmplitude, noiseScale, noiseSpeed, emissiveIntensity, scaleAmplitude]);

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