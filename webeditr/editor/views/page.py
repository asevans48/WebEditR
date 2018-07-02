
import traceback

from django.http import JsonResponse

from ..modules.assets import get_stylesheets_by_page, get_scriptsheets_by_page, get_elements_by_page


def get_page_stylesheets(request):
    try:
        rdict = dict(request.POST)
        page_name = rdict['page_name'][0]
        sheets = get_stylesheets_by_page(page_name)
        return JsonResponse({'success': True, 'sheets': sheets})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


def get_page_scriptsheets(request):
    try:
        rdict = dict(request.POST)
        page_name = rdict['page_name'][0]
        sheets = get_scriptsheets_by_page(page_name)
        return JsonResponse({'success': False, 'sheets': sheets})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


def get_page_elements(request):
    try:
        rdict = dict(request.POST)
        page_name = rdict['page_name'][0]
        elements = get_elements_by_page(page_name)
        return JsonResponse({'success': True, 'elements': elements})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


def load_stylesheet(request):
    try:
        # returns textual representation of the stylesheet
        pass
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


def load_scriptsheet(request):
    try:
        # returns textual representation of the scriptsheet
        pass
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})
