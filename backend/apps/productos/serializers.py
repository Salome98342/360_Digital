"""
Serializers for productos app.
"""
from rest_framework import serializers
from .models import (
    Administrador, Servicio, CategoriaProducto, Producto,
    GaleriaProducto, Resena, FormularioContacto, Especificacion
)


class AdministradorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrador
        fields = ['usuario', 'correo']

class CategoriaProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaProducto
        fields = ['id', 'nombre', 'descripcion']


class EspecificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especificacion
        fields = ['id', 'id_producto', 'nombre', 'valor']


class GaleriaProductoSerializer(serializers.ModelSerializer):
    url_imagen = serializers.SerializerMethodField()

    class Meta:
        model = GaleriaProducto
        fields = ['id', 'url_imagen', 'descripcion']

    def get_url_imagen(self, obj):
        if not obj.url_imagen:
            return None
        image_name = str(obj.url_imagen)
        if image_name.startswith(('http://', 'https://')):
            return image_name

        image_name = str(obj.url_imagen)
        if image_name.startswith(('http://', 'https://')):
            return image_name

        image_url = obj.url_imagen.url
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(image_url)
        return image_url


class ResenaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resena
        fields = ['id', 'nombre_cliente', 'puntuacion', 'comentario', 'fecha_resena']
        read_only_fields = ['id', 'fecha_resena']


class ProductoListSerializer(serializers.ModelSerializer):
    """Serializer for product list view - supports read and write"""
    categoria = serializers.SerializerMethodField(read_only=True)
    categoria_nombre = serializers.CharField(write_only=True, required=False, allow_blank=True)
    especificaciones = EspecificacionSerializer(many=True, read_only=True)
    galeria = GaleriaProductoSerializer(many=True, read_only=True)
    
    class Meta:
        model = Producto
        fields = ['id', 'nombre', 'descripcion', 'precio', 'categoria', 'especificaciones', 'galeria', 'fecha_creacion', 'categoria_nombre']
        read_only_fields = ['id', 'fecha_creacion']
    
    def get_categoria(self, obj):
        return obj.id_categoria.nombre
    
    def create(self, validated_data):
        """Create a new product with category name lookup and admin assignment"""
        categoria_nombre = validated_data.pop('categoria_nombre', None)

        # Get category by name (case-insensitive)
        if categoria_nombre:
            categoria = CategoriaProducto.objects.filter(
                nombre__iexact=categoria_nombre
            ).first()
            if not categoria:
                raise serializers.ValidationError(
                    {'categoria': f'Category "{categoria_nombre}" not found'}
                )
            validated_data['id_categoria'] = categoria
        else:
            # Si el frontend manda id_categoria directamente, aceptarlo
            if validated_data.get('id_categoria'):
                pass
            else:
                raise serializers.ValidationError(
                    {'categoria': 'Category name is required'}
                )

        # Assign admin.
        # Preferimos admin desde request si el auth está funcionando,
        # si no, usamos el primer admin como fallback.
        request = self.context.get('request')
        admin_id = None
        if request and hasattr(request, 'auth') and request.auth:
            admin_id = request.auth.get('admin_id')

        from .models import Administrador
        admin = None
        if admin_id:
            admin = Administrador.objects.filter(id=admin_id).first()

        if not admin:
            admin = Administrador.objects.first()

        if not admin:
            raise serializers.ValidationError(
                {'admin': 'No admin user configured'}
            )

        validated_data['id_admin'] = admin

        # Filtrar campos extra que no existan en el modelo
        model_fields = {f.name for f in Producto._meta.get_fields() if hasattr(f, 'attname')}
        safe_data = {k: v for k, v in validated_data.items() if k in model_fields or k in {'id_categoria', 'id_admin'}}

        return Producto.objects.create(**safe_data)

    def update(self, instance, validated_data):
        """Update product fields and apply category name changes."""
        categoria_nombre = validated_data.pop('categoria_nombre', None)

        if categoria_nombre:
            categoria = CategoriaProducto.objects.filter(
                nombre__iexact=categoria_nombre
            ).first()
            if not categoria:
                raise serializers.ValidationError(
                    {'categoria': f'Category "{categoria_nombre}" not found'}
                )
            instance.id_categoria = categoria

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class ProductoDetailSerializer(serializers.ModelSerializer):
    """Serializer for product detail view"""
    categoria = serializers.SerializerMethodField()
    especificaciones = EspecificacionSerializer(many=True, read_only=True)
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
        fields = ['nombre_completo', 'correo', 'telefono', 'mensaje', 'contactar_por_whatsapp', 'contactar_por_correo']


#Servicio (las tarjetas del Inicio)
class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        # Nombres corregidos para coincidir con el modelo
        fields = ['id', 'nombre', 'descripcion', 'imagen', 'ruta_destino', 'activo'] 