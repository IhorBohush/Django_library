from rest_framework import serializers
from .models import Book, BookCopy, Attachment

class BookCopySerializer(serializers.ModelSerializer):
    class Meta:
        model = BookCopy
        fields = ['id', 'number', 'book', 'is_available']
        read_only_fields = ['id']


class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = ['id', 'upload', 'book', 'type']
        read_only_fields = ['id']


class BookDetailSerializer(serializers.ModelSerializer):
    copies = BookCopySerializer(many=True, read_only=True)
    attachments = AttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'published_date', 'description', 'isbn', 'category', 'copies', 'attachments']
        read_only_fields = ['id']


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'published_date', 'description', 'isbn', 'category']
        read_only_fields = ['id']