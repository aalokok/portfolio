import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const location = useLocation();
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  
  // Handle menu toggle
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Close menu when changing route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      
      // Make navbar visible at the top of the page or when menu is open
      if (currentScrollPos < 10 || isMenuOpen) {
        setIsVisible(true);
      } else {
        // Show/hide based on scroll direction
        setIsVisible(prevScrollPos > currentScrollPos);
      }
      
      setPrevScrollPos(currentScrollPos);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, isMenuOpen]);
  
  // Close menu when clicking outside or pressing escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Don't close when clicking on theme toggle
      if (isMenuOpen && 
          !target.closest('.navbar-container') && 
          !target.closest('.theme-toggle') && 
          !target.closest('.mobile-theme-toggle')) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (isMenuOpen && event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);
  
  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);
  
  return (
    <nav className={`navbar ${isMenuOpen ? 'menu-open' : ''} ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="navbar-container">
        <div className="navbar-title">
          <Link to="/">
            <span className="custom-name">aalok sud</span>
          </Link>
        </div>
        
        <div className="navbar-links-container">
          <ul className="navbar-links">
            <li className={location.pathname === '/' ? 'active' : ''}>
              <Link to="/">
                <span className="nav-number">01</span>
                <span className="nav-text">Work</span>
              </Link>
            </li>
            <li className={location.pathname === '/projects' ? 'active' : ''}>
              <Link to="/projects">
                <span className="nav-number">02</span>
                <span className="nav-text">Projects</span>
              </Link>
            </li>
            <li className={location.pathname === '/resume' ? 'active' : ''}>
              <Link to="/resume">
                <span className="nav-number">03</span>
                <span className="nav-text">Resume</span>
              </Link>
            </li>
          </ul>
        </div>
        
        <button 
          className="menu-toggle" 
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          title={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <div className={`menu-bar ${isMenuOpen ? 'open' : ''}`}></div>
        </button>
        
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <ul className="mobile-menu-links">
            <li className={location.pathname === '/' ? 'active' : ''}>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>
                <span className="nav-number">01</span>
                <span className="nav-text">Work</span>
              </Link>
            </li>
            <li className={location.pathname === '/projects' ? 'active' : ''}>
              <Link to="/projects" onClick={() => setIsMenuOpen(false)}>
                <span className="nav-number">02</span>
                <span className="nav-text">Projects</span>
              </Link>
            </li>
            <li className={location.pathname === '/resume' ? 'active' : ''}>
              <Link to="/resume" onClick={() => setIsMenuOpen(false)}>
                <span className="nav-number">03</span>
                <span className="nav-text">Resume</span>
              </Link>
            </li>
          </ul>
          
          {/* Theme toggle in mobile menu */}
          <div className="mobile-theme-toggle">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 