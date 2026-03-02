import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser


class RoleChoices(models.TextChoices):
    LIBRARIAN = 'librarian', 'Бібліотекар'
    READER = 'reader', 'Читач'


class ActorChoices(models.TextChoices):
    STUDENT = 'student', 'Студент'
    STAFF = 'staff', 'Працівник'
    OTHER = 'other', 'Інше'


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    middle_name = models.CharField(max_length=30, blank=True, null=True)
    role = models.CharField(max_length=20, choices=RoleChoices.choices, default=RoleChoices.READER)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    actor_type = models.CharField(max_length=20, choices=ActorChoices.choices, blank=True, null=True)
    profession = models.ForeignKey('professions.Profession', on_delete=models.SET_NULL, blank=True, null=True, related_name='users')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    graduation_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    pending_password_setup = models.BooleanField(default=True)  # чи користувач ще не встановив пароль

    class Meta:
        verbose_name = 'Користувач'
        verbose_name_plural = 'Користувачі'
        ordering = ['-id']
        indexes = [
            models.Index(fields=['last_name', 'first_name'])
        ]
    
    
    def __str__(self):
        return self.username