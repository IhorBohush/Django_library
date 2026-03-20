from rest_framework.exceptions import ValidationError

IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
DOC_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]

MAX_IMAGE_SIZE = 10 * 1024 * 1024
MAX_DOC_SIZE = 10 * 1024 * 1024


def validate_upload(file):
    content_type = getattr(file, "content_type", None)

    if content_type in IMAGE_TYPES:
        if file.size > MAX_IMAGE_SIZE:
            raise ValidationError("Image too large")
        return "image"

    if content_type in DOC_TYPES:
        if file.size > MAX_DOC_SIZE:
            raise ValidationError("Document too large")
        return "doc"

    raise ValidationError("Invalid file type")