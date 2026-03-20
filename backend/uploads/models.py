import os
from django.utils import timezone
import uuid
from django.db import models
from django.conf import settings 


def upload_to(instance, filename):
    ext = os.path.splitext(filename)[1].lstrip(".")
    image_exts = ["jpg", "jpeg", "png", "gif", "webp"]

    if ext in image_exts:
        folder = "cover"
    else:
        folder = "file"
    return f"uploads/{folder}/{timezone.now():%Y/%m}/{uuid.uuid4()}.{ext}"


class Upload(models.Model):
    file = models.FileField(upload_to=upload_to)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=100)
    size = models.PositiveIntegerField()
    content_type = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def delete(self, *args, **kwargs):
        self.file.delete(save=False)
        super().delete(*args, **kwargs)


    class Meta:
        verbose_name = 'Завантаження'
        verbose_name_plural = 'Завантаження'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['name']),
        ]


    def __str__(self):
        return f"{self.name}"