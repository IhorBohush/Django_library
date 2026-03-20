from django.urls import path
from .views import UploadCreateAPIView, UploadListAPIView, UploadDeleteAPIView

urlpatterns = [
    path("uploads/", UploadListAPIView.as_view()),
    path("uploads/create/", UploadCreateAPIView.as_view()),
    path("uploads/<uuid:pk>/", UploadDeleteAPIView.as_view()),
]