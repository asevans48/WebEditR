
function get_object_fill(){

}


function get_pallet_button(){

}


function populate_project_pallet(page_name){

}


function hide_pallet(){
    $('.pallet').hide();
}


function show_pallet(){
    $('.pallet').show();
}


function create_lower_button_div(){
    var panel_area = $('<div>', {
                      class: 'pallet pallet-panel-area'});
    var row_a = $('<div>',{
                class: 'pallet pallet-btn-row'});
    var sel_object_div = $('<div>', {
                         class: 'pallet pallet-sel-obj-div'});
    var sel_object_btn = $('<i>', {
                         class: 'pallet pallet-sel-obj-btn glyphicon glyphicon-asterisk',
                         onclick: 'get_object_selection();'});
    sel_object_div.append(sel_object_btn);
    row_a.append(sel_object_div);
    var create_object_div = $('<div>', {
                            class: 'pallet pallet-create-obj-div'});
    var create_object_btn = $('<i>', {
                            class: 'pallet pallet-create-obj-btn glyphicon glyphicon-plus',
                            onclick: 'get_object_creator();'});
    create_object_div.append(create_object_btn);
    var sel_background_div = $('<div>', {
                             class: 'pallet pallet-sel-bg-div'});
    var sel_background_btn = $('<i>', {
                             class: 'pallet pallet-sel-bg-btn fa fa-paint-roller',
                             onclick: 'get_background_selector();'});
    sel_background_div.append(sel_background_btn);
    create_object_div.append(sel_background_div);
    row_a.append(create_object_div);
    var bg_fill_div = $('<div>', {
                      class: 'pallet pallet-create-fill-div'});
    var bg_fill_btn = $('<i>', {
                      class: 'pallet pallet-create-fill-btn fa fa-fill',
                      onclick: 'get_object_fill()'});
    bg_fill_div.append(bg_fill_btn);
    row_a.append(bg_fill_div);
    var gradient_sel_div = $('<div>', {
                            class: 'pallet pallet-gradient-sel-div'});
    var gradient_sel_btn = $('<i>', {
                           class: 'pallet pallet-gradient-sel-btn fa fa-palette'});
    gradient_sel_div.append(gradient_sel_btn);
    panel_area.append(row_a);
    return panel_area;
}


function open_project_pallet(pid, project_title){
    $('.pallet-div').remove();
    var pallet_div = $('<div>', {
                    class: 'pallet pallet-div standard-grey-gradient shadow',
                    name: project_title});
    var pallet_title_div = $('<div>', {
                            class: 'pallet pallet-title-div'});
    var pallet_title = $('<span>', {
                        class: 'pallet pallet-title-txt'});
    pallet_title.append('Pallet');
    pallet_div.append(pallet_title_div);
    var panel_area = create_lower_button_div();
    pallet_div.append(panel_area);
    pallet_div.draggable();
    $('.editor').append(pallet_div);
}
