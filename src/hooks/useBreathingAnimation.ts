import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BreathingConfig {
  breathSpeed?: number;
  scaleAmplitude?: number;
  baseHue?: number;
  enableRotation?: boolean;
  rotationSpeed?: number;
  colorStyle?: "pastel" | "vibrant" | "monochrome" | "rainbow";
  syncWithBreath?: boolean;
}

export const useBreathingAnimation = (
  meshRef: React.RefObject<THREE.Mesh | null>,
  materialRef: React.RefObject<THREE.MeshStandardMaterial | null>,
  config: BreathingConfig = {}
) => {
  const {
    breathSpeed = 0.35,
    scaleAmplitude = 0.15,
    baseHue = 0.75,
    enableRotation = false,
    rotationSpeed = 0.05,
    colorStyle = "pastel",
    syncWithBreath = true,
  } = config;

  const backgroundComplimentaryPalettes = {
    pastel: [
      { h: 0.83, s: 0.35, l: 0.8 },
      { h: 0.17, s: 0.4, l: 0.82 },
      { h: 0.08, s: 0.38, l: 0.85 },
      { h: 0.92, s: 0.32, l: 0.78 },
      { h: 0.25, s: 0.36, l: 0.83 },
      { h: 0.58, s: 0.33, l: 0.81 },
    ],
    vibrant: [
      { h: 0.83, s: 0.6, l: 0.65 },
      { h: 0.17, s: 0.7, l: 0.7 },
      { h: 0.08, s: 0.75, l: 0.72 },
      { h: 0.92, s: 0.65, l: 0.68 },
    ],
    monochrome: [
      { h: 0.83, s: 0.2, l: 0.8 },
      { h: 0.83, s: 0.35, l: 0.75 },
      { h: 0.83, s: 0.15, l: 0.85 },
      { h: 0.83, s: 0.45, l: 0.7 },
    ],
    rainbow: [
      { h: 0.83, s: 0.7, l: 0.75 },
      { h: 0.17, s: 0.7, l: 0.75 },
      { h: 0.0, s: 0.7, l: 0.75 },
      { h: 0.58, s: 0.7, l: 0.75 },
      { h: 0.08, s: 0.7, l: 0.75 },
      { h: 0.33, s: 0.7, l: 0.75 },
    ],
  };

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    const time = state.clock.elapsedTime;
    const breathTime = time * breathSpeed;

    const breathPhase = (Math.sin(breathTime) + 1) / 2; // 0 to 1
    const easedBreath = breathPhase * breathPhase * (3 - 2 * breathPhase);
    const currentScale = 1 + (easedBreath - 0.5) * 2 * scaleAmplitude;

    meshRef.current.scale.setScalar(currentScale);

    if (enableRotation) {
      meshRef.current.rotation.y += state.clock.getDelta() * rotationSpeed;
    }

    const palette = backgroundComplimentaryPalettes[colorStyle];

    let colorPhase: number;
    if (syncWithBreath) {
      const breathCycles = breathTime / (2 * Math.PI);
      colorPhase = breathCycles * 0.1;

      const breathIntensity = Math.sin(breathTime) * 0.15;
      materialRef.current.emissiveIntensity = 0.1 + Math.abs(breathIntensity);
    } else {
      const colorSpeed = colorStyle === "rainbow" ? 0.02 : 0.015;
      colorPhase = time * colorSpeed;
    }

    const colorIndex = Math.floor(colorPhase) % palette.length;
    const nextColorIndex = (colorIndex + 1) % palette.length;
    const colorMix = colorPhase % 1;

    const currentColor = palette[colorIndex];
    const nextColor = palette[nextColorIndex];

    const hue = currentColor.h + (nextColor.h - currentColor.h) * colorMix;
    const saturation =
      currentColor.s + (nextColor.s - currentColor.s) * colorMix;
    const lightness =
      currentColor.l + (nextColor.l - currentColor.l) * colorMix;

    const breathLightVariation = syncWithBreath
      ? Math.sin(breathTime) * 0.12
      : Math.sin(breathTime * 1.5) * 0.05;

    const finalLightness = Math.max(
      0.5,
      Math.min(0.9, lightness + breathLightVariation)
    );

    const mainColor = new THREE.Color().setHSL(hue, saturation, finalLightness);
    const emissiveColor = new THREE.Color().setHSL(
      hue,
      saturation * 0.9,
      Math.min(0.7, finalLightness * 0.8)
    );

    materialRef.current.color.copy(mainColor);
    materialRef.current.emissive.copy(emissiveColor);
  });

  return null;
};
