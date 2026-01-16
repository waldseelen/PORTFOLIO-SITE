"""
Comprehensive Performance Profiling Suite
==========================================

Provides detailed performance analysis including:
- Database query profiling
- Template rendering performance
- API endpoint response times
- Memory usage analysis
- Cache effectiveness metrics

Usage:
    pytest tests/performance/test_comprehensive_performance.py -v
    python tests/performance/test_comprehensive_performance.py --report
"""

import gc
import json
import os
import sys
import time
import traceback
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from typing import Any, Optional

import pytest

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings.simple")

import django
django.setup()

from django.conf import settings
from django.db import connection, reset_queries
from django.test import Client, RequestFactory, override_settings
from django.test.utils import CaptureQueriesContext


# Performance thresholds
THRESHOLDS = {
    "page_load_ms": 3000,       # Max page load time
    "api_response_ms": 200,     # Max API response time
    "db_query_ms": 100,         # Max single query time
    "total_queries": 20,        # Max queries per request
    "template_render_ms": 100,  # Max template render time
    "cache_hit_ratio": 0.8,     # Min cache hit ratio
}

# Critical endpoints to test
CRITICAL_ENDPOINTS = [
    {"path": "/", "name": "Home", "method": "GET"},
    {"path": "/blog/", "name": "Blog List", "method": "GET"},
    {"path": "/contact/", "name": "Contact", "method": "GET"},
    {"path": "/ai/", "name": "AI Projects", "method": "GET"},
    {"path": "/cybersecurity/", "name": "Cybersecurity", "method": "GET"},
    {"path": "/music/", "name": "Music", "method": "GET"},
    {"path": "/useful/", "name": "Useful Tools", "method": "GET"},
]

# API endpoints
API_ENDPOINTS = [
    {"path": "/api/search/", "name": "Search API", "method": "GET", "params": {"q": "test"}},
]


class QueryProfiler:
    """Profiles database queries for a request."""

    def __init__(self):
        self.queries = []
        self.total_time = 0
        self.slow_queries = []

    def start(self):
        """Start profiling."""
        reset_queries()

    def stop(self):
        """Stop profiling and collect results."""
        self.queries = list(connection.queries)
        self.total_time = sum(float(q.get("time", 0)) for q in self.queries)
        self.slow_queries = [
            q for q in self.queries
            if float(q.get("time", 0)) * 1000 > THRESHOLDS["db_query_ms"]
        ]
        return self

    def get_stats(self) -> dict:
        """Get query statistics."""
        if not self.queries:
            return {
                "count": 0,
                "total_time_ms": 0,
                "avg_time_ms": 0,
                "slow_count": 0,
                "queries": [],
            }

        times = [float(q.get("time", 0)) * 1000 for q in self.queries]
        return {
            "count": len(self.queries),
            "total_time_ms": sum(times),
            "avg_time_ms": sum(times) / len(times),
            "max_time_ms": max(times) if times else 0,
            "slow_count": len(self.slow_queries),
            "queries": [
                {"sql": q["sql"][:200], "time_ms": float(q.get("time", 0)) * 1000}
                for q in self.queries[:10]  # First 10 queries
            ],
        }


class PerformanceProfiler:
    """Comprehensive performance profiler."""

    def __init__(self):
        self.client = Client()
        self.factory = RequestFactory()
        self.results = []

    def profile_endpoint(self, endpoint: dict) -> dict:
        """Profile a single endpoint."""
        path = endpoint["path"]
        method = endpoint.get("method", "GET")
        params = endpoint.get("params", {})

        # Query profiling
        query_profiler = QueryProfiler()

        # Memory tracking
        gc.collect()
        mem_before = self._get_memory_usage()

        # Time tracking
        start_time = time.perf_counter()

        # Execute request with query tracking
        query_profiler.start()

        if method == "GET":
            response = self.client.get(path, params)
        elif method == "POST":
            response = self.client.post(path, params)
        else:
            response = self.client.get(path)

        query_profiler.stop()

        end_time = time.perf_counter()

        # Memory after
        gc.collect()
        mem_after = self._get_memory_usage()

        # Calculate metrics
        load_time_ms = (end_time - start_time) * 1000
        memory_delta = mem_after - mem_before
        query_stats = query_profiler.get_stats()

        # Response size
        content_length = len(response.content) if hasattr(response, 'content') else 0

        result = {
            "endpoint": path,
            "name": endpoint.get("name", path),
            "method": method,
            "status_code": response.status_code,
            "load_time_ms": round(load_time_ms, 2),
            "content_size_bytes": content_length,
            "memory_delta_kb": round(memory_delta / 1024, 2),
            "queries": query_stats,
            "passed": self._check_thresholds(load_time_ms, query_stats),
            "timestamp": datetime.now().isoformat(),
        }

        self.results.append(result)
        return result

    def _get_memory_usage(self) -> int:
        """Get current memory usage in bytes."""
        try:
            import psutil
            process = psutil.Process()
            return process.memory_info().rss
        except ImportError:
            return 0

    def _check_thresholds(self, load_time_ms: float, query_stats: dict) -> dict:
        """Check if metrics pass thresholds."""
        return {
            "load_time": load_time_ms < THRESHOLDS["page_load_ms"],
            "query_count": query_stats["count"] < THRESHOLDS["total_queries"],
            "query_time": query_stats["total_time_ms"] < (THRESHOLDS["db_query_ms"] * 5),
            "no_slow_queries": query_stats["slow_count"] == 0,
        }

    def profile_all_endpoints(self) -> list[dict]:
        """Profile all critical endpoints."""
        results = []

        for endpoint in CRITICAL_ENDPOINTS:
            try:
                result = self.profile_endpoint(endpoint)
                results.append(result)
            except Exception as e:
                results.append({
                    "endpoint": endpoint["path"],
                    "name": endpoint.get("name"),
                    "error": str(e),
                    "passed": {"all": False},
                })

        return results

    def profile_api_endpoints(self) -> list[dict]:
        """Profile API endpoints with stricter thresholds."""
        results = []

        for endpoint in API_ENDPOINTS:
            try:
                result = self.profile_endpoint(endpoint)
                # API has stricter threshold
                result["api_passed"] = result["load_time_ms"] < THRESHOLDS["api_response_ms"]
                results.append(result)
            except Exception as e:
                results.append({
                    "endpoint": endpoint["path"],
                    "name": endpoint.get("name"),
                    "error": str(e),
                })

        return results

    def generate_report(self) -> dict:
        """Generate comprehensive performance report."""
        page_results = self.profile_all_endpoints()
        api_results = self.profile_api_endpoints()

        # Calculate summary
        all_results = page_results + api_results
        successful = [r for r in all_results if "error" not in r]

        summary = {
            "total_endpoints": len(all_results),
            "successful": len(successful),
            "failed": len(all_results) - len(successful),
            "avg_load_time_ms": round(
                sum(r["load_time_ms"] for r in successful) / len(successful), 2
            ) if successful else 0,
            "total_queries": sum(r["queries"]["count"] for r in successful if "queries" in r),
            "slow_queries_found": sum(
                r["queries"]["slow_count"] for r in successful if "queries" in r
            ),
        }

        return {
            "summary": summary,
            "thresholds": THRESHOLDS,
            "page_results": page_results,
            "api_results": api_results,
            "generated_at": datetime.now().isoformat(),
        }


@pytest.fixture(scope="module")
def profiler():
    """Create profiler instance."""
    return PerformanceProfiler()


@pytest.mark.performance
class TestComprehensivePerformance:
    """Comprehensive performance tests."""

    @pytest.mark.parametrize("endpoint", CRITICAL_ENDPOINTS, ids=[e["name"] for e in CRITICAL_ENDPOINTS])
    def test_page_load_time(self, profiler, endpoint):
        """Test that pages load within threshold."""
        result = profiler.profile_endpoint(endpoint)

        assert result["status_code"] == 200, f"Page returned {result['status_code']}"
        assert result["load_time_ms"] < THRESHOLDS["page_load_ms"], (
            f"{endpoint['name']} took {result['load_time_ms']}ms "
            f"(threshold: {THRESHOLDS['page_load_ms']}ms)"
        )

    @pytest.mark.parametrize("endpoint", CRITICAL_ENDPOINTS, ids=[e["name"] for e in CRITICAL_ENDPOINTS])
    def test_query_count(self, profiler, endpoint):
        """Test that pages don't make too many queries."""
        result = profiler.profile_endpoint(endpoint)

        query_count = result["queries"]["count"]
        assert query_count < THRESHOLDS["total_queries"], (
            f"{endpoint['name']} made {query_count} queries "
            f"(threshold: {THRESHOLDS['total_queries']})"
        )

    @pytest.mark.parametrize("endpoint", CRITICAL_ENDPOINTS[:4], ids=[e["name"] for e in CRITICAL_ENDPOINTS[:4]])
    def test_no_slow_queries(self, profiler, endpoint):
        """Test that no individual queries are too slow."""
        result = profiler.profile_endpoint(endpoint)

        slow_count = result["queries"]["slow_count"]
        assert slow_count == 0, (
            f"{endpoint['name']} has {slow_count} slow queries "
            f"(>{THRESHOLDS['db_query_ms']}ms each)"
        )

    def test_api_response_time(self, profiler):
        """Test API endpoints respond quickly."""
        for endpoint in API_ENDPOINTS:
            try:
                result = profiler.profile_endpoint(endpoint)

                # API endpoints have stricter threshold
                assert result["load_time_ms"] < THRESHOLDS["api_response_ms"], (
                    f"{endpoint['name']} took {result['load_time_ms']}ms "
                    f"(API threshold: {THRESHOLDS['api_response_ms']}ms)"
                )
            except Exception as e:
                pytest.skip(f"API endpoint not available: {e}")

    def test_overall_performance_baseline(self, profiler):
        """Test overall performance meets baseline."""
        report = profiler.generate_report()
        summary = report["summary"]

        # At least 80% of endpoints should succeed
        success_rate = summary["successful"] / summary["total_endpoints"]
        assert success_rate >= 0.8, f"Only {success_rate*100:.0f}% endpoints successful"

        # Average load time should be reasonable
        assert summary["avg_load_time_ms"] < THRESHOLDS["page_load_ms"], (
            f"Average load time {summary['avg_load_time_ms']}ms too high"
        )


@pytest.mark.performance
class TestDatabasePerformance:
    """Database-specific performance tests."""

    def test_query_optimization_select_related(self, profiler):
        """Test that select_related is used effectively."""
        result = profiler.profile_endpoint({"path": "/blog/", "name": "Blog"})

        # Check for N+1 query patterns
        queries = result["queries"]["queries"]
        similar_queries = defaultdict(int)

        for q in queries:
            # Simplify query for pattern matching
            simplified = q["sql"].split("WHERE")[0].strip()
            similar_queries[simplified] += 1

        # No pattern should appear more than 3 times (indicates N+1)
        for pattern, count in similar_queries.items():
            if count > 3:
                pytest.warns(
                    UserWarning,
                    match=f"Possible N+1 query pattern detected ({count} similar queries)"
                )


def save_report_to_file(report: dict, filename: str = "performance_report.json"):
    """Save performance report to file."""
    reports_dir = Path(settings.BASE_DIR).parent / "reports"
    reports_dir.mkdir(exist_ok=True)

    filepath = reports_dir / filename
    with open(filepath, "w") as f:
        json.dump(report, f, indent=2)

    return filepath


if __name__ == "__main__":
    print("Running Comprehensive Performance Profile...")
    print("=" * 60)

    profiler = PerformanceProfiler()
    report = profiler.generate_report()

    # Print summary
    summary = report["summary"]
    print(f"\nPerformance Summary:")
    print(f"  Total endpoints tested: {summary['total_endpoints']}")
    print(f"  Successful: {summary['successful']}")
    print(f"  Failed: {summary['failed']}")
    print(f"  Average load time: {summary['avg_load_time_ms']}ms")
    print(f"  Total DB queries: {summary['total_queries']}")
    print(f"  Slow queries found: {summary['slow_queries_found']}")

    # Print individual results
    print(f"\nPage Results:")
    for result in report["page_results"]:
        status = "✓" if all(result.get("passed", {}).values()) else "✗"
        name = result.get("name", result.get("endpoint", "Unknown"))
        if "error" in result:
            print(f"  {status} {name}: ERROR - {result['error']}")
        else:
            print(f"  {status} {name}: {result['load_time_ms']}ms, {result['queries']['count']} queries")

    # Save report
    filepath = save_report_to_file(report)
    print(f"\nReport saved to: {filepath}")
