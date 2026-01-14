"""
Code Complexity Analysis and Refactoring Guide
===============================================

Analyzes Python code complexity using radon and identifies
functions that need refactoring.

Usage:
    python scripts/analyze_complexity.py
    python scripts/analyze_complexity.py --threshold 15
"""

import os
import sys
from pathlib import Path

# Add project root to path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

try:
    from radon.complexity import cc_visit
    from radon.raw import analyze
    RADON_AVAILABLE = True
except ImportError:
    RADON_AVAILABLE = False
    print("Warning: radon not installed. Install with: pip install radon")


# Complexity thresholds
COMPLEXITY_THRESHOLDS = {
    "A": (1, 5),    # Simple
    "B": (6, 10),   # More complex
    "C": (11, 20),  # Complex
    "D": (21, 30),  # Very complex
    "E": (31, 40),  # Extremely complex
    "F": (41, float("inf")),  # Untestable
}

# Target directories
TARGET_DIRS = [
    "apps",
    "project",
]


def get_complexity_rank(complexity: int) -> str:
    """Get letter rank for complexity score."""
    for rank, (low, high) in COMPLEXITY_THRESHOLDS.items():
        if low <= complexity <= high:
            return rank
    return "F"


def analyze_file(filepath: Path) -> list[dict]:
    """Analyze complexity of a single Python file."""
    if not RADON_AVAILABLE:
        return []

    try:
        content = filepath.read_text(encoding="utf-8")
        results = cc_visit(content)

        file_results = []
        for block in results:
            file_results.append({
                "file": str(filepath),
                "name": block.name,
                "type": block.letter,  # F=function, M=method, C=class
                "complexity": block.complexity,
                "rank": get_complexity_rank(block.complexity),
                "lineno": block.lineno,
                "endline": block.endline,
            })

        return file_results
    except Exception as e:
        print(f"Error analyzing {filepath}: {e}")
        return []


def analyze_project(threshold: int = 15) -> dict:
    """Analyze entire project and return results."""
    all_results = []

    for target_dir in TARGET_DIRS:
        target_path = PROJECT_ROOT / target_dir
        if not target_path.exists():
            continue

        for py_file in target_path.rglob("*.py"):
            # Skip migrations and tests
            if "migrations" in str(py_file) or "test" in py_file.name.lower():
                continue

            results = analyze_file(py_file)
            all_results.extend(results)

    # Sort by complexity
    all_results.sort(key=lambda x: x["complexity"], reverse=True)

    # Filter by threshold
    high_complexity = [r for r in all_results if r["complexity"] >= threshold]

    # Group by rank
    by_rank = {}
    for r in all_results:
        rank = r["rank"]
        if rank not in by_rank:
            by_rank[rank] = []
        by_rank[rank].append(r)

    return {
        "total_functions": len(all_results),
        "high_complexity_count": len(high_complexity),
        "high_complexity_functions": high_complexity[:20],  # Top 20
        "by_rank": {k: len(v) for k, v in by_rank.items()},
        "threshold_used": threshold,
    }


def generate_refactoring_suggestions(results: list[dict]) -> list[str]:
    """Generate refactoring suggestions for high complexity functions."""
    suggestions = []

    for r in results:
        complexity = r["complexity"]
        name = r["name"]
        file = Path(r["file"]).name

        if complexity > 25:
            suggestions.append(
                f"CRITICAL: {name} in {file} (complexity={complexity})\n"
                f"  - Split into 3-5 smaller functions\n"
                f"  - Extract conditional logic into separate handlers\n"
                f"  - Consider using Strategy pattern"
            )
        elif complexity > 15:
            suggestions.append(
                f"HIGH: {name} in {file} (complexity={complexity})\n"
                f"  - Extract nested conditionals\n"
                f"  - Use early returns to reduce nesting\n"
                f"  - Consider breaking into 2-3 functions"
            )
        elif complexity > 10:
            suggestions.append(
                f"MEDIUM: {name} in {file} (complexity={complexity})\n"
                f"  - Review for unnecessary complexity\n"
                f"  - Consider extracting helper methods"
            )

    return suggestions


def print_report(analysis: dict):
    """Print formatted analysis report."""
    print("\n" + "=" * 60)
    print("CODE COMPLEXITY ANALYSIS REPORT")
    print("=" * 60)

    print(f"\nTotal functions analyzed: {analysis['total_functions']}")
    print(f"Functions above threshold ({analysis['threshold_used']}): {analysis['high_complexity_count']}")

    print(f"\nComplexity Distribution:")
    for rank in "ABCDEF":
        count = analysis["by_rank"].get(rank, 0)
        bar = "█" * min(count, 50)
        print(f"  {rank}: {count:4d} {bar}")

    if analysis["high_complexity_functions"]:
        print(f"\nTop High Complexity Functions:")
        print("-" * 60)

        for i, func in enumerate(analysis["high_complexity_functions"][:10], 1):
            file_short = Path(func["file"]).name
            print(f"  {i}. {func['name']} ({file_short})")
            print(f"     Complexity: {func['complexity']} (Rank {func['rank']})")
            print(f"     Lines: {func['lineno']}-{func['endline']}")
            print()

    # Generate suggestions
    suggestions = generate_refactoring_suggestions(analysis["high_complexity_functions"])
    if suggestions:
        print("\nRefactoring Suggestions:")
        print("-" * 60)
        for s in suggestions[:5]:
            print(f"\n{s}")

    print("\n" + "=" * 60)


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Analyze code complexity")
    parser.add_argument("--threshold", type=int, default=15, help="Complexity threshold")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    args = parser.parse_args()

    if not RADON_AVAILABLE:
        print("Please install radon: pip install radon")
        sys.exit(1)

    analysis = analyze_project(threshold=args.threshold)

    if args.json:
        import json
        print(json.dumps(analysis, indent=2))
    else:
        print_report(analysis)
