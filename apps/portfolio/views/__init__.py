# Main views module
from .search import SearchView, TagCloudView, search_by_tag

# HTMX views for interactive UI
from .htmx_views import (
    like_project,
    project_description,
    filter_projects,
    search_projects,
    load_more_projects,
)

# Create function-based view aliases for URL patterns
search_view = SearchView.as_view()
tag_search_view = TagCloudView.as_view()
tag_results_view = search_by_tag
