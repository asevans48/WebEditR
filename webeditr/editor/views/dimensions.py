"""
Handles dimensions panel requests

@author aevans
"""
import traceback

from django.http import JsonResponse
from django.views.decorators.cache import never_cache


@never_cache
def remove_dimension_by_project(request):
    try:
        pass
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def add_dimension_by_project(request):
    try:
        pass
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def get_dimensions_by_project(request):
    try:
        pass
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})
