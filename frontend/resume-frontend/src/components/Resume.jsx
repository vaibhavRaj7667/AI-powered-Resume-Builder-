import React, { useState, useRef } from 'react';

export default function Resume() {
  const resumeRef = useRef(null);

  // Personal Information State
  const [personalInfo, setPersonalInfo] = useState({
    name: "Vaibhav Raj",
    phone: "7667387499",
    email: "email id",
    linkedin: "linkedin",
    github: "github"
  });

  // Education State
  const [education, setEducation] = useState([
    {
      school: "Southwestern University",
      location: "Georgetown, TX",
      degree: "Bachelor of Arts in Computer Science, Minor in Business",
      date: "Aug. 2018 – May 2021"
    },
    {
      school: "Blinn College",
      location: "Bryan, TX",
      degree: "Associate's in Liberal Arts",
      date: "Aug. 2014 – May 2018"
    }
  ]);

  // Experience State
  const [experiences, setExperiences] = useState([
    {
      title: "Undergraduate Research Assistant",
      company: "Texas A&M University",
      location: "College Station, TX",
      date: "June 2020 – Present",
      responsibilities: [
        "Developed a REST API using FastAPI and PostgreSQL to store data from learning management systems",
        "Developed a full-stack web application using Flask, React, PostgreSQL and Docker to analyze GitHub data",
        "Explored ways to visualize GitHub collaboration in a classroom setting"
      ]
    },
    {
      title: "Information Technology Support Specialist",
      company: "Southwestern University",
      location: "Georgetown, TX",
      date: "Sep. 2018 – Present",
      responsibilities: [
        "Communicate with managers to set up campus computers used on campus",
        "Assess and troubleshoot computer problems brought by students, faculty and staff",
        "Maintain upkeep of computers, classroom equipment, and 200 printers across campus"
      ]
    },
    {
      title: "Artificial Intelligence Research Assistant",
      company: "Southwestern University",
      location: "Georgetown, TX",
      date: "May 2019 – July 2019",
      responsibilities: [
        "Explored methods to generate video game dungeons based off of The Legend of Zelda",
        "Developed a game in Java to test the generated dungeons",
        "Contributed 50K+ lines of code to an established codebase via Git",
        "Conducted a human subject study to determine which video game dungeon generation technique is enjoyable",
        "Wrote an 8-page paper and gave multiple presentations on-campus",
        "Presented virtually to the World Conference on Computational Intelligence"
      ]
    }
  ]);

  // Projects State
  const [projects, setProjects] = useState([
    {
      name: "Gitlytics",
      technologies: "Python, Flask, React, PostgreSQL, Docker",
      date: "June 2020 – Present",
      details: [
        "Developed a full-stack web application using with Flask serving a REST API with React as the frontend",
        "Implemented GitHub OAuth to get data from user's repositories",
        "Visualized GitHub data to show collaboration",
        "Used Celery and Redis for asynchronous tasks"
      ]
    },
    {
      name: "Simple Paintball",
      technologies: "Spigot API, Java, Maven, TravisCI, Git",
      date: "May 2018 – May 2020",
      details: [
        "Developed a Minecraft server plugin to entertain kids during free time for a previous job",
        "Published plugin to websites gaining 2K+ downloads and an average 4.5/5-star review",
        "Implemented continuous delivery using TravisCI to build the plugin upon new a release",
        "Collaborated with Minecraft server administrators to suggest features and get feedback about the plugin"
      ]
    }
  ]);

  // Skills State
  const [skills, setSkills] = useState({
    languages: "Python, C/C++, SQL (MySql), JavaScript, HTML/CSS",
    frameworks: "Django",
    tools: "Git and github",
    libraries: "pandas, NumPy, Matplotlib"
  });

  // Function to handle printing resume
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${personalInfo.name} - Resume</title>
          <style>
            @page {
              size: letter;
              margin: 0.5in;
            }
            
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.4;
              color: #000;
              margin: 0;
              padding: 0;
            }
            
            .resume-container {
              max-width: 100%;
              margin: 0;
              padding: 0;
            }
            
            .header {
              text-align: center;
              margin-bottom: 16px;
            }
            
            .header h1 {
              font-size: 20px;
              margin: 0 0 6px 0;
              font-weight: bold;
            }
            
            .contact-info {
              font-size: 12px;
              margin: 0;
            }
            
            .section {
              margin-bottom: 16px;
            }
            
            .section-title {
              font-size: 14px;
              font-weight: bold;
              margin: 0 0 8px 0;
              border-bottom: 1px solid #000;
              padding-bottom: 2px;
            }
            
            .entry {
              margin-bottom: 10px;
            }
            
            .job-title {
              font-weight: bold;
              margin-bottom: 2px;
            }
            
            .job-company-date {
              display: flex;
              justify-content: space-between;
              margin-bottom: 2px;
            }
            
            .job-company {
              display: flex;
            }
            
            .job-location {
              color: #000;
              margin-left: 6px;
            }
            
            ul {
              margin: 4px 0;
              padding-left: 20px;
            }
            
            li {
              margin-bottom: 3px;
              position: relative;
            }
            
            li:before {
              content: "•";
              position: absolute;
              left: -14px;
            }
            
            .project-header {
              display: flex;
              justify-content: space-between;
              font-weight: bold;
              margin-bottom: 4px;
            }
            
            .skill-label {
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          ${resumeRef.current.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Controls - will not be printed */}
      <div className="max-w-3xl mx-auto mb-6 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Resume Controls</h2>
        <button 
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Print Resume
        </button>
        <p className="mt-2 text-sm text-gray-600">
          Note: You can edit the resume data in the code to create your own custom resume.
        </p>
      </div>
      
      {/* Resume Preview */}
      <div className="max-w-3xl mx-auto bg-white shadow p-8">
        <div className="resume-container" ref={resumeRef}>
          {/* Header Section */}
          <div className="header">
            <h1>{personalInfo.name}</h1>
            <div className="contact-info">
              {personalInfo.phone} | {personalInfo.email} | {personalInfo.linkedin} | {personalInfo.github}
            </div>
          </div>

          {/* Education Section */}
          <div className="section">
            <h2 className="section-title">Education</h2>
            {education.map((edu, index) => (
              <div key={index} className="entry">
                <div className="flex justify-between">
                  <div>
                    <span className="font-bold">{edu.school}</span>
                    <span className="ml-2">{edu.location}</span>
                  </div>
                  <span>{edu.date}</span>
                </div>
                <div>{edu.degree}</div>
              </div>
            ))}
          </div>

          {/* Experience Section */}
          <div className="section">
            <h2 className="section-title">Experience</h2>
            {experiences.map((exp, index) => (
              <div key={index} className="entry">
                <div className="job-title">{exp.title}</div>
                <div className="job-company-date">
                  <div className="job-company">
                    {exp.company}
                    <span className="job-location">{exp.location}</span>
                  </div>
                  <div>{exp.date}</div>
                </div>
                <ul>
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Projects Section */}
          <div className="section">
            <h2 className="section-title">Projects</h2>
            {projects.map((project, index) => (
              <div key={index} className="entry">
                <div className="project-header">
                  <div>{project.name} | {project.technologies}</div>
                  <div>{project.date}</div>
                </div>
                <ul>
                  {project.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Skills Section */}
          <div className="section">
            <h2 className="section-title">Technical Skills</h2>
            <div>
              <span className="skill-label">Languages:</span> {skills.languages}
            </div>
            <div>
              <span className="skill-label">Frameworks:</span> {skills.frameworks}
            </div>
            <div>
              <span className="skill-label">Developer Tools:</span> {skills.tools}
            </div>
            <div>
              <span className="skill-label">Libraries:</span> {skills.libraries}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}