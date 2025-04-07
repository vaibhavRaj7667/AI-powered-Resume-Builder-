# resume_api/serializers.py
from rest_framework import serializers
from .models import Resume, ResumeAnalysis

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['id', 'title', 'created_at', 'updated_at', 'raw_content', 'optimized_content']

class ResumeAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeAnalysis
        fields = ['missing_keywords', 'suggested_improvements', 'ats_score', 'created_at']