"""
Models for productos app.
"""
from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
import json




class Administrador(models.Model):
    usuario = models.CharField(max_length=50, unique=True)
    correo = models.EmailField(unique=True)
    contrasena = models.CharField(max_length=255)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'administrador'

    def __str__(self):
        return self.usuario

    def save(self, *args, **kwargs):
        """
        Hashear la contraseña antes de guardar si es nueva.
        """
        if not self.pk:  # Solo si es nuevo
            from django.contrib.auth.hashers import make_password
            self.contrasena = make_password(self.contrasena)
        super().save(*args, **kwargs)

    def check_password(self, raw_password):
        """
        Verificar si la contraseña coincide con el hash.
        """
        from django.contrib.auth.hashers import check_password
        return check_password(raw_password, self.contrasena)


class Servicio(models.Model):
    nombre = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True, null=True)
    imagen = models.URLField(blank=True, null=True)
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'servicio'

    def __str__(self):
        return self.nombre


class CategoriaProducto(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'categoria_producto'

    def __str__(self):
        return self.nombre


class Producto(models.Model):
    id_categoria = models.ForeignKey(
        CategoriaProducto,
        on_delete=models.CASCADE,
        db_column='id_categoria'
    )
    id_admin = models.ForeignKey(
        Administrador,
        on_delete=models.CASCADE,
        db_column='id_admin'
    )
    
    nombre = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True, null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'producto'

    def __str__(self):
        return self.nombre


class Especificacion(models.Model):
    """Especificaciones de un producto (nombre + descripción)"""
    id_producto = models.ForeignKey(
        Producto,
        on_delete=models.CASCADE,
        related_name='especificaciones',
        db_column='id_producto'
    )
    nombre = models.CharField(max_length=100)  # ej: "Tamaño", "Material", "Color"
    valor = models.CharField(max_length=255)   # ej: "A4", "Papel Premium", "Azul"
    
    class Meta:
        db_table = 'especificacion'
    
    def __str__(self):
        return f"{self.nombre}: {self.valor}"


class GaleriaProducto(models.Model):
    id_producto = models.ForeignKey(
        Producto,
        on_delete=models.CASCADE,
        related_name='galeria',
        db_column='id_producto'
    )
    
    url_imagen = models.FileField(upload_to='images/')
    descripcion = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'galeria_producto'

    def __str__(self):
        return f"Galería - {self.id_producto.nombre}"


class Resena(models.Model):
    id_producto = models.ForeignKey(
        Producto,
        on_delete=models.CASCADE,
        related_name='resenas',
        db_column='id_producto'
    )
    
    nombre_cliente = models.CharField(max_length=100)
    puntuacion = models.IntegerField(
        choices=[(i, f'{i} estrellas') for i in range(1, 6)]
    )
    comentario = models.TextField(blank=True, null=True)
    
    fecha_resena = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'resena'

    def __str__(self):
        return f"{self.nombre_cliente} - {self.puntuacion}⭐"


class FormularioContacto(models.Model):
    nombre_completo = models.CharField(max_length=150)
    correo = models.EmailField()
    telefono = models.CharField(max_length=20, blank=True, null=True)
    mensaje = models.TextField()
    contactar_por_whatsapp = models.BooleanField(default=False)
    contactar_por_correo = models.BooleanField(default=True)
    fecha_envio = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'formulario_contacto'

    def __str__(self):
        return f"{self.nombre_completo} - {self.fecha_envio.strftime('%d/%m/%Y')}"

class TarjetaCatalogo(models.Model):
    titulo = models.CharField(max_length=150)
    descripcion = models.CharField(max_length=255, blank=True)
    # Esto sube la imagen a una carpeta 'tarjetas' en tu bucket de Supabase
    imagen = models.ImageField(upload_to='tarjetas/', null=True, blank=True)
    # Aquí guardas a dónde debe llevar el click (ej: /catalogo?categoria=cuadros)
    ruta_destino = models.CharField(max_length=200) 
    activa = models.BooleanField(default=True)
