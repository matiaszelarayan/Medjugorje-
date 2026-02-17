from rest_framework import serializers
from .models import CorreoMasivo, DestinatarioCorreo
from .utils import obtener_contactos_para_correo


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
    cantidad_destinatarios = serializers.SerializerMethodField()

    class Meta:
        model = CorreoMasivo
        fields = [
            "id",
            "titulo",
            "asunto",
            "contenido",
            "estado",
            "provincia",
            "ciudad",
            "grupo_oracion",
            "creado_por",
            "fecha_creacion",
            "fecha_envio",
            "destinatarios",
            "cantidad_destinatarios",
        ]
        read_only_fields = ["creado_por", "fecha_creacion", "fecha_envio"]
    
    def get_cantidad_destinatarios(self, obj):
        # Si ya está enviado, contar desde destinatarios existentes
        if obj.estado == CorreoMasivo.ESTADO_ENVIADO:
            return obj.destinatarios.count()
        
        # Si es borrador, calcular dinámicamente
        _, cantidad = obtener_contactos_para_correo(obj)
        return cantidad

    def create(self, validated_data):
        """
        Crea el correo masivo, pero no genera los destinatarios 
        Eso se hará cuando se presione "Enviar".
        """

        correo = CorreoMasivo.objects.create(
            **validated_data
        )

        return correo
