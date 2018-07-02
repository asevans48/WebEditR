
from ..models import PageStylesheet, PageScriptSheet, PageElement


def get_elements_by_page(pname, elements=[]):
    els = PageElement.objects.filter(page_name_contains=pname)
    if els:
        for el in els:
            elements.append(el.to_dict())
    return elements


def get_scriptsheets_by_page(pname, scripts={}):
    els = PageScriptSheet.objects.filter(page_name_contains=pname)
    if els:
        for el in els:
            el_name = el.script_sheet.name
            scripts[el_name] = el.description
    return scripts


def get_stylesheets_by_page(pname, sheets={}):
    els = PageStylesheet.objects.filter(page_name_contains=pname)
    if els:
        for el in els:
            el_name = el.script_sheet.name
            sheets[el_name] = el.description
    return sheets


def get_scripts_by_project(pname, scripts={}):
    scriptsheets = PageScriptSheet.objects.filter(
        page_name_contains=pname)
    if scriptsheets:
        for script in scriptsheets:
            script_name = script.script_sheet.name
            if scripts.get(script_name, None) is None:
                scripts[script_name] = script.script_sheet.description
    return scripts


def get_stylesheets_by_project(pname, sheets={}):
    stylesheets = PageStylesheet.objects.filter(
        page_name_contains=pname)
    if stylesheets:
        for sheet in stylesheets:
            sheet_name = sheet.style_sheet.name
            sheets[sheet_name] = sheet.style_sheet.description
    return sheets

