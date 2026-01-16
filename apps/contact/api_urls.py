"""
Contact API URL Configuration
"""

from django.urls import path

from . import api_views

app_name = "contact_api"

urlpatterns = [
    # Submit contact form
    path("submit/", api_views.ContactSubmitView.as_view(), name="contact_submit"),

    # Get contact info
    path("info/", api_views.ContactInfoView.as_view(), name="contact_info"),
]
