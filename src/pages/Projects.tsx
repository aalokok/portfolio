import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Projects.css';

/**
 * Project Image Organization:
 * 
 * 1. Create a folder structure for your project images:
 *    /src
 *      /assets
 *        /projects
 *          /project-name-1
 *            - image1.jpg
 *            - image2.jpg
 *          /project-name-2
 *            - image1.jpg
 *            - image2.jpg
 * 
 * 2. Import images at the top of this file
 * 3. Use the imported images in your project data
 * 
 * For production with many images, consider:
 * - Using dynamic imports
 * - Using an image optimization service
 * - Implementing lazy loading for better performance
 */

// Import local project images
import bhag1 from '../assets/projects/bhag/bhag-1.png';
import bhag2 from '../assets/projects/bhag/bhag-2.png';
import bhag3 from '../assets/projects/bhag/bhag-3.png';
import bhag4 from '../assets/projects/bhag/bhag-4.png';

// Import visuals project images
import visuals1 from '../assets/projects/visuals/visuals-1.png';
import visuals2 from '../assets/projects/visuals/visuals-2.png';
import visuals3 from '../assets/projects/visuals/visuals-3.png';

// Import Follow Me Around project images
import fma1 from '../assets/projects/fma/fma-1.png';
import fma2 from '../assets/projects/fma/fma-2.png';

// Import Leave and Walk project media
import vid1 from '../assets/projects/vid/vid-1.gif';
import vid2 from '../assets/projects/vid/vid-2.gif';

// Import arkiv project images
import arkiv1 from '../assets/projects/arkiv/arkiv-1.png';
import arkiv2 from '../assets/projects/arkiv/arkiv-2.png';
import arkiv3 from '../assets/projects/arkiv/arkiv-3.png';
import arkiv4 from '../assets/projects/arkiv/arkiv-4.png';

// Import graphic design portfolio images
import graphic1 from '../assets/projects/graphic/graphic-1.png';
import graphic2 from '../assets/projects/graphic/graphic-2.png';
import graphic3 from '../assets/projects/graphic/graphic-3.png';
import graphic4 from '../assets/projects/graphic/graphic-4.png';
import graphic5 from '../assets/projects/graphic/graphic-5.png';

// Import soundmachine project images
import soundmachine1 from '../assets/projects/soundmachine/soundmachine-1.png';
import soundmachine2 from '../assets/projects/soundmachine/soundmachine-2.png';
import soundmachine3 from '../assets/projects/soundmachine/soundmachine-3.png';

// Import senses project media
import sensesGif from '../assets/projects/senses/senses-gif.gif';
import sensesImg from '../assets/projects/senses/senses-img.png';
import sensesImg2 from '../assets/projects/senses/senses-img2.png';

// Define project structure
interface Project {
  id: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  tags: string[];
  images: string[];
  projectUrl?: string; // Add optional project URL field
  githubUrl?: string; // Add optional GitHub URL field
}

declare global {
  interface Window {
    Rellax: any;
  }
}

const Projects: React.FC = () => {
  const themeContext = useContext(ThemeContext);
  const darkMode = themeContext ? themeContext.darkMode : false;
  const navigate = useNavigate();
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  // Project data
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'vid',
      title: 'Leave and Walk | Cinematic Exploration of Loneliness',
      category: 'Video Art',
      summary: 'An atmospheric video project visualizing the emotional experience of loneliness through urban wandering.',
      description: `"Leave and Walk" is a cinematic exploration of isolation and emotional detachment in urban environments. This video art project was conceived as a visual meditation on loneliness, using deliberate pacing, atmospheric lighting, and careful framing to convey the feeling of emotional isolation even within crowded spaces.

      Key aspects of the project include:
      • Atmospheric cinematography using natural light and shadow to enhance emotional states
      • Deliberate use of negative space and isolation of the subject within the frame
      • Ambient sound design layering urban noise with moments of stark silence
      • Long tracking shots following solitary movement through transitional spaces
      • Visual metaphors for disconnection and seeking
      • Minimal narrative structure allowing viewers to project their own experiences

      The project explores themes of urban alienation, the search for connection, and the paradox of feeling alone in populated environments. By focusing on the quieter, in-between moments of daily life, the work invites viewers to reflect on their own experiences of solitude and emotional distance.`,
      tags: ['Cinematography', 'Video Art', 'Atmospheric', 'Urban', 'Visual Storytelling', 'Mood Study'],
      images: [
        vid1,
        vid2
      ],
      projectUrl: 'https://youtu.be/De4JYjZhpn8'
    },
    {
      id: 'fma',
      title: 'Follow Me Around | Interactive Shape Follower',
      category: 'Interactive Web',
      summary: 'A playful web experiment where interactive shapes follow and respond to mouse movements.',
      description: `"Follow Me Around" is a simple yet engaging web-based interactive experiment that explores mouse-following behavior and user interaction.

      Key features include:
      • Responsive shape elements that dynamically follow mouse cursor movements
      • Click interactions that trigger visual and behavioral changes in the shapes
      • Smooth animation transitions between movement states
      • Minimalist design focusing on interaction over complex visuals
      • Built with vanilla JavaScript for optimal performance
      • Exploration of basic physics principles like inertia, attraction, and momentum

      This project was developed as an exercise in interactive web design, focusing on creating engaging user experiences with simple programming techniques. The experiment is hosted at Concordia University's hybrid server and demonstrates fundamentals of interactive motion design.`,
      tags: ['JavaScript', 'Interactive Design', 'Animation', 'Web Development', 'Motion Design'],
      images: [
        fma1,
        fma2
      ],
      projectUrl: 'https://hybrid.concordia.ca/aa_sud/cart351/act1/',
    },
    {
      id: 'visuals',
      title: 'Visuals | XR Social Media App',
      category: 'Interaction Design',
      summary: 'An XR social media application designed to let users create and discover location-based digital art in real-world spaces.',
      description: `Visuals is an XR social media application designed for my interaction design class, focused on bridging digital creativity with physical spaces.

      Key features include:
      • Location-based digital art creation and discovery
      • AR interface allowing users to draw or place images in real-world locations
      • Social features for sharing and discovering other users' creations
      • Interactive map showing hotspots of creative activity
      • Gamification elements encouraging exploration of new locations
      • Intuitive design with gesture-based controls for natural interaction

      The application was designed in Figma with a focus on user experience and interaction patterns that feel natural in an augmented reality context. The project involved extensive user research, wireframing, prototyping, and usability testing to create an engaging platform that encourages creative expression in public spaces.`,
      tags: ['Interaction Design', 'Figma', 'UX/UI', 'Augmented Reality', 'Social Media', 'Prototyping'],
      images: [
        visuals1,
        visuals2,
        visuals3
      ],
      projectUrl: 'https://figma.com/file/example/visuals'
    },
    {
      id: 'arkiv',
      title: 'ARKIV | Interactive Digital Archive Platform',
      category: 'Web Development',
      summary: 'A digital archive platform enabling users to share location-based stories through an interactive 3D globe interface.',
      description: `This full-stack web application was developed to create a digital archive platform that enables users to share location-based stories through an interactive 3D globe interface.

      Key features include:
      • Interactive 3D globe visualization built with Mapbox GL
      • Custom temporal connections between related markers for enhanced data context
      • Responsive dual-pane upload interface with real-time map marker placement
      • Cloud-based image storage integration
      • RESTful API endpoints for GeoJSON data storage and retrieval with MongoDB
      • Brutalist UI design with side-panel content display system
      • Cloudinary integration for optimized image management and delivery

      The platform was built using React for the frontend, Node.js and Express for the backend, and MongoDB for data storage. The interactive map visualization was implemented using Mapbox GL.`,
      tags: ['React', 'Node.js', 'MongoDB', 'Mapbox GL', 'RESTful API', 'Cloudinary', 'Full-Stack'],
      images: [
        arkiv1,
        arkiv2,
        arkiv3,
        arkiv4
      ],
      projectUrl: 'https://final351.onrender.com/',
      githubUrl: 'https://github.com/aalokok/Final351'
      
    },
    {
      id: 'soundmachine',
      title: '5oundmachine – Generative Sequencer & Sound Simulation',
      category: 'Audio Development',
      summary: 'A hybrid instrument combining sequencing, granular synthesis, and environmental effects.',
      description: `The 5oundmachine is a hybrid instrument developed in Max/MSP that combines sequencing capabilities with granular synthesis and environmental sound effects.

      Key features include:
      • Matrix-based sequencer with generative drum synthesis and granular playback
      • Environment simulation engine applying reverb, filtering, and spatial panning
      • Optimized polyphonic processing using poly~ and mc.pan~ for spatialization
      • Real-time controls for sequencing, sound textures, and environmental effects
      • Granular synthesis for complex sound design and texture creation

      The system was built using Max/MSP, focusing on creating a versatile tool for sound design and music production that bridges the gap between traditional sequencing and environmental sound simulation.`,
      tags: ['Max/MSP', 'Generative Audio', 'Granular Synthesis', 'Spatial Sound', 'Audio Design'],
      images: [
        soundmachine1,
        soundmachine2,
        soundmachine3
      ],
      projectUrl: 'https://cycling74.com/projects/example/soundmachine'
    },
    {
      id: 'bhag',
      title: 'Bhag Running Club Branding & Identity',
      category: 'Graphic Design',
      summary: 'A comprehensive brand identity for a running club, focused on minimalism and versatile graphics.',
      description: `This project involved the design of a complete brand identity for the Bhag Running Club, with a focus on creating a minimalist aesthetic that emphasizes resource retention and reusable graphics.

      Key aspects of the project include:
      • Logo design with variations for different applications and contexts
      • Development of a cohesive visual identity with bold typography
      • Creation of motion-inspired graphic elements reflecting movement and community
      • Design of versatile assets for both digital and print applications
      • Consistent color palette and design system to ensure brand recognition
      • Interactive design elements to enhance community engagement

      The brand identity was developed with a strong focus on minimalism while still creating a distinctive and recognizable visual language that captures the energy and community aspects of the running club.`,
      tags: ['Brand Identity', 'Graphic Design', 'Typography', 'Logo Design', 'Visual Design'],
      images: [
        bhag1,
        bhag2,
        bhag3,
        bhag4
      ],
      projectUrl: 'https://drive.google.com/file/d/1ROAwFFTWPYDw1UwrNTfRixxP8PYfVRhk/view?usp=sharing'
    },
    {
      id: 'graphic-portfolio',
      title: 'Design Retrospective | Mixed Media Collection',
      category: 'Graphic Design',
      summary: 'A curated collection of graphic design work spanning album covers, event flyers, posters, and experimental visual pieces.',
      description: `This portfolio showcases a diverse collection of graphic design work created over several years, spanning various mediums, styles, and purposes.

      Featured works include:
      • Album cover designs for independent musicians and record labels
      • Event flyers and promotional materials for concerts, exhibitions, and community events
      • Experimental typographic explorations and poster designs
      • Editorial layouts and magazine spreads
      • Digital illustrations and mixed-media compositions

      Each piece in this collection represents a unique challenge and creative approach, demonstrating versatility in style while maintaining a consistent quality and attention to detail. The works range from minimalist, typography-focused designs to complex, layered visual compositions that blend digital and analog techniques.

      Design tools used include Adobe Creative Suite (Photoshop, Illustrator, InDesign), Procreate, and various traditional media including hand-drawn illustrations, collage, and photography.`,
      tags: ['Album Cover Design', 'Typography', 'Editorial Design', 'Poster Design', 'Illustration', 'Mixed Media', 'Print Design'],
      images: [
        graphic1,
        graphic2,
        graphic3,
        graphic4,
        graphic5
      ],
      projectUrl: 'https://dribbble.com/example/portfolio'
    },
    {
      id: 'senses',
      title: 'Senses | Urban Nostalgia Short Film',
      category: 'Videography',
      summary: 'A stylized video montage inspired by Wong Kar Wai\'s cinematic aesthetics, exploring urban isolation and fleeting connections.',
      description: `"Senses" is a short video montage that pays homage to the distinctive visual style and atmosphere of Wong Kar Wai's "Fallen Angels," using similar cinematic techniques to create a mood-driven narrative.

      Notable elements include:
      • High-contrast color grading with saturated blues and reds
      • Experimental framing and composition techniques 
      • Use of step-printing and slow motion to create dreamlike sequences
      • Juxtaposition of urban environments and intimate character moments
      • Handheld camera work combined with static compositions
      • Evocative sound design complementing visual storytelling

      The project explores themes of urban isolation, nostalgia, and fleeting human connections through visual storytelling rather than traditional narrative structure. The piece demonstrates skill in cinematography, editing, and creating atmospheric visual experiences.`,
      tags: ['Cinematography', 'Film Editing', 'Visual Storytelling', 'Color Grading', 'Experimental', 'Motion Graphics'],
      images: [
        sensesGif,
        sensesImg,
        sensesImg2
      ],
      projectUrl: 'https://youtu.be/Q60RFNze0yU'
    }
  ]);
  
  // State for filtering and project details
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [filteredImages, setFilteredImages] = useState<string[]>([]);
  
  // Add state for fullscreen image viewing
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [fullscreenIndex, setFullscreenIndex] = useState<number>(0);
  
  // Extract all unique tags and create image array
  useEffect(() => {
    // Extract all unique tags
    const allTags = Array.from(
      new Set(projects.flatMap(project => project.tags))
    ).sort();
    setTags(allTags);
    
    // Collect all images
    const images: string[] = [];
    projects.forEach(project => {
      project.images.forEach(img => {
        images.push(img);
      });
    });
    
    setAllImages(images);
    setFilteredImages(images);
  }, [projects]);
  
  // Filter images based on active tags
  useEffect(() => {
    if (activeFilters.length === 0) {
      setFilteredImages(allImages);
      return;
    }
    
    const filtered: string[] = [];
    projects.forEach(project => {
      if (activeFilters.some(tag => project.tags.includes(tag))) {
        project.images.forEach(img => {
          filtered.push(img);
        });
      }
    });
    
    setFilteredImages(filtered);
  }, [activeFilters, allImages, projects]);
  
  // Create the dynamic image wall with DOM manipulation
  useEffect(() => {
    if (!imageContainerRef.current) return;
    
    // Clear previous images
    const container = imageContainerRef.current;
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    
    // Helper function for random integers
    const randomIntFromInterval = (min: number, max: number): number => {
      return Math.floor(Math.random() * (max - min + 1) + min);
    };
    
    // Calculate container dimensions - ensure images stay within viewport
    const containerRect = container.getBoundingClientRect();
    
    // Track placed images to manage overlap
    const placedImages: Array<{
      x: number,
      y: number,
      width: number,
      height: number,
      zIndex: number
    }> = [];
    
    // Randomize image order to ensure different layouts each time
    const randomizedImages = [...filteredImages];
    for (let i = randomizedImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomizedImages[i], randomizedImages[j]] = [randomizedImages[j], randomizedImages[i]];
    }
    
    // Function to check overlap percentage with existing images
    const getOverlapPercentage = (x: number, y: number, width: number, height: number) => {
      let maxOverlapPercentage = 0;
      
      for (const img of placedImages) {
        // Calculate overlap area
        const overlapX = Math.max(0, Math.min(x + width, img.x + img.width) - Math.max(x, img.x));
        const overlapY = Math.max(0, Math.min(y + height, img.y + img.height) - Math.max(y, img.y));
        const overlapArea = overlapX * overlapY;
        
        // Calculate percentage of this image that would be covered
        const thisImgArea = width * height;
        const overlapPercentage = (overlapArea / thisImgArea) * 100;
        
        maxOverlapPercentage = Math.max(maxOverlapPercentage, overlapPercentage);
      }
      
      return maxOverlapPercentage;
    };
    
    // Function to count how many images would overlap with this position
    const getOverlapCount = (x: number, y: number, width: number, height: number) => {
      let overlapCount = 0;
      
      for (const img of placedImages) {
        // Calculate overlap area
        const overlapX = Math.max(0, Math.min(x + width, img.x + img.width) - Math.max(x, img.x));
        const overlapY = Math.max(0, Math.min(y + height, img.y + img.height) - Math.max(y, img.y));
        const overlapArea = overlapX * overlapY;
        
        // Check if this image overlaps with the current position
        if (overlapArea > 0) {
          overlapCount++;
        }
      }
      
      return overlapCount;
    };
    
    // Function to find a good position with limited overlap
    const findGoodPosition = (width: number, height: number, maxAttempts = 30) => {
      let bestX = 0;
      let bestY = 0;
      let bestOverlap = 100; // Start with worst case
      
      // Create a grid of positions to try (more structured than pure random)
      const gridSize = 10;
      const xStep = (containerRect.width - width) / gridSize;
      const yStep = (containerRect.height - height) / gridSize;
      
      // Define a minimum Y position to ensure images start below the header
      // This accounts for the header height and filter panel if visible
      const headerHeight = showFilters ? 150 : 70; // Adjust these values based on your actual header heights
      const minYPosition = headerHeight;
      
      // Try maxAttempts random positions and pick the best one
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Mix of grid-based and random positioning for better distribution
        const useGrid = attempt < maxAttempts / 2;
        
        let x, y;
        if (useGrid) {
          // Grid-based position with some randomness
          const gridX = attempt % gridSize;
          const gridY = Math.floor(attempt / gridSize) % gridSize;
          x = (gridX * xStep) + randomIntFromInterval(-10, 10);
          // Ensure Y position starts below the header
          y = minYPosition + (gridY * yStep) + randomIntFromInterval(-10, 10);
        } else {
          // Pure random position
          x = randomIntFromInterval(0, Math.max(0, containerRect.width - width));
          // Ensure Y position starts below the header
          y = randomIntFromInterval(minYPosition, Math.max(minYPosition, containerRect.height - height));
        }
        
        // Ensure within bounds
        x = Math.max(0, Math.min(x, containerRect.width - width));
        y = Math.max(minYPosition, Math.min(y, containerRect.height - height));
        
        const overlapPercentage = getOverlapPercentage(x, y, width, height);
        
        // If we found a position with less than 50% overlap, use it immediately
        if (overlapPercentage < 50) {
          bestX = x;
          bestY = y;
          bestOverlap = overlapPercentage;
          
          // If very little overlap, no need to keep searching
          if (overlapPercentage < 20) {
            break;
          }
        }
        
        // Otherwise keep track of the best position found
        if (overlapPercentage < bestOverlap) {
          bestX = x;
          bestY = y;
          bestOverlap = overlapPercentage;
        }
      }
      
      return { x: bestX, y: bestY };
    };
    
    // Add images to the container with better distribution and limited overlap
    randomizedImages.forEach((imgSrc, index) => {
      const newImg = document.createElement("img");
      newImg.src = imgSrc;
      newImg.classList.add('wall-image-item');
      newImg.title = "Click to view details | Alt+Click for fullscreen";
      
      // Check if this image is a GIF file to make it larger
      const isGifFile = typeof imgSrc === 'string' && imgSrc.endsWith('.gif');
      
      // Special handling for GIF to ensure it loads properly
      if (isGifFile) {
        newImg.setAttribute('loading', 'eager');
        newImg.style.minWidth = '150px'; // Ensure GIF has minimum dimensions
        newImg.style.background = '#000'; // Dark background for GIF
      }
      
      // Set image dimensions - all project images get the same size range now
      const maxWidth = isGifFile
        ? randomIntFromInterval(260, 300) // Larger size for GIFs only
        : randomIntFromInterval(200, 260); // Standard size range for all other images
      
      // Only set max-width, allowing images to maintain natural aspect ratio
      newImg.style.maxWidth = `${maxWidth}px`;
      newImg.style.maxHeight = `${maxWidth}px`; // Same as max-width for proportional constraint
      
      // All images get same z-index range, no special priority
      const zIndex = randomIntFromInterval(1, 5);
      
      newImg.style.zIndex = zIndex.toString();
      
      // Find a good position with limited overlap
      const { x, y } = findGoodPosition(maxWidth, maxWidth);
      
      // Convert x position to percentage (better for responsive layout)
      const xPos = (x / containerRect.width) * 100;
      
      newImg.style.left = `${xPos}%`;
      newImg.style.top = `${y}px`;
      
      // Add this image to the placed images array for future overlap checks
      placedImages.push({
        x,
        y,
        width: maxWidth,
        height: maxWidth,
        zIndex
      });
      
      // Add click event to show project details or open fullscreen
      newImg.addEventListener('click', (e) => {
        const projectForImage = findProjectByImage(imgSrc);
        if (projectForImage) {
          // Check if user is pressing the Alt key for direct fullscreen
          if (e.altKey) {
            // Find the index of this image in the project
            const imgIndex = projectForImage.images.indexOf(imgSrc);
            if (imgIndex !== -1) {
              setSelectedProject(projectForImage);
              openFullscreenImage(imgSrc, imgIndex);
            }
          } else {
            setSelectedProject(projectForImage);
            document.body.classList.add('modal-open');
          }
        }
      });
      
      // Add the image to the container
      container.appendChild(newImg);
    });
  }, [filteredImages, showFilters]);
  
  // Find which project contains a specific image
  const findProjectByImage = (imageSrc: string): Project | null => {
    for (const project of projects) {
      if (project.images.includes(imageSrc)) {
        return project;
      }
    }
    return null;
  };
  
  // Toggle filter
  const toggleFilter = (tag: string) => {
    if (activeFilters.includes(tag)) {
      setActiveFilters(activeFilters.filter(t => t !== tag));
    } else {
      setActiveFilters([...activeFilters, tag]);
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setActiveFilters([]);
  };
  
  // Close project details
  const closeProjectDetails = () => {
    setSelectedProject(null);
    document.body.classList.remove('modal-open');
  };
  
  // Open fullscreen image
  const openFullscreenImage = (image: string, index: number) => {
    setFullscreenImage(image);
    setFullscreenIndex(index);
    document.body.classList.add('fullscreen-open');
  };
  
  // Close fullscreen image
  const closeFullscreenImage = () => {
    setFullscreenImage(null);
    document.body.classList.remove('fullscreen-open');
  };
  
  // Navigate to next image in fullscreen
  const nextFullscreenImage = () => {
    if (!selectedProject) return;
    
    const newIndex = (fullscreenIndex + 1) % selectedProject.images.length;
    setFullscreenIndex(newIndex);
    setFullscreenImage(selectedProject.images[newIndex]);
  };
  
  // Navigate to previous image in fullscreen
  const prevFullscreenImage = () => {
    if (!selectedProject) return;
    
    const newIndex = (fullscreenIndex - 1 + selectedProject.images.length) % selectedProject.images.length;
    setFullscreenIndex(newIndex);
    setFullscreenImage(selectedProject.images[newIndex]);
  };
  
  // Handle keyboard navigation for fullscreen mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (fullscreenImage) {
        if (e.key === 'Escape') {
          closeFullscreenImage();
        } else if (e.key === 'ArrowRight') {
          nextFullscreenImage();
        } else if (e.key === 'ArrowLeft') {
          prevFullscreenImage();
        }
      } else if (selectedProject && e.key === 'Escape') {
        closeProjectDetails();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenImage, fullscreenIndex, selectedProject]);
  
  // Generate a color for a tag based on its string
  const getTagColor = (tag: string) => {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Use HSL for better control of lightness for readability
    const h = hash % 360;
    
    return darkMode 
      ? `hsl(${h}, 60%, 70%)` // Lighter color for dark mode
      : `hsl(${h}, 60%, 40%)`; // Darker color for light mode
  };
  
  // Render fullscreen image viewer
  const renderFullscreenViewer = () => {
    if (!fullscreenImage) return null;
    
    return (
      <motion.div 
        className={`fullscreen-image-viewer ${darkMode ? 'dark-mode' : 'light-mode'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeFullscreenImage}
      >
        <div className="fullscreen-controls">
          <button className="fullscreen-close" onClick={closeFullscreenImage}>
            <span>×</span>
          </button>
          
          <div className="fullscreen-navigation">
            <button className="nav-arrow prev" onClick={(e) => { e.stopPropagation(); prevFullscreenImage(); }}>
              <span>‹</span>
            </button>
            <button className="nav-arrow next" onClick={(e) => { e.stopPropagation(); nextFullscreenImage(); }}>
              <span>›</span>
            </button>
          </div>
          
          {selectedProject && (
            <div className="image-counter">
              {fullscreenIndex + 1} / {selectedProject.images.length}
            </div>
          )}
          
          <div className="keyboard-navigation-help">
            <span>Use ← → keys to navigate • ESC to close</span>
          </div>
        </div>
        
        <div className="fullscreen-image-container" onClick={(e) => e.stopPropagation()}>
          <img 
            src={fullscreenImage} 
            alt={selectedProject ? `${selectedProject.title} - fullscreen view` : 'Fullscreen image'} 
            className="fullscreen-image"
          />
        </div>
      </motion.div>
    );
  };
  
  // Render project detail modal
  const renderProjectModal = () => {
    if (!selectedProject) return null;

    return (
      <motion.div 
        className={`project-detail-modal ${darkMode ? 'dark-mode' : 'light-mode'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className={`modal-content ${darkMode ? 'dark-mode' : 'light-mode'}`}>
          <button className="close-modal" onClick={closeProjectDetails} aria-label="Close project details">
            <span className="close-icon">×</span>
          </button>
          
          <div className="project-detail-header">
            <div className="title-category-wrapper">
              <h2>{selectedProject.title}</h2>
              <p className="project-category">{selectedProject.category}</p>
            </div>
            
            <div className="project-tags">
              {selectedProject.tags.map(tag => (
                <span 
                  key={tag} 
                  className="project-tag"
                  style={{ backgroundColor: `${getTagColor(tag)}20`, borderColor: getTagColor(tag) }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="project-content-layout">
            <div className="project-gallery">
              {selectedProject.images.map((img, index) => (
                <div 
                  key={index} 
                  className="gallery-image"
                  onClick={() => openFullscreenImage(img, index)}
                  title="Click to view in fullscreen"
                >
                  <img src={img} alt={`${selectedProject.title} - ${index + 1}`} loading="lazy" />
                  <div className="gallery-image-overlay">
                    <span className="fullscreen-icon">⤢</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="project-detail-text">
              <p className="project-summary">{selectedProject.summary}</p>
              <div className="project-description">
                {selectedProject.description.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph.trim()}</p>
                ))}
              </div>
              
              <div className="project-links">
                {/* View Project button - simplified */}
                {selectedProject.projectUrl && (
                  <a 
                    href={selectedProject.projectUrl} 
                    className="project-link-btn" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View Project →
                  </a>
                )}
                
                {/* View on GitHub button - simplified */}
                {selectedProject.githubUrl && (
                  <a 
                    href={selectedProject.githubUrl} 
                    className="project-link-btn github-btn" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View on GitHub →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`projects-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Filter toggle button */}
      <button className={`filter-toggle ${darkMode ? 'dark-mode' : 'light-mode'}`} onClick={() => setShowFilters(!showFilters)}>
        <span className="filter-toggle-text">
          {showFilters ? 'Hide Filters' : 'Filter Projects'}
        </span>
        <span className="filter-toggle-icon">{showFilters ? '−' : '+'}</span>
        {activeFilters.length > 0 && (
          <span className="filter-count">{activeFilters.length}</span>
        )}
      </button>
      
      {/* Filter panel */}
      <div className={`filter-container ${showFilters ? 'visible' : 'collapsed'} ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <h3 className="filter-title">Filter by technologies</h3>
        <div className="filter-tags">
          {tags.map(tag => (
            <button
              key={tag}
              className={`filter-tag ${activeFilters.includes(tag) ? 'active' : ''}`}
              style={{
                backgroundColor: activeFilters.includes(tag) 
                  ? getTagColor(tag) 
                  : 'transparent',
                borderColor: getTagColor(tag)
              }}
              onClick={() => toggleFilter(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        {activeFilters.length > 0 && (
          <button className="clear-filters" onClick={clearFilters}>
            Clear All Filters
          </button>
        )}
      </div>
      
      {/* Dynamic Image Wall Container */}
      <div className="image-wall-container">
        <div id="imgContainer" ref={imageContainerRef} className="image-container"></div>
      </div>
      
      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && renderProjectModal()}
      </AnimatePresence>
      
      {/* Fullscreen Image Viewer */}
      <AnimatePresence>
        {fullscreenImage && renderFullscreenViewer()}
      </AnimatePresence>
    </div>
  );
};

export default Projects; 