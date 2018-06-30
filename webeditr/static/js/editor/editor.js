
var settings = {
    screen_width: window.innerWidth,
    current_item: null,
}


var page_objects = {

}


//save page_objects to database
function save_to_database(){

}


//load page from database
function load_from_database(){

}


//add an attribute
function add_attribute(){

}


//build element
function build_element(){

}


//build pallet
function build_pallet(){

}


//select element
function select_element(){

}


//on mouse down check if class editable-element is present and set as current move-able element
function on_mouse_down(){

}


//edit position on page if editable-element with all children
function edit_position(){

}


//on mouse up
function on_mouse_up(){

}


//obtains file to work on
function file_chooser(){

}


//get project information
function get_project_details(elmnt){
    var choice_div = $(elmnt);
    var sel_div = choice_div.find('select');

}


//obtain existing projects
function get_projects(){
    var project_names = []
    var csrf_middleware = $('[name="csrfmiddlewaretoken"]').val();
    var data = {
        'csrf_token': csrf_middleware
    };
    $.ajax({
       type: "POST",
       url: '/get_projects',
       data:
    });
    return project_names;
}


//obtains working project
function get_project(){
    var body = $('.editor');
    var project_chooser = $('<div>', {
                            class: 'project-choice-div'});

    var sel_div = $('<div>', {
                    class: 'project-choice-sel-div'});
    var projects = get_projects();
    var project_select = $('<select>',{
                            class: 'project-choice-sel form-control'});
    for(var i = 0; i < projects.length; i++){
        var name = projects[i].name;
        var id = projects[i].id;
        var opt = $('<option>', {
                     class: 'project-choice-sel-opt'});
        opt.attr('id', id);
        opt.attr('value', id);
        opt.text(name);
        project_select.append(opt);
    }
    sel_div.append(project_select);

    var add_btn = $('<i>', {
                   class: 'project-sel-add-btn'});
    sel_div.append(add_btn);
    project_chooser.append(sel_div);

    var ok_div = $('<div>');
    var ok_btn = $('<input>', {
                type: 'btn',
                class: 'input-sel-btn form-control',
                onclick: 'get_project_details();'});
    body.append(project_chooser);
}


$(document).ready(function(){
    get_project();
});
