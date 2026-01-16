"""
Chat API URL Configuration
"""

from django.urls import path

from . import api_views

app_name = "chat_api"

urlpatterns = [
    # Send message
    path("message/", api_views.ChatMessageView.as_view(), name="send_message"),

    # Get chat history (for authenticated users)
    path("history/", api_views.ChatHistoryView.as_view(), name="chat_history"),

    # Clear chat
    path("clear/", api_views.ClearChatView.as_view(), name="clear_chat"),
]
