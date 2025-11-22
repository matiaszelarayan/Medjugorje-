from django.urls import path
from . import views

urlpatterns = [
    path("perfil/", views.perfil_view, name="accounts-perfil"),     
    path("crear/", views.crear_usuario_view, name="accounts-crear"),
    path("lista/", views.lista_usuarios_view, name="accounts-lista"),
    path("editar/<int:user_id>/", views.editar_usuario_view, name="accounts-editar"),
    path("eliminar/<int:user_id>/", views.eliminar_usuario_view, name="accounts-eliminar"),
    path("editar-mi-perfil/", views.editar_mi_perfil_view, name="accounts-editar-mi-perfil"),
]
