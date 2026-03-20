from django.shortcuts import render
from rest_framework.views import APIView, Response
from rest_framework import status
from rest_framework.generics import CreateAPIView, UpdateAPIView, ListAPIView, RetrieveAPIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Order
from .serializers import OrderCreateSerializer, OrderUpdateSerializer, OrderListSerializer, OrderDetailSerializer
from users.permissions import IsLibrarian

class OrderCreateView(CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderCreateSerializer
    permission_classes = [IsLibrarian]


class OrderUpdateView(UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderUpdateSerializer
    permission_classes = [IsLibrarian]


class OrderListView(ListAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderListSerializer
    permission_classes = [IsLibrarian]
    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_fields = ["is_active"]
    search_fields = ["book__book__title", "user__first_name", "user__last_name"]
    ordering_fields = ["order_date", "return_date"]
    ordering = ["-order_date"]


class OrderDetailView(RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderDetailSerializer
    permission_classes = [IsLibrarian]
    

class OrderDeleteView(APIView):
    permission_classes = [IsLibrarian]

    def delete(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
            if not order.is_active:
                order.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response('Cannot delete an active order.', status=status.HTTP_400_BAD_REQUEST)
        except Order.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)