from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.conf import settings
import os

User = get_user_model()


class Command(BaseCommand):
    help = "Initializes the project"

    def handle(self, *args, **kwargs):

        email = os.getenv("DJANGO_SUPERUSER_EMAIL")
        password = os.getenv("DJANGO_SUPERUSER_PASSWORD")

        if not email or not password:
            self.stdout.write(
                self.style.WARNING(
                    "DJANGO_SUPERUSER_EMAIL or DJANGO_SUPERUSER_PASSWORD not set."
                )
            )
            return

        if not User.objects.filter(email=email).exists():

            User.objects.create_superuser(
                email=email,
                password=password,
            )

            self.stdout.write(
                self.style.SUCCESS("Superuser created.")
            )

        else:
            self.stdout.write(
                self.style.WARNING("Superuser already exists.")
            )