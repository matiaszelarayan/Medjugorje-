from rest_framework.routers import DefaultRouter
from .views import GrupoDeOracionViewSet, GrupoDeOracionPublicListView
from django.urls import path

router = DefaultRouter()
router.register(r'', GrupoDeOracionViewSet, basename="grupo-oracion")

urlpatterns = [
    path("public/", GrupoDeOracionPublicListView.as_view(), name="grupos-public-list"),
]

urlpatterns += router.urls

