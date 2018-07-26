//page functions (e.g. functions called on page change)

var page = {
    style_chars: ['.', '#', '[', ':'],
    style_el_names: ['div', 'a', 'p', 'i', 'ul', 'ol', 'body', 'li', 'input', 'textarea', ''],
}


function get_page_elements(){
    var data = {
        'current_page': project_objects.current_page
    }
}


function load_ext_script_content(page_name){
    var data = {
        'page_name': page_name,
    };

    $.ajax({
        type: 'POST',
        url: '/get_ext_script_by_page/',
        data: data,
        success: function(data){
            if(data.success){
                var scripts = data.scripts;
                $(Object.keys(scripts)).each(function(index, script_name){
                    $.ajax({
                        url: scripts[script_name],
                        type: 'GET',
                        dataType: 'script',
                        async: true,
                    }).fail(function(jqXHR, textStatus){
                        console.log('Failed to Get Script ', textStatus);
                        console.log(jqXHR);
                    });
                });
            }else{
                console.log(data.msg);
            }
        }
    }).fail(function(jqXHR, textStatus){
        console.log('Failed to Get External Scripts', textStatus);
        console.log(jqXHR);
    });
}


function load_script_content(page_name){
    var data = {
        'page_name': page_name,
    };

    $.ajax({
        type: 'POST',
        url: '/get_script_by_page/',
        data: data,
        success: function(data){
            //add scripts to page
            if(data.success){
                var scripts = data.scripts;
                $(Object.keys(scripts)).each(function(index, script_name){
                    var code = "";
                    var funcs = scripts[script_name];
                    $(Object.keys(funcs)).each(function(index, fname){
                        var func = funcs[fname];
                        if(func.length > 0){
                            code += func + ' ';
                        }
                    });
                    var stag = $('<script>', {
                                type: 'text/javascript',
                                class: 'dynamic-js custom-js',
                                name: script_name});
                    stag.append(code);
                    $('head').append(stag);
                });
            }else{
                console.log('Failed to Get Custom Page Scripts');
                console.log(data.msg);
            }
        }
    }).fail(function(jqXHR, textStatus){
       console.log('Failed to Get Scripts', textStatus);
       console.log(jqXHR);
    });
}


function load_page_scripts(page_name){
    //load existing scripts
    load_script_content(page_name);
    load_ext_script_content(page_name);
}


function load_ext_style_content(page_name){
    var data = {
        'page_name': page_name,
    };

    $.ajax({
        type: 'POST',
        url: '/get_ext_style_by_page/',
        data: data,
        success: function(data){
            var sheets = data.sheets;
            $(Object.keys(sheets)).each(function(index, sheet_name){
               $.ajax({
                    type: 'GET',
                    url: sheets[sheet_name],
                    success: function(data){
                        var style_tag = $('<style>', {
                                        class: 'dynamic-css external-css',
                                        name: sheet_name});
                       style_tag.prop('disabled', false);
                       style_tag.html(data);
                       $('head').append(style_tag);
                   }
               }).fail(function(jqXHR, textStatus){
                   console.log('Failed to Get Stylesheet', sheet_name);
               });
            });
        }
    }).fail(function(jqXHR, textStatus){
        console.log('Failed to Get External Stylesheet', textStatus);
        console.log(jqXHR);
    });
}


function load_sheet_content(page_name){
    var data = {
        'page_name': page_name,
    };

    $.ajax({
        type: 'POST',
        url: '/get_style_by_page/',
        data: data,
        async: true,
        success: function(data){
            //add styles to page
            if(data.success){
                var sheets = data.sheets;
                if($(Object.keys(sheets)).length > 0){
                    $(Object.keys(sheets)).each(function(index, value){
                        var classes = sheets[value];
                        var class_strings = [];
                        $(Object.keys(classes)).each(function(index, classname){
                            var attributes = classes[classname];
                            if(attributes != undefined && Object.keys(attributes).length > 0){
                                var prefix = '';
                                if(page.style_chars.includes(classname.trim().charAt(0)) == false){
                                    prefix = '.';
                                }
                                var class_string = prefix + classname.trim() + '{';
                                $(Object.keys(attributes)).each(function(index, attr){
                                    class_string += attr;
                                    class_string += ':';
                                    class_string += attributes[attr];
                                    class_string += ';';
                                })
                                class_string += '}';
                                class_strings.push(class_string);
                            }
                        });
                        var style_tag = $('<style>', {
                                        class: 'dynamic-css custom-css',
                                        name: value});
                        var css_str = class_strings.join('\n');
                        style_tag.append(css_str);
                        $('head').append(style_tag);
                    });
                }
            }else{
                console.log('Failed to Get Custome Page Sheets');
                console.log(data.msg);
            }
        }
    }).fail(function(jqXHR, textStatus){
        console.log('Failed to Get Styles', textStatus);
        console.log(jqXHR);
    });
}


function load_page_styles(page_name){
    load_sheet_content(page_name);
    load_ext_style_content(page_name);
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
    var pname = project_objects.pname;
    var title_div = $('<div>', {
                    class: 'pageinf-title-div',
                    id: pname});
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
    var reload_project_div = $('<div>', {
                              class: 'reload-project-div'});
    var reload_project_btn = $('<button>', {
                            class: 'reload-project-btn btn btn-primary',
                            onclick: 'reload_project();'});
    reload_project_btn.append('Reload Project');
    reload_project_div.append(reload_project_btn);
    reload_project_div.append(reload_project_div);
    page_info_div.append(reload_project_div);
    page_info_div.draggable();
    $('.editor').append(page_info_div);
}


function load_page(page_name){
    $('.dynamic-css').remove();
    $('.dynamic-js').remove();
    var pageinf_div = $('.pageinf-page-div');
    if(pageinf_div != undefined && pageinf_div.html() != undefined){
        pageinf_div.html('Current Page: ', page_name);
    }
    project_objects.current_page = page_name;
    get_page_info_div();
    setup_page_dimensions(project_objects.current_project, page_name);
    load_page_scripts(page_name);
    load_page_styles(page_name);
    get_page_elements();
    $('.pallet').show();
}


function setup_page(elmnt){
    //called on dblclick of page title
    var page_name = $(elmnt).html();
    load_page(page_name);
}


function check_and_get_current_page(){
    var href = window.location.href;
    var regex = new RegExp('[?&]page(=([^&#]*)|&|#|$)')
    var par = regex.exec(href);
    if(par && par[2]){
        var page_name = decodeURIComponent(par[2].replace(/\+/g,' '));
        if(page_name.trim().length > 0){
            load_page(page_name);
        }
    }else{
        $('.pallet').hide();
    }
}
