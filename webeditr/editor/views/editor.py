
from django.shortcuts import render

app_name = 'editor'

def editor_home(request):
    ctx = {}
    return render(request, "editor/editor.html", ctx)