from django.shortcuts import render
import os
from rest_framework.response import Response
from .models import Upload
from .serializers import UploadSerializer
from rest_framework.parsers import MultiPartParser
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, DestroyAPIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from users.permissions import IsLibrarian
from rest_framework.exceptions import ValidationError 
from .validators import validate_upload


class UploadCreateAPIView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsLibrarian]

    def post(self, request):
        file = request.FILES.get("file")

        if not file:
            return Response(
                {"file": "This field is required."},
                status=400
            )

        try:
            upload_type = validate_upload(file)
        except ValidationError as e:
            detail = getattr(e, "detail", None)
            if isinstance(detail, (list, tuple)) and detail:
                msg = str(detail[0])
            elif detail is not None:
                msg = str(detail)
            else:
                msg = str(e)

            return Response({"file": msg}, status=400)

        upload = Upload.objects.create(
            file=file,
            name = os.path.basename(file.name),
            type=upload_type,
            size=file.size,
            content_type=file.content_type,
        )

        return Response(UploadSerializer(upload, context={"request": request}).data, status=201)
    

class UploadListAPIView(ListAPIView):
    queryset = Upload.objects.all()
    serializer_class = UploadSerializer
    permission_classes = [IsLibrarian]
    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_fields = ["type", "content_type"]
    search_fields = ["name"]
    ordering_fields = ["created_at", "size"]
    ordering = ["-created_at"]


class UploadDeleteAPIView(DestroyAPIView):
    queryset = Upload.objects.all()
    serializer_class = UploadSerializer
    permission_classes = [IsLibrarian]