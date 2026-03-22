from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from users.permissions import IsLibrarian
from .models import Book, BookCopy, Attachment
from .serializers import BookSerializer, BookCopySerializer, AttachmentSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    # def get_serializer_class(self):
    #     if self.action in ['list']:
    #         return BookListSerializer
    #     return BookSerializer
    
    
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
    ordering_fields = ["title", "published_date"]
    ordering = ["title"]


class BookCopyViewSet(viewsets.ModelViewSet):
    queryset = BookCopy.objects.all()
    serializer_class = BookCopySerializer
    permission_classes = [IsLibrarian]


class AttachmentViewSet(viewsets.ModelViewSet):
    queryset = Attachment.objects.all()
    serializer_class = AttachmentSerializer
    permission_classes = [IsLibrarian]
