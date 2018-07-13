import base64
import traceback

from django.http import JsonResponse
from django.utils.html import escape
from django.views.decorators.cache import never_cache

from ..models import ScriptSheet, ScriptScriptSheet, ScriptFunc


@never_cache
def rewrite_script_function(request):
    try:
        rdict = dict(request.POST)
        function_name = escape(rdict['function_name'][0])
        func_code = escape(rdict['func_code'][0])
        ScriptFunc.objects.filter(name=function_name).update(func=func_code)
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def rename_script_function(request):
    try:
        rdict = dict(request.POST)
        function_name = escape(rdict['function_name'][0])
        new_name = escape(rdict['new_name'][0])
        ScriptFunc.objects.filter(name=function_name).update(name=new_name)
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def add_script_function(request):
    try:
        rdict = dict(request.POST)
        scriptsheet_name = escape(rdict['scriptsheet_name'][0])
        func_name = escape(rdict['scriptsheet_name'][0])
        func_script = rdict['scriptsheet_script'][0]
        func_description = escape(rdict['scriptsheet_script'][0])
        sheet = ScriptSheet(name=scriptsheet_name)
        if sheet.count() > 0:
            sheet = sheet.first()
            func, created = ScriptFunc.objects.get_or_create(name=func_name, description=func_description, func=func_script)
            func.save()
            script_func, created = ScriptScriptSheet.objects.get_or_create(script_sheet_id=sheet.id, func_id=func.id)
            script_func.save()
        else:
            return JsonResponse({'success': False, 'msg': 'Scriptsheet Not Found'})
    except Exception as e:
        print(traceback.format_exc()) # send to elastic apm
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def remove_scriptsheet_function(request):
    try:
        rdict = dict(request.POST)
        func_name = escape(rdict['function_name'][0])
        script_sheet_name = escape(rdict['scriptsheet_name'][0])
        script = ScriptSheet.objects.filter(name=script_sheet_name)
        if script.count() > 0:
            func = ScriptFunc.objects.filter(name=func_name)
            if func.count() > 0:
                func = func.first()
                script = ScriptScriptSheet.object.filters(script_sheet_id=script.first().id, func_id=func.id)
                if script.count() > 0:
                    script.delete()
                script = ScriptScriptSheet.objects.filter(func_id=func.id)
                if script.count() is 0 and func.count() > 0:
                    func.delete()
    except Exception as e:
        print(traceback.format_exc()) # send to elastic apm
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def load_scriptsheet(request):
    try:
        rdict = dict(request.POST)
        script_name = escape(rdict['script_name'][0])
        script = ScriptSheet.objects.filter(name=script_name)
        if script.count() > 0:
            script = script.first()
            scripts = ScriptScriptSheet.objects.filter(script_sheet_id=script.id)
            functions = []
            if scripts.count() > 0:
                for func in scripts:
                    fname = func.name
                    func_script = base64.decodestring(func.func)
                    functions.append({'name': fname, 'script': func_script})
            return JsonResponse({'success': True, 'functions': functions})
        else:
            return JsonResponse({'success': False, 'msg': 'Scriptsheet Not Found'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})
