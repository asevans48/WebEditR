"""
Import handler for obtaining foreign scripts and sheets to be loaded into
the page. Allows sheets to be set (KEEP TO INTERNAL STUFF PLEASE)

@author aevans
"""

import traceback

from django.http import JsonResponse
from django.views.decorators.cache import never_cache


def is_http(fpath):
    """
    We are trying to ban external scripts over http here.
    :return: boolean
    """
    return fpath.startswith("http")


@never_cache
def remove_imports_by_project(request):
    try:
        pass
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def add_imports_by_project(request):
    try:
        pass
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def get_imports_by_project(request):
    try:
        pass
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})
