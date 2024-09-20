from rest_framework import serializers
from .models import Job

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['id', 'title', 'company', 'status', 'description', 'requirements', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']