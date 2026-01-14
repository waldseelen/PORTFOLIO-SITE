"""
Image Optimization Script
=========================

Optimizes images for web performance using Pillow and optional sharp integration.
Supports WebP/AVIF conversion, resizing, and compression.

Usage:
    python scripts/optimize_images.py
    python scripts/optimize_images.py --source static/images --output static/images/optimized
"""

import os
import sys
from pathlib import Path
from typing import Optional

# Add project root to path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

try:
    from PIL import Image
    PILLOW_AVAILABLE = True
except ImportError:
    PILLOW_AVAILABLE = False

# Optimization settings
OPTIMIZATION_CONFIG = {
    "max_width": 1920,        # Max width for large images
    "thumbnail_width": 300,   # Thumbnail width
    "quality_jpeg": 85,       # JPEG quality (0-100)
    "quality_webp": 80,       # WebP quality (0-100)
    "quality_avif": 65,       # AVIF quality (0-100)
    "generate_webp": True,    # Generate WebP versions
    "generate_avif": False,   # Generate AVIF versions (slower)
    "generate_thumbnails": True,
}

# Supported formats
SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}


class ImageOptimizer:
    """Handles image optimization operations."""

    def __init__(self, config: dict = None):
        self.config = config or OPTIMIZATION_CONFIG
        self.stats = {
            "processed": 0,
            "skipped": 0,
            "errors": 0,
            "bytes_saved": 0,
        }

    def optimize_image(
        self,
        source_path: Path,
        output_dir: Optional[Path] = None
    ) -> dict:
        """
        Optimize a single image.

        Returns dict with optimization results.
        """
        if not PILLOW_AVAILABLE:
            return {"error": "Pillow not installed"}

        if source_path.suffix.lower() not in SUPPORTED_EXTENSIONS:
            return {"skipped": True, "reason": "Unsupported format"}

        output_dir = output_dir or source_path.parent
        output_dir.mkdir(parents=True, exist_ok=True)

        results = {
            "source": str(source_path),
            "original_size": source_path.stat().st_size,
            "outputs": [],
        }

        try:
            with Image.open(source_path) as img:
                # Get original format
                original_format = img.format or "JPEG"

                # Resize if too large
                if img.width > self.config["max_width"]:
                    ratio = self.config["max_width"] / img.width
                    new_size = (
                        int(img.width * ratio),
                        int(img.height * ratio)
                    )
                    img = img.resize(new_size, Image.Resampling.LANCZOS)

                # Save optimized original format
                output_path = output_dir / f"{source_path.stem}_opt{source_path.suffix}"
                self._save_image(img, output_path, original_format)
                results["outputs"].append({
                    "format": original_format,
                    "path": str(output_path),
                    "size": output_path.stat().st_size,
                })

                # Generate WebP version
                if self.config["generate_webp"]:
                    webp_path = output_dir / f"{source_path.stem}.webp"
                    self._save_image(img, webp_path, "WEBP")
                    results["outputs"].append({
                        "format": "WebP",
                        "path": str(webp_path),
                        "size": webp_path.stat().st_size,
                    })

                # Generate thumbnail
                if self.config["generate_thumbnails"]:
                    thumb_size = (
                        self.config["thumbnail_width"],
                        int(img.height * self.config["thumbnail_width"] / img.width)
                    )
                    thumb = img.resize(thumb_size, Image.Resampling.LANCZOS)
                    thumb_path = output_dir / f"{source_path.stem}_thumb{source_path.suffix}"
                    self._save_image(thumb, thumb_path, original_format)
                    results["outputs"].append({
                        "format": f"{original_format} (thumbnail)",
                        "path": str(thumb_path),
                        "size": thumb_path.stat().st_size,
                    })

                # Calculate savings
                total_new_size = sum(o["size"] for o in results["outputs"])
                results["bytes_saved"] = results["original_size"] - total_new_size
                results["compression_ratio"] = (
                    results["bytes_saved"] / results["original_size"] * 100
                    if results["original_size"] > 0 else 0
                )

                self.stats["processed"] += 1
                self.stats["bytes_saved"] += max(0, results["bytes_saved"])

        except Exception as e:
            results["error"] = str(e)
            self.stats["errors"] += 1

        return results

    def _save_image(self, img: Image.Image, path: Path, format: str):
        """Save image with appropriate settings."""
        # Convert RGBA to RGB for JPEG
        if format.upper() == "JPEG" and img.mode == "RGBA":
            img = img.convert("RGB")

        save_kwargs = {}

        if format.upper() in ("JPEG", "JPG"):
            save_kwargs = {
                "quality": self.config["quality_jpeg"],
                "optimize": True,
                "progressive": True,
            }
        elif format.upper() == "WEBP":
            save_kwargs = {
                "quality": self.config["quality_webp"],
                "method": 6,  # Best compression
            }
        elif format.upper() == "PNG":
            save_kwargs = {
                "optimize": True,
            }

        img.save(path, format=format, **save_kwargs)

    def optimize_directory(
        self,
        source_dir: Path,
        output_dir: Optional[Path] = None,
        recursive: bool = True
    ) -> list[dict]:
        """Optimize all images in a directory."""
        results = []

        pattern = "**/*" if recursive else "*"

        for file_path in source_dir.glob(pattern):
            if file_path.is_file() and file_path.suffix.lower() in SUPPORTED_EXTENSIONS:
                # Create corresponding output directory structure
                if output_dir:
                    rel_path = file_path.parent.relative_to(source_dir)
                    img_output_dir = output_dir / rel_path
                else:
                    img_output_dir = None

                result = self.optimize_image(file_path, img_output_dir)
                results.append(result)

        return results

    def get_stats(self) -> dict:
        """Get optimization statistics."""
        return {
            **self.stats,
            "bytes_saved_mb": round(self.stats["bytes_saved"] / (1024 * 1024), 2),
        }


def main():
    """Main entry point."""
    import argparse

    parser = argparse.ArgumentParser(description="Optimize images for web")
    parser.add_argument(
        "--source", "-s",
        type=Path,
        default=PROJECT_ROOT / "static" / "images",
        help="Source directory"
    )
    parser.add_argument(
        "--output", "-o",
        type=Path,
        default=None,
        help="Output directory (default: same as source with _opt suffix)"
    )
    parser.add_argument(
        "--quality", "-q",
        type=int,
        default=85,
        help="JPEG quality (0-100)"
    )
    parser.add_argument(
        "--no-webp",
        action="store_true",
        help="Don't generate WebP versions"
    )
    parser.add_argument(
        "--no-thumbnails",
        action="store_true",
        help="Don't generate thumbnails"
    )

    args = parser.parse_args()

    if not PILLOW_AVAILABLE:
        print("Error: Pillow not installed. Install with: pip install Pillow")
        sys.exit(1)

    # Configure optimizer
    config = OPTIMIZATION_CONFIG.copy()
    config["quality_jpeg"] = args.quality
    config["generate_webp"] = not args.no_webp
    config["generate_thumbnails"] = not args.no_thumbnails

    optimizer = ImageOptimizer(config)

    # Check source directory
    if not args.source.exists():
        print(f"Source directory not found: {args.source}")
        sys.exit(1)

    print(f"Optimizing images in: {args.source}")
    print(f"Output directory: {args.output or 'Same as source'}")
    print()

    # Process images
    results = optimizer.optimize_directory(args.source, args.output)

    # Print results
    stats = optimizer.get_stats()
    print(f"\nOptimization Complete!")
    print(f"  Processed: {stats['processed']} images")
    print(f"  Skipped: {stats['skipped']} images")
    print(f"  Errors: {stats['errors']}")
    print(f"  Bytes saved: {stats['bytes_saved_mb']} MB")

    # Print individual results for errors
    errors = [r for r in results if "error" in r]
    if errors:
        print(f"\nErrors:")
        for e in errors[:5]:
            print(f"  {e['source']}: {e['error']}")


if __name__ == "__main__":
    main()
