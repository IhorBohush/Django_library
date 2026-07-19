from django.urls import include
from rest_framework.routers import DefaultRouter, path
from .views import BookViewSet, BookCopyViewSet, AttachmentViewSet, BooksStatsView

router = DefaultRouter()
router.register(r'books', BookViewSet, basename='book')
router.register(r'book-copies', BookCopyViewSet, basename='book-copy')
router.register(r'attachments', AttachmentViewSet, basename='attachment')

urlpatterns = [
    path('', include(router.urls)),
    path('books-stats/', BooksStatsView.as_view(), name='books-stats')
]