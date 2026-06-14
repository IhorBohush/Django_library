from rest_framework import serializers
from django.db import transaction
from django.utils import timezone
from books.models import BookCopy
from .models import Order

class OrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['book', 'user', 'due_date']

    def validate_book(self, book):
        if not book.is_available:
            raise serializers.ValidationError("This book copy is already issued.")
        return book

    @transaction.atomic
    def create(self, validated_data):
        book = BookCopy.objects.select_for_update().get(pk=validated_data['book'].pk)

        if not book.is_available:
            raise serializers.ValidationError({"book": "This book copy is already issued."})

        validated_data['book'] = book
        validated_data['librarian'] = self.context['request'].user
        order = Order.objects.create(**validated_data)

        book.is_available = False
        book.save(update_fields=['is_available'])

        return order


class OrderUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['is_active', 'return_date']

    @transaction.atomic
    def update(self, instance, validated_data):
        old_is_active = instance.is_active
        new_is_active = validated_data.get('is_active', instance.is_active)

        order = Order.objects.select_for_update().select_related('book').get(pk=instance.pk)

        if old_is_active and new_is_active is False:
            validated_data.setdefault('return_date', timezone.now())
            order.book.is_available = True
            order.book.save(update_fields=['is_available'])
        elif not old_is_active and new_is_active is True:
            if not order.book.is_available:
                raise serializers.ValidationError({"book": "This book copy is already issued."})
            validated_data['return_date'] = None
            order.book.is_available = False
            order.book.save(update_fields=['is_available'])

        return super().update(order, validated_data)


class OrderListSerializer(serializers.ModelSerializer):
    book_title = serializers.ReadOnlyField(source='book.book.title')
    book_number = serializers.ReadOnlyField(source='book.number')
    user_first_name = serializers.ReadOnlyField(source='user.first_name')
    user_last_name = serializers.ReadOnlyField(source='user.last_name')

    class Meta:
        model = Order
        fields = ['id', 'librarian', 'book_title', 'book_number', 'user_first_name', 'user_last_name', 'is_active', 'order_date', 'return_date', 'due_date']
        read_only_fields = ['id', 'librarian', 'is_active', 'order_date', 'return_date', 'due_date']


class OrderDetailSerializer(serializers.ModelSerializer):
    book_title = serializers.ReadOnlyField(source='book.book.title')
    book_number = serializers.ReadOnlyField(source='book.number')
    user_first_name = serializers.ReadOnlyField(source='user.first_name')
    user_last_name = serializers.ReadOnlyField(source='user.last_name')

    class Meta:
        model = Order
        fields = ['id', 'librarian', 'book_title', 'book_number', 'user_first_name', 'user_last_name', 'is_active', 'order_date', 'return_date', 'due_date']
        read_only_fields = ['id', 'librarian', 'is_active', 'order_date', 'return_date', 'due_date']