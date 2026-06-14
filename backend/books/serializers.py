from rest_framework import serializers

from uploads.models import Upload
from uploads.serializers import UploadSerializer
from .models import Book, BookCopy, Attachment

class BookCopySerializer(serializers.ModelSerializer):
    class Meta:
        model = BookCopy
        fields = ['id', 'number', 'book', 'is_available']
        read_only_fields = ['id']

    def validate_number(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Copy number cannot be empty.")
        return value

    def validate(self, attrs):
        book = attrs.get('book', getattr(self.instance, 'book', None))
        number = attrs.get('number', getattr(self.instance, 'number', None))

        if book and number:
            queryset = BookCopy.objects.filter(book=book, number=number)

            if self.instance:
                queryset = queryset.exclude(pk=self.instance.pk)

            if queryset.exists():
                raise serializers.ValidationError({
                    'number': 'This book already has a copy with this number.'
                })

        return attrs


class AttachmentSerializer(serializers.ModelSerializer):
    upload = UploadSerializer(read_only=True)
    upload_id = serializers.PrimaryKeyRelatedField(
        queryset=Upload.objects.all(),
        source='upload',
        write_only=True
    )
    class Meta:
        model = Attachment
        fields = ['id', 'upload', 'upload_id', 'book', 'type']
        read_only_fields = ['id']

    # def create(self, validated_data):
    #     upload_id = validated_data.pop("upload")
    #     try:
    #         upload = Upload.objects.get(id=upload_id)
    #     except Upload.DoesNotExist:
    #         raise serializers.ValidationError({"upload_id": "Invalid upload ID."})
        
    #     attachment = Attachment.objects.create(upload=upload, **validated_data)
    #     return attachment


class BookListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    cover = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'isbn', 'category_name', 'cover']
        read_only_fields = ['id']

    def get_cover(self, obj):
        request = self.context.get('request')

        cover = obj.attachments.filter(type='cover').first()

        if cover and cover.upload and cover.upload.file:
            return request.build_absolute_uri(cover.upload.file.url)

        return None


class BookSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    copies = BookCopySerializer(many=True, read_only=True)
    attachments = AttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'published_year', 'description', 'isbn', 'category', 'category_name', 'copies', 'attachments']
        read_only_fields = ['id']