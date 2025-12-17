from django.db import models
from django.conf import settings

class GrupoDeOracion(models.Model):
    nombre_grupo = models.CharField(max_length=150)
    provincia = models.CharField(max_length=100, blank=True)
    localidad = models.CharField(max_length=100, blank=True)

    responsable = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="grupos_responsables"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["nombre_grupo"]


    def __str__(self):
        return self.nombre_grupo
