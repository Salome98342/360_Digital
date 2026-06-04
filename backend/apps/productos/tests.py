"""
Tests for productos app.
"""
import shutil
import tempfile

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from .models import Servicio, CategoriaProducto, Producto, Administrador, GaleriaProducto


TEST_MEDIA_ROOT = tempfile.mkdtemp()


class AuthenticatedUser:
    is_authenticated = True


class ServicioAPITestCase(TestCase):
    """Test cases para el API de servicios"""

    def setUp(self):
        self.client = APIClient()
        self.servicio = Servicio.objects.create(
            nombre='Branding',
            descripcion='Servicio de branding profesional',
            activo=True
        )

    def test_listar_servicios(self):
        """Test para obtener lista de servicios"""
        response = self.client.get('/api/servicios/')
        self.assertEqual(response.status_code, 200)


@override_settings(MEDIA_ROOT=TEST_MEDIA_ROOT)
class ProductoAPITestCase(TestCase):
    """Test cases para el API de productos"""

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        shutil.rmtree(TEST_MEDIA_ROOT, ignore_errors=True)

    def setUp(self):
        self.client = APIClient()
        self.categoria = CategoriaProducto.objects.create(nombre='Logos')
        self.admin = Administrador.objects.create(
            usuario='admin',
            correo='admin@example.com',
            contrasena='password123'
        )
        self.producto = Producto.objects.create(
            id_categoria=self.categoria,
            id_admin=self.admin,
            nombre='Diseno de Logo Premium',
            precio=500.00,
            descripcion='Logo profesional'
        )

    def test_listar_productos(self):
        """Test para obtener lista de productos"""
        response = self.client.get('/api/productos/')
        self.assertEqual(response.status_code, 200)

    def test_detalle_producto(self):
        """Test para obtener detalle de producto"""
        response = self.client.get(f'/api/productos/{self.producto.id}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['nombre'], 'Diseno de Logo Premium')

    def test_actualizar_producto_con_json(self):
        """Test para actualizar un producto usando application/json"""
        self.client.force_authenticate(user=AuthenticatedUser())
        categoria = CategoriaProducto.objects.create(nombre='Tarjetas')

        response = self.client.put(
            f'/api/productos/{self.producto.id}/',
            {
                'nombre': 'Logo actualizado',
                'descripcion': 'Nueva descripcion',
                'precio': 750,
                'categoria_nombre': categoria.nombre,
            },
            format='json'
        )

        self.assertEqual(response.status_code, 200)
        self.producto.refresh_from_db()
        self.assertEqual(self.producto.nombre, 'Logo actualizado')
        self.assertEqual(self.producto.id_categoria, categoria)

    def test_subir_imagen_guarda_en_images(self):
        """Test para subir imagen y asociarla al producto"""
        self.client.force_authenticate(user=AuthenticatedUser())
        imagen = SimpleUploadedFile(
            'producto.png',
            b'\x89PNG\r\n\x1a\n',
            content_type='image/png'
        )

        response = self.client.post(
            f'/api/productos/{self.producto.id}/upload_image/',
            {'imagen': imagen},
            format='multipart'
        )

        self.assertEqual(response.status_code, 201)
        galeria = GaleriaProducto.objects.get(id=response.data['id'])
        self.assertTrue(galeria.url_imagen.name.startswith('images/'))
        self.assertIn('/media/images/', response.data['url_imagen'])
