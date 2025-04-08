import React, { useEffect, useState } from 'react';
import '../Css/Home.css'

const Home = () => {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const formatText = (text) => {
   
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
    
    formatted = formatted.replace(/^\* (.*)$/gm, '<li>$1</li>');
  
   
    if (formatted.includes('<li>')) {
      formatted = `<ul>${formatted}</ul>`;
    }
  
    
    formatted = formatted.replace(/\n/g, '<br/>');
  
    return { __html: formatted };
  };
  

  useEffect(() => {
    fetch('http://127.0.0.1:8000/optimize/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setResumeData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching resume data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!resumeData) return <p>No data available</p>;

  return (
    <div>
      <h2>Missing Keywords</h2>
      <ul>
        {resumeData.missing_keywords.map((keyword, index) => (
          <li key={index}>{keyword}</li>
        ))}
      </ul>

      <h2>Suggested Improvements</h2>
      <div>
        {resumeData.suggested_improvements.map((point, index) => (
          <p key={index} dangerouslySetInnerHTML={formatText(point)} />
        ))}
      </div>

      <p><strong>ATS Score:</strong> {resumeData.ats_score}</p>
    </div>
  );
};

export default Home;
