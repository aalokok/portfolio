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

// Import arkiv project images
import arkiv1 from '../assets/projects/arkiv/arkiv-1.png';
import arkiv2 from '../assets/projects/arkiv/arkiv-2.png';
import arkiv3 from '../assets/projects/arkiv/arkiv-3.png';
import arkiv4 from '../assets/projects/arkiv/arkiv-4.png';

// Define project structure
interface Project {
  id: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  tags: string[];
  images: string[];
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
      ]
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
        'https://images.unsplash.com/photo-1563330232-57114bb0823c?q=80&w=2070',
        'https://images.unsplash.com/photo-1558584673-c834fb1cc3ca?q=80&w=2070',
        'https://images.unsplash.com/photo-1607016284318-d1384f74e73f?q=80&w=2070'
      ]
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
      ]
    }
  ]);
  
  // State for filtering and project details
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [filteredImages, setFilteredImages] = useState<string[]>([]);
  
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
    
    // Add images to the container with varied sizes and controlled overlap
    filteredImages.forEach((imgSrc, index) => {
      const newImg = document.createElement("img");
      newImg.src = imgSrc;
      newImg.classList.add('wall-image-item');
      
      // Random size but smaller to allow for more images to be visible
      // Use smaller max dimensions to ensure images don't dominate the wall
      const maxWidth = randomIntFromInterval(120, 240); // Increased size range for larger images
      
      // Only set max-width, allowing images to maintain natural aspect ratio
      newImg.style.maxWidth = `${maxWidth}px`;
      newImg.style.maxHeight = `${maxWidth}px`; // Same as max-width for proportional constraint
      
      // Position within the visible container only
      const maxXPercentage = ((containerRect.width - maxWidth) / containerRect.width) * 100;
      const maxYPixels = containerRect.height - maxWidth;
      
      const xPos = randomIntFromInterval(0, Math.max(0, maxXPercentage));
      const yPos = randomIntFromInterval(0, Math.max(0, maxYPixels));
      
      newImg.style.left = `${xPos}%`;
      newImg.style.top = `${yPos}px`;
      
      // Vary z-index to create some layering
      newImg.style.zIndex = randomIntFromInterval(1, 5).toString();
      
      // Add click event to show project details
      newImg.addEventListener('click', () => {
        const projectForImage = findProjectByImage(imgSrc);
        if (projectForImage) {
          setSelectedProject(projectForImage);
          document.body.classList.add('modal-open');
        }
      });
      
      container.appendChild(newImg);
    });
  }, [filteredImages]);
  
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
  
  // Render project detail modal
  const renderProjectModal = () => {
    if (!selectedProject) return null;

    return (
      <motion.div
        className="project-detail-modal"
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
                <div key={index} className="gallery-image">
                  <img src={img} alt={`${selectedProject.title} - ${index + 1}`} loading="lazy" />
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
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`projects-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Filter toggle button */}
      <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
        <span className="filter-toggle-text">
          {showFilters ? 'Hide Filters' : 'Filter Projects'}
        </span>
        <span className="filter-toggle-icon">{showFilters ? '−' : '+'}</span>
        {activeFilters.length > 0 && (
          <span className="filter-count">{activeFilters.length}</span>
        )}
      </button>
      
      {/* Filter panel */}
      <div className={`filter-container ${showFilters ? 'visible' : 'collapsed'}`}>
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
    </div>
  );
};

export default Projects; 