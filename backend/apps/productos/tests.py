"""
Tests for productos app.
"""
from django.test import TestCase
from rest_framework.test import APIClient
from .models import Servicio, CategoriaProducto, Producto, Administrador


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


class ProductoAPITestCase(TestCase):
    """Test cases para el API de productos"""
    
    def setUp(self):
        self.client = APIClient()
        self.categoria = CategoriaProducto.objects.create(
            nombre='Logos'
        )
        self.admin = Administrador.objects.create(
            usuario='admin',
            correo='admin@example.com',
            contrasena='password123'
        )
        self.producto = Producto.objects.create(
            id_categoria=self.categoria,
            id_admin=self.admin,
            nombre='Diseño de Logo Premium',
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
        self.assertEqual(response.data['nombre'], 'Diseño de Logo Premium')
