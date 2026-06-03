"""
URLs for productos app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ServicioViewSet, CategoriaProductoViewSet, ProductoViewSet,
    FormularioContactoViewSet
)

router = DefaultRouter()
router.register(r'servicios', ServicioViewSet, basename='servicio')
router.register(r'categorias', CategoriaProductoViewSet, basename='categoria')
router.register(r'productos', ProductoViewSet, basename='producto')
router.register(r'contacto', FormularioContactoViewSet, basename='contacto')

urlpatterns = [
    path('', include(router.urls)),
]
