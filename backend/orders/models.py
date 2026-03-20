from django.db import models
from django.conf import settings

class Order(models.Model):
    librarian = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='librarian_orders')
    book = models.ForeignKey('books.BookCopy', on_delete=models.CASCADE, related_name='orders')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_orders')
    is_active = models.BooleanField(default=True)
    order_date = models.DateTimeField(auto_now_add=True)
    return_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'Замовлення'
        verbose_name_plural = 'Замовлення'
        ordering = ['-order_date']

    def __str__(self):
        return f"Order {self.id} - {self.book.title} by {self.user.last_name} {self.user.first_name}"
