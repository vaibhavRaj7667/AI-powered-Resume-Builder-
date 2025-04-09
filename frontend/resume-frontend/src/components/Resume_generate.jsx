
import React, { useState } from "react";
import { Loader2, Copy, Download } from "lucide-react";
import '../Css/generate.css'

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
  const [generatedResume, setGeneratedResume] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState("personal");
  
  // You would typically get this from your authentication system


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
      
      // Extract the optimized_content from the response format
      if (data && data.resume && data.resume.optimized_content) {
        try {
          // Parse the nested JSON string in optimized_content
          const parsedContent = JSON.parse(data.resume.optimized_content);
          
          // Extract the actual resume content
          if (parsedContent && parsedContent.content) {
            setGeneratedResume(parsedContent.content);
          } else {
            throw new Error('Content not found in parsed optimized_content');
          }
        } catch (parseError) {
          console.error("Error parsing optimized_content:", parseError);
          
          // Fallback: try to extract content directly if JSON parsing fails
          // This assumes optimized_content might be a string with escaped quotes
          const contentMatch = data.resume.optimized_content.match(/'content': '(.+?)(?='\})/s);
          if (contentMatch && contentMatch[1]) {
            // Unescape the content string
            const unescapedContent = contentMatch[1].replace(/\\'/g, "'").replace(/\\n/g, "\n");
            setGeneratedResume(unescapedContent);
          } else {
            throw new Error('Could not extract content from optimized_content');
          }
        }
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

  const copyToClipboard = () => {
    if (generatedResume) {
      navigator.clipboard.writeText(generatedResume);
    }
  };

  const downloadResume = () => {
    if (generatedResume) {
      const element = document.createElement("a");
      const file = new Blob([generatedResume], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = "generated-resume.md";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  return (
    <div className="resume-generator">
      {!generatedResume ? (
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
              <button className="action-button" onClick={copyToClipboard}>
                <Copy className="button-icon" />
                Copy
              </button>
              <button className="action-button" onClick={downloadResume}>
                <Download className="button-icon" />
                Download
              </button>
            </div>
          </div>

          <div className="resume-card">
            <div className="resume-content markdown-content">
              {generatedResume}
            </div>
          </div>

          <button className="reset-button" onClick={() => setGeneratedResume(null)}>
            Generate Another Resume
          </button>
        </div>
      )}
    </div>
  );
}