# TODO - Fix error 500 / admin in Render

## 1) Corregir fallo de deploy (Python/Django incompatibles)
- [ ] Cambiar en Render el runtime de Python a una versión soportada (3.12 o 3.11)
- [ ] Asegurar que en `backend/requirements.txt` no exista referencia a Django inexistente
- [ ] Redeploy y confirmar que el build ya no falla

## 2) Corregir 500 en Admin
- [ ] Confirmar que `/admin/` carga sin 500
- [ ] Si sigue fallando, tomar el nuevo traceback y ajustar dependencias (Django/DRF)

## 3) Corregir 500 del API al “agregar/modificar” desde el frontend
- [ ] Obtener Request URL + body exacto cuando falle
- [ ] Ajustar serializers/views según payload

## 4) Validación final
- [ ] Probar login admin + CRUD (crear/editar)
- [ ] Probar carga/borrado de imágenes si aplica

