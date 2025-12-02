from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone

from .models import CorreoMasivo, DestinatarioCorreo
from .serializers import CorreoMasivoSerializer
from contactos.models import Contacto

from .sendgrid_service import enviar_multiples_correos


#  Crear y listar correos masivos (solo borradores)
class CorreoMasivoListCreateView(generics.ListCreateAPIView):
    queryset = CorreoMasivo.objects.all().order_by("-fecha_creacion")
    serializer_class = CorreoMasivoSerializer
    permission_classes = [permissions.IsAuthenticated]

    # agregar permisos


    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)


#  Obtener, editar o eliminar un correo masivo
class CorreoMasivoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CorreoMasivo.objects.all()
    serializer_class = CorreoMasivoSerializer
    permission_classes = [permissions.IsAuthenticated]



# para enviar correo masivo

class EnviarCorreoMasivoView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):

        try:
            correo = CorreoMasivo.objects.get(pk=pk)
        except CorreoMasivo.DoesNotExist:
            return Response({"error": "Correo masivo no encontrado"}, status=404)

        # CONTACTOS DE PROVINCIA + CIUDAD 
        contactos_prov_ciudad = Contacto.objects.all()

        # newsletter
        if correo.solo_newsletter:
            contactos_prov_ciudad = contactos_prov_ciudad.filter(participa_grupo=True)

        # provincia
        if correo.provincia and correo.provincia.strip():
            contactos_prov_ciudad = contactos_prov_ciudad.filter(
                provincia__iexact=correo.provincia.strip()
            )

        # ciudad
        if correo.ciudad and correo.ciudad.strip():
            contactos_prov_ciudad = contactos_prov_ciudad.filter(
                ciudad__iexact=correo.ciudad.strip()
            )

        # CONTACTOS DEL GRUPO (INDEPENDIENTES) 
        if correo.grupo_oracion:
            contactos_grupo = Contacto.objects.filter(grupo_oracion=correo.grupo_oracion)
        else:
            contactos_grupo = Contacto.objects.none()

        contactos_ids = set()

        # agrega todos los de provincia-ciudad
        for c in contactos_prov_ciudad:
            contactos_ids.add(c.id)

        # agrega todos los del grupo aunque no coincidan prov/ciudad
        for c in contactos_grupo:
            contactos_ids.add(c.id)

        contactos = Contacto.objects.filter(id__in=contactos_ids)

        if not contactos.exists():
            return Response({"error": "No hay destinatarios para enviar"}, status=400)
        
        emails_destinatarios = [c.email for c in contactos]

        # CREAR DESTINATARIOS 
        destinatarios_creados = []

        for contacto in contactos:
            destinatario, creado = DestinatarioCorreo.objects.get_or_create(
                correo=correo,
                contacto=contacto,
                defaults={"email": contacto.email}
            )
            destinatarios_creados.append(destinatario.id)

        enviar_multiples_correos(
            destinatarios=emails_destinatarios,
            asunto=correo.asunto,
            contenido_html=correo.contenido
        )

        #  MARCAR COMO ENVIADO 
        correo.estado = "enviado"
        correo.fecha_envio = timezone.now()
        correo.save()

        return Response({
            "mensaje": "Destinatarios generados correctamente",
            "correo_id": correo.id,
            "destinatarios": destinatarios_creados
        })
