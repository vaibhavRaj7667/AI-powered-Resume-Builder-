# resume_api/views.py
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
# from django.shortcuts import get_object_or_404
from .models import Resume, ResumeAnalysis
from .serializers import ResumeSerializer, ResumeAnalysisSerializer
import re
from .ai_services import ResumeAnalyzer
# import json
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from pypdf import PdfReader
analyzer = ResumeAnalyzer()



class cleanData:
    def __init__(self, text):
        self.text = text

    def clean(self):
    
        text = re.sub(r'[-•]+', '-', self.text)

        # Remove duplicate spaces and lines
        text = re.sub(r'\n\s*\n', '\n', text)  # Remove multiple blank lines
        text = re.sub(r'\s{2,}', ' ', text)  # Replace multiple spaces with single space
        text = re.sub(r'\n+', '\n', text)  # Collapse multiple newlines into one

        # Remove stray punctuation except for normal formatting (colons, commas, etc.)
        text = re.sub(r'[^\w\s:|.,/@()-]', '', text)

        # Strip leading/trailing whitespace from each line
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        text = ''.join(lines)

        return text
    
class optimize(APIView):
    def get(self, request):
        name = request.user

        Data = ResumeAnalysis.objects.filter(resume__user = name).last()

        bro = ResumeAnalysisSerializer(Data)
        
        return Response(bro.data,status=status.HTTP_200_OK)



@api_view(['POST'])
def analyze_resume(request):
    
    # resume_text = request.data.get('resume_text', '')
    pdf_file = request.FILES.get('pdf_file', None)
    job_description = request.data.get('job_description', '')
    
    

    if not pdf_file or not job_description:
        return Response(
            {'error': 'Resume text and job description are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Read text from PDF
        pdf_reader = PdfReader(pdf_file)
        resume_text = ""
        for page in pdf_reader.pages:
            resume_text += page.extract_text() or ''
    except Exception as e:
        return Response(
            {'error': 'Failed to read PDF file', 'details': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    raw_resume = cleanData(resume_text).clean()
    cleaned_job_description = cleanData(job_description).clean()

    # Save to database
    resume = Resume.objects.create(
        user=request.user,
        title=f"Resume {Resume.objects.filter(user=request.user).count() + 1}",
        raw_content=raw_resume,
        job_description=cleaned_job_description
    )
    
    # Perform AI analysis
    analysis_results = analyzer.analyze_resume_content(resume_text, job_description)
    
    # Save analysis results
    analysis = ResumeAnalysis.objects.create(
        resume=resume,
        missing_keywords=analysis_results.get('missing_keywords', []),
        suggested_improvements=analysis_results.get('suggested_improvements', []),
        ats_score=analysis_results.get('ats_score', 0)
    )
    
    # Update resume with optimized content if available
    if 'optimized_content' in analysis_results:
        resume.optimized_content = analysis_results['optimized_content']
        resume.save()
    
    return Response({
        'resume': ResumeSerializer(resume).data,
        'analysis': ResumeAnalysisSerializer(analysis).data
    })

@api_view(['POST'])
def generate_resume(request):
    # Get user data and job description
    user_data = request.data.get('user_data', {})
    job_description = request.data.get('job_description', '')
    
    if not user_data or not job_description:
        return Response(
            {'error': 'User data and job description are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Generate resume using AI
    generated_content = analyzer.generate_resume(user_data, job_description)
    
    # Save to database
    resume = Resume.objects.create(
        user=request.user,
        title=f"Generated Resume {Resume.objects.filter(user=request.user).count() + 1}",
        raw_content=generated_content,
        optimized_content=generated_content,
        job_description=job_description
    )
    print(type(resume.optimized_content))
    return Response({
        'resume': resume.optimized_content,
        'generated': True
    })