"""
URL configuration for 360_Digital backend.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from apps.usuarios.views import AutenticacionViewSet

# Router para las vistas de autenticación
router = DefaultRouter()
router.register(r'autenticacion', AutenticacionViewSet, basename='autenticacion')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.productos.urls')),
    path('api/usuarios/', include(router.urls)),
    # Compatibilidad (por si el frontend intenta /api/administrador)
    path('api/administrador/', include(router.urls)),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
