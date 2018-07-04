
function remove_page(elmnt){
    var page_rem_btn = $(elmnt);

}

function get_new_sheet(elmnt){
    var sheet_add_btn = $(elmnt);
    var np_div = $('<div>',{
                 class: 'fsys-new-sheet-div standard-grey-gradient shadow'});
    np_div.draggable();
    var np_div_title = $('<div>',{
                        class: 'fsys-new-page-title'});
    np_div_title.html('New Sheet');
    np_div.append(np_div_title);
    var project_title = $('<input>',{
                        type: 'text',
                        class: 'fsys-new-page-inpt form-control',
                        placeholder: 'Page Title'});
    np_div.append(project_title);

    var sheet_type = $('<select>',{
        
    });

    var project_title = $('<textarea>', {
                        class: 'fsys-new-page-desc',
                        placeholder: 'Page Description'});
    np_div.append(project_title);
    var np_div_sbmt = $('<button>', {
                      class: 'btn btn-primary fsys-new-page-btn',
                      onclick: 'create_new_sheet();'});
    np_div_sbmt.html('Create Page');
    np_div.append(np_div_sbmt);

    var exit_btn_div = $('<div>',{
                    class: 'fsys-new-page-remove-div'});
    var exit_btn = $('<i>', {
                    class: 'fa fa-times fsys-new-page-remove-btn',
                    onclick: 'remove_new_page_div(this);'});
    exit_btn_div.append(exit_btn);
    np_div.append(exit_btn_div);

    $('.editor').append(np_div);
}


function add_new_sheet_button(root_div){
    var sheet_button_div = $('<div>', {
                            class: 'fsys-newsheet-btn-div'});
    var sheet_add_btn = $('<i>', {
                        class: 'glyphicon glyphicon-plus fsys-sheetadd-btn',
                        onclick: 'get_new_sheet(this);'});
    sheet_button_div.append(sheet_add_btn);
    root_div.append(sheet_button_div);
}


function add_new_page_btn(root_div){
    var np_btn_div = $('<div>', {
                     class: 'fsys-pageadd-btn-div'});
    var np_btn = $('<i>', {
                 class: 'glyphicon glyphicon-plus fsys-pageadd-btn',
                 onclick: 'get_new_page();'});
    np_btn_div.append(np_btn);
    root_div.append(np_btn_div);
}


function add_new_page_to_fs(page_name, page_id, scripts=null, sheets=null){
    var fsys_div = $('<div>', {class: 'fsys-page-div', id: page_id});
    var page_title = $('<div>',{
                     class: 'fsys-page-title-txt'});
    page_title.html('/ '+page_name);
    fsys_div.append(page_title);
    if(scripts != null && Object.keys(scripts).length > 0){
        //add scripts
    }

    if(sheets != null && Object.keys(sheets).length > 0){
        //add sheets
    }

    var page_min_btn_div = $('<div>', {
                            class: 'fsys-page-title-rem-btn-div'});
    var page_min_btn = $('<i>', {
                        class: 'fa fa-times fsys-page-title-rem-btn',
                        onclick: 'remove_page(this);'});
    page_min_btn_div.append(page_min_btn);
    fsys_div.append(page_min_btn_div);
    add_new_sheet_button(fsys_div);
    return fsys_div;
}


function create_new_page(){
    var page_name = $('.fsys-new-page-inpt');
    var page_desc = $('.fsys-new-page-desc');
    var data = {
        'page_name': page_name.val(),
        'page_description': page_desc.val(),
        'project': project_objects.current_project
    }

    if(data.page_name != null && data.page_name.trim().length > 0
       && data.page_description != null && data.page_description.trim().length > 0){
        $.ajax({
           type: "POST",
           url: '/add_new_page/',
           data: data,
           success: function(data){
               if(data.success == false){
                  var page_div = add_new_page_to_fs(page_name, data.page_id);
                  $('.fsys-files-div').append(page_div);
               }else{
                  console.log('Request Failed', data.page_id);
               }
               add_new_page_btn($('.fsys-div'));
           }
        }).fail(function(jqXHR, textStatus){
            console.log("Request Failed: " + textStatus);
            console.log(jqXHR);
            add_new_page_btn($('fsys-div'));
        });
    }else{
        alert('Page Description and Title Must Be Provided');
    }
    $('.fsys-new-page-div').remove();
}


function remove_new_page_div(elmnt){
    $(elmnt).parent().parent().remove();
}


function get_new_page(){
    var np_div = $('<div>',{
                 class: 'fsys-new-page-div standard-grey-gradient shadow'});
    np_div.draggable();
    var np_div_title = $('<div>',{
                        class: 'fsys-new-page-title'});
    np_div_title.html('New Page');
    np_div.append(np_div_title);
    var project_title = $('<input>',{
                        type: 'text',
                        class: 'fsys-new-page-inpt form-control',
                        placeholder: 'Page Title'});
    np_div.append(project_title);
    var project_title = $('<textarea>', {
                        class: 'fsys-new-page-desc',
                        placeholder: 'Page Description'});
    np_div.append(project_title);
    var np_div_sbmt = $('<button>', {
                      class: 'btn btn-primary fsys-new-page-btn',
                      onclick: 'create_new_page();'});
    np_div_sbmt.html('Create Page');
    np_div.append(np_div_sbmt);

    var exit_btn_div = $('<div>',{
                    class: 'fsys-new-page-remove-div'});
    var exit_btn = $('<i>', {
                    class: 'fa fa-times fsys-new-page-remove-btn',
                    onclick: 'remove_new_page_div(this);'});
    exit_btn_div.append(exit_btn);
    np_div.append(exit_btn_div);

    $('.editor').append(np_div);
}


function add_sheets(root_div, sheets){
    for(sheet in sheets.keys()){
        var sheet_div = $('<div>', {
                    class: 'fsys-sheet-div'});
        var sheet_name_div = $('<div>', {
                         class: 'fsys-sheet-name-div'});
        sheet_div.append(sheet_name_div);
        var sheet_rem_btn = $('<i>',{
                              class: 'glyphicon glyphicon-minus fsys-rem-btn'});
        sheet_div.append(sheet_rem_btn);
        root_div.append(sheet_div);
    }
}


function build_connector_div(){
    var connector_div = $('<div>', {class: 'fsys-connector-div'});
    return connector_div;
}


function display_file_system(fsysdiv_files, pages){
    var page_arr = pages.pages.pages;
    for(var i = 0; i < page_arr.length; i++){
        var page = page_arr[i];
        var page_name = page.name;
        var page_id = page.page_id;
        var page_div = add_new_page_to_fs(page_name, page_id, page.sheets, page.scripts);
        fsysdiv_files.append(page_div);
    }
    add_new_page_btn(fsysdiv_files);
}


function add_root_folder(root_div){
    var root_slash = $('<div>', {
                     class: 'fsys-root-folder-div'});
    var root_folder = $('<i>',{
                      class: 'fa fa-folder-open file-component'});
    root_slash.append(root_folder);
    var root_title = $('<span>',{
                      class: 'fsys-root-slash-title file-component'});
    root_title.html('root');
    root_slash.append(root_title);
    root_div.append(root_slash);
}


function open_project_file_panel(project_id, project_title, pages){
    var pcdiv = $('.project-choice-div');
    if(pcdiv != undefined && pcdiv != null){
        pcdiv.remove();
    }

    //file system div
    var fsysdiv = $('<div>',{
                    class: 'fsys-div standard-grey-gradient shadow'});
    fsysdiv.draggable();

    //file system title
    var fsys_title = $('<div>',{
                        class: 'fsys-title-div'});
    fsys_title.html(project_title)
    fsysdiv.append(fsys_title);

    //file system files
    var fsysdiv_files = $('<div>', {
                    class: 'fsys-files-div'});
    add_root_folder(fsysdiv_files);
    display_file_system(fsysdiv_files, pages);
    $('.editor').append(fsysdiv);
    fsysdiv.append(fsysdiv_files);
}
