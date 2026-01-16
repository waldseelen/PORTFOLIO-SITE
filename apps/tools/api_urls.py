"""
Tools API URL Configuration
"""

from django.urls import path

from . import api_views

app_name = "tools_api"

urlpatterns = [
    # List all tools
    path("", api_views.ToolListView.as_view(), name="tool_list"),

    # Get single tool by slug
    path("<slug:slug>/", api_views.ToolDetailView.as_view(), name="tool_detail"),

    # Featured tools
    path("featured/", api_views.FeaturedToolsView.as_view(), name="featured_tools"),

    # Tool categories
    path("categories/", api_views.ToolCategoryListView.as_view(), name="category_list"),
]
