// Updated Resume.jsx
import React from 'react';
import '../Css/Resume.css';

const Resume = ({ data }) => {
  // If data is not provided, use default data
  const resumeData = data || {
    full_name: 'Alex Johnson',
    contact_info: [
      'alex.johnson@example.com',
      '(555) 123-4567',
      'https://linkedin.com/in/alexjohnson',
      'https://github.com/alexjohnson'
    ],
    summary: 'Results-driven Software Engineer with 3+ years of experience specializing in Python, Django, and React.js. Proven track record of delivering scalable web applications and optimizing system performance.',
    skills: {
      Languages: ['Python', 'JavaScript', 'TypeScript', 'HTML', 'CSS'],
      Frameworks: ['Django', 'Django REST Framework', 'React.js', 'Flask'],
      Developer_Tools: ['Git', 'Docker', 'AWS', 'Heroku', 'Jenkins'],
      Databases: ['PostgreSQL', 'MongoDB', 'Redis'],
      Testing: ['Jest', 'Pytest', 'Selenium']
    },
    experience: [
      {
        company: 'TechSolutions Inc.',
        title: 'Software Engineer',
        start_date: 'June 2021',
        end_date: 'Present',
        location: 'San Francisco, CA',
        achievements: [
          'Developed and maintained RESTful APIs using Django REST Framework, improving data retrieval speed by 40%.',
          'Implemented CI/CD pipelines using GitHub Actions, reducing deployment time by 60%.',
          'Optimized database queries, decreasing page load time by 35%.'
        ]
      },
      {
        company: 'InnovateTech',
        title: 'Software Development Intern',
        start_date: 'January 2021',
        end_date: 'May 2021',
        location: 'San Jose, CA',
        achievements: [
          'Collaborated with a team of 5 developers to create a customer management system.',
          'Implemented front-end features using React.js, improving user engagement by 25%.'
        ]
      }
    ],
    education: [
      {
        institution: 'University of Technology',
        degree: 'Bachelor of Science in Computer Science',
        graduation_date: 'May 2021',
        location: 'San Francisco, CA',
        gpa: '3.8/4.0'
      }
    ],
    projects: [
      {
        name: 'E-commerce Platform',
        description: 'Built a full-stack e-commerce application with Django and React.js',
        technologies: ['Django', 'React.js', 'PostgreSQL', 'AWS S3', 'Docker'],
        link: 'https://github.com/alexjohnson/ecommerce-platform'
      },
      {
        name: 'Task Management API',
        description: 'Developed a RESTful API for task management using Django REST Framework',
        technologies: ['Django REST Framework', 'JWT Authentication', 'PostgreSQL'],
        link: 'https://github.com/alexjohnson/task-api'
      }
    ]
  };

  // Format contact info to display properly
  const contactInfo = resumeData.contact_info || [];

  return (
    <div className="resume-container">
      <header className="resume-header">
        <h1>{resumeData.full_name}</h1>
        <div className="contact-info">
          {contactInfo.map((info, index) => (
            <span key={index}>
              {info}
              {index < contactInfo.length - 1 && " | "}
            </span>
          ))}
        </div>
      </header>

      {resumeData.summary && (
        <section className="resume-section">
          <h2>Professional Summary</h2>
          <p>{resumeData.summary}</p>
        </section>
      )}

      <section className="resume-section">
        <h2>Education</h2>
        {resumeData.education && resumeData.education.map((edu, index) => (
          <div key={index} className="education-item">
            <div className="edu-header">
              <div className="institution">{edu.institution}</div>
              <div className="location">{edu.location}</div>
            </div>
            <div className="edu-details">
              <div className="degree">{edu.degree}</div>
              <div className="date">{edu.graduation_date}</div>
              {edu.gpa && <div className="gpa">GPA: {edu.gpa}</div>}
            </div>
          </div>
        ))}
      </section>

      <section className="resume-section">
        <h2>Experience</h2>
        {resumeData.experience && resumeData.experience.map((exp, index) => (
          <div key={index} className="experience-item">
            <div className="exp-header">
              <div className="job-title">{exp.title}</div>
              <div className="date">{exp.start_date} - {exp.end_date}</div>
            </div>
            <div className="exp-subheader">
              <div className="company">{exp.company}</div>
              <div className="location">{exp.location}</div>
            </div>
            <ul className="achievements">
              {exp.achievements && exp.achievements.map((achievement, i) => (
                <li key={i}>{achievement}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="resume-section">
        <h2>Projects</h2>
        {resumeData.projects && resumeData.projects.map((project, index) => (
          <div key={index} className="project-item">
            <div className="project-header">
              <div className="project-name">{project.name}</div>
              {project.link && <div className="project-link">{project.link}</div>}
            </div>
            <div className="project-details">
              <p>{project.description}</p>
              {project.technologies && <p>Technologies: {project.technologies.join(', ')}</p>}
            </div>
          </div>
        ))}
      </section>

      <section className="resume-section">
        <h2>Technical Skills</h2>
        <div className="skills-container">
          {resumeData.skills && Object.entries(resumeData.skills).map(([category, skillList]) => (
            <div key={category} className="skill-category">
              <span className="skill-title">{category.replace('_', ' ')}:</span> {skillList.join(', ')}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Resume;