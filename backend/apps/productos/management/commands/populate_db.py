"""
Management command para popular la base de datos con datos iniciales.
"""
from django.core.management.base import BaseCommand
from django.db import IntegrityError
from apps.productos.models import (
    Administrador, Servicio, CategoriaProducto, Producto, GaleriaProducto
)


class Command(BaseCommand):
    help = 'Popula la base de datos con datos iniciales'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Iniciando población de datos...'))
        
        # Limpiar todos los productos
        Producto.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('✓ Base de datos limpiada - todos los productos eliminados'))

        # Crear administrador
        try:
            admin, created = Administrador.objects.get_or_create(
                usuario='admin',
                defaults={
                    'correo': 'admin@360digital.com',
                    'contrasena': 'admin123'  # En producción usar hash
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS('✓ Administrador creado'))
            else:
                self.stdout.write('✓ Administrador ya existe')
        except IntegrityError:
            self.stdout.write('✓ Administrador ya existe')

        # Crear servicios
        servicios_data = [
            {
                'nombre': 'Gestión de Redes Sociales',
                'descripcion': 'Administración estratégica y creación de contenido para tus redes sociales',
                'imagen': 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop'
            },
            {
                'nombre': 'Branding',
                'descripcion': 'Desarrollo completo de identidad visual y marca corporativa',
                'imagen': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop'
            },
            {
                'nombre': 'Posicionamiento de Marca',
                'descripcion': 'Estrategias de posicionamiento en buscadores y mercado',
                'imagen': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'
            },
            {
                'nombre': 'Páginas Web',
                'descripcion': 'Diseño y desarrollo de sitios web responsive y modernos',
                'imagen': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop'
            },
            {
                'nombre': 'Comunicación Organizacional',
                'descripcion': 'Estrategias de comunicación interna y externa',
                'imagen': 'https://images.unsplash.com/photo-1460925895917-adf4e565f900?w=400&h=300&fit=crop'
            },
            {
                'nombre': 'Producción Audiovisual',
                'descripcion': 'Videos profesionales, edición y contenido multimedia',
                'imagen': 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=400&h=300&fit=crop'
            }
        ]

        for servicio_data in servicios_data:
            try:
                servicio, created = Servicio.objects.get_or_create(
                    nombre=servicio_data['nombre'],
                    defaults=servicio_data
                )
                if created:
                    self.stdout.write(f'✓ Servicio creado: {servicio.nombre}')
                else:
                    self.stdout.write(f'✓ Servicio ya existe: {servicio.nombre}')
            except IntegrityError:
                self.stdout.write(f'✓ Servicio ya existe: {servicio_data["nombre"]}')

        # Crear categorías
        categorias_data = [
            {'nombre': 'Tarjetas', 'descripcion': 'Tarjetas de presentación profesionales'},
            {'nombre': 'Volantes', 'descripcion': 'Volantes y flyers publicitarios'},
        ]

        for categoria_data in categorias_data:
            try:
                categoria, created = CategoriaProducto.objects.get_or_create(
                    nombre=categoria_data['nombre'],
                    defaults=categoria_data
                )
                if created:
                    self.stdout.write(f'✓ Categoría creada: {categoria.nombre}')
                else:
                    self.stdout.write(f'✓ Categoría ya existe: {categoria.nombre}')
            except IntegrityError:
                self.stdout.write(f'✓ Categoría ya existe: {categoria_data["nombre"]}')

        # Crear productos
        admin = Administrador.objects.get(usuario='admin')
        categoria_tarjetas = CategoriaProducto.objects.get(nombre='Tarjetas')
        categoria_volantes = CategoriaProducto.objects.get(nombre='Volantes')

        # URLs de imágenes desde Google Drive
        url_tarjetas = 'https://drive.google.com/uc?export=view&id=1-ecExmyjCqiVpIh0I-U7kcrEuX4FiGdE'
        url_volantes = 'https://drive.google.com/uc?export=view&id=1ASemTPV7g37nMRfymVRHcHwUanYkpxrW'

        productos_data = [
            # Tarjetas de Presentación
            {
                'nombre': 'Tarjetas 1 Cara Full Color - Respaldo Escala de Grises',
                'categoria': categoria_tarjetas,
                'precio': '80000.00',
                'descripcion': 'Tarjetas de presentación profesionales con una cara en full color y respaldo en escala de grises.',
                'especificaciones': {
                    'tamaño': '9x5.5 cm',
                    'cantidad': '1000 unidades',
                    'acabado_frente': '1 cara full color',
                    'acabado_respaldo': 'Respaldo escala de grises',
                    'material': 'Papel brillante',
                    'calidad': 'Profesional'
                },
                'imagen_principal': url_tarjetas
            },
            {
                'nombre': 'Tarjetas Full Color Mate con Brillo UV',
                'categoria': categoria_tarjetas,
                'precio': '100000.00',
                'descripcion': 'Tarjetas de presentación con acabado mate y detalles de brillo UV para un efecto premium.',
                'especificaciones': {
                    'tamaño': '9x5.5 cm',
                    'cantidad': '1000 unidades',
                    'acabado': 'Mate con brillo UV parcial',
                    'material': 'Cartulina premium',
                    'calidad': 'Premium',
                    'efecto': 'Brillo UV selectivo'
                },
                'imagen_principal': url_tarjetas
            },
            {
                'nombre': 'Tarjetas Full Color Ambas Caras con Brillo UV',
                'categoria': categoria_tarjetas,
                'precio': '120000.00',
                'descripcion': 'Tarjetas de presentación de lujo con full color en ambas caras y acabado mate con brillo UV.',
                'especificaciones': {
                    'tamaño': '9x5.5 cm',
                    'cantidad': '1000 unidades',
                    'acabado': 'Mate brillo UV ambas caras',
                    'colores': 'Full color',
                    'material': 'Cartulina premium',
                    'calidad': 'Premium deluxe'
                },
                'imagen_principal': url_tarjetas
            },
            # Volantes Publicitarios
            {
                'nombre': 'Volantes 4x0 - Una Cara Full Color',
                'categoria': categoria_volantes,
                'precio': '110000.00',
                'descripcion': 'Volantes de una cara en full color, ideales para publicidad simple pero efectiva.',
                'especificaciones': {
                    'tamaño': '12.5x20.5 cm',
                    'cantidad': '1000 unidades',
                    'acabado': '4x0 (una cara color)',
                    'material': 'Propalcote 115 gr',
                    'impresión': 'Full color',
                    'uso': 'Publicidad, promoción'
                },
                'imagen_principal': url_volantes
            },
            {
                'nombre': 'Volantes 4x1 - Frente Color Respaldo B&N',
                'categoria': categoria_volantes,
                'precio': '130000.00',
                'descripcion': 'Volantes con frente en full color y respaldo en blanco y negro para información adicional.',
                'especificaciones': {
                    'tamaño': '12.5x20.5 cm',
                    'cantidad': '1000 unidades',
                    'acabado': '4x1 (frente color, respaldo B&N)',
                    'material': 'Propalcote 115 gr',
                    'impresión': 'Frente color, respaldo blanco y negro',
                    'uso': 'Información, promoción'
                },
                'imagen_principal': url_volantes
            },
            {
                'nombre': 'Volantes 4x4 - Dos Caras Full Color',
                'categoria': categoria_volantes,
                'precio': '180000.00',
                'descripcion': 'Volantes premium con ambas caras en full color para máximo impacto visual.',
                'especificaciones': {
                    'tamaño': '12.5x20.5 cm',
                    'cantidad': '1000 unidades',
                    'acabado': '4x4 (full color ambas caras)',
                    'material': 'Propalcote 115 gr',
                    'impresión': 'Full color ambas caras',
                    'uso': 'Publicidad premium, promoción'
                },
                'imagen_principal': url_volantes
            }
        ]

        for producto_data in productos_data:
            try:
                categoria = producto_data.pop('categoria')
                imagen_principal = producto_data.pop('imagen_principal')
                
                producto, created = Producto.objects.get_or_create(
                    nombre=producto_data['nombre'],
                    id_categoria=categoria,
                    defaults={
                        'id_admin': admin,
                        'precio': producto_data['precio'],
                        'descripcion': producto_data['descripcion'],
                        'especificaciones': producto_data['especificaciones']
                    }
                )
                
                if created:
                    # Crear galería de imágenes
                    GaleriaProducto.objects.create(
                        id_producto=producto,
                        url_imagen=imagen_principal,
                        descripcion='Imagen principal'
                    )
                    self.stdout.write(f'✓ Producto creado: {producto.nombre}')
                else:
                    self.stdout.write(f'✓ Producto ya existe: {producto.nombre}')
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'✗ Error con {producto_data.get("nombre", "desconocido")}: {str(e)}'))

        self.stdout.write(self.style.SUCCESS('\n✓ Población de datos completada exitosamente!'))
