
from django.db import connection
from django.urls import re_path

from .views import editor

app_name = 'webeditr'

urlpatterns = [
    re_path('^$', editor.editor_home, name='index'),
]
