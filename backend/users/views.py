from django.shortcuts import render, get_object_or_404
from .filters import ReaderFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView, RetrieveAPIView, ListAPIView, DestroyAPIView
from .permissions import IsLibrarian, IsSuperUser, IsLibrarianOrSuperUser
from .serializers import (CreateLibrarianSerializer, CreateReaderSerializer, SetupPasswordSerializer, SuperUserDetailSerializer, UpdateReaderSerializer, UpdateLibrarianSerializer, 
                          UpdateLibrarianCredentialsSerializer, UpdateReaderCredentialsSerializer, UpdateReaderActiveStatusSerializer,
                          ReaderDetailSerializer, LibrarianDetailSerializer, ReadersListSerializer, LibrariansListSerializer)
from .models import ActorChoices, RoleChoices
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_decode
from .tokens import account_setup_token_generator
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class CreateLibrarianView(CreateAPIView):
    serializer_class = CreateLibrarianSerializer
    permission_classes = [IsSuperUser]


class CreateReaderView(CreateAPIView):
    serializer_class = CreateReaderSerializer
    permission_classes = [IsLibrarianOrSuperUser]


class SetupPasswordView(APIView):
    permission_classes = [IsLibrarianOrSuperUser]
    serializer_class = SetupPasswordSerializer

    def patch(self, request, uidb64, token):

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid, pending_password_setup=True)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response({"detail": "Invalid link"}, status=status.HTTP_400_BAD_REQUEST)

        if not account_setup_token_generator.check_token(user, token):
            return Response({"detail": "Invalid or expired link"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.serializer_class(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({"detail": "Password set successfully"}, status=status.HTTP_200_OK)
    

class UpdateReaderView(APIView):
    permission_classes = [IsLibrarianOrSuperUser]
    serializer_class = UpdateReaderSerializer

    def patch(self, request, id):
        user = get_object_or_404(User, pk=id, role=RoleChoices.READER)
        serializer = self.serializer_class(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)
    

class UpdateLibrarianView(APIView):
    permission_classes = [IsLibrarian]
    serializer_class = UpdateLibrarianSerializer

    def patch(self, request, id):
        user = get_object_or_404(User, pk=id, role=RoleChoices.LIBRARIAN)
        serializer = self.serializer_class(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)
    

class UpdateLibrarianCredentialsView(APIView):
    permission_classes = [IsLibrarian]
    serializer_class = UpdateLibrarianCredentialsSerializer

    def patch(self, request, id):
        user = get_object_or_404(User, pk=id, role=RoleChoices.LIBRARIAN)
        serializer = self.serializer_class(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Credentials updated successfully"}, status=status.HTTP_200_OK)


def update_reader(user, request, serializer_class):
    serializer = serializer_class(user, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response({"detail": "Reader credentials updated successfully"}, status=status.HTTP_200_OK)


class UpdateReaderCredentialsView(APIView):
    permission_classes = [IsLibrarianOrSuperUser]
    serializer_class = UpdateReaderCredentialsSerializer

    def patch(self, request, id):
        user = get_object_or_404(User, pk=id, role=RoleChoices.READER)
        return update_reader(user, request, self.serializer_class)
    

class UpdateReaderActiveStatusView(APIView):
    permission_classes = [IsLibrarianOrSuperUser]
    serializer_class = UpdateReaderActiveStatusSerializer

    def patch(self, request, id):
        user = get_object_or_404(User, pk=id, role=RoleChoices.READER)
        return update_reader(user, request, self.serializer_class)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == RoleChoices.READER:
            serializer = ReaderDetailSerializer(user)
        elif user.role == RoleChoices.LIBRARIAN:
            serializer = LibrarianDetailSerializer(user)
        elif user.role == RoleChoices.SUPERUSER:
            serializer = SuperUserDetailSerializer(user)
        else:
            return Response({"detail": "Role not supported"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ReaderDetailView(RetrieveAPIView):
    """
    Повертає дані будь-якого читача за id.
    Доступ лише для бібліотекарів або суперюзерів.
    """
    queryset = User.objects.filter(role=RoleChoices.READER)
    serializer_class = ReaderDetailSerializer
    permission_classes = [IsLibrarianOrSuperUser]
    lookup_field = "id"
    lookup_url_kwarg = "id"
    

class LibrarianDetailView(RetrieveAPIView):
    """
    Повертає дані будь-якого бібліотекаря за id.
    Доступ лише для суперюзерів.
    """
    queryset = User.objects.filter(role=RoleChoices.LIBRARIAN)
    serializer_class = LibrarianDetailSerializer
    permission_classes = [IsSuperUser]


class ReadersListView(ListAPIView):
    queryset = User.objects.filter(role=RoleChoices.READER).order_by('-created_at')
    permission_classes = [IsLibrarianOrSuperUser]
    serializer_class = ReadersListSerializer
    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    filterset_class = ReaderFilter
    
    search_fields = ["last_name", "first_name", "email"]
    ordering_fields = ["last_name", "first_name"]
    ordering = ["-created_at"]
    

class LibrariansListView(ListAPIView):
    queryset = User.objects.filter(role=RoleChoices.LIBRARIAN).order_by('-created_at')
    permission_classes = [IsSuperUser]
    serializer_class = LibrariansListSerializer


class ReaderDeleteView(APIView):
    permission_classes = [IsLibrarianOrSuperUser]

    def delete(self, request, id):
        user = get_object_or_404(User, pk=id, role=RoleChoices.READER)
        if user.order or user.is_active:
            return Response({"detail": "Cannot delete an active reader"}, status=status.HTTP_400_BAD_REQUEST)
        user.delete()
        return Response({"detail": "Reader deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    

class LibrarianDeleteView(DestroyAPIView):
    queryset = User.objects.filter(role=RoleChoices.LIBRARIAN)
    permission_classes = [IsSuperUser]
    lookup_field = "id"
    lookup_url_kwarg = "id"


class LogoutView(APIView):
    def post(self, request):
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"detail": "Logged out"})
    

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "first_name": request.user.first_name
        })
    

class ActorsChoicesView(APIView):
    permission_classes = [IsLibrarianOrSuperUser]

    def get(self, request):

        actor_choices = [
            {"value": c.value, "label": c.label}
            for c in ActorChoices
        ]

        return Response({
            "actor_types": actor_choices
        })