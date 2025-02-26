import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Resume from './pages/Resume';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

const App: React.FC = () => {
  // Custom cursor state
  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);
  
  // Intersection observer for fade-in animations
  const [observerReady, setObserverReady] = useState(false);
  
  // Track cursor position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    
    // Update cursor hover state
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHoverable = 
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') !== null || 
        target.closest('button') !== null ||
        target.classList.contains('hoverable');
      
      setIsHovering(isHoverable);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);
  
  // Apply cursor position with slight lag effect for the outline
  useEffect(() => {
    if (cursorDotRef.current) {
      cursorDotRef.current.style.transform = `translate(${cursorPosition.x}px, ${cursorPosition.y}px)`;
    }
    
    if (cursorOutlineRef.current) {
      // Add slight delay for trailing effect
      setTimeout(() => {
        if (cursorOutlineRef.current) {
          cursorOutlineRef.current.style.transform = `translate(${cursorPosition.x}px, ${cursorPosition.y}px)`;
        }
      }, 80);
    }
  }, [cursorPosition]);
  
  // Setup intersection observer for reveal animations
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });
    
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
      observer.observe(element);
    });
    
    setObserverReady(true);
    
    return () => {
      fadeElements.forEach(element => {
        observer.unobserve(element);
      });
    };
  }, [observerReady]);

  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Custom Cursor Elements */}
          <div 
            ref={cursorDotRef} 
            className={`cursor-dot ${isHovering ? 'active' : ''}`}
          ></div>
          <div 
            ref={cursorOutlineRef} 
            className={`cursor-outline ${isHovering ? 'active' : ''}`}
          ></div>
          
          {/* Metallic accent elements */}
          <div className="metal-accent top-right"></div>
          <div className="metal-accent bottom-left"></div>
          
          <Navbar />
          
          <main className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/resume" element={<Resume />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
