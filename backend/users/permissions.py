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
    

# class IsLibrarianOrReaderOrderOwner(BasePermission):
#     def has_permission(self, request, view):
#         if not request.user.is_authenticated:
#             return False

#         if request.user.role == RoleChoices.LIBRARIAN:
#             return True

#         user_id = request.query_params.get("user__id")

#         return (
#             request.user.role == RoleChoices.READER and
#             str(request.user.id) == str(user_id)
#         )