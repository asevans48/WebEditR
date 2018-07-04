
import traceback

from django.http import JsonResponse

from ..models import Page, Project, PageProject, ScriptSheet, StyleSheet, PageStylesheet, PageScriptSheet
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


def add_new_sheet(request):
    try:
        rdict = dict(request.POST)
        page_id = rdict['page_id'][0]
        page = Page.objects.filter(id=page_id)
        if page:
            page = page.first()
            title = rdict['title'][0]
            stype = rdict['type'][0]
            desc = rdict['description'][0]
            project = rdict['project'][0]
            if title and stype and desc and project:
                if stype == 'CSS':
                    sheet = StyleSheet()
                    page_sheet = PageStylesheet()
                elif stype == 'JS':
                    sheet = ScriptSheet()
                    page_sheet = PageScriptSheet()
                else:
                    return JsonResponse({'success': False, 'msg': 'Page Type Unknown'})
                sheet.name = title
                sheet.description = desc
                sheet.save()
                if stype == 'CSS':
                    page_sheet.style_sheet = sheet
                else:
                    page_sheet.script_sheet = sheet
                page_sheet.save()
                return JsonResponse({'success': True, 'sheet_id': sheet.id})
            else:
                return JsonResponse({'success': False, 'msg': 'Not All Information Provided'})
        else:
            return JsonResponse({'success': False, 'msg': 'Page Not Found'})
    except Exception as e:
        print(traceback.extract_tb())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


def remove_stylesheet(request):
    try:
        rdict = dict(request.POST)
        sheet_id = rdict['sheet_id'][0]
        sheet_type = rdict['sheet_type'][0]
        if sheet_type == "js":
            page_script = PageScriptSheet.objects.filter(script_sheet_id=sheet_id)
            if page_script:
                page_script = page_script.first()
                page_script.script_sheet.delete()
                page_script.delete()
        elif sheet_type == "css":
            page_sheet = PageStylesheet.objects.filter(style_sheet_id=sheet_id)
            if page_sheet:
                page_sheet = page_sheet.first()
                page_sheet.style_sheet.delete()
                page_sheet.delete()
        return JsonResponse({'success': True, 'sheet_id': sheet_id})
    except Exception as e:
        print(traceback.format_exc())
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
