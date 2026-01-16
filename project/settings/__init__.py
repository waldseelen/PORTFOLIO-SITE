"""
Project Settings Package
========================

This package contains Django settings for different environments:
- base.py: Shared settings across all environments
- development.py: Development-specific settings (DEBUG=True)
- production.py: Production-specific settings (DEBUG=False)
- test.py: Test-specific settings
- simple.py: Minimal settings for debugging

Default: development settings
"""

import os

# Determine which settings module to use based on environment
_env = os.environ.get("DJANGO_ENV", "development").lower()

if _env == "production":
    from .production import *  # noqa: F401, F403
elif _env == "test" or _env == "testing":
    from .test import *  # noqa: F401, F403
else:
    from .development import *  # noqa: F401, F403
