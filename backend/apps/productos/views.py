"""
Views for productos app.
"""
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import (
    Administrador, Servicio, CategoriaProducto, Producto,
    GaleriaProducto, Resena, FormularioContacto
)
from .serializers import (
    AdministradorSerializer, ServicioSerializer, CategoriaProductoSerializer,
    ProductoListSerializer, ProductoDetailSerializer, GaleriaProductoSerializer,
    ResenaSerializer, FormularioContactoSerializer
)


class ServicioViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para servicios (solo lectura)"""
    queryset = Servicio.objects.filter(activo=True)
    serializer_class = ServicioSerializer
    pagination_class = None


class CategoriaProductoViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para categorías (solo lectura)"""
    queryset = CategoriaProducto.objects.all()
    serializer_class = CategoriaProductoSerializer
    pagination_class = None


class ProductoViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet para productos"""
    queryset = Producto.objects.filter(activo=True)
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['id_categoria__nombre']
    search_fields = ['nombre', 'descripcion']
    ordering_fields = ['precio', 'fecha_creacion']
    ordering = ['-fecha_creacion']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductoDetailSerializer
        return ProductoListSerializer
    
    @action(detail=True, methods=['get', 'post'])
    def resenas(self, request, pk=None):
        """
        GET: Obtener reseñas de un producto
        POST: Crear nueva reseña
        """
        producto = self.get_object()
        
        if request.method == 'GET':
            resenas = producto.resenas.all()
            serializer = ResenaSerializer(resenas, many=True)
            return Response(serializer.data)
        
        elif request.method == 'POST':
            serializer = ResenaSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(id_producto=producto)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FormularioContactoViewSet(viewsets.ModelViewSet):
    """ViewSet para formulario de contacto"""
    queryset = FormularioContacto.objects.all()
    serializer_class = FormularioContactoSerializer
    pagination_class = None
    
    def create(self, request, *args, **kwargs):
        """Crear nuevo mensaje de contacto y enviar email"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            contacto = serializer.save()
            
            # Enviar email al correo de 360 Digital
            subject = f"Nuevo mensaje de contacto de {contacto.nombre_completo}"
            message = f"""
Hola,

Tienes un nuevo mensaje de contacto en tu sitio web.

Información del contacto:
- Nombre: {contacto.nombre_completo}
- Correo: {contacto.correo}
- Teléfono: {contacto.telefono or 'No proporcionado'}

Mensaje:
{contacto.mensaje}

---
Este es un mensaje automático del sistema de contacto.
            """
            
            try:
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    ['publicidad360caicedonia@gmail.com'],
                    fail_silently=False,
                )
            except Exception as e:
                print(f"Error al enviar email: {str(e)}")
            
            return Response(
                {'detail': 'Mensaje recibido correctamente'},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
