from django.core.management.base import BaseCommand
from productos.models import Producto, CategoriaProducto, GaleriaProducto

class Command(BaseCommand):
    help = 'Carga los productos reales de 360 Digital'

    def handle(self, *args, **options):
        # URLs de Drive
        TARJETAS_IMG = 'https://drive.google.com/uc?export=view&id=1-ecExmyjCqiVpIh0I-U7kcrEuX4FiGdE'
        VOLANTES_IMG = 'https://drive.google.com/uc?export=view&id=1ASemTPV7g37nMRfymVRHcHwUanYkpxrW'

        # Limpiar productos anteriores
        Producto.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('✓ Productos antiguos eliminados'))

        # Obtener o crear categorías
        cat_tarjetas, _ = CategoriaProducto.objects.get_or_create(
            nombre='Tarjetas de Presentación',
            defaults={'descripcion': 'Tarjetas de presentación para empresas'}
        )
        cat_volantes, _ = CategoriaProducto.objects.get_or_create(
            nombre='Volantes Publicitarios',
            defaults={'descripcion': 'Volantes y flyers publicitarios'}
        )

        # Datos de TARJETAS
        tarjetas_data = [
            {
                'nombre': 'Tarjetas 1 Cara Full Color - Respaldo Escala de Grises',
                'descripcion': 'Paquete por 1.000 unidades de tarjetas brillantes con frente a color y respaldo a blanco y negro. Tamaño 9x5,5 cm.',
                'precio': 80000,
                'categoria': cat_tarjetas,
                'especificaciones': {
                    'tamaño': '9x5,5 cm',
                    'cantidad': '1.000 unidades',
                    'acabado': '1 cara full color, respaldo escala de grises',
                    'material': 'Papel brillante',
                    'impresión': 'Full color',
                    'detalles': 'Tarjetas sencillas con barniz'
                },
                'imagen': TARJETAS_IMG
            },
            {
                'nombre': 'Tarjetas Full Color Mate con Brillo UV',
                'descripcion': 'Paquete por 1.000 unidades de tarjetas con frente a color mate con brillo parcial UV y respaldo a blanco y negro. Tamaño 9x5,5 cm.',
                'precio': 100000,
                'categoria': cat_tarjetas,
                'especificaciones': {
                    'tamaño': '9x5,5 cm',
                    'cantidad': '1.000 unidades',
                    'acabado': 'Mate con brillo UV parcial',
                    'material': 'Cartulina premium',
                    'impresión': '1 cara full color',
                    'detalles': 'Respaldo escala de grises'
                },
                'imagen': TARJETAS_IMG
            },
            {
                'nombre': 'Tarjetas Full Color Ambas Caras con Brillo UV',
                'descripcion': 'Paquete por 1.000 unidades de tarjetas mate con brillo UV en ambas caras. Impresión a color por ambas caras. Tamaño 9x5,5 cm.',
                'precio': 120000,
                'categoria': cat_tarjetas,
                'especificaciones': {
                    'tamaño': '9x5,5 cm',
                    'cantidad': '1.000 unidades',
                    'acabado': 'Mate con brillo UV ambas caras',
                    'material': 'Cartulina premium',
                    'impresión': 'Full color ambas caras',
                    'detalles': 'Premium con acabado profesional'
                },
                'imagen': TARJETAS_IMG
            }
        ]

        # Datos de VOLANTES
        volantes_data = [
            {
                'nombre': 'Volantes 4x0 - Una Cara Full Color',
                'descripcion': 'Paquete por 1.000 unidades de volantes en propalcote con impresión a color en una cara. Tamaño 12,5 x 20,5 cm. Peso 115gr.',
                'precio': 110000,
                'categoria': cat_volantes,
                'especificaciones': {
                    'tamaño': '12,5 x 20,5 cm',
                    'cantidad': '1.000 unidades',
                    'acabado': '1 cara full color',
                    'material': 'Propalcote 115gr',
                    'impresión': 'Full color',
                    'detalles': '4x0 - Una sola cara impresa'
                },
                'imagen': VOLANTES_IMG
            },
            {
                'nombre': 'Volantes 4x1 - Frente Color Respaldo B&N',
                'descripcion': 'Paquete por 1.000 unidades de volantes con frente a color y respaldo escala de grises. Tamaño 12,5 x 20,5 cm. Peso 115gr.',
                'precio': 130000,
                'categoria': cat_volantes,
                'especificaciones': {
                    'tamaño': '12,5 x 20,5 cm',
                    'cantidad': '1.000 unidades',
                    'acabado': 'Frente color, respaldo B&N',
                    'material': 'Propalcote 115gr',
                    'impresión': 'Frente full color',
                    'detalles': '4x1 - Frente y respaldo impreso'
                },
                'imagen': VOLANTES_IMG
            },
            {
                'nombre': 'Volantes 4x4 - Dos Caras Full Color',
                'descripcion': 'Paquete por 1.000 unidades de volantes con impresión full color en ambas caras. Tamaño 12,5 x 20,5 cm. Peso 115gr.',
                'precio': 180000,
                'categoria': cat_volantes,
                'especificaciones': {
                    'tamaño': '12,5 x 20,5 cm',
                    'cantidad': '1.000 unidades',
                    'acabado': 'Full color ambas caras',
                    'material': 'Propalcote 115gr',
                    'impresión': 'Full color ambas caras',
                    'detalles': '4x4 - Máxima versatilidad'
                },
                'imagen': VOLANTES_IMG
            }
        ]

        # Crear TARJETAS
        for idx, data in enumerate(tarjetas_data, 1):
            imagen_url = data.pop('imagen')
            producto = Producto.objects.create(
                id=idx,
                **data
            )
            GaleriaProducto.objects.create(
                producto=producto,
                url_imagen=imagen_url,
                descripcion=f'Imagen {idx}'
            )
            self.stdout.write(self.style.SUCCESS(f'✓ Tarjeta {idx} creada: {producto.nombre}'))

        # Crear VOLANTES
        for idx, data in enumerate(volantes_data, 4):
            imagen_url = data.pop('imagen')
            producto = Producto.objects.create(
                id=idx,
                **data
            )
            GaleriaProducto.objects.create(
                producto=producto,
                url_imagen=imagen_url,
                descripcion=f'Imagen {idx}'
            )
            self.stdout.write(self.style.SUCCESS(f'✓ Volante {idx-3} creada: {producto.nombre}'))

        self.stdout.write(self.style.SUCCESS('\n✅ ¡Todos los productos reales han sido cargados exitosamente!'))
