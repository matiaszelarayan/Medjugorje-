from rest_framework.permissions import BasePermission
from core.messages import Messages
from accounts.models import User


class HasRole(BasePermission):
    allowed_roles = []

    message = Messages.PERMISSION_DENIED

    def has_permission(self, request, view):
        user = request.user
        return (
            user
            and user.is_authenticated
            and user.role in self.allowed_roles
        )

class IsAdministrador(HasRole):
    allowed_roles = [User.ROLE_ADMIN]


class IsColaborador(HasRole):
    allowed_roles = [User.ROLE_COLAB]


class IsAdminOrColaborador(HasRole):
    allowed_roles = [User.ROLE_ADMIN, User.ROLE_COLAB]
