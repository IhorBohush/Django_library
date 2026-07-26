#!/bin/sh

set -e

echo "⏳ Очікуємо запуск PostgreSQL..."

until python -c "
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'library.settings')
django.setup()

from django.db import connection

with connection.cursor() as cursor:
    cursor.execute('SELECT 1')
" > /dev/null 2>&1
do
    echo "PostgreSQL ще недоступний. Повторна спроба через 2 секунди..."
    sleep 2
done

echo "✅ PostgreSQL доступний"

echo "📦 Виконуємо міграції..."
python manage.py migrate --noinput

if [ "${DJANGO_ENV:-production}" = "production" ]; then
    echo "📁 Збираємо статичні файли..."
    python manage.py collectstatic --noinput
fi

echo "⚙️ Ініціалізуємо початкові дані..."
python manage.py init_project

echo "🚀 Запускаємо Django..."

exec "$@"