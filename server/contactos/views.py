from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status
from accounts.permissions import IsAdministrador, IsColaborador, IsAdminOrColaborador

from .models import Contacto
from .serializers import ContactoSerializer

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

class ContactoViewSet(viewsets.ModelViewSet):
    queryset = Contacto.objects.all().order_by('-created_at')
    serializer_class = ContactoSerializer

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

    def post(self, request):
        serializer = ContactoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Creación pública → sin usuario creador
        contacto = serializer.save(creado_por=None)

        return Response(
            ContactoSerializer(contacto).data,
            status=status.HTTP_201_CREATED,
        )

