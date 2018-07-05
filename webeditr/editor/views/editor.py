
from django.shortcuts import render
from django.views.decorators.cache import never_cache

app_name = 'editor'


@never_cache
def editor_home(request):
    ctx = {}
    return render(request, "editor/editor.html", ctx)