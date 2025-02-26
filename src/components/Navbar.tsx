import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Handle menu toggle
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Close menu when changing route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <div className="logo-mark">B</div>
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
        
        <button className="menu-toggle" onClick={toggleMenu}>
          <div className={`menu-bar ${isMenuOpen ? 'open' : ''}`}></div>
        </button>
        
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <ul className="mobile-menu-links">
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
      </div>
    </nav>
  );
};

export default Navbar; 