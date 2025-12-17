from django.urls import path
from .views import DashboardResumenView

urlpatterns = [
    path("", DashboardResumenView.as_view(), name="dashboard-resumen"),
]
