import json
import traceback

from django.http import JsonResponse
from django.utils.html import escape
from django.views.decorators.cache import never_cache

from ..models import Page, Project, PageProject, ScriptSheet, StyleSheet, PageStylesheet, PageScriptSheet, \
    ExternalStyleSheet, ExternalScriptSheet, PageExternalStylesheet, PageExternalScriptSheet, ProjectStylesheet, \
    Element, PageElement, ProjectElement, Background, PageBackground
from ..modules.assets import get_stylesheets_by_page_id, get_scriptsheets_by_page_id, get_elements_by_page_id, \
    get_external_stylesheets_by_page_id, get_external_scriptsheets_by_page_id


@never_cache
def add_new_page(request):
    try:
        rdict = dict(request.POST)
        print(rdict)
        page_name = escape(rdict['page_name'][0])
        page_description = escape(rdict['page_description'][0])
        project = escape(rdict['project'][0])
        project_id = int(escape(str(rdict['project_id'][0])))
        project = Project.objects.filter(name=project)
        if project.count() > 0:
            project = project.first()
            if page_name and page_description and len(page_name) > 0 and\
                    len(page_description) > 0:
                page_object, created = Page.objects.get_or_create(name=page_name)
                if created:
                    page_object.description = page_description
                    page_object.save()
                    page_project, created = PageProject.objects.get_or_create(
                                                                        page=page_object,
                                                                        project=project)
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
                    ps, created = ProjectStylesheet.objects.get_or_create(
                                                                    style_sheet_id=style.id,
                                                                    project_id=project.id)
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
            project = escape(rdict['project'][0])
            project_id = int(escape(str(rdict['project_id'][0])))
            if title and stype and desc and project:
                if stype == 'CSS':
                    sheet, created = StyleSheet.objects.get_or_create(
                                                                    name=title,
                                                                    description=desc)
                elif stype == 'JS':
                    sheet, created = ScriptSheet.objects.get_or_create(
                                                                    name=title,
                                                                    description=desc)
                elif stype == 'ECSS':
                    sheet, created = ExternalStyleSheet.objects.get_or_create(
                                                                            name=title,
                                                                            url=desc)
                elif stype == 'EJS':
                    sheet, created = ExternalScriptSheet.objects.get_or_create(
                                                                            name=title,
                                                                            url=desc)
                else:
                    return JsonResponse({'success': False, 'msg': 'Page Type Unknown'})

                if created is False:
                    sheet.description = desc
                sheet.save()
                page_sheet = None
                if stype == 'CSS':
                    page_sheet, created = PageStylesheet.objects.get_or_create(style_sheet=sheet, page=page)
                elif stype == 'JS':
                    page_sheet, created = PageScriptSheet.objects.get_or_create(script_sheet=sheet, page=page)
                elif stype == 'ECSS':
                    page_sheet, created = PageExternalStylesheet.objects.get_or_create(style_sheet=sheet, page=page)
                elif stype == 'EJS':
                    page_sheet, created = PageExternalScriptSheet.objects.get_or_create(script_sheet=sheet, page=page)
                page_sheet.save()
                if stype == 'CSS':
                    project_sheet, created = ProjectStylesheet.objects.get_or_Create(project_id=project_id, style_sheet=sheet)
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
        print(rdict)
        sheet_id = int(rdict['sheet_id'][0])
        sheet_type = escape(rdict['sheet_type'][0])
        page_id = int(rdict['page_id'][0])
        if sheet_type.upper().strip() == "JS":
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
        elif sheet_type.upper().strip() == "css":
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
        elif sheet_type.upper().strip() == 'ECSS':
            page_sheet = PageExternalStylesheet.objects.filter(style_sheet_id=sheet_id)
            if page_sheet.count() > 0:
                page_sheet = page_sheet.first()
                sheet = page_sheet.style_sheet
                page_sheet.delete()
                page_sheet = PageExternalStylesheet.objects.filter(style_sheet_id=sheet_id)
                if page_sheet.count()  is 0:
                    sheet.delete()
                return JsonResponse({'success': True, 'sheet_id': sheet.id})
            else:
                return JsonResponse({'success': False, 'msg': 'Sheet Not Found'})
        elif sheet_type.upper().strip() == "EJS":
            page_script = PageExternalScriptSheet.objects.filter(script_sheet_id=sheet_id)
            if page_script.count() > 0:
                page_script = page_script.first()
                sheet = page_script.script_sheet
                page_script.delete()
                page_script = PageExternalScriptSheet.objects.filter(script_sheet_id=sheet_id)
                if page_script.count() is 0:
                    sheet.delete()
                return JsonResponse({'success': True, 'sheet_id': sheet.id})
            else:
                return JsonResponse({'success': False, 'msg': 'Sheet Not Found'})

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


@never_cache
def get_page_external_scriptsheets(request):
    try:
        rdict = dict(request.POST)
        page_id = int(rdict['page_id'][0])
        sheets = get_external_scriptsheets_by_page_id(page_id)
        return JsonResponse({'success': True, 'sheets': sheets})
    except Exception as e:
        print(traceback.extract_tb())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def get_page_external_stylesheets(request):
    try:
        rdict = dict(request.POST)
        page_id = int(rdict['page_id'][0])
        sheets = get_external_stylesheets_by_page_id(page_id)
        return JsonResponse({'success': False, 'msg': sheets})
    except Exception as e:
        print(traceback.extract_tb())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def add_page_element(request):
    try:
        rdict = dict(request.POST)
        oname = escape(rdict['object_name'][0])
        page_name = escape(rdict['page_name'][0])
        page= Page.objects.filter(name=page_name)
        el = Element.objects.filter(name=oname)
        top = int(rdict['top'][0])
        left = int(rdict['left'][0])
        if page.count() > 0 and el.count() > 0:
            page = page.first()
            el = el.first()
            page_el = PageElement.objects.create(element=el, page=page, top=top, left=left)
            page_el.save()
            return JsonResponse({'succecss': True, 'page_el_id': page_el.id})
        else:
            return JsonResponse({'success': False, 'msg': 'Page or Element Not Found'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def remove_page_element(request):
    try:
        rdict = dict(request.POST)
        page_name = escape(rdict['page_name'][0])
        oname = escape(rdict['obj_name'][0])
        page = Page.objects.filter(name=page_name)
        project_id = escape(rdict['project_id'][0])
        proj = Project.objects.filter(id=project_id)
        obj = Element.objects.filter(name=oname)
        if page.count() > 0 and obj.count() > 0 and proj.count() > 0:
            page = page.first()
            obj = obj.first()
            page_el = PageElement.objects.filter(page_id=page.id, element_id=obj.id)
            ct = page_el.count()
            if ct > 0:
                page_el = page_el.first()
                page_el.delete()
                if ct is 1:
                    proj_el = ProjectElement.objects.filter(element_id=obj.id, project_id=project_id)
                    if proj_el.count() > 0:
                        proj_el.first().delete()
                    obj.delete()
            else:
                return JsonResponse({'success': True, 'msg': 'Element Not Part of Page'})
        else:
            return JsonResponse({'success': False, 'msg': 'Failed to Find Page'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def set_page_background(request):
    try:
        rdict = dict(request.POST)
        page_name = escape(rdict['page_name'][0])
        bg_name = escape(rdict['background_name'][0])
        bg_css = escape(rdict['background_css'][0])
        page = Page.objects.filter(name=page_name)
        if page.count() > 0:
            page = page.first()
            bg, created = Background.objects.get_or_create(name=bg_name)
            bg.background_css = bg_css
            bg.save()
            PageBackground.objects.get_or_create(page=page, background=bg)
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})
