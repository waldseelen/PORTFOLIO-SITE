"""
Advanced Cache Invalidation and Warming Strategies
==================================================

Provides intelligent cache management including:
- Pattern-based invalidation
- Time-based cache warming
- Model signal-based invalidation
- Cache metrics and monitoring
- HTTP cache header management

Usage:
    from apps.main.cache import cache_manager, CacheWarmer

    # Warm all caches
    CacheWarmer.warm_all_caches()

    # Invalidate model cache
    cache_manager.invalidate_for_model('BlogPost')
"""

import hashlib
import json
import logging
import time
from datetime import datetime, timedelta
from functools import wraps
from typing import Any, Callable, Dict, List, Optional, Type

from django.conf import settings
from django.core.cache import cache
from django.db.models import Model
from django.http import HttpResponse
from django.utils import timezone

logger = logging.getLogger(__name__)


# Cache configuration
CACHE_CONFIG = {
    "default_timeout": 300,          # 5 minutes
    "short_timeout": 60,             # 1 minute
    "medium_timeout": 900,           # 15 minutes
    "long_timeout": 3600,            # 1 hour
    "very_long_timeout": 86400,      # 1 day
    "static_timeout": 86400 * 30,    # 30 days for static assets
    "max_key_length": 250,           # Memcached limit
    "prefix": "portfolio",           # Key prefix
}

# Model-specific cache timeouts
MODEL_CACHE_TIMEOUTS = {
    "BlogPost": CACHE_CONFIG["medium_timeout"],
    "AITool": CACHE_CONFIG["long_timeout"],
    "Project": CACHE_CONFIG["long_timeout"],
    "PersonalInfo": CACHE_CONFIG["very_long_timeout"],
    "SocialLink": CACHE_CONFIG["very_long_timeout"],
}


class CacheKeyBuilder:
    """Builds consistent cache keys."""

    @staticmethod
    def build(prefix: str, *args, **kwargs) -> str:
        """Build a cache key from components."""
        parts = [CACHE_CONFIG["prefix"], prefix]

        # Add positional args
        for arg in args:
            parts.append(str(arg))

        # Add kwargs as hash
        if kwargs:
            kwargs_str = json.dumps(kwargs, sort_keys=True, default=str)
            kwargs_hash = hashlib.md5(
                kwargs_str.encode(), usedforsecurity=False
            ).hexdigest()[:8]
            parts.append(kwargs_hash)

        key = ":".join(parts)
        return key[:CACHE_CONFIG["max_key_length"]]

    @staticmethod
    def model_key(model_name: str, pk: Any = None, action: str = "list") -> str:
        """Build key for model data."""
        if pk:
            return CacheKeyBuilder.build("model", model_name, action, str(pk))
        return CacheKeyBuilder.build("model", model_name, action)

    @staticmethod
    def api_key(endpoint: str, params: Dict = None) -> str:
        """Build key for API responses."""
        return CacheKeyBuilder.build("api", endpoint, **(params or {}))

    @staticmethod
    def template_key(template_name: str, context_hash: str = "") -> str:
        """Build key for template fragments."""
        return CacheKeyBuilder.build("template", template_name, context_hash)


class CacheMetrics:
    """Tracks cache performance metrics."""

    _metrics = {
        "hits": 0,
        "misses": 0,
        "sets": 0,
        "deletes": 0,
        "errors": 0,
    }

    @classmethod
    def record_hit(cls):
        cls._metrics["hits"] += 1

    @classmethod
    def record_miss(cls):
        cls._metrics["misses"] += 1

    @classmethod
    def record_set(cls):
        cls._metrics["sets"] += 1

    @classmethod
    def record_delete(cls):
        cls._metrics["deletes"] += 1

    @classmethod
    def record_error(cls):
        cls._metrics["errors"] += 1

    @classmethod
    def get_metrics(cls) -> Dict:
        """Get cache metrics with hit ratio."""
        total = cls._metrics["hits"] + cls._metrics["misses"]
        hit_ratio = cls._metrics["hits"] / total if total > 0 else 0

        return {
            **cls._metrics,
            "total_requests": total,
            "hit_ratio": round(hit_ratio, 4),
            "hit_ratio_percent": round(hit_ratio * 100, 2),
        }

    @classmethod
    def reset(cls):
        """Reset metrics."""
        for key in cls._metrics:
            cls._metrics[key] = 0


class CacheManagerAdvanced:
    """Advanced cache manager with pattern invalidation and metrics."""

    def __init__(self):
        self.key_builder = CacheKeyBuilder
        self.metrics = CacheMetrics

    def get(self, key: str) -> Any:
        """Get value from cache with metrics tracking."""
        try:
            value = cache.get(key)
            if value is not None:
                self.metrics.record_hit()
            else:
                self.metrics.record_miss()
            return value
        except Exception as e:
            self.metrics.record_error()
            logger.error(f"Cache get error for key {key}: {e}")
            return None

    def set(self, key: str, value: Any, timeout: int = None) -> bool:
        """Set value in cache with metrics tracking."""
        try:
            timeout = timeout or CACHE_CONFIG["default_timeout"]
            cache.set(key, value, timeout)
            self.metrics.record_set()
            return True
        except Exception as e:
            self.metrics.record_error()
            logger.error(f"Cache set error for key {key}: {e}")
            return False

    def delete(self, key: str) -> bool:
        """Delete value from cache."""
        try:
            cache.delete(key)
            self.metrics.record_delete()
            return True
        except Exception as e:
            self.metrics.record_error()
            logger.error(f"Cache delete error for key {key}: {e}")
            return False

    def get_or_set(
        self,
        key: str,
        callable_func: Callable,
        timeout: int = None
    ) -> Any:
        """Get from cache or compute and set."""
        value = self.get(key)
        if value is not None:
            return value

        # Compute and cache
        value = callable_func()
        self.set(key, value, timeout)
        return value

    def invalidate_pattern(self, pattern: str) -> int:
        """Invalidate all keys matching pattern."""
        deleted_count = 0

        try:
            # Try Redis pattern delete
            from django_redis import get_redis_connection

            redis_conn = get_redis_connection("default")
            full_pattern = f"{CACHE_CONFIG['prefix']}:{pattern}*"

            # Use SCAN instead of KEYS for large datasets
            cursor = 0
            keys_to_delete = []

            while True:
                cursor, keys = redis_conn.scan(cursor, match=full_pattern, count=100)
                keys_to_delete.extend(keys)
                if cursor == 0:
                    break

            if keys_to_delete:
                deleted_count = redis_conn.delete(*keys_to_delete)
                self.metrics._metrics["deletes"] += deleted_count

            logger.info(f"Invalidated {deleted_count} keys matching pattern: {pattern}")

        except ImportError:
            logger.warning("Redis not available for pattern invalidation")
        except Exception as e:
            self.metrics.record_error()
            logger.error(f"Pattern invalidation error for {pattern}: {e}")

        return deleted_count

    def invalidate_for_model(self, model_name: str) -> int:
        """Invalidate all cache entries for a model."""
        return self.invalidate_pattern(f"model:{model_name}")

    def get_metrics(self) -> Dict:
        """Get current cache metrics."""
        return self.metrics.get_metrics()


class CacheWarmer:
    """Warms cache with frequently accessed data."""

    # Cache warm targets
    WARM_TARGETS = [
        {
            "name": "blog_posts_list",
            "key_builder": lambda: CacheKeyBuilder.model_key("BlogPost", action="list"),
            "data_func": "get_published_posts",
            "timeout": CACHE_CONFIG["medium_timeout"],
        },
        {
            "name": "ai_tools_list",
            "key_builder": lambda: CacheKeyBuilder.model_key("AITool", action="list"),
            "data_func": "get_visible_tools",
            "timeout": CACHE_CONFIG["long_timeout"],
        },
        {
            "name": "personal_info",
            "key_builder": lambda: CacheKeyBuilder.model_key("PersonalInfo", action="single"),
            "data_func": "get_personal_info",
            "timeout": CACHE_CONFIG["very_long_timeout"],
        },
        {
            "name": "social_links",
            "key_builder": lambda: CacheKeyBuilder.model_key("SocialLink", action="list"),
            "data_func": "get_social_links",
            "timeout": CACHE_CONFIG["very_long_timeout"],
        },
    ]

    @classmethod
    def warm_all_caches(cls) -> Dict:
        """Warm all configured caches."""
        results = {
            "warmed": 0,
            "skipped": 0,
            "errors": 0,
            "details": [],
        }

        cache_mgr = CacheManagerAdvanced()

        for target in cls.WARM_TARGETS:
            try:
                key = target["key_builder"]()

                # Check if already cached
                if cache_mgr.get(key) is not None:
                    results["skipped"] += 1
                    continue

                # Get data and cache it
                data = cls._get_warm_data(target["data_func"])
                if data is not None:
                    cache_mgr.set(key, data, target["timeout"])
                    results["warmed"] += 1
                    results["details"].append({
                        "name": target["name"],
                        "key": key,
                        "status": "warmed",
                    })
                else:
                    results["skipped"] += 1

            except Exception as e:
                results["errors"] += 1
                logger.error(f"Cache warm error for {target['name']}: {e}")

        logger.info(
            f"Cache warming complete: {results['warmed']} warmed, "
            f"{results['skipped']} skipped, {results['errors']} errors"
        )

        return results

    @classmethod
    def _get_warm_data(cls, func_name: str) -> Any:
        """Get data for cache warming."""
        # Import models lazily to avoid circular imports
        try:
            if func_name == "get_published_posts":
                from apps.blog.models import Post
                return list(Post.objects.filter(
                    status="published"
                ).values("id", "title", "slug", "excerpt")[:20])

            elif func_name == "get_visible_tools":
                from apps.tools.models import AITool
                return list(AITool.objects.filter(
                    is_visible=True
                ).values("id", "name", "slug", "description")[:50])

            elif func_name == "get_personal_info":
                from apps.main.models import Admin
                admin = Admin.objects.first()
                if admin:
                    return {
                        "name": admin.full_name,
                        "email": admin.email,
                        "title": getattr(admin, "title", ""),
                    }
                return None

            elif func_name == "get_social_links":
                from apps.main.models import SocialLink
                return list(SocialLink.objects.filter(
                    is_active=True
                ).values("name", "url", "icon"))

        except Exception as e:
            logger.warning(f"Error getting warm data for {func_name}: {e}")

        return None


class HTTPCacheManager:
    """Manages HTTP cache headers."""

    # Cache control presets
    PRESETS = {
        "static": {
            "public": True,
            "max_age": 86400 * 30,     # 30 days
            "immutable": True,
        },
        "dynamic": {
            "public": True,
            "max_age": 60,              # 1 minute
            "stale_while_revalidate": 300,
        },
        "api": {
            "private": True,
            "max_age": 300,             # 5 minutes
            "must_revalidate": True,
        },
        "private": {
            "private": True,
            "no_cache": True,
            "no_store": True,
        },
    }

    @classmethod
    def set_headers(cls, response: HttpResponse, preset: str = "dynamic") -> HttpResponse:
        """Set cache headers on response."""
        config = cls.PRESETS.get(preset, cls.PRESETS["dynamic"])

        parts = []

        if config.get("public"):
            parts.append("public")
        if config.get("private"):
            parts.append("private")
        if config.get("no_cache"):
            parts.append("no-cache")
        if config.get("no_store"):
            parts.append("no-store")
        if config.get("must_revalidate"):
            parts.append("must-revalidate")
        if config.get("immutable"):
            parts.append("immutable")
        if config.get("max_age"):
            parts.append(f"max-age={config['max_age']}")
        if config.get("stale_while_revalidate"):
            parts.append(f"stale-while-revalidate={config['stale_while_revalidate']}")

        response["Cache-Control"] = ", ".join(parts)

        # Add ETag if not present
        if not response.has_header("ETag") and hasattr(response, "content"):
            etag = hashlib.md5(response.content, usedforsecurity=False).hexdigest()[:16]
            response["ETag"] = f'W/"{etag}"'

        return response


# Module-level cache manager instance
cache_manager = CacheManagerAdvanced()


# Decorator for view caching
def cached_view(timeout: int = None, preset: str = "dynamic"):
    """Decorator to cache view responses."""
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            # Build cache key from request
            key = CacheKeyBuilder.api_key(
                request.path,
                dict(request.GET.items())
            )

            # Try to get cached response
            cached = cache_manager.get(key)
            if cached is not None:
                return cached

            # Execute view
            response = view_func(request, *args, **kwargs)

            # Cache successful responses
            if response.status_code == 200:
                cache_timeout = timeout or CACHE_CONFIG["default_timeout"]
                cache_manager.set(key, response, cache_timeout)
                HTTPCacheManager.set_headers(response, preset)

            return response

        return wrapper
    return decorator
