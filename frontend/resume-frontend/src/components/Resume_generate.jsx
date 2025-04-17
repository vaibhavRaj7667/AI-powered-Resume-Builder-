// Modified Resume_generate.jsx
import React, { useState, useRef } from "react";
import { Loader2, Copy, Download, FileDown } from "lucide-react";
import '../Css/generate.css';
import Resume from "./Resume";
import { topdf } from "dom-to-pdf"
import { jsPDF } from "jspdf"; // You'll need to install this: npm install jspdf
import html2canvas from "html2canvas"; // You'll need to install this: npm install html2canvas

export default function Resume_generate() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
    projects: "",
    jobDescription: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState("personal");
  const resumeRef = useRef(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Format data according to the API requirements
      const apiData = {
        user_data: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone || "",
          skills: formData.skills.split(',').map(skill => skill.trim()),
          experience: parseExperience(formData.experience),
          education: formData.education,
          projects: parseProjects(formData.projects),
        },
        job_description: formData.jobDescription
      };

      // API call with formatted JSON
      const response = await fetch('http://127.0.0.1:8000/generate/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(apiData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to generate resume: ${response.status}`);
      }
      
      // Parse JSON response
      const data = await response.json();
      
      // Process the response data
      if (data && data.resume && data.resume.content) {
        // Store the formatted resume data
        setResumeData(data.resume.content);
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error("Error generating resume:", error);
      alert("Failed to generate resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to parse experience text into the required format
  const parseExperience = (experienceText) => {
    // Simple parsing logic - you might need to adjust based on how users input data
    const experiences = [];
    
    // Split by double newlines to separate different jobs
    const experienceEntries = experienceText.split('\n\n');
    
    experienceEntries.forEach(entry => {
      if (entry.trim()) {
        const lines = entry.split('\n');
        const jobTitle = lines[0] || "Position";
        const company = lines[1] || "Company";
        const duration = lines[2] || "";
        
        const responsibilities = lines.slice(3).filter(line => line.trim());
        
        experiences.push({
          job_title: jobTitle,
          company: company,
          duration: duration,
          responsibilities: responsibilities
        });
      }
    });
    
    return experiences;
  };

  // Helper function to parse projects text into the required format
  const parseProjects = (projectsText) => {
    // Simple parsing logic - you might need to adjust based on how users input data
    const projects = [];
    
    // Split by double newlines to separate different projects
    const projectEntries = projectsText.split('\n\n');
    
    projectEntries.forEach(entry => {
      if (entry.trim()) {
        const lines = entry.split('\n');
        const title = lines[0] || "Project";
        
        // Remaining lines are the description
        const description = lines.slice(1).join(' ').trim();
        
        projects.push({
          title: title,
          description: description
        });
      }
    });
    
    return projects;
  };

  const downloadAsPDF = async () => {
    if (!resumeRef.current) return;
    
    try {
      // Set some styles to ensure the full content is captured
      const originalStyle = resumeRef.current.style.cssText;
      resumeRef.current.style.width = '210mm'; // A4 width
      resumeRef.current.style.margin = '0';
      resumeRef.current.style.padding = '10mm';
      
      // Get the height of the element
      const height = resumeRef.current.offsetHeight;
      const width = resumeRef.current.offsetWidth;
      
      // Create canvas with the right dimensions
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        width: width,
        height: height,
        windowWidth: width,
        windowHeight: height,
        scrollX: 0,
        scrollY: -window.scrollY // Important to capture the whole content
      });
      
      // Create PDF with proper dimensions
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Calculate dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add pages if the content spans multiple pages
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add new pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save the PDF
      pdf.save(`${resumeData.full_name || 'generated'}_resume.pdf`);
      
      // Restore original styles
      resumeRef.current.style.cssText = originalStyle;
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to download PDF. Please try again.");
    }
  };

  const handleResetForm = () => {
    setResumeData(null);
  };

  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  return (
    <div className="resume-generator">
      {!resumeData ? (
        <form onSubmit={handleSubmit} className="resume-form">
          <div className="accordion">
            <div className="accordion-item">
              <div 
                className={`accordion-trigger ${activeAccordion === "personal" ? "active" : ""}`}
                onClick={() => toggleAccordion("personal")}
              >
                Personal Information
                <span className="accordion-icon">{activeAccordion === "personal" ? "−" : "+"}</span>
              </div>
              {activeAccordion === "personal" && (
                <div className="accordion-content">
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="fullName">Full Name</label>
                      <input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john.doe@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="accordion-item">
              <div 
                className={`accordion-trigger ${activeAccordion === "experience" ? "active" : ""}`}
                onClick={() => toggleAccordion("experience")}
              >
                Experience & Education
                <span className="accordion-icon">{activeAccordion === "experience" ? "−" : "+"}</span>
              </div>
              {activeAccordion === "experience" && (
                <div className="accordion-content">
                  <div className="form-group">
                    <label htmlFor="experience">Work Experience</label>
                    <textarea
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="Format: Job Title
Company Name
Duration (e.g., 2020-2023)
Responsibility 1
Responsibility 2
Responsibility 3

Job Title 2
Company Name 2
Duration
Responsibility 1
Responsibility 2"
                      required
                    />
                    <small className="form-hint">Enter each job as a separate block with title, company, duration, and responsibilities on separate lines.</small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="education">Education</label>
                    <textarea
                      id="education"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      placeholder="BS in Computer Science, University Name"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="accordion-item">
              <div 
                className={`accordion-trigger ${activeAccordion === "skills" ? "active" : ""}`}
                onClick={() => toggleAccordion("skills")}
              >
                Skills & Projects
                <span className="accordion-icon">{activeAccordion === "skills" ? "−" : "+"}</span>
              </div>
              {activeAccordion === "skills" && (
                <div className="accordion-content">
                  <div className="form-group">
                    <label htmlFor="skills">Skills</label>
                    <textarea
                      id="skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="Python, Django, JavaScript, React, SQL, Git, AWS"
                      required
                    />
                    <small className="form-hint">Enter skills separated by commas.</small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="projects">Projects</label>
                    <textarea
                      id="projects"
                      name="projects"
                      value={formData.projects}
                      onChange={handleChange}
                      placeholder="Project Title 1
Project description goes here. Include technologies used and key features.

Project Title 2
Another project description."
                    />
                    <small className="form-hint">Enter each project as a separate block with title on first line and description following.</small>
                  </div>
                </div>
              )}
            </div>

            <div className="accordion-item">
              <div 
                className={`accordion-trigger ${activeAccordion === "job" ? "active" : ""}`}
                onClick={() => toggleAccordion("job")}
              >
                Target Job
                <span className="accordion-icon">{activeAccordion === "job" ? "−" : "+"}</span>
              </div>
              {activeAccordion === "job" && (
                <div className="accordion-content">
                  <div className="form-group">
                    <label htmlFor="jobDescription">Job Description</label>
                    <textarea
                      id="jobDescription"
                      name="jobDescription"
                      value={formData.jobDescription}
                      onChange={handleChange}
                      placeholder="Paste the job description you're targeting..."
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="loader-icon" />
                Generating Resume...
              </>
            ) : (
              "Generate Resume"
            )}
          </button>
        </form>
      ) : (
        <div className="resume-result">
          <div className="result-header">
            <h3>Generated Resume</h3>
            <div className="result-actions">
              <button className="action-button" onClick={downloadAsPDF}>
                <FileDown className="button-icon" />
                Download PDF
              </button>
            </div>
          </div>

          <div className="resume-card" ref={resumeRef}>
            <Resume data={resumeData} />
          </div>

          <button className="reset-button" onClick={handleResetForm}>
            Generate Another Resume
          </button>
        </div>
      )}
    </div>
  );
}