import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface LiquidMetalProps {
  darkMode: boolean;
  size: number;
  onInitialized?: () => void;
}

const LiquidMetal: React.FC<LiquidMetalProps> = ({ darkMode, size, onInitialized }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const lastActiveMousePos = useRef({ x: 0, y: 0 }); // Store last active mouse position
  const touchActive = useRef(false);
  const timeOffset = useRef(Math.random() * 100);
  const [loaded, setLoaded] = useState(false);
  const isHovering = useRef(false);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Capture the current value of containerRef to use in cleanup
    const container = containerRef.current;
    
    // Setup scene with a dark or light background gradient
    const scene = new THREE.Scene();
    
    // Camera with artistic perspective - wider field of view for more drama
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 4.5;
    
    // Renderer with high quality settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    // Clear the container and add the new canvas
    if (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);
    
    // Create more complex, artistic geometry
    // Use icosahedron as base for a more interesting form
    const geometry = new THREE.IcosahedronGeometry(1.8, 20);
    
    // Create dynamic shader material for artistic expression
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 + timeOffset.current },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uLastActiveMouse: { value: new THREE.Vector2(0, 0) }, // Last active mouse position
        uResolution: { value: new THREE.Vector2(size, size) },
        uDarkMode: { value: darkMode ? 1.0 : 0.0 },
        uNoiseStrength: { value: 0.5 },
        uFlowSpeed: { value: 0.3 },
        uTouchActive: { value: 0.0 },
        uColorBleed: { value: 0.0 },
        uHoverIntensity: { value: 0.0 }, // Add hover intensity uniform
        uGlowIntensity: { value: 1.8 } // Increased glow intensity (was implicitly 1.0)
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec2 uLastActiveMouse;
        uniform float uNoiseStrength;
        uniform float uTouchActive;
        uniform float uHoverIntensity;
        
        // Simplex 3D noise function
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
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
          
          // Mix final noise value
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }
        
        float fbm(vec3 p) {
          float amplitude = 1.0;
          float frequency = 1.0;
          float total = 0.0;
          float maxValue = 0.0;
          
          // Artistic adjustments for octaves
          const int octaves = 6;
          
          for (int i = 0; i < octaves; i++) {
            total += amplitude * snoise(p * frequency);
            maxValue += amplitude;
            amplitude *= 0.5;
            frequency *= 2.0;
            
            // Add rotation to each octave for more complex motion
            float angle = 0.15 * float(i);
            float ca = cos(angle), sa = sin(angle);
            p = vec3(
              ca * p.x - sa * p.z,
              p.y,
              sa * p.x + ca * p.z
            );
          }
          
          return total / maxValue;
        }
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          
          // Apply artistic organic deformation
          float slowTime = uTime * 0.15;
          vec3 pos = position;
          
          // Create variable distortion based on position
          float distortionScale = 1.0 + 0.5 * sin(position.y * 3.14159 + slowTime);
          
          // Apply fractal brownian motion for complex deformation
          float noise = fbm(vec3(
            pos.x * 0.8, 
            pos.y * 0.8 + slowTime * 0.1, 
            pos.z * 0.8 + slowTime * 0.15
          ));
          
          // Add flowing waves in the noise
          noise += 0.2 * sin(pos.y * 3.0 + slowTime * 0.5);
          
          // Add breathing pulsation
          float pulse = 0.15 * sin(slowTime * 0.2) * sin(pos.y * 2.0 + slowTime * 0.3);
          
          // Persistent deformation from last mouse position (doesn't reset)
          vec3 lastMouseInfluence = vec3(0.0);
          float lastMouseDist = length(pos.xy - uLastActiveMouse);
          float lastMouseFactor = smoothstep(1.8, 0.2, lastMouseDist);
          
          // More pronounced effect when last mouse was closer to this vertex
          if (lastMouseFactor > 0.01) {
            vec3 lastMouseDir = normalize(vec3(
              uLastActiveMouse.x - pos.x,
              uLastActiveMouse.y - pos.y,
              0.5
            ));
            
            // Create persistent deformation
            float persistentStrength = 0.3 * lastMouseFactor;
            lastMouseInfluence = lastMouseDir * persistentStrength;
          }
          
          // Modulate noise strength based on touch/mouse interaction
          float hoverFactor = uHoverIntensity * 1.5; // Increased effect during hover
          float interactionFactor = uTouchActive * 0.5 + hoverFactor;
          float finalStrength = uNoiseStrength * distortionScale + interactionFactor;
          
          // Add direction specific distortion for more artistic flow
          // Make top areas flow upward, bottom areas flow downward
          vec3 flowDir = vec3(
            sin(pos.y * 3.14159 + slowTime) * 0.05,
            sign(pos.y) * 0.05,
            cos(pos.x * 3.14159 + slowTime) * 0.05
          );
          
          // Apply displacement with all effects and persistent deformation
          pos += normal * (noise * finalStrength + pulse) + flowDir + lastMouseInfluence;
          
          // Add subtle twisting based on height and hover state
          float twistFactor = 1.0 + hoverFactor * 2.0;
          float twist = sin(slowTime * 0.3) * 0.1 * sin(position.y + slowTime * 0.2) * twistFactor;
          float sinTwist = sin(twist);
          float cosTwist = cos(twist);
          pos.xz = mat2(cosTwist, -sinTwist, sinTwist, cosTwist) * pos.xz;
          
          // Calculate view position for reflections
          vPosition = pos;
          
          vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0);
          vViewPosition = -modelViewPosition.xyz;
          
          gl_Position = projectionMatrix * modelViewPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec2 uLastActiveMouse;
        uniform vec2 uResolution;
        uniform float uDarkMode;
        uniform float uFlowSpeed;
        uniform float uTouchActive;
        uniform float uColorBleed;
        uniform float uHoverIntensity;
        uniform float uGlowIntensity;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        
        // Simplex noise function from vertex shader (repeated for fragment use)
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          
          vec3 i  = floor(v + dot(v, C.yyy));
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
          
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
          
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }
        
        // Improved color functions for more artistic results
        vec3 hueShift(vec3 color, float hueShift) {
          const vec3 k = vec3(0.57735, 0.57735, 0.57735);
          float cosAngle = cos(hueShift);
          return vec3(color * cosAngle + cross(k, color) * sin(hueShift) + k * dot(k, color) * (1.0 - cosAngle));
        }
        
        void main() {
          // Get normalized view direction
          vec3 viewDir = normalize(vViewPosition);
          
          // Calculate Fresnel effect (stronger at glancing angles)
          float fresnelFactor = pow(1.0 - abs(dot(vNormal, viewDir)), 6.0);
          
          // Create flow animation for colors
          float flowTime = uTime * uFlowSpeed;
          
          // Get noise at current position for color variation
          vec3 colorPos = vPosition * 0.5;
          float colorNoise = smoothstep(0.4, 0.6, snoise(colorPos + flowTime * 0.3));
          
          // Use last active mouse position to influence color
          float lastDist = length(vPosition.xy - uLastActiveMouse);
          float lastInfluence = smoothstep(2.0, 0.5, lastDist) * 0.5; // Persistent color influence
          
          // Enhanced hover effect
          float hoverEffect = uHoverIntensity * 2.0; // Doubled effect
          
          // Get glow intensity from uniform
          float glowMultiplier = uGlowIntensity;
          
          // Use dark mode vs light mode to change color palette
          vec3 color;
          if (uDarkMode > 0.5) {
            // Dark mode - rich, moody colors with enhanced contrast during hover
            vec3 baseColor = mix(
              vec3(0.02, 0.02, 0.05), // Deep blue-black
              vec3(0.12, 0.01, 0.15), // Dark purple
              colorNoise
            );
            
            vec3 accentColor = mix(
              vec3(0.6, 0.05, 0.3), // Magenta
              vec3(0.05, 0.4, 0.5), // Teal
              sin(flowTime * 0.2 + vPosition.y) * 0.5 + 0.5
            );
            
            // Increased accent intensity with glow multiplier
            float accentStrength = fresnelFactor * (0.7 + hoverEffect + lastInfluence) * glowMultiplier;
            
            // Mix colors with fresnel factor for edge highlighting
            color = mix(baseColor, accentColor, accentStrength);
            
            // Add iridescent rainbow at edges during hover
            if (hoverEffect > 0.1 || lastInfluence > 0.1) {
              float edgeRainbow = fresnelFactor * fresnelFactor * max(hoverEffect * 1.5, lastInfluence) * glowMultiplier;
              vec3 rainbow = hueShift(
                vec3(1.0, 0.5, 0.0), 
                flowTime * 2.0 + vPosition.z * 3.0
              );
              color = mix(color, rainbow, edgeRainbow * 0.7);
            }
          } else {
            // Light mode - luminous, warm metallic colors
            vec3 baseColor = mix(
              vec3(0.75, 0.75, 0.8), // Silver
              vec3(0.8, 0.7, 0.3),    // Gold
              colorNoise
            );
            
            vec3 accentColor = mix(
              vec3(0.9, 0.65, 0.3),   // Amber
              vec3(0.2, 0.75, 0.85),  // Turquoise
              sin(flowTime * 0.3 + vPosition.y * 2.0) * 0.5 + 0.5
            );
            
            // Increase accent during hover with glow multiplier
            float accentStrength = fresnelFactor * (0.6 + hoverEffect + lastInfluence) * glowMultiplier;
            
            // Mix colors with fresnel factor for edge highlighting
            color = mix(baseColor, accentColor, accentStrength);
            
            // Add subtle rainbow shimmer during hover
            if (hoverEffect > 0.1 || lastInfluence > 0.1) {
              float edgeRainbow = fresnelFactor * max(hoverEffect, lastInfluence) * glowMultiplier;
              vec3 rainbow = hueShift(
                vec3(0.9, 0.8, 0.4), 
                flowTime * 1.5 + vPosition.z * 2.0
              );
              color = mix(color, rainbow, edgeRainbow * 0.5);
            }
          }
          
          // Enhance specular highlights based on hover
          float specularPower = 32.0 + hoverEffect * 64.0;
          float specular = pow(max(0.0, dot(reflect(-viewDir, vNormal), vec3(0.0, 0.0, 1.0))), specularPower);
          // Increased specular intensity by multiplying with glow intensity
          float specularIntensity = (0.6 + hoverEffect * 0.8) * glowMultiplier;
          color += specular * specularIntensity * (uDarkMode > 0.5 ? vec3(0.4, 0.6, 1.0) : vec3(1.0, 0.95, 0.8));
          
          // Apply gamma correction
          color = pow(color, vec3(0.4545)); // 1/2.2 for gamma correction
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      transparent: true
    });
    
    // Create the mesh with the geometry and material
    const mesh = new THREE.Mesh(geometry, material);
    // Add subtle tilt for more interesting angle
    mesh.rotation.z = 0.1;
    mesh.rotation.x = 0.1;
    scene.add(mesh);
    
    // Add lights
    if (darkMode) {
      // Subtle ambient light for dark mode - increased from 0.8 to 1.0
      const ambientLight = new THREE.AmbientLight(0x222233, 1.0);
      scene.add(ambientLight);
      
      // Main directional light from top-right - increased from 1.5 to 2.0
      const directionalLight = new THREE.DirectionalLight(0x8888ff, 2.0);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);
      
      // Secondary rim light from back-left for dramatic edge highlighting - increased from 1.0 to 1.5
      const rimLight = new THREE.DirectionalLight(0x6644aa, 1.5);
      rimLight.position.set(-5, 3, -5);
      scene.add(rimLight);
    } else {
      // Brighter ambient for light mode - increased from 1.0 to 1.2
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambientLight);
      
      // Warm main light - increased from 1.3 to 1.8
      const directionalLight = new THREE.DirectionalLight(0xfffaf0, 1.8);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);
      
      // Cool secondary light for contrast - increased from 0.8 to 1.2
      const secondaryLight = new THREE.DirectionalLight(0xe8f4ff, 1.2);
      secondaryLight.position.set(-5, 3, -3);
      scene.add(secondaryLight);
    }
    
    // Handle mouse movement for interactivity
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      mousePosition.current = { x, y };
      
      if (isHovering.current) {
        lastActiveMousePos.current = { x, y }; // Update last active position when hovering
        material.uniforms.uLastActiveMouse.value.set(x, y);
      }
      
      material.uniforms.uMouse.value.set(x, y);
    };
    
    // Handle touch interaction for mobile
    const handleTouchStart = () => {
      touchActive.current = true;
      material.uniforms.uTouchActive.value = 1.0;
    };
    
    const handleTouchEnd = () => {
      touchActive.current = false;
      material.uniforms.uTouchActive.value = 0.0;
    };
    
    // Handle hover state - important for persistent structure
    const handleMouseEnter = () => {
      isHovering.current = true;
      // Gradually increase hover intensity
      const increaseIntensity = () => {
        if (!isHovering.current) return;
        
        const currentValue = material.uniforms.uHoverIntensity.value;
        const newValue = Math.min(1.0, currentValue + 0.05);
        material.uniforms.uHoverIntensity.value = newValue;
        
        if (newValue < 1.0) {
          requestAnimationFrame(increaseIntensity);
        }
      };
      increaseIntensity();
    };
    
    const handleMouseLeave = () => {
      isHovering.current = false;
      // Gradually decrease hover intensity - but maintain structure
      const decreaseIntensity = () => {
        if (isHovering.current) return;
        
        const currentValue = material.uniforms.uHoverIntensity.value;
        const newValue = Math.max(0.0, currentValue - 0.03); // Slower decrease
        material.uniforms.uHoverIntensity.value = newValue;
        
        if (newValue > 0.0) {
          requestAnimationFrame(decreaseIntensity);
        }
      };
      decreaseIntensity();
    };
    
    // Add event listeners
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchcancel', handleTouchEnd);
    
    // Animation loop
    const animate = () => {
      const time = performance.now() * 0.001; // Convert to seconds
      
      // Update uniforms
      material.uniforms.uTime.value = time;
      
      // Render the scene
      renderer.render(scene, camera);
      
      // Continue animation loop
      requestRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation loop
    requestRef.current = requestAnimationFrame(animate);
    
    // Set loaded state to true
    setLoaded(true);
    
    // Call onInitialized callback if provided
    if (onInitialized) {
      onInitialized();
    }
    
    // Cleanup function
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
      
      // Remove event listeners
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
      
      // Dispose resources
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [darkMode, size, onInitialized]); // Include onInitialized in dependencies
  
  // Fix for ESLint warning: add loaded to dependencies
  useEffect(() => {
    if (loaded && onInitialized) {
      onInitialized();
    }
  }, [loaded, onInitialized]);
  
  return (
    <div ref={containerRef} className="liquid-metal-container" />
  );
};

export default LiquidMetal; 