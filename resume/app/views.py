# resume_api/views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Resume, ResumeAnalysis
from .serializers import ResumeSerializer, ResumeAnalysisSerializer

from .ai_services import ResumeAnalyzer
import json

analyzer = ResumeAnalyzer()

@api_view(['POST'])
def analyze_resume(request):
    # Get resume text and job description from request
    resume_text = request.data.get('resume_text', '')
    job_description = request.data.get('job_description', '')
    
    if not resume_text or not job_description:
        return Response(
            {'error': 'Resume text and job description are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Save to database
    resume = Resume.objects.create(
        user=request.user,
        title=f"Resume {Resume.objects.filter(user=request.user).count() + 1}",
        raw_content=resume_text,
        job_description=job_description
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
    
    return Response({
        'resume': ResumeSerializer(resume).data,
        'generated': True
    })