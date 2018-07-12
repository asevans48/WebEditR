"""
Handles dimensions panel requests

@author aevans
"""

import traceback

from django.http import JsonResponse
from django.views.decorators.cache import never_cache

from ..models import PagePageWidthRange, Page, PageWidthRange


@never_cache
def remove_dimension_by_page(request):
    try:
        rdict = dict(request.POST)
        start_width = escape(rdict['start_width'][0])
        base_width = escape(rdict['base_width'][0])
        end_width = escape(rdict['end_width'][0])
        page_name = escape(rdict['page_name'][0])
        if start_width and base_width and end_width and page_name:
            page = Page.objects.filter(name=page_name)
            if page.count() > 0:
                page = page.first()
                wrange = PageWidthRange\
                                    .objects\
                                    .filter(
                                        start_width=start_width,
                                        end_width=end_width,
                                        ref_width=base_width)
                if wrange.count() > 0:
                    wrange = wrange.first()
                    page_wrange = PagePageWidthRange(
                                                page_id=page.id,
                                                width_range_id=wrange.id)
                    if page_wrange.count() > 0:
                        page_wrange.delete()
                else:
                    return JsonResponse({'success': False, 'msg': 'Width Range Not Found'})
            else:
                return JsonResponse({'success': False, 'msg': 'Page Not Found'})
        else:
            return JsonResponse({'success': False, 'msg': 'Not All Information Provided'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def add_dimension_by_page(request):
    try:
        rdict = dict(request.POST)
        start_dimension = escape(rdict['start_dimension'][0])
        base_dimension = escape(rdict['base_dimension'][0])
        end_dimension = escape(rdict['end_dimension'][0])
        page_name = escape(rdict['page_name'][0])
        page = Page.objects.filter(name=page_name)
        if page.count() > 0:
            wrange, created = PageWidthRange\
                                .objects\
                                .get_or_create(
                                            start_width=start_dimension,
                                            ref_width=base_dimension,
                                            end_width=end_dimension)
            wrange.save()
            page_range, created = PagePageWidthRange\
                                            .objects\
                                            .get_or_create(
                                                        page_id=page.id,
                                                        width_range_id=wrange.id)
            page_range.save()
            return JsonResponse({'success': True, 'range_id': wrange.id})
        else:
            return JsonResponse({'success': False, 'msg': 'Page Not Found'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})


@never_cache
def get_dimensions_by_page(request):
    try:
        rdict = dict(request.POST)
        project_title = escape(rdict['project_title'][0])
        current_page = escape(rdict['current_page'][0])
        if project_title and current_page:
            page = Page.objects.filter(name=current_page)
            if page.count() > 0:
                page = page.first()
                widths = PagePageWidthRange.objects.filter(page_id=page.id)
                page_dimensions = []
                if widths.count() > 0:
                    for width in widths:
                        wrange = width.width_range
                        dim_dict = {
                            'start_width': wrange.start_width,
                            'base_width': wrange.ref_width,
                            'end_width': wrange.end_width
                        }
                        page_dimensions.append(dim_dict)
                resp_dict = {
                            'success': True,
                            'page_dimensions': page_dimensions}
                return JsonResponse(resp_dict)
            else:
                return JsonResponse({'success': False, 'msg': 'Page Not Found'})
        else:
            return JsonResponse({
                                'success': False,
                                'msg': 'Project Title or Current Page Not Provided'})
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({'success': False, 'msg': 'Internal Error'})
