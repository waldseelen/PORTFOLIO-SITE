"""
Modern Admin Panel URLs
Professional admin panel with comprehensive content management
"""

from django.urls import path

from .admin_views import (
    # Dashboard & Auth
    modern_admin_dashboard,
    modern_admin_login,
    admin_logout,

    # Blog Management
    blog_management,
    blog_create,
    blog_edit,
    blog_delete,

    # Cybersecurity Management
    cybersecurity_management,
    cybersecurity_create,
    cybersecurity_edit,

    # Tools Management
    tools_management,
    tool_create,
    tool_edit,
    ai_tool_create,
    ai_tool_edit,
    resource_create,
    resource_edit,

    # Portfolio Management
    portfolio_management,
    personal_info_edit,
    project_create,
    project_edit,
    social_link_create,
    social_link_edit,

    # Settings & SEO
    settings_management,
    seo_management,

    # Profile & Security
    profile_management,
    setup_2fa,
)

app_name = 'modern_admin'

urlpatterns = [
    # ============================================
    # Authentication
    # ============================================
    path('login/', modern_admin_login, name='login'),
    path('logout/', admin_logout, name='logout'),

    # ============================================
    # Dashboard (Ana Sayfa)
    # ============================================
    path('', modern_admin_dashboard, name='dashboard'),

    # ============================================
    # Blog Yönetimi
    # ============================================
    path('blog/', blog_management, name='blog'),
    path('blog/create/', blog_create, name='blog_create'),
    path('blog/<int:post_id>/', blog_edit, name='blog_edit'),
    path('blog/<int:post_id>/delete/', blog_delete, name='blog_delete'),

    # ============================================
    # Siber Güvenlik Yönetimi
    # ============================================
    path('cybersecurity/', cybersecurity_management, name='cybersecurity'),
    path('cybersecurity/create/', cybersecurity_create, name='cybersecurity_create'),
    path('cybersecurity/<int:resource_id>/', cybersecurity_edit, name='cybersecurity_edit'),

    # ============================================
    # Tools Yönetimi
    # ============================================
    path('tools/', tools_management, name='tools'),
    path('tools/create/', tool_create, name='tool_create'),
    path('tools/<int:tool_id>/', tool_edit, name='tool_edit'),

    # AI Tools
    path('tools/ai/create/', ai_tool_create, name='ai_tool_create'),
    path('tools/ai/<int:tool_id>/', ai_tool_edit, name='ai_tool_edit'),

    # Useful Resources
    path('tools/resources/create/', resource_create, name='resource_create'),
    path('tools/resources/<int:resource_id>/', resource_edit, name='resource_edit'),

    # ============================================
    # Portfolio Yönetimi
    # ============================================
    path('portfolio/', portfolio_management, name='portfolio'),
    path('portfolio/personal/', personal_info_edit, name='personal_info'),
    path('portfolio/projects/create/', project_create, name='project_create'),
    path('portfolio/projects/<int:project_id>/', project_edit, name='project_edit'),
    path('portfolio/social/create/', social_link_create, name='social_link_create'),
    path('portfolio/social/<int:link_id>/', social_link_edit, name='social_link_edit'),

    # ============================================
    # Ayarlar
    # ============================================
    path('settings/', settings_management, name='settings'),
    path('seo/', seo_management, name='seo'),

    # ============================================
    # Profil & Güvenlik
    # ============================================
    path('profile/', profile_management, name='profile'),
    path('profile/2fa/', setup_2fa, name='setup_2fa'),
]
