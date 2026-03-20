from django.contrib.auth.password_validation import validate_password as django_validate_password
from rest_framework import serializers
from django.core.exceptions import ValidationError as DjangoValidationError

def validate_user_password(password):
    """
    Використовуємо стандартну Django валідацію пароля.
    Підходить для DRF серіалізаторів.
    """
    try:
        django_validate_password(password)
    except DjangoValidationError as e:
        raise serializers.ValidationError(e.messages)
    return password