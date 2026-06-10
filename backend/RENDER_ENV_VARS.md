# Render env vars (backend Django)

## Imprescindibles
- `SECRET_KEY` = string aleatorio (ej: generado con `python -c "import secrets; print(secrets.token_urlsafe(50))"`)
- `DEBUG` = `false`
- `DATABASE_URL` = URL de tu base de datos (Postgres/Supabase) en formato estándar

## Hosts (para evitar DisallowedHost)
- `DJANGO_ALLOWED_HOSTS` = `three60-digital.onrender.com,localhost,127.0.0.1`
  - *(puedes agregar también tu dominio de API si existiera; normalmente con el de Render alcanza)*

## CORS / CSRF (si el frontend está en otro dominio)
> Si tu frontend está en el mismo dominio o ya no usas cookies/sesiones, ajusta según tu caso.
- `CORS_ALLOWED_ORIGINS` = `https://<frontend-dominio>`
  - por ejemplo: `CORS_ALLOWED_ORIGINS=https://three60-digital.onrender.com`
- `CSRF_TRUSTED_ORIGINS` = `https://<frontend-dominio>`

## Email (si tu backend envía correos)
- `EMAIL_HOST` = `smtp.gmail.com` (opcional, ya tiene default)
- `EMAIL_PORT` = `587` (opcional, default)
- `EMAIL_USE_TLS` = `true` (opcional)
- `EMAIL_HOST_USER` = tu usuario
- `EMAIL_HOST_PASSWORD` = tu contraseña/app password
- `DEFAULT_FROM_EMAIL` = (opcional, default al user)

## (Opcional) JWT / Cookies
Normalmente NO necesitas extras: usa `SIMPLE_JWT` con `SIGNING_KEY=SECRET_KEY`.

---
### Nota importante
Este proyecto usa `dj_database_url`, así que en `requirements.txt` debe existir la dependencia `dj-database-url`.

