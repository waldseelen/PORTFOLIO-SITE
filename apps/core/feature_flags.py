"""
Feature Flags - Özellik Bayrağı Sistemi
========================================

Bu modül, canlı ortamda kod deploy etmeden özellikleri açıp kapamayı sağlar.
django-waffle kütüphanesi ile entegre çalışır.

Kullanım:
    {% load feature_flags %}

    {% flag "new_homepage" %}
        <div>Yeni anasayfa tasarımı</div>
    {% else %}
        <div>Eski anasayfa</div>
    {% endflag %}

    # Python'da:
    from apps.core.feature_flags import is_feature_enabled

    if is_feature_enabled('blog_comments'):
        # Yorum sistemi aktif
        pass
"""

from functools import wraps
from typing import Callable, Optional

from django.conf import settings
from django.http import HttpRequest

# Django-waffle import (with fallback)
try:
    from waffle import flag_is_active, switch_is_active
    WAFFLE_AVAILABLE = True
except ImportError:
    WAFFLE_AVAILABLE = False


# Default feature flags configuration
DEFAULT_FLAGS = {
    # UI/UX Features
    'bento_grid': True,           # Bento Grid tasarım düzeni
    'glassmorphism': True,        # Glassmorphism efektleri
    'aurora_gradients': True,     # Aurora gradient arka planlar
    'skeleton_loading': True,     # Skeleton loading animasyonları
    'view_transitions': True,     # View Transitions API
    'micro_interactions': True,   # Alpine.js mikro-etkileşimler

    # Functional Features
    'htmx_navigation': True,      # HTMX sayfa geçişleri
    'blog_comments': False,       # Blog yorum sistemi
    'project_likes': True,        # Proje beğenme sistemi
    'live_search': True,          # Canlı arama
    'infinite_scroll': True,      # Infinite scroll

    # Modules
    'blog_module': True,          # Blog modülü
    'chat_module': False,         # Chat modülü
    'tools_module': True,         # Araçlar modülü
    'analytics_module': True,     # Analytics dashboard

    # A/B Testing
    'new_project_card': True,     # Yeni proje kartı tasarımı
    'new_navigation': False,      # Yeni navigasyon menüsü
}


def is_feature_enabled(flag_name: str, request: Optional[HttpRequest] = None) -> bool:
    """
    Check if a feature flag is enabled.

    Args:
        flag_name: The name of the feature flag
        request: Optional HttpRequest for user-specific flags

    Returns:
        bool: True if the feature is enabled, False otherwise
    """
    # First check waffle if available
    if WAFFLE_AVAILABLE and request:
        try:
            return flag_is_active(request, flag_name)
        except Exception:
            pass

    # Check settings override
    if hasattr(settings, 'FEATURE_FLAGS'):
        if flag_name in settings.FEATURE_FLAGS:
            return settings.FEATURE_FLAGS[flag_name]

    # Fall back to default
    return DEFAULT_FLAGS.get(flag_name, False)


def require_feature(flag_name: str, fallback_view: Optional[Callable] = None):
    """
    Decorator to require a feature flag to be enabled.

    Usage:
        @require_feature('new_dashboard')
        def new_dashboard_view(request):
            ...
    """
    def decorator(view_func: Callable):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if is_feature_enabled(flag_name, request):
                return view_func(request, *args, **kwargs)
            elif fallback_view:
                return fallback_view(request, *args, **kwargs)
            else:
                from django.http import Http404
                raise Http404(f"Feature '{flag_name}' is not enabled")
        return wrapper
    return decorator


def get_all_flags(request: Optional[HttpRequest] = None) -> dict:
    """
    Get all feature flags and their current status.

    Returns:
        dict: Dictionary of flag names to their enabled status
    """
    flags = {}
    for flag_name in DEFAULT_FLAGS:
        flags[flag_name] = is_feature_enabled(flag_name, request)
    return flags


# Context processor for templates
def feature_flags_context(request: HttpRequest) -> dict:
    """
    Add feature flags to template context.

    Add to TEMPLATES['OPTIONS']['context_processors']:
        'apps.core.feature_flags.feature_flags_context'
    """
    return {
        'feature_flags': get_all_flags(request),
        'ff': FeatureFlagChecker(request),
    }


class FeatureFlagChecker:
    """
    Helper class for checking feature flags in templates.

    Usage in templates:
        {% if ff.bento_grid %}
            ...
        {% endif %}
    """
    def __init__(self, request: Optional[HttpRequest] = None):
        self.request = request
        self._cache = {}

    def __getattr__(self, name: str) -> bool:
        if name.startswith('_'):
            raise AttributeError(name)

        if name not in self._cache:
            self._cache[name] = is_feature_enabled(name, self.request)

        return self._cache[name]
