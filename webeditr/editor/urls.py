
from django.db import connection
from django.urls import re_path

from .views import editor

app_name = 'simplredapp'

cursor = connection.cursor()
# create defeault user
q = """
INSERT INTO
    simplredapp_role (role_name, role_key)
VALUES
    ('observer', 0),
    ('survey', 1),
    ('user', 2),
    ('counselor', 3),
    ('researcher', 4),
    ('manager', 5),
    ('admin', 6)
ON CONFLICT DO NOTHING
"""
cursor.execute(q)


urlpatterns = [
    re_path('^$', editor.editor_home, name='index'),
]
