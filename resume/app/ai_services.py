# app/ai_services.py
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser, PydanticOutputParser
from django.conf import settings
import spacy
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from langchain_core.output_parsers import JsonOutputParser

nlp = spacy.load("en_core_web_sm")

class Education(BaseModel):
    institution: str= Field(..., description="Name of the education institution")
    degree: str = Field(...,description="Degree obtained or in progress")
    graduation_date: str = Field(...,description="Graduation date or expected graduction date")
    location: Optional[str]= Field(None, description="Loaction of the institution")
    gpa: Optional[str]=Field(None, description="GPA if available")

class Experience(BaseModel):
    company: str= Field(description="company name")
    title: str = Field(description="Job title")
    start_date: str= Field(description="strat date of the employment")
    end_date: Optional[str] = Field(None,description="End date of the employmet or 'present'")
    location: Optional[str] = Field(None, description="Job location")
    achievements: List[str] = Field(description="List of achievements and responsibilities with quantifiable results")

class Project(BaseModel):
    name: str= Field(description="project name")
    description: str = Field(description="Brief description of the project")
    technologies: list[str]= Field(description="Technologies used in the project")
    link: Optional[str] = Field(None, description="github link of the project")
    live: Optional[str]= Field(None, description="live link of the project")

class Skills(BaseModel):
    Languages: List[str] = Field(..., description="List of programming languages")
    Frameworks: Optional[List[str]] = Field(None, description="List of frameworks")
    Developer_Tools: Optional[List[str]] = Field(None, description="List of developer tools")
    Libraries: Optional[List[str]] = Field(None, description="List of libraries")

class Resume(BaseModel):
    full_name: str = Field(description="Full name of the candidate")
    contact_info: list[str]= Field(description="contact information including email, phone , link, github")  
    summary: str = Field(description="professional summary tailored to the job")
    skill: list[Skills] = Field(description="list of all skills have")
    experience: Optional[list[Experience]] = Field(description="Professional experience")
    education: list[Education] = Field(None, description="Educational background")
    projects: list[Project] = Field(description="Relevant projects")
    


class ResumeAnalyzer:
    def __init__(self):
        # Initialize Gemini LLM
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            temperature=0.7,
            google_api_key=settings.GOOGLE_API_KEY,
           
        )
        self.output_parser = StrOutputParser()

    def analyze_resume_content(self, resume_text: str, job_description: str) -> dict:
        #"""Analyze resume using LangChain pipeline with Gemini"""

        try:
            # Extract keywords
            job_keywords = self._extract_keywords(job_description)
            resume_keywords = self._extract_keywords(resume_text)
            
            # Calculate ATS score
            ats_score = self._calculate_ats_score(resume_text, job_description)
            
            # Get AI suggestions
            suggestions = self._get_ai_suggestions(resume_text, job_description)
            
            # Optimize resume
            # optimized_content = self._optimize_resume(resume_text, job_description)
            
            return {
                'missing_keywords': list(set(job_keywords) - set(resume_keywords)),
                'suggested_improvements': suggestions,
                'ats_score': round(ats_score * 100, 2),
                # 'optimized_content': optimized_content,
                'status': 'success'
            }
            
        except Exception as e:
            return {'status': 'error', 'message': str(e)}
        
    def improve_generate_resume(self, user_data: dict, query: str)->dict:
        
        try:

            prompt = ChatPromptTemplate.from_template("""
                    ("system", "You are a professional resume writer and AI assistant specialized in creating ATS-optimized resumes and optmizing"),
                    ("human", "from the given query or user_data below improved that only part of the resume section,
                    
                    Requirements:        
                                                                    
                    Do not invent or add any skills, projects, experiences, or details that are not present in the user data.
                    Tailor and rephrase existing content to align with the job description, using relevant keywords and improving weak or generic sentences.
                    Write a concise and impactful "About Me" section (2–3 lines) that reflects the user's actual skills, achievements, and projects.
                    Use a clean, professional layout with clearly labeled sections: About Me, Experience, Projects, Skills, Education, etc.
                    Use bullet points for clarity under each section.
                    Skip any section if the user data does not contain relevant information.
                    
                    Format your output as a valid JSON object with the following structure:
                    {{
                        "full_name": "Candidate's full name",
                        "contact_info": ["email", "phone", "linkedin", "github"],
                        "summary": "Professional summary tailored to the job",
                        "skills": {{
                            "Languages": ["language1", "language2"],
                            "Frameworks": ["framework1", "framework2"],
                            "Developer_Tools": ["tool1", "tool2"],
                            "Libraries": ["library1", "library2"]
                        }},
                        "experience": [
                            {{
                                "company": "Company name",
                                "title": "Job title",
                                "start_date": "Start date",
                                "end_date": "End date or 'present'",
                                "location": "Job location",
                                "achievements": ["achievement1", "achievement2"]
                            }}
                        ],
                        "education": [
                            {{
                                "institution": "Name of institution",
                                "degree": "Degree obtained",
                                "graduation_date": "Graduation date",
                                "location": "Location",
                                "gpa": "GPA if available"
                            }}
                        ],
                        "projects": [
                            {{
                                "name": "Project name",
                                "description": "Project description",
                                "technologies": ["tech1", "tech2"],
                                "link": "GitHub link",
                                "live": "Live link"
                            }}
                        ]
                    }}

                    User Data:
                    {user_data}

                    user Query:
                    {query}")
                    """)

            chain = prompt | self.llm | JsonOutputParser()
                
            result = chain.invoke({
                "query": query,
                "user_data": str(user_data)
            })
            
            return {'status': 'success', 'content': result}
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    def generate_resume(self, user_data: dict, job_description: str) -> dict:
        #"""Generate resume using Gemini"""

        try:
            prompt = ChatPromptTemplate.from_template("""
        ("system", "You are a professional resume writer and AI assistant specialized in creating ATS-optimized resumes"),
        ("human", "Generate a professionally formatted, ATS-friendly resume using only the information provided in the user data and job description below.

        Requirements:

        Do not invent or add any skills, projects, experiences, or details that are not present in the user data.
        Tailor and rephrase existing content to align with the job description, using relevant keywords and improving weak or generic sentences.
        Write a concise and impactful "About Me" section (2–3 lines) that reflects the user's actual skills, achievements, and projects.
        Use a clean, professional layout with clearly labeled sections: About Me, Experience, Projects, Skills, Education, etc.
        Use bullet points for clarity under each section.
        Skip any section if the user data does not contain relevant information.
        
        Format your output as a valid JSON object with the following structure:
        {{
            "full_name": "Candidate's full name",
            "contact_info": ["email", "phone", "linkedin", "github"],
            "summary": "Professional summary tailored to the job",
            "skills": {{
                "Languages": ["language1", "language2"],
                "Frameworks": ["framework1", "framework2"],
                "Developer_Tools": ["tool1", "tool2"],
                "Libraries": ["library1", "library2"]
            }},
            "experience": [
                {{
                    "company": "Company name",
                    "title": "Job title",
                    "start_date": "Start date",
                    "end_date": "End date or 'present'",
                    "location": "Job location",
                    "achievements": ["achievement1", "achievement2"]
                }}
            ],
            "education": [
                {{
                    "institution": "Name of institution",
                    "degree": "Degree obtained",
                    "graduation_date": "Graduation date",
                    "location": "Location",
                    "gpa": "GPA if available"
                }}
            ],
            "projects": [
                {{
                    "name": "Project name",
                    "description": "Project description",
                    "technologies": ["tech1", "tech2"],
                    "link": "GitHub link",
                    "live": "Live link"
                }}
            ]
        }}

        User Data:
        {user_data}

        Job Description:
        {job_description}")
        """)
            

            # from langchain_core.output_parsers import JsonOutputParser
            
        
            chain = prompt | self.llm | JsonOutputParser()
            
            result = chain.invoke({
                "job_description": job_description,
                "user_data": str(user_data)
            })
            
            return {'status': 'success', 'content': result}
            
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    def _extract_keywords(self, text: str) -> list:
        #"""Extract keywords using spaCy"""

        doc = nlp(text)
        return list(set(
            token.lemma_.lower() for token in doc
            if not token.is_stop and not token.is_punct and token.is_alpha
        ))[:5]

    def _calculate_ats_score(self, resume: str, jd: str) -> float:
        """Calculate ATS compatibility score"""
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform([resume, jd])
        return cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]


    def _get_ai_suggestions(self, resume: str, jd: str) -> list:
        #"""Get improvement suggestions using Gemini"""

        prompt = ChatPromptTemplate.from_template("""
        ("system", "You are a professional resume analyst and AI assistant specialized in creating ATS-optimized resumes"),

        ("human","Compare the resume and job description below, and provide only the **top 5 most important** suggestions to improve the resume.

        Be concise, clear, and actionable. Format the output as bullet points.")

        **Resume:**
        {resume}

        **Job Description:**
        {jd}

        """)
        
        
        chain = prompt | self.llm | self.output_parser
        return chain.invoke({"resume": resume, "jd": jd}).split("\n")

    def _optimize_resume(self, resume: str, jd: str) -> str:
        #"""Generate optimized resume version with tracked changes"""


        prompt = ChatPromptTemplate.from_template("""
        Optimize this resume for the job description with tracked changes:
        
        **Original Resume:**
        {resume}
        
        **Job Description:**
        {jd}
        
        Return the improved version with:
        - Added content marked with [+]
        - Removed content marked with [-]
        - Key changes highlighted
        - Better keyword alignment
        - Quantified achievements where possible
        - Professional summary at top
        - Clear section headings
        """)


        
        chain = prompt | self.llm | self.output_parser
        return chain.invoke({"resume": resume, "jd": jd})