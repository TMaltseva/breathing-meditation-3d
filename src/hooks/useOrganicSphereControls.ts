import { useState, useCallback, useMemo } from "react";
import type {
  OrganicSphereSettings,
  PresetName,
  Presets,
  PresetConfig,
} from "../types/OrganicSphere.types";

export function useOrganicSphereControls(
  initialSettings: Partial<OrganicSphereSettings> = {}
) {
  const defaultSettings = useMemo(
    (): OrganicSphereSettings => ({
      breathSpeed: 0.35,
      scaleAmplitude: 0.15,
      noiseAmplitude: 0.3,
      noiseSpeed: 0.2,
      colorStyle: "pastel",
      enableRotation: false,
      rotationSpeed: 0.05,
      emissiveIntensity: 0.3,
    }),
    []
  );

  const [settings, setSettings] = useState<OrganicSphereSettings>(() => ({
    ...defaultSettings,
    ...initialSettings,
  }));

  const updateSetting = useCallback(
    <K extends keyof OrganicSphereSettings>(
      key: K,
      value: OrganicSphereSettings[K]
    ) => {
      setSettings((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const resetToDefaults = useCallback(() => {
    setSettings(defaultSettings);
  }, [defaultSettings]);

  const presets = useMemo(
    (): Presets => ({
      meditative: {
        breathSpeed: 0.3,
        scaleAmplitude: 0.2,
        noiseAmplitude: 0.15,
        noiseSpeed: 0.1,
        colorStyle: "pastel",
        emissiveIntensity: 0.15,
        enableRotation: false,
        rotationSpeed: 0.02,
      },
      dynamic: {
        breathSpeed: 0.5,
        scaleAmplitude: 0.4,
        noiseAmplitude: 0.35,
        noiseSpeed: 0.25,
        colorStyle: "vibrant",
        emissiveIntensity: 0.3,
        enableRotation: true,
        rotationSpeed: 0.03,
      },
      minimal: {
        breathSpeed: 0.4,
        scaleAmplitude: 0.1,
        noiseAmplitude: 0.08,
        noiseSpeed: 0.05,
        colorStyle: "monochrome",
        emissiveIntensity: 0.1,
        enableRotation: false,
        rotationSpeed: 0.01,
      },
      psychedelic: {
        breathSpeed: 0.6,
        scaleAmplitude: 0.5,
        noiseAmplitude: 0.45,
        noiseSpeed: 0.3,
        colorStyle: "rainbow",
        emissiveIntensity: 0.4,
        enableRotation: true,
        rotationSpeed: 0.05,
      },
    }),
    []
  );

  const applyPreset = useCallback(
    (presetName: PresetName) => {
      const presetConfig = presets[presetName];
      if (presetConfig) {
        setSettings((prev) => ({ ...prev, ...presetConfig }));
      }
    },
    [presets]
  );

  const getPresetNames = useCallback((): PresetName[] => {
    return ["meditative", "dynamic", "minimal", "psychedelic"];
  }, []);

  const isPresetActive = useCallback(
    (presetName: PresetName): boolean => {
      const preset = presets[presetName];

      return Object.keys(preset).every((key) => {
        const presetKey = key as keyof PresetConfig;
        return settings[presetKey] === preset[presetKey];
      });
    },
    [settings, presets]
  );

  const exportSettings = useCallback(() => {
    return JSON.stringify(settings, null, 2);
  }, [settings]);

  const importSettings = useCallback((settingsJson: string) => {
    try {
      const imported = JSON.parse(
        settingsJson
      ) as Partial<OrganicSphereSettings>;
      setSettings((prev) => ({ ...prev, ...imported }));
      return true;
    } catch (error) {
      console.error("Failed to import settings:", error);
      return false;
    }
  }, []);

  return {
    settings,
    updateSetting,
    resetToDefaults,
    applyPreset,
    getPresetNames,
    isPresetActive,
    exportSettings,
    importSettings,
  };
}
