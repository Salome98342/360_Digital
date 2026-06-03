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
            {'nombre': 'Tarjetas', 'descripcion': 'Tarjetas de presentación y visita'},
            {'nombre': 'Pendones', 'descripcion': 'Pendones publicitarios'},
            {'nombre': 'Cuadros', 'descripcion': 'Cuadros y arte impreso'},
            {'nombre': 'Logos', 'descripcion': 'Diseño de logos y marcas'},
            {'nombre': 'Empaques', 'descripcion': 'Diseño de empaques y cajas'},
            {'nombre': 'Identidad', 'descripcion': 'Identidad corporativa completa'},
            {'nombre': 'Volantes', 'descripcion': 'Volantes y flyers'},
            {'nombre': 'Posters', 'descripcion': 'Pósters y carteles'},
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
        categoria_pendones = CategoriaProducto.objects.get(nombre='Pendones')
        categoria_cuadros = CategoriaProducto.objects.get(nombre='Cuadros')
        categoria_logos = CategoriaProducto.objects.get(nombre='Logos')
        categoria_empaques = CategoriaProducto.objects.get(nombre='Empaques')
        categoria_identidad = CategoriaProducto.objects.get(nombre='Identidad')
        categoria_volantes = CategoriaProducto.objects.get(nombre='Volantes')
        categoria_posters = CategoriaProducto.objects.get(nombre='Posters')

        productos_data = [
            {
                'nombre': 'Tarjetas de Presentación - Diseño Premium',
                'categoria': categoria_tarjetas,
                'precio': '250.00',
                'descripcion': 'Tarjetas de presentación de diseño moderno y elegante con acabado mate y detalles en relieve.',
                'especificaciones': {
                    'dimensiones': '85 x 55 mm',
                    'material': 'Cartulina 300 gsm',
                    'acabado': 'Mate con laminado',
                    'produccion': '500 unidades',
                    'diseño': 'Minimalista con líneas geométricas',
                    'colores': 'Rojo corporativo, blanco y negro',
                    'tipografía': 'Anton y League Spartan',
                    'usos': 'Profesional, corporativo, negocios'
                },
                'imagen_principal': 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=800&h=600&fit=crop'
            },
            {
                'nombre': 'Pendón Publicitario - 3x2 metros',
                'categoria': categoria_pendones,
                'precio': '450.00',
                'descripcion': 'Pendón de lona vinílica para exterior con diseño impactante.',
                'especificaciones': {
                    'dimensiones': '3 x 2 metros',
                    'material': 'Lona vinílica 440 gsm',
                    'acabado': 'Impresión DTG de alto brillo',
                    'produccion': '1 unidad',
                    'diseño': 'Llamativo con elementos dinámicos',
                    'colores': 'Rojo, amarillo, blanco y negro',
                    'resolucion': '300 DPI',
                    'usos': 'Publicidad, eventos, tiendas'
                },
                'imagen_principal': 'https://images.unsplash.com/photo-1460925895917-adf4e565f900?w=800&h=600&fit=crop'
            },
            {
                'nombre': 'Cuadro Corporativo - Canvas 60x80 cm',
                'categoria': categoria_cuadros,
                'precio': '320.00',
                'descripcion': 'Cuadro decorativo en canvas de alta calidad con impresión gráfica.',
                'especificaciones': {
                    'dimensiones': '60 x 80 cm',
                    'material': 'Canvas 100% algodón',
                    'acabado': 'Impresión inkjet de archivo',
                    'produccion': '1 unidad',
                    'diseño': 'Abstracto y moderno',
                    'colores': 'Degradado rojo a amarillo',
                    'técnica': 'Impresión gráfica',
                    'usos': 'Decoración, oficinas, salas'
                },
                'imagen_principal': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop'
            },
            {
                'nombre': 'Diseño de Logo - Paquete Completo',
                'categoria': categoria_logos,
                'precio': '500.00',
                'descripcion': 'Diseño de logo profesional con múltiples variaciones.',
                'especificaciones': {
                    'dimensiones': 'Escalable',
                    'material': 'Digital (AI, PDF, PNG)',
                    'acabado': 'Alta definición',
                    'produccion': '1 paquete',
                    'diseño': 'Geométrico y minimalista',
                    'colores': 'Rojo principal con variantes monocromáticas',
                    'entregables': 'Logo, isotipo, guía de marca básica',
                    'usos': 'Branding, identidad corporativa'
                },
                'imagen_principal': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'
            },
            {
                'nombre': 'Empaque de Producto - Caja Kraft',
                'categoria': categoria_empaques,
                'precio': '800.00',
                'descripcion': 'Caja de empaque personalizada en kraft con diseño impreso.',
                'especificaciones': {
                    'dimensiones': '25 x 20 x 10 cm',
                    'material': 'Cartón kraft corrugado',
                    'acabado': 'Impresión a 4 colores',
                    'produccion': '1000 unidades',
                    'diseño': 'Ecológico con detalles minimalistas',
                    'colores': 'Kraft natural con impresión en rojo y negro',
                    'estructura': 'Caja armable',
                    'usos': 'E-commerce, regalos, productos'
                },
                'imagen_principal': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop'
            },
            {
                'nombre': 'Identidad Corporativa Completa',
                'categoria': categoria_identidad,
                'precio': '1200.00',
                'descripcion': 'Paquete completo de identidad visual.',
                'especificaciones': {
                    'dimensiones': 'Multipropósito',
                    'material': 'Digital + Impresión',
                    'acabado': 'Profesional',
                    'produccion': '1 paquete',
                    'diseño': 'Estratégico y coherente',
                    'colores': 'Paleta de 5 colores principales',
                    'entregables': 'Logo, guía de marca, aplicaciones',
                    'usos': 'Branding integral'
                },
                'imagen_principal': 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=800&h=600&fit=crop'
            },
            {
                'nombre': 'Volante Doblado A4 - 1000 unidades',
                'categoria': categoria_volantes,
                'precio': '180.00',
                'descripcion': 'Volantes en papel couché doblados por la mitad.',
                'especificaciones': {
                    'dimensiones': 'A4 doblado (10.5 x 21 cm)',
                    'material': 'Papel couché 150 gsm',
                    'acabado': 'Brillo con laminado suave',
                    'produccion': '1000 unidades',
                    'diseño': 'Informativo y directo',
                    'colores': 'Full color (CMYK)',
                    'layout': 'Frente y reverso personalizados',
                    'usos': 'Promoción, información, publicidad'
                },
                'imagen_principal': 'https://images.unsplash.com/photo-1460925895917-adf4e565f900?w=800&h=600&fit=crop'
            },
            {
                'nombre': 'Póster Decorativo - 70x100 cm',
                'categoria': categoria_posters,
                'precio': '95.00',
                'descripcion': 'Póster artístico en papel satinado de alta calidad.',
                'especificaciones': {
                    'dimensiones': '70 x 100 cm',
                    'material': 'Papel satinado 150 gsm',
                    'acabado': 'Satinado premium',
                    'produccion': '1 unidad',
                    'diseño': 'Artístico y moderno',
                    'colores': 'Variación de colores vibrantes',
                    'técnica': 'Ilustración digital',
                    'usos': 'Decoración, eventos, espacios'
                },
                'imagen_principal': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'
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
