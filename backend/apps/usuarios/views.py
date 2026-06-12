from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse
from apps.productos.models import Administrador
from .serializers import LoginSerializer, AdministradorSerializer



class AutenticacionViewSet(viewsets.ViewSet):
    """
    ViewSet para autenticación de administradores.
    """

    @action(detail=False, methods=['post'])
    def login(self, request):
        """
        Endpoint de login que genera tokens JWT.
        Los tokens se guardan en cookies HttpOnly.
        
        Request:
            {
                "usuario": "admin",
                "contrasena": "password123"
            }
        """
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            admin = serializer.validated_data['admin']
            
            # Generar tokens JWT manualmente (sin usar RefreshToken.for_user)
            from rest_framework_simplejwt.tokens import RefreshToken as RT
            from datetime import timedelta
            from django.utils import timezone
            
            refresh = RT()
            refresh['admin_id'] = admin.id
            refresh['usuario'] = admin.usuario
            
            access = refresh.access_token
            access['admin_id'] = admin.id
            access['usuario'] = admin.usuario
            
            # Crear respuesta
            response = Response({
                'detail': 'Login exitoso',
                'admin': AdministradorSerializer(admin).data,
                'admin_id': admin.id
            }, status=status.HTTP_200_OK)
            
            # Guardar tokens en cookies HttpOnly
            # Importante para producción (HTTPS + cross-site / Vercel + fetch con credentials)
            # En SameSite=None el navegador requiere Secure.
            response.set_cookie(
                key='access_token',
                value=str(access),
                httponly=True,
                secure=True,
                samesite='None',
                max_age=3600  # 1 hora
            )
            response.set_cookie(
                key='refresh_token',
                value=str(refresh),
                httponly=True,
                secure=True,
                samesite='None',
                max_age=86400 * 7  # 7 días
            )

            
            return response
        
        # DEBUG: Imprimir errores en la consola
        print("Errores del serializer:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def logout(self, request):
        """
        Endpoint para cerrar sesión.
        Borra las cookies.
        """
        response = Response(
            {'detail': 'Logout exitoso'},
            status=status.HTTP_200_OK
        )
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response

    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Obtener datos del admin autenticado.
        """
        # Obtener el admin_id del token validado (request.auth es el token)
        if hasattr(request, 'auth') and request.auth:
            admin_id = request.auth.get('admin_id')
        else:
            return Response(
                {'detail': 'No autenticado'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not admin_id:
            return Response(
                {'detail': 'No autenticado'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            admin = Administrador.objects.get(id=admin_id)
            return Response(AdministradorSerializer(admin).data)
        except Administrador.DoesNotExist:
            return Response(
                {'detail': 'Usuario no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'], permission_classes=[AllowAny], authentication_classes=[])
    def check_auth(self, request):
        """
        Verificar si el usuario está autenticado.
        Usado por el frontend para validar sesión.
        Permite solicitudes no autenticadas.
        """
        # Obtener token de la cookie
        access_token = request.COOKIES.get('access_token')
        
        if not access_token:
            return JsonResponse({
                'authenticated': False,
                'detail': 'No hay sesión activa'
            }, status=status.HTTP_200_OK)
        
        # Si llegamos aquí, el token es válido (validado por middleware)
        return JsonResponse({
            'authenticated': True,
            'detail': 'Sesión activa'
        })
