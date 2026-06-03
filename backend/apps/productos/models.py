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
    
    # Especificaciones en JSON
    especificaciones = models.JSONField(blank=True, null=True)
    
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'producto'

    def __str__(self):
        return self.nombre


class GaleriaProducto(models.Model):
    id_producto = models.ForeignKey(
        Producto,
        on_delete=models.CASCADE,
        related_name='galeria',
        db_column='id_producto'
    )
    
    url_imagen = models.URLField()
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
    
    fecha_envio = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'formulario_contacto'

    def __str__(self):
        return f"{self.nombre_completo} - {self.fecha_envio.strftime('%d/%m/%Y')}"
