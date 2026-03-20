from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    published_date = models.DateField()
    description = models.TextField(blank=True, null=True)
    isbn = models.CharField(max_length=20, unique=True, blank=True, null=True)
    category = models.ForeignKey('categories.Category', on_delete=models.SET_NULL, null=True, related_name='books')

    class Meta:
        verbose_name = 'Книга'
        verbose_name_plural = 'Книги'
        ordering = ['title']
        indexes = [
            models.Index(fields=['title', 'author', 'isbn']),
        ]

    def __str__(self):
        return self.title


class BookCopy(models.Model):
    number = models.CharField(max_length=20)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='copies')
    is_available = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Екземпляр книги'
        verbose_name_plural = 'Екземпляри книг'
    
    def __str__(self):
        return f"{self.book.title} - {'Доступна' if self.is_available else 'Недоступна'}"
    

class AttachmentsChoices(models.TextChoices):
    COVER = 'cover', 'Обкладинка'
    FILE = 'file', 'Файл'


class Attachment(models.Model):
    upload = models.ForeignKey('uploads.Upload', on_delete=models.CASCADE, related_name='attachments')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='attachments')
    type = models.CharField(max_length=20, choices=AttachmentsChoices.choices)

    class Meta:
        verbose_name = 'Вкладення'
        verbose_name_plural = 'Вкладення'
    
    def __str__(self):
        return f"Вкладення для {self.book.title}"