"""
Management command para popular la base de datos con datos iniciales.
"""
from django.core.management.base import BaseCommand
from django.db import IntegrityError
from apps.productos.models import (
    Administrador, Servicio, CategoriaProducto, Producto, GaleriaProducto, Especificacion
)

class Command(BaseCommand):
    help = 'Popula la base de datos con datos iniciales'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Iniciando población de datos...'))
        
        Producto.objects.all().delete()
        Servicio.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('✓ Base de datos limpiada'))

        try:
            admin, created = Administrador.objects.get_or_create(
                usuario='admin',
                defaults={'correo': 'admin@360digital.com', 'contrasena': 'admin123'}
            )
        except IntegrityError:
            admin = Administrador.objects.get(usuario='admin')

        # 1. SERVICIOS REALES EXTRAÍDOS DEL PENDÓN
        # 1. SERVICIOS REALES EXTRAÍDOS DEL PENDÓN
        servicios_data = [
            {'nombre': 'Diseño Gráfico y Marketing Digital', 'descripcion': 'Servicios profesionales de agencia publicitaria.'},
            {'nombre': 'Diseño de Logos', 'descripcion': 'Creación de identidad visual corporativa.'},
            {'nombre': 'Impresión y Señalización', 'descripcion': 'Impresión en distintos formatos y señalización comercial.'},
            {'nombre': 'Stickers y Etiquetas', 'descripcion': 'Impresión de stickers y etiquetas personalizadas.'},
            {'nombre': 'Vinilos Adhesivos', 'descripcion': 'Impresión y corte de vinilos.'},
            {'nombre': 'Cuadros Decorativos', 'descripcion': 'Cuadros para decoración de interiores y negocios.'}
        ]

        for s_data in servicios_data:
            Servicio.objects.get_or_create(nombre=s_data.get('nombre', 'Servicio'), defaults=s_data)

        # 2. CATEGORÍAS
        categorias_data = [
            {'nombre': 'Tarjetas', 'descripcion': 'Tarjetas de presentación profesionales'},
            {'nombre': 'Volantes', 'descripcion': 'Volantes publicitarios (Grandes y Pequeños)'},
            {'nombre': 'Pendones y Estructuras', 'descripcion': 'Pendones a la medida y estructuras tipo araña'},
            {'nombre': 'Avisos Luminosos', 'descripcion': 'Cajas de luz LED'},
        ]

        for cat in categorias_data:
            CategoriaProducto.objects.get_or_create(nombre=cat['nombre'], defaults=cat)

        cat_tarjetas = CategoriaProducto.objects.get(nombre='Tarjetas')
        cat_volantes = CategoriaProducto.objects.get(nombre='Volantes')
        cat_pendones = CategoriaProducto.objects.get(nombre='Pendones y Estructuras')
        cat_avisos = CategoriaProducto.objects.get(nombre='Avisos Luminosos')

        # 3. PRODUCTOS (Desglosados individualmente: 21 en total)
        productos_data = [
            # --- TARJETAS ---
            {
                'nombre': 'Tarjetas 1 Cara Full Color - Respaldo Escala de Grises',
                'categoria': cat_tarjetas,
                'precio': '80000.00',
                'descripcion': 'Incluye diseño (no incluye logo). Paquetes no modificables por 1.000 unidades. Costo de envío nacional contraentrega: $15.000.',
                'especificaciones': {'Tamaño': '9 x 5.5 cm', 'Acabado': '1 cara full color, respaldo grises'}
            },
            {
                'nombre': 'Tarjetas Full Color Plastificadas Mate con Brillo UV',
                'categoria': cat_tarjetas,
                'precio': '100000.00',
                'descripcion': 'Incluye diseño (no incluye logo). Paquetes no modificables por 1.000 unidades. Costo de envío nacional contraentrega: $15.000.',
                'especificaciones': {'Tamaño': '9 x 5.5 cm', 'Acabado': 'Plastificado mate + Brillo UV parcial'}
            },
            {
                'nombre': 'Tarjetas Full Color Ambas Caras (Brillo UV)',
                'categoria': cat_tarjetas,
                'precio': '120000.00',
                'descripcion': 'Incluye diseño (no incluye logo). Paquetes no modificables por 1.000 unidades. Costo de envío nacional contraentrega: $15.000.',
                'especificaciones': {'Tamaño': '9 x 5.5 cm', 'Acabado': 'Full color ambas caras, brillo UV'}
            },
            {
                'nombre': 'PROMO: 1.000 Tarjetas 2 Caras Todo Color',
                'categoria': cat_tarjetas,
                'precio': '120000.00',
                'descripcion': 'Promoción especial de impacto visual. 1.000 tarjetas impresas por ambas caras a todo color.',
                'especificaciones': {'Cantidad': '1.000 unidades', 'Acabado': '2 caras todo color'}
            },

            # --- VOLANTES GRANDES (12.5 x 20.5 cm) ---
            {
                'nombre': 'Volantes Grandes 4x0 - Una Cara Full Color',
                'categoria': cat_volantes,
                'precio': '110000.00',
                'descripcion': 'Impresión en papel Propalcote 115gr. Incluye diseño (sin logo). Paquetes por 1.000 unidades. Envío nacional: $15.000.',
                'especificaciones': {'Tamaño': '12.5 x 20.5 cm', 'Papel': 'Propalcote 115gr', 'Impresión': '4x0'}
            },
            {
                'nombre': 'Volantes Grandes 4x1 - Frente Color Respaldo B&N',
                'categoria': cat_volantes,
                'precio': '130000.00',
                'descripcion': 'Impresión en papel Propalcote 115gr. Incluye diseño (sin logo). Paquetes por 1.000 unidades. Envío nacional: $15.000.',
                'especificaciones': {'Tamaño': '12.5 x 20.5 cm', 'Papel': 'Propalcote 115gr', 'Impresión': '4x1'}
            },
            {
                'nombre': 'Volantes Grandes 4x4 - Ambas Caras Full Color',
                'categoria': cat_volantes,
                'precio': '180000.00',
                'descripcion': 'Impresión en papel Propalcote 115gr. Incluye diseño (sin logo). Paquetes por 1.000 unidades. Envío nacional: $15.000.',
                'especificaciones': {'Tamaño': '12.5 x 20.5 cm', 'Papel': 'Propalcote 115gr', 'Impresión': '4x4'}
            },

            # --- VOLANTES PEQUEÑOS (12.5 x 10.5 cm) ---
            {
                'nombre': 'Volantes Pequeños 4x0 - Una Cara Full Color',
                'categoria': cat_volantes,
                'precio': '120000.00',
                'descripcion': 'Paquetes no modificables por 2.000 unidades. Incluye diseño (sin logo). Envío nacional: $15.000.',
                'especificaciones': {'Tamaño': '12.5 x 10.5 cm', 'Cantidad': '2.000 unidades', 'Impresión': '4x0'}
            },
            {
                'nombre': 'Volantes Pequeños 4x1 - Frente Color Respaldo B&N',
                'categoria': cat_volantes,
                'precio': '140000.00',
                'descripcion': 'Paquetes no modificables por 2.000 unidades. Incluye diseño (sin logo). Envío nacional: $15.000.',
                'especificaciones': {'Tamaño': '12.5 x 10.5 cm', 'Cantidad': '2.000 unidades', 'Impresión': '4x1'}
            },
            {
                'nombre': 'Volantes Pequeños 4x4 - Ambas Caras Full Color',
                'categoria': cat_volantes,
                'precio': '190000.00',
                'descripcion': 'Paquetes no modificables por 2.000 unidades. Incluye diseño (sin logo). Envío nacional: $15.000.',
                'especificaciones': {'Tamaño': '12.5 x 10.5 cm', 'Cantidad': '2.000 unidades', 'Impresión': '4x4'}
            },
            {
                'nombre': 'PROMO: 2.000 Volantes Full Color',
                'categoria': cat_volantes,
                'precio': '120000.00',
                'descripcion': 'Paquete económico de 2.000 volantes. Impresión full color, incluye diseño (sin logo).',
                'especificaciones': {'Cantidad': '2.000 unidades', 'Impresión': 'Full Color'}
            },

            # --- PENDONES Y ESTRUCTURAS ---
            {
                'nombre': 'Combo Estructura Araña + Pendón',
                'categoria': cat_pendones,
                'precio': '100000.00',
                'descripcion': 'Estructura araña portátil fácil de transportar. Incluye diseño personalizado. Envíos a nivel nacional.',
                'especificaciones': {'Tamaño': '0.60 x 1.60 mts', 'Incluye': 'Pendón + Estructura'}
            },
            {
                'nombre': 'Pendón Publicitario - 50 x 70 cm',
                'categoria': cat_pendones,
                'precio': '30000.00',
                'descripcion': 'Impresión full color. Incluye diseño (sin logo). Puedes escoger terminación con tubos o con ojaletes.',
                'especificaciones': {'Tamaño': '50 x 70 cm', 'Acabado': 'Tubos u Ojaletes'}
            },
            {
                'nombre': 'Pendón Publicitario - 100 x 70 cm',
                'categoria': cat_pendones,
                'precio': '45000.00',
                'descripcion': 'Impresión full color. Incluye diseño (sin logo). Puedes escoger terminación con tubos o con ojaletes.',
                'especificaciones': {'Tamaño': '100 x 70 cm', 'Acabado': 'Tubos u Ojaletes'}
            },
            {
                'nombre': 'Pendón Publicitario - 120 x 80 cm',
                'categoria': cat_pendones,
                'precio': '70000.00',
                'descripcion': 'Impresión full color. Incluye diseño (sin logo). Puedes escoger terminación con tubos o con ojaletes.',
                'especificaciones': {'Tamaño': '120 x 80 cm', 'Acabado': 'Tubos u Ojaletes'}
            },
            {
                'nombre': 'Pendón Publicitario - 100 x 150 cm',
                'categoria': cat_pendones,
                'precio': '100000.00',
                'descripcion': 'Impresión full color. Incluye diseño (sin logo). Puedes escoger terminación con tubos o con ojaletes.',
                'especificaciones': {'Tamaño': '100 x 150 cm', 'Acabado': 'Tubos u Ojaletes'}
            },

            # --- AVISOS LUMINOSOS (Desglosados por tamaño) ---
            {
                'nombre': 'Caja de Luz Circular LED - 50 cm',
                'categoria': cat_avisos,
                'precio': '0.00',
                'descripcion': 'Caja impermeable para aire libre, iluminación LED, diseño por ambos lados. Sirve como señalización de marca.',
                'especificaciones': {'Tamaño': '50 cm', 'Características': 'Impermeable, Doble Cara'}
            },
            {
                'nombre': 'Caja de Luz Circular LED - 60 cm',
                'categoria': cat_avisos,
                'precio': '0.00',
                'descripcion': 'Caja impermeable para aire libre, iluminación LED, diseño por ambos lados. Sirve como señalización de marca.',
                'especificaciones': {'Tamaño': '60 cm', 'Características': 'Impermeable, Doble Cara'}
            },
            {
                'nombre': 'Caja de Luz Circular LED - 80 cm',
                'categoria': cat_avisos,
                'precio': '0.00',
                'descripcion': 'Caja impermeable para aire libre, iluminación LED, diseño por ambos lados. Sirve como señalización de marca.',
                'especificaciones': {'Tamaño': '80 cm', 'Características': 'Impermeable, Doble Cara'}
            },
            {
                'nombre': 'Caja de Luz Rectangular LED - 40 x 60 cm',
                'categoria': cat_avisos,
                'precio': '0.00',
                'descripcion': 'Caja impermeable para aire libre, sirve como señalización y aviso para tiendas.',
                'especificaciones': {'Tamaño': '40 x 60 cm', 'Tecnología': 'Iluminación LED'}
            },
            {
                'nombre': 'Caja de Luz Rectangular LED - 50 x 70 cm',
                'categoria': cat_avisos,
                'precio': '0.00',
                'descripcion': 'Caja impermeable para aire libre, sirve como señalización y aviso para tiendas.',
                'especificaciones': {'Tamaño': '50 x 70 cm', 'Tecnología': 'Iluminación LED'}
            }
        ]

        url_default = 'https://drive.google.com/uc?export=view&id=1-ecExmyjCqiVpIh0I-U7kcrEuX4FiGdE'

        for producto_data in productos_data:
            try:
                categoria = producto_data.pop('categoria')
                especificaciones_dict = producto_data.pop('especificaciones', {})
                
                producto, created = Producto.objects.get_or_create(
                    nombre=producto_data['nombre'],
                    id_categoria=categoria,
                    defaults={
                        'id_admin': admin,
                        'precio': producto_data['precio'],
                        'descripcion': producto_data['descripcion']
                    }
                )
                
                if created:
                    GaleriaProducto.objects.create(
                        id_producto=producto, url_imagen=url_default, descripcion='Imagen catálogo'
                    )
                    
                    for clave, valor in especificaciones_dict.items():
                        Especificacion.objects.create(
                            id_producto=producto, nombre=str(clave), valor=str(valor)
                        )
                    self.stdout.write(f'✓ Producto creado: {producto.nombre}')
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'✗ Error: {str(e)}'))

        self.stdout.write(self.style.SUCCESS('\n✓ Población de datos completada con todos los 21 productos!'))