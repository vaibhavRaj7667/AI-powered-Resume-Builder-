import React, { useState } from 'react';
import '../Css/Home.css';
import Resume_analyzer from './Resume_analyzer';
import Resume_generate from './Resume_generate';
import { User, LogOut } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [resumeOption, setResumeOption] = useState('analyze');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate()
  const handleLogout = () => {
    try {
      axios.post('http://127.0.0.1:8000/logout/',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
        }
      )
      .then((res)=>{
        console.log(res.status)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      })
     
    } catch (error) {
      console.log(error)
    }
    navigate('/')
    
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">ResumeBuilder</div>
        <div className="nav-links">
          <button 
            className={`nav-btn ${resumeOption === 'analyze' ? 'active' : ''}`}
            onClick={() => setResumeOption('analyze')}
          >
            Analyze
          </button>
          <button 
            className={`nav-btn ${resumeOption === 'generate' ? 'active' : ''}`}
            onClick={() => setResumeOption('generate')}
          >
            Generate
          </button>
        </div>
        <div className="user-section">
          <div className="user-icon" onClick={() => setShowDropdown(!showDropdown)}>
            <User size={24} />
          </div>
          {showDropdown && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-header">
          <h1 className="title">Resume {resumeOption === 'analyze' ? 'Analysis' : 'Generator'}</h1>
          <p className="subtitle">
            {resumeOption === 'analyze' 
              ? 'Upload your resume for professional analysis' 
              : 'Create a professional resume in minutes'}
          </p>
        </div>
        
        {/* Component display based on selection */}
        <div className="component-container">
          {resumeOption === 'analyze' ? <Resume_analyzer /> : <Resume_generate />}
        </div>
      </div>
    </div>
  );
};

export default Home;