import React from 'react';
import '../styles/Resume.css';

const Resume: React.FC = () => {
  return (
    <div className="resume-container">
      <h1 className="resume-title">Resume</h1>
      
      <section className="resume-section">
        <h2>Education</h2>
        <div className="resume-item">
          <h3>Bachelor of Design</h3>
          <p className="resume-date">2018 - 2022</p>
          <p className="resume-location">University Name</p>
          <p className="resume-description">
            Description of education, achievements, and relevant coursework.
            This is placeholder text that will be replaced with actual content.
          </p>
        </div>
      </section>

      <section className="resume-section">
        <h2>Experience</h2>
        <div className="resume-item">
          <h3>Senior Designer</h3>
          <p className="resume-date">2022 - Present</p>
          <p className="resume-location">Company Name</p>
          <p className="resume-description">
            Description of responsibilities and achievements in this role.
            This is placeholder text that will be replaced with actual content.
          </p>
        </div>
        
        <div className="resume-item">
          <h3>Junior Designer</h3>
          <p className="resume-date">2020 - 2022</p>
          <p className="resume-location">Company Name</p>
          <p className="resume-description">
            Description of responsibilities and achievements in this role.
            This is placeholder text that will be replaced with actual content.
          </p>
        </div>
      </section>

      <section className="resume-section">
        <h2>Skills</h2>
        <div className="skills-grid">
          <div className="skill-item">UI/UX Design</div>
          <div className="skill-item">Adobe Creative Suite</div>
          <div className="skill-item">Figma</div>
          <div className="skill-item">Typography</div>
          <div className="skill-item">Branding</div>
          <div className="skill-item">Web Design</div>
          <div className="skill-item">Sketch</div>
          <div className="skill-item">Responsive Design</div>
        </div>
      </section>

      <div className="resume-download">
        <button className="download-btn">Download Full Resume</button>
      </div>
    </div>
  );
};

export default Resume; 