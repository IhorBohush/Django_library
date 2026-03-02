from django.shortcuts import render, get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView, RetrieveAPIView, ListAPIView, DestroyAPIView
from .permissions import IsSuperUser, IsLibrarianOrSuperUser
from .serializers import (CreateLibrarianSerializer, CreateReaderSerializer, SetupPasswordSerializer, UpdateReaderSerializer, UpdateLibrarianSerializer, 
                          UpdateLibrarianCredentialsSerializer, UpdateReaderCredentialsSerializer, UpdateReaderActiveStatusSerializer,
                          ReaderDetailSerializer, LibrarianDetailSerializer, ReadersListSerializer, LibrariansListSerializer)
from .models import RoleChoices
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
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
    permission_classes = []  # AllowAny для першого входу
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

    def patch(self, request, user_id):
        user = get_object_or_404(User, pk=user_id, role=RoleChoices.READER)
        serializer = self.serializer_class(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)
    

class UpdateLibrarianView(APIView):
    permission_classes = [IsLibrarianOrSuperUser]
    serializer_class = UpdateLibrarianSerializer

    def patch(self, request, user_id):
        user = get_object_or_404(User, pk=user_id, role=RoleChoices.LIBRARIAN)
        serializer = self.serializer_class(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)
    

class UpdateLibrarianCredentialsView(APIView):
    permission_classes = [IsLibrarianOrSuperUser]
    serializer_class = UpdateLibrarianCredentialsSerializer

    def patch(self, request, user_id):
        user = get_object_or_404(User, pk=user_id, role=RoleChoices.LIBRARIAN)
        serializer = self.serializer_class(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Credentials updated successfully"}, status=status.HTTP_200_OK)


def update_reader(user, request, serializer_class):
    serializer = serializer_class(user, data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response({"detail": "Reader credentials updated successfully"}, status=status.HTTP_200_OK)


class UpdateReaderCredentialsView(APIView):
    permission_classes = [IsLibrarianOrSuperUser]
    serializer_class = UpdateReaderCredentialsSerializer

    def patch(self, request, user_id):
        user = get_object_or_404(User, pk=user_id, role=RoleChoices.READER)
        return update_reader(user, request, self.serializer_class)
    

class UpdateReaderActiveStatusView(APIView):
    permission_classes = [IsLibrarianOrSuperUser]
    serializer_class = UpdateReaderActiveStatusSerializer

    def patch(self, request, user_id):
        user = get_object_or_404(User, pk=user_id, role=RoleChoices.READER)
        return update_reader(user, request, self.serializer_class)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == RoleChoices.READER:
            serializer = ReaderDetailSerializer(user)
        elif user.role == RoleChoices.LIBRARIAN:
            serializer = LibrarianDetailSerializer(user)
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
    

class LibrariansListView(ListAPIView):
    queryset = User.objects.filter(role=RoleChoices.LIBRARIAN).order_by('-created_at')
    permission_classes = [IsSuperUser]
    serializer_class = LibrariansListSerializer


class ReaderDeleteView(APIView):
    permission_classes = [IsLibrarianOrSuperUser]

    def delete(self, request, user_id):
        user = get_object_or_404(User, pk=user_id, role=RoleChoices.READER)
        if user.order:
            return Response({"detail": "Cannot delete an active reader"}, status=status.HTTP_400_BAD_REQUEST)
        user.delete()
        return Response({"detail": "Reader deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    

class LibrarianDeleteView(DestroyAPIView):
    queryset = User.objects.filter(role=RoleChoices.LIBRARIAN)
    permission_classes = [IsSuperUser]


class LogoutView(APIView):
    def post(self, request):
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"detail": "Logged out"})