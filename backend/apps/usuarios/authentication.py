"""
Autenticación personalizada para JWT en cookies.
"""
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken


class CookieJWTAuthentication(JWTAuthentication):
    """
    Extender JWTAuthentication para leer tokens desde cookies HttpOnly
    en lugar de del header Authorization.
    """
    
    def get_user(self, validated_token):
        """
        No traemos usuario de Django User model.
        Retornamos un mock user basado en los datos del token.
        """
        class MockUser:
            def __init__(self, admin_id, usuario):
                self.id = admin_id
                self.username = usuario
                self.is_authenticated = True
        
        return MockUser(
            validated_token.get('admin_id', 1),
            validated_token.get('usuario', 'admin')
        )
    
    def authenticate(self, request):
        """
        Extraer y validar el token JWT de la cookie.
        """
        # Primero intentar obtener el token del header Authorization (estándar)
        auth_header = self.get_header(request)
        if auth_header:
            try:
                return super().authenticate(request)
            except AuthenticationFailed:
                pass
        
        # Si no hay header o falla, intentar obtener de la cookie
        access_token = request.COOKIES.get('access_token')
        
        if not access_token:
            return None
        
        try:
            # Validar el token
            validated_token = self.get_validated_token(access_token)
            
            # Obtener usuario (usando nuestro método override)
            user = self.get_user(validated_token)
            
            return (user, validated_token)
        except (InvalidToken, AuthenticationFailed) as e:
            # Si el token es inválido, retornar None (no autenticado)
            return None


