import re
import traceback

from django.http import JsonResponse
from django.utils.html import escape
from django.views.decorators.cache import never_cache

from ..models import Page, PageScriptSheet, ScriptScriptSheet, PageExternalScriptSheet, ExternalScriptSheet, \
    PageStylesheet, ClassesStylesheet, PageExternalStylesheet, ExternalStyleSheet


@never_cache
def get_ext_style_by_page(request):
    try:
        rdict = dict(request.POST)
        page_name = escape(rdict['page_name'][0])
        if page_name:
            pages = Page.objects.filter(name=page_name)
            if pages.count():
                page = pages.first()
                ext_sheets = PageExternalStylesheet.objects.filter(page_id=page.id)
                sheets = {}
                if ext_sheets.count() > 0:
                    for sheet in ext_sheets:
                        name = sheet.name
                        url = sheet.url
                        sheets[name] = url
                return JsonResponse({'success': True, 'sheets': sheets})
            else:
                return JsonResponse({'success': False, 'msg': 'Page Not Found'})
        else:
            return JsonResponse({'success': False, 'msg': 'Internal Error'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def get_style_by_page(request):
    try:
        rdict = dict(request.POST)
        page_name = escape(rdict['page_name'][0])
        if page_name:
            pages = Page.objects.filter(name=page_name)
            if pages.count()  > 0:
                page = pages.first()
                page_styles = PageStylesheet.objects.filter(page_id=page.id)
                styles = {}
                if page_styles.count() > 0:
                    for style in page_styles:
                        sheet = style.style_sheet
                        if sheet.name not in styles:
                            styles[sheet.name] = {}
                        sheet_classes = ClassesStylesheet.objects.filter(style_sheet_id=sheet.id)
                        classes = {}
                        if sheet_classes.count() > 0:
                            for sclass in sheet_classes:
                                name = sclass.classes.name
                                attr = sclass.classes.attributes
                                classes[name] = attr
                        styles[sheet.name] = classes
                return JsonResponse({'success': False, 'sheets': styles})
            else:
                return JsonResponse({'success': False, 'msg': 'Page Not Found'})
        else:
            return JsonResponse({'success': False, 'msg': 'Page Name Not Provided'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def get_ext_script_by_page(request):
    try:
        rdict = dict(request.POST)
        page_name = escape(rdict['page_name'][0])
        if page_name:
            pages = Page.objects.filter(name=page_name)
            if pages.count() > 0:
                page = pages.first()
                page_scripts = PageExternalScriptSheet.objects.filter(page_id=page.id)
                scripts = {}
                if page_scripts.count() > 0:
                    page_script = page_scripts.first()
                    script = page_script.script_sheet
                    name = script.name
                    scripts[name] = script.url
                return JsonResponse({'success': True, 'scripts': scripts})
            else:
                return JsonResponse({'success': False, 'msg': 'Page Not Found'})
        else:
            return JsonResponse({'success': False, 'msg': 'Page Name Not Provided'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def get_script_by_page(request):
    try:
        rdict = dict(request.POST)
        page_name = escape(rdict['page_name'][0])
        pages = Page.objects.filter(name=page_name)
        if pages.count() > 0:
            page = pages.first()
            page_scripts = PageScriptSheet.objects.filter(page_id=page.id)
            scripts = {}
            if page_scripts.count() > 0:
                for page_script in page_scripts:
                    script = page_script.script_sheet
                    if script.name not in scripts:
                        scripts[script.name] = {}
                    funcs = ScriptScriptSheet.objects.filter(script_sheet_id=script.id)
                    if funcs.count() > 0:
                        fdict = {}
                        for func in funcs:
                            fname = func.func.name
                            fscript = str(func.func.func_base64.decode('ascii'))
                            fdict[fname] = fscript
                        scripts[script.name] = fdict
            return JsonResponse({'success': True, 'scripts': scripts})
        else:
            return JsonResponse({'success': False, 'msg': 'Page Not Found'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})
