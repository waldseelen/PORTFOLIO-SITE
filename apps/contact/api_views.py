"""
Contact API Views
"""

import json

from django.conf import settings
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .models import Contact


@method_decorator(csrf_exempt, name='dispatch')
class ContactSubmitView(View):
    """Handle contact form submissions."""

    def post(self, request):
        try:
            data = json.loads(request.body)

            name = data.get('name', '').strip()
            email = data.get('email', '').strip()
            subject = data.get('subject', '').strip()
            message = data.get('message', '').strip()

            # Validation
            if not all([name, email, message]):
                return JsonResponse({
                    "success": False,
                    "error": "Name, email, and message are required.",
                }, status=400)

            # Create contact record
            contact = Contact.objects.create(
                name=name,
                email=email,
                subject=subject or "İletişim Formu",
                message=message,
            )

            # Send email notification (optional)
            try:
                send_mail(
                    subject=f"[Portfolio] {subject or 'Yeni İletişim Mesajı'}",
                    message=f"İsim: {name}\nE-posta: {email}\n\nMesaj:\n{message}",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[settings.CONTACT_EMAIL],
                    fail_silently=True,
                )
            except Exception:
                pass  # Email sending is optional

            return JsonResponse({
                "success": True,
                "message": "Mesajınız başarıyla gönderildi.",
                "id": contact.id,
            })

        except json.JSONDecodeError:
            return JsonResponse({
                "success": False,
                "error": "Invalid JSON data.",
            }, status=400)
        except Exception as e:
            return JsonResponse({
                "success": False,
                "error": str(e),
            }, status=500)


@method_decorator(csrf_exempt, name='dispatch')
class ContactInfoView(View):
    """Get contact information."""

    def get(self, request):
        return JsonResponse({
            "success": True,
            "data": {
                "email": getattr(settings, 'CONTACT_EMAIL', 'info@example.com'),
                "social": {
                    "github": getattr(settings, 'SOCIAL_GITHUB', ''),
                    "linkedin": getattr(settings, 'SOCIAL_LINKEDIN', ''),
                    "twitter": getattr(settings, 'SOCIAL_TWITTER', ''),
                },
                "location": getattr(settings, 'CONTACT_LOCATION', 'İstanbul, Türkiye'),
            }
        })
