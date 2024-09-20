from django.urls import path
from .views import register, login, health_check

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('health/', health_check, name='health-check'),
]