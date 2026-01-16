"""
HTMX Views - HTMX Backend-Driven UI Endpoints
=============================================================================

Bu dosya, HTMX istekleri için backend endpoint'lerini içerir.
Modern, tek sayfa uygulama hissi veren interaktif UI bileşenleri sağlar.

ENDPOINTS:
- like_project(): Proje beğenme toggle
- project_description(): Lazy-loaded proje açıklaması
- filter_projects(): HTMX ile proje filtreleme
- search_projects(): Canlı arama sonuçları
- load_more_projects(): Infinite scroll için sayfalama
"""

import logging
from typing import Any

from django.contrib import messages
from django.db.models import Q
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, render
from django.template.loader import render_to_string
from django.utils.translation import gettext as _
from django.views.decorators.http import require_GET, require_POST

# Tool model is used as Project in this application
from apps.tools.models import Tool as Project

logger = logging.getLogger(__name__)


def is_htmx_request(request: HttpRequest) -> bool:
    """Check if the request is an HTMX request"""
    return request.headers.get("HX-Request") == "true"


@require_POST
def like_project(request: HttpRequest, project_id: int) -> HttpResponse:
    """
    Toggle like status for a project.
    Returns updated like count via HTMX.
    Uses session-based tracking since Tool model doesn't have like_count field.
    """
    project = get_object_or_404(Project, id=project_id)

    # Session-based like tracking (no auth required)
    liked_projects = request.session.get("liked_projects", [])
    likes_count = request.session.get("project_likes", {})

    if project_id in liked_projects:
        liked_projects.remove(project_id)
        likes_count[str(project_id)] = max(0, likes_count.get(str(project_id), 0) - 1)
        liked = False
    else:
        liked_projects.append(project_id)
        likes_count[str(project_id)] = likes_count.get(str(project_id), 0) + 1
        liked = True

    request.session["liked_projects"] = liked_projects
    request.session["project_likes"] = likes_count

    like_count = likes_count.get(str(project_id), 0)

    if is_htmx_request(request):
        # Return just the updated like count for HTMX swap
        icon_class = "text-red-500" if liked else "text-gray-400"
        return HttpResponse(
            f'''<button class="flex items-center gap-2 {icon_class} hover:text-red-400 transition-colors"
                   hx-post="/api/projects/{project_id}/like/"
                   hx-swap="outerHTML"
                   hx-trigger="click">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="{('currentColor' if liked else 'none')}"
                     viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span class="like-count">{like_count}</span>
            </button>''',
            headers={"HX-Trigger": "likeUpdated"}
        )

    return JsonResponse({
        "liked": liked,
        "like_count": like_count
    })


@require_GET
def project_description(request: HttpRequest, project_id: int) -> HttpResponse:
    """
    Return project description for lazy loading via HTMX.
    """
    project = get_object_or_404(Project, id=project_id)

    # Format description with truncation
    description = project.description or _("No description available.")

    if is_htmx_request(request):
        return HttpResponse(
            f'<p class="text-gray-400 text-sm line-clamp-2">{description[:200]}...</p>'
        )

    return JsonResponse({"description": description})


@require_GET
def filter_projects(request: HttpRequest) -> HttpResponse:
    """
    Filter projects based on category, status, or tags.
    Returns rendered HTML for HTMX swap.
    """
    category = request.GET.get("category", "all")
    tag = request.GET.get("tag", "")

    projects = Project.objects.visible()

    if category != "all":
        projects = projects.filter(category=category)

    if tag:
        # Filter by tags (JSON field)
        projects = projects.filter(tags__contains=[tag.lower()])

    projects = projects.order_by("-is_favorite", "-created_at")[:12]

    if is_htmx_request(request):
        html = render_to_string(
            "components/portfolio/project_grid_partial.html",
            {"projects": projects},
            request=request
        )
        return HttpResponse(html)

    return render(request, "pages/portfolio/projects.html", {"projects": projects})


@require_GET
def search_projects(request: HttpRequest) -> HttpResponse:
    """
    Live search for projects via HTMX.
    """
    query = request.GET.get("q", "").strip()

    if len(query) < 2:
        if is_htmx_request(request):
            return HttpResponse("")
        return JsonResponse({"results": []})

    projects = Project.objects.visible().filter(
        Q(title__icontains=query) | Q(description__icontains=query)
    ).distinct()[:6]

    if is_htmx_request(request):
        html = render_to_string(
            "components/portfolio/search_results_partial.html",
            {"projects": projects, "query": query},
            request=request
        )
        return HttpResponse(html)

    return JsonResponse({
        "results": [
            {"id": p.id, "title": p.title, "slug": p.slug}
            for p in projects
        ]
    })


@require_GET
def load_more_projects(request: HttpRequest) -> HttpResponse:
    """
    Infinite scroll pagination for projects.
    """
    page = int(request.GET.get("page", 1))
    per_page = 9
    offset = (page - 1) * per_page

    projects = Project.objects.visible().order_by(
        "-is_favorite", "-created_at"
    )[offset:offset + per_page]

    has_more = Project.objects.visible().count() > offset + per_page

    if is_htmx_request(request):
        html = render_to_string(
            "components/portfolio/project_grid_partial.html",
            {"projects": projects},
            request=request
        )

        # Add load more button if there are more projects
        if has_more:
            html += f'''
            <div hx-get="/api/projects/load-more/?page={page + 1}"
                 hx-trigger="revealed"
                 hx-swap="outerHTML"
                 class="col-span-full flex justify-center py-8">
                <span class="loading-spinner"></span>
            </div>
            '''

        return HttpResponse(html)

    return JsonResponse({
        "projects": [{"id": p.id, "title": p.title} for p in projects],
        "has_more": has_more,
        "page": page
    })
