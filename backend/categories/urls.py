from django.urls import include
from rest_framework.routers import DefaultRouter, path
from .views import CategoryViewSet, CategoriesStatsView

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('', include(router.urls)),
    path('categories-stats/', CategoriesStatsView.as_view(), name='categories-stats')
]