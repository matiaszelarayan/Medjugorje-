from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone

from .models import CorreoMasivo, DestinatarioCorreo
from .serializers import CorreoMasivoSerializer


from .sendgrid_service import enviar_multiples_correos
from .utils import obtener_contactos_para_correo
from accounts.permissions import IsAdministrador, IsAdminOrColaborador


#  Crear y listar correos masivos (solo borradores)
class CorreoMasivoListCreateView(generics.ListCreateAPIView):
    queryset = CorreoMasivo.objects.all().order_by("-fecha_creacion")
    serializer_class = CorreoMasivoSerializer
    permission_classes = [IsAdminOrColaborador]


    def create(self, request, *args, **kwargs):
       serializer = self.get_serializer(data=request.data)
       serializer.is_valid(raise_exception=True)
   
       correo = serializer.save(creado_por=request.user)
   
      # validated_data = serializer.validated_data
      # validated_data['creado_por'] = request.user
      # correo = CorreoMasivo.objects.create(**validated_data)
       contactos, cantidad = obtener_contactos_para_correo(correo)
   
       return Response(
           {
             "id": correo.id,
             "titulo": correo.titulo,
             "asunto": correo.asunto,
             "contenido": correo.contenido,
             "provincia": correo.provincia,
             "ciudad": correo.ciudad,
             "grupo_oracion": correo.grupo_oracion_id,
             "solo_newsletter": correo.solo_newsletter,
             "estado": correo.estado,
             "fecha_creacion": correo.fecha_creacion,
             "cantidad_destinatarios": cantidad,
           },
           status=status.HTTP_201_CREATED
       )


#  Obtener, editar o eliminar un correo masivo
class CorreoMasivoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CorreoMasivo.objects.all()
    serializer_class = CorreoMasivoSerializer
    permission_classes = [IsAdminOrColaborador]

# para enviar correo masivo
class EnviarCorreoMasivoView(APIView):
    permission_classes = [IsAdministrador]

    def post(self, request, pk):

        try:
            correo = CorreoMasivo.objects.get(pk=pk)
        except CorreoMasivo.DoesNotExist:
            return Response({"error": "Correo masivo no encontrado"}, status=404)

        contactos, cantidad = obtener_contactos_para_correo(correo)

        if cantidad == 0:
            return Response({"error": "No hay destinatarios para enviar"}, status=400)

        # crear destinatarios
        destinatarios_creados = []
        for contacto in contactos:
            destinatario, creado = DestinatarioCorreo.objects.get_or_create(
                correo=correo,
                contacto=contacto,
                defaults={"email": contacto.email}
            )
            destinatarios_creados.append(destinatario.id)

        # enviar correos
        emails_destinatarios = [c.email for c in contactos]

        enviar_multiples_correos(
            destinatarios=emails_destinatarios,
            asunto=correo.asunto,
            contenido_html=correo.contenido
        )

        correo.estado = "enviado"
        correo.fecha_envio = timezone.now()
        correo.save()

        return Response({
            "mensaje": "Enviado correctamente",
            "cantidad_destinatarios": cantidad,
            "correo_id": correo.id,
            "destinatarios": destinatarios_creados,
            "fecha_envio": correo.fecha_envio,
            "estado": correo.estado
        })
