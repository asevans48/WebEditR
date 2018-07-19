
import traceback

from django.http import JsonResponse
from django.utils.html import escape
from django.views.decorators.cache import never_cache

from ..models import Element, ElementClasses


@never_cache
def get_element_classes(request):
    try:
        rdict = dict(request.POST)
        obj_name = escape(rdict['obj_name'][0])
        el = Element.objects.filter(name=obj_name)
        if el.count() > 0:
            el = el.first()
            el_classes = ElementClasses.objects.filter(element_id=el.id)
            class_names = []
            if el_classes.count() > 0:
                for el_class in el_classes:
                    class_name = el_class.name
                    class_names.append(class_name)
            return JsonResponse({'success': True, 'class_names': class_names})
        else:
            return JsonResponse({'success': False, 'msg': 'Element Not Found'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})
