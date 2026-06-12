# TODO - Fix 401 Unauthorized (CookieJWTAuthentication)

## Paso 1: Confirmar causa (ya hecho)
- [x] Verificar que el backend usa `CookieJWTAuthentication` leyendo `access_token` desde cookies.
- [x] Identificar que `login()` guarda cookies con `secure=False` y `samesite='Lax'`, lo cual rompe envío cross-site en HTTPS/Vercel.

## Paso 2: Cambiar configuración de cookies en backend
- [x] Editar `backend/apps/usuarios/views.py` para setear cookies JWT así:
  - `secure=True`
  - `samesite='None'`

## Paso 3: Re-test
- [ ] Reiniciar backend (o redeploy) y probar login + acceso a dashboard.
- [ ] Verificar que `GET /api/usuarios/autenticacion/me/` ya responde OK (200) y que desaparece el 401.

