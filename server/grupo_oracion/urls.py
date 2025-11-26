from rest_framework.routers import DefaultRouter
from .views import GrupoDeOracionViewSet

router = DefaultRouter()
router.register(r'', GrupoDeOracionViewSet, basename="grupo-oracion")

urlpatterns = router.urls
