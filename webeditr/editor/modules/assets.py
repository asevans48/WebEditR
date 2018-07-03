
from ..models import PageStylesheet, PageScriptSheet, PageElement


def get_elements_by_page_id(project_id, elements=[]):
    els = PageElement.objects.filter(page=project_id)
    if els:
        for el in els:
            elements.append(el.to_dict())
    return elements


def get_scriptsheets_by_page_id(project_id, scripts={}):
    els = PageScriptSheet.objects.filter(page=project_id)
    if els:
        for el in els:
            el_name = el.script_sheet.name
            scripts[el_name] = el.description
    return scripts


def get_stylesheets_by_page_id(project_id, sheets={}):
    els = PageStylesheet.objects.filter(page=project_id)
    if els:
        for el in els:
            el_name = el.script_sheet.name
            sheets[el_name] = el.description
    return sheets
