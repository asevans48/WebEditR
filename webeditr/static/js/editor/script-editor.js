
var script_edit_objs = {
    text_ctl_pressed: false,
    scripts: {},
}


function close_script_editor(){
    var editor = $('.textedit-scriptsheet-div');
    if(editor != undefined && editor.html() != undefined){
        editor.remove();
    }
    reload_project();
}


function remove_function(elmnt){
    var parent_el = $(elmnt).parent().parent();
    var script_name = parent_el.find('.textedit-scriptsheet-funcname-spn').html();
    var script_sheet = $('.textedit-scriptsheet-title-span').html();

    var data = {
        'scriptsheet_name': script_sheet,
        'function_name': script_name
    }

    $.ajax({
        type: 'POST',
        url: '/remove_script_function/',
        data: data,
        success: function(data){
            if(data.success == false){
                console.log('Failed to Remove Function');
                console.log(data.msg);
                alert(data.msg);
            }else{
                parent_el.remove();
            }
            setup_script_sheet_editor_div(script_name);
        }
    }).fail(function(jqXHR, textStatus){
        setup_script_sheet_editor_div(script_name)
    });
}


function on_edit_function_sbmt(elmnt){
    var parent_el = $(elmnt).parent();
    var script_func = parent_el.find('.textedit-scriptsheet-scriptinpt-code').val();
    var script_name = parent_el.parent().find('.textedit-scriptsheet-funcname-spn');
    var script_sheet = $('.textedit-scriptsheet-title-span').html();
    if(script_name == undefined || script_name.html() == undefined){
        script_name = parent_el.parent().find('.textedit-scriptsheet-name-inpt');
        script_name = script_name.val();
    }else{
        script_name = script_name.html();
    }

    if(script_name == undefined || script_name == null){
        alert('Script Name Not Found');
    }else{
        var data = {
            'function_name': script_name,
            'func_code': script_func
        }

        $.ajax({
           type: 'POST',
           url: '/rewrite_script_function/',
           data: data,
           success: function(data){
               if(data.success){
                  setup_script_sheet_editor_div(script_sheet);
               }else{
                  alert('Failed to Submit Function Edit')
               }
           }
        }).fail(function(jqXHR, textStatus){
            console.log('Failed to Edit Function');
        });
    }
}


function edit_function_script(elmnt){
    var parent_el = $(elmnt);
    parent_el.removeAttr('onclick');
    var script_inpt = $('<textarea>', {
                      class: 'textedit-scriptsheet-scriptinpt-code form-control'});

    var parent_div = parent_el.parent();
    var script_name = parent_div.find('.textedit-scriptsheet-scriptinpt-name');
    console.log('Input', script_name.wrap('<p>').html());
    if(script_name.val() != undefined && script_name.val() != null && script_name.val().length > 0){
        console.log('Getting Val');
        script_name = script_name.val();
    }else if(script_name.attr('placeholder') != undefined){
        console.log('Getting Placeholder');
        script_name = $(script_name).attr('placeholder');
    }
    console.log('Sname', $(script_name).attr('placeholder'));

    if(script_name == undefined || script_name == null || script_name.val() == undefined){
        console.log('Getting Div');
        script_name = parent_el.parent().find('.textedit-scriptsheet-funcname-spn');
        script_name = script_name.html();
    }
    console.log('script name', script_name);
    var script = script_edit_objs[script_name];
    script_inpt.append(script);
    script_inpt.keyup(function(e){
        var key_pressed = e.keycode || e.which;
        if(script_edit_objs.text_ctl_pressed && key_pressed == 13){
            if(script_edit_objs.text_ctl_pressed == true){
                on_edit_function_sbmt(script_inpt);
            }
            script_edit_objs.text_ctl_pressed = false;
        }else if(key_pressed == 17){
            script_edit_objs.text_ctl_pressed = true;
        }else{
            script_edit_objs.text_ctl_pressed = false;
        }
    });
    parent_el.html('');
    parent_el.append(script_inpt);
}


function on_edit_function_name_sbmt(elmnt){
    var function_name = $(elmnt);
    var project_name_inpt = $('.textedit-scriptsheet-scriptinpt-name');
    var new_name = project_name_inpt.val();
    var function_name = project_name_inpt.attr('placeholder');
    var script_sheet = $('.textedit-scriptsheet-title-span').html();
    if(new_name != undefined && new_name != null){
        var data = {
            'function_name': function_name,
            'new_name': new_name
        }

        $.ajax({
            type: 'POST',
            url: '/rename_script_function/',
            success: function(data){
                if(data.success == true){
                    setup_script_sheet_editor_div(script_sheet);
                }else{
                    console.log('Failed to Rename Script', data.msg);
                    alert(data.msg);
                }
            }
        }).fail(function(jqXHR, textStatus){
            console.log('Failed to Rename Function', textStatus);
            console.log(jqXHR);
            alert('Internal Error');
        });
    }else{
        console.log('Function Name Not Supplied');
        alert('Function Name Not Supplied');
    }
}


function edit_function_name(elmnt){
    var parent_el = $(elmnt);
    parent_el.removeAttr('onclick');
    var title = $(elmnt).html();
    var edit_title = $('<input>', {
                     class: 'textedit-scriptsheet-scriptinpt-name',
                     placeholder: title});
    edit_title.keyup(function(e){
        var key_pressed = e.keycode || e.which;
        if(key_pressed == 13){
            on_edit_function_name_sbmt(edit_title);
        }
    });
    parent_el.html('');
    parent_el.append(edit_title);
}


function submit_script(elmnt){
    var parent_el = $(elmnt).parent().parent();
    var script_sheet = $('.textedit-scriptsheet-title-span').html();
    var func_name = parent_el.find('.textedit-scriptsheet-name-inpt').val();
    var func_script = parent_el.find('.textedit-scriptsheet-scriptinpt-code').val();
    if(func_name != null && func_name.length > 0 && func_script != null && func_script.length > 0){
        var data = {
            'scriptsheet_name': script_sheet,
            'func_name': func_name,
            'func_script': func_script,
        }
        $.ajax({
            type: 'POST',
            url: '/submit_function/',
            data: data,
            success: function(data){
                if(data.success == false){
                    console.log('Failed to Submit Script')
                    alert(data.msg);
                }
                setup_script_sheet_editor_div(script_sheet);
            }
        }).fail(function(jqXHR, textStatus){
            console.log('Failed To Submit Script', textStatus);
            console.log(jqXHR);
            setup_script_sheet_editor_div(script_sheet);
        });
    }else{
        alert('Not All Inputs Present');
    }
}


function create_script_function(){
    var script_inpt_div = $('<div>', {
                      class: 'textedit-scriptsheet-scriptinpt-div'});
    var script_name = $('<div>', {
                      class: 'textedit-scriptsheet-scriptinpt-name-div'});
    script_inpt_div.append(script_name);
    var script_name_inpt = $('<input>', {
                      class: 'textedit-scriptsheet-name-inpt form-control',
                      placeholder: 'Function Name'});
    script_inpt_div.append(script_name_inpt);
    var script_inpt = $('<textarea>', {
                      class: 'textedit-scriptsheet-scriptinpt-code form-control',
                      placeholder: 'Function Code'});
    script_inpt_div.append(script_inpt);
    var script_inpt_sbmt_span = $('<span>',{
                                class: 'textedit-scriptsheet-sbmt-spn'});
    var script_inpt_sbmt_btn = $('<i>', {
                                class: 'textedit-scriptsheet-sbmt-btn glyphicon glyphicon-plus',
                                onclick: 'submit_script(this);'});
    script_inpt_sbmt_span.append(script_inpt_sbmt_btn);
    script_inpt_div.append(script_inpt_sbmt_span);
    $('.textedit-scriptsheet-edit-area-div').append(script_inpt_div);
}


function unload_script(elmnt){
    var parent_el = $(elmnt).parent().parent();
    var script_el = parent_el.find('.textedit-scriptsheet-scriptdiv');
    script_el.remove();
}


function load_script(elmnt){
    var parent_el = $(elmnt).parent().parent();
    var script_name = parent_el.find('.textedit-scriptsheet-funcname-spn').html();
    var script_el = $('<div>', {
                    class: 'textedit-scriptsheet-scriptdiv'});
    script_el.html(script_editor.func_dict[name]);
}


function setup_script_sheet_editor_div(script_name){
    var text_edit = $('.textedit-scriptsheet-div');
    if(text_edit != undefined){
        text_edit.remove();
    }

    var editor_div = $('.textedit-scriptsheet-div');
    if(editor_div != undefined && editor_div.html() != undefined){
        editor_div.remove();
    }

    var data = {
        'script_name': script_name,
    };

    $.ajax({
        type: "POST",
        url: '/load_script_sheet/',
        data: data,
        success: function(data){
            var edit_div = $('<div>', {
                            class: 'textedit-scriptsheet-div standard-grey-gradient'});
            var title = script_name;
            var funcs = data.functions;
            var title_div = $('<div>', {
                            class: 'textedit-scriptsheet-title-div'});
            var title_div_spn = $('<span>', {
                                class: 'textedit-scriptsheet-title-span'});
            title_div_spn.html(title);
            title_div.append(title_div_spn);
            var exit_btn_spn = $('<i>', {
                                class: 'textedit-scriptsheet-rem-btn fa fa-times',
                                onclick: 'close_script_editor();'});
            title_div.append(exit_btn_spn);
            edit_div.append(title_div);
            script_editor.func_dict = {};
            var edit_area = $('<div>', {
                            class: 'textedit-scriptsheet-edit-area-div'});

            if(funcs != undefined && funcs != null){
                for(var i = 0; i < funcs.length; i++){
                    var func_div = $('<div>', {
                           class: 'textedit-scriptsheet-func-div'});
                    var funco = funcs[i];
                    var name = funco.name;
                    var script = funco.script;
                    script = unescape_xml(script);
                    var fname_div = $('<div>', {
                                    class: 'textedit-scriptsheet-funcname'});
                    var fname_spn = $('<div>', {
                                    class: 'textedit-scriptsheet-funcname-spn',
                                    onclick: 'edit_function_name(this);'});
                    fname_spn.html(name);
                    fname_div.append(fname_spn);
                    var func_spn = $('<div>', {
                                        class: 'textedit-scriptsheet-funcscript-spn',
                                        onclick: 'edit_function_script(this);'});
                    script_edit_objs[name] = script;
                    var show_script = '';
                    if(script.length > 0){
                        show_script = unescape_xml(show_script);
                        show_script = script.split(";")[0].substr(0, 10)+'...';
                    }
                    func_spn.html(show_script);
                    fname_div.append(func_spn);
                    var del_func_spn= $('<div>', {
                                      class: 'textedit-scriptsheet-funcrem-spn'});
                    var del_func_btn = $('<i>', {
                                       class: 'textedit-scriptsheet-funcrem-btn fa fa-times',
                                       onclick: 'remove_function(this);'});
                    del_func_spn.append(del_func_btn);
                    fname_div.append(del_func_spn);
                    func_div.append(fname_div);
                    edit_area.append(func_div);
                    script_editor.func_dict[name] = script;
                }
            }
            edit_div.append(edit_area);
            var add_function_div = $('<div>', {
                                    class: 'textedit-scriptsheet-funcadd-div'});
            var add_function_btn = $('<i>', {
                                    class: 'textedit-scriptsheet-funcadd-btn glyphicon glyphicon-plus',
                                    onclick: 'create_script_function();'});
            add_function_div.append(add_function_btn);
            edit_div.append(add_function_div);
            edit_div.draggable();
            $('.editor').append(edit_div);
        }
    }).fail(function(jqXHR, textStatus){
        console.log('Failed to load Script Sheet', textStatus);
        console.log(jqXHR);
    });
}


function get_script_sheet_editor(elmnt){
    var script_name = $(elmnt).html();
    setup_script_sheet_editor_div(script_name);
}
