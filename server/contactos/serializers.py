# contactos/serializers.py
from rest_framework import serializers
from .models import Contacto

class ContactoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contacto
        fields = "__all__"
        read_only_fields = ["id", "fecha_registro", "creado_por", "created_at", "updated_at"]
