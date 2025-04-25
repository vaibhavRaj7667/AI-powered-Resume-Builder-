# resume_api/serializers.py
from rest_framework import serializers
from .models import Resume, ResumeAnalysis,User

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['id', 'title', 'created_at', 'updated_at', 'raw_content', 'optimized_content']

class ResumeAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeAnalysis
        fields = ['missing_keywords', 'suggested_improvements', 'ats_score', 'created_at']

class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model= User
        fields =['username','email','password']
        extra_kwargs = {'password': {'write_only': True}}  

    def create(self, validated_data):
        user = User.objects.create_user(
            username = validated_data['username'],
            email = validated_data.get('email'),
            password = validated_data['password'],
        )
        return user