
import traceback

from django.http import JsonResponse
from django.utils.html import escape
from django.views.decorators.cache import never_cache

from ..models import Element


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
        name = rdict['name'][0]
        el = Element.objects.filter(name=name)
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
        pass
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def remove_object_class(request):
    try:
        pass
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def remove_object(request):
    try:
        pass
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})
