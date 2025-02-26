import React from 'react';
import '../styles/Projects.css';

const Projects: React.FC = () => {
  return (
    <div className="projects-container">
      <h1 className="projects-title">My Projects</h1>
      <p className="projects-description">
        Here's a collection of some of my recent work. Each project represents a unique challenge and creative solution.
      </p>

      <div className="projects-grid">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div key={num} className="project-card">
            <div className="project-image"></div>
            <div className="project-content">
              <h2>Project {num}</h2>
              <p className="project-category">Category</p>
              <p className="project-summary">
                This is a placeholder description for the project. It will be replaced with actual content later.
                The description provides a brief overview of the project, its goals, and the outcome.
              </p>
              <button className="view-project-btn">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects; 