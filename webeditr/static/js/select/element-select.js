
function select_object(){
    var cname = $('.objselect-selector-sel').find(':selected').text();
    if(cname && cname != null && cname != 'Select Object'){
        var data = {
            'object_name': obj_name,
        };

        $.ajax({
            type: 'POST',
            url: '/get_serialized_element/',
            data: data,
            success: function(data){
                if(data.success){
                    var objects = data.objects;
                    var oarr = build_tag(objects, perc_modifier);
                    var root_tag = null;
                    if(oarr != undefined && oarr[1] != undefined && oarr[1] != null){
                        root_tag = append_children(oarr[0], oarr[1], perc_modifier);
                    }

                    root_tag = $(root_tag).draggable();
                    root_tag = prep_object(root_tag);
                    root_tag.addClass('edit-el');
                    $('.element-area').append(root_tag);
                    remove_object_selector();
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
            if(data.success){
                var cnames = data['class_names'];
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
    });
}


function remove_object_selector(){
    $('.objselect').remove();
}


function get_object_selector(){
    var selector = $('<div>', {
                       class: 'objselect'});
    var title_div = $('<div>', {
                    class: 'objselect-title-div'});
    var title_spn = $('<span>', {
                    class: 'objselect-title-spn'});
    title_spn.append('Object Selector');
    var rem_spn = $('<span>', {
                  class: 'objselect-rem-spn'});
    var rem_btn = $('<i>', {
                  class: 'objselect-rem-btn fa fa-times'});
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

    var rem_btn_div = $();
    selector.append(rem_btn_div);


    $('.editor').append(selector_div);
}
