import React, { useEffect, useRef, useState, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import '../styles/Projects.css';

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

// Define project structure
interface Project {
  id: number;
  title: string;
  category: string;
  summary: string;
  description: string;
  tags: string[];
  image: string;
}

const Projects: React.FC = () => {
  const { darkMode } = useContext(ThemeContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | undefined>(undefined);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const [mouseActive, setMouseActive] = useState(false);
  const liquidPointsRef = useRef<LiquidPoint[]>([]);
  const isInitializedRef = useRef(false);
  
  // Project state
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: "Generative Art Platform",
      category: "Web Application",
      summary: "Interactive platform for creating and sharing generative art using WebGL and Canvas APIs.",
      description: "This project is a comprehensive platform that enables artists and developers to create, showcase, and share generative art pieces. Built with React and TypeScript, it utilizes WebGL and Canvas APIs for rendering complex visual effects. The platform includes a custom visual programming interface that allows users to create art without writing code, as well as a code editor for more advanced users. Features include real-time collaboration, version control for artworks, and a community gallery where users can explore and interact with others' creations.",
      tags: ["React", "TypeScript", "WebGL", "Canvas", "Creative Coding"],
      image: "", // Placeholder for now
    },
    {
      id: 2,
      title: "Neural Network Visualizer",
      category: "Data Visualization",
      summary: "An interactive tool for visualizing neural network architecture and training process.",
      description: "The Neural Network Visualizer is a tool designed to make machine learning more accessible and understandable. It provides real-time visualizations of neural network architectures, allowing users to see how data flows through different layers and how weights are adjusted during training. Built with D3.js and TensorFlow.js, this application supports various network architectures and learning algorithms. Users can upload their own datasets or use pre-loaded examples to experiment with different network configurations and hyperparameters.",
      tags: ["JavaScript", "TensorFlow.js", "D3.js", "Machine Learning", "Data Visualization"],
      image: "", // Placeholder for now
    },
    {
      id: 3,
      title: "Ambient Music Generator",
      category: "Audio Application",
      summary: "Algorithm-based ambient music generator using Web Audio API and machine learning models.",
      description: "This application generates endless, non-repeating ambient music based on algorithmic composition techniques and machine learning models. It uses Web Audio API for sound synthesis and processing, with a custom-built sequencer that creates evolving musical patterns. The interface allows users to adjust various parameters such as tempo, tonality, density, and mood to shape the generated music. Additionally, users can record sessions and export them as high-quality audio files. The project also includes a collaborative mode where multiple users can join a session and influence the music generation together.",
      tags: ["JavaScript", "Web Audio API", "Machine Learning", "Music", "React"],
      image: "", // Placeholder for now
    },
    {
      id: 4,
      title: "Distributed File System",
      category: "System Design",
      summary: "A peer-to-peer distributed file system with encryption and fault tolerance features.",
      description: "This project implements a decentralized, peer-to-peer file storage and sharing system. Files are split into encrypted chunks and distributed across the network, ensuring data security and redundancy. The system includes a distributed hash table for efficient file lookup, a consensus mechanism for maintaining network integrity, and a self-healing process for recovering from node failures. Built with Rust for performance-critical components and Node.js for the network layer, the system prioritizes security, scalability, and fault tolerance. A web-based interface allows users to easily upload, manage, and share files across the network.",
      tags: ["Rust", "Node.js", "Distributed Systems", "Encryption", "P2P"],
      image: "", // Placeholder for now
    },
    {
      id: 5,
      title: "Augmented Reality Exhibition",
      category: "Interactive Installation",
      summary: "AR exhibition that overlays digital art on physical spaces using mobile devices.",
      description: "This augmented reality exhibition creates an immersive art experience by overlaying digital content onto physical spaces. Using WebXR and mobile device cameras, visitors can explore interactive digital artworks that respond to their movements and interactions. The project includes custom tracking algorithms for precise placement of digital objects, spatial audio that changes as users move through the space, and collaborative features that allow multiple visitors to interact with the same virtual elements simultaneously. The exhibition was displayed in three major cities, attracting over 10,000 visitors and receiving coverage in major technology and art publications.",
      tags: ["AR", "WebXR", "JavaScript", "Interactive Art", "Mobile"],
      image: "", // Placeholder for now
    },
    {
      id: 6,
      title: "Algorithmic Trading System",
      category: "Financial Technology",
      summary: "Automated trading system using statistical models and natural language processing.",
      description: "This algorithmic trading system combines statistical analysis with natural language processing to identify trading opportunities across financial markets. It processes market data and news in real-time, using custom-developed sentiment analysis algorithms to gauge market sentiment. The system implements various trading strategies, including mean reversion, momentum, and arbitrage, with risk management controls to limit exposure. Built with Python, it uses TensorFlow for predictive modeling and integrates with multiple exchange APIs for executing trades. A dashboard provides real-time performance metrics and allows for strategy adjustments without interrupting the system's operation.",
      tags: ["Python", "Machine Learning", "NLP", "Finance", "Data Analysis"],
      image: "", // Placeholder for now
    }
  ]);
  
  // State for expanded card
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  // State for active filters
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // Get all unique tags
  const allTags = Array.from(
    new Set(projects.flatMap(project => project.tags))
  ).sort();
  
  // Toggle a filter
  const toggleFilter = (tag: string) => {
    setActiveFilters(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  // Filter projects based on active filters
  const filteredProjects = activeFilters.length === 0
    ? projects
    : projects.filter(project => 
        activeFilters.some(filter => project.tags.includes(filter))
      );
  
  // Handle card expansion
  const toggleExpand = (id: number) => {
    setExpandedId(prev => prev === id ? null : id);
  };
  
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
    
    // Create grayscale color for points
    const createGrayscaleColor = (baseVal: number, a: number, metallic: number): string => {
      // For dark theme, lighter colors
      if (darkMode) {
        const grayValue = baseVal;
        const adjustedOpacity = a * (0.7 + metallic * 0.3);
        return `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${adjustedOpacity})`;
      } 
      // For light theme, darker colors
      else {
        const grayValue = baseVal;
        const adjustedOpacity = a * (0.6 + metallic * 0.4);
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
    
    // Update connections between points
    const updateConnections = () => {
      const points = liquidPointsRef.current;
      
      // Clear existing connections
      points.forEach(point => {
        point.connections = [];
      });
      
      // Connect points that are close to each other
      for (let i = 0; i < points.length; i++) {
        const pointA = points[i];
        
        // Determine number of connections to make
        const maxConnections = Math.floor(2 + pointA.metallic * 6);
        
        // Find closest points
        const candidates = [];
        
        for (let j = 0; j < points.length; j++) {
          if (i === j) continue;
          
          const pointB = points[j];
          const dx = pointB.x - pointA.x;
          const dy = pointB.y - pointA.y;
          const dz = pointB.z - pointA.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (distance < 240) {
            candidates.push({ index: j, distance });
          }
        }
        
        // Sort by distance and take the closest ones
        candidates.sort((a, b) => a.distance - b.distance);
        const connections = candidates.slice(0, maxConnections).map(c => c.index);
        
        // Update connections
        pointA.connections = connections;
      }
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
      }
      
      ctx.restore();
    };

    // Draw liquid connection with variable thickness and grayscale gradient
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
      
      // Helper function to determine if a color is in rgba format
      const isRgbaFormat = (color: string): boolean => {
        return color.startsWith('rgba') || color.startsWith('rgb');
      };
      
      // Parse color values
      let grayA = 0, grayB = 0;
      const colorMatchA = isRgbaFormat(pointA.color) ? pointA.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/) : null;
      const colorMatchB = isRgbaFormat(pointB.color) ? pointB.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/) : null;
      
      if (colorMatchA) grayA = parseInt(colorMatchA[1]);
      if (colorMatchB) grayB = parseInt(colorMatchB[1]);
      
      // Apply appropriate gradient based on theme
      const lightGrayA = darkMode ? Math.min(255, grayA + 30) : Math.max(0, grayA - 30);
      const lightGrayB = darkMode ? Math.min(255, grayB + 30) : Math.max(0, grayB - 30);
      
      gradient.addColorStop(0, `rgba(${lightGrayA}, ${lightGrayA}, ${lightGrayA}, ${lineOpacity})`);
      
      if ((pointA.metallic + pointB.metallic) / 2 > 0.5) {
        const midT = 0.4 + Math.sin(timeRef.current + pointA.morphPhase) * 0.1;
        gradient.addColorStop(midT, `rgba(180, 180, 180, ${lineOpacity * 1.2})`);
      }
      
      gradient.addColorStop(1, `rgba(${lightGrayB}, ${lightGrayB}, ${lightGrayB}, ${lineOpacity})`);
      
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

  return (
    <div className="projects-container">
      <canvas ref={canvasRef} className="liquid-canvas" />
      
      <div className="content-wrapper">
        <div className="projects-header">
          <h1 className="headline">Projects</h1>
          <div className="accent-bar"></div>
          <p className="projects-description">
            A selection of my creative coding experiments, interactive experiences, and design projects.
          </p>
          
          {/* Filter tags */}
          <div className="filter-container">
            <h3 className="filter-title">Filter by technology:</h3>
            <div className="filter-tags">
              {allTags.map(tag => (
                <button
                  key={tag}
                  className={`filter-tag ${activeFilters.includes(tag) ? 'active' : ''}`}
                  onClick={() => toggleFilter(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
            {activeFilters.length > 0 && (
              <button
                className="clear-filters"
                onClick={() => setActiveFilters([])}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
        
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className={`project-card ${expandedId === project.id ? 'expanded' : ''}`}
            >
              <div className="project-image"></div>
              <div className="project-content">
                <div className="project-number">0{project.id}</div>
                <h2>{project.title}</h2>
                <p className="project-category">{project.category}</p>
                
                {/* Tags for each project */}
                <div className="project-tags">
                  {project.tags.map(tag => (
                    <span key={`${project.id}-${tag}`} className="project-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <p className="project-summary">
                  {project.summary}
                </p>
                
                {/* Expanded content */}
                {expandedId === project.id && (
                  <div className="expanded-content">
                    <p className="project-description">{project.description}</p>
                  </div>
                )}
                
                <button 
                  className="project-btn"
                  onClick={() => toggleExpand(project.id)}
                >
                  {expandedId === project.id ? 'Collapse' : 'View Details'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProjects.length === 0 && (
          <div className="no-results">
            <p>No projects match the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects; 