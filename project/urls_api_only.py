"""
URL configuration for portfolio_site API-only mode.

This is the API-only URL configuration to be used when the frontend is served by Next.js.
All template-based views are removed and only API endpoints are available.
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from apps.core.api_views import (
    collect_performance_metric,
    health_check,
    performance_dashboard_data,
)
from apps.core.health import (
    health_check_view,
    liveness_check_view,
    readiness_check_view,
)

# Search API views
from apps.portfolio.views.search_api import (
    SearchAutocompleteView,
    SearchAPIView,
    SearchFiltersView,
    SearchAnalyticsView,
)

# API-only URL patterns
urlpatterns = [
    # ============================================
    # Health Check Endpoints (Docker/K8s compatible)
    # ============================================
    path("health/", health_check_view, name="health_check"),
    path("health/readiness/", readiness_check_view, name="readiness_check"),
    path("health/liveness/", liveness_check_view, name="liveness_check"),
    path("api/health/", health_check, name="api_health_check"),

    # ============================================
    # Django Admin
    # ============================================
    path("admin/", admin.site.urls),
    path("tinymce/", include("tinymce.urls")),

    # ============================================
    # Performance Monitoring API
    # ============================================
    path("api/performance/", collect_performance_metric, name="api_performance"),
    path("api/performance/dashboard/", performance_dashboard_data, name="api_performance_dashboard"),

    # ============================================
    # Search API
    # ============================================
    path("api/search/autocomplete/", SearchAutocompleteView.as_view(), name="api_search_autocomplete"),
    path("api/search/suggest/", SearchAutocompleteView.as_view(), name="api_search_suggest"),
    path("api/search/", SearchAPIView.as_view(), name="api_search"),
    path("api/search/filters/", SearchFiltersView.as_view(), name="api_search_filters"),
    path("api/search/analytics/", SearchAnalyticsView.as_view(), name="api_search_analytics"),

    # ============================================
    # Blog API
    # ============================================
    path("api/blog/", include("apps.blog.api_urls")),

    # ============================================
    # Contact Form API
    # ============================================
    path("api/contact/", include("apps.contact.api_urls")),

    # ============================================
    # Portfolio/Projects API
    # ============================================
    path("api/portfolio/", include("apps.portfolio.api_urls")),

    # ============================================
    # Tools API
    # ============================================
    path("api/tools/", include("apps.tools.api_urls")),

    # ============================================
    # Chat API
    # ============================================
    path("api/chat/", include("apps.chat.api_urls")),

    # ============================================
    # Internationalization
    # ============================================
    path("i18n/", include("django.conf.urls.i18n")),
]

# Static and media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

    # Django Debug Toolbar
    try:
        import debug_toolbar
        urlpatterns = [
            path("__debug__/", include(debug_toolbar.urls)),
        ] + urlpatterns
    except ImportError:
        pass
