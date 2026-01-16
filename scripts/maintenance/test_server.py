#!/usr/bin/env python
import os
import sys

import django

# Set up Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings.simple")
django.setup()

from wsgiref.simple_server import make_server

from django.core.wsgi import get_wsgi_application

print("Starting test server...")
application = get_wsgi_application()
print("WSGI application created successfully")

# Create and start server
with make_server("localhost", 8000, application) as httpd:
    print("Server started on http://localhost:8000")
    print("Press Ctrl+C to stop...")
    httpd.serve_forever()
