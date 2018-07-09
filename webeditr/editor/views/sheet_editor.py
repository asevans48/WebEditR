"""
Script and Stylesheet editor functions.


@author aevans
"""

import traceback

from django.http import JsonResponse
from django.utils.html import escape
from django.views.decorators.cache import never_cache

from ..models import ScriptFunc, ScriptSheet, StyleSheet, ClassesStylesheet, Classes, ScriptScriptSheet




@never_cache
def add_stylesheet_class(request):
    try:
        rdict = dict(request.POST)
        class_name = escape(rdict['class_name'][0])
        style_sheet_name = escape(rdict['stylesheet_name'][0])
        if class_name and style_sheet_name:
            sheet = StyleSheet.objects.filter(name=style_sheet_name)
            if sheet.count() > 0:
                class_obj, created = Classes.objects.get_or_create(
                                                                name=class_name)
                class_obj.save()
                class_sheet, created = ClassesStylesheet\
                                                        .objects\
                                                        .get_or_create(
                                                                style_sheet_id=sheet.id,
                                                                classes_id=class_obj.id)
                class_sheet.save()
                return JsonResponse({
                                    'success': True,
                                    'class_id': class_obj.id})
            else:
                return JsonResponse({
                                    'success': False,
                                    'msg': 'Style Sheet Not Found'})
        else:
            return JsonResponse({
                                'success': False,
                                'msg': 'Not All Information Provided'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def add_stylesheet_attribute(request):
    try:
        rdict = dict(request.POST)
        stylesheet_name = escape(rdict['stylesheet_name'][0])
        class_name = escape(rdict['class_name'][0])
        attr_name = escape(rdict['attr_name'][0])
        attr_val = escape(rdict['attr_val'][0])
        sheet = StyleSheet.objects.filter(name=stylesheet_name)
        if sheet.count() > 0:
            sheet = sheet.first()
            classes, created = Classes.objects.get_or_create(name=class_name)
            attrs = classes.attributes
            if attrs:
                attrs[attr_name] = attr_val
                classes.attributes = attrs
            else:
                classes.attributes = {attr_name: attr_val}
            classes.save()
            attr_sheet = ClassesStylesheet.objects.get_or_create(style_sheet_id=sheet.id, classes_id=classes.id)
            attr_sheet.save()
    except Exception as e:
        print(traceback.format_exc()) # send to elastic apm
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
        script = ScriptSheet.object.filter(name=script_sheet_name)
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
def remove_stylesheet_attribute(request):
    try:
        rdict = dict(request.POST)
        stylesheet_name = escape(rdict['stylesheet_name'][0])
        class_name = escape(rdict['class_name'][0])
        attribute_name = escape(rdict['attribute_name'][0])
        style_sheet = StyleSheet.objects.filter(name=stylesheet_name)
        if style_sheet.count() > 0:
            attr = Classes.objects.filter(name=attribute_name)
            if attr.count() > 0:
                style_sheet_attr = ClassesStylesheet.objects.filter(style_sheet_id=style_sheet.first().id, classes_id=attr.first().id)
                if style_sheet_attr.count() > 0:
                    style_sheet_attr.delete()
            else:
                return JsonResponse({'success': False, 'msg': 'ATtribute Not Found'})
        else:
            return JsonResponse({'success': False, 'msg': 'Stylesheet Not Found'})
    except Exception as e:
        print(traceback.format_exc()) # send to elastic apm
        return JsonResponse({'success': False, 'msg': 'Internal Error'})
