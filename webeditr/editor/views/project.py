
import traceback

from django.http import JsonResponse
from django.utils.html import escape
from django.views.decorators.cache import never_cache

from ..models import Project, PageProject, Classes
from ..modules import assets


@never_cache
def submit_project(request):
    try:
        name = dict(request.POST)['project_name'][0]
        desc = dict(request.POST)['project_description'][0]
        if name and len(name) > 0 and desc and len(desc) > 0:
            proj = Project()
            proj.name = name
            proj.description = desc
            proj.save()
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'msg': 'Data Incomplete'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def get_projects(request):
    try:
        projects = Project.objects.all()
        project_list = []
        for project in projects:
            project_list.append({
                'id': project.id,
                'name': project.name})
        return JsonResponse({'projects': project_list})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def get_project_assets(request):
    try:
        rdict = dict(request.POST)
        project_id = int(escape(str(rdict['project_id'][0])))
        if project_id:
            pdict = {}
            pdict['pages'] = []
            pages = list(PageProject.objects.filter(project=project_id))
            for page in pages:
                page_dict = {
                        'name': page.page.name,
                        'description': page.page.description,
                        'page_id': page.page.id}
                page_dict['sheets'] = assets.get_stylesheets_by_page_id(
                                                                        page.page.id)
                page_dict['scripts'] = assets.get_scriptsheets_by_page_id(
                                                                          page.page.id)
                page_dict['ext_sheets'] = assets.get_external_stylesheets_by_page_id(
                                                                                    page.page_id)
                page_dict['ext_scripts'] = assets.get_external_scriptsheets_by_page_id(
                                                                                    page.page_id)
                pdict['pages'].append(page_dict)
            return JsonResponse({'success': True, 'pages': pdict})
        else:
            return JsonResponse({'success': False, 'msg': 'No Project Name'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def get_class_names_by_project_id(request):
    try:
        rdict = dict(request.POST)
        project_id = int(escape(str(rdict['project_id'][0])))
        class_names = []
        sql = """
              SELECT classes.id, classes.name, classes.attributes FROM 
                    webeditr.editor_classes as classes,
                    webeditr.editor_classesstylesheet as cs,
                    webeditr.editor_projectstylesheet as ps
                WHERE 
                    classes.id = cs.id
                    AND
                    cs.style_sheet_id = ps.project_id
                    AND
                    ps.project_id = {}
            """.format(project_id)
        classes = Classes.objects.raw(sql)
        for classo in classes:
            class_names.append(classo.name)
        return JsonResponse({'success': True, 'class_names': class_names})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})
