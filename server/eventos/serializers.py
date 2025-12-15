from rest_framework import serializers
from .models import Evento


class EventoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Evento
        fields = '__all__'
        read_only_fields = (
            'creado_por',
            'created_at',
            'updated_at',
        )
        
    def validate(self, data):
        fecha_inicio = data.get('fecha_inicio', self.instance.fecha_inicio if self.instance else None)
        fecha_fin = data.get('fecha_fin', self.instance.fecha_fin if self.instance else None)

        if fecha_inicio and fecha_fin and fecha_fin < fecha_inicio:
            raise serializers.ValidationError(
                "La fecha de fin no puede ser anterior a la fecha de inicio"
            )

        return data
