
from django.shortcuts import render

app_name = 'editor'

def editor_home(request):
    return render("hello world!")