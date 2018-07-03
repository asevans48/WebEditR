
import traceback

from django.http import JsonResponse

from ..modules.assets import get_stylesheets_by_page_id, get_scriptsheets_by_page_id, get_elements_by_page_id


def add_new_page(request):
    try:
        pass
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


def add_new_scriptsheet(request):
    try:
        pass
    except Exception as e:
        print(traceback.extract_tb())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


def add_new_stylesheet(request):
    try:
        pass
    except Exception as e:
        print(traceback.extract_tb())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


def get_page_stylesheets(request):
    try:
        rdict = dict(request.POST)
        page_id = rdict['page_id'][0]
        sheets = get_stylesheets_by_page_id(page_id)
        return JsonResponse({'success': True, 'sheets': sheets})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


def get_page_scriptsheets(request):
    try:
        rdict = dict(request.POST)
        page_id = rdict['page_id'][0]
        sheets = get_scriptsheets_by_page_id(page_id)
        return JsonResponse({'success': False, 'sheets': sheets})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


def get_page_elements(request):
    try:
        rdict = dict(request.POST)
        page_id = rdict['page_id'][0]
        elements = get_elements_by_page_id(page_id)
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
