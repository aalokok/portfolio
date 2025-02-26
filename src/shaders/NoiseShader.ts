export const NoiseShader = {
  uniforms: {
    "tDiffuse": { value: null },
    "time": { value: 0 },
    "amount": { value: 0.08 },
    "speed": { value: 0.3 },
    "isDark": { value: false }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float amount;
    uniform float speed;
    uniform bool isDark;
    varying vec2 vUv;
    
    // Simplex noise function
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
      m = m*m;
      m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Multi-layered noise for a more complex effect
      float noise = 0.0;
      float scale = 3.0;
      float amplitude = 1.0;
      float totalAmplitude = 0.0;
      
      for (int i = 0; i < 4; i++) {
        noise += snoise(uv * scale + time * speed * 0.3) * amplitude;
        totalAmplitude += amplitude;
        scale *= 2.0;
        amplitude *= 0.5;
      }
      
      noise /= totalAmplitude;
      noise = noise * 0.5 + 0.5; // Normalize to 0-1
      
      // Sample the original render
      vec4 color = texture2D(tDiffuse, uv);
      
      // Apply noise as a subtle overlay
      float noiseThreshold = isDark ? 0.65 : 0.75;
      float noiseMask = smoothstep(noiseThreshold, 1.0, noise);
      
      // Create shimmer effect
      vec3 shimmer = isDark 
        ? vec3(0.9, 0.95, 1.0) * noiseMask * amount
        : vec3(1.0, 1.0, 1.0) * noiseMask * amount;
      
      // Apply the effect differently based on dark mode
      if (isDark) {
        color.rgb += shimmer; // Additive in dark mode
      } else {
        // Slightly different effect in light mode - more subtle
        color.rgb = mix(color.rgb, color.rgb + shimmer, 0.6);
      }
      
      gl_FragColor = color;
    }
  `
}; 