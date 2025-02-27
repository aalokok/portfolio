import React, { useEffect, useRef } from 'react';
import '../styles/Resume.css';

const Resume: React.FC = () => {
  const resumeRef = useRef<HTMLDivElement>(null);

  // Optional animation effect
  useEffect(() => {
    // Add default reveal class to all elements to ensure visibility
    const allElements = document.querySelectorAll('.resume-item, .resume-section-title, .skill-category');
    allElements.forEach(item => {
      item.classList.add('reveal');
    });

    // Only setup intersection observer if we want animated reveals
    const enableAnimations = false; // Set to true to re-enable animations
    
    if (enableAnimations) {
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

      const resumeItems = document.querySelectorAll('.resume-item, .resume-section-title, .skill-category');
      resumeItems.forEach((item) => {
        observer.observe(item);
      });

      return () => {
        resumeItems.forEach((item) => {
          observer.unobserve(item);
        });
      };
    }
  }, []);
  
  // Handle download functionality
  const handleDownload = () => {
    if (resumeRef.current) {
      // Clone the resume content to modify it
      const resumeClone = resumeRef.current.cloneNode(true) as HTMLElement;
      
      // Find and remove the download button from the clone
      const downloadBtn = resumeClone.querySelector('.resume-download');
      if (downloadBtn) {
        downloadBtn.remove();
      }

      // Create a complete HTML document with styling
      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aalok Sud - Resume</title>
  <style>
    /* Include critical styles directly */
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: white;
      color: black;
      margin: 0;
      padding: 20px;
    }
    
    .resume-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .resume-content {
      display: grid;
      grid-template-columns: 3fr 2fr;
      gap: 30px;
    }
    
    .resume-section {
      margin-bottom: 30px;
    }
    
    .resume-section-title {
      font-size: 1.5rem;
      font-weight: 600;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
      margin-bottom: 15px;
    }
    
    .resume-item {
      margin-bottom: 20px;
    }
    
    .resume-item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      flex-wrap: wrap;
      margin-bottom: 5px;
    }
    
    .resume-details {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .resume-details li {
      position: relative;
      padding-left: 15px;
      margin-bottom: 5px;
    }
    
    .resume-details li::before {
      content: '—';
      position: absolute;
      left: 0;
    }
    
    .skills-section, .languages-section, .contact-section {
      background: #f8f8f8;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 15px;
      margin-bottom: 20px;
    }
    
    .skills-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 5px;
    }
    
    .languages-list, .contact-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    @media (max-width: 992px) {
      .resume-content {
        grid-template-columns: 1fr;
      }
      
      .skills-list {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    
    @media (max-width: 768px) {
      .skills-list {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (max-width: 480px) {
      .skills-list {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  ${resumeClone.outerHTML}
</body>
</html>
      `;
      
      // Create a blob with the HTML content
      const blob = new Blob([htmlContent], { type: 'text/html' });
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary anchor element and trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'aalok_sud_resume.html';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    }
  };

  return (
    <div className="resume-container" ref={resumeRef}>
      <div className="resume-header">
        <div className="personal-info">
          <h1 className="person-name">Aalok Sud</h1>
          <p className="person-location">Montreal, Canada</p>
        </div>
      </div>
      
      <div className="resume-content">
        <div className="resume-main">
          <section className="resume-section">
            <h2 className="resume-section-title">Education</h2>
            <div className="resume-item">
              <div className="resume-item-header">
                <h3>Bachelor of Computer Science</h3>
                <span className="resume-date">2022 - 2026</span>
              </div>
              <p className="resume-location">Joint Major in Computation Arts and Computer Science</p>
              <p className="resume-location">Concordia University</p>
              <ul className="resume-details">
                <li>Took courses in object-oriented programming, data structures, and computer networks</li>
                <li>Took a wholistic and art-oriented approach to computer science</li>
                <li>Explored topics in artificial intelligence, computer vision, and natural language processing</li>
                <li>Explored Computers as a medium for artistic expression</li>
              </ul>
            </div>
            
            <div className="resume-item">
              <div className="resume-item-header">
                <h3>Google UX Design Certificate</h3>
                <span className="resume-date">2023</span>
              </div>
              <p className="resume-location">Coursera</p>
              <ul className="resume-details">
                <li>Intensive 3-month program in UX design principles</li>
              </ul>
            </div>
          </section>

          <section className="resume-section">
            <h2 className="resume-section-title">Coursework</h2>
            <div className="resume-item">
              <ul className="resume-details">
                <li>Data Structures and Algorithms</li>
                <li>New Media Theory</li>
                <li>Visual Form and Communication</li>
                <li>Web Development for Designers</li>
                <li>Advanced Typography and Layout Design</li>
                <li>Advanced Program Design in C++</li>
                <li>Interaction Design</li>
                <li>Computer Graphics</li>
                <li>Digital Sound and Music</li>
              </ul>
            </div>
          </section>

          <section className="resume-section">
            <h2 className="resume-section-title">Experience</h2>
            <div className="resume-item">
              <div className="resume-item-header">
                <h3>Operations Team Member</h3>
                <span className="resume-date">January 2023 - April 2024</span>
              </div>
              <p className="resume-location">Computation Arts Student Association</p>
              <ul className="resume-details">
                <li>One of the Founding members of the association</li>
                <li>Handled events, fundraisers, and other operations</li>
                <li>Represented the association at events and meetings</li>
              </ul>
            </div>
             <div className="resume-item">
              <div className="resume-item-header">
                <h3>Design Intern</h3>
                <span className="resume-date">April 2020 - December 2020</span>
              </div>
              <p className="resume-location">Downspree</p>
              <ul className="resume-details">
                <li>Made graphics for Clothing, Designed a collection from scratch, Made current trend influenced graphics</li>
                <li>Created mockups and prototypes for clothing</li>
                <li>Participated in client meetings and presentations</li>
              </ul>
            </div>
          </section>

          <section className="resume-section">
            <h2 className="resume-section-title">Projects</h2>
            <div className="resume-item">
              <div className="resume-item-header">
                <h3><a href="https://final351.onrender.com/" target="_blank" rel="noopener noreferrer">ARKIV</a> | Interactive Digital Archive Platform</h3>
                <span className="resume-date">December 2024</span>
                <li>Full-Stack Web Application | React, Node.js, MongoDB, Mapbox GL</li>
              </div>
              <ul className="resume-details">
                <li>Developed a digital archive platform enabling users to share location-based stories through an interactive 3D globe interface</li>
                <li>Implemented custom Mapbox GL visualization with temporal connections between related markers, enhancing data context</li>
                <li>Built responsive dual-pane upload interface with real-time map marker placement and cloud-based image storage</li>
                <li>Created RESTful API endpoints to handle GeoJSON data storage and retrieval from MongoDB</li>
                <li>Designed a brutalist UI with side-panel content display system for seamless user interaction</li>
                <li>Integrated Cloudinary for optimized image management and delivery</li>
              </ul>
            </div>
            <div className="resume-item">
              <div className="resume-item-header">
                <h3>5oundmachine – Generative Sequencer & Sound Simulation</h3>
                <span className="resume-date">December 2024</span>
                <li>Max/MSP | Generative Audio | Granular Synthesis | Spatial Sound</li>
              </div>
              <ul className="resume-details">
                <li>Developed a hybrid instrument combining sequencing, granular synthesis, and environmental effects</li>
                <li>Designed a matrix-based sequencer with generative drum synthesis and granular playback</li>
                <li>Built an environment simulation engine applying reverb, filtering, and spatial panning</li>
                <li>Optimized polyphonic processing using poly~ and mc.pan~ for spatialization</li>
                <li>Integrated real-time controls for sequencing, sound textures, and environmental effects</li>
              </ul>
            </div>
    
            <div className="resume-item">
              <div className="resume-item-header">
                <h3>Bhag Running Club Branding & Identity</h3>
                <span className="resume-date">June 2024</span>
              </div>
              <ul className="resume-details">
                <li>Designed the logo and full branding for a running club, emphasizing minimalism, resource retention, and reusable graphics</li>
                <li>Developed a cohesive visual identity incorporating bold typography and motion-inspired elements to reflect movement and community</li>
                <li>Created versatile assets for both digital and print applications, ensuring consistency and adaptability</li>
                <li>Focused on interactive and engaging design to enhance the club's presence and appeal to a diverse running community</li>
              </ul>
            </div>
          </section>
        </div>
        
        <div className="resume-sidebar">
          <section className="resume-section skills-section">
            <h2 className="resume-section-title">Skills</h2>
            
            <div className="skill-category">
              <h3>Design</h3>
              <ul className="skills-list">
                <li>UI/UX Design</li>
                <li>Graphic Design</li>
                <li>Motion Graphics</li>
                <li>3D Design</li>
                <li>Video Editing</li>
                <li>Typography</li>
                <li>Visual Design</li>
                <li>Brand Identity</li>
                <li>Prototyping</li>
                <li>Wireframing</li>
              </ul>
            </div>
            
            <div className="skill-category">
              <h3>Technical</h3>
              <ul className="skills-list">
                <li>Figma</li>
                <li>Adobe Creative Suite</li>
                <li>Blender</li>
                <li>Unity</li>
                <li>Unreal Engine</li>
                <li>MAX/MSP/Jitter</li>
                <li>TouchDesigner</li>
                <li>HTML/CSS</li>
                <li>JavaScript</li>
                <li>React, nodeJS, Express, MongoDB</li>
                <li>Python, C++, C#</li>
                <li>Java</li>
                <li>Git</li>
              </ul>
            </div>
            
            <div className="skill-category">
              <h3>Soft Skills</h3>
              <ul className="skills-list">
                <li>Problem Solving</li>
                <li>Communication</li>
                <li>Collaboration</li>
                <li>Time Management</li>
                <li>Adaptability</li>
              </ul>
            </div>
          </section>
          
          <section className="resume-section languages-section">
            <h2 className="resume-section-title">Languages</h2>
            <ul className="languages-list">
              <li>
                <span className="language-name">English</span>
                <span className="language-level">Native</span>
              </li>
              <li>
                <span className="language-name">French</span>
                <span className="language-level">Working Proficiency</span>
              </li>
              <li>
                <span className="language-name">Hindi</span>
                <span className="language-level">Native</span>
              </li>
            </ul>
          </section>
          
          <section className="resume-section contact-section">
            <h2 className="resume-section-title">Contact</h2>
            <ul className="contact-list">
              <li>
                <span className="contact-label">Email</span>
                <span className="contact-value">
                  <a href="mailto:sudaalok@gmail.com" className="contact-link">
                    sudaalok@gmail.com
                  </a>
                </span>
              </li>
              <li>
                <span className="contact-label">Portfolio</span>
                <span className="contact-value">
                  <a href="https://aaloksud.onrender.com/" className="contact-link" target="_blank" rel="noopener noreferrer">
                    aaloksud.onrender.com
                  </a>
                </span>
              </li>
              <li>
                <span className="contact-label">LinkedIn</span>
                <span className="contact-value">
                  <a href="https://www.linkedin.com/in/aalok-sud-0a35561a9/" className="contact-link" target="_blank" rel="noopener noreferrer">
                    https://www.linkedin.com/in/aalok-sud
                  </a>
                </span>
              </li>
            </ul>
          </section>
        </div>
      </div>
      
      <div className="resume-download">
        <button className="download-btn" onClick={handleDownload}>Download Resume</button>
      </div>
    </div>
  );
};

export default Resume; 