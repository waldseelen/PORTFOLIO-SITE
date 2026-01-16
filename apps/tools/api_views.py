"""
Tools API Views
"""

from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.core.paginator import Paginator

from .models import Tool, Category


class BaseAPIView(View):
    """Base API view with common methods."""

    def serialize_tool(self, tool):
        """Serialize a tool object to JSON-compatible dict."""
        return {
            "id": tool.id,
            "title": tool.title,
            "slug": tool.slug,
            "description": tool.description or "",
            "short_description": getattr(tool, 'short_description', ''),
            "featured_image": tool.featured_image.url if tool.featured_image else None,
            "demo_url": getattr(tool, 'demo_url', ''),
            "github_url": getattr(tool, 'github_url', ''),
            "technologies": [
                {"id": tech.id, "name": tech.name}
                for tech in tool.technologies.all()
            ] if hasattr(tool, 'technologies') else [],
            "category": {
                "id": tool.category.id,
                "name": tool.category.name,
                "slug": tool.category.slug,
            } if tool.category else None,
            "is_featured": getattr(tool, 'is_featured', False),
            "is_published": getattr(tool, 'is_published', True),
            "created_at": tool.created_at.isoformat() if hasattr(tool, 'created_at') else None,
            "updated_at": tool.updated_at.isoformat() if hasattr(tool, 'updated_at') else None,
        }

    def serialize_category(self, category):
        """Serialize a category object."""
        return {
            "id": category.id,
            "name": category.name,
            "slug": category.slug,
            "description": category.description or "",
            "tool_count": category.tools.filter(is_published=True).count() if hasattr(category, 'tools') else 0,
        }

    def paginate(self, queryset, request, per_page=10):
        """Paginate queryset and return pagination metadata."""
        page = request.GET.get('page', 1)
        paginator = Paginator(queryset, per_page)
        page_obj = paginator.get_page(page)

        return {
            "items": list(page_obj),
            "pagination": {
                "current_page": page_obj.number,
                "total_pages": paginator.num_pages,
                "total_items": paginator.count,
                "has_next": page_obj.has_next(),
                "has_previous": page_obj.has_previous(),
            }
        }


@method_decorator(csrf_exempt, name='dispatch')
class ToolListView(BaseAPIView):
    """List all tools."""

    def get(self, request):
        tools = Tool.objects.filter(is_published=True).order_by('-created_at')
        result = self.paginate(tools, request)

        return JsonResponse({
            "success": True,
            "data": [self.serialize_tool(tool) for tool in result["items"]],
            "pagination": result["pagination"],
        })


@method_decorator(csrf_exempt, name='dispatch')
class ToolDetailView(BaseAPIView):
    """Get single tool by slug."""

    def get(self, request, slug):
        try:
            tool = Tool.objects.get(slug=slug, is_published=True)
            return JsonResponse({
                "success": True,
                "data": self.serialize_tool(tool),
            })
        except Tool.DoesNotExist:
            return JsonResponse({
                "success": False,
                "error": "Tool not found",
            }, status=404)


@method_decorator(csrf_exempt, name='dispatch')
class FeaturedToolsView(BaseAPIView):
    """List featured tools."""

    def get(self, request):
        tools = Tool.objects.filter(
            is_published=True,
            is_featured=True
        ).order_by('-created_at')[:6]

        return JsonResponse({
            "success": True,
            "data": [self.serialize_tool(tool) for tool in tools],
        })


@method_decorator(csrf_exempt, name='dispatch')
class ToolCategoryListView(BaseAPIView):
    """List all tool categories."""

    def get(self, request):
        categories = Category.objects.all()
        return JsonResponse({
            "success": True,
            "data": [self.serialize_category(cat) for cat in categories],
        })
