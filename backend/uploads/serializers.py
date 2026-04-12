from rest_framework import serializers

# from books.serializers import AttachmentSerializer
from .models import Upload

class UploadSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Upload
        fields = [
            "id",
            "file",
            "name",
            "file_url",
            "type",
            "size",
            "content_type",
            "created_at"
        ]

    def get_file_url(self, obj):
        if not obj.file:
            return None
        url = obj.file.url

        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(url)
        return url