from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from .tokens import account_setup_token_generator

def send_account_setup_email(user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = account_setup_token_generator.make_token(user)
    setup_url = f"{settings.FRONTEND_URL}/setup-password/{uid}/{token}/"

    subject = "Ваш обліковий запис у бібліотеці створено - встановіть пароль"
    message = f"""
    Доброго дня, {user.first_name}!

    Ваш акаунт створено бібліотекарем.
    Щоб встановити свій власний пароль і активувати акаунт, перейдіть за посиланням:
    {setup_url}

    Це посилання дійсне лише одноразово.
    """
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email.strip()], fail_silently=False)