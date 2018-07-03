
function get_new_page_div(){
    var new_page_div = $('<div>',{
                        class: 'fsys-new-page-btn-div'});
    var new_page_btn = $('<div>',{
                        class: 'fsys-new-page-btn',
                        onclick: ''});
    new_page_div.append(new_page_btn);
    return new_page_div;
}


function add_get_sheet_input(root_div){
    var sheet_search_inpt = $('<input>',{
                            class: 'fsys-sheet-search-inpt form-control'});
    var sheet_search_inpt_btn = $('<button>', {
                                class: 'fsys-search-inpt-btn form-control'});
    root_div.append(sheet_search_inpt);
    root_div.append(sheet_serach_inpt_btn);
}


function submit_new_page(){
    var page_name = $('.fsys-page-inpt');
    var data = {
        'page_name': page_name.val();
    }
    $.ajax({
       type: "POST",
       url: '/submit_new_page/',
       data: data,
       success: function(data){
        if(data.success == false){
            $('fsys-page-inpt-div').remove();
            var np_div = get_new_page_div();
            $('fsys-div').append(np_div);
        }
       }
    }).fail(function(jqXHR, textStatus){
        console.log("Request Failed: " + textStatus);
        console.log(jqXHR);
    });
}


function submit_new_sheet(elmnt){
    var btn = $(elmnt);
}


function add_new_page_input(root_div){
    $('.fsys-new-page-btn-div').remove();
    var page_inpt_div = $('<div>', {
                        class: 'fsys-page-inpt-div'});
    var page_inpt = $('<input>', {
                    class: 'fsys-page-inpt form-control'});
    var page_sbmt_btn = $('<button>',{
                        class: 'btn btn-primary submit_new_page()'});
    page_inpt_div.append(page_inpt);
    page_inpt_div.append(page_sbmt_btn);
    root_div.append(page_inpt_div);
}


function add_new_sheet_input(root_div){
    var sheet_inpt = $('<input>', {
                      class: 'fsys-sheet-inpt form-control'});
    var sheet_type = $('<select>', {
                      class: 'fsys-sheet-sel form-control'});
    root_div.append(sheet_inpt);
    root_div.append(sheet_type);
}


function add_sheets(root_div, sheets){
    for(sheet in sheets.keys()){
        var sheet_div = $('<div>', {
                    class: 'fsys-sheet-div'});
        var sheet_name_div = $('<div>', {
                         class: 'fsys-sheet-name-div'});
        sheet_div.append(sheet_name_div);
        var sheet_rem_btn = $('<i>',{
                              class: 'glyphicon glyphicon-plus fsys-rem-btn'});
        sheet_div.append(sheet_rem_btn);
        root_div.append(sheet_div);
    }
}


function build_fsys_div(page_name, style_sheets, script_sheets){
    var fsys_div = $('<div>', {class: 'fsys-root-div'})
    add_sheets(fsys_div, style_sheets);
    add_sheets(fsys_div, script_sheets);
    return fsys_div;
}


function build_connector_div(){
    var connector_div = $('<div>', {'fsys-connector-div'});
    return connector_div;
}


function display_file_system(pages){
    for(page in pages){
        var page_name = page.page_name;
        var page_id = page.id;
        var style_sheets = page.

    }
}


function open_project_file_panel(project_id, project_title, pages){
    var pcdiv = $('.project-choice-div');
    if(pcdiv != undefined && pcdiv != null){
        pcdiv.remove();
    }

    //file system div
    var fsysdiv = $('<div>',{
                    class: 'fsys-div standard-grey-gradient'});
    fsysdiv.draggable();

    //file system title
    var fsys_title = $('<div>',{
                        class: 'fsys-title-div'});
    console.log(project_title);
    fsys_title.html(project_title)
    fsysdiv.append(fsys_title);

    //file system files
    var fsysdiv_files = $('<div>', {
                    class: 'fsys-files-div'});
    display_file_system(pages);
    fsysdiv.append(fsysdiv_files);
    $('.editor').append(fsysdiv);
}