
import base64
import traceback

from django.http import JsonResponse
from django.views.decorators.cache import never_cache

from ..models import ScriptFunc, ScriptSheet, StyleSheet


@never_cache
def add_stylesheet_attribute(request):
    try:
        pass
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def add_scriptsheet_function(request):
    try:
        pass
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def remove_stylesheet_attribute(request):
    try:
        pass
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def remove_scriptsheet_function(request):
    try:
        pass
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})
