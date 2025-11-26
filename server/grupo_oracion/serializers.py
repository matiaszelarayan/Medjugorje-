from rest_framework import serializers
from .models import GrupoDeOracion

class GrupoDeOracionSerializer(serializers.ModelSerializer):
    responsable_email = serializers.EmailField(source="responsable.email", read_only=True)

    class Meta:
        model = GrupoDeOracion
        fields = [
            "id",
            "nombre_grupo",
            "provincia",
            "localidad",
            "responsable",
            "responsable_email",
        ]
