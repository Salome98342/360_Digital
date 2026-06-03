from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AutenticacionViewSet

router = DefaultRouter()
router.register(r'autenticacion', AutenticacionViewSet, basename='autenticacion')

urlpatterns = [
    path('', include(router.urls)),
]
