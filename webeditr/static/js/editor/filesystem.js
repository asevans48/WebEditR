
function remove_sheet(elmnt){
    var sheet_div = $(elmnt).parent().parent();
    var sheet_id = sheet_div.attr('id');
    var sheet_name = sheet_div.find('.fsys-page-sheet-title').html();
    var sheet_type = sheet_div.find('.fsys-page-sheet-type').html();
    var data = {
        'sheet_id': sheet_id,
        'sheet_type': sheet_type.toLowerCase(),
        'page_id': sheet_div.parent().parent().attr('id')
    }

    $.ajax({
        type: 'POST',
        url: '/remove_sheet/',
        data: data,
        success: function(data){
            if(data.success == false){
                alert(data.msg);
            }
            update_project_assets();
        }
    }).fail(function(jqXHR, textStatus){
        console.log("Request Failed" + textStatus);
        console.log(jqXHR);
    }).then(update_project_assets());
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
    var pname = project_objects.pname;
    var project_title = project_objects.current_project;
    var page_rem_btn = $(elmnt);
    var page_id = page_rem_btn.parent().parent().attr('id');
    var data = {
        'page_id': page_id,
        'project_id': project_objects.pname
    }

    $.ajax({
        type: 'POST',
        url: '/remove_page/',
        data: data,
        success: function(data){
            if(data.success == false){
                alert(data.msg);
            }
            update_project_assets();
        }
    }).fail(function(jqXHR, textStatus){
        console.log("Request Failed: " + textStatus);
        console.log(jqXHR);
        update_project_assets();
    });
}


function create_new_sheet(){
    var sheet_title = $('.fsys-new-sheet-inpt').val();
    var sheet_type = $('.fsys-new-sheet-select').val();
    var sheet_desc = $('.fsys-new-sheet-desc').val();
    var page_id = $('[name="page_id"]').val();
    var project =  project_objects.current_project;
    if(page_id == undefined || page_id == null){
        alert('Page Id Not Provided');
    }else if(sheet_title != null && sheet_title.trim().length > 0 &&
       sheet_type != null && sheet_type.trim().length > 0){
       if(sheet_desc == undefined || sheet_desc == null){
        sheet_desc = '';
       }
       var data = {
            'title': sheet_title,
            'type': sheet_type,
            'description': sheet_desc,
            'project': project,
            'project_id': project_objects.pname,
            'page_id': page_id
       };
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
       }).then(update_project_assets());
       $('.fsys-new-sheet-div').remove();
    }else{
        alert('Not All Sheet Elements Not Specified');
    }
}


function get_new_sheet(elmnt){
    var sheet_add_btn = $(elmnt);
    var page_id = sheet_add_btn.parent().parent().attr('id');
    $('.fsys-new-sheet-div').remove();
    var np_div = $('<div>',{
                 class: 'fsys-new-sheet-div standard-grey-gradient shadow'});
    np_div.draggable();
    var np_pageid = $('<input>', {
                    type: 'hidden',
                    name: 'page_id',
                    value: page_id});
    np_div.append(np_pageid);

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
    var ext_js = $('<option>', {id: 'ext_js', value: 'EJS'});
    ext_js = ext_js.append('External JS');
    sheet_type_sel.append(ext_js);
    var ext_css = $('<option>', {id: 'ext_css', value: 'ECSS'});
    ext_css = ext_css.append('External CSS');
    sheet_type_sel.append(ext_css);
    np_div.append(sheet_type_sel);

    var project_title = $('<textarea>', {
                        class: 'fsys-new-sheet-desc form-control',
                        placeholder: 'Sheet Description or URL'});
    np_div.append(project_title);
    var np_div_sbmt = $('<button>', {
                      class: 'btn btn-primary fsys-new-sheet-btn',
                      onclick: 'create_new_sheet();'});
    np_div_sbmt.html('Create Sheet');
    np_div.append(np_div_sbmt);

    var exit_btn_div = $('<div>', {
                    class: 'fsys-new-page-remove-div'});
    var exit_btn = $('<i>', {
                    class: 'fa fa-times fsys-new-sheet-remove-btn',
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


function get_inner_sheet_div(sheet_type, sheet_title, sheet_id, url=null){
    var func = null;
    if(sheet_type.toLowerCase().trim() == 'css'){
        func = 'get_style_sheet_editor(this);';
    }else if(sheet_type.toLowerCase().trim() == 'js'){
        func = 'get_script_sheet_editor(this);';
    }else if(sheet_type.toLowerCase().trim() == 'ejs'){
        func = 'get_ext_script_sheet_editor(this, "' + sheet_title + '", "'+ url +'")';
    }else if(sheet_type.toLowerCase().trim() == 'ecss'){
        func = 'get_ext_style_sheet_editor(this, "' + sheet_title + '", "'+ url +'")';
    }

    var sheet_div = $('<div>', {
                    class: 'fsys-page-sheet-div',
                    id: sheet_id});
    var sheet_sep = $('<span>', {
                    class: 'fsys-page-sheet-sep'});
    sheet_sep.html('-');
    sheet_div.append(sheet_sep);
    var sheet_title_spn =  $('<span>',{
        class: 'fsys-page-sheet-title',
        onclick: func});
    sheet_title_spn.append(sheet_title);
    sheet_div.append(sheet_title_spn);
    var sheet_type_spn = $('<span>',{
                     class: 'fsys-page-sheet-type'});
    sheet_type_spn.html(sheet_type);
    sheet_div.append(sheet_type_spn);
    var sheet_rem_btn_spn = $('<span>', {
                            class: 'fsys-page-sheet-rem-spn'});
    var sheet_rem_btn = $('<i>',{
                        class: 'fsys-page-sheet-rem-btn fa fa-times',
                        onclick: 'remove_sheet(this);'});
    sheet_rem_btn_spn.append(sheet_rem_btn);
    sheet_div.append(sheet_rem_btn_spn);
    return sheet_div;
}


function add_new_page_to_fs(page_name, page_id, scripts=null, sheets=null, ext_scripts=null, ext_sheets=null){
    var fsys_div = $('<div>', {class: 'fsys-page-div', id: page_id});
    var fsys_title_div = $('<div>');
    fsys_div.append(fsys_title_div);
    var page_sep_div = $('<div>', {
                        class: 'fsys-page-title-sep'});
    page_sep_div.html('/');
    fsys_title_div.append(page_sep_div);
    var page_title = $('<div>',{
                     class: 'fsys-page-title-txt',
                     onclick: 'setup_page(this);'});
    page_title.html(page_name);
    fsys_title_div.append(page_title);
    var page_min_btn_div = $('<div>', {
                            class: 'fsys-page-title-rem-btn-div'});
    var page_min_btn = $('<i>', {
                        class: 'fa fa-times fsys-page-title-rem-btn',
                        onclick: 'remove_page(this);'});
    page_min_btn_div.append(page_min_btn);
    fsys_div.append(page_min_btn_div);
    var fsys_scripts_div = $('<div>');
    if(scripts != null && Object.keys(scripts).length > 0){
        //add scripts
        $(Object.keys(scripts)).each(function(index, sheet_title){
            var sheet_id = scripts[sheet_title].id;
            var inner_div = get_inner_sheet_div('JS', sheet_title, sheet_id, null);
            fsys_scripts_div.append(inner_div);
        });
    }

    if(sheets != null && Object.keys(sheets).length > 0){
        //add sheets
        $(Object.keys(sheets)).each(function(index, sheet_title){
            var sheet_id = sheets[sheet_title].id;
            var inner_div = get_inner_sheet_div('CSS', sheet_title, sheet_id, null);
            fsys_scripts_div.append(inner_div);
        });
    }


    if(ext_scripts != null && Object.keys(ext_scripts).length > 0){
        //add external js
        console.log(ext_scripts);
        $(Object.keys(ext_scripts)).each(function(index, script_title){
           var url = ext_scripts[script_title].url;
           var script_id = ext_scripts[script_title].id;
           var inner_div = get_inner_sheet_div('EJS', script_title, script_id, url);
           fsys_scripts_div.append(inner_div);
        });
    }

    if(ext_sheets != null && Object.keys(ext_sheets).length > 0){
        //add external css
        $(Object.keys(ext_sheets)).each(function(index, sheet_title){
            var url = ext_sheets[sheet_title].url;
            var sheet_id = ext_sheets[sheet_title].id;
            var inner_div = get_inner_sheet_div('ECSS', sheet_title, sheet_id, url);
            fsys_scripts_div.append(inner_div);
        });
    }

    fsys_div.append(fsys_scripts_div);
    add_new_sheet_button(fsys_div);
    return fsys_div;
}


function create_new_page(){
    var page_name = $('.fsys-new-page-inpt');
    var page_desc = $('.fsys-new-page-desc');
    var data = {
        'page_name': page_name.val(),
        'page_description': page_desc.val(),
        'project': project_objects.current_project,
        'project_id': project_objects.pname,
    }

    if(data.page_name != null && data.page_name.trim().length > 0
       && data.page_description != null && data.page_description.trim().length > 0){
        $.ajax({
           type: "POST",
           url: '/add_new_page/',
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
        }).then(update_project_assets());
    }else{
        alert('Page Description and Title Must Be Provided');
    }
    $('.fsys-new-page-div').remove();
    update_project_assets();
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
    try{
        var page_arr = pages.pages.pages;
        for(var i = 0; i < page_arr.length; i++){
            var page = page_arr[i];
            var page_name = page.name;
            var page_id = page.page_id;
            var page_div = add_new_page_to_fs(
                                              page_name,
                                              page_id,
                                              page.scripts,
                                              page.sheets,
                                              page.ext_scripts,
                                              page.ext_sheets);
            fsysdiv_files.append(page_div);
        }
    }catch{

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
