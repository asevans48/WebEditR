//page functions (e.g. functions called on page change)

function get_page_elements(){
    var data = {
        'current_page': project_objects.current_page
    }
}


function setup_page(elmnt){
    //called on dblclick of page title
    var page_name = $(elmnt).html();
    project_objects.current_page = page_name;
    setup_page_dimensions(project_objects.project_title, page_name);
    get_page_elements();
    //clear_editor_elements();
}