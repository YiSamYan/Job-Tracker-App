from django.contrib.auth.models import User
from django.db import models

class Job(models.Model):
    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('interviewing', 'Interviewing'),
        ('rejected', 'Rejected'),
        ('offered', 'Offered'),
        ('n/a', 'N/A'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="jobs")
    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='n/a')
    description = models.TextField(null=True, blank=True)
    requirements = models.TextField(null=True, blank=True)

    # Automatically track when the jobs were added and updated to the db
    # For created_at only add timedate at created 
    # when updated_at is when created and any subsequent edits
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
