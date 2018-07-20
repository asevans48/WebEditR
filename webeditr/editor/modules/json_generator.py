'''
Converts elements to JSON arrays to be written.

@author aevans
'''
from webeditr.editor.models import Element, ElementContent, ElementChildren


def get_element_dict(el):
    """
    Obtain the element dictionary
    :param el: The element to serialize
    :type el:  Element
    :return:  dict
    """
    ctnt = ElementContent.objects.filter(element_id=el.id)
    el_dict = el.to_dict
    if ctnt.count() > 0:
        el_dict['content'] = ctnt.first().content
    return el_dict


def serialize_el_with_children(el):
    """
    Get the element children recursively
    :param el:  The starting element
    :type el:  Element
    :return:  dict
    """
    el_dict = get_element_dict(el)
    children = ElementChildren.objects.filter(element_id=el.id)
    el_dict['children'] = []
    if children.count() > 0:
        for child in children:
            el_dict['children'].append(serialize_el_with_children(el))
    return el_dict


def serialize_object(obj_name):
    """
    Gets the object and children
    :param name:  The object name
    :type name:  str
    :return: dict
    """
    el = Element.objects.filter(name=obj_name)
    if el.count() > 0:
        el = el.first()
        return serialize_el_with_children(el)
    return None
