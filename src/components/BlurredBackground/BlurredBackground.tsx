import React, { useMemo } from 'react';
import './BlurredBackground.css';

interface BackgroundParticle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  blur: number;
  color: string;
  animationDelay: number;
  animationType: number;
  animationDuration: number;
}

export default function BlurredBackground() {
  const particles = useMemo<BackgroundParticle[]>(() => {
    const result: BackgroundParticle[] = [];
    const colors = ['#e6e6fa', '#dda0dd', '#f0e6ff', '#d8bfd8', '#e0b4d6', '#c8a2c8'];
    
    for (let i = 0; i < 25; i++) {
      result.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 20 + Math.random() * 80,
        opacity: 0.08 + Math.random() * 0.25,
        blur: 8 + Math.random() * 17,
        color: colors[Math.floor(Math.random() * colors.length)],
        animationDelay: Math.random() * 15,
        animationType: Math.floor(Math.random() * 3),
        animationDuration: 8 + Math.random() * 10
      });
    }
    
    return result;
  }, []);

  return (
    <div className="blurred-background">
      {particles.map((particle, index) => (
        <div
          key={index}
          className={`background-particle float-${particle.animationType}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            filter: `blur(${particle.blur}px)`,
            animationDuration: `${particle.animationDuration}s`,
            animationDelay: `${particle.animationDelay}s`,
          }}
        />
      ))}
    </div>
  );
}