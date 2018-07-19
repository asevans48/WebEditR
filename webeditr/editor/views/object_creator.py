
import traceback

from django.http import JsonResponse
from django.utils.html import escape
from django.views.decorators.cache import never_cache

from ..models import Element, Classes, ElementClasses, ElementContent


@never_cache
def create_or_edit_object(request):
    try:
        rdict = dict(request.POST)
        name = escape(rdict['name'][0])
        id_attr = escape(rdict['id_attr'][0])
        name_attr = escape(rdict['name_attr'][0])
        tag_name = escape(rdict['tag_name'][0])
        class_name = escape(rdict['class_name'][0])
        description = escape(rdict['description'][0])
        attributes = escape(rdict['attributes'][0])
        perc_page_height = escape(rdict.get('per_page_height', [.1,])[0])
        perc_page_width = escape(rdict.get('perc_page_width', [.1,])[0])
        el = Element.objects.get_or_create(name=name)
        el.id_attr = id_attr
        el.name_attr = name_attr
        el.tag_name = tag_name
        el.class_name = class_name
        el.description = description
        el.attributes = attributes
        el.perc_page_height = perc_page_height
        el.perc_page_width = perc_page_width
        el.save()
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def check_object_existance(request):
    try:
        rdict = dict(request.POST)
        object_name = rdict['object_name'][0]
        el = Element.objects.filter(name=object_name)
        if el.count() > 0:
            return JsonResponse({'success': True, 'exists': True})
        else:
            return JsonResponse({'success': True, 'exists': False})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def set_object_classes(request):
    try:
        rdict = dict(request.POST)
        name = escape(rdict['object_name'][0])
        classes = escape(rdict['classes'][0])
        if classes and len(classes) > 0:
            el = Element.objects.filter(name=name)
            if el.count() > 0:
                el = el.first()
                for class_name in classes:
                    classes = Classes.objects.filter(name=el.name)
                    if classes.count() > 0:
                        el_class, created = ElementClasses.objects.get_or_create(
                                                                            element_id=el.id,
                                                                            classes_id=classes.id)
            return JsonResponse({'success': True, 'num_clases': len(classes)})
        else:
            return JsonResponse({'success': True, 'num_classes': 0})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def remove_object_class(request):
    try:
        rdict = dict(request.POST)
        object_name = escape(rdict['class_name'][0])
        class_name = escape(rdict['object_name'][0])
        el = Element.objects.filter(name=object_name)
        classo = Classes.objects.filter(name=class_name)
        if el.count() > 0 and classo.count() > 0:
            el = el.first()
            classo = classo.first()
            classes = ElementClasses.objects.filter(
                                                element_id=el.id,
                                                classes_id=classo.id)
            if classes.count() > 0:
                classes = classes.first()
                classes.delete()
                return JsonResponse({'success': True, 'classes_id': classes.id})
            else:
                return JsonResponse({'success': False, 'msg': 'ElementClass Not Found'})
        else:
            return JsonResponse({'success': False, 'msg': 'Element or Class Not Found'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def remove_object(request):
    try:
        rdict = dict(request.POST)
        object_name = escape(rdict['object_name'][0])
        el = Element.objects.filter(name=object_name)
        if el.count():
            el.first().delete()
            return JsonResponse({'success': True, 'el_id': el.id})
        else:
            return JsonResponse({'success': False, 'msg': 'Element Does Not Existe'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def get_object_details(request):
    try:
        rdict = dict(request.POST)
        object_name = escape(rdict['object_name'][0])
        el = Element.objects.filter(name=object_name)
        if el.count() > 0:
            el = el.first()
            el_dict = el.to_dict()

            # get any element content
            el_content = ElementContent.objects.filter(element_id=el.id)
            
            return JsonResponse({'success': True, 'el_dict': el_dict})
        else:
            return JsonResponse({'success': False, 'msg': 'Element Not Found'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})
