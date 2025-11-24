from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ContactoViewSet, ContactoPublicCreateView

router = DefaultRouter()
router.register(r'', ContactoViewSet, basename="contactos")

urlpatterns = [
    path("public/", ContactoPublicCreateView.as_view(), name="contacto-public"),
]

urlpatterns += router.urls
