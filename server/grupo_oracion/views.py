from rest_framework import viewsets, permissions, generics
from .models import GrupoDeOracion
from .serializers import GrupoDeOracionSerializer, GrupoDeOracionPublicSerializer
from accounts.permissions import IsAdministrador, IsColaborador, IsAdminOrColaborador

class GrupoDeOracionViewSet(viewsets.ModelViewSet):
    queryset = GrupoDeOracion.objects.all()
    serializer_class = GrupoDeOracionSerializer

    def get_permissions(self):

        if self.action in ["create", "destroy"]:
            return [IsAdministrador()]

        if self.action in ["list", "retrieve", "update", "partial_update"]:
            return [IsAdminOrColaborador()]


        return [permissions.IsAuthenticated()]

class GrupoDeOracionPublicListView(generics.ListAPIView):
    queryset = GrupoDeOracion.objects.all().order_by("nombre_grupo")
    serializer_class = GrupoDeOracionPublicSerializer
    permission_classes = [permissions.AllowAny]