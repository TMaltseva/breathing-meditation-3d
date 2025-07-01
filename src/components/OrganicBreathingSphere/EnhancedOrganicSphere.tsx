import OrganicBreathingSphere from "./OrganicBreathingSphere";
import { OrganicSphereProps, PresetName, Presets } from "../../types/OrganicSphere.types";

export interface EnhancedOrganicSphereProps extends OrganicSphereProps {
  preset?: PresetName;
}

export function EnhancedOrganicSphere({
  preset = 'meditative',
  ...props
}: EnhancedOrganicSphereProps) {
  const presets: Presets = {
    meditative: {
      breathSpeed: 0.5,
      scaleAmplitude: 0.2,
      noiseAmplitude: 0.15,
      noiseSpeed: 0.1,
      colorStyle: 'pastel',
      emissiveIntensity: 0.2,
      enableRotation: false,
      rotationSpeed: 0.02,
    },
    dynamic: {
      breathSpeed: 0.5,
      scaleAmplitude: 0.4,
      noiseAmplitude: 0.35,
      noiseSpeed: 0.25,
      colorStyle: 'vibrant',
      emissiveIntensity: 0.1,
      enableRotation: true,
      rotationSpeed: 0.03,
    },
    minimal: {
      breathSpeed: 0.4,
      scaleAmplitude: 0.1,
      noiseAmplitude: 0.08,
      noiseSpeed: 0.05,
      colorStyle: 'monochrome',
      emissiveIntensity: 0.1,
      enableRotation: false,
      rotationSpeed: 0.01,
    },
    psychedelic: {
      breathSpeed: 0.6,
      scaleAmplitude: 0.5,
      noiseAmplitude: 0.45,
      noiseSpeed: 0.3,
      colorStyle: 'rainbow',
      emissiveIntensity: 0.4,
      enableRotation: true,
      rotationSpeed: 0.05,
    }
  };

  const presetConfig = presets[preset];
  const finalProps = { ...presetConfig, ...props };

  return <OrganicBreathingSphere {...finalProps} />;
}

export default EnhancedOrganicSphere;