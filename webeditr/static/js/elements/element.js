
var element = {
    current_element: null,
    current_x_position: 0,
    current_y_position: 0,
    current_x_perc: 0,
    current_y_perc: 0,
    current_height_perc: 0,
    current_width_perc: 0
}


function handle_mouse_up(){

}


function handle_mouse_down(){

}


function prep_object(elmnt){
    var elmnt = $(elmnt);
    elmnt.mousedown(handle_mouse_down);
    elmnt.mouseup(handle_mouse_up);
}
