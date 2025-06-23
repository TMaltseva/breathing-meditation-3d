import React from 'react';
import * as THREE from 'three';

interface LightingProps {
  ambientIntensity?: number;
  ambientColor?: string;
  directionalIntensity?: number;
  directionalColor?: string;
  directionalPosition?: [number, number, number];
  enableShadows?: boolean;
  hemisphereIntensity?: number;
  hemisphereTopColor?: string;
  hemisphereGroundColor?: string;
  meditativeMode?: boolean;
  glowSupport?: boolean;
}

export default function Lighting({
  ambientIntensity = 0.25,
  ambientColor = "#f8f8ff",
  directionalIntensity = 0.4,
  directionalColor = "#fff5ee", 
  directionalPosition = [3, 4, 5],
  enableShadows = false,
  hemisphereIntensity = 0.3,
  hemisphereTopColor = "#e6e6fa",
  hemisphereGroundColor = "#dda0dd",
  meditativeMode = true,
  glowSupport = true
}: LightingProps) {
  
  const meditativeSettings = meditativeMode ? {
    ambientIntensity: ambientIntensity * 0.9,
    directionalIntensity: directionalIntensity * 0.8,
    hemisphereIntensity: hemisphereIntensity * 1.1
  } : {
    ambientIntensity,
    directionalIntensity,
    hemisphereIntensity
  };

  return (
    <>
      <ambientLight 
        intensity={meditativeSettings.ambientIntensity} 
        color={ambientColor} 
      />
      
      <directionalLight 
        position={directionalPosition} 
        intensity={meditativeSettings.directionalIntensity} 
        color={directionalColor}
        castShadow={enableShadows}
        shadow-mapSize-width={enableShadows ? 1024 : undefined}
        shadow-mapSize-height={enableShadows ? 1024 : undefined}
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      
      <hemisphereLight 
        color={hemisphereTopColor}
        groundColor={hemisphereGroundColor}
        intensity={meditativeSettings.hemisphereIntensity}
        position={[0, 8, 0]}
      />
      
      {glowSupport && (
        <>
          <pointLight
            position={[0, 0, -6]}
            intensity={0.1}
            color="#f0e6ff"
            decay={2}
            distance={12}
          />
          
          <pointLight
            position={[0, -4, 0]}
            intensity={0.08}
            color="#e6e6fa"
            decay={2}
            distance={15}
          />
          
          <pointLight
            position={[-4, 2, 2]}
            intensity={0.05}
            color="#dda0dd"
            decay={2}
            distance={10}
          />
          
          <pointLight
            position={[4, 2, 2]}
            intensity={0.05}
            color="#e0b4d6"
            decay={2}
            distance={10}
          />
        </>
      )}
      
      {meditativeMode && (
        <>
          <spotLight
            position={[0, 8, 0]}
            target-position={[0, 0, 0]}
            intensity={0.1}
            color="#f8f8ff"
            angle={Math.PI / 3}
            penumbra={1}
            decay={2}
            distance={20}
          />
        </>
      )}
    </>
  );
}

export const LightingPresets = {
  meditative: {
    ambientIntensity: 0.2,
    directionalIntensity: 0.3,
    hemisphereIntensity: 0.25,
    hemisphereTopColor: "#f0e6ff",
    hemisphereGroundColor: "#dda0dd",
    meditativeMode: true,
    glowSupport: true
  },
  
  ethereal: {
    ambientIntensity: 0.15,
    directionalIntensity: 0.25,
    hemisphereIntensity: 0.3,
    hemisphereTopColor: "#e6e6fa",
    hemisphereGroundColor: "#c8a2c8",
    meditativeMode: true,
    glowSupport: true
  },
  
  dreamy: {
    ambientIntensity: 0.3,
    directionalIntensity: 0.2,
    hemisphereIntensity: 0.4,
    hemisphereTopColor: "#f8f8ff",
    hemisphereGroundColor: "#e0b4d6",
    meditativeMode: true,
    glowSupport: true
  },
  
  minimal: {
    ambientIntensity: 0.4,
    directionalIntensity: 0.15,
    hemisphereIntensity: 0.1,
    meditativeMode: false,
    glowSupport: false
  }
};