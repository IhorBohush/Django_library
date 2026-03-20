from rest_framework import serializers
from .models import Order

class OrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['book', 'user']

    def create(self, validated_data):
        validated_data['librarian'] = self.context['request'].user
        order = Order.objects.create(**validated_data)
        return order


class OrderUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['is_active', 'return_date']


class OrderListSerializer(serializers.ModelSerializer):
    book_title = serializers.ReadOnlyField(source='book.book.title')
    book_number = serializers.ReadOnlyField(source='book.number')
    user_first_name = serializers.ReadOnlyField(source='user.first_name')
    user_last_name = serializers.ReadOnlyField(source='user.last_name')

    class Meta:
        model = Order
        fields = ['id', 'librarian', 'book_title', 'book_number', 'user_first_name', 'user_last_name', 'is_active', 'order_date', 'return_date']
        read_only_fields = ['id', 'librarian', 'is_active', 'order_date', 'return_date']


class OrderDetailSerializer(serializers.ModelSerializer):
    book_title = serializers.ReadOnlyField(source='book.book.title')
    book_number = serializers.ReadOnlyField(source='book.number')
    user_first_name = serializers.ReadOnlyField(source='user.first_name')
    user_last_name = serializers.ReadOnlyField(source='user.last_name')

    class Meta:
        model = Order
        fields = ['id', 'librarian', 'book_title', 'book_number', 'user_first_name', 'user_last_name', 'is_active', 'order_date', 'return_date']
        read_only_fields = ['id', 'librarian', 'is_active', 'order_date', 'return_date']