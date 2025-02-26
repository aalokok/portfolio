import React, { useContext, useState, useRef, useEffect } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import '../styles/LightArtBox.css';
import LiquidMetal from '../threeComponents/LiquidMetal';

const LightArtBox: React.FC = () => {
  const { darkMode } = useContext(ThemeContext);
  const [size, setSize] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate size based on viewport
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const newSize = Math.min(window.innerWidth * 0.7, window.innerHeight * 0.7);
        setSize(Math.floor(newSize)); // Use an integer value for better rendering
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    
    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);
  
  // Only render the Three.js component when we have a valid size
  return (
    <div className="light-art-container" ref={containerRef}>
      {size > 0 && <LiquidMetal darkMode={darkMode} size={size} />}
    </div>
  );
};

export default LightArtBox; 