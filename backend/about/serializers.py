from rest_framework import serializers

from uploads.serializers import UploadSerializer
from .models import About

class AboutSerializer(serializers.ModelSerializer):
    librarian_photo = UploadSerializer

    class Meta:
        model = About
        fields = '__all__'


class AboutGetSerializer(serializers.ModelSerializer):
    librarian_photo = UploadSerializer(read_only=True)

    class Meta:
        model = About
        fields = '__all__'