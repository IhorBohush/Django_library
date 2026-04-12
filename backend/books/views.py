from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from users.permissions import IsLibrarian
from .models import Book, BookCopy, Attachment
from .serializers import BookListSerializer, BookSerializer, BookCopySerializer, AttachmentSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().select_related('category').prefetch_related('attachments')

    def get_serializer_class(self):
        if self.action in ['list']:
            return BookListSerializer
        return BookSerializer
    
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsLibrarian()]
    

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_fields = ["title", "author", "category"]
    search_fields = ["title", "author", "isbn"]
    ordering_fields = ["title", "published_year"]
    ordering = ["-created_at"]


class BookCopyViewSet(viewsets.ModelViewSet):
    serializer_class = BookCopySerializer
    permission_classes = [IsLibrarian]

    def get_queryset(self):
        queryset = BookCopy.objects.all()
        book_id = self.request.query_params.get('book')

        if book_id:
            queryset = queryset.filter(book_id=book_id)

        return queryset
    
    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        if not instance.is_available:
            return Response({"detail": "Неможливо видалити недоступний екземпляр книги."}, status=status.HTTP_400_BAD_REQUEST)
        return super().delete(request, *args, **kwargs)


class AttachmentViewSet(viewsets.ModelViewSet):
    queryset = Attachment.objects.all()
    serializer_class = AttachmentSerializer
    permission_classes = [IsLibrarian]
