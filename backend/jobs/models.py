from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

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

class ScrapingRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="scraping_requests")
    request_count = models.IntegerField(default=0)
    last_request_date = models.DateField()

    def reset_daily_count(self):
        """Resets the request count if the day has changed."""
        if self.last_request_date != timezone.now().date():
            self.request_count = 0
            self.last_request_date = timezone.now().date()
            self.save()

    def increment_count(self):
        """Increments the request count."""
        self.request_count += 1
        self.save()

    def __str__(self):
        return f"Requests by {self.user.username}: {self.request_count} on {self.last_request_date}"
