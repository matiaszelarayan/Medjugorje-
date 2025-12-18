from django.db import models
from django.conf import settings
from grupo_oracion.models import GrupoDeOracion


class Contacto(models.Model):
    SEXO_CHOICES = [
        ("masculino", "Masculino"),
        ("femenino", "Femenino"),
        ("otro", "Otro"),
    ]

    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    sexo = models.CharField(max_length=9, choices=SEXO_CHOICES, blank=True)
    pais = models.CharField(max_length=100, blank=True)
    provincia = models.CharField(max_length=100, blank=True)
    ciudad = models.CharField(max_length=100, blank=True)
    
    fecha_registro = models.DateField(auto_now_add=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)

    celular = models.CharField(max_length=20, blank=True)
    instagram = models.CharField(max_length=100, blank=True)
    parroquia = models.CharField(max_length=100, blank=True)
    participa_grupo = models.BooleanField(default=False)

    grupo_oracion = models.ForeignKey(
        GrupoDeOracion,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="contactos"
    )
  

    creado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="contactos_creados"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

