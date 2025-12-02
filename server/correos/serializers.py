from rest_framework import serializers
from .models import CorreoMasivo, DestinatarioCorreo
from contactos.models import Contacto


class DestinatarioCorreoSerializer(serializers.ModelSerializer):
    
    contacto_nombre = serializers.CharField(source="contacto.nombre", read_only=True)

    class Meta:
        model = DestinatarioCorreo
        fields = [
            "id",
            "contacto",
            "contacto_nombre",
            "email",
            "enviado",
            "fecha_envio",
            "error",
        ]


class CorreoMasivoSerializer(serializers.ModelSerializer):
    destinatarios = DestinatarioCorreoSerializer(many=True, read_only=True)

    class Meta:
        model = CorreoMasivo
        fields = [
            "id",
            "titulo",
            "asunto",
            "contenido",
            "estado",
            "solo_newsletter",
            "provincia",
            "ciudad",
            "grupo_oracion",
            "creado_por",
            "fecha_creacion",
            "fecha_envio",
            "destinatarios",
        ]
        read_only_fields = ["creado_por", "fecha_creacion", "fecha_envio"]

    def create(self, validated_data):
        """
        Crea el correo masivo, pero *NO* genera destinatarios todavía.
        Eso se hará cuando se presione "Enviar".
        """
        request = self.context.get("request")
        user = request.user if request else None

        correo = CorreoMasivo.objects.create(
            **validated_data
        )

        return correo
