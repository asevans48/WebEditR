
function get_project_dimensions(){
}


function unblock_project_dimensions_picker(){
}


function setup_project_dimensions(project_title){

}


function exit_dimensions(){
    $('.dimensions-div').remove();
}


function open_project_dimensions_panel(pid, project_title){
    var dim_panel = $('<div>', {
                    class: 'dimensions-div standard-grey-gradient shadow'});
    //append items here
    var dimension_title = $('<div>', {
                          class: 'dimensions-div-title'});
    var dimension_title_spn = $('<span>', {
                              class: 'dimensions-div-title-spn'});
    dimension_title_spn.append('Dimensions');
    dimension_title.append(dimension_title_spn);
    var dimension_exit_spn = $('<span>', {
                                class: 'dimensions-div-exit-spn'});
    var dimension_exit_btn = $('<i>', {
                             class: 'dimensions-div-exit-btn fa fa-times',
                             onclick: 'exit_dimensions();'});
    dimension_exit_spn.append(dimension_exit_btn);
    dimension_title.append(dimension_exit_spn);
    dim_panel.append(dimension_title);
    var dimension_picker = $('<div>', {
                            class: 'dimensions-picker-div'});
    var dimension_start_spn = $('<span>', {
                          class : 'dimensions-picker-start-spn'});
    var dimension_start_inpt = $('<input>', {
                                class: 'dimensions-picker-start-inpt'});
    dimension_start_spn.append(dimension_start_spn);
    dimension_picker.append(dimension_sta
    rt_spn);
    dim_panel.append(dimension_picker);
    var current_dimensions = $('<div>', {
                             class: 'dimensions-existing-div'});
    dim_panel.append(current_dimensions);
    dim_panel.draggable();
    $('.editor').append(dim_panel);
}
