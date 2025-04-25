import React, { use, useState } from 'react'
import axios from 'axios'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import '../Css/analyzer.css'
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import CircularProgress from '@mui/material/CircularProgress';
import {Upload} from'lucide-react'



const Resume_analyzer = () => {

    const [resumeData, setResumeData] = useState({ pdf_file: '', job_description: '' })
    const [data, setData] = useState(null)
    const [Loading, setLoading] = useState(false)

    const handelFileUploadButton = () => {
        const el = document.createElement('input');
        el.setAttribute('type', 'file');
        el.setAttribute('accept', 'application/pdf');
    
        el.addEventListener('change', (ev) => {
            if (el.files && el.files.length > 0) {
                const file = el.files.item(0);
                setResumeData(prev => ({ ...prev, pdf_file: file }));
            }
        });
    
        el.click();
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        try {
            
            setLoading(true)

            // const response = await axios.post(
            //     "http://127.0.0.1:8000/analyze/",
            //     {
            //         resume_text: resumeData.resume_text,
            //         job_description: resumeData.job_description
            //     },
            //     {
            //         headers: {
            //             Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            //             'Content-Type': 'application/json'
            //         }
            //     }
            // );



            const formData = new FormData();
            formData.append('pdf_file', resumeData.pdf_file);  // now it's a File object
            formData.append('job_description', resumeData.job_description);

            const response = await axios.post(
                "http://127.0.0.1:8000/analyze/",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setData(response.data); 

            

        } catch (error) {
            console.error(error);
        } finally{
            setLoading(false)
        }
    };

    return (
        <div className="space">
            <h1>Resume Analysis</h1>
            <p>Upload your resume and a job description to get an analysis of how well your resume matches the job requirements.</p>

            <form onSubmit={handleSubmit}>
                <div className='forms'>
                <div className="resumeText">
                    <p>Resume Content</p>

                    <div onClick={handelFileUploadButton} className="handeluploadbuttonclick">
                        <Upload className='Upload'/>
                        {resumeData.pdf_file && (
                            <p className="text-sm text-green-600 mt-1">Uploaded: {resumeData.pdf_file.name}</p>
                        )}

                    </div>
                    
                    {/* <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setResumeData({ ...resumeData, pdf_file: e.target.files[0] })}
                        
                    /> */}
                </div>

                <div className="jobDiscription">
                    <p>Job Description</p>
                    <textarea
                        value={resumeData.job_description}
                        onChange={(e) => setResumeData({ ...resumeData, job_description: e.target.value })}
                    />
                </div>
                </div>

                {Loading ? (
                    <Button 
                        style={{backgroundColor:'gray', color:'white'}}
                        variant="contained"
                        fullWidth
                        disabled
                    >
                        <CircularProgress color="inherit" size={20} />
                    </Button>
                    ) : (
                    <Button 
                        style={{backgroundColor:'#3b82f6', color:'white'}}
                        variant="contained"
                        fullWidth
                        type='submit'
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                    )}
            </form>

            
            <div className="result">
                {data && (
                    
                    <div>
                        <h3>ATS Score: {data.analysis.ats_score}</h3>
                        <Card sx={{ maxWidth: 345 }}>
                            <CardContent>
                                <div>
                                    <h4>Missing Keywords:</h4>
                                    <ul>
                                        {data.analysis.missing_keywords.map((keyword, key) => (
                                            <li key={key}>{keyword}</li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        <Card sx={{ maxWidth: 345 }}>
                            <CardContent>
                                <div>
                                    <h4>Suggested Improvements:</h4>
                                    <ul>
                                        {data.analysis.suggested_improvements.map((suggestion, key) => (
                                            <li key={key}>{suggestion}</li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Resume_analyzer;
