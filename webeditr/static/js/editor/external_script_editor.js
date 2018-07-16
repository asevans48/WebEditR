
function get_scriptsheet_editor_by_id(sheet_id){
    var data = {
        'stylesheet_id': sheet_id,
    }

    var text_edit = $('.textedit-stylesheet-div');
    if(text_edit != undefined){
        text_edit.remove();
    }

    $.ajax({
        type: "POST",
        url: '/get_scriptsheet_dict_by_id/',
        data: data,
        success: function(data){
            var edit_div = $('<div>', {
                    class: 'textedit-stylesheet-div standard-grey-gradient shadow'});
            var edit_title = get_stylesheet_editor_title_div(data.title);
            edit_div.append(edit_title);
            edit_div.append(attrs_edit_div);
            var add_class_btn = get_add_stylesheet_btns();
            edit_div.append(add_class_btn);
            edit_div.draggable();
            $('.editor').append(edit_div);
        }
    }).fail(function(jqXHR, textStatus){
        console.log('Failure', textStatus);
        console.log(jqXHR);
    });
}


function get_ext_script_sheet_editor(elmnt){
    var sheet_id = $(elmnt).attr('id');
    get_stylesheet_editor_by_id(sheet_id);
}
