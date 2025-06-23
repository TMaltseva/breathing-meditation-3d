import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stats, Preload } from '@react-three/drei';
import BreathingSphere from './components/BreathingSphere';
import Lighting, { LightingPresets } from './components/Lighting';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import BlurredBackground from './components/BlurredBackground/BlurredBackground';
import * as THREE from 'three';

import './App.css';

function App() {
  return (
    <div className="app-container">
      <div className="app-header">
        <h1 className="app-title">
          🧘‍♀️ Meditative Breathing
        </h1>
        <p className="app-subtitle">
          Interactive 3D animation for calming your mind
        </p>
      </div>

      <BlurredBackground />
      
      <Canvas 
        camera={{ 
          position: [0, 0, 6],
          fov: 50 
        }}
        className="canvas-container"
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1
        }}
      >
        <Suspense fallback={<LoadingSpinner message="Loading meditation space..." />}>
          <Lighting {...LightingPresets.meditative} />
          
          <BreathingSphere
            radius={1.5}
            quality={64}
            breathSpeed={0.4}
            scaleAmplitude={0.5}
            enableRotation={false}
            rotationSpeed={0.02}
            colorStyle="vibrant"
            syncWithBreath={true}
            metalness={0.02}
            roughness={0.15}
          />
          
          <Preload all />
        </Suspense>
        
        {process.env.NODE_ENV === 'development' && <Stats />}
      </Canvas>

      <div className="app-footer">
        <div className="progress-indicator">
          <div className="progress-step completed">
            ✅ Stage 1: 3D Breathing Sphere
          </div>
          <div className="progress-step completed">
            ✅ Stage 2: Optimized Background Effects
          </div>
          <div className="progress-step completed">
            ✅ Stage 3: Modular Architecture & Custom Hooks
          </div>
          <div className="progress-step completed">
            ✅ Stage 4: Advanced Animation Controls
          </div>
          <div className="progress-step current">
            🔄 Stage 5: User Settings & Presets
          </div>
        </div>
        
        <div className="app-controls">
          <p className="instruction-text">
            🌸 Focus on the breathing rhythm of the sphere
          </p>
          <p className="instruction-text">
            ✨ Breathe in as it grows, breathe out as it shrinks
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;