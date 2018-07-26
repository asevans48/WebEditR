
from ..models import PageStylesheet, PageScriptSheet, PageElement, PageExternalScriptSheet, PageExternalStylesheet, \
    ElementContent, Page


def get_elements_by_page_id(page_id, elements=[]):
    els = PageElement.objects.all().filter(page=page_id)
    if els.count() > 0:
        for el in els:
            el_dict = el.to_dict
            content = ElementContent.objects.filter(element=el)
            if content.count() > 0:
                content = content.first()
                el_dict['inner_html'] = content.content
            elements.append(el_dict)
    return elements


def get_elements_by_page_name(page_name, elements =[]):
    page = Page.objects.filter(name=page_name)
    if page.count() > 0:
        page = page.first()
        return get_elements_by_page_id(page.id)
    return []


def get_scriptsheets_by_page_id(project_id, scripts={}):
    els = PageScriptSheet.objects.all().filter(page=project_id)
    if els.count() > 0:
        for el in els:
            el_name = el.script_sheet.name
            scripts[el_name] = {
                'description': el.script_sheet.description,
                'id': el.script_sheet.id}
    return scripts


def get_stylesheets_by_page_id(project_id, sheets={}):
    els = PageStylesheet.objects.all().filter(page=project_id)
    if els.count() > 0:
        for el in els:
            el_name = el.style_sheet.name
            sheets[el_name] = {
                            'description': el.style_sheet.description,
                            'id': el.style_sheet.id}
    return sheets


def get_external_scriptsheets_by_page_id(page_id, sheets={}):
    els = PageExternalScriptSheet.objects.filter(page_id=page_id)
    if els.count() > 0:
        for el in els:
            el_name = el.script_sheet.name
            url = el.script_sheet.url
            sheets[el_name] = {
                            'id': el.script_sheet.id,
                            'url': url}
    return sheets


def get_external_stylesheets_by_page_id(page_id, sheets={}):
    els = PageExternalStylesheet.objects.filter(page_id=page_id)
    if els.count() > 0:
        for el in els:
            el_name = el.style_sheet.name
            url = el.style_sheet.url
            sheets[el_name] = {
                            'id': el.style_sheet.id,
                            'url': url}
    return sheets
