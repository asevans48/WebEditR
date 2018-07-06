
function get_style_sheet_editor(elmnt){
    alert('Editing Style Sheet');

    $.ajax({
        type: "POST",
        url: '/add_new_page/',
        data: data,
        success: function(data){
            var edit_div = $('<div>',{
                            class: 'textedit-stylesheet-div'});
            var title = elmnt.html();

            $('.editor').append(edit_div);
        }
    }).fail(function(jqXHR, textStatus){
        console.log('Failure', textStatus);
        console.log(jqXHR);
    });
}


function sbmt_sheet_edit(){

}


function get_script_sheet_editor(elmnt){
    alert('Editing Script Sheet');
    $.ajax({
        type: "POST",
        url: '/add_new_page/',
        data: data,
        success: function(data){
            var edit_div = $('<div>',{
                            class: 'textedit-scriptsheet-div'});
            var title = elmnt.html();

            $('.editor').append(edit_div);
        }
    }).fail(function(jqXHR, textStatus){
        console.log('Failure', textStatus);
        console.log(jqXHR);
    });
}


function sbmt_script_edit(elmnt){

}
