
var element = {
    current_element: null,
    element_name: null,
    current_x_position: 0,
    current_y_position: 0,
    current_x_perc: 0,
    current_y_perc: 0,
    current_height_perc: 0,
    current_width_perc: 0
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
        }).fail(function(jqXHR, textStatus)){
            console.log('Failed to Save Position', textStatus);
            console.log(jqXHR);
            alert('Internal Error');
        }
    }
}


function save_current_positions(){
    var data = {
        'current_page': project_objects.current_page,
        'project_id': project_objects.pname,
        'project_name': project_objects.current_project_name,
        'el_data': element,
    }

    $.ajax({
        type: 'POST',
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


function increase_object_size(){
    if(element.current_element && element.current_element != null){
        element.current_width_perc += .02;
        element.current_height_perc += .02;
        save_element_dimensions();
    }
}


function decrease_object_size(){
    if(element.current_element && element.current_element != null){
        element.current_width_perc -= .02;
        element.current_height_perc -= .02;
        save_element_dimensions();
    }
}


function handle_mouse_up(){
    if($(this).attr("class") != undefined && $(this).attr("class").includes("edit-el")){
        var elmnt = $(this);
        var oname = $(this).attr('name');
        var old_oname = element.current_element;
        var old_x = element.current_x_position;
        var old_y = element.current_y_position;
        var offset = elmnt.offset();
        var x = offset.left;
        var y = offset.top;
        element.current_element = oname;
        element.current_x_position = x;
        element.current_y_position = y;
        element.current_x_perc = x / window.innerWidth;
        element.current_y_perc = y / $(window).height();
        element.current_height_perc = $(this).attr('current_height_perc');
        element.current_x_perc = $(this).attr('current_width_perc');
        if(old_oname != oname || (old_x != x || old_y != y)){
            save_current_positions();
        }
    }
}


function handle_mouse_over(){
    $(this).css('border', '1px solid red');
}


function handle_mouse_out(){
    $(this).css('border': '');
}


function handle_mouse_down(){
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


function refresh_element(){

}


function remove_element(){

}


function edit_element(){

}


function prep_object(elmnt){
    var elmnt = $(elmnt);
    elmnt.mouseover(handle_mouse_over);
    elmnt.mouseup(handle_mouse_up);
    elmnt.mousedown(handle_mouse_down);
    return $(elmnt);
}
