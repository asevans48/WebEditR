import traceback

from django.http import JsonResponse
from django.utils.html import escape
from django.views.decorators.cache import never_cache

from ..models import StyleSheet, ScriptSheet, ClassesStylesheet, ScriptScriptSheet


@never_cache
def get_style_sheet(request):
    try:
        rdict = dict(request.POST)
        print(rdict)
        sheet_name = escape(rdict['stylesheet'][0])
        sheets = StyleSheet.objects.filter(name=sheet_name)
        if sheets.count() > 0:
            sheet = sheets.first()
            sheet_classes = ClassesStylesheet.objects.filter(style_sheet_id=sheet.id)
            classes = []
            if sheet_classes.count() > 0:
                for sc in sheet_classes:
                    sheet_class = sc.classes
                    classes.append({
                        'name': sheet_class.name,
                        'attributes': sheet_class.attributes })
            sheet_dict = {'sheet_name': sheet.name, 'classes': classes}
            return JsonResponse({'success': True, 'sheet': sheet_dict})
        else:
            return JsonResponse({'success': False, 'msg': 'Sheet Not Found'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def get_script_sheet(request):
    try:
        rdict = dict(request.POST)
        script_name = escape(rdict['scriptsheet'][0])
        scripts = ScriptSheet.objects.filter(name=script_name)
        if scripts.count() > 0:
            script = scripts.first()
            script_funcs = ScriptScriptSheet.objects.filter(script_sheet_id=script.id)
            if script_funcs.count() > 0:
                funcs = []
                for script_func in script_funcs:
                    func = script_func.func
                    funcs.append({'function_body': func.func, 'function_name': func.name})
            func_dict = {'script_name': script_name, 'functions': funcs}
            return JsonResponse({'success': True, 'script': func_dict})
        else:
            return JsonResponse({'success': False, 'msg': 'Script Not Found'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def load_script_sheet(request):
    pass


@never_cache
def load_style_sheet(request):
    pass
