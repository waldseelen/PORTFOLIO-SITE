"""
Chat API Views
"""

import json
import uuid

from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


@method_decorator(csrf_exempt, name='dispatch')
class ChatMessageView(View):
    """Handle chat messages."""

    def post(self, request):
        try:
            data = json.loads(request.body)
            message = data.get('message', '').strip()
            session_id = data.get('session_id', str(uuid.uuid4()))

            if not message:
                return JsonResponse({
                    "success": False,
                    "error": "Message is required",
                }, status=400)

            # TODO: Integrate with AI service (OpenAI, etc.)
            # For now, return a placeholder response
            response = self.get_ai_response(message)

            return JsonResponse({
                "success": True,
                "data": {
                    "session_id": session_id,
                    "message": message,
                    "response": response,
                }
            })

        except json.JSONDecodeError:
            return JsonResponse({
                "success": False,
                "error": "Invalid JSON data",
            }, status=400)
        except Exception as e:
            return JsonResponse({
                "success": False,
                "error": str(e),
            }, status=500)

    def get_ai_response(self, message):
        """Get AI response for the message."""
        # Placeholder responses
        responses = {
            "merhaba": "Merhaba! Size nasıl yardımcı olabilirim?",
            "hello": "Hello! How can I help you?",
            "projeler": "Projeler sayfasından tüm çalışmalarımı inceleyebilirsiniz.",
            "iletişim": "İletişim sayfasından benimle iletişime geçebilirsiniz.",
        }

        message_lower = message.lower()
        for key, response in responses.items():
            if key in message_lower:
                return response

        return "Mesajınız için teşekkürler. En kısa sürede size dönüş yapacağım."


@method_decorator(csrf_exempt, name='dispatch')
class ChatHistoryView(View):
    """Get chat history."""

    def get(self, request):
        session_id = request.GET.get('session_id')

        if not session_id:
            return JsonResponse({
                "success": False,
                "error": "Session ID is required",
            }, status=400)

        # TODO: Implement actual chat history storage
        return JsonResponse({
            "success": True,
            "data": {
                "session_id": session_id,
                "messages": [],
            }
        })


@method_decorator(csrf_exempt, name='dispatch')
class ClearChatView(View):
    """Clear chat history."""

    def post(self, request):
        try:
            data = json.loads(request.body)
            session_id = data.get('session_id')

            if not session_id:
                return JsonResponse({
                    "success": False,
                    "error": "Session ID is required",
                }, status=400)

            # TODO: Implement actual chat history clearing
            return JsonResponse({
                "success": True,
                "message": "Chat history cleared",
            })

        except json.JSONDecodeError:
            return JsonResponse({
                "success": False,
                "error": "Invalid JSON data",
            }, status=400)
