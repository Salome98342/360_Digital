"""
Django admin configuration for productos app.
"""
from django.contrib import admin
from .models import (
    Administrador, Servicio, CategoriaProducto, Producto,
    GaleriaProducto, Resena, FormularioContacto
)


@admin.register(Administrador)
class AdministradorAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'correo', 'fecha_creacion']
    search_fields = ['usuario', 'correo']
    readonly_fields = ['fecha_creacion']


@admin.register(Servicio)
class ServicioAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'activo', 'fecha_creacion']
    list_filter = ['activo']
    search_fields = ['nombre']
    readonly_fields = ['fecha_creacion']


@admin.register(CategoriaProducto)
class CategoriaProductoAdmin(admin.ModelAdmin):
    list_display = ['nombre']
    search_fields = ['nombre']


class GaleriaProductoInline(admin.TabularInline):
    model = GaleriaProducto
    extra = 1
    fields = ['url_imagen', 'descripcion']
    readonly_fields = []


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'id_categoria', 'precio', 'activo', 'fecha_creacion']
    list_filter = ['id_categoria', 'activo']
    search_fields = ['nombre']
    readonly_fields = ['fecha_creacion']
    inlines = [GaleriaProductoInline]
    fieldsets = (
        ('Información General', {
            'fields': ('nombre', 'descripcion', 'id_categoria', 'id_admin')
        }),
        ('Precios y Especificaciones', {
            'fields': ('precio', 'especificaciones')
        }),
        ('Estado', {
            'fields': ('activo', 'fecha_creacion')
        }),
    )


@admin.register(GaleriaProducto)
class GaleriaProductoAdmin(admin.ModelAdmin):
    list_display = ['id_producto', 'url_imagen', 'descripcion']
    search_fields = ['id_producto__nombre']
    fields = ['id_producto', 'url_imagen', 'descripcion']


@admin.register(Resena)
class ResenaAdmin(admin.ModelAdmin):
    list_display = ['nombre_cliente', 'id_producto', 'puntuacion', 'fecha_resena']
    list_filter = ['puntuacion', 'fecha_resena']
    search_fields = ['nombre_cliente', 'id_producto__nombre']
    readonly_fields = ['fecha_resena']


@admin.register(FormularioContacto)
class FormularioContactoAdmin(admin.ModelAdmin):
    list_display = ['nombre_completo', 'correo', 'fecha_envio']
    list_filter = ['fecha_envio']
    search_fields = ['nombre_completo', 'correo']
    readonly_fields = ['fecha_envio']
    fieldsets = (
        ('Información del Cliente', {
            'fields': ('nombre_completo', 'correo', 'telefono')
        }),
        ('Mensaje', {
            'fields': ('mensaje',)
        }),
        ('Metadata', {
            'fields': ('fecha_envio',)
        }),
    )
