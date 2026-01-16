"""
Blog API URL Configuration

RESTful API endpoints for blog content.
"""

from django.urls import path

from . import api_views

app_name = "blog_api"

urlpatterns = [
    # List all posts
    path("posts/", api_views.PostListView.as_view(), name="post_list"),

    # Get single post by slug
    path("posts/<slug:slug>/", api_views.PostDetailView.as_view(), name="post_detail"),

    # List all categories
    path("categories/", api_views.CategoryListView.as_view(), name="category_list"),

    # Posts by category
    path("categories/<slug:slug>/", api_views.PostsByCategoryView.as_view(), name="posts_by_category"),

    # Featured posts
    path("featured/", api_views.FeaturedPostsView.as_view(), name="featured_posts"),

    # Recent posts
    path("recent/", api_views.RecentPostsView.as_view(), name="recent_posts"),

    # Search posts
    path("search/", api_views.SearchPostsView.as_view(), name="search_posts"),
]
