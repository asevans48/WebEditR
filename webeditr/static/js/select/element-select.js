
function remove_elmnt(elmnt){
    var elmnt = $(elmnt);
    var page_el_id = elmnt.attr('page_el_id');
    var name = elmnt.attr('name');
    if(page_el_id && name){
        var data = {
            'page_el_id': page_el_id,
            'object_name': name,
        };

        $.ajax({
            type: 'POST',
            url: '/remove_page_element/',
            data: data,
            success: function(data){
                if(data.success){
                    elmnt.remove();
                }else{
                    console.log(data.msg);
                    alert(data.msg);
                }
            }
        }).fail(function(jqXHR, textStatus){
            console.log('Failed to Remove Page Element ', textStatus);
            console.log(jqXHR);
            alert('Internal Error');
        });
    }
}


function remove_elmnt_recursively(elmnt){
    alert(element.current_element);
    var elmnt = $(elmnt);
    var children = elmnt.children();
    if(children.length > 0){
        $(children).each(function(){
            remove_elmnt(this);
        });
    }
    remove_elmnt(elmnt);
}


function remove_page_element(){
    if(element.current_element && element.current_element != null){
        var elmnt = $('[name="' + element.current_element + '"]');
        if(elmnt.length > 0){
            remove_elmnt_recursively(elmnt);
        }
    }
}

function set_page_element(elmnt){
    var elmnt = $(elmnt);
    console.log(elmnt);
    var offset = $(elmnt).offset();
    var data = {
        'object_name': elmnt.attr('name'),
        'project_id': project_objects.pname,
        'project_name': project_objects.project_name,
        'page_name': project_objects.current_page,
        'left': offset.left,
        'top': offset.top,
    }

    $.ajax({
        type: 'POST',
        url: '/add_page_element/',
        data: data,
        success: function(data){
            if(data.success == false){
                console.log(data.msg);
                alert(data.msg);
            }else{
                elmnt.attr('page_el_id', data.page_el_id);
            }
        }
    }).fail(function(jqXHR, textStatus){
        console.log('Failed to Add Page Element', textStatus);
        console.log(jqXHR);
    });

}


function select_object(add_to_db=true){
    var cname = $('.objselect-selector-sel').find(':selected').text();
    if(cname && cname != null && cname != 'Select Object'){
        var data = {
            'object_name': cname,
        };

        $.ajax({
            type: 'POST',
            url: '/get_serialized_element/',
            data: data,
            success: function(data){
                console.log(data);
                if(data.success){
                    var objects = data.objects;
                    var oarr = build_tag(objects);
                    var root_tag = null;
                    if(oarr != undefined && oarr[1] != undefined && oarr[1] != null){
                        root_tag = append_children(oarr[0], oarr[1]);
                    }
                    root_tag = $(root_tag).draggable();
                    root_tag = prep_object(root_tag);
                    root_tag.addClass('edit-el');
                    $(root_tag).draggable({
                        cancel: null,
                    })
                    $('.element-area').append(root_tag);
                    remove_object_selector();
                    if(add_to_db){
                        set_page_element(root_tag);
                    }
                }else{
                    console.log(data.msg);
                    alert(data.msg);
                }
            }
        }).fail(function(jqXHR, textStatus){
            console.log('Failed to Get Object', textStatus);
            alert(jqXHR);
        });
    }
}


function build_opt(cname){
    var opt = $('<option>', {
               class: 'objselect-selector-opt',
               name: cname,
               id: cname,
               text: cname});
    return opt;
}


function build_object_select_list(sel_list){
    var data = {
        'project_id': project_objects.pname,
    };
    $.ajax({
        type: 'POST',
        url: '/get_element_names_by_project_id/',
        data: data,
        success: function(data){
            console.log(data);
            if(data.success){
                var cnames = data.elements;
                if(cnames && cnames != null){
                    $(cnames).each(function(index, cname){
                        var opt = build_opt(cname);
                        $(sel_list).append(opt);
                    });
                }
            }else{
                console.log(data.msg);
                alert(data.msg);
            }
        }
    }).fail(function(jqXHR, textStatus){
        console.log('Failed to Build Select List', textStatus);
        console.log(jqXHR);
        alert('Internal Error');
    });
}


function remove_object_selector(){
    $('.objselect').remove();
}


function get_object_selector(){
    var selector = $('<div>', {
                       class: 'objselect standard-grey-gradient shadow'});
    var title_div = $('<div>', {
                    class: 'objselect-title-div'});
    var title_spn = $('<span>', {
                    class: 'objselect-title-spn'});
    title_spn.append('Object Selector');
    var rem_spn = $('<span>', {
                  class: 'objselect-rem-spn'});
    var rem_btn = $('<i>', {
                  class: 'objselect-rem-btn fa fa-times',
                  onclick: 'remove_object_selector();'});
    rem_spn.append(rem_btn);
    title_div.append(title_spn);
    title_div.append(rem_spn);
    selector.append(title_div);

    var selector_div = $('<div>', {
                       class: 'objselect-selector-div'});
    var oselector = $('<select>', {
                    class: 'objselect-selector-sel',
                    required: 'true'});
    var opt = $('<option value="" class="objselect-selector-opt">');
    opt.text('Select Object');
    oselector.append(opt);
    build_object_select_list(oselector);
    selector_div.append(oselector);
    selector.append(selector_div);

    var sbmt_btn_div = $('<div>', {
                        class: 'objselect-sbtm-div'});
    sbmt_btn = $('<button>', {
                class: 'btn btn-primary objselect-sbmt-btn',
                onclick: 'select_object();'});
    sbmt_btn.append('Select')
    sbmt_btn_div.append(sbmt_btn);
    selector.append(sbmt_btn_div);
    selector.draggable();

    $('.editor').append(selector);
}
