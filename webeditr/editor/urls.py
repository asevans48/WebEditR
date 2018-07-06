
from django.urls import re_path

from .views import editor, page, project, sheets

app_name = 'webeditr'

urlpatterns = [
    re_path('^$', editor.editor_home, name='index'),
    re_path('^submit_project/', project.submit_project, name='submit_project'),
    re_path('^get_projects/', project.get_projects, name='get_projects'),
    re_path('^get_project_assets/', project.get_project_assets, name='get_project_details'),
    re_path('^get_page_elements/', page.get_page_elements, name='get_page_elements'),
    re_path('^load_stylesheet/', sheets.load_style_sheet, name='load_page_stylesheet'),
    re_path('^load_scriptsheet/', sheets.load_script_sheet, name='load_page_scriptsheet'),
    re_path('^get_page_scriptsheet', page.get_page_scriptsheets, name='get_page_scriptsheets'),
    re_path('^get_page_stylesheet', page.get_page_stylesheets, name='get_page_stylesheets'),
    re_path('^add_new_page/', page.add_new_page, name='add_new_page'),
    re_path('^remove_page', page.remove_page, name='remove_page'),
    re_path('^add_new_sheet/', page.add_new_sheet, name='add_new_sheet'),
    re_path('^remove_sheet', page.remove_sheet, name='remove_sheet'),
    re_path('^get_stylesheet_dict/', sheets.get_style_sheet, name='get_style_sheet_dict')
]
