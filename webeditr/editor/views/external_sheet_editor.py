
import traceback

from django.http import JsonResponse
from django.utils.html import escape
from django.views.decorators.cache import never_cache

from ..models import ExternalStyleSheet


@never_cache
def edit_sheet(request):
    try:
        rdict = dict(request.POST)
        old_name = escape(rdict['old_name'][0])
        new_name = escape(rdict['new_name'][0])
        url_inpt = escape(rdict['url_inpt'][0])
        if old_name and new_name and url_inpt:
            script = ExternalStyleSheet.objects.filter(name=old_name)
            if script.count() > 0:
                script = script.first()
                script.name = new_name
                script.url= url_inpt
                script.save()
                return JsonResponse({'success': True, 'script_id': script.id})
            else:
                return JsonResponse({'success': False, 'msg': 'Script not Found'})
        else:
            return JsonResponse({'success': False, 'msg': 'Not All Inputs Provided'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})
