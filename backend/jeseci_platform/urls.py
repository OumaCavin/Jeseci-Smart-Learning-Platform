"""
jeseci_platform URL Configuration - Enhanced with Static Files and API Root

Simplified configuration for testing authentication endpoints with proper static file serving.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView
)
from django.http import JsonResponse

def api_root(request):
    """Root API endpoint that lists available endpoints"""
    return JsonResponse({
        "message": "JESECI Interactive Learning Platform API",
        "version": "1.0.0",
        "author": "Cavin Otieno",
        "endpoints": {
            "auth": "/api/auth/",
            "admin": "/api/admin/",
            "health": "/api/health/",
            "docs": "/api/schema/",
            "redoc": "/api/schema/redoc/",
            "swagger": "/api/schema/swagger-ui/"
        }
    })

urlpatterns = [
    # Root API endpoint
    path('api/', api_root, name='api_root'),
    
    # Admin interface
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/', include('api.urls')),
    
    # OpenAPI Schema and Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]

# Serve static and media files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)