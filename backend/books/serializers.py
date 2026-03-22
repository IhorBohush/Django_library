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


# class BookListSerializer(serializers.ModelSerializer):
#     category_name = serializers.CharField(source="category.name", read_only=True)
#     attachments = AttachmentSerializer(many=True, read_only=True)

#     class Meta:
#         model = Book
#         fields = ['id', 'title', 'author', 'published_date', 'isbn', 'category', 'category_name', 'attachments']
#         read_only_fields = ['id']


class BookSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    copies = BookCopySerializer(many=True, read_only=True)
    attachments = AttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'published_date', 'description', 'isbn', 'category', 'category_name', 'copies', 'attachments']
        read_only_fields = ['id']