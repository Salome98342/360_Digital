#!/bin/bash

# Script de setup para Linux/Mac

echo "======================================"
echo "360 Digital - Backend Setup"
echo "======================================"
echo ""

echo "[1/5] Creando virtual environment..."
python3 -m venv venv
source venv/bin/activate

echo "[2/5] Instalando dependencias..."
pip install -r requirements.txt

echo "[3/5] Creando archivo .env..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Archivo .env creado. Por favor, actualiza los valores."
fi

echo "[4/5] Aplicando migraciones..."
python manage.py makemigrations
python manage.py migrate

echo "[5/5] Creando superusuario..."
echo "Por favor, crea un superusuario:"
python manage.py createsuperuser

echo ""
echo "======================================"
echo "Setup completado!"
echo "======================================"
echo ""
echo "Para ejecutar el servidor:"
echo "  python manage.py runserver"
echo ""
echo "Admin en: http://localhost:8000/admin"
echo "API en: http://localhost:8000/api"
echo ""
