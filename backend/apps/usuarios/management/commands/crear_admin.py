from django.core.management.base import BaseCommand
from apps.productos.models import Administrador


class Command(BaseCommand):
    help = 'Crear administrador por defecto para 360 Digital'

    def add_arguments(self, parser):
        parser.add_argument(
            '--usuario',
            type=str,
            default='admin',
            help='Usuario del administrador'
        )
        parser.add_argument(
            '--correo',
            type=str,
            default='admin@360digital.com',
            help='Correo del administrador'
        )
        parser.add_argument(
            '--contrasena',
            type=str,
            default='admin123',
            help='Contraseña del administrador'
        )

    def handle(self, *args, **options):
        usuario = options['usuario']
        correo = options['correo']
        contrasena = options['contrasena']

        # Verificar si el usuario ya existe
        if Administrador.objects.filter(usuario=usuario).exists():
            self.stdout.write(
                self.style.WARNING(f'El administrador "{usuario}" ya existe.')
            )
            return

        # Crear el administrador
        admin = Administrador.objects.create(
            usuario=usuario,
            correo=correo,
            contrasena=contrasena
        )

        self.stdout.write(
            self.style.SUCCESS(
                f'✓ Administrador "{usuario}" creado exitosamente\n'
                f'  Correo: {correo}\n'
                f'  Contraseña: {contrasena}'
            )
        )
