from django.utils.timezone import now
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from contactos.models import Contacto
from eventos.models import Evento
from correos.models import CorreoMasivo
from grupo_oracion.models import GrupoDeOracion


class DashboardResumenView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "contactos_total": Contacto.objects.count(),
            "eventos_proximos": Evento.objects.filter(
                fecha_inicio__gt=now()
            ).count(),
            "correos_enviados": CorreoMasivo.objects.filter(
                estado=CorreoMasivo.ESTADO_ENVIADO
            ).count(),
            "grupos_total": GrupoDeOracion.objects.count(),
        })

