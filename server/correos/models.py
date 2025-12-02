from django.db import models
from django.conf import settings
from contactos.models import Contacto
from grupo_oracion.models import GrupoDeOracion


class CorreoMasivo(models.Model):

    ESTADOS = [
        ( "borrador", "Borrador"),
        ("enviado", "Enviado"),
    ]

    titulo = models.CharField("título", max_length=255)
    asunto = models.CharField("asunto", max_length=255)
    contenido = models.TextField("contenido")

    estado = models.CharField(
        "estado",
        max_length=20,
        choices=ESTADOS,
        default="borrador"
    )

    # Filtros para seleccionar destinatarios
    solo_newsletter = models.BooleanField("solo newsletter", default=False)
    provincia = models.CharField("provincia", max_length=100, blank=True)
    ciudad = models.CharField("ciudad", max_length=100, blank=True)

    grupo_oracion = models.ForeignKey(
        GrupoDeOracion,
        verbose_name="grupo de oración",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="correos_masivos"
    )

    creado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name="creado por",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="correos_masivos_creados"
    )

    fecha_creacion = models.DateTimeField("fecha de creación", auto_now_add=True)
    fecha_envio = models.DateTimeField("fecha de envío", null=True, blank=True)

    def __str__(self):
        return f"{self.titulo} ({self.estado})"


class DestinatarioCorreo(models.Model):
    """
    Registra a que contacto se le envió o intentó enviar
    un correo masivo y cuál fue el resultado.
    """

    correo = models.ForeignKey(
        CorreoMasivo,
        on_delete=models.CASCADE,
        related_name="destinatarios",
        verbose_name="correo masivo"
    )

    contacto = models.ForeignKey(
        Contacto,
        on_delete=models.CASCADE,
        related_name="envios_correos_masivos",
        verbose_name="contacto"
    )

    email = models.EmailField("email") 
    enviado = models.BooleanField("enviado", default=False)
    fecha_envio = models.DateTimeField("fecha de envío", null=True, blank=True)
    error = models.TextField("error", blank=True)

    class Meta:
        unique_together = ("correo", "contacto")
        verbose_name = "destinatario"
        verbose_name_plural = "destinatarios"

    def __str__(self):
        return f"{self.email} → {self.correo.titulo}"
