
function close_script_editor(elmnt){
    text_edit_objects.current_edited_script = null;
}


function edit_function(){

}


function edit_function_name(){

}


function submit_script(elmnt){
    var parent_el = $(elmnt).parent().parent();
    var func_name = parent_el.find('.textedit-scriptsheet-scriptinpt-name').val();
    var func_script = parent_el.find('.textedit-scriptsheet-scriptinpt-code').val();
    if(func_name != null && func_name.length > 0 && func_script != null && func_script.length > 0){
        var data = {
            'script_name': func_name,
            'script_code': func_script,
        }

        $.ajax({
            type: 'POST',
            url: '/submit_script/',
            data: data,
            success: function(data){

            }
        }).fail(function(jqXHR, textStatus){
            console.log('Failed To Submit Script', textStatus);
            console.log(jqXHR);
        });
    }else{
        alert('Not All Inputs Present');
    }
}


function get_add_function_inputs(){
    var script_inpt_div = $('<div>', {
                      class: 'textedit-scriptsheet-scriptinpt-div'});
    var script_name = $('<span>', {
                      class: 'textedit-scriptsheet-scriptinpt-name',
                      placeholder: 'Function Name'});
    script_inpt_div.append(script_name);
    var script_inpt = $('<textarea>', {
                      class: 'textedit-scriptsheet-scriptinpt-code',
                      placeholder: 'Function Code'});
    script_inpt_div.append(script_inpt);
    var script_inpt_sbmt_span = $('<span>',{
                                class: 'textedit-scriptsheet-sbmt-spn'});
    var script_inpt_sbmt_btn = $('<i>', {
                                class: 'textedit-scriptsheet-sbmt-btn glyphicon glyphicon-plus',
                                onclick: 'submit_script(this);'});
    script_inpt_sbmt_span.append(script_inpt_sbmt_btn);
    script_inpt_div.append(script_inpt_sbmt_span);

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


function get_script_sheet_editor(elmnt){
    var text_edit = $('.textedit-scriptsheet-div');
    if(text_edit != undefined){
        text_edit.remove();
    }

    var data = {};
    $.ajax({
        type: "POST",
        url: '/load_script_sheet/',
        data: data,
        success: function(data){
            console.log(data);
            var edit_div = $('<div>',{
                            class: 'textedit-scriptsheet-div'});
            var title = elmnt.html();
            var funcs = data.functions;
            script_editor.func_dict = {};
            var func_div = $('<div>', {
                           class: 'textedit-scriptsheet-func'});
            if(funcs != undefined && funcs != null){
                for(var i = 0; i < funcs.length; i++){
                    var funco = funcs[i];
                    var name = funco.name;
                    var script = funco.script;
                    var fname_div = $('<div>', {
                                    class: 'textedit-scriptsheet-funcname'});
                    var fname_spn = $('<span>', {
                                    class: 'textedit-scriptsheet-funcname-spn'});
                    fname_spn.html(name);
                    fname_div.append(fname_spn);
                    var edit_func_spn = $('<span>', {
                                        class: 'textedit-scriptsheet-funcedit-spn'});
                    var edit_func_btn = $('<i>', {
                                        class: 'textedit-scriptsheet-funcedit-btn glyphicon glyphicon-pencil'});
                    edit_func_spn.append(edit_func_btn);
                    fname-div.append(edit_func_spn);
                    var del_func_spn= $('<span>', {
                                      class: 'textedit-scriptsheet-funcrem-spn'});
                    var del_func_btn = $('<i>', {
                                       class: 'textedit-scriptsheet-funcrem-btn fa fa-times',
                                       onclick: 'remove_function(this);'});
                    del_func_spn.append(del_func_btn);
                    fname_div.append(del_func_spn);
                    func_div.append(fname_div);
                    script_editor.func_dict[name] = script;
                }
            }
            $('.editor').append(edit_div);
        }
    }).fail(function(jqXHR, textStatus){
        console.log('Failed to load Script Sheet', textStatus);
        console.log(jqXHR);
    });
}
