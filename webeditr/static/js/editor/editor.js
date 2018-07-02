
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
    get_starting_div();
});
