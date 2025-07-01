export { organicVertexShader } from "./organicVertex.glsl.js";
export { organicFragmentShader } from "./organicFragment.glsl.js";

export const shaderConfigs = {
  organic: {
    uniforms: {
      uTime: { value: 0 },
      uBreathPhase: { value: 0 },
      uAmplitude: { value: 0.3 },
      uFrequency: { value: 1.0 },
      uNoiseScale: { value: { x: 2.0, y: 4.0, z: 8.0 } },
      uNoiseSpeed: { value: 0.2 },
      uColor: { value: { x: 0.9, y: 0.8, z: 1.0 } },
      uAccentColor: { value: { x: 0.8, y: 0.6, z: 1.0 } },
      uMetalness: { value: 0.02 },
      uRoughness: { value: 0.15 },
      uEmissiveIntensity: { value: 0.3 },
    },
    transparent: true,
  },
};

export const updateShaderUniforms = (
  material,
  time,
  breathPhase,
  settings = {}
) => {
  if (!material.uniforms) return;

  if (material.uniforms.uTime) material.uniforms.uTime.value = time;
  if (material.uniforms.uBreathPhase)
    material.uniforms.uBreathPhase.value = breathPhase;

  Object.entries(settings).forEach(([key, value]) => {
    const uniformKey = `u${key.charAt(0).toUpperCase() + key.slice(1)}`;
    if (material.uniforms[uniformKey]) {
      if (typeof value === "object" && value.x !== undefined) {
        material.uniforms[uniformKey].value.set(value.x, value.y, value.z);
      } else {
        material.uniforms[uniformKey].value = value;
      }
    }
  });
};
