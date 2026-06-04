"""
Permisos personalizados para la app de productos.
"""
from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permite que cualquiera lea los productos,
    pero solo administradores autenticados puedan crear/editar/eliminar.
    """
    
    def has_permission(self, request, view):
        # Permitir métodos seguros (GET, HEAD, OPTIONS) para todos
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Para POST, PUT, DELETE: requiere autenticación
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Permitir lectura para todos
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Solo admin puede editar/eliminar
        return request.user and request.user.is_authenticated
