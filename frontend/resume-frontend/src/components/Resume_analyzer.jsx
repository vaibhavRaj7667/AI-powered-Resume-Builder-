import React, { useState } from 'react'
import axios from 'axios'

const Resume_analyzer = () => {

    const [resumeData, setResumeData] = useState({ resume_text: '', job_description: '' })
    const [data, setData] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/analyze/",
                {
                    resume_text: resumeData.resume_text,
                    job_description: resumeData.job_description
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setData(response.data); 
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space">
            <form onSubmit={handleSubmit}>
                <div className="resumeText">
                    <textarea
                        id="resume"
                        placeholder="Paste your resume content here"
                        value={resumeData.resume_text}
                        onChange={(e) => setResumeData({ ...resumeData, resume_text: e.target.value })}
                    />
                </div>

                <div className="jobDiscription">
                    <textarea
                        value={resumeData.job_description}
                        onChange={(e) => setResumeData({ ...resumeData, job_description: e.target.value })}
                    />
                </div>

                <button type="submit">Submit</button>
            </form>

            <div className="result">
                {data && (
                    <div>
                        <h3>ATS Score: {data.analysis.ats_score}</h3>
                        <div>
                            <h4>Missing Keywords:</h4>
                            <ul>
                                {data.analysis.missing_keywords.map((keyword, key) => (
                                    <li key={key}>{keyword}</li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4>Suggested Improvements:</h4>
                            <ul>
                                {data.analysis.suggested_improvements.map((suggestion, key) => (
                                    <li key={key}>{suggestion}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Resume_analyzer;
