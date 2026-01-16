from django.contrib import admin
from django.utils.html import format_html

# Import only portfolio-specific models (monitoring, GDPR, analytics)
from .models import (
    ABTestAssignment,
    AccountDeletionRequest,
    AnalyticsEvent,
    ConversionFunnel,
    CookieConsent,
    DataExportRequest,
    ErrorLog,
    NotificationLog,
    PerformanceMetric,
    ShortURL,
    UserJourney,
    UserSession,
    WebPushSubscription,
)
# ==========================================================================
# USER SESSION MANAGEMENT ADMIN
# ==========================================================================


@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "ip_address",
        "location",
        "device_info_display",
        "is_active",
        "created_at",
        "last_activity",
    )
    list_filter = ("is_active", "created_at", "last_activity")
    search_fields = ("user__email", "ip_address", "location", "user_agent")
    ordering = ("-last_activity",)
    readonly_fields = ("session_key", "created_at", "last_activity", "device_info_display")

    def device_info_display(self, obj):
        info = obj.get_device_info()
        return format_html(
            '<strong>{}</strong> - {} <br/><small style="color: gray;">{}</small>',
            info["device_type"],
            info["browser"],
            info["user_agent"][:80],
        )

    device_info_display.short_description = "Device Info"


# ==========================================================================
# GDPR COMPLIANCE ADMIN
# ==========================================================================


@admin.register(CookieConsent)
class CookieConsentAdmin(admin.ModelAdmin):
    list_display = (
        "session_key_short",
        "consent_summary_display",
        "consent_given_at",
        "expires_at",
        "is_expired",
    )
    list_filter = ("necessary", "functional", "analytics", "marketing", "consent_given_at")
    search_fields = ("session_key", "ip_address")
    ordering = ("-consent_given_at",)
    readonly_fields = ("consent_given_at", "updated_at")

    def session_key_short(self, obj):
        return obj.session_key[:15] + "..." if len(obj.session_key) > 15 else obj.session_key

    session_key_short.short_description = "Session"

    def consent_summary_display(self, obj):
        summary = obj.get_consent_summary()
        icons = {
            'necessary': '✓',
            'functional': '✓' if summary['functional'] else '✗',
            'analytics': '✓' if summary['analytics'] else '✗',
            'marketing': '✓' if summary['marketing'] else '✗',
        }
        return format_html(
            '<span title="Necessary">🔒{}</span> | '
            '<span title="Functional">⚙️{}</span> | '
            '<span title="Analytics">📊{}</span> | '
            '<span title="Marketing">📢{}</span>',
            icons['necessary'],
            icons['functional'],
            icons['analytics'],
            icons['marketing'],
        )

    consent_summary_display.short_description = "Consents"


@admin.register(DataExportRequest)
class DataExportRequestAdmin(admin.ModelAdmin):
    list_display = ("user", "email", "status", "request_date", "completed_at")
    list_filter = ("status", "request_date")
    search_fields = ("user__email", "email")
    ordering = ("-request_date",)
    readonly_fields = ("request_date", "completed_at")


@admin.register(AccountDeletionRequest)
class AccountDeletionRequestAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "email",
        "status",
        "request_date",
        "scheduled_deletion",
        "is_expired",
    )
    list_filter = ("status", "request_date", "scheduled_deletion")
    search_fields = ("user__email", "email", "confirmation_token")
    ordering = ("-request_date",)
    readonly_fields = ("request_date", "confirmed_at", "confirmation_token")


# ==========================================================================
# MONITORING & ANALYTICS ADMIN
# ==========================================================================


@admin.register(PerformanceMetric)
class PerformanceMetricAdmin(admin.ModelAdmin):
    list_display = (
        "metric_type",
        "value",
        "url",
        "user_agent_short",
        "ip_address",
        "timestamp",
    )
    list_filter = ("metric_type", "timestamp")
    search_fields = ("url", "user_agent", "ip_address")
    ordering = ("-timestamp",)
    readonly_fields = ("timestamp", "user_agent", "ip_address")
    date_hierarchy = "timestamp"

    def user_agent_short(self, obj):
        if obj.user_agent:
            return (
                obj.user_agent[:50] + "..."
                if len(obj.user_agent) > 50
                else obj.user_agent
            )
        return "-"

    user_agent_short.short_description = "User Agent"


@admin.register(WebPushSubscription)
class WebPushSubscriptionAdmin(admin.ModelAdmin):
    list_display = (
        "endpoint_short",
        "user_agent_short",
        "enabled",
        "created_at",
        "last_success",
    )
    list_filter = ("enabled", "created_at", "last_success")
    search_fields = ("endpoint", "user_agent")
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at")

    def endpoint_short(self, obj):
        if obj.endpoint:
            return obj.endpoint[:50] + "..." if len(obj.endpoint) > 50 else obj.endpoint
        return "-"

    endpoint_short.short_description = "Endpoint"

    def user_agent_short(self, obj):
        if obj.user_agent:
            return (
                obj.user_agent[:40] + "..."
                if len(obj.user_agent) > 40
                else obj.user_agent
            )
        return "-"

    user_agent_short.short_description = "User Agent"


@admin.register(ErrorLog)
class ErrorLogAdmin(admin.ModelAdmin):
    list_display = (
        "level",
        "message_short",
        "url",
        "user_agent_short",
        "last_occurred",
    )
    list_filter = ("level", "last_occurred")
    search_fields = ("message", "url", "user_agent")
    ordering = ("-last_occurred",)
    readonly_fields = ("created_at", "updated_at", "first_occurred", "last_occurred")
    date_hierarchy = "last_occurred"

    def message_short(self, obj):
        if obj.message:
            return obj.message[:60] + "..." if len(obj.message) > 60 else obj.message
        return "-"

    message_short.short_description = "Message"

    def user_agent_short(self, obj):
        if obj.user_agent:
            return (
                obj.user_agent[:40] + "..."
                if len(obj.user_agent) > 40
                else obj.user_agent
            )
        return "-"

    user_agent_short.short_description = "User Agent"


@admin.register(NotificationLog)
class NotificationLogAdmin(admin.ModelAdmin):
    list_display = ("notification_type", "title_short", "status", "created_at")
    list_filter = ("notification_type", "status", "created_at")
    search_fields = ("title", "body")
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at", "sent_at", "delivered_at")
    date_hierarchy = "created_at"

    def title_short(self, obj):
        if obj.title:
            return obj.title[:60] + "..." if len(obj.title) > 60 else obj.title
        return "-"

    title_short.short_description = "Title"


# ==========================================================================
# ANALYTICS ADMIN
# ==========================================================================


@admin.register(AnalyticsEvent)
class AnalyticsEventAdmin(admin.ModelAdmin):
    list_display = (
        "event_type",
        "event_name",
        "anonymous_id_short",
        "page_path",
        "device_type",
        "timestamp",
    )
    list_filter = ("event_type", "device_type", "gdpr_consent", "timestamp")
    search_fields = ("event_name", "page_path", "anonymous_id")
    ordering = ("-timestamp",)
    readonly_fields = ("timestamp", "session_start", "expires_at")
    date_hierarchy = "timestamp"

    def anonymous_id_short(self, obj):
        return obj.anonymous_id[:12] + "..." if len(obj.anonymous_id) > 12 else obj.anonymous_id

    anonymous_id_short.short_description = "Anonymous ID"


@admin.register(UserJourney)
class UserJourneyAdmin(admin.ModelAdmin):
    list_display = (
        "journey_id_short",
        "anonymous_id_short",
        "current_step",
        "total_steps",
        "is_completed",
        "started_at",
    )
    list_filter = ("is_completed", "gdpr_consent", "started_at")
    search_fields = ("journey_id", "anonymous_id", "current_step")
    ordering = ("-started_at",)
    readonly_fields = ("started_at", "last_activity", "expires_at")

    def journey_id_short(self, obj):
        return obj.journey_id[:15] + "..." if len(obj.journey_id) > 15 else obj.journey_id

    journey_id_short.short_description = "Journey ID"

    def anonymous_id_short(self, obj):
        return obj.anonymous_id[:12] + "..." if len(obj.anonymous_id) > 12 else obj.anonymous_id

    anonymous_id_short.short_description = "Anonymous ID"


@admin.register(ConversionFunnel)
class ConversionFunnelAdmin(admin.ModelAdmin):
    list_display = (
        "funnel_name",
        "funnel_id_short",
        "current_step",
        "current_step_order",
        "is_completed",
        "started_at",
    )
    list_filter = ("funnel_name", "is_completed", "gdpr_consent", "started_at")
    search_fields = ("funnel_id", "funnel_name", "anonymous_id")
    ordering = ("-started_at",)
    readonly_fields = ("started_at", "last_activity", "completed_at", "expires_at")

    def funnel_id_short(self, obj):
        return obj.funnel_id[:15] + "..." if len(obj.funnel_id) > 15 else obj.funnel_id

    funnel_id_short.short_description = "Funnel ID"


@admin.register(ABTestAssignment)
class ABTestAssignmentAdmin(admin.ModelAdmin):
    list_display = (
        "test_name",
        "variant",
        "anonymous_id_short",
        "has_converted",
        "conversion_type",
        "assigned_at",
    )
    list_filter = ("test_name", "variant", "has_converted", "gdpr_consent", "assigned_at")
    search_fields = ("test_name", "anonymous_id", "conversion_type")
    ordering = ("-assigned_at",)
    readonly_fields = ("assigned_at", "converted_at", "expires_at")

    def anonymous_id_short(self, obj):
        return obj.anonymous_id[:12] + "..." if len(obj.anonymous_id) > 12 else obj.anonymous_id

    anonymous_id_short.short_description = "Anonymous ID"


# ==========================================================================
# SHORT URL ADMIN
# ==========================================================================


@admin.register(ShortURL)
class ShortURLAdmin(admin.ModelAdmin):
    list_display = (
        "short_code",
        "original_url_short",
        "title",
        "click_count",
        "is_active",
        "created_at",
        "expires_at",
    )
    list_filter = ("is_active", "created_at", "expires_at")
    search_fields = ("short_code", "original_url", "title")
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at", "click_count")

    def original_url_short(self, obj):
        return obj.original_url[:50] + "..." if len(obj.original_url) > 50 else obj.original_url

    original_url_short.short_description = "Original URL"
