from rest_framework import viewsets
from .serializers import EventoSerializer
from .models import Evento
from rest_framework import permissions
from accounts.permissions import IsAdminOrColaborador, IsAdministrador
# from core.pagination import StandardResultsSetPagination

class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.select_related('creado_por').all().order_by('-created_at')
    serializer_class = EventoSerializer
    # pagination_class = StandardResultsSetPagination

    def get_permissions(self):

        if self.action == "destroy":
            return [IsAdministrador()]

        if self.action in ["create", "list", "retrieve", "update", "partial_update"]:
            return [IsAdminOrColaborador()]

        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)