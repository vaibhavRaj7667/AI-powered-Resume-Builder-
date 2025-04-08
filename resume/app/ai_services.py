# app/ai_services.py
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from django.conf import settings
import spacy
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

nlp = spacy.load("en_core_web_sm")

class ResumeAnalyzer:
    def __init__(self):
        # Initialize Gemini LLM
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-pro-latest",
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

    def generate_resume(self, user_data: dict, job_description: str) -> dict:
        #"""Generate resume using Gemini"""

        try:
            prompt = ChatPromptTemplate.from_template("""
            Create a professional resume for this candidate targeting the job:
            
            **Job Description:**
            {job_description}
            
            **Candidate Information:**
            {user_data}
            
            **Requirements:**
            - Use ATS-friendly formatting
            - Include relevant keywords from job description
            - Focus on achievements with quantifiable metrics
            - Use professional tone (third person)
            - Structure: Summary, Experience, Skills, Education
            - Keep to 1-2 pages maximum
            """)
            
            chain = prompt | self.llm | self.output_parser
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
        ))

    def _calculate_ats_score(self, resume: str, jd: str) -> float:
        """Calculate ATS compatibility score"""
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform([resume, jd])
        return cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]


    def _get_ai_suggestions(self, resume: str, jd: str) -> list:
        #"""Get improvement suggestions using Gemini"""

        prompt = ChatPromptTemplate.from_template("""
       You are an expert resume analyst.

        Compare the resume and job description below, and give concise, actionable suggestions in bullet points. Be clear and to the point — not too long, not too brief.

        **Resume:**
        {resume}

        **Job Description:**
        {jd}

        Focus on these areas:
        - Top 5 important keywords missing from the resume
        - 3 weak or vague phrases (suggest better alternatives)
        - Where to add numbers or measurable achievements
        - Any structural improvements (headings or section order)
        - ATS (Applicant Tracking System) optimization tips

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