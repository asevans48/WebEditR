
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
    console.log(this);
    if($(this).attr("class") != undefined && $(this).attr("class").includes("edit-el")){
        var elmnt = $(this);
        var offset = elmnt.offset();
        elmnt.current_x_position = offset.left;
        elmnt.current_y_position = offset.top;
        elmnt.current_width_perc = offset.left / window.innerWidth;
        elmnt.current_height_perc = offset.top /$(window).height();

        if(old_oname != oname || (old_x != x || old_y != y)){
            save_current_positions();
        }
    }
}


function handle_mouse_over(){
    $(this).css('border', '5px solid red');
}


function handle_mouse_out(){
    $(this).css('border', '');
}


function handle_mouse_down(){
    clear_element();
}


function prep_object(elmnt){
    var elmnt = $(elmnt);
    elmnt.mouseover(handle_mouse_over);
    elmnt.mouseout(handle_mouse_out);
    elmnt.mouseup(handle_mouse_up);
    elmnt.mousedown(handle_mouse_down);
    return $(elmnt);
}
