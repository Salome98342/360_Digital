"""
Views for productos app.
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from .models import (
    Administrador, Servicio, CategoriaProducto, Producto,
    GaleriaProducto, Resena, FormularioContacto, Especificacion
)
from .serializers import (
    AdministradorSerializer, ServicioSerializer, CategoriaProductoSerializer,
    ProductoListSerializer, ProductoDetailSerializer, GaleriaProductoSerializer,
    ResenaSerializer, FormularioContactoSerializer, EspecificacionSerializer
)
from .permissions import IsAdminOrReadOnly
from .services import enviar_email_contacto, enviar_confirmacion_contacto


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


class ProductoViewSet(viewsets.ModelViewSet):
    """ViewSet para productos (CRUD completo)"""
    queryset = Producto.objects.filter(activo=True)
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['id_categoria__nombre']
    search_fields = ['nombre', 'descripcion']
    ordering_fields = ['precio', 'fecha_creacion']
    ordering = ['-fecha_creacion']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductoDetailSerializer
        return ProductoListSerializer
    
    @action(detail=True, methods=['post'], parser_classes=(MultiPartParser, FormParser))
    def upload_image(self, request, pk=None):
        """
        Subir imagen a la galería del producto
        POST: Cargar nueva imagen
        Requiere 'imagen' como file y opcionalmente 'descripcion'
        """
        producto = self.get_object()
        
        if 'imagen' not in request.FILES:
            return Response(
                {'detail': 'No se envió imagen'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        imagen = request.FILES['imagen']
        descripcion = request.data.get('descripcion', '')
        
        try:
            galeria = GaleriaProducto.objects.create(
                id_producto=producto,
                url_imagen=imagen,
                descripcion=descripcion
            )
            serializer = GaleriaProductoSerializer(galeria, context={'request': request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'detail': f'Error al subir imagen: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['delete'])
    def delete_image(self, request, pk=None):
        """
        Eliminar imagen de la galería
        DELETE: /productos/{producto_id}/delete_image/?image_id={galeria_id}
        """
        try:
            image_id = request.query_params.get('image_id')
            if not image_id:
                return Response(
                    {'detail': 'Se requiere image_id'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            galeria = GaleriaProducto.objects.get(id=image_id, id_producto_id=pk)
            galeria.delete()
            return Response(
                {'detail': 'Imagen eliminada exitosamente'},
                status=status.HTTP_200_OK
            )
        except GaleriaProducto.DoesNotExist:
            return Response(
                {'detail': 'Imagen no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'detail': f'Error: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
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
        """Crear nuevo mensaje de contacto y enviar emails"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            contacto = serializer.save()
            
            # Enviar email al equipo
            enviar_email_contacto(contacto)
            
            # Enviar email de confirmación al cliente
            enviar_confirmacion_contacto(contacto)
            
            return Response(
                {'detail': 'Mensaje recibido correctamente'},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EspecificacionViewSet(viewsets.ModelViewSet):
    """ViewSet para especificaciones de productos"""
    queryset = Especificacion.objects.all()
    serializer_class = EspecificacionSerializer
    permission_classes = [IsAdminOrReadOnly]
    pagination_class = None
