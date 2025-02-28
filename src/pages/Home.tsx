import React, { useEffect, useRef, useState, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import LightArtBox from '../components/LightArtBox';
import '../styles/Home.css';

interface LiquidPoint {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  size: number;
  opacity: number;
  vx: number;
  vy: number;
  vz: number;
  color: string;
  connections: number[];
  noiseOffsetX: number;
  noiseOffsetY: number;
  noiseOffsetZ: number;
  morphPhase: number;
  morphSpeed: number;
  distortStrength: number;
  metallic: number;
}

const Home: React.FC = () => {
  const { darkMode } = useContext(ThemeContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | undefined>(undefined);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const [mouseActive, setMouseActive] = useState(false);
  const liquidPointsRef = useRef<LiquidPoint[]>([]);
  const isInitializedRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const [showMobileNotification, setShowMobileNotification] = useState(true);
  
  // Advanced noise function with distortion
  const liquidNoise = (x: number, y: number, z: number, distortion: number) => {
    // Create multiple layers of noise
    const nx1 = Math.sin(x * 0.02 + timeRef.current * 0.1) * Math.cos(y * 0.02) * Math.sin(z * 0.03);
    const ny1 = Math.cos(x * 0.03) * Math.sin(y * 0.03 + timeRef.current * 0.05) * Math.cos(z * 0.01);
    const nz1 = Math.sin(x * 0.01) * Math.cos(y * 0.01) * Math.sin(z * 0.03 + timeRef.current * 0.08);
    
    // Second layer with different frequencies and phases
    const nx2 = Math.sin(x * 0.05 + timeRef.current * 0.2) * Math.cos(y * 0.04 - timeRef.current * 0.15);
    const ny2 = Math.cos(x * 0.04 - timeRef.current * 0.25) * Math.sin(y * 0.06 + timeRef.current * 0.1);
    const nz2 = Math.sin(x * 0.03 + timeRef.current * 0.1) * Math.cos(y * 0.02 - timeRef.current * 0.05);
    
    // Combine layers with distortion
    const nx = nx1 * (1 - distortion) + nx2 * distortion;
    const ny = ny1 * (1 - distortion) + ny2 * distortion;
    const nz = nz1 * (1 - distortion) + nz2 * distortion;
    
    return { nx, ny, nz };
  };
  
  // Initialize audio context for reactive elements
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 64;
        
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);
        
        // Create oscillator for ambient sound texture - purely visual representation
        const oscillator = audioContextRef.current.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(40, audioContextRef.current.currentTime);
        
        // Connect nodes
        const gain = audioContextRef.current.createGain();
        gain.gain.value = 0; // Silent, just for visualization
        
        oscillator.connect(gain);
        gain.connect(analyserRef.current);
        gain.connect(audioContextRef.current.destination);
        
        // oscillator.start();
        
        return () => {
          if (audioContextRef.current?.state !== 'closed') {
            audioContextRef.current?.close();
          }
        };
      } catch (e) {
        console.log('Web Audio API not supported or blocked by browser');
      }
    }
  }, []);

  // Create the liquid system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (!isInitializedRef.current) {
        initLiquidSystem();
        isInitializedRef.current = true;
      } else {
        // Just adjust points to new dimensions without full reinit
        adjustPointsToCanvas();
      }
    };
    
    // Adjust existing points to new canvas dimensions
    const adjustPointsToCanvas = () => {
      const points = liquidPointsRef.current;
      if (points.length === 0) return;
      
      const scaleX = canvas.width / (window.innerWidth);
      const scaleY = canvas.height / (window.innerHeight);
      
      points.forEach(point => {
        point.baseX = point.baseX * scaleX;
        point.baseY = point.baseY * scaleY;
      });
    };
    
    // Create grayscale color with depth and texture
    const createGrayscaleColor = (baseVal: number, a: number, metallic: number): string => {
      // Adjust for light/dark mode
      const isDarkMode = darkMode;
      
      // Base opacity adjustment
      const adjustedOpacity = a * 0.7;
      
      // Create a grayscale value based on metallic factor and theme
      let grayValue: number;
      
      if (isDarkMode) {
        // Always use rgba for dark mode
        if (metallic > 0.7) {
          // Lighter gray for high metallic in dark mode
          grayValue = Math.min(baseVal + 80, 240);
        } else if (metallic > 0.3) {
          // Medium gray for medium metallic in dark mode
          grayValue = Math.min(baseVal + 40, 200);
        } else {
          // Darker gray for low metallic in dark mode
          grayValue = Math.min(baseVal, 160);
        }
        return `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${adjustedOpacity})`;
      } else {
        // Light mode - Use grayscale instead of colorful hsla
        if (metallic > 0.7) {
          // Lighter gray for high metallic in light mode
          grayValue = Math.min(baseVal + 100, 200);
        } else if (metallic > 0.3) {
          // Medium gray for medium metallic in light mode
          grayValue = Math.min(baseVal + 60, 170);
        } else {
          // Darker gray for low metallic in light mode
          grayValue = Math.min(baseVal + 20, 140);
        }
        return `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${adjustedOpacity})`;
      }
    };
    
    // Initialize the liquid system
    const initLiquidSystem = () => {
      const points: LiquidPoint[] = [];
      const numPoints = 550;
      
      // Create liquid points with more organic properties
      for (let i = 0; i < numPoints; i++) {
        const depth = Math.random();
        const z = Math.random() * 5 - 2.5;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        // Choose base color value based on depth and position
        const baseGrayValue = darkMode 
          ? 130 + Math.floor(Math.random() * 90) // 130-220 for dark mode
          : 30 + Math.floor(Math.random() * 90);  // 30-120 for light mode (will be used for grayscale)
        
        // Metallic effect (0-1)
        const metallic = 0.3 + Math.random() * 0.7;
        
        // Create more dramatic opacity variance
        const baseOpacity = 0.2 + (z + 2.5) / 5 * 0.75;
        
        points.push({
          x,
          y,
          z,
          baseX: x,
          baseY: y,
          baseZ: z,
          size: 1.5 + (z + 2.5) / 5 * 2.5 + Math.random() * 1.5,
          opacity: baseOpacity,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          vz: (Math.random() - 0.5) * 0.05,
          color: createGrayscaleColor(baseGrayValue, baseOpacity, metallic),
          connections: [],
          noiseOffsetX: Math.random() * 1000,
          noiseOffsetY: Math.random() * 1000,
          noiseOffsetZ: Math.random() * 1000,
          morphPhase: Math.random() * Math.PI * 2,
          morphSpeed: 0.01 + Math.random() * 0.03,
          distortStrength: 0.2 + Math.random() * 0.6,
          metallic
        });
      }
      
      liquidPointsRef.current = points;
    };
    
    // Find organic connections based on proximity and flow patterns
    const updateConnections = () => {
      const points = liquidPointsRef.current;
      const connectionThreshold = 160;
      
      // Reset connections
      points.forEach(point => {
        point.connections = [];
      });
      
      // Create new connections based on current positions and organic flow
      points.forEach((point, i) => {
        const nearbyPoints: [number, number][] = [];
        
        points.forEach((otherPoint, j) => {
          if (i !== j) {
            const dx = point.x - otherPoint.x;
            const dy = point.y - otherPoint.y;
            const dz = point.z - otherPoint.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            // Fluid flow-sensitive distance
            const flowAffinity = Math.abs(Math.sin(point.morphPhase - otherPoint.morphPhase));
            const effectiveDist = dist * (1 - flowAffinity * 0.3);
            
            if (effectiveDist < connectionThreshold) {
              nearbyPoints.push([effectiveDist, j]);
            }
          }
        });
        
        // Sort by distance and get variable number of connections
        nearbyPoints.sort((a, b) => a[0] - b[0]);
        const maxConnections = Math.floor(2 + point.metallic * 3);
        point.connections = nearbyPoints.slice(0, maxConnections).map(d => d[1]);
      });
    };
    
    // Draw experimental blob shapes
    const drawLiquidShape = (ctx: CanvasRenderingContext2D, point: LiquidPoint) => {
      ctx.save();
      
      // Morph the point shape based on noise and time
      const sizePulse = Math.sin(timeRef.current * 2 + point.morphPhase) * 0.2 + 0.8;
      const morphedSize = point.size * sizePulse;
      
      // Extract color components for manipulation
      const colorMatch = point.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      
      if (colorMatch) {
        const gray = parseInt(colorMatch[1]);
        const a = colorMatch[4] ? parseFloat(colorMatch[4]) : 1;
        
        // Add subtle brightness shift for metallic feel
        const time = timeRef.current;
        const brightnessShift = Math.sin(time * 0.5 + point.morphPhase) * 15;
        
        // Create subtle glow with grayscale colors
        const glowRadius = morphedSize * (2 + point.metallic);
        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, glowRadius
        );
        
        // Intense core
        gradient.addColorStop(0, `rgba(${gray + brightnessShift}, ${gray + brightnessShift}, ${gray + brightnessShift}, ${a})`);
        // Mid transition 
        gradient.addColorStop(0.3, `rgba(${gray + brightnessShift*0.7}, ${gray + brightnessShift*0.7}, ${gray + brightnessShift*0.7}, ${a * 0.6})`);
        // Soft outer glow
        gradient.addColorStop(1, `rgba(${gray}, ${gray}, ${gray}, 0)`);
        
        ctx.fillStyle = gradient;
        
        // Draw experimental shape
        if (point.metallic > 0.7) {
          // Distorted blob for high metallic points
          ctx.beginPath();
          const sides = 6 + Math.floor(point.metallic * 6);
          const angleStep = (Math.PI * 2) / sides;
          
          for (let i = 0; i < sides; i++) {
            const angle = i * angleStep + time * point.morphSpeed + point.morphPhase;
            const distortFactor = 0.7 + Math.sin(angle * 3 + time) * 0.3 * point.distortStrength;
            const radialDist = morphedSize * distortFactor;
            
            const xPos = point.x + Math.cos(angle) * radialDist;
            const yPos = point.y + Math.sin(angle) * radialDist;
            
            if (i === 0) {
              ctx.moveTo(xPos, yPos);
            } else {
              // Smooth curves for liquid feel
              const prevAngle = (i - 1) * angleStep + time * point.morphSpeed + point.morphPhase;
              const cpDist = radialDist * 0.55; // control point distance
              
              const cp1x = point.x + Math.cos(prevAngle + angleStep * 0.5) * cpDist;
              const cp1y = point.y + Math.sin(prevAngle + angleStep * 0.5) * cpDist;
              
              ctx.quadraticCurveTo(cp1x, cp1y, xPos, yPos);
            }
          }
          ctx.closePath();
          ctx.fill();
        } else {
          // Circular glow for normal points
          ctx.beginPath();
          ctx.arc(point.x, point.y, morphedSize, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Add highlight reflection for metallic effect
        if (point.metallic > 0.3) {
          // Small intense highlight - white in dark mode, dark in light mode
          const hlAngle = time * 0.3 + point.morphPhase;
          const hlX = point.x + Math.cos(hlAngle) * morphedSize * 0.4;
          const hlY = point.y + Math.sin(hlAngle) * morphedSize * 0.4;
          const hlSize = morphedSize * 0.3 * point.metallic;
          
          const hlGradient = ctx.createRadialGradient(
            hlX, hlY, 0,
            hlX, hlY, hlSize
          );
          
          // Light highlight in dark mode, dark highlight in light mode
          const highlightColor = darkMode ? "255, 255, 255" : "20, 20, 20";
          hlGradient.addColorStop(0, `rgba(${highlightColor}, ${0.7 * point.metallic})`);
          hlGradient.addColorStop(1, `rgba(${highlightColor}, 0)`);
          
          ctx.fillStyle = hlGradient;
          ctx.beginPath();
          ctx.arc(hlX, hlY, hlSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      ctx.restore();
    };

    // Draw liquid connection with variable thickness and grayscale/color gradient
    const drawLiquidConnection = (
      ctx: CanvasRenderingContext2D, 
      pointA: LiquidPoint, 
      pointB: LiquidPoint
    ) => {
      const dx = pointB.x - pointA.x;
      const dy = pointB.y - pointA.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Don't draw if too far
      if (distance > 240) return;
      
      // Calculate line intensity based on distance, phase alignment, and metallics
      const intensityByDist = 1 - (distance / 240);
      const phaseAlignment = Math.abs(Math.sin((pointA.morphPhase - pointB.morphPhase) / 2));
      const metallicFactor = (pointA.metallic + pointB.metallic) / 2;
      
      // Combined intensity
      const intensity = intensityByDist * (0.5 + phaseAlignment * 0.5) * (0.7 + metallicFactor * 0.3);
      
      if (intensity <= 0) return;
      
      // Calculate time-based pulsing for the connection
      const pulseFactor = 0.7 + Math.sin(timeRef.current * 2 + (pointA.morphPhase + pointB.morphPhase) / 2) * 0.3;
      const lineOpacity = Math.min(0.9, intensity * 0.6 * pulseFactor);
      
      // Create gradient for connection
      const gradient = ctx.createLinearGradient(pointA.x, pointA.y, pointB.x, pointB.y);
      
      // Helper function to determine if a color is in rgba or hsla format
      const isRgbaFormat = (color: string): boolean => {
        return color.startsWith('rgba') || color.startsWith('rgb');
      };
      
      // Parse color values outside of the conditional functions so they're available throughout the function
      // Parse for RGBA format
      let grayA = 0, grayB = 0;
      const colorMatchA = isRgbaFormat(pointA.color) ? pointA.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/) : null;
      const colorMatchB = isRgbaFormat(pointB.color) ? pointB.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/) : null;
      
      if (colorMatchA && colorMatchB) {
        grayA = parseInt(colorMatchA[1]);
        grayB = parseInt(colorMatchB[1]);
      }
      
      // Parse for HSLA format
      const getHue = (color: string): number => {
        if (!isRgbaFormat(color)) {
          const hslaMatch = color.match(/hsla?\((\d+)/);
          return hslaMatch ? parseInt(hslaMatch[1]) : 200; // Default to blue if not matched
        }
        return 200; // Default hue
      };
      
      const hueA = getHue(pointA.color);
      const hueB = getHue(pointB.color);
      
      const applyDarkModeGradient = () => {
        // For dark mode, we need both points to be in rgba format
        if (isRgbaFormat(pointA.color) && isRgbaFormat(pointB.color) && colorMatchA && colorMatchB) {
          gradient.addColorStop(0, `rgba(${grayA}, ${grayA}, ${grayA}, ${lineOpacity})`);
          
          // Add middle point with highlight if connections are metallic enough
          if ((pointA.metallic + pointB.metallic) / 2 > 0.5) {
            const midT = 0.4 + Math.sin(timeRef.current + pointA.morphPhase) * 0.1;
            const highlightIntensity = intensity * metallicFactor;
            const highlightGray = Math.min(255, (grayA + grayB) / 2 + 40 * highlightIntensity);
            
            gradient.addColorStop(midT, `rgba(${highlightGray}, ${highlightGray}, ${highlightGray}, ${lineOpacity * 1.2})`);
          }
          
          gradient.addColorStop(1, `rgba(${grayB}, ${grayB}, ${grayB}, ${lineOpacity})`);
          return true;
        } 
        
        // If we have hsla colors in dark mode, convert to grayscale
        const darkGrayA = 180; // Medium gray
        const darkGrayB = 180;
        
        gradient.addColorStop(0, `rgba(${darkGrayA}, ${darkGrayA}, ${darkGrayA}, ${lineOpacity})`);
        
        if ((pointA.metallic + pointB.metallic) / 2 > 0.5) {
          const midT = 0.4 + Math.sin(timeRef.current + pointA.morphPhase) * 0.1;
          gradient.addColorStop(midT, `rgba(220, 220, 220, ${lineOpacity * 1.2})`);
        }
        
        gradient.addColorStop(1, `rgba(${darkGrayB}, ${darkGrayB}, ${darkGrayB}, ${lineOpacity})`);
        return true;
      };
      
      const applyLightModeGradient = () => {
        if (!isRgbaFormat(pointA.color) && !isRgbaFormat(pointB.color)) {
          // For light mode, still use grayscale instead of hsla
          // Calculate grayscale values based on metallic
          const lightGrayA = 150 + (pointA.metallic * 30); 
          const lightGrayB = 150 + (pointB.metallic * 30);
          
          gradient.addColorStop(0, `rgba(${lightGrayA}, ${lightGrayA}, ${lightGrayA}, ${lineOpacity})`);
          
          // Add middle point with highlight if connections are metallic enough
          if ((pointA.metallic + pointB.metallic) / 2 > 0.5) {
            const midT = 0.4 + Math.sin(timeRef.current + pointA.morphPhase) * 0.1;
            const highlightIntensity = intensity * metallicFactor;
            const midGray = Math.min(200, ((lightGrayA + lightGrayB) / 2) + 20 * highlightIntensity);
            
            gradient.addColorStop(midT, `rgba(${midGray}, ${midGray}, ${midGray}, ${lineOpacity * 1.2})`);
          }
          
          gradient.addColorStop(1, `rgba(${lightGrayB}, ${lightGrayB}, ${lightGrayB}, ${lineOpacity})`);
          return true;
        } 
        
        // If mixed color formats, use consistent grayscale
        const lightGrayA = 150;
        const lightGrayB = 150;
        
        gradient.addColorStop(0, `rgba(${lightGrayA}, ${lightGrayA}, ${lightGrayA}, ${lineOpacity})`);
        
        if ((pointA.metallic + pointB.metallic) / 2 > 0.5) {
          const midT = 0.4 + Math.sin(timeRef.current + pointA.morphPhase) * 0.1;
          gradient.addColorStop(midT, `rgba(180, 180, 180, ${lineOpacity * 1.2})`);
        }
        
        gradient.addColorStop(1, `rgba(${lightGrayB}, ${lightGrayB}, ${lightGrayB}, ${lineOpacity})`);
        return true;
      };
      
      // Apply the appropriate gradient based on theme
      const gradientApplied = darkMode ? applyDarkModeGradient() : applyLightModeGradient();
      
      // If gradient couldn't be applied for some reason, don't draw
      if (!gradientApplied) return;
      
      ctx.strokeStyle = gradient;
      
      // Calculate variable line thickness
      const baseThickness = Math.min(pointA.size, pointB.size) * 0.3;
      const dynamicThickness = baseThickness * intensity * (0.5 + metallicFactor * 1.0);
      const finalThickness = Math.min(3.5, dynamicThickness * pulseFactor);
      
      ctx.lineWidth = finalThickness;
      
      // Draw with slight curvature for liquid feel
      ctx.beginPath();
      
      // Calculate control points for quadratic curve
      const midX = (pointA.x + pointB.x) / 2;
      const midY = (pointA.y + pointB.y) / 2;
      
      const perpX = -(pointB.y - pointA.y);
      const perpY = pointB.x - pointA.x;
      const perpLength = Math.sqrt(perpX * perpX + perpY * perpY);
      
      const turbulence = Math.sin(timeRef.current * 0.5 + (pointA.noiseOffsetX + pointB.noiseOffsetX) / 2) * 15;
      const normalizedPerpX = perpX / perpLength * turbulence;
      const normalizedPerpY = perpY / perpLength * turbulence;
      
      const cpX = midX + normalizedPerpX;
      const cpY = midY + normalizedPerpY;
      
      // Decide on connection style
      const connectionStyle = (pointA.metallic + pointB.metallic) / 2 > 0.65 || distance > 160 
        ? 'quadratic' 
        : 'direct';
      
      if (connectionStyle === 'quadratic') {
        ctx.moveTo(pointA.x, pointA.y);
        ctx.quadraticCurveTo(cpX, cpY, pointB.x, pointB.y);
      } else {
        ctx.moveTo(pointA.x, pointA.y);
        ctx.lineTo(pointB.x, pointB.y);
      }
      
      ctx.stroke();
      
      // For highly metallic connections, add glow
      if ((pointA.metallic + pointB.metallic) / 2 > 0.8 && distance < 120) {
        ctx.save();
        
        // Determine glow color based on theme
        let glowGray;
        if (darkMode) {
          glowGray = Math.min(255, (colorMatchA && colorMatchB) ? (grayA + grayB) / 2 + 50 : 220);
        } else {
          glowGray = Math.max(20, (colorMatchA && colorMatchB) ? (grayA + grayB) / 2 - 30 : 40);
        }
        
        ctx.strokeStyle = `rgba(${glowGray}, ${glowGray}, ${glowGray}, ${lineOpacity * 0.4})`;
        ctx.lineWidth = finalThickness * 3;
        ctx.globalCompositeOperation = 'lighter';
        
        if (connectionStyle === 'quadratic') {
          ctx.beginPath();
          ctx.moveTo(pointA.x, pointA.y);
          ctx.quadraticCurveTo(cpX, cpY, pointB.x, pointB.y);
        } else {
          ctx.beginPath();
          ctx.moveTo(pointA.x, pointA.y);
          ctx.lineTo(pointB.x, pointB.y);
        }
        
        ctx.stroke();
        ctx.restore();
      }
    };
    
    // Animation loop
    const animate = () => {
      if (!canvas || !ctx) return;
      
      // Get canvas background color based on theme
      const bgColor = darkMode 
        ? 'rgba(17, 17, 17, 0.3)' // Dark mode
        : 'rgba(245, 245, 247, 0.3)'; // Light mode
        
      // Clear canvas with subtle trail effect
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Increment time for fluid movement
      timeRef.current += 0.005;
      const time = timeRef.current;
      
      // Get audio data if available (for reactivity)
      let audioIntensity = 0;
      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        const average = dataArrayRef.current.reduce((acc, val) => acc + val, 0) / dataArrayRef.current.length;
        audioIntensity = average / 255;
      }
      
      // Update connections
      if (Math.floor(time * 30) % 8 === 0) {
        updateConnections();
      }
      
      // First pass: draw connections
      liquidPointsRef.current.forEach((point) => {
        // Draw connections to other points
        point.connections.forEach(connIndex => {
          const connectedPoint = liquidPointsRef.current[connIndex];
          drawLiquidConnection(ctx, point, connectedPoint);
        });
      });
      
      // Second pass: draw points
      liquidPointsRef.current.forEach((point, index) => {
        // Animate point properties
        point.morphPhase += point.morphSpeed;
        
        // Apply liquid noise to position
        point.noiseOffsetX += 0.002;
        point.noiseOffsetY += 0.002;
        point.noiseOffsetZ += 0.002;
        
        const noise = liquidNoise(
          point.noiseOffsetX * 100, 
          point.noiseOffsetY * 100, 
          point.noiseOffsetZ * 100,
          point.distortStrength
        );
        
        // Apply noise and wave motion
        const timeFactor = time * 0.2;
        const indexOffset = index * 0.05;
        
        // Organic and liquid motion
        point.x = point.baseX + noise.nx * 70 * (1 + point.metallic * 0.5) + 
                 Math.sin(timeFactor + indexOffset) * 20 * point.distortStrength;
        point.y = point.baseY + noise.ny * 70 * (1 + point.metallic * 0.5) + 
                 Math.cos(timeFactor + indexOffset * 1.5) * 20 * point.distortStrength;
        point.z = point.baseZ + noise.nz * 3;
        
        // Slowly drift base positions
        point.baseX += point.vx;
        point.baseY += point.vy;
        point.baseZ += point.vz;
        
        // Smooth wraparound for continuous flow
        if (point.baseX < -100) point.baseX = canvas.width + 100;
        if (point.baseX > canvas.width + 100) point.baseX = -100;
        if (point.baseY < -100) point.baseY = canvas.height + 100;
        if (point.baseY > canvas.height + 100) point.baseY = -100;
        if (point.baseZ < -3) point.baseZ = 3;
        if (point.baseZ > 3) point.baseZ = -3;
        
        // Check if point is near mouse
        const dx = mousePosition.x - point.x;
        const dy = mousePosition.y - point.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Interact with mouse
        if (mouseActive && dist < 200) {
          const intensity = 1 - dist / 200;
          
          // Apply stronger repulsion for metallic points
          const repelForce = 0.4 * intensity * (1 + point.metallic * 0.8);
          point.x -= dx * repelForce;
          point.y -= dy * repelForce;
          
          // Increase metallic quality temporarily 
          point.metallic = Math.min(1, point.metallic + intensity * 0.3);
          
          // Temporarily increase morphing speed near mouse
          point.morphSpeed = point.morphSpeed * (1 + intensity * 0.5);
        }
        
        // Draw the liquid point with experimental styles
        drawLiquidShape(ctx, point);
      });
      
      // Request next frame
      requestRef.current = requestAnimationFrame(animate);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Start animation
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [mousePosition, mouseActive, darkMode]);
  
  // Track mouse position and activity
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setMouseActive(true);
      
      // Reset mouseActive after inactivity (4 seconds)
      clearTimeout(mouseActiveTimeout.current);
      mouseActiveTimeout.current = setTimeout(() => setMouseActive(false), 4000);
    };
    
    const mouseActiveTimeout = { current: setTimeout(() => {}, 0) as NodeJS.Timeout };
    clearTimeout(mouseActiveTimeout.current);
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(mouseActiveTimeout.current);
    };
  }, []);

  // Check if the user is on a mobile device
  useEffect(() => {
    const isMobileDevice = window.innerWidth <= 768;
    setShowMobileNotification(isMobileDevice);
    
    // Save to localStorage to remember dismissal between sessions
    const hasSeenNotification = localStorage.getItem('hasSeenMobileNotification');
    if (hasSeenNotification === 'true') {
      setShowMobileNotification(false);
    }
  }, []);
  
  const dismissNotification = () => {
    setShowMobileNotification(false);
    localStorage.setItem('hasSeenMobileNotification', 'true');
  };

  return (
    <div className={`home-container ${showMobileNotification ? 'has-notification' : ''}`}>
      {/* Mobile Notification Banner */}
      {showMobileNotification && (
        <div className="mobile-notification">
          <p>This website is optimized for desktop viewing. For the best experience, please visit on a computer.</p>
          <button onClick={dismissNotification} className="dismiss-btn">Dismiss</button>
        </div>
      )}
      
      <canvas ref={canvasRef} className="liquid-canvas"></canvas>
      
      <div className="content-wrapper">
        <section className="hero-section">
          <div className="light-art-wrapper">
            <LightArtBox />
          </div>
        </section>
        
        <section className="about-section">
          <div className="about-container">
            <div className="about-header">
              <h2 className="section-title">About Me</h2>
            </div>
            <div className="about-content">
              <div className="about-text">
                <p>Aalok Sud is a multidisciplinary artist based in Montreal, operating at the intersection of computational arts, creative coding, and graphic design. His practice investigates digital mediums through a methodical approach that emphasizes clarity, precision, and impact. While specializing in web and graphic design, Aalok explores node-based workflows to develop adaptable and scalable visual systems that respond to evolving creative challenges.</p>
                <p>Aalok's design philosophy navigates the tension between minimalism and focal complexity—where simplicity isn't the absence of detail but rather a deliberate method of control. He crafts experiences where strategic complexity creates moments of discovery within otherwise restrained compositions. Artistic impact drives his work, with functionality as its essential companion, resulting in tools and interfaces that are simultaneously expressive and utilitarian.</p>
                <p>Aalok creates for those who recognize machines as more than mere tools—who understand their potential as platforms for creative exploration and expression. By interrogating the relationship between human intention and computational processes, his work reveals new possibilities at the boundaries of digital aesthetics.</p>
              </div>
              <div className="about-skills">
                <div className="skill-category">
                  <h3>Design</h3>
                  <ul>
                    <li>UI/UX Design</li>
                    <li>Visual Design</li>
                    <li>Design Systems</li>
                    <li>Prototyping</li>
                  </ul>
                </div>
                <div className="skill-category">
                  <h3>Development</h3>
                  <ul>
                    <li>Frontend</li>
                    <li>Creative Coding</li>
                    <li>Interactive Media</li>
                    <li>Web Animation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home; 