"""
Views for productos app.
"""
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
from .services import enviar_email_contacto


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
            
            # Enviar email usando el servicio
            enviar_email_contacto(contacto)
            
            return Response(
                {'detail': 'Mensaje recibido correctamente'},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
