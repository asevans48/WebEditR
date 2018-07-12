
function close_script_editor(elmnt){
    text_edit_objects.current_edited_script = null;
}


function edit_function(){

}


function edit_function_name(){

}


function add_function(){

}


function load_script_by_func_name(func_name){
    script_editor
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
            if(funcs != undefined && funcs != null){
                for(var i = 0; i < funcs.length; i++){
                    var func_div = $('<div>', {
                                   class: 'textedit-scriptsheet-func'});
                    var funco = funcs[i];
                    var name = funco.name;
                    var script = funco.script;
                    var fname_div = $('<div>', {
                                    class: 'textedit-scriptsheet-funcname'});
                    var fname_spn = $('<div>', {
                                    class: 'textedit-scriptsheet-funcnamn-spn'});
                    fname_spn.html(name);
                    fname_div.append(fname_spn);
                    var del_func_spn= $('<div>', {
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
