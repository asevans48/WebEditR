
var settings = {
    screen_width: window.innerWidth,
    current_item: null,
}


var project_objects = {
    current_project: null,
    pname: 0,
    project_title: null
}


$(document).ready(function(){
    $('.background-dots').css('width', window.innerWidth);
    $('.background-dots').css('height', $(window).height());
    get_starting_div();
});
