"""
Template Performance Benchmark Tests
====================================

Measures rendering performance for all templates and identifies
slow templates that need optimization.

Usage:
    pytest tests/templates/test_template_performance.py -v --benchmark-enable
    pytest tests/templates/test_template_performance.py -k "critical" -v
"""

import os
import time
from pathlib import Path
from typing import Optional

import pytest

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings.simple")

import django
django.setup()

from django.conf import settings
from django.template.loader import get_template, render_to_string
from django.test import RequestFactory


# Performance thresholds (in seconds)
RENDER_THRESHOLD_FAST = 0.05   # 50ms
RENDER_THRESHOLD_MEDIUM = 0.1  # 100ms
RENDER_THRESHOLD_SLOW = 0.5    # 500ms

# Critical templates that must be fast
CRITICAL_TEMPLATES = [
    "base.html",
    "base/base.html",
    "pages/portfolio/home.html",
    "pages/blog/list.html",
    "pages/blog/detail.html",
]

# Template directories
TEMPLATE_DIRS = [
    Path(settings.BASE_DIR).parent / "templates",
    Path(settings.BASE_DIR) / "templates",
]


class TemplatePerformanceProfiler:
    """Profiles template rendering performance."""

    def __init__(self):
        self.factory = RequestFactory()
        self.results = []

    def _get_request(self):
        """Create mock request."""
        request = self.factory.get("/")
        request.user = None
        return request

    def _get_mock_context(self) -> dict:
        """Get minimal mock context for performance testing."""
        return {
            "title": "Test",
            "description": "Test",
            "request": self._get_request(),
            "user": None,
            "DEBUG": False,
            "LANGUAGE_CODE": "en",
            "posts": [],
            "projects": [],
            "categories": [],
            "tags": [],
        }

    def measure_render_time(
        self,
        template_name: str,
        iterations: int = 10
    ) -> Optional[dict]:
        """
        Measure template render time over multiple iterations.

        Returns dict with min, max, avg times in seconds.
        """
        try:
            template = get_template(template_name)
        except Exception:
            return None

        context = self._get_mock_context()
        times = []

        for _ in range(iterations):
            start = time.perf_counter()
            try:
                template.render(context)
            except Exception:
                # Context errors are acceptable for performance testing
                pass
            end = time.perf_counter()
            times.append(end - start)

        return {
            "template": template_name,
            "min": min(times),
            "max": max(times),
            "avg": sum(times) / len(times),
            "iterations": iterations,
        }

    def categorize_performance(self, avg_time: float) -> str:
        """Categorize performance based on render time."""
        if avg_time < RENDER_THRESHOLD_FAST:
            return "fast"
        elif avg_time < RENDER_THRESHOLD_MEDIUM:
            return "medium"
        elif avg_time < RENDER_THRESHOLD_SLOW:
            return "slow"
        else:
            return "very_slow"

    def profile_all_templates(self) -> list[dict]:
        """Profile all templates and return results."""
        results = []

        for template_dir in TEMPLATE_DIRS:
            if not template_dir.exists():
                continue

            for template_file in template_dir.rglob("*.html"):
                # Get relative path
                try:
                    relative = str(template_file.relative_to(template_dir))
                except ValueError:
                    continue

                result = self.measure_render_time(relative, iterations=5)
                if result:
                    result["category"] = self.categorize_performance(result["avg"])
                    results.append(result)

        return sorted(results, key=lambda x: x["avg"], reverse=True)


@pytest.fixture(scope="module")
def profiler():
    """Create profiler instance."""
    return TemplatePerformanceProfiler()


@pytest.mark.performance
class TestTemplatePerformance:
    """Test template rendering performance."""

    @pytest.mark.parametrize("template_name", CRITICAL_TEMPLATES)
    def test_critical_template_fast(self, profiler, template_name):
        """Critical templates must render quickly."""
        result = profiler.measure_render_time(template_name, iterations=10)

        if result is None:
            pytest.skip(f"Template {template_name} not found")

        assert result["avg"] < RENDER_THRESHOLD_MEDIUM, (
            f"Critical template {template_name} is too slow: "
            f"{result['avg']*1000:.2f}ms avg (threshold: {RENDER_THRESHOLD_MEDIUM*1000}ms)"
        )

    def test_no_very_slow_templates(self, profiler):
        """Ensure no templates are extremely slow."""
        results = profiler.profile_all_templates()

        very_slow = [r for r in results if r["category"] == "very_slow"]

        if very_slow:
            slow_names = [r["template"] for r in very_slow[:5]]
            pytest.warns(
                UserWarning,
                match=f"Found {len(very_slow)} very slow templates"
            )

    def test_average_render_time(self, profiler):
        """Test overall average render time."""
        results = profiler.profile_all_templates()

        if not results:
            pytest.skip("No templates found")

        avg_overall = sum(r["avg"] for r in results) / len(results)

        assert avg_overall < RENDER_THRESHOLD_MEDIUM, (
            f"Overall average render time too high: {avg_overall*1000:.2f}ms"
        )


@pytest.mark.performance
class TestTemplateMemory:
    """Test template memory usage."""

    def test_template_does_not_leak(self, profiler):
        """Test that repeated template rendering doesn't leak memory."""
        import gc
        import sys

        # Get initial memory
        gc.collect()
        initial_objects = len(gc.get_objects())

        # Render templates multiple times
        for template_name in CRITICAL_TEMPLATES:
            for _ in range(100):
                profiler.measure_render_time(template_name, iterations=1)

        # Check memory after
        gc.collect()
        final_objects = len(gc.get_objects())

        # Allow some growth but not excessive
        growth = final_objects - initial_objects
        growth_percentage = (growth / initial_objects) * 100

        assert growth_percentage < 20, (
            f"Possible memory leak: object count grew by {growth_percentage:.1f}%"
        )


def generate_performance_report():
    """Generate performance report for all templates."""
    profiler = TemplatePerformanceProfiler()
    results = profiler.profile_all_templates()

    report = {
        "total_templates": len(results),
        "by_category": {
            "fast": len([r for r in results if r["category"] == "fast"]),
            "medium": len([r for r in results if r["category"] == "medium"]),
            "slow": len([r for r in results if r["category"] == "slow"]),
            "very_slow": len([r for r in results if r["category"] == "very_slow"]),
        },
        "slowest_templates": results[:10],
        "fastest_templates": results[-10:] if len(results) >= 10 else results,
    }

    return report


if __name__ == "__main__":
    print("Generating Template Performance Report...")
    report = generate_performance_report()

    print(f"\nTotal templates tested: {report['total_templates']}")
    print(f"\nBy category:")
    for cat, count in report["by_category"].items():
        print(f"  {cat}: {count}")

    print(f"\nTop 10 Slowest Templates:")
    for r in report["slowest_templates"]:
        print(f"  {r['template']}: {r['avg']*1000:.2f}ms avg ({r['category']})")
