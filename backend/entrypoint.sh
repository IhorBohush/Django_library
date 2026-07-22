#!/bin/sh

echo "⏳ Очікуємо запуск PostgreSQL..."

while ! python manage.py check --database default > /dev/null 2>&1
do
    sleep 2
done

echo "✅ PostgreSQL доступний"

echo "📦 Виконуємо міграції..."
python manage.py migrate --noinput

echo "Collecting static..."

python manage.py collectstatic --noinput

python manage.py init_project

echo "🚀 Запускаємо Django..."

exec "$@"