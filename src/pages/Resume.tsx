import React, { useEffect, useRef } from 'react';
import '../styles/Resume.css';

const Resume: React.FC = () => {
  const resumeRef = useRef<HTMLDivElement>(null);

  // Add animation reveal effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal');
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const resumeItems = document.querySelectorAll('.resume-item');
    resumeItems.forEach((item) => {
      observer.observe(item);
    });

    return () => {
      resumeItems.forEach((item) => {
        observer.unobserve(item);
      });
    };
  }, []);

  return (
    <div className="resume-container" ref={resumeRef}>
      <h1 className="resume-title">Resume</h1>
      
      <section className="resume-section">
        <h2>Education</h2>
        <div className="resume-item">
          <h3>Bachelor of Design</h3>
          <div className="resume-meta">
            <span className="resume-date">2018 - 2022</span>
            <span className="resume-location">University Name</span>
          </div>
          <p className="resume-description">
            Description of education, achievements, and relevant coursework.
            This is placeholder text that will be replaced with actual content.
            The program focused on interactive design, typography, and motion graphics.
          </p>
        </div>
      </section>

      <section className="resume-section">
        <h2>Experience</h2>
        <div className="resume-item">
          <h3>Senior Designer</h3>
          <div className="resume-meta">
            <span className="resume-date">2022 - Present</span>
            <span className="resume-location">Company Name</span>
          </div>
          <p className="resume-description">
            Led design strategy for key client projects, creating innovative digital 
            experiences with a focus on aesthetics and usability. Collaborated with 
            cross-functional teams to deliver cohesive visual systems and interactive prototypes.
          </p>
        </div>
        
        <div className="resume-item">
          <h3>Junior Designer</h3>
          <div className="resume-meta">
            <span className="resume-date">2020 - 2022</span>
            <span className="resume-location">Company Name</span>
          </div>
          <p className="resume-description">
            Assisted senior team members with visual design tasks, created wireframes
            and mockups, and contributed to user interface development for web and mobile
            applications. Participated in client presentations and design critiques.
          </p>
        </div>
      </section>

      <section className="resume-section">
        <h2>Skills</h2>
        <div className="skills-grid">
          {[
            "UI/UX Design",
            "Adobe Creative Suite",
            "Figma",
            "Typography",
            "Branding",
            "Web Design",
            "Sketch",
            "Responsive Design"
          ].map((skill, index) => (
            <div className="skill-item" key={index}>
              {skill}
              <span className="skill-sigil"></span>
            </div>
          ))}
        </div>
      </section>

      <div className="resume-download">
        <button className="download-btn">Download Full Resume</button>
      </div>
    </div>
  );
};

export default Resume; 