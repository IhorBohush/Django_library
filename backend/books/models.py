from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    published_year = models.IntegerField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    isbn = models.CharField(max_length=20, blank=True, null=True)
    category = models.ForeignKey('categories.Category', on_delete=models.SET_NULL, null=True, related_name='books')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

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
        constraints = [
            models.UniqueConstraint(
                fields=['book', 'number'],
                name='unique_book_copy_number_per_book',
            ),
        ]
     
    def save(self, *args, **kwargs):
        if self.number:
            self.number = self.number.strip()
        super().save(*args, **kwargs)
    
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