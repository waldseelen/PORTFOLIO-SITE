"""
Portfolio/Projects API URL Configuration
"""

from django.urls import path

from . import api_views

app_name = "portfolio_api"

urlpatterns = [
    # List all projects
    path("projects/", api_views.ProjectListView.as_view(), name="project_list"),

    # Get single project by slug
    path("projects/<slug:slug>/", api_views.ProjectDetailView.as_view(), name="project_detail"),

    # Featured projects
    path("featured/", api_views.FeaturedProjectsView.as_view(), name="featured_projects"),

    # Project categories/technologies
    path("technologies/", api_views.TechnologyListView.as_view(), name="technology_list"),
]
