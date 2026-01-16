"""
Blog API Views

RESTful API views for blog content.
"""

from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.core.paginator import Paginator

from .models import Post, Category


class BaseAPIView(View):
    """Base API view with common methods."""

    def serialize_post(self, post):
        """Serialize a post object to JSON-compatible dict."""
        return {
            "id": post.id,
            "title": post.title,
            "slug": post.slug,
            "excerpt": post.excerpt or "",
            "content": post.content,
            "featured_image": post.featured_image.url if post.featured_image else None,
            "published_at": post.published_at.isoformat() if post.published_at else None,
            "created_at": post.created_at.isoformat(),
            "updated_at": post.updated_at.isoformat(),
            "author": {
                "name": post.author.get_full_name() or post.author.username,
            } if post.author else None,
            "categories": [
                {"id": cat.id, "name": cat.name, "slug": cat.slug}
                for cat in post.categories.all()
            ],
            "tags": list(post.tags.names()) if hasattr(post, 'tags') else [],
            "is_featured": getattr(post, 'is_featured', False),
            "reading_time": getattr(post, 'reading_time', 5),
        }

    def serialize_category(self, category):
        """Serialize a category object."""
        return {
            "id": category.id,
            "name": category.name,
            "slug": category.slug,
            "description": category.description or "",
            "post_count": category.posts.filter(status='published').count(),
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
class PostListView(BaseAPIView):
    """List all published posts."""

    def get(self, request):
        posts = Post.objects.filter(status='published').order_by('-published_at')
        result = self.paginate(posts, request)

        return JsonResponse({
            "success": True,
            "data": [self.serialize_post(post) for post in result["items"]],
            "pagination": result["pagination"],
        })


@method_decorator(csrf_exempt, name='dispatch')
class PostDetailView(BaseAPIView):
    """Get single post by slug."""

    def get(self, request, slug):
        try:
            post = Post.objects.get(slug=slug, status='published')
            return JsonResponse({
                "success": True,
                "data": self.serialize_post(post),
            })
        except Post.DoesNotExist:
            return JsonResponse({
                "success": False,
                "error": "Post not found",
            }, status=404)


@method_decorator(csrf_exempt, name='dispatch')
class CategoryListView(BaseAPIView):
    """List all categories."""

    def get(self, request):
        categories = Category.objects.all()
        return JsonResponse({
            "success": True,
            "data": [self.serialize_category(cat) for cat in categories],
        })


@method_decorator(csrf_exempt, name='dispatch')
class PostsByCategoryView(BaseAPIView):
    """List posts by category."""

    def get(self, request, slug):
        try:
            category = Category.objects.get(slug=slug)
            posts = Post.objects.filter(
                categories=category,
                status='published'
            ).order_by('-published_at')

            result = self.paginate(posts, request)

            return JsonResponse({
                "success": True,
                "category": self.serialize_category(category),
                "data": [self.serialize_post(post) for post in result["items"]],
                "pagination": result["pagination"],
            })
        except Category.DoesNotExist:
            return JsonResponse({
                "success": False,
                "error": "Category not found",
            }, status=404)


@method_decorator(csrf_exempt, name='dispatch')
class FeaturedPostsView(BaseAPIView):
    """List featured posts."""

    def get(self, request):
        posts = Post.objects.filter(
            status='published',
            is_featured=True
        ).order_by('-published_at')[:6]

        return JsonResponse({
            "success": True,
            "data": [self.serialize_post(post) for post in posts],
        })


@method_decorator(csrf_exempt, name='dispatch')
class RecentPostsView(BaseAPIView):
    """List recent posts."""

    def get(self, request):
        limit = int(request.GET.get('limit', 5))
        posts = Post.objects.filter(status='published').order_by('-published_at')[:limit]

        return JsonResponse({
            "success": True,
            "data": [self.serialize_post(post) for post in posts],
        })


@method_decorator(csrf_exempt, name='dispatch')
class SearchPostsView(BaseAPIView):
    """Search posts."""

    def get(self, request):
        query = request.GET.get('q', '')
        if not query:
            return JsonResponse({
                "success": False,
                "error": "Search query is required",
            }, status=400)

        posts = Post.objects.filter(
            status='published'
        ).filter(
            title__icontains=query
        ) | Post.objects.filter(
            status='published'
        ).filter(
            content__icontains=query
        )

        posts = posts.distinct().order_by('-published_at')
        result = self.paginate(posts, request)

        return JsonResponse({
            "success": True,
            "query": query,
            "data": [self.serialize_post(post) for post in result["items"]],
            "pagination": result["pagination"],
        })
