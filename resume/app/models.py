from django.db import models
from django.contrib.auth.models import User



class Resume(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    raw_content = models.TextField(blank=True)
    optimized_content = models.TextField(blank=True)
    job_description = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"
        

class ResumeAnalysis(models.Model):
    resume = models.OneToOneField(Resume, on_delete=models.CASCADE)
    missing_keywords = models.JSONField(default=list)
    suggested_improvements = models.JSONField(default=list)
    ats_score = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Analysis for {self.resume.title}"


