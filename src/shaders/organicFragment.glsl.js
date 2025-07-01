export const organicFragmentShader = `
    uniform float uTime;
    uniform float uBreathPhase;
    uniform vec3 uColor;
    uniform vec3 uAccentColor;
    uniform float uBrightness;
    uniform float uSaturation;
    uniform float uEmissiveIntensity;

    varying vec3 vPosition;
    varying vec3 vNormal;
    varying float vNoise;

    vec3 adjustSaturation(vec3 color, float saturation) {
        float luma = dot(color, vec3(0.299, 0.587, 0.114));
        return mix(vec3(luma), color, saturation);
    }

    void main() {
        float noiseFactor = smoothstep(-0.4, 0.4, vNoise * 0.7);
        vec3 baseColor = mix(uColor, uAccentColor, noiseFactor * 0.5);
        
        baseColor = adjustSaturation(baseColor, uSaturation);
        baseColor *= uBrightness;
        
        float breathGlow = (sin(uBreathPhase) + 1.0) * 0.08;
        float emissive = smoothstep(0.2, 0.5, abs(vNoise)) * breathGlow;
        vec3 emissiveColor = uAccentColor * emissive * uEmissiveIntensity * 0.5;
        
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float fresnel = pow(1.0 - max(0.0, dot(vNormal, viewDir)), 2.0) * 0.2;
        
        vec3 finalColor = baseColor + emissiveColor;
        finalColor = mix(finalColor, uAccentColor * 0.5, fresnel);
        finalColor = clamp(finalColor, 0.0, 1.0);
        
        finalColor = pow(finalColor, vec3(1.0/2.2));
        
        gl_FragColor = vec4(finalColor, 1.0);
    }
`;
