"""
Feature Flag Template Tag Library
==================================

Provides template tags for conditional rendering based on feature flags.

Usage:
    {% load feature_flags %}

    {% feature "bento_grid" %}
        <div>Bento grid content</div>
    {% endfeature %}

    {% feature "blog_comments" %}
        <div>Comments enabled</div>
    {% else %}
        <div>Comments disabled</div>
    {% endfeature %}

    {% if_feature "new_navigation" %}
        {% include "navigation/new.html" %}
    {% endif_feature %}
"""

from django import template
from django.template.base import NodeList

from apps.core.feature_flags import is_feature_enabled

register = template.Library()


class FeatureNode(template.Node):
    """Template node for feature flag conditional rendering."""

    def __init__(self, flag_name: str, nodelist_true: NodeList, nodelist_false: NodeList = None):
        self.flag_name = flag_name
        self.nodelist_true = nodelist_true
        self.nodelist_false = nodelist_false or NodeList()

    def render(self, context):
        request = context.get('request')

        if is_feature_enabled(self.flag_name, request):
            return self.nodelist_true.render(context)
        return self.nodelist_false.render(context)


@register.tag('feature')
def do_feature(parser, token):
    """
    Conditionally render content based on feature flag.

    Usage:
        {% feature "flag_name" %}
            Content when enabled
        {% else %}
            Content when disabled
        {% endfeature %}
    """
    bits = token.split_contents()
    if len(bits) != 2:
        raise template.TemplateSyntaxError(
            f"'{bits[0]}' tag requires exactly one argument (feature flag name)"
        )

    flag_name = bits[1]
    # Remove quotes if present
    if flag_name[0] in ('"', "'") and flag_name[-1] == flag_name[0]:
        flag_name = flag_name[1:-1]

    nodelist_true = parser.parse(('else', 'endfeature'))
    token = parser.next_token()

    if token.contents == 'else':
        nodelist_false = parser.parse(('endfeature',))
        parser.delete_first_token()
    else:
        nodelist_false = NodeList()

    return FeatureNode(flag_name, nodelist_true, nodelist_false)


@register.simple_tag(takes_context=True)
def is_enabled(context, flag_name: str) -> bool:
    """
    Check if a feature flag is enabled.

    Usage:
        {% is_enabled "bento_grid" as show_bento %}
        {% if show_bento %}...{% endif %}
    """
    request = context.get('request')
    return is_feature_enabled(flag_name, request)


@register.filter
def feature_enabled(flag_name: str) -> bool:
    """
    Filter to check feature flag status.

    Usage:
        {% if "bento_grid"|feature_enabled %}...{% endif %}
    """
    return is_feature_enabled(flag_name)
