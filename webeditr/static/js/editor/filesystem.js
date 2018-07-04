
function remove_sheet(elmnt){
    var sheet_div = $(elmnt).parent()
    var sheet_id = sheet_div.attr('id');
    var sheet_name = sheet_id.find('.sheet-title').html();
    var sheet_type = null;
    if(sheet_name.endsWith("css")){
        sheet_type = "css";
    }else if(sheet_name.endsWith("js"))
        sheet_type = "js";
    }
    var data{
        'sheet_id': sheet_id;
        'sheet_type': sheet_type;
    }

    $.ajax({
        type: 'POST',
        url: '/remove_sheet/',
        data: data,
        success: function(data){
            if(data.success){
                open_project_file_panel(
                                        pname,
                                        project_title,
                                        data);
            }else{
                alert(data.msg);
            }
        }
    }).fail(function(jqXHR, textStatus){
        console.log("Request Failed" + textStatus);
        console.log(jqXHR);
    });

}

function update_project_assets(){
    var pname = project_objects.pname;
    var project_title = project_objects.current_project;
    var data = {
                'project_id': pname};
    $.ajax({
        type: 'POST',
        url: '/get_project_assets/',
        data: data,
        success: function(data){
            if(data.success){
                open_project_file_panel(
                                        pname,
                                        project_title,
                                        data);
            }else{
                alert(data.msg);
            }
        }
    }).fail(function(jqXHR, textStatus){
        console.log("Request Failed" + textStatus);
        console.log(jqXHR);
    });
}


function remove_page(elmnt){
    var page_rem_btn = $(elmnt);
    var page_id = page_rem_btn.parent().attr('id');
    var data = {
        'page_id': page_id;
    }

    $.ajax({

    }).fail(function(jqXHR, textStatus){
        console.log("Request Failed: " + textStatus);
        console.log(jqXHR);
        update_project_assets();
    });
}


function create_new_sheet(){
    var sheet_title = $('.fsys-new-sheet-title').val();
    var sheet_type = $('.fsys-new-sheet-select').val();
    var sheet_desc = $('.fsys-new-sheet-desc').val();
    var page_id = $('[name="page_id"]').val();
    var project =  project_objects.current_project
    if(page_id == undefined || page_id == null){
        alert('Page Id Not Provided');
    }else if(sheet_title != null && sheet_title.trim().length > 0 &&
       sheet_type != null && sheet_type.trim().length > 0 &&
       sheet_desc != null && sheet_desc.trim().length > 0){
       var data = {
            'title': sheet_title,
            'type': sheet_type,
            'description': sheet_desc,
            'project': project,
            'page_id': page_id
       }

       $.ajax({
           type: "POST",
           url: '/add_new_sheet/',
           data: data,
           success: function(data){
               if(data.success == false){
                  console.log('Request Failed', data.page_id);
               }
               update_project_assets();
           }
        }).fail(function(jqXHR, textStatus){
            console.log("Request Failed: " + textStatus);
            console.log(jqXHR);
            add_new_page_btn($('fsys-div'));
        });
    }else{
        alert('Not All Sheet Elements Not Specified');
    }
}


function get_new_sheet(elmnt){
    var sheet_add_btn = $(elmnt);
    var page_id = sheet_add_btn.parent().attr('id');
    $('.fsys-new-sheet-div').remove();
    var np_div = $('<div>',{
                 class: 'fsys-new-sheet-div standard-grey-gradient shadow'});
    np_div.draggable();
    var np_pageid = $('<input>', {
                    type: 'hidden',
                    name: 'page_id',
                    value: page_id});
    var np_div_title = $('<div>',{
                        class: 'fsys-new-sheet-title'});
    np_div_title.html('New Sheet');
    np_div.append(np_div_title);
    var project_title = $('<input>',{
                        type: 'text',
                        class: 'fsys-new-sheet-inpt form-control',
                        placeholder: 'Sheet Title'});
    np_div.append(project_title);

    var sheet_type_sel = $('<select>',{
                           class: 'fsys-new-sheet-select'});
    var css_opt = $('<option>', {id: 'css', value: 'CSS'});
    css_opt.text('CSS')
    sheet_type_sel.append(css_opt);
    var js_opt = $('<option>', {id: 'js', value: 'JS'});
    js_opt.text('JS')
    sheet_type_sel.append(js_opt);
    np_div.append(sheet_type_sel);

    var project_title = $('<textarea>', {
                        class: 'fsys-new-sheet-desc form-control',
                        placeholder: 'Sheet Description'});
    np_div.append(project_title);
    var np_div_sbmt = $('<button>', {
                      class: 'btn btn-primary fsys-new-sheet-btn',
                      onclick: 'create_new_sheet();'});
    np_div_sbmt.html('Create Sheet');
    np_div.append(np_div_sbmt);

    var exit_btn_div = $('<div>',{
                    class: 'fsys-new-page-remove-div'});
    var exit_btn = $('<i>', {
                    class: 'fa fa-times fsys-new-sgeet-remove-btn',
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
    $('.fsys-new-page-div').remove();
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

    var fsys_div = $('.fsys-div');
    if(fsys_div != undefined && fsys_div != null){
        fsys_div.remove();
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
