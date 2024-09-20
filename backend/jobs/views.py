from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Job
from .serializers import JobSerializer
from .utils import scrape_job_details

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
    if not url:
        return Response({'error': 'No URL provided.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        job_details = scrape_job_details(url)
        return Response(job_details, status=status.HTTP_200_OK)
    except ValueError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': 'An error occurred while scraping.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)