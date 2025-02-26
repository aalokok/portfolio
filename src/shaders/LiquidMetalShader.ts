export const LiquidMetalShader = {
  vertexShader: `
    uniform float time;
    uniform float noiseStrength;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying vec3 vTangent;
    varying vec3 vBitangent;
    
    // Simplex 3D noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      
      // First corner
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      
      // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      
      // Permutations
      i = mod289(i);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
              
      // Gradients: 7x7 points over a square, mapped onto an octahedron.
      // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
      float n_ = 0.142857142857; // 1.0/7.0
      vec3 ns = n_ * D.wyz - D.xzx;
      
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      
      // Normalise gradients
      vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      
      // Mix final noise value
      vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
    }
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      // Calculate tangent and bitangent for normal mapping
      vec3 c1 = cross(normal, vec3(0.0, 0.0, 1.0));
      vec3 c2 = cross(normal, vec3(0.0, 1.0, 0.0));
      vec3 tangent = length(c1) > length(c2) ? c1 : c2;
      tangent = normalize(tangent);
      
      vTangent = normalize(normalMatrix * tangent);
      vBitangent = normalize(cross(vNormal, vTangent));
      
      // Apply liquid metal deformation
      vec3 pos = position;
      
      // Use multiple noise layers for complex deformation
      float noise = 0.0;
      
      // Layer 1: Large, slow waves
      noise += snoise(vec3(position.x * 0.5, position.y * 0.5, position.z * 0.5 + time * 0.2)) * 0.5;
      
      // Layer 2: Medium, moderate waves
      noise += snoise(vec3(position.x * 1.0, position.y * 1.0, position.z * 1.0 + time * 0.4)) * 0.25;
      
      // Layer 3: Small, fast ripples
      noise += snoise(vec3(position.x * 2.0, position.y * 2.0, position.z * 2.0 + time * 0.6)) * 0.125;
      
      // Normalize and adjust strength
      noise = noise * noiseStrength;
      
      // Displace vertex along normal
      pos += normal * noise;
      
      // Transform to clip space
      vPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  
  fragmentShader: `
    uniform float time;
    uniform vec3 color;
    uniform bool isDarkMode;
    uniform float metalness;
    uniform float roughness;
    uniform samplerCube envMap;
    uniform float envMapIntensity;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    varying vec3 vTangent;
    varying vec3 vBitangent;
    
    // Simplex noise for surface details
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
    
    // PBR Functions
    float DistributionGGX(vec3 N, vec3 H, float roughness) {
      float a = roughness * roughness;
      float a2 = a * a;
      float NdotH = max(dot(N, H), 0.0);
      float NdotH2 = NdotH * NdotH;
      
      float denom = (NdotH2 * (a2 - 1.0) + 1.0);
      denom = PI * denom * denom;
      
      return a2 / denom;
    }
    
    float GeometrySchlickGGX(float NdotV, float roughness) {
      float r = roughness + 1.0;
      float k = (r * r) / 8.0;
      
      float nom = NdotV;
      float denom = NdotV * (1.0 - k) + k;
      
      return nom / denom;
    }
    
    float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
      float NdotV = max(dot(N, V), 0.0);
      float NdotL = max(dot(N, L), 0.0);
      float ggx2 = GeometrySchlickGGX(NdotV, roughness);
      float ggx1 = GeometrySchlickGGX(NdotL, roughness);
      
      return ggx1 * ggx2;
    }
    
    vec3 fresnelSchlick(float cosTheta, vec3 F0) {
      return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
    }
    
    const float PI = 3.14159265359;
    
    void main() {
      // Base color with subtle variations
      vec3 baseColor = color;
      
      // Add subtle color variations using noise
      float colorNoise = snoise(vUv * 10.0 + time * 0.1) * 0.05;
      baseColor = mix(baseColor, baseColor * (1.0 + colorNoise), 0.3);
      
      // Calculate surface normal with additional micro-detail
      vec3 normal = normalize(vNormal);
      
      // Add micro surface detail using noise
      float surfaceNoise = snoise(vUv * 20.0 + time * 0.05) * (1.0 - roughness) * 0.05;
      vec3 perturbedNormal = normalize(normal + surfaceNoise * vTangent + surfaceNoise * vBitangent);
      
      // Viewing direction
      vec3 viewPos = cameraPosition;
      vec3 viewDir = normalize(viewPos - vPosition);
      
      // Light properties
      vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
      vec3 lightColor = isDarkMode ? vec3(1.0, 1.0, 1.0) : vec3(1.0, 1.0, 0.9);
      
      // Ambient lighting
      vec3 ambient = isDarkMode ? vec3(0.03, 0.03, 0.05) : vec3(0.1, 0.1, 0.1);
      
      // Physically based rendering calculations
      vec3 H = normalize(viewDir + lightDir);
      
      // F0 represents the specular reflectance at normal incidence
      // For most dielectric materials this is 0.04, for metals we use the baseColor
      vec3 F0 = mix(vec3(0.04), baseColor, metalness);
      
      // Cook-Torrance BRDF
      float NDF = DistributionGGX(perturbedNormal, H, roughness);
      float G = GeometrySmith(perturbedNormal, viewDir, lightDir, roughness);
      vec3 F = fresnelSchlick(max(dot(H, viewDir), 0.0), F0);
      
      vec3 kD = vec3(1.0) - F;
      kD *= 1.0 - metalness;
      
      vec3 numerator = NDF * G * F;
      float denominator = 4.0 * max(dot(normal, viewDir), 0.0) * max(dot(normal, lightDir), 0.0) + 0.0001;
      vec3 specular = numerator / denominator;
      
      // Reflection contribution
      vec3 R = reflect(-viewDir, perturbedNormal);
      vec3 envMapColor = textureCube(envMap, R).rgb * envMapIntensity;
      
      float NdotL = max(dot(perturbedNormal, lightDir), 0.0);
      
      // Calculate rim lighting (to enhance edges)
      float rimFactor = 1.0 - max(0.0, dot(viewDir, normal));
      rimFactor = pow(rimFactor, 3.0) * 0.5;
      vec3 rim = rimFactor * lightColor * (isDarkMode ? 0.7 : 0.5);
      
      // Combine all lighting components
      vec3 diffuse = kD * baseColor / PI;
      vec3 directLighting = (diffuse + specular) * lightColor * NdotL;
      vec3 envReflection = F * envMapColor; // Reflection weighted by fresnel
      
      // Final color
      vec3 finalColor = ambient * baseColor + directLighting + envReflection + rim;
      
      // Apply HDR tonemapping (simplified Reinhard)
      finalColor = finalColor / (finalColor + vec3(1.0));
      
      // Gamma correction
      finalColor = pow(finalColor, vec3(1.0/2.2));
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
}; 