
import copy
import traceback

from django.http import JsonResponse
from django.utils.html import escape
from django.views.decorators.cache import never_cache

from ..models import Element, ElementClasses, ProjectElement, Classes, ElementChildren, Page, Project, PageElement
from ..modules.json_generator import serialize_object, get_class_name


@never_cache
def set_element_zindex(request):
    try:
        rdict = dict(request.POST)
        object_name = escape(rdict['object_name'][0])
        element_zindex = int(rdict['zindex'][0])
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def resize_element(request):
    try:
        rdict = dict(request.POST)
        el_width = int(rdict['width'][0])
        el_height = int(rdict['height'][0])
        perc_width = int(rdict['perc_width'][0])
        perc_height = int(rdict['perc_height'][0])
        obj_name = escape(rdict['object_name'][0])
        el = Element.objects.filter(name=obj_name)
        if el.count() > 0:
            el = el.first()
            el.perc_page_width = perc_width
            el.perc_page_height = perc_height
            el.save()
        else:
            print(traceback.format_exc())
            return JsonResponse({'success': False, 'msg': 'Failed to Find Object'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def reposition_element(request):
    try:
        pass
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def get_element_classes(request):
    try:
        rdict = dict(request.POST)
        obj_name = escape(rdict['object_name'][0])
        el = Element.objects.filter(name=obj_name)
        if el.count() > 0:
            el = el.first()
            el_classes = ElementClasses.objects.filter(element_id=el.id)
            class_names = []
            if el_classes.count() > 0:
                for el_class in el_classes:
                    class_name = el_class.classes.name
                    class_names.append(class_name)
            return JsonResponse({'success': True, 'class_names': class_names})
        else:
            return JsonResponse({'success': False, 'msg': 'Element Not Found'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def get_element_names_by_project_id(request):
    try:
        rdict = dict(request.POST)
        project_id = int(escape(str(rdict['project_id'][0])))
        if project_id:
            elements = ProjectElement.objects.filter(project_id=project_id)
            el_names = []
            if elements.count() > 0:
                for element in elements:
                    el_name = element.element.name
                    el_names.append(el_name)
            return JsonResponse({'success': True, 'elements': el_names})
        else:
            return JsonResponse({'success': False, 'msg': 'Project Id Not Provided'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def add_class_to_element(request):
    try:
        rdict = dict(request.POST)
        object_name = escape(rdict['object_name'][0])
        class_name = escape(rdict['class_name'][0])
        cobj = Classes.objects.filter(name=class_name)
        oname = Element.objects.filter(name=object_name)
        if cobj.count() > 0 and oname.count() > 0:
            cobj = cobj.first()
            oname = oname.first()
            el, created = ElementClasses.objects.get_or_create(
                                                            element_id=oname.id,
                                                            classes_id=cobj.id)
            return JsonResponse({'success': True, 'class_id': cobj.id, 'created': created})
        else:
            return JsonResponse({'success': False, 'msg': 'Failed to Find Class or Object'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def remove_class_from_element(request):
    try:
        rdict = dict(request.POST)
        object_name = escape(rdict['object_name'][0])
        class_name = escape(rdict['class_name'][0])
        sql = """
              SELECT * FROM webeditr.editor_elementclasses 
              WHERE 
                    classes_id IN (SELECT id FROM webeditr.editor_classes WHERE name LIKE '{}')
                    AND
                    element_id IN (SELECT id FROM webeditr.editor_element WHERE name LIKE '{}');
              """.format(class_name, object_name)
        el_classes = ElementClasses.objects.raw(sql)
        for el_class in el_classes:
            el_class.delete()
        return JsonResponse({'success': True, 'object_name': object_name})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def get_serialized_element(request):
    try:
        rdict = dict(request.POST)
        object_name = escape(rdict['object_name'][0])
        el = Element.objects.filter(name=object_name)
        if el.count() > 0:
            el = el.first()
            ser = serialize_object(el.name)
            class_name = get_class_name(el)
            ser['class_name'] = class_name
            return JsonResponse({'success': True, 'objects': ser})
        else:
            return JsonResponse({'success': False, 'msg': 'Element Not Found'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def clone_element(request):
    try:
        rdict = dict(request.POST)
        object_name = escape(rdict['object_name'][0])
        new_name = escape(rdict['new_object_name'][0])
        project_id = int(rdict['project_id'][0])
        page_name = escape(rdict['page_name'][0])
        el = Element.objects.filter(name=object_name)
        if el.count() > 0:
            project = Project.objects.filter(id=project_id)
            page = Page.objects.filter(name=page_name)
            if page.count() > 0 and project.count() > 0:
                el = el.first()
                new_el = copy.copy(el)
                new_el.id = None
                new_el.name = new_name
                try:
                    delattr(new_el, '_prefetched_objects_cache')
                except AttributeError:
                    pass
                new_el.save()
                if project.count() > 0:
                    project = project.first()
                    ProjectElement.objects.create(project=project, element=new_el)
                if page.count() > 0:
                    PageElement.objects.create(page=page, element=new_el)
                return JsonResponse({'success': True, 'el_id': new_el.id})
            else:
                return JsonResponse({'success': False, 'msg': 'Failed to Find Page or Project'})
        else:
            return JsonResponse({'success': False, 'msg': 'Failed to Find Element'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def set_object_parent(request):
    try:
        rdict = dict(request.POST)
        object_name = escape(rdict['object_name'][0])
        parent_name = escape(rdict['parent_name'][0])
        page_name = escape(rdict['page_name'][0])
        parent = Element.objects.filter(name=parent_name)
        child = Element.objects.filter(name=object_name)
        page = Page.objects.filter(name=page_name)
        if parent.count() > 0 and child.count() > 0 and page.count() > 0:
            parent = parent.first()
            child = child.first()
            ec, created = ElementChildren.objects.get_or_create(parent=parent,
                                                                child=child,
                                                                page=page)
            return JsonResponse({'success': True, 'created': created})
        else:
            return JsonResponse({'success': False, 'msg': 'Parent, Page, or Child Not Found'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def remove_object_parents(request):
    try:
        rdict = dict(request.POST)
        page_name = escape(rdict['page_name'][0])
        object_name = escape(rdict['object_name'][0])
        page = Page.objects.filter(name=page_name)
        element = Element.objects.filter(name=object_name)
        if page.count() > 0 and element.count() > 0:
            page = page.first()
            element = element.first()
            children = ElementChildren.objects.filter(child=element, page=page)
            if children.count() > 0:
                link_id = 0
                for child in children:
                    link_id = child.id
                    child.delete()
                return JsonResponse({'success': True, 'link_id': link_id})
            else:
                return JsonResponse({'success': False, 'msg': 'Child Not Found'})
        else:
            return JsonResponse({'sucecss': False, 'msg': 'Page or Element Not Found'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})
