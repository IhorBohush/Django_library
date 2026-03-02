from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from users.permissions import IsLibrarian
from .models import Book, BookCopy, Attachment
from .serializers import BookSerializer, BookDetailSerializer, BookCopySerializer, AttachmentSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()

    def get_serializer_class(self):
        if self.action in ['retrieve']:
            return BookDetailSerializer
        return BookSerializer
    
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsLibrarian()]
    

class BookCopyViewSet(viewsets.ModelViewSet):
    queryset = BookCopy.objects.all()
    serializer_class = BookCopySerializer
    permission_classes = [IsLibrarian]


class AttachmentViewSet(viewsets.ModelViewSet):
    queryset = Attachment.objects.all()
    serializer_class = AttachmentSerializer
    permission_classes = [IsLibrarian]
