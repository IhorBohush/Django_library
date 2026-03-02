from rest_framework.permissions import BasePermission
from .models import RoleChoices

class IsSuperUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_superuser


class IsLibrarian(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            request.user.role == RoleChoices.LIBRARIAN
        )


class IsLibrarianOrSuperUser(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            (request.user.is_superuser or request.user.role == RoleChoices.LIBRARIAN)
        )