from rest_framework.permissions import BasePermission

class IsAdministrador(BasePermission):
    """
    Permite únicamente a usuarios con rol 'administrador'.
    """
    def has_permission(self, request, view):
        user = request.user
        return user.is_authenticated and user.role == "administrador"
    
class IsColaborador(BasePermission):
    """
    Permite únicamente a usuarios con rol 'colaborador'.
    """
    def has_permission(self, request, view):
        user = request.user
        return user.is_authenticated and user.role == "colaborador"

from rest_framework.permissions import BasePermission

class IsAdminOrColaborador(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return user.is_authenticated and user.role in ["administrador", "colaborador"]

