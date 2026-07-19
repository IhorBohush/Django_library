from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from users.permissions import IsLibrarian
from .models import Category
from .serializers import CategorySerializer

class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsLibrarian()]
    

class CategoriesStatsView(APIView):
    
    def get(self, request):
        total_categories = Category.objects.count()
        
        return Response({
            "total_categories": total_categories
        })