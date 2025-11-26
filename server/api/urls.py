from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.index, name='index'),

    path('accounts/', include('accounts.urls')),
    path('contactos/', include('contactos.urls')),
    path('grupo-oracion/', include('grupo_oracion.urls')),
    
]
