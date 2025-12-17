from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

class Evento(models.Model):
    titulo = models.CharField(max_length=100, unique=True)
    fecha_inicio = models.DateTimeField()
    fecha_fin = models.DateTimeField()
    ubicacion = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    publico = models.BooleanField(default=True)
    url = models.URLField(blank=True, null=True)

    creado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="eventos_creados"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        if self.fecha_fin <= self.fecha_inicio:
            raise ValidationError("La fecha de fin debe ser posterior a la fecha de inicio")

    def __str__(self):
        return self.titulo

