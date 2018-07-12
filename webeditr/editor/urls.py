
from django.urls import re_path

from .views import dimensions, editor, imports, page, project, script_editor, sheet_editor, sheets

app_name = 'webeditr'

urlpatterns = [

    #djangofy

    #project attainment
    re_path('^$', editor.editor_home, name='index'),
    re_path('^submit_project/', project.submit_project, name='submit_project'),
    re_path('^get_projects/', project.get_projects, name='get_projects'),

    # asset loader
    re_path('^get_project_assets/', project.get_project_assets, name='get_project_details'),
    re_path('^load_stylesheet/', sheets.load_style_sheet, name='load_page_stylesheet'),
    re_path('^load_scriptsheet/', sheets.load_script_sheet, name='load_script_sheet'),
    re_path('^get_page_stylesheet', page.get_page_stylesheets, name='get_page_stylesheets'),
    re_path('^add_new_page/', page.add_new_page, name='add_new_page'),
    re_path('^remove_page/', page.remove_page, name='remove_page'),

    #import handler
    re_path('^get_imports_by_project/', imports.get_imports_by_project, name='get_imports_by_project'),
    re_path('^add_imports_by_project/', imports.add_imports_by_project, name='add_imports_by_project'),
    re_path('^remove_imports_by_project/', imports.remove_imports_by_project, name='remove_imports_by_project'),

    # dimension picker
    re_path('^remove_dimension_by_page/', dimensions.remove_dimension_by_page, name='remove_dimension_by_project'),
    re_path('^get_dimensions_by_page/', dimensions.get_dimensions_by_page, name='get_dimensions_by_project'),
    re_path('^add_dimension_by_page/', dimensions.add_dimension_by_page, name='add_dimension_by_project'),

    # stylesheet functions
    re_path('^add_new_sheet/', page.add_new_sheet, name='add_new_sheet'),
    re_path('^remove_sheet', page.remove_sheet, name='remove_sheet'),
    re_path('^get_stylesheet_dict/', sheets.get_style_sheet, name='get_style_sheet_dict'),
    re_path('^remove_stylesheet_attribute/', sheet_editor.remove_stylesheet_attribute, name='remove_stylesheet_attribute'),
    re_path('^add_stylesheet_attribute/', sheet_editor.add_stylesheet_attribute, name='add_stylesheet_attribute'),
    re_path('^submit_new_class/', sheet_editor.add_stylesheet_class, name="add_stylesheet_class"),
    re_path('^change_class_name', sheet_editor.change_stylesheet_class, name="change_stylesheet_class"),
    re_path('^remove_stylesheet_class', sheet_editor.remove_stylesheet_class, name="remove_stylesheet_class"),

    #scriptsheet functions
    re_path('^add_function/', script_editor.add_script_function, name='add_script_function'),
    re_path('^remove_script_function/', script_editor.remove_scriptsheet_function, name='remove_script_function'),
    re_path('^rename_script_function/', script_editor.rename_script_function, name='rename_script_function'),
    re_path('^rewrite_function', script_editor.rewrite_function, name="rewrite_function"),
    re_path('^load_script_sheet/', script_editor.load_scriptsheet, name="load_script_sheet")

    #TRY BY END OF TONIGHT PLEASE PLEASE PLEASE
    #blakes panel functions

    #blakes page styling functions

    #blakes element functions
]
