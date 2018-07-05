
from django.core.cache import cache
from ..models import PageStylesheet, PageScriptSheet, PageElement


def get_elements_by_page_id(project_id, elements=[]):
    els = PageElement.objects.all().filter(page=project_id)
    sheets = {}
    if els:
        for el in els:
            elements.append(el.to_dict())
    return elements


def get_scriptsheets_by_page_id(project_id, scripts={}):
    els = PageScriptSheet.objects.all().filter(page=project_id)
    scripts = {}
    if els:
        for el in els:
            el_name = el.script_sheet.name
            scripts[el_name] = {
                'description': el.script_sheet.description,
                'id': el.script_sheet.id}
    return scripts


def get_stylesheets_by_page_id(project_id, sheets={}):
    els = PageStylesheet.objects.all().filter(page=project_id)
    sheets = {}
    if els:
        for el in els:
            el_name = el.style_sheet.name
            sheets[el_name] = {
                            'description': el.style_sheet.description,
                            'id': el.style_sheet.id}
    return sheets
