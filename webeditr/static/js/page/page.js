//page functions (e.g. functions called on page change)

function get_page_elements(){
    var data = {
        'current_page': project_objects.current_page
    }
}


function get_page_info_div(){
    var page_info_div = $('.pageinf-div');
    if(page_info_div != undefined && page_info_div != null){
        page_info_div.remove();
    }
    page_info_div = $('.pageinf-div');
    if(page_info_div != undefined && page_info_div.html() != undefined){
        page_info_div.remove();
    }
    page_info_div = $('<div>', {
                    class: 'pageinf-div standard-grey-gradient shadow'});
    var title_div = $('<div>', {
                    class: 'pageinf-title-div'});
    if(project_objects.current_project != null){
        title_div.html(project_objects.current_project);
    }
    page_info_div.append(title_div);
    var current_page_div = $('<div>', {
                            class: 'pageinf-page-div'});
    if(project_objects.current_page != null){
        var ptitle = 'Current Page: '+ project_objects.current_page;
        current_page_div.html(ptitle);
    }
    page_info_div.append(current_page_div);
    page_info_div.draggable();
    $('.editor').append(page_info_div);
}


function setup_page(elmnt){
    //called on dblclick of page title
    var page_name = $(elmnt).html();
    var pageinf_div = $('.pageinf-page-div');
    if(pageinf_div != undefined && pageinf_div.html() != undefined){
        pageinf_div.html('Current Page: ', page_name);
    }
    project_objects.current_page = page_name;
    get_page_info_div();
    setup_page_dimensions(project_objects.current_project, page_name);
    //get_page_elements();
    //clear_editor_elements();
}