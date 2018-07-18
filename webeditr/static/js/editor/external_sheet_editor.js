
function submit_ext_style_edit(elmnt){
    var editor = $(elmnt).parent().parent();
    var old_name = $(elmnt).attr('name');
    var new_name = editor.find('.textedit-extsheet-title-input').val();
    var url_inpt = editor.find('.textedit-extsheet-url-inpt').val();
    var data = {
        'old_name': old_name,
        'new_name': new_name,
        'url_inpt': url_inpt,
    }
    console.log(data);
    $.ajax({
        type: 'POST',
        url: '/edit_ext_sheet/',
        data: data,
        success: function(data){
            if(data.success == false){
                console.log(data.msg);
            }
            remove_sheet_editor(elmnt);
        }
    }).fail(function(jqXHR, textStatus){
        console.log('Failed to Edit sheet', textStatus);
        console.log(jqXHR);
    });
}


function remove_sheet_editor(elmnt){
    $(elmnt).parent().parent().remove();
}


function setup_ext_stylesheet_editor(sheet_name, sheet_url){
    var editor_div = $('.textedit-extsheet-editor');
    if(editor_div != undefined && editor_div.html() != undefined){
        editor_div.remove();
    }

    editor_div = $('<div>', {
                class: 'textedit-extsheet-editor standard-grey-gradient shadow'});
    var editor_title = $('<div>', {
                        class: 'textedit-extsheet-title-div'});
    var editor_inpt = $('<input>', {
                     class: 'form-control textedit-extsheet-title-input'});

    editor_inpt.val(sheet_name);
    editor_title.append(editor_inpt);
    var rem_editor_btn = $('<i>', {
                         class: 'textedit-extsheet-rem-btn fa fa-times',
                         onclick: 'remove_sheet_editor(this);'});
    editor_title.append(rem_editor_btn);
    editor_div.append(editor_title);
    var url_div = $('<div>', {
                  class: 'textedit-extsheet-url-div'});
    var url_inpt = $('<input>', {
                    class: 'textedit-extsheet-url-inpt form-control'});
    url_inpt.val(sheet_url);
    url_div.append(url_inpt);
    editor_div.append(url_div);
    var editor_sbmt_div = $('<div>', {
                            class: 'textedit-extsheet-sbmt-div'});
    var edit_sbmt_btn = $('<button>', {
                        class: 'textedit-extsheet-sbmt-btn btn btn-primary',
                        name: sheet_name,
                        onclick: 'submit_ext_style_edit(this)'});
    edit_sbmt_btn.append('Submit');
    editor_sbmt_div.append(edit_sbmt_btn);
    editor_div.append(editor_sbmt_div);
    editor_div.draggable();
    $('.editor').append(editor_div);
}


function get_ext_style_sheet_editor(elmnt, sheet_name, url){
    setup_ext_stylesheet_editor(sheet_name, url);
}
