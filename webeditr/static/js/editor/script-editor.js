
function close_script_editor(elmnt){
    text_edit_objects.current_edited_script = null;
}


function edit_function(){

}


function edit_function_name(){

}


function add_function(){

}


function get_scrip_by_func_name(func_name){

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
            var classes = data.classes;
            if(classes != undefined && classes != null){
                $(classes).each(function(index, class_obj){
                    var class_name = class_obj.name;
                    var attributes = class_obj.attributes;

                });
            }
            $('.editor').append(edit_div);
        }
    }).fail(function(jqXHR, textStatus){
        console.log('Failure', textStatus);
        console.log(jqXHR);
    });
}
