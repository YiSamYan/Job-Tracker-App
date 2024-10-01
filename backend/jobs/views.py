from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Job, ScrapingRequest
from .serializers import JobSerializer
from .utils import scrape_job_details
from django.utils import timezone
from django.http import JsonResponse

MAX_REQUESTS_PER_DAY = 3

# List and create jobs specific to the authenticated user
class JobListCreateView(generics.ListCreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]

    # Override get_queryset to filter jobs by the logged-in user
    def get_queryset(self):
        return Job.objects.filter(user=self.request.user)

    # Override perform_create to associate the job with the logged-in user
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Retrieve, update, and delete jobs specific to the authenticated user
class JobRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]

    # Override get_queryset to filter jobs by the logged-in user
    def get_queryset(self):
        return Job.objects.filter(user=self.request.user)

@api_view(['GET', 'POST'])
def scrape_job(request):
    url = request.data.get('url')
    user = request.user

    scraping_request, created = ScrapingRequest.objects.get_or_create(
        user=user,
        defaults={'last_request_date': timezone.now().date()}
    )
    scraping_request.reset_daily_count()
    
    if scraping_request.request_count >= MAX_REQUESTS_PER_DAY:
        return JsonResponse({
            'error': 'You have reached your daily limit of 3 scraping requests.'
        }, status=403)

    if not url:
        return Response({'error': 'No URL provided.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        scraping_request.increment_count()
        job_details = scrape_job_details(url)
        return Response(job_details, status=status.HTTP_200_OK)
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)