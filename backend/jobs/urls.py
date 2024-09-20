from django.urls import path
from .views import JobListCreateView, JobRetrieveUpdateDestroyView, scrape_job

urlpatterns = [
    path('jobs/', JobListCreateView.as_view(), name='job-list-create'),
    path('jobs/<int:pk>/', JobRetrieveUpdateDestroyView.as_view(), name='job-retrieve-update-destroy'),
    path('jobs/scrape/', scrape_job, name='scrape-job'),
]