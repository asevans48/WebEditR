
import traceback

from django.http import JsonResponse

from ..models import Project, PageProject
from ..modules import assets


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


def get_project_assets(request):
    try:
        rdict = dict(request.POST)
        pname = rdict['project_name'][0]
        if pname and len(pname.strip()) > 0:
            pdict = {}
            pages = PageProject.objects.filter(page_name_contains=pname)
            page_list = []
            if pages and len(pages) > 0:
                for page in pages:
                    page_list.append({'name': page.name,
                                      'description': page.description})
            else:
                return JsonResponse({'success': False, 'msg': 'Internal Error'})
            pdict['pages'].append(page_list)
            sheets = assets.get_style_sheets_by_project(pname)
            pdict['stylesheets'] = sheets
            sheets = assets.get_scripts_by_project(pname)
            pdict['scripthseets'] = sheets
            return JsonResponse({'success': True, 'pages': pdict})
        else:
            return JsonResponse({'success': False, 'msg': 'No Project Name'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})
