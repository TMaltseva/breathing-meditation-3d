import * as THREE from "three";

export type ColorStyle = "pastel" | "vibrant" | "monochrome" | "rainbow";
export type PresetName = "meditative" | "dynamic" | "minimal" | "psychedelic";

export interface OrganicSphereSettings {
  breathSpeed: number;
  scaleAmplitude: number;
  noiseAmplitude: number;
  noiseSpeed: number;
  colorStyle: ColorStyle;
  enableRotation: boolean;
  rotationSpeed: number;
  emissiveIntensity: number;
}

export interface OrganicSphereProps extends Partial<OrganicSphereSettings> {
  radius?: number;
  quality?: number;
  baseHue?: number;
  syncWithBreath?: boolean;
  noiseScale?: [number, number, number];
  shaderConfig?: string;
  debugMode?: boolean;
}

export interface ColorPalette {
  main: [number, number, number];
  accent: [number, number, number];
}

export interface ColorPalettes {
  pastel: ColorPalette[];
  vibrant: ColorPalette[];
  monochrome: ColorPalette[];
  rainbow: ColorPalette[];
}

export interface PresetConfig {
  breathSpeed: number;
  scaleAmplitude: number;
  noiseAmplitude: number;
  noiseSpeed: number;
  colorStyle: ColorStyle;
  emissiveIntensity: number;
  enableRotation: boolean;
  rotationSpeed: number;
}

export type Presets = {
  [K in PresetName]: PresetConfig;
};

export interface ShaderUniforms {
  uTime: { value: number };
  uBreathPhase: { value: number };
  uAmplitude: { value: number };
  uFrequency: { value: number };
  uNoiseScale: { value: THREE.Vector3 };
  uNoiseSpeed: { value: number };
  uColor: { value: THREE.Vector3 };
  uAccentColor: { value: THREE.Vector3 };
  uMetalness: { value: number };
  uRoughness: { value: number };
  uEmissiveIntensity: { value: number };
}

export interface ShaderSettings {
  time?: number;
  breathPhase?: number;
  amplitude?: number;
  noiseSpeed?: number;
  emissiveIntensity?: number;
  [key: string]: unknown;
}

export declare function updateShaderUniforms(
  material: THREE.ShaderMaterial,
  time: number,
  breathPhase: number,
  settings?: ShaderSettings
): void;

export declare function createOrganicMaterial(
  config?: string
): THREE.ShaderMaterial;
