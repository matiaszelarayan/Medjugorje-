from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status
from accounts.permissions import IsAdministrador, IsColaborador, IsAdminOrColaborador

from .models import Contacto
from .serializers import ContactoSerializer

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from core.pagination import StandardResultsSetPagination

from rest_framework.throttling import AnonRateThrottle, UserRateThrottle

class ContactoViewSet(viewsets.ModelViewSet):
    queryset = Contacto.objects.select_related('grupo_oracion', 'creado_por').all().order_by('-created_at')
    serializer_class = ContactoSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['nombre', 'apellido', 'email']
    filterset_fields = ['provincia', 'grupo_oracion']
    ordering_fields = ['apellido', 'nombre', 'created_at']
    throttle_classes = [UserRateThrottle]

    def get_permissions(self):

        if self.action == "destroy":
            return [IsAdministrador()]

        if self.action in ["create", "list", "retrieve", "update", "partial_update"]:
            return [IsAdminOrColaborador()]

        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)


class ContactoPublicCreateView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AnonRateThrottle]

    def post(self, request):
        serializer = ContactoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Creación pública → sin usuario creador
        contacto = serializer.save(creado_por=None)

        return Response(
            ContactoSerializer(contacto).data,
            status=status.HTTP_201_CREATED,
        )

