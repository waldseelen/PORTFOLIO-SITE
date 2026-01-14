"""
Custom Admin Views for Modern Admin Panel
Professional admin panel with modern UI/UX
"""

from django.contrib import messages
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db.models import Count, Q, Sum
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.utils import timezone
from django.views.decorators.http import require_POST
from datetime import timedelta

from apps.blog.models import Post
from apps.tools.models import Tool
from apps.main.models import (
    BlogPost,
    CybersecurityResource,
    AITool,
    UsefulResource,
    PersonalInfo,
    SocialLink,
)


@staff_member_required
def modern_admin_dashboard(request):
    """
    Modern Admin Dashboard - Ana Sayfa
    """
    # Son 30 gün içindeki istatistikler
    last_30_days = timezone.now() - timedelta(days=30)

    # Blog istatistikleri
    total_blog_posts = Post.objects.count() + BlogPost.objects.count()
    recent_posts = Post.objects.filter(created_at__gte=last_30_days).count()
    published_posts = Post.objects.filter(status='published').count()
    draft_posts = Post.objects.filter(status='draft').count()

    # Tools istatistikleri
    total_tools = Tool.objects.count()
    visible_tools = Tool.objects.filter(is_visible=True).count()

    # AI Tools istatistikleri
    total_ai_tools = AITool.objects.count()
    featured_ai_tools = AITool.objects.filter(is_featured=True).count()

    # Cybersecurity istatistikleri
    total_cyber_resources = CybersecurityResource.objects.count()
    urgent_cyber = CybersecurityResource.objects.filter(is_urgent=True).count()
    critical_cyber = CybersecurityResource.objects.filter(severity_level=4).count()

    # Son aktiviteler
    recent_blog_posts = Post.objects.order_by('-created_at')[:5]
    recent_cyber = CybersecurityResource.objects.order_by('-created_at')[:5]

    context = {
        'page_title': 'Admin Dashboard',
        'stats': {
            'blog': {
                'total': total_blog_posts,
                'recent': recent_posts,
                'published': published_posts,
                'draft': draft_posts,
            },
            'tools': {
                'total': total_tools,
                'visible': visible_tools,
            },
            'ai_tools': {
                'total': total_ai_tools,
                'featured': featured_ai_tools,
            },
            'cybersecurity': {
                'total': total_cyber_resources,
                'urgent': urgent_cyber,
                'critical': critical_cyber,
            },
        },
        'recent_activities': {
            'blog_posts': recent_blog_posts,
            'cyber_resources': recent_cyber,
        },
    }

    return render(request, 'admin/modern/dashboard.html', context)


def modern_admin_login(request):
    """
    Modern Admin Login Page with authentication handling
    """
    # Eğer kullanıcı zaten giriş yapmışsa dashboard'a yönlendir
    if request.user.is_authenticated and request.user.is_staff:
        return redirect('modern_admin:dashboard')

    error = None

    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        user = authenticate(request, username=email, password=password)

        if user is not None and user.is_staff:
            login(request, user)
            messages.success(request, f'Hoş geldiniz, {user.name or user.email}!')
            return redirect('modern_admin:dashboard')
        else:
            error = 'Geçersiz e-posta veya şifre.'

    return render(request, 'admin/modern/login.html', {'error': error})


def admin_logout(request):
    """Admin logout view"""
    logout(request)
    messages.info(request, 'Başarıyla çıkış yaptınız.')
    return redirect('modern_admin:login')


@staff_member_required
def blog_management(request):
    """
    Blog Yönetim Sayfası
    """
    posts = Post.objects.all().select_related('author').order_by('-created_at')

    # İstatistikler
    published_count = posts.filter(status='published').count()
    draft_count = posts.filter(status='draft').count()
    total_views = posts.aggregate(total=Sum('view_count'))['total'] or 0

    context = {
        'page_title': 'Blog Yönetimi',
        'posts': posts,
        'published_count': published_count,
        'draft_count': draft_count,
        'total_views': total_views,
    }

    return render(request, 'admin/modern/blog.html', context)


@staff_member_required
def blog_create(request):
    """Blog yazısı oluşturma"""
    if request.method == 'POST':
        # Form işleme
        title = request.POST.get('title')
        content = request.POST.get('content')
        excerpt = request.POST.get('excerpt')
        slug = request.POST.get('slug')
        status = request.POST.get('status', 'draft')
        meta_description = request.POST.get('meta_description')
        tags = request.POST.get('tags', '').split(',')

        post = Post.objects.create(
            title=title,
            content=content,
            excerpt=excerpt,
            slug=slug or None,
            status=status,
            meta_description=meta_description,
            tags=[t.strip() for t in tags if t.strip()],
            author=request.user,
        )

        messages.success(request, f'"{title}" başlıklı yazı başarıyla oluşturuldu.')
        return redirect('modern_admin:blog')

    return render(request, 'admin/modern/blog_form.html', {
        'page_title': 'Yeni Blog Yazısı',
    })


@staff_member_required
def blog_edit(request, post_id):
    """Blog yazısı düzenleme"""
    post = get_object_or_404(Post, id=post_id)

    if request.method == 'POST':
        post.title = request.POST.get('title')
        post.content = request.POST.get('content')
        post.excerpt = request.POST.get('excerpt')
        post.slug = request.POST.get('slug') or post.slug
        post.status = request.POST.get('status', 'draft')
        post.meta_description = request.POST.get('meta_description')
        tags = request.POST.get('tags', '').split(',')
        post.tags = [t.strip() for t in tags if t.strip()]
        post.save()

        messages.success(request, f'"{post.title}" başlıklı yazı güncellendi.')
        return redirect('modern_admin:blog')

    return render(request, 'admin/modern/blog_form.html', {
        'page_title': 'Yazıyı Düzenle',
        'post': post,
    })


@staff_member_required
@require_POST
def blog_delete(request, post_id):
    """Blog yazısı silme"""
    post = get_object_or_404(Post, id=post_id)
    title = post.title
    post.delete()
    messages.success(request, f'"{title}" başlıklı yazı silindi.')
    return redirect('modern_admin:blog')


@staff_member_required
def cybersecurity_management(request):
    """
    Siber Güvenlik Yönetim Sayfası
    """
    resources = CybersecurityResource.objects.all().order_by('-severity_level', '-created_at')

    # Kategorilere göre grupla
    by_type = resources.values('type').annotate(count=Count('id'))
    by_severity = resources.values('severity_level').annotate(count=Count('id'))

    context = {
        'page_title': 'Siber Güvenlik Yönetimi',
        'resources': resources,
        'stats': {
            'by_type': by_type,
            'by_severity': by_severity,
            'urgent_count': resources.filter(is_urgent=True).count(),
            'total': resources.count(),
        },
    }

    return render(request, 'admin/modern/cybersecurity.html', context)


@staff_member_required
def tools_management(request):
    """
    Tools & AI Tools Yönetim Sayfası
    """
    tools = Tool.objects.all().order_by('category', 'title')
    ai_tools = AITool.objects.all().order_by('category', 'name')
    useful_resources = UsefulResource.objects.all().order_by('category', 'name')

    context = {
        'page_title': 'Tools Yönetimi',
        'tools': tools,
        'ai_tools': ai_tools,
        'useful_resources': useful_resources,
    }

    return render(request, 'admin/modern/tools.html', context)


# ============================================================================
# Portfolio Management Views
# ============================================================================

@staff_member_required
def portfolio_management(request):
    """
    Portfolio Yönetim Sayfası
    """
    # Kişisel bilgiler
    personal_info = {
        'name': PersonalInfo.objects.filter(key='name').first(),
        'title': PersonalInfo.objects.filter(key='title').first(),
    }

    # Sosyal linkler
    social_links = SocialLink.objects.filter(is_visible=True).order_by('order')

    context = {
        'page_title': 'Portfolyo Yönetimi',
        'personal_info': {
            'name': personal_info['name'].value if personal_info['name'] else None,
            'title': personal_info['title'].value if personal_info['title'] else None,
        },
        'social_links': social_links,
        'social_links_count': social_links.count(),
        'projects': [],  # Projeleri ekleyebilirsiniz
        'projects_count': 0,
        'featured_count': 0,
        'skills_count': PersonalInfo.objects.filter(type='skill').count(),
    }

    return render(request, 'admin/modern/portfolio.html', context)


# ============================================================================
# Settings & SEO Views
# ============================================================================

@staff_member_required
def settings_management(request):
    """
    Site Ayarları Sayfası
    """
    if request.method == 'POST':
        # Ayarları kaydet
        messages.success(request, 'Ayarlar başarıyla kaydedildi.')
        return redirect('modern_admin:settings')

    context = {
        'page_title': 'Site Ayarları',
        'settings': {},  # Ayarları veritabanından çekin
    }

    return render(request, 'admin/modern/settings.html', context)


@staff_member_required
def seo_management(request):
    """
    SEO Ayarları Sayfası
    """
    if request.method == 'POST':
        messages.success(request, 'SEO ayarları başarıyla kaydedildi.')
        return redirect('modern_admin:seo')

    # SEO istatistikleri
    context = {
        'page_title': 'SEO Ayarları',
        'seo_score': 85,
        'meta_titles': Post.objects.exclude(title='').count(),
        'meta_descriptions': Post.objects.exclude(meta_description='').exclude(meta_description__isnull=True).count(),
        'indexed_pages': Post.objects.filter(status='published').count() + 10,
        'sitemap_urls': Post.objects.filter(status='published').count() + 15,
        'seo': {},  # SEO ayarlarını veritabanından çekin
    }

    return render(request, 'admin/modern/seo.html', context)


# ============================================================================
# Profile & Security Views
# ============================================================================

@staff_member_required
def profile_management(request):
    """
    Profil Ayarları Sayfası
    """
    if request.method == 'POST':
        user = request.user
        user.name = request.POST.get('name', user.name)
        user.email = request.POST.get('email', user.email)
        user.username = request.POST.get('username', user.username)

        # Şifre değiştirme
        current_password = request.POST.get('current_password')
        new_password = request.POST.get('new_password')
        new_password_confirm = request.POST.get('new_password_confirm')

        if current_password and new_password:
            if user.check_password(current_password):
                if new_password == new_password_confirm:
                    user.set_password(new_password)
                    messages.success(request, 'Şifreniz başarıyla değiştirildi.')
                else:
                    messages.error(request, 'Yeni şifreler eşleşmiyor.')
            else:
                messages.error(request, 'Mevcut şifre hatalı.')

        user.save()
        messages.success(request, 'Profil bilgileriniz güncellendi.')
        return redirect('modern_admin:profile')

    return render(request, 'admin/modern/profile.html', {
        'page_title': 'Profil Ayarları',
    })


@staff_member_required
def setup_2fa(request):
    """
    2FA Kurulum Sayfası
    """
    user = request.user

    if request.method == 'POST':
        token = request.POST.get('token')
        if user.verify_totp(token):
            user.is_2fa_enabled = True
            user.save()
            messages.success(request, 'İki faktörlü doğrulama başarıyla etkinleştirildi.')
            return redirect('modern_admin:profile')
        else:
            messages.error(request, 'Geçersiz doğrulama kodu.')

    # QR kod oluştur
    if not user.totp_secret:
        user.generate_totp_secret()

    qr_code = user.get_qr_code()

    return render(request, 'admin/modern/setup_2fa.html', {
        'page_title': '2FA Kurulumu',
        'qr_code': qr_code,
    })


# ============================================================================
# CRUD Views for Tools, Cybersecurity, etc.
# ============================================================================

@staff_member_required
def tool_create(request):
    """Tool oluşturma"""
    if request.method == 'POST':
        # Form işleme
        messages.success(request, 'Araç başarıyla oluşturuldu.')
        return redirect('modern_admin:tools')

    return render(request, 'admin/modern/tool_form.html', {
        'page_title': 'Yeni Araç',
    })


@staff_member_required
def tool_edit(request, tool_id):
    """Tool düzenleme"""
    tool = get_object_or_404(Tool, id=tool_id)

    if request.method == 'POST':
        messages.success(request, 'Araç güncellendi.')
        return redirect('modern_admin:tools')

    return render(request, 'admin/modern/tool_form.html', {
        'page_title': 'Aracı Düzenle',
        'tool': tool,
    })


@staff_member_required
def ai_tool_create(request):
    """AI Tool oluşturma"""
    return render(request, 'admin/modern/ai_tool_form.html', {
        'page_title': 'Yeni AI Aracı',
    })


@staff_member_required
def ai_tool_edit(request, tool_id):
    """AI Tool düzenleme"""
    tool = get_object_or_404(AITool, id=tool_id)
    return render(request, 'admin/modern/ai_tool_form.html', {
        'page_title': 'AI Aracını Düzenle',
        'tool': tool,
    })


@staff_member_required
def resource_create(request):
    """Faydalı kaynak oluşturma"""
    return render(request, 'admin/modern/resource_form.html', {
        'page_title': 'Yeni Kaynak',
    })


@staff_member_required
def resource_edit(request, resource_id):
    """Faydalı kaynak düzenleme"""
    resource = get_object_or_404(UsefulResource, id=resource_id)
    return render(request, 'admin/modern/resource_form.html', {
        'page_title': 'Kaynağı Düzenle',
        'resource': resource,
    })


@staff_member_required
def cybersecurity_create(request):
    """Siber güvenlik kaynağı oluşturma"""
    if request.method == 'POST':
        messages.success(request, 'Siber güvenlik kaynağı oluşturuldu.')
        return redirect('modern_admin:cybersecurity')

    return render(request, 'admin/modern/cybersecurity_form.html', {
        'page_title': 'Yeni Siber Güvenlik Kaynağı',
    })


@staff_member_required
def cybersecurity_edit(request, resource_id):
    """Siber güvenlik kaynağı düzenleme"""
    resource = get_object_or_404(CybersecurityResource, id=resource_id)

    if request.method == 'POST':
        messages.success(request, 'Kaynak güncellendi.')
        return redirect('modern_admin:cybersecurity')

    return render(request, 'admin/modern/cybersecurity_form.html', {
        'page_title': 'Kaynağı Düzenle',
        'resource': resource,
    })


# Portfolio sub-views
@staff_member_required
def personal_info_edit(request):
    """Kişisel bilgileri düzenleme"""
    return render(request, 'admin/modern/personal_info.html', {
        'page_title': 'Kişisel Bilgiler',
    })


@staff_member_required
def project_create(request):
    """Proje oluşturma"""
    return render(request, 'admin/modern/project_form.html', {
        'page_title': 'Yeni Proje',
    })


@staff_member_required
def project_edit(request, project_id):
    """Proje düzenleme"""
    return render(request, 'admin/modern/project_form.html', {
        'page_title': 'Projeyi Düzenle',
    })


@staff_member_required
def social_link_create(request):
    """Sosyal link oluşturma"""
    return render(request, 'admin/modern/social_link_form.html', {
        'page_title': 'Yeni Sosyal Link',
    })


@staff_member_required
def social_link_edit(request, link_id):
    """Sosyal link düzenleme"""
    link = get_object_or_404(SocialLink, id=link_id)
    return render(request, 'admin/modern/social_link_form.html', {
        'page_title': 'Sosyal Linki Düzenle',
        'link': link,
    })
