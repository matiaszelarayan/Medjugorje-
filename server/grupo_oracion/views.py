from rest_framework import viewsets, permissions
from .models import GrupoDeOracion
from .serializers import GrupoDeOracionSerializer
from accounts.permissions import IsAdministrador, IsColaborador, IsAdminOrColaborador

class GrupoDeOracionViewSet(viewsets.ModelViewSet):
    queryset = GrupoDeOracion.objects.all().order_by("nombre_grupo")
    serializer_class = GrupoDeOracionSerializer

    def get_permissions(self):

        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdministrador()]

        if self.action in ["list", "retrieve"]:
            return [IsAdminOrColaborador()]

        return [permissions.IsAuthenticated()]
