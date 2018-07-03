
var settings = {
    screen_width: window.innerWidth,
    current_item: null,
}


var project = {
    projects: [],
    project_assets: {},
    current_project: null,
    project_details: {},
}


$(document).ready(function(){
    $('.background-dots').css('width', window.innerWidth);
    $('.background-dots').css('height', $(window).height());
    get_starting_div();
});
