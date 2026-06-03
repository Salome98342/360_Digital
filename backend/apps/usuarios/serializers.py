from rest_framework import serializers
from apps.productos.models import Administrador


class AdministradorSerializer(serializers.ModelSerializer):
    """
    Serializer para mostrar datos del administrador (sin contraseña).
    """
    class Meta:
        model = Administrador
        fields = ['id', 'usuario', 'correo', 'fecha_creacion']


class LoginSerializer(serializers.Serializer):
    """
    Serializer para validar credenciales de login.
    """
    usuario = serializers.CharField(max_length=50)
    contrasena = serializers.CharField(max_length=255, write_only=True)

    def validate(self, data):
        """
        Validar que el usuario existe y la contraseña es correcta.
        """
        usuario = data.get('usuario')
        contrasena = data.get('contrasena')

        try:
            admin = Administrador.objects.get(usuario=usuario)
            if not admin.check_password(contrasena):
                raise serializers.ValidationError("Credenciales inválidas.")
        except Administrador.DoesNotExist:
            raise serializers.ValidationError("Credenciales inválidas.")

        data['admin'] = admin
        return data
