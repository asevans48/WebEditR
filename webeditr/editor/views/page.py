
import traceback

from django.http import JsonResponse

from ..models import Page, Project, PageProject
from ..modules.assets import get_stylesheets_by_page_id, get_scriptsheets_by_page_id, get_elements_by_page_id


def add_new_page(request):
    try:
        rdict = dict(request.POST)
        page_name = rdict['page_name'][0]
        page_description = rdict['page_description'][0]
        project = rdict['project'][0]
        project = Project.objects.filter(name=project)
        if project is not None:
            if page_name and page_description and len(page_name) > 0 and\
                    len(page_description) > 0:
                page_object = Page()
                page_object.name = page_name
                page_object.description = page_description
                page_object.save()
                page_project = PageProject()
                page_project.project = project.first()
                page_project.page = page_object
                page_project.save()
                return JsonResponse({'success': True, 'page_id': page_object.id})
            else:
                return JsonResponse({'success': False,
                                     'msg': 'Internal Error'})
        else:
            return JsonResponse({'success': False, 'msg': 'Project Not Found'})
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
