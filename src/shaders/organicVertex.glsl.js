export const organicVertexShader = `
    uniform float uTime;
    uniform float uBreathPhase;
    uniform float uAmplitude;
    uniform float uFrequency;
    uniform vec3 uNoiseScale;
    uniform float uNoiseSpeed;
    uniform float uBreathAmplitude;

    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;
    varying float vNoise;

    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        
        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        
        i = mod289(i);
        vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        
        vec4 s0 = floor(b0) * 2.0 + 1.0;
        vec4 s1 = floor(b1) * 2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        
        vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
        
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    vec3 calculateSmoothNormal(vec3 pos, float time, vec3 scale, float amplitude) {
    float eps = 0.005;
    
    float centerNoise = snoise(pos * scale + time);
    vec3 center = pos + pos * centerNoise * amplitude;
    
    vec3 dx = pos + vec3(eps, 0, 0);
    vec3 dy = pos + vec3(0, eps, 0);
    
    float noiseX = snoise(dx * scale + time);
    float noiseY = snoise(dy * scale + time);
    
    vec3 deformedX = dx + dx * noiseX * amplitude;
    vec3 deformedY = dy + dy * noiseY * amplitude;
    
    vec3 tangent = deformedX - center;
    vec3 bitangent = deformedY - center;
    
    vec3 originalNormal = normalize(pos);
    vec3 computedNormal = normalize(cross(tangent, bitangent));
    
    return normalize(mix(computedNormal, originalNormal, 0.3));
    }

    void main() {
        vUv = uv;
        vec3 pos = position;
        vec3 normPos = normalize(pos);
        
        float breath = sin(uBreathPhase * 0.8) * 0.5 + 0.5;
        float breathScale = 1.0 + (breath - 0.5) * uBreathAmplitude * 0.5;
        
        float time = uTime * uNoiseSpeed;
        vec3 noiseCoord = normPos * uNoiseScale + time;
        
        float noise1 = snoise(noiseCoord);
        float noise2 = snoise(noiseCoord * 1.8 + 10.0) * 0.5;
        float noise3 = snoise(noiseCoord * 3.6 + 20.0) * 0.25;
        vNoise = (noise1 + noise2 + noise3) / 1.75;
        
        float deformationAmount = clamp(vNoise * uAmplitude, -0.5, 0.5);
        vec3 deformation = normPos * deformationAmount * 0.3;
        
        pos = pos * breathScale + deformation;
        
        vNormal = calculateSmoothNormal(normPos, time, uNoiseScale, uAmplitude * 0.2);
        vPosition = pos;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;
