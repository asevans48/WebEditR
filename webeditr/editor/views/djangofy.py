"""
THIS PROGRAM IS FOR INTERNAL USE. CAREFUL. THIS PROGRAM SHOULD REALLY ONLY BE RUN
OVER AN INTERNAL NETWORK ON A WEB DEV BOX.

Save the designated project with a django-like file structure.

    -media
        /images
        /video
    - static
        /js
        /css
    - templates (all html pages underneath)

@author aevans
"""

import traceback

from django.views.decorators.cache import never_cache


@never_cache
def save_project(request):
    try:
        pass
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})
