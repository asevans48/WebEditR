
var potential_parent = {
    parent_name: null,
    is_getting_parent: false,
}

var element = {
    current_element: null,
    current_x_position: 0,
    current_y_position: 0,
    current_x_perc: 0,
    current_y_perc: 0,
    current_height: 0,
    current_width: 0,
    current_height_perc: 0,
    current_width_perc: 0
}


function rem_clone_div(){
    $('.clonename').remove();
}


function create_clone(){
    var clone_div = $('.clonename');
    if(clone_div.length && element.current_element != null){
        var clone_name = $('.clonename-inpt').val();
        if(clone_name != null && clone_name.trim().length > 0){
            var data = {
                'object_name': element.current_element,
                'new_object_name': clone_name,
                'page_name': project_objects.current_page,
                'project_id': project_objects.pname,
                'project_name': project_objects.current_project,
            }
        }else{
            console.log('Clone Name Not Provided');
            alert('Clone Name Not Provided');
        }
    }else{
        console.log('Element Not Selected');
        alert('element Not Selected');
    }
}


function clone_element(){
    if(element.current_element && element.current_element != null){
        $('.clonename').remove();
        var clone_div = $('<div>', {
                        class: 'clonename'});
        var clone_title_div = $('<div>', {
                              class: 'clonename-title-div'});
        var clone_title_spn = $('<span>', {
                              class: 'clonename-title-spn'});
        clone_title_spn.append('Cloned Object Name');
        clone_title_div.append(clone_title_spn);
        var clone_rem_spn = $('<span>', {
                            class: 'clonename-rem-spn'});
        var clone_rem_btn = $('<i>', {
                            class: 'clonename-rem-btn',
                            onclick: 'rem_clone_div();'});
        clone_rem_spn.append(clone_rem_btn);
        clone_title_div.append(clone_rem_btn);
        var clone_name_div = $('<div>', {
                             class: 'clonename-inpt-div'});
        var clone_name_inpt = $('<input>', {
                              class: 'clonename-inpt',
                              placeholder: 'Clone Name'});
        clone_name_div.append(clone_name_inpt);
        var sbmt_clone_div = $('<div>', {
                             class: 'clonename-sbmt-div'});
        var sbmt_clone_btn = $('<button>', {
                             class: 'clonename-sbmt-btn btn btn-primary',
                             onclick: 'create_clone();'});
        sbmt_clone_btn.append('Clone');
        sbmt_clone_div.append(sbmt_clone_div);
        $('.editor').append(sbmt_clone_div);
    }
}


function remove_element_parents(){
    if(element.current_element){
        var elmnt = $("[name='" + element.current_element + "']");

        if(elmnt.length > 0){
           var data = {
               'object_name': elmnt.attr('name'),
               'project_id': project_objects.project_id,
               'project_name': project_objects.current_project,
               'page_name': project_objects.current_page,
               'page_id': project_objects.pname,
           }

           $.ajax({
               type: 'POST',
               url: '/remove_element_parents/',
               data: data,
               success: function(data){
                   if(data.success){
                       elmnt.detach.appendTo($('.element-area'));
                   }else{
                       console.log(data.msg);
                       alert(data.msg);
                   }
               }
           }).fail(function(jqXHR, textStatus){
               console.log('Failed to Remove Parentst', textStatus);
               console.log(jqXHR);
           });
        }
    }
}


function set_element_parent(elmnt){
    var parent = $(elmnt);
    if(parent){
        var parent_name = parent.attr('name');
        var data = {
            'object_name': element.current_element,
            'parent_name': parent_name,
            'project_id': project_objects.project_id,
            'project_name': project_objects.current_project,
            'page_name': project_objects.current_page,
            'page_id': project_objects.pname,
        }

        $.ajax({
            type: 'POST',
            url: '/set_element_parent/',
            data: data,
            success: function(data){
                if(data.success){
                    var el = $('[name="' + element.current_element + '"]');
                    if(el){
                        parent.append(el);
                    }
                }else{
                    console.log(data.msg);
                    alert(data.msg);
                }
            }
        }).fail(function(jqXHR, textStatus){
            console.log('Failed to Set Element Parent', textStatus);
            console.log(jqXHR);
            alert('Internal Error');
        });
    }
}


function set_element_details(elmnt){
    var el = $(elmnt);
    var offset = el.offset();
    clear_element();
    element.current_element = el.attr('name');
    element.current_x_position = offset.left;
    element.current_y_position = offset.top;
    element.current_x_perc = offset.left / window.innerWidth;
    element.current_y_perc = offset.top / $(window).height();
    element.current_height = el.css('height');
    element.current_width = el.css('width');
    element.current_height_perc = element.current_height / $(window).height();
    element.current_width_perc = element.current_width / window.innerWidth;
}


function get_object_parent(){
    if(potential_parent.is_getting_parent == false){
        potential_parent.is_getting_parent == true;
    }else{
        potential_parent.is_getting_parent == false;
    }
}


function save_element_dimensions(){
    if(current_element.element_name && current_element.element_name != null){
        var data = {
            'current_page': project_objects.current_page,
            'project_id': project_objects.pname,
            'project_name': project_objects.current_project_name,
            'el_data': element,
        }

        $.ajax({
            type: 'POST',
            async: false,
            data: data,
            success: function(data){
                if(data.success == false){
                    console.log(data.msg);
                    alert(data.msg);
                }
            }
        }).fail(function(jqXHR, textStatus){
            console.log('Failed to Save Position', textStatus);
            console.log(jqXHR);
            alert('Internal Error');
        });
    }
}


function save_current_positions(){
    var data = {
        'current_page': project_objects.current_page,
        'project_id': project_objects.pname,
        'project_name': project_objects.current_project_name,
        'obj_name': element.current_element,
        'current_x_position': element.current_x_position,
        'current_y_position': element.current_y_position,
        'current_x_perc': element.current_x_perc,
        'current_y_perc': element.current_y_perc,
    }

    $.ajax({
        type: 'POST',
        url: '/save_current_position/',
        data: data,
        async: false,
        success: function(data){
            if(data.success == false){
                console.log(data.msg);
                alert(data.msg);
            }
        }
    }).fail(function(jqXHR, textStatus){
        console.log('Failed to Save New Positions', textStatus);
        console.log(jqXHR);
        alert('Internal Error');
    });
}


function refresh_element(elmnt){
    if(element.current_element && element.current_element != null){
        var el = $('[name="' + element.current_element + '"]');
        if(el.length){
            var data = {
                'obj_name': element.current_element,
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
                        root_tag.css('top', el.css('top'));
                        root_tag.css('left', el.css('left'));
                        $('.element-area').append(root_tag);
                        set_element_details(root_tag);
                        el.remove();
                    }else{
                        console.log(data.msg);
                        alert(data.msg);
                    }
                }
            }).fail(function(jqXHR, textStatus){
                console.log('Failed to Refresh', textStatus);
                alert(jqXHR);
            });
        }
    }
}


function remove_element(){
    if(element.current_element && element.current_element != null){
        var data = {
            'project_id': project_objects.pname,
            'project_name': project_objects.current_project,
            'page': project_objects.current_page,
            'obj_name': element.current_element,
        };

        $.ajax({
            type: 'POST',
            url: '/remove_page_element/',
            data: data,
            success: function(data){
                if(data.success == false){
                    alert('Element Removal Was Not Successful');
                }
                $('[name="' + element.current_element + '"]').remove();
            }
        }).fail(function(jqXHR, textStatus){
            console.log('Removing Current Element ', textStatus);
            console.log(jqXHR);
            alert('Internal Error');
        });
    }
}


function clear_element(){
    if(element.current_element && element.current_element != null){
        element = {
            current_element: null,
            element_name: null,
            current_x_position: 0,
            current_y_position: 0,
            current_x_perc: 0,
            current_y_perc: 0,
            current_height_perc: 0,
            current_width_perc: 0
        }
    }
}


function edit_element(){
    //get editor
    if(element.current_element && element.current_element != null){

    }else{
        console.log('No Element Selected');
    }
}


function reset_element_dimensions(){
    element.current_width = element.current_width_perc * window.innerWidth;
    element.current_height = element.current_height_perc * $(window).height();
    var el = $('[name="' + element.current_element + '"]');
    if(el.length){
        el.css('width', element.current_width);
        el.css('height', element.current_height);
    }
}


function increase_object_size(){
    if(element.current_element && element.current_element != null){
        element.current_width_perc += .02;
        element.current_height_perc += .02;
        reset_element_dimensions()
        save_element_dimensions();
    }
}


function decrease_object_size(){
    if(element.current_element && element.current_element != null){
        element.current_width_perc -= .02;
        element.current_height_perc -= .02;
        reset_element_dimensions();
        save_element_dimensions();
    }
}


function handle_mouse_up(){
    if(potential_parent.is_getting_parent == false){
        if($(this).attr("class") != undefined && $(this).attr("class").includes("edit-el")){
            var elmnt = $(this);
            var offset = elmnt.offset();
            element.current_element = $(this).attr('name');
            elmnt.current_x_position = offset.left;
            elmnt.current_y_position = offset.top;
            elmnt.current_width_perc = offset.left / window.innerWidth;
            elmnt.current_height_perc = offset.top /$(window).height();

            //if(old_oname != oname || (old_x != x || old_y != y)){
            //    save_current_positions();
            //}
        }
    }else if(element.current_element){
        set_element_parent($(this));
    }
}


function handle_mouse_over(){
    $(this).css('border', '5px solid red');
}


function handle_mouse_out(){
    $(this).css('border', '');
}


function handle_mouse_down(e){
    var elmnt = $('this');
    clear_element();
    var mdown = document.createEvent("MouseEvents");
    mdown.initMouseEvent("mousedown", true, true, window, 0, e.screenX, e.screenY, e.clientX, e.clientY, true, false, false, true, 0, null);
    $(this).closest('.draggable')[0].dispatchEvent(mdown);

    $(this).on('click', function(e){
        var $draggable = $(this).closest('.draggable');
        if($draggable.data("preventBehaviour")){
            e.preventDefault();
            $draggable.data("preventBehaviour", false)
        }
    });
}


function prep_object(elmnt){
    var elmnt = $(elmnt);
    elmnt.mouseover(handle_mouse_over);
    elmnt.mouseout(handle_mouse_out);
    elmnt.mouseup(handle_mouse_up);
    elmnt.mousedown(handle_mouse_down);
    return $(elmnt);
}
