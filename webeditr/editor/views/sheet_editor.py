"""
Script and Stylesheet editor functions.


@author aevans
"""

import traceback

from django.http import JsonResponse
from django.utils.html import escape
from django.views.decorators.cache import never_cache

from ..models import StyleSheet, ClassesStylesheet, Classes, Page, PageExternalStylesheet


@never_cache
def remove_stylesheet_class(request):
    try:
        rdict = dict(request.POST)
        print(rdict)
        class_name = escape(rdict['class_name'][0])
        stylesheet = escape(rdict['stylesheet_name'][0])
        classes = Classes.objects.filter(name=class_name)
        sheet = StyleSheet.objects.filter(name=stylesheet)
        if classes and sheet:
            classes = classes.first()
            sheet = sheet.first()
            classes_sheet = ClassesStylesheet.objects.filter(
                                                            style_sheet_id=sheet.id,
                                                            classes_id=classes.id)
            if classes_sheet.count() > 0:
                classes_sheet.delete()
                classes_sheet = ClassesStylesheet.objects.filter(classes_id=classes.id)
                if classes_sheet.count() is 0:
                    classes.delete()
                return JsonResponse({'success': True, 'class_id': classes.id})
            else:
                return JsonResponse({'success': False, 'msg': 'Class Not Found In Sheet'})
        else:
            return JsonResponse({'success': False, 'msg': 'Class or Stylesheet Not Found'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def change_stylesheet_class(request):
    try:
        rdict = dict(request.POST)
        old_class_name = escape(rdict['old_class_name'][0])
        new_class_name = escape(rdict['new_class_name'][0])
        classes = Classes.objects.filter(name=old_class_name)
        if classes.count() > 0:
            classes=classes.first()
            classes.name = new_class_name
            classes.save()
            return JsonResponse({'success': True, 'class_id': classes.id})
        else:
            print(traceback.format_exc())
            return JsonResponse({'success': False,
                                 'msg': 'Class {} Not Found'.format(old_class_name)})

    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def add_stylesheet_class(request):
    try:
        rdict = dict(request.POST)
        print(rdict)
        class_name = escape(rdict['class_name'][0])
        style_sheet_name = escape(rdict['stylesheet_name'][0])
        if class_name and style_sheet_name:
            sheet = StyleSheet.objects.filter(name=style_sheet_name)
            if sheet.count() > 0:
                sheet = sheet.first()
                class_obj = Classes.objects.filter(name=class_name)
                if class_obj.count() is 0:
                    class_obj= Classes(name=class_name,
                                                attributes={})
                    class_obj.save()
                    class_sheet, created = ClassesStylesheet.objects.get_or_create(
                                                            style_sheet_id=sheet.id,
                                                            classes_id=class_obj.id)
                    class_sheet.save()
                    return JsonResponse({
                                        'success': True,
                                        'class_id': class_obj.id})
                else:
                    return JsonResponse({
                                        'success': False,
                                        'msg': 'Class Exists'})
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
            attr_sheet, created = ClassesStylesheet.objects.get_or_create(style_sheet_id=sheet.id, classes_id=classes.id)
            attr_sheet.save()
            return JsonResponse({'success' : True, 'class_id': classes.id})
        else:
            return JsonResponse({'success': False, 'msg': 'Stylesheet Not Found'})
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
            attr = Classes.objects.filter(name=class_name)
            if attr.count() > 0:
                classes = attr.first()
                attrs = classes.attributes
                if attrs.get(attribute_name, None) is not None:
                    classes.attributes.pop(attribute_name)
                    classes.save()
                    if len(classes.attributes.keys()) is 0:
                        style_sheet_attr = ClassesStylesheet.objects.filter(style_sheet_id=style_sheet.first().id, classes_id=attr.first().id)
                        if style_sheet_attr.count() > 0:
                            for sheet in style_sheet_attr:
                                style_sheet_attr.delete()
                        classes.delete()
                    return JsonResponse({'success': True, 'class_id': classes.id})
                else:
                    return JsonResponse({'success': False, 'msg': 'Attribute Not Found'})
            else:
                return JsonResponse({'success': False, 'msg': 'Class Not Found'})
        else:
            return JsonResponse({'success': False, 'msg': 'Stylesheet Not Found'})
    except Exception as e:
        print(traceback.format_exc()) # send to elastic apm
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def get_classes_by_page(request):
    try:
        rdict = dict(request.POST)
        page_name = escape(rdict['page_name'][0])
        page = Page.objects.filter(name=page_name)
        if page.count() > 0:
            page = page.first()
            page_sheet = PageExternalStylesheet.object.filter(page_id=page.id)
            if page_sheet.count() > 0:
                class_names = []
                for psheet in page_sheet:
                    sheet = psheet.first().style_sheet
                    classes = ClassesStylesheet.objects.filter(style_sheet_id=sheet.id)
                    if classes.count > 0:
                        for css_class in classes:
                            if css_class.name not in class_names:
                                class_names.append(css_class.name)
                return JsonResponse({'success': True, 'class_names': class_names})
            else:
                return JsonResponse({'success': False, 'msg': 'Sheet Not Found'})
        else:
            return JsonResponse({'success': False, 'msg': 'Page Not Found'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})
