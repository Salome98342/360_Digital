"""
Django settings for 360_Digital backend.
"""

import os
from pathlib import Path
from decouple import config
from datetime import timedelta
import dj_database_url

# Build paths inside the project
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config(
    'SECRET_KEY',
    default='django-insecure-360digital-dev-key-change-in-production'
)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', default=True, cast=bool)

# Hosts permitidos
# En Render conviene ajustar vía variable de entorno
# Ejemplo: DJANGO_ALLOWED_HOSTS=tu-dominio.onrender.com,api.tu-dominio.onrender.com
_django_allowed_hosts = config('DJANGO_ALLOWED_HOSTS', default='localhost,127.0.0.1')
ALLOWED_HOSTS = [h.strip() for h in _django_allowed_hosts.split(',') if h.strip()]

# Si quieres permitir todo (no recomendado), puedes usar:
# DJANGO_ALLOWED_HOSTS=*
if '*' in ALLOWED_HOSTS:
    ALLOWED_HOSTS = ['*']


# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_filters',

    # Local apps
    'apps.productos',
    'apps.usuarios',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database
# Usamos dj_database_url para parsear la URL de Supabase desde el .env

DATABASES = {
    'default': dj_database_url.parse(
        config('DATABASE_URL'),
        conn_max_age=600,
    )
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'es-ES'
TIME_ZONE = 'America/Bogota'
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Django REST Framework
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 150,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'apps.usuarios.authentication.CookieJWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}

# JWT
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
}

# ==========================
# ==========================
# CORS CONFIGURATION
# ==========================

SESSION_COOKIE_SECURE = True
SESSION_COOKIE_SAMESITE = 'None'
SESSION_COOKIE_HTTPONLY = True # Recomendado por seguridad

CSRF_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = 'None'
CSRF_COOKIE_HTTPONLY = False

# 1. ESTA ES LA LÍNEA QUE TE FALTA
CORS_ALLOW_CREDENTIALS = True

# 2. Asegúrate de permitir las cabeceras necesarias (opcional pero recomendado)
CORS_ALLOW_HEADERS = [
    "accept",
    "authorization",
    "content-type",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

CORS_ALLOWED_ORIGINS = [
    "https://360-digital.vercel.app",
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
]

_cors_allowed_origins = os.getenv('CORS_ALLOWED_ORIGINS')

if _cors_allowed_origins:
    CORS_ALLOWED_ORIGINS = []
    
    for origen in _cors_allowed_origins.split(','):
        origen = origen.strip()
        if not origen:
            continue
            
        partes = origen.split('://')
        if len(partes) == 2:
            dominio_limpio = partes[1].split('/')[0]
            CORS_ALLOWED_ORIGINS.append(f"{partes[0]}://{dominio_limpio}")
        else:
            CORS_ALLOWED_ORIGINS.append(origen.rstrip('/'))


        
# ==========================
# COOKIES / JWT
# ==========================

SESSION_COOKIE_SECURE = True
SESSION_COOKIE_SAMESITE = 'None'

CSRF_COOKIE_SECURE = True
CSRF_COOKIE_SAMESITE = 'None'

CSRF_TRUSTED_ORIGINS = [
    'https://mws66hqc-5173.use2.devtunnels.ms',
]

# Override por variables de entorno para producción
# Ejemplo: CSRF_TRUSTED_ORIGINS=https://frontend.onrender.com
_csrf_trusted_origins = os.getenv('CSRF_TRUSTED_ORIGINS')
if _csrf_trusted_origins:
    CSRF_TRUSTED_ORIGINS = [o.strip() for o in _csrf_trusted_origins.split(',') if o.strip()]


# Email Configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = config('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
DEFAULT_FROM_EMAIL = config(
    'DEFAULT_FROM_EMAIL',
    default=EMAIL_HOST_USER
)