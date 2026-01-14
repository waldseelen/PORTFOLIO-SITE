"""
Settings package for Portfolio Site
=================================

This module serves as a compatibility layer that imports settings
from the canonical location at project.settings.

IMPORTANT: The canonical settings are in:
- project/settings/base.py (shared settings)
- project/settings/development.py (development overrides)
- project/settings/production.py (production overrides)
- project/settings/test.py (test overrides)

Usage:
    Set DJANGO_SETTINGS_MODULE=portfolio_site.settings.development (or production/test)
    Or use project.settings.development directly.
"""

import os

# Determine which settings module to use based on environment
_env = os.environ.get("DJANGO_ENV", "development").lower()

if _env == "production":
    from project.settings.production import *  # noqa: F401, F403
elif _env == "test":
    from project.settings.test import *  # noqa: F401, F403
else:
    from project.settings.development import *  # noqa: F401, F403
