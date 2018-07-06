
import traceback

from django.http import JsonResponse
from django.views.decorators.cache import never_cache
from django.utils.html import escape

from ..models import Page, Project, PageProject, ScriptSheet, StyleSheet, PageStylesheet, PageScriptSheet
from ..modules.assets import get_stylesheets_by_page_id, get_scriptsheets_by_page_id, get_elements_by_page_id


@never_cache
def add_new_page(request):
    try:
        rdict = dict(request.POST)
        print(rdict)
        page_name = escape(rdict['page_name'][0])
        page_description = escape(rdict['page_description'][0])
        project = escape(rdict['project'][0])
        project = Project.objects.filter(name=project)
        if project is not None:
            if page_name and page_description and len(page_name) > 0 and\
                    len(page_description) > 0:
                page_object, created = Page.objects.get_or_create(name=page_name)
                if created:
                    page_object.description = page_description
                    page_object.save()
                    page_project = PageProject()
                    page_project.project = project.first()
                    page_project.page = page_object
                    page_project.save()
                    script, created = ScriptSheet.objects.get_or_create(name=page_name)
                    if created:
                        script.description = "Page JS"
                    script.save()
                    ps = PageScriptSheet()
                    ps.script_sheet = script
                    ps.page = page_object
                    ps.save()
                    style, created = StyleSheet.objects.get_or_create(name=page_name)
                    if created:
                        style.description = "Page CSS"
                    style.save()
                    ps = PageStylesheet()
                    ps.page = page_object
                    ps.style_sheet = style
                    ps.save()
                    return JsonResponse({'success': True, 'page_id': page_object.id})
                else:
                    return JsonResponse({'sucecss': False, 'msg': 'Page Exists'})
            else:
                return JsonResponse({'success': False,
                                     'msg': 'Internal Error'})
        else:
            return JsonResponse({'success': False, 'msg': 'Project Not Found'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def remove_page(request):
    try:
        rdict = dict(request.POST)
        page_id = int(rdict['page_id'][0])
        project_id = int(rdict['project_id'][0])
        if page_id:
            page_project = PageProject.objects.filter(page_id = page_id, project_id = project_id)
            if page_project.count() > 0:
                page_project.first().delete()
                page_project = PageProject.objects.filter(page_id = page_id)
                if page_project.count() is 0:
                    page_script = PageScriptSheet.objects.filter(page_id=page_id)
                    page_styles = PageStylesheet.objects.filter(page_id=page_id)
                    page = Page.objects.filter(id=page_id)

                    if page_script.count() > 0:
                        for script in page_script:
                            try:
                                sheet = script.script_sheet
                                script.delete()
                                sheets = PageScriptSheet.objects.filter(script_sheet_id=sheet.id)
                                if sheets.count() is 0:
                                    sheet.delete()
                            except Exception as e:
                                raise e

                    if page_styles.count() > 0:
                        for style in page_styles:
                            try:
                                sheet = style.style_sheet
                                style.delete()
                                sheets = PageStylesheet.objects.filter(style_sheet_id=sheet.id)
                                if sheets.count() is 0:
                                    sheet.delete()
                            except Exception as e:
                                raise e

                    if page.count() > 0:
                        page.first().delete()
        return JsonResponse({'success': True, 'page_id': page_id})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def add_new_sheet(request):
    try:
        rdict = dict(request.POST)
        page_id = int(rdict['page_id'][0])
        page = Page.objects.filter(id=int(page_id))
        if page and page.count() > 0:
            page = page.first()
            title = escape(rdict['title'][0])
            stype = escape(rdict['type'][0])
            desc = escape(rdict['description'][0])
            project = rdict['project'][0]
            if title and stype and desc and project:
                if stype == 'CSS':
                    sheet, created = StyleSheet.objects.get_or_create(name=title)
                elif stype == 'JS':
                    sheet, created = ScriptSheet.objects.get_or_create(name=title)
                else:
                    return JsonResponse({'success': False, 'msg': 'Page Type Unknown'})
                if created is False:
                    sheet.description = desc
                sheet.save()
                if stype == 'CSS':
                    page_sheet, created = PageStylesheet.objects.get_or_create(style_sheet=sheet, page=page)
                    page_sheet.style_sheet = sheet
                else:
                    page_sheet, created = PageScriptSheet.objects.get_or_create(script_sheet=sheet, page=page)
                    page_sheet.script_sheet = sheet
                page_sheet.save()
                return JsonResponse({'success': True, 'sheet_id': sheet.id})
            else:
                return JsonResponse({'success': False, 'msg': 'Not All Information Provided'})
        else:
            return JsonResponse({'success': False, 'msg': 'Page Not Found'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def remove_sheet(request):
    try:
        rdict = dict(request.POST)
        sheet_id = int(rdict['sheet_id'][0])
        sheet_type = escape(rdict['sheet_type'][0])
        page_id = int(rdict['page_id'][0])
        if sheet_type == "js":
            page_script = PageScriptSheet.objects.filter(script_sheet_id=sheet_id, page_id=page_id)
            if page_script.count() > 0:
                page_script = page_script.first()
                script = page_script.script_sheet
                page_script.delete()
                page_script = PageScriptSheet.objects.filter(script_sheet_id=sheet_id)
                if page_script.count() is 0:
                    script.delete()
                return JsonResponse({'success': True, 'sheet_id': sheet_id})
            else:
                return JsonResponse({'success': False, 'msg': 'PageScript Not found'})
        elif sheet_type == "css":
            page_sheet  = PageStylesheet.objects.filter(style_sheet_id=sheet_id, page_id=page_id)
            if page_sheet.count() > 0:
                page_sheet = page_sheet.first()
                sheet = page_sheet.style_sheet
                page_sheet.delete()
                page_sheet = PageStylesheet.objects.filter(style_sheet_id=sheet_id)
                if page_sheet.count() is 0:
                    sheet.delete()
                return JsonResponse({'success': True, 'sheet_id': sheet_id})
            else:
                return JsonResponse({'success': False, 'msg': 'PageSheet Not Found'})
        else:
            return JsonResponse({'success': False, 'msg': 'Invalid Sheet Type'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def get_page_stylesheets(request):
    try:
        rdict = dict(request.POST)
        page_id = int(rdict['page_id'][0])
        sheets = get_stylesheets_by_page_id(page_id)
        return JsonResponse({'success': True, 'sheets': sheets})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def get_page_scriptsheets(request):
    try:
        rdict = dict(request.POST)
        page_id = rdict['page_id'][0]
        sheets = get_scriptsheets_by_page_id(page_id)
        return JsonResponse({'success': False, 'sheets': sheets})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def get_page_elements(request):
    try:
        rdict = dict(request.POST)
        page_id = int(rdict['page_id'][0])
        elements = get_elements_by_page_id(page_id)
        return JsonResponse({'success': True, 'elements': elements})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})
