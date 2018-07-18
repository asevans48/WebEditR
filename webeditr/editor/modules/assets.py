
from django.core.cache import cache
from ..models import PageStylesheet, PageScriptSheet, PageElement, PageExternalScriptSheet, PageExternalStylesheet


def get_elements_by_page_id(project_id, elements=[]):
    els = None
    els = PageElement.objects.all().filter(page=project_id)
    sheets = {}
    if els.count() > 0:
        for el in els:
            elements.append(el.to_dict())
    return elements


def get_scriptsheets_by_page_id(project_id, scripts={}):
    els = None
    els = PageScriptSheet.objects.all().filter(page=project_id)
    scripts = {}
    if els.count() > 0:
        for el in els:
            el_name = el.script_sheet.name
            scripts[el_name] = {
                'description': el.script_sheet.description,
                'id': el.script_sheet.id}
    return scripts


def get_stylesheets_by_page_id(project_id, sheets={}):
    els = None
    els = PageStylesheet.objects.all().filter(page=project_id)
    sheets = {}
    if els.count() > 0:
        for el in els:
            el_name = el.style_sheet.name
            sheets[el_name] = {
                            'description': el.style_sheet.description,
                            'id': el.style_sheet.id}
    return sheets


def get_external_scriptsheets_by_page_id(page_id):
    els = None
    els = PageExternalScriptSheet.objects.filter(page_id=page_id)
    sheets = {}
    if els.count() > 0:
        for el in els:
            el_name = el.script_sheet.name
            url = el.script_sheet.url
            sheets[el_name] = {
                            'id': el.script_sheet.id,
                            'url': url}
    return sheets


def get_external_stylesheets_by_page_id(page_id):
    els = None
    els = PageExternalStylesheet.objects.filter(page_id=page_id)
    sheets = {}
    if els.count() > 0:
        for el in els:
            el_name = el.style_sheet.name
            url = el.style_sheet.url
            sheets[el_name] = {
                            'id': el.style_sheet.id,
                            'url': url}
    return sheets
