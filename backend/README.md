# 360 Digital - Backend Django

Backend API REST para el proyecto 360 Digital (Marketing y Desarrollo Digital).

## Stack Tecnológico

- **Django 4.2.11** - Framework Web
- **Django REST Framework 3.14.0** - API REST
- **PostgreSQL** - Base de Datos
- **Python 3.8+** - Lenguaje

## Instalación

### 1. Crear Virtual Environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Instalar Dependencias

```bash
pip install -r requirements.txt
```

### 3. Configurar Base de Datos

#### Opción A: PostgreSQL (Recomendado)

```bash
# Crear base de datos
createdb 360_digital

# Restaurar estructura
psql 360_digital < db/db.sql

# O si tienes usuario:
psql -U postgres -d 360_digital < db/db.sql
```

#### Opción B: SQLite (Desarrollo rápido)

En `config/settings.py` cambiar:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

### 4. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus datos
# DB_NAME=360_digital
# DB_USER=tu_usuario
# DB_PASSWORD=tu_contraseña
```

### 5. Aplicar Migraciones

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Crear Superusuario (Admin)

```bash
python manage.py createsuperuser
```

### 7. Ejecutar Servidor

```bash
python manage.py runserver
```

El backend estará disponible en: `http://localhost:8000`

### 8. Poblar Base de Datos (Opcional)

Para cargar datos iniciales (servicios, categorías, productos):

```bash
python manage.py populate_db
```

Esto creará:
- 6 servicios
- 8 categorías de productos  
- 8 productos de ejemplo
- 1 administrador de prueba

## API Endpoints

### Servicios
- `GET /api/servicios/` - Listar todos los servicios
- `GET /api/servicios/{id}/` - Detalle de servicio

### Categorías
- `GET /api/categorias/` - Listar categorías
- `GET /api/categorias/{id}/` - Detalle de categoría

### Productos
- `GET /api/productos/` - Listar productos con filtros
  - Parámetros: `search`, `ordering`, `id_categoria__nombre`
- `GET /api/productos/{id}/` - Detalle de producto con galería y reseñas
- `GET /api/productos/{id}/resenas/` - Obtener reseñas del producto
- `POST /api/productos/{id}/resenas/` - Crear nueva reseña
  - Body: `{ nombre_cliente, puntuacion (1-5), comentario }`

### Contacto
- `POST /api/contacto/` - Enviar mensaje de contacto
  - Body: `{ nombre_completo, correo, telefono (opcional), mensaje }`
- `GET /api/contacto/` - Listar mensajes de contacto (Admin)

## CORS Configuration

El backend está configurado para aceptar requests desde:
- `http://localhost:5173` (Frontend Vite)
- `http://localhost:3000` (Alternativo)
- `http://127.0.0.1:5173`
- `http://127.0.0.1:3000`

## Admin Panel

Acceso: `http://localhost:8000/admin/`

Credenciales:
- Usuario: `admin`
- Contraseña: (la que configuraste en createsuperuser)

## Estructura de Datos

### Modelos

**Producto**
```json
{
  "id": 1,
  "nombre": "Tarjetas de Presentación",
  "descripcion": "...",
  "precio": "250.00",
  "categoria": "Tarjetas",
  "especificaciones": {
    "dimensiones": "85 x 55 mm",
    "material": "Cartulina 300 gsm",
    "acabado": "Mate con laminado",
    "produccion": "500 unidades"
  },
  "galeria": [
    { "id": 1, "url_imagen": "...", "descripcion": "Imagen principal" }
  ],
  "resenas": [
    {
      "id": 1,
      "nombre_cliente": "Juan",
      "puntuacion": 5,
      "comentario": "Excelente!",
      "fecha_resena": "2024-06-03T..."
    }
  ],
  "rating": 4.8,
  "fecha_creacion": "2024-06-03T..."
}
```

**Reseña**
```json
{
  "id": 1,
  "nombre_cliente": "Carlos López",
  "puntuacion": 5,
  "comentario": "Producto de excelente calidad",
  "fecha_resena": "2024-06-03T19:30:00Z"
}
```

**Servicio**
```json
{
  "id": 1,
  "nombre": "Branding",
  "descripcion": "Desarrollo de identidad visual...",
  "imagen": "https://...",
  "activo": true
}
```

## Troubleshooting

### Error de conexión a PostgreSQL
- Verificar que PostgreSQL está corriendo
- Confirmar credenciales en `.env`
- Si usas Windows, considerar usar SQLite para desarrollo

### Error 404 en endpoints
- Verificar que las migraciones se ejecutaron: `python manage.py migrate`
- Verificar que `django-cors-headers` está en INSTALLED_APPS

### CORS Error desde Frontend
- Verificar que `http://localhost:5173` está en `CORS_ALLOWED_ORIGINS`
- Asegurarse que el navegador no bloquea las cookies

## Testing

```bash
python manage.py test
```

## Production Checklist

- [ ] Cambiar SECRET_KEY en .env
- [ ] Establecer DEBUG=False
- [ ] Configurar ALLOWED_HOSTS correctamente
- [ ] Usar contraseña segura para BD
- [ ] Configurar variables de CORS para dominio real
- [ ] Usar HTTPS en producción
- [ ] Configurar backup de BD
- [ ] Implementar rate limiting

### Productos
- `GET /api/productos/` - Listar productos (paginado, filtrable)
- `GET /api/productos/{id}/` - Detalle de producto
- `GET /api/productos/{id}/resenas/` - Obtener reseñas
- `POST /api/productos/{id}/resenas/` - Crear reseña

Parámetros de consulta:
- `?search=nombre` - Buscar por nombre
- `?id_categoria__nombre=Logos` - Filtrar por categoría
- `?ordering=-precio` - Ordenar por precio

### Contacto
- `POST /api/contacto/` - Enviar mensaje de contacto
- `GET /api/contacto/` - Listar mensajes (Admin)

## Admin Panel

Acceder en: `http://localhost:8000/admin`

Credenciales: Las que creaste con `createsuperuser`

## CORS

Frontend en `http://localhost:5173` está autorizado. Para agregar más orígenes, editar `settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://tu-dominio.com',
]
```

## Estructura del Proyecto

```
backend/
├── config/          # Configuración principal
│   ├── settings.py  # Configuración de Django
│   ├── urls.py      # URLs principales
│   ├── wsgi.py      # WSGI config
│   └── asgi.py      # ASGI config
├── apps/
│   └── productos/   # App principal
│       ├── models.py        # Modelos de BD
│       ├── serializers.py   # Serializers DRF
│       ├── views.py         # Viewsets/Views
│       ├── urls.py          # URLs de la app
│       ├── admin.py         # Admin Django
│       └── apps.py          # Config de app
├── db/
│   └── db.sql       # Script SQL
├── manage.py        # Comando principal
├── requirements.txt # Dependencias
└── .env.example     # Variables de entorno
```

## Próximos Pasos

1. Crear admin y agregar datos iniciales
2. Conectar con el frontend en `http://localhost:5173`
3. Implementar autenticación si es necesaria
4. Deploy en producción

## Troubleshooting

### Error: psycopg2 no se instala
```bash
# Windows
pip install psycopg2-binary

# Linux
sudo apt-get install postgresql-client libpq-dev
pip install psycopg2
```

### Error: Base de datos no existe
```bash
createdb 360_digital
psql 360_digital < db/db.sql
```

### Error: Port 8000 already in use
```bash
python manage.py runserver 8001
```

## Notas

- Las migraciones se crean automáticamente desde los modelos
- El API usa paginación de 12 items por defecto
- CORS está habilitado para desarrollo
- DEBUG=True solo para desarrollo

---

**Desarrollado para 360 Digital** 🚀
