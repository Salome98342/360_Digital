@echo off
REM Script de setup para Windows

echo ======================================
echo 360 Digital - Backend Setup
echo ======================================
echo.

echo [1/5] Creando virtual environment...
python -m venv venv
call venv\Scripts\activate

echo [2/5] Instalando dependencias...
pip install -r requirements.txt

echo [3/5] Creando archivo .env...
if not exist .env (
    copy .env.example .env
    echo Archivo .env creado. Por favor, actualiza los valores.
)

echo [4/5] Aplicando migraciones...
python manage.py makemigrations
python manage.py migrate

echo [5/5] Creando superusuario...
echo Por favor, crea un superusuario:
python manage.py createsuperuser

echo.
echo ======================================
echo Setup completado!
echo ======================================
echo.
echo Para ejecutar el servidor:
echo   python manage.py runserver
echo.
echo Admin en: http://localhost:8000/admin
echo API en: http://localhost:8000/api
echo.
