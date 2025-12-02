from django.urls import path
from .views import (
    CorreoMasivoListCreateView,
    CorreoMasivoDetailView,
    EnviarCorreoMasivoView
)

urlpatterns = [
    # Listar y crear correos masivos
    path("", CorreoMasivoListCreateView.as_view(), name="correos-list-create"),

    # Obtener, editar o eliminar un correo masivo específico
    path("<int:pk>/", CorreoMasivoDetailView.as_view(), name="correos-detail"),

    # Enviar un correo masivo (genera destinatarios y luego lo conectaremos a SendGrid)
    path("<int:pk>/enviar/", EnviarCorreoMasivoView.as_view(), name="correos-enviar"),
]
