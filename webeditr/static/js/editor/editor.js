
var settings = {
    screen_width: window.innerWidth,
    current_item: null,
}


var project_objects = {
    current_project: null,
    pname: 0,
    default_dimensions: null,
    page_dimensions: null,
    current_page: null
}


var script_editor = {
    func_dict: {},
}


//starting point
$(document).ready(function(){
    //load background dots
    $('.background-dots').css('width', window.innerWidth);
    $('.background-dots').css('height', $(window).height());

    //check if project is supplied
    var href = window.location.href;
    var regex = new RegExp('[?&]project(=([^&#]*)|&|#|$)');
    var par = regex.exec(href);
    var regex = new RegExp('[?&]pname(=([^&#]*)|&|#|$)')
    var pname = regex.exec(href);
    //get project or project select
    if(par != null && par[2] && pname && pname[2]){
        var project_title = decodeURIComponent(par[2].replace(/\+/g,' '));
        var pname = decodeURIComponent(pname[2].replace(/\+/g, ' '));
        pname = parseInt(pname.trim());
        load_project_assets(pname, project_title);
        open_project_pallet(pname, project_title);
    }else{
        get_starting_div();
    }
});
