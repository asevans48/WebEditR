
function submit_ext_script_edit(elmnt){
    var editor = $(elmnt).parent().parent();
    var old_name = $(elmnt).attr('name');
    var new_name = editor.find('.textedit-extscript-title-input').val();
    var url_inpt = editor.find('.textedit-extscript-url-inpt').val();
    var data = {
        'old_name': old_name,
        'new_name': new_name,
        'url_inpt': url_inpt,
    }

    $.ajax({
        type: 'POST',
        url: '/edit_ext_script/',
        data: data,
        success: function(data){
            if(data.success == false){
                console.log(data.msg);
            }
            remove_scriptsheet_editor(elmnt);
        }
    }).fail(function(jqXHR, textStatus){
        console.log('Failed to Edit Script', textStatus);
        console.log(jqXHR);
    }).then(reload_project());
}


function remove_scriptsheet_editor(elmnt){
    $(elmnt).parent().parent().remove();
}


function setup_ext_scriptsheet_editor(script_name, script_url){
    var editor_div = $('.textedit-extscript-editor');
    if(editor_div != undefined && editor_div.html() != undefined){
        editor_div.remove();
    }

    editor_div = $('<div>', {
                class: 'textedit-extscript-editor standard-grey-gradient shadow'});
    var editor_title = $('<div>', {
                        class: 'textedit-extscript-title-div'});
    var editor_inpt = $('<input>', {
                     class: 'form-control textedit-extscript-title-input'});

    editor_inpt.val(script_name);
    editor_title.append(editor_inpt);
    var rem_editor_btn = $('<i>', {
                         class: 'textedit-extscript-rem-btn fa fa-times',
                         onclick: 'remove_scriptsheet_editor(this);'});
    editor_title.append(rem_editor_btn);
    editor_div.append(editor_title);
    var url_div = $('<div>', {
                  class: 'textedit-extscript-url-div'});
    var url_inpt = $('<input>', {
                    class: 'textedit-extscript-url-inpt form-control'});
    url_inpt.val(script_url);
    url_div.append(url_inpt);
    editor_div.append(url_div);
    var editor_sbmt_div = $('<div>', {
                            class: 'textedit-extscript-sbmt-div'});
    var edit_sbmt_btn = $('<button>', {
                        class: 'textedit-extscript-sbmt-btn btn btn-primary',
                        name: script_name,
                        onclick: 'submit_ext_script_edit(this)'});
    edit_sbmt_btn.append('Submit');
    editor_sbmt_div.append(edit_sbmt_btn);
    editor_div.append(editor_sbmt_div);
    editor_div.draggable();
    $('.editor').append(editor_div);
}


function get_ext_script_sheet_editor(elmnt, script_name, url){
    setup_ext_scriptsheet_editor(script_name, url);
}
