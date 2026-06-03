from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
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
            
            # Generar tokens JWT
            refresh = RefreshToken.for_user(admin)
            
            # Crear respuesta
            response = Response({
                'detail': 'Login exitoso',
                'admin': AdministradorSerializer(admin).data,
                'user_id': admin.id
            }, status=status.HTTP_200_OK)
            
            # Guardar tokens en cookies HttpOnly
            response.set_cookie(
                key='access_token',
                value=str(refresh.access_token),
                httponly=True,
                secure=False,  # Cambiar a True en producción (HTTPS)
                samesite='Lax',
                max_age=3600  # 1 hora
            )
            response.set_cookie(
                key='refresh_token',
                value=str(refresh),
                httponly=True,
                secure=False,  # Cambiar a True en producción
                samesite='Lax',
                max_age=86400 * 7  # 7 días
            )
            
            return response
        
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
        # Obtener el usuario del token
        user_id = request.auth.user_id if hasattr(request.auth, 'user_id') else None
        
        if not user_id:
            return Response(
                {'detail': 'No autenticado'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            admin = Administrador.objects.get(id=user_id)
            return Response(AdministradorSerializer(admin).data)
        except Administrador.DoesNotExist:
            return Response(
                {'detail': 'Usuario no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def check_auth(self, request):
        """
        Verificar si el usuario está autenticado.
        Usado por el frontend para validar sesión.
        """
        # Obtener token de la cookie
        access_token = request.COOKIES.get('access_token')
        
        if not access_token:
            return JsonResponse({
                'authenticated': False,
                'detail': 'No hay sesión activa'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Si llegamos aquí, el token es válido (validado por middleware)
        return JsonResponse({
            'authenticated': True,
            'detail': 'Sesión activa'
        })
