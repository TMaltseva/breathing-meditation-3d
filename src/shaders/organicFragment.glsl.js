export const organicFragmentShader = `
  uniform float uTime;
  uniform float uBreathPhase;
  uniform vec3 uColor;
  uniform vec3 uAccentColor;
  uniform float uMetalness;
  uniform float uRoughness;
  uniform float uEmissiveIntensity;
  
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying float vNoise;
  
  void main() {
    vec3 baseColor = mix(uColor, uAccentColor, vNoise * 0.5 + 0.5);
    
    float breathGlow = sin(uBreathPhase) * 0.5 + 0.5;
    
    float emissive = smoothstep(0.2, 0.8, abs(vNoise)) * breathGlow;
    vec3 emissiveColor = uAccentColor * emissive * uEmissiveIntensity;
    
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(0.0, dot(vNormal, viewDirection)), 2.0);
    
    vec3 finalColor = baseColor + emissiveColor + uAccentColor * fresnel * 0.2;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
