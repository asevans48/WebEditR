
import traceback

from django.http import JsonResponse
from django.utils.html import escape
from django.views.decorators.cache import never_cache

from ..models import ExternalScriptSheet


@never_cache
def edit_script(request):
    try:
        rdict = dict(request.POST)
        old_name = escape(rdict['old_name'][0])
        new_name = escape(rdict['new_name'][0])
        url_inpt = escape(rdict['url_inpt'][0])
        if old_name and new_name and url_inpt:
            script = ExternalScriptSheet.objects.filter(name=old_name)
            if script.count() > 0:
                script = script.first()
                script.name = new_name
                script.url= url_inpt
                script.save()
                return JsonResponse({'success': True, 'script_id': 0})
            else:
                return JsonResponse({'success': False, 'msg': 'Script Not Found'})
        else:
            return JsonResponse({'success': False, 'msg': 'Not All Inputs Provided'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})
