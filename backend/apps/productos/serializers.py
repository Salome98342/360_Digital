"""
Serializers for productos app.
"""
from rest_framework import serializers
from .models import (
    Administrador, Servicio, CategoriaProducto, Producto,
    GaleriaProducto, Resena, FormularioContacto
)


class AdministradorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrador
        fields = ['usuario', 'correo']


class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = ['id', 'nombre', 'descripcion', 'imagen', 'activo']


class CategoriaProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaProducto
        fields = ['id', 'nombre', 'descripcion']


class GaleriaProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = GaleriaProducto
        fields = ['id', 'url_imagen', 'descripcion']


class ResenaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resena
        fields = ['id', 'nombre_cliente', 'puntuacion', 'comentario', 'fecha_resena']
        read_only_fields = ['id', 'fecha_resena']


class ProductoListSerializer(serializers.ModelSerializer):
    """Serializer for product list view"""
    categoria = serializers.SerializerMethodField()
    
    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'descripcion', 'precio', 'categoria', 'fecha_creacion']
    
    def get_categoria(self, obj):
        return obj.id_categoria.nombre


class ProductoDetailSerializer(serializers.ModelSerializer):
    """Serializer for product detail view"""
    categoria = serializers.SerializerMethodField()
    galeria = GaleriaProductoSerializer(many=True, read_only=True)
    resenas = ResenaSerializer(many=True, read_only=True)
    rating = serializers.SerializerMethodField()
    
    class Meta:
        model = Producto
        fields = [
            'id', 'nombre', 'descripcion', 'precio', 'categoria',
            'especificaciones', 'galeria', 'resenas', 'rating', 'fecha_creacion'
        ]
    
    def get_categoria(self, obj):
        return obj.id_categoria.nombre
    
    def get_rating(self, obj):
        resenas = obj.resenas.all()
        if not resenas:
            return 0
        total = sum(r.puntuacion for r in resenas)
        return round(total / len(resenas), 2)


class FormularioContactoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormularioContacto
        fields = ['nombre_completo', 'correo', 'telefono', 'mensaje']
