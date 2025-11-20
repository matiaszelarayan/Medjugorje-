from rest_framework.permissions import BasePermission

class IsAdministrador(BasePermission):
    """
    Permite únicamente a usuarios con rol 'administrador'.
    """
    def has_permission(self, request, view):
        user = request.user
        return user.is_authenticated and user.rol == "administrador"

