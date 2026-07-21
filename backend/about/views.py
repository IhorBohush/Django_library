from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import About
from .serializers import AboutSerializer, AboutGetSerializer
from users.permissions import IsLibrarian


class AboutViewSet(viewsets.ModelViewSet):
    queryset = About.objects.all()
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return AboutGetSerializer
        return AboutSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsLibrarian()]

    def create(self, request, *args, **kwargs):
        if About.objects.exists():
            return Response(
                {"detail": "Інформація про бібліотеку вже існує."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().create(request, *args, **kwargs)