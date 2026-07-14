from django.utils import timezone
from django.shortcuts import render
from rest_framework.views import APIView, Response
from rest_framework import status
from rest_framework.generics import CreateAPIView, UpdateAPIView, ListAPIView, RetrieveAPIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from users.models import RoleChoices
from .models import Order
from .serializers import OrderCreateSerializer, OrderUpdateSerializer, OrderListSerializer, OrderDetailSerializer
from users.permissions import IsLibrarian
from rest_framework.permissions import IsAuthenticated

class OrderCreateView(CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderCreateSerializer
    permission_classes = [IsLibrarian]


class OrderUpdateView(UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderUpdateSerializer
    permission_classes = [IsLibrarian]


class OrderListView(ListAPIView):
    serializer_class = OrderListSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_fields = ["is_active", "user__id"]
    search_fields = ["book__book__title", "user__first_name", "user__last_name"]
    ordering_fields = ["order_date", "return_date", "due_date"]
    ordering = ["-order_date"]

    def get_queryset(self):
        user = self.request.user

        if user.role == RoleChoices.LIBRARIAN:
            return Order.objects.all().order_by("-order_date")

        return Order.objects.filter(user=user).order_by("-order_date")


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
        

class OrdersStatsView(APIView):
    
    def get(self, request):
        total_orders = Order.objects.count()
        active = Order.objects.filter(is_active=True).count()

        overdue = Order.objects.filter(
            is_active=True,
            due_date__lt=timezone.now().date()
        ).count()

        return Response({
            "active_orders": active,
            "overdue_orders": overdue,
            "total_orders": total_orders,
        })
    

# class ReaderOrdersListView(ListAPIView):
#     serializer_class = OrderListSerializer
#     permission_classes = [IsLibrarianOrReaderOrderOwner]

#     def get_queryset(self):
#         orders = Order.objects.filter(user__id=self.request.user.id)
#         if not orders.exists():
#             return Order.objects.none()
#         return orders.order_by("-order_date")